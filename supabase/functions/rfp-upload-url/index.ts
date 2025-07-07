import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { S3Client, PutObjectCommand } from "https://esm.sh/@aws-sdk/client-s3";
import { getSignedUrl } from "https://esm.sh/@aws-sdk/s3-request-presigner";
import { corsHeaders } from "../_shared/cors.ts";

interface Database {
  public: {
    Tables: {
      presigned_upload_tokens: {
        Row: {
          id: string;
          rfp_id: string;
          vendor_id: string;
          submission_type: "technical" | "commercial";
          s3_key: string;
          presigned_url: string;
          expires_at: string;
          used: boolean;
          created_by: string;
          ip_address?: string;
          user_agent?: string;
          created_at: string;
          used_at?: string;
        };
        Insert: {
          rfp_id: string;
          vendor_id: string;
          submission_type: "technical" | "commercial";
          s3_key: string;
          presigned_url: string;
          expires_at: string;
          created_by: string;
          ip_address?: string;
          user_agent?: string;
        };
      };
      vendor_submission: {
        Row: {
          id: string;
          rfp_id: string;
          vendor_id: string;
          vendor_name: string;
        };
      };
      rfp: {
        Row: {
          id: string;
          proposal_due: string;
          status: string;
        };
      };
      user_roles: {
        Row: {
          user_id: string;
          role: string;
        };
      };
    };
  };
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const awsAccessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID")!;
const awsSecretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY")!;
const awsRegion = Deno.env.get("AWS_REGION") || "us-east-1";
const s3BucketName = "oc-bids";

const s3Client = new S3Client({
  region: awsRegion,
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  },
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    
    // Extract RFP ID from path: /functions/v1/rfp-upload-url/{rfpId}/upload-url
    const rfpId = pathSegments[3]; // functions, v1, rfp-upload-url, {rfpId}
    const submissionType = url.searchParams.get("type") as "technical" | "commercial";
    const fileName = url.searchParams.get("filename") || "submission.pdf";

    if (!rfpId) {
      return new Response(
        JSON.stringify({ error: "RFP ID not provided" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!submissionType || !["technical", "commercial"].includes(submissionType)) {
      return new Response(
        JSON.stringify({ error: "Valid submission type (technical/commercial) required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

    // Get user from authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify JWT and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace("Bearer ", "")
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authorization token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check user roles
    const { data: userRoles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const roles = userRoles?.map(r => r.role) || [];
    const isVendor = roles.includes("RFP_VENDOR");
    const isAdmin = roles.includes("RFP_ADMIN");

    if (!isVendor && !isAdmin) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Retrieve RFP details
    const { data: rfp, error: rfpError } = await supabase
      .from("rfp")
      .select("*")
      .eq("id", rfpId)
      .single();

    if (rfpError || !rfp) {
      return new Response(
        JSON.stringify({ error: "RFP not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if RFP is in the right status for uploads
    if (!['published', 'open'].includes(rfp.status)) {
      return new Response(
        JSON.stringify({ error: "RFP is not open for submissions" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check proposal deadline
    if (new Date() > new Date(rfp.proposal_due)) {
      return new Response(
        JSON.stringify({ error: "Proposal due date has passed, upload not allowed" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // For vendors, check if they have a submission record
    if (isVendor) {
      const { data: vendorSubmissions } = await supabase
        .from("vendor_submission")
        .select("*")
        .eq("rfp_id", rfpId)
        .eq("vendor_id", user.id);

      if (!vendorSubmissions || vendorSubmissions.length === 0) {
        return new Response(
          JSON.stringify({ error: "No submission found for vendor" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Check for existing active upload token
    const { data: existingTokens } = await supabase
      .from("presigned_upload_tokens")
      .select("*")
      .eq("rfp_id", rfpId)
      .eq("vendor_id", user.id)
      .eq("submission_type", submissionType)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString());

    if (existingTokens && existingTokens.length > 0) {
      // Return existing valid token
      const token = existingTokens[0];
      return new Response(
        JSON.stringify({ 
          url: token.presigned_url, 
          expiry: Math.floor((new Date(token.expires_at).getTime() - Date.now()) / 1000),
          s3_key: token.s3_key
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate S3 key and presigned URL
    const s3Key = await generateBidS3Key(rfpId, user.id, submissionType, fileName);
    const command = new PutObjectCommand({
      Bucket: s3BucketName,
      Key: s3Key,
      ServerSideEncryption: "AES256",
      Tagging: `rfp_id=${rfpId}&vendor_id=${user.id}&submission_type=${submissionType}`,
      ContentType: "application/pdf", // Default, can be parameterized
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    const expiresAt = new Date(Date.now() + 3600 * 1000).toISOString();

    // Save the presigned URL details to the database
    const { error: insertError } = await supabase
      .from("presigned_upload_tokens")
      .insert({
        rfp_id: rfpId,
        vendor_id: user.id,
        submission_type: submissionType,
        s3_key: s3Key,
        presigned_url: uploadUrl,
        expires_at: expiresAt,
        created_by: user.id,
        ip_address: req.headers.get("x-forwarded-for") || req.headers.get("remote-addr") || "",
        user_agent: req.headers.get("user-agent") || "",
      });

    if (insertError) {
      console.error("Error saving upload token:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to create upload token" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        url: uploadUrl, 
        expiry: 3600,
        s3_key: s3Key,
        expires_at: expiresAt
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Upload URL generation error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function generateBidS3Key(
  rfpId: string,
  vendorId: string,
  submissionType: "technical" | "commercial",
  fileName: string
): Promise<string> {
  // This can call the previously created PostgreSQL function
  // For simplicity, generating directly in TypeScript here
  const timestamp = new Date().toISOString().split("T")[0];
  const sanitizedFilename = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `rfp/${rfpId}/${timestamp}/${vendorId}/${submissionType}/${sanitizedFilename}`;
}
