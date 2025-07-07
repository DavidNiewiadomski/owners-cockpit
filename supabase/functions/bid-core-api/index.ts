import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

interface Database {
  public: {
    Tables: {
      bids: any;
      submissions: any;
      leveling: any;
      scorecards: any;
      bafo_requests: any;
      awards: any;
      bid_events: any;
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
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

    // Get user roles
    const { data: userRoles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);

    const roles = userRoles?.map(r => r.role) || [];
    const isBidAdmin = roles.includes("BID_ADMIN");
    const isBidReviewer = roles.includes("BID_REVIEWER");
    const isVendor = roles.includes("VENDOR");

    // Parse URL and method
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter(Boolean);
    const method = req.method;
    
    // Remove 'functions' and 'bid-core-api' from path
    const entityPath = pathSegments.slice(2);
    const entity = entityPath[0]; // bids, submissions, leveling, etc.
    const entityId = entityPath[1];
    const subResource = entityPath[2];

    // Route handlers
    switch (entity) {
      case "bids":
        return await handleBids(supabase, method, entityId, subResource, req, user, roles);
      
      case "submissions":
        return await handleSubmissions(supabase, method, entityId, req, user, roles);
      
      case "leveling":
        return await handleLeveling(supabase, method, entityId, req, user, roles);
      
      case "scorecards":
        return await handleScorecards(supabase, method, entityId, req, user, roles);
      
      case "bafo-requests":
        return await handleBafoRequests(supabase, method, entityId, req, user, roles);
      
      case "awards":
        return await handleAwards(supabase, method, entityId, req, user, roles);
      
      case "events":
        return await handleEvents(supabase, method, entityId, req, user, roles);
      
      default:
        return new Response(
          JSON.stringify({ error: "Invalid endpoint" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }

  } catch (error) {
    console.error("Bid Core API Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function handleBids(
  supabase: any,
  method: string,
  bidId: string | undefined,
  subResource: string | undefined,
  req: Request,
  user: any,
  roles: string[]
) {
  const isBidAdmin = roles.includes("BID_ADMIN");
  const isBidReviewer = roles.includes("BID_REVIEWER");
  const isVendor = roles.includes("VENDOR");

  switch (method) {
    case "GET":
      if (bidId) {
        // Get specific bid
        let query = supabase.from("bids").select("*").eq("id", bidId);
        
        // Vendors can only see open bids
        if (isVendor && !isBidAdmin && !isBidReviewer) {
          query = query.in("status", ["open", "evaluation"])
                      .not("published_at", "is", null);
        }
        
        const { data, error } = await query.single();
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        // List bids
        let query = supabase.from("bids").select("*").order("created_at", { ascending: false });
        
        // Vendors can only see open bids
        if (isVendor && !isBidAdmin && !isBidReviewer) {
          query = query.in("status", ["open", "evaluation"])
                      .not("published_at", "is", null)
                      .gte("submission_deadline", new Date().toISOString());
        }
        
        const { data, error } = await query;
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

    case "POST":
      // Only BID_ADMIN can create bids
      if (!isBidAdmin) {
        return new Response(
          JSON.stringify({ error: "Insufficient permissions" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const bidData = await req.json();
      bidData.created_by = user.id;
      
      const { data: newBid, error: createError } = await supabase
        .from("bids")
        .insert(bidData)
        .select()
        .single();

      if (createError) {
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(newBid), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    case "PATCH":
      // Only BID_ADMIN can update bids
      if (!isBidAdmin) {
        return new Response(
          JSON.stringify({ error: "Insufficient permissions" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const updateData = await req.json();
      
      const { data: updatedBid, error: updateError } = await supabase
        .from("bids")
        .update(updateData)
        .eq("id", bidId)
        .select()
        .single();

      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(updatedBid), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    case "DELETE":
      // Only BID_ADMIN can delete bids
      if (!isBidAdmin) {
        return new Response(
          JSON.stringify({ error: "Insufficient permissions" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error: deleteError } = await supabase
        .from("bids")
        .delete()
        .eq("id", bidId);

      if (deleteError) {
        return new Response(
          JSON.stringify({ error: deleteError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(null, { status: 204, headers: corsHeaders });

    default:
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
  }
}

async function handleSubmissions(
  supabase: any,
  method: string,
  submissionId: string | undefined,
  req: Request,
  user: any,
  roles: string[]
) {
  const isBidAdmin = roles.includes("BID_ADMIN");
  const isBidReviewer = roles.includes("BID_REVIEWER");
  const isVendor = roles.includes("VENDOR");

  switch (method) {
    case "GET":
      if (submissionId) {
        let query = supabase.from("submissions").select("*").eq("id", submissionId);
        
        // Vendors can only see their own submissions
        if (isVendor && !isBidAdmin && !isBidReviewer) {
          query = query.eq("vendor_id", user.id);
        }
        
        const { data, error } = await query.single();
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // Hide internal cost fields from vendors
        if (isVendor && !isBidAdmin && !isBidReviewer) {
          delete data.leveled_base_price;
          delete data.leveled_total_price;
          delete data.opened_by;
          delete data.opened_at;
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        const url = new URL(req.url);
        const bidId = url.searchParams.get("bid_id");
        
        let query = supabase.from("submissions").select("*").order("created_at", { ascending: false });
        
        if (bidId) {
          query = query.eq("bid_id", bidId);
        }
        
        // Vendors can only see their own submissions
        if (isVendor && !isBidAdmin && !isBidReviewer) {
          query = query.eq("vendor_id", user.id);
        }
        
        const { data, error } = await query;
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        // Hide internal cost fields from vendors
        if (isVendor && !isBidAdmin && !isBidReviewer) {
          data.forEach((submission: any) => {
            delete submission.leveled_base_price;
            delete submission.leveled_total_price;
            delete submission.opened_by;
            delete submission.opened_at;
          });
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

    case "POST":
      // Vendors can create submissions, others need BID_ADMIN
      if (!isVendor && !isBidAdmin) {
        return new Response(
          JSON.stringify({ error: "Insufficient permissions" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const submissionData = await req.json();
      
      // For vendors, set vendor_id to their user ID
      if (isVendor) {
        submissionData.vendor_id = user.id;
      }
      
      const { data: newSubmission, error: createError } = await supabase
        .from("submissions")
        .insert(submissionData)
        .select()
        .single();

      if (createError) {
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(newSubmission), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    case "PATCH":
      const updateData = await req.json();
      let updateQuery = supabase.from("submissions").update(updateData).eq("id", submissionId);
      
      // Vendors can only update their own submissions
      if (isVendor && !isBidAdmin && !isBidReviewer) {
        updateQuery = updateQuery.eq("vendor_id", user.id);
      }
      
      const { data: updatedSubmission, error: updateError } = await updateQuery.select().single();

      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(updatedSubmission), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    default:
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
  }
}

async function handleLeveling(
  supabase: any,
  method: string,
  levelingId: string | undefined,
  req: Request,
  user: any,
  roles: string[]
) {
  const isBidAdmin = roles.includes("BID_ADMIN");
  const isBidReviewer = roles.includes("BID_REVIEWER");

  // Only BID_ADMIN and BID_REVIEWER can access leveling
  if (!isBidAdmin && !isBidReviewer) {
    return new Response(
      JSON.stringify({ error: "Insufficient permissions" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  switch (method) {
    case "GET":
      if (levelingId) {
        const { data, error } = await supabase
          .from("leveling")
          .select("*")
          .eq("id", levelingId)
          .single();
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        const url = new URL(req.url);
        const bidId = url.searchParams.get("bid_id");
        
        let query = supabase.from("leveling").select("*").order("created_at", { ascending: false });
        
        if (bidId) {
          query = query.eq("bid_id", bidId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

    case "POST":
      const levelingData = await req.json();
      levelingData.leveled_by = user.id;
      
      const { data: newLeveling, error: createError } = await supabase
        .from("leveling")
        .insert(levelingData)
        .select()
        .single();

      if (createError) {
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(newLeveling), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    case "PATCH":
      const updateData = await req.json();
      
      const { data: updatedLeveling, error: updateError } = await supabase
        .from("leveling")
        .update(updateData)
        .eq("id", levelingId)
        .select()
        .single();

      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(updatedLeveling), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    default:
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
  }
}

async function handleScorecards(
  supabase: any,
  method: string,
  scorecardId: string | undefined,
  req: Request,
  user: any,
  roles: string[]
) {
  const isBidAdmin = roles.includes("BID_ADMIN");
  const isBidReviewer = roles.includes("BID_REVIEWER");

  // Only BID_ADMIN and BID_REVIEWER can access scorecards
  if (!isBidAdmin && !isBidReviewer) {
    return new Response(
      JSON.stringify({ error: "Insufficient permissions" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  switch (method) {
    case "GET":
      if (scorecardId) {
        const { data, error } = await supabase
          .from("scorecards")
          .select("*")
          .eq("id", scorecardId)
          .single();
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        const url = new URL(req.url);
        const bidId = url.searchParams.get("bid_id");
        const submissionId = url.searchParams.get("submission_id");
        
        let query = supabase.from("scorecards").select("*").order("created_at", { ascending: false });
        
        if (bidId) {
          query = query.eq("bid_id", bidId);
        }
        if (submissionId) {
          query = query.eq("submission_id", submissionId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

    case "POST":
      const scorecardData = await req.json();
      scorecardData.evaluator_id = user.id;
      
      const { data: newScorecard, error: createError } = await supabase
        .from("scorecards")
        .insert(scorecardData)
        .select()
        .single();

      if (createError) {
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(newScorecard), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    case "PATCH":
      const updateData = await req.json();
      
      const { data: updatedScorecard, error: updateError } = await supabase
        .from("scorecards")
        .update(updateData)
        .eq("id", scorecardId)
        .select()
        .single();

      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(updatedScorecard), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    default:
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
  }
}

async function handleBafoRequests(
  supabase: any,
  method: string,
  bafoId: string | undefined,
  req: Request,
  user: any,
  roles: string[]
) {
  const isBidAdmin = roles.includes("BID_ADMIN");
  const isBidReviewer = roles.includes("BID_REVIEWER");

  // Only BID_ADMIN can manage BAFO requests, BID_REVIEWER can read
  if (!isBidAdmin && !isBidReviewer) {
    return new Response(
      JSON.stringify({ error: "Insufficient permissions" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  switch (method) {
    case "GET":
      if (bafoId) {
        const { data, error } = await supabase
          .from("bafo_requests")
          .select("*")
          .eq("id", bafoId)
          .single();
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        const url = new URL(req.url);
        const bidId = url.searchParams.get("bid_id");
        
        let query = supabase.from("bafo_requests").select("*").order("created_at", { ascending: false });
        
        if (bidId) {
          query = query.eq("bid_id", bidId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

    case "POST":
      // Only BID_ADMIN can create BAFO requests
      if (!isBidAdmin) {
        return new Response(
          JSON.stringify({ error: "Insufficient permissions" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const bafoData = await req.json();
      bafoData.requested_by = user.id;
      
      const { data: newBafo, error: createError } = await supabase
        .from("bafo_requests")
        .insert(bafoData)
        .select()
        .single();

      if (createError) {
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(newBafo), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    case "PATCH":
      // Only BID_ADMIN can update BAFO requests
      if (!isBidAdmin) {
        return new Response(
          JSON.stringify({ error: "Insufficient permissions" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const updateData = await req.json();
      
      const { data: updatedBafo, error: updateError } = await supabase
        .from("bafo_requests")
        .update(updateData)
        .eq("id", bafoId)
        .select()
        .single();

      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(updatedBafo), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    default:
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
  }
}

async function handleAwards(
  supabase: any,
  method: string,
  awardId: string | undefined,
  req: Request,
  user: any,
  roles: string[]
) {
  const isBidAdmin = roles.includes("BID_ADMIN");
  const isBidReviewer = roles.includes("BID_REVIEWER");

  // Only BID_ADMIN can manage awards, BID_REVIEWER can read
  if (!isBidAdmin && !isBidReviewer) {
    return new Response(
      JSON.stringify({ error: "Insufficient permissions" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  switch (method) {
    case "GET":
      if (awardId) {
        const { data, error } = await supabase
          .from("awards")
          .select("*")
          .eq("id", awardId)
          .single();
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        const url = new URL(req.url);
        const bidId = url.searchParams.get("bid_id");
        
        let query = supabase.from("awards").select("*").order("created_at", { ascending: false });
        
        if (bidId) {
          query = query.eq("bid_id", bidId);
        }
        
        const { data, error } = await query;
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

    case "POST":
      // Only BID_ADMIN can create awards
      if (!isBidAdmin) {
        return new Response(
          JSON.stringify({ error: "Insufficient permissions" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const awardData = await req.json();
      awardData.recommended_by = user.id;
      
      const { data: newAward, error: createError } = await supabase
        .from("awards")
        .insert(awardData)
        .select()
        .single();

      if (createError) {
        return new Response(
          JSON.stringify({ error: createError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(newAward), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    case "PATCH":
      // Only BID_ADMIN can update awards
      if (!isBidAdmin) {
        return new Response(
          JSON.stringify({ error: "Insufficient permissions" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const updateData = await req.json();
      
      const { data: updatedAward, error: updateError } = await supabase
        .from("awards")
        .update(updateData)
        .eq("id", awardId)
        .select()
        .single();

      if (updateError) {
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(JSON.stringify(updatedAward), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    default:
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
  }
}

async function handleEvents(
  supabase: any,
  method: string,
  eventId: string | undefined,
  req: Request,
  user: any,
  roles: string[]
) {
  const isBidAdmin = roles.includes("BID_ADMIN");
  const isBidReviewer = roles.includes("BID_REVIEWER");

  // Only BID_ADMIN and BID_REVIEWER can read events
  if (!isBidAdmin && !isBidReviewer) {
    return new Response(
      JSON.stringify({ error: "Insufficient permissions" }),
      { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  switch (method) {
    case "GET":
      if (eventId) {
        const { data, error } = await supabase
          .from("bid_events")
          .select("*")
          .eq("id", eventId)
          .single();
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        const url = new URL(req.url);
        const bidId = url.searchParams.get("bid_id");
        const eventType = url.searchParams.get("event_type");
        
        let query = supabase.from("bid_events").select("*").order("occurred_at", { ascending: false });
        
        if (bidId) {
          query = query.eq("bid_id", bidId);
        }
        if (eventType) {
          query = query.eq("event_type", eventType);
        }
        
        const { data, error } = await query;
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        
        return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

    default:
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
  }
}
