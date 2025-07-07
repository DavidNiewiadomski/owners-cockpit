import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { S3Client, GetObjectCommand } from "https://esm.sh/@aws-sdk/client-s3";
import { getSignedUrl } from "https://esm.sh/@aws-sdk/s3-request-presigner";
import { corsHeaders } from "../_shared/cors.ts";

interface Database {
  public: {
    Tables: {
      bid_submissions: {
        Row: {
          id: string;
          rfp_id: string;
          vendor_submission_id: string;
          submission_type: "technical" | "commercial";
          s3_bucket: string;
          s3_key: string;
          s3_etag: string;
          file_name: string;
          file_size: number;
          sealed: boolean;
          sealed_at: string;
          upload_completed_at: string;
          opened_at?: string;
          opened_by?: string;
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
    
    // Extract submission ID from path: /functions/v1/bid-download/{submissionId}
    const submissionId = pathSegments[3];

    if (!submissionId) {
      return new Response(
        JSON.stringify({ error: "Submission ID not provided" }),
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
    const isRfpAdmin = roles.includes("RFP_ADMIN");

    if (!isRfpAdmin) {
      return new Response(
        JSON.stringify({ error: "Insufficient permissions. Only RFP_ADMIN can access bid submissions." }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get bid submission details
    const { data: submission, error: submissionError } = await supabase
      .from("bid_submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (submissionError || !submission) {
      return new Response(
        JSON.stringify({ error: "Bid submission not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get RFP details to check deadline
    const { data: rfp, error: rfpError } = await supabase
      .from("rfp")
      .select("*")
      .eq("id", submission.rfp_id)
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

    // EDGE RULE: Block GET until now > proposal_due
    const proposalDue = new Date(rfp.proposal_due);
    const now = new Date();

    if (now <= proposalDue) {
      return new Response(
        JSON.stringify({ 
          error: "Access denied. Bid submissions cannot be accessed until after the proposal deadline.",
          proposal_due: rfp.proposal_due,
          current_time: now.toISOString(),
          time_remaining: Math.ceil((proposalDue.getTime() - now.getTime()) / (1000 * 60)) + " minutes"
        }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check if submission is properly sealed
    if (!submission.sealed) {
      return new Response(
        JSON.stringify({ error: "Submission is not sealed and cannot be accessed" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Generate presigned URL for download
    const command = new GetObjectCommand({
      Bucket: submission.s3_bucket,
      Key: submission.s3_key,
    });

    const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Log the access (mark as opened if first time)
    if (!submission.opened_at) {
      const { error: updateError } = await supabase
        .from("bid_submissions")
        .update({
          opened_at: now.toISOString(),
          opened_by: user.id,
        })
        .eq("id", submissionId);

      if (updateError) {
        console.error("Error updating opened status:", updateError);
      }

      // Log the opening action
      await supabase.rpc('log_submission_access', {
        p_submission_id: submissionId,
        p_action: 'opened',
        p_user_id: user.id,
        p_metadata: {
          opened_at: now.toISOString(),
          user_agent: req.headers.get("user-agent") || "",
          ip_address: req.headers.get("x-forwarded-for") || req.headers.get("remote-addr") || "",
        }
      });
    } else {
      // Log subsequent access
      await supabase.rpc('log_submission_access', {
        p_submission_id: submissionId,
        p_action: 'accessed',
        p_user_id: user.id,
        p_metadata: {
          accessed_at: now.toISOString(),
          user_agent: req.headers.get("user-agent") || "",
          ip_address: req.headers.get("x-forwarded-for") || req.headers.get("remote-addr") || "",
        }
      });
    }

    // Return download URL and metadata
    return new Response(
      JSON.stringify({
        download_url: downloadUrl,
        expires_in: 3600,
        file_name: submission.file_name,
        file_size: submission.file_size,
        submission_type: submission.submission_type,
        uploaded_at: submission.upload_completed_at,
        sealed_at: submission.sealed_at,
        opened_at: submission.opened_at,
        s3_key: submission.s3_key,
        metadata: {
          rfp_id: submission.rfp_id,
          proposal_deadline_passed: true,
          deadline_passed_at: rfp.proposal_due,
          accessed_by: user.id,
          accessed_at: now.toISOString(),
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Bid download error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
