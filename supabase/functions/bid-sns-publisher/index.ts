import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// AWS SDK for SNS (using a CDN compatible with Deno)
// Note: In production, you'd want to use proper AWS SDK for Deno
interface SNSMessage {
  TopicArn: string;
  Subject: string;
  Message: string;
  MessageAttributes?: {
    [key: string]: {
      DataType: string;
      StringValue: string;
    };
  };
}

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// AWS credentials from environment variables
const awsAccessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID");
const awsSecretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY");
const awsRegion = Deno.env.get("AWS_REGION") || "us-east-1";

// SNS Topic ARNs
const bidTopicArn = Deno.env.get("BID_SNS_TOPIC_ARN");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // This function can be called in two ways:
    // 1. Directly via HTTP request to publish a specific event
    // 2. Via database trigger/webhook when bid events are created

    const { event_type, bid_id, event_data } = await req.json();

    if (!event_type || !bid_id) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters: event_type, bid_id" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get bid details for context
    const { data: bid, error: bidError } = await supabase
      .from("bids")
      .select("*")
      .eq("id", bid_id)
      .single();

    if (bidError || !bid) {
      return new Response(
        JSON.stringify({ error: "Bid not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    let snsMessage: SNSMessage;
    let publishResult;

    switch (event_type) {
      case "bid.opened":
        snsMessage = await createBidOpenedMessage(bid, event_data);
        publishResult = await publishToSNS(snsMessage);
        break;

      case "bid.leveling.completed":
        // Get submission count and recommended count
        const { data: submissions } = await supabase
          .from("submissions")
          .select("id")
          .eq("bid_id", bid_id);

        const { data: leveling } = await supabase
          .from("leveling")
          .select("recommended_for_shortlist")
          .eq("bid_id", bid_id);

        const totalSubmissions = submissions?.length || 0;
        const recommendedSubmissions = leveling?.filter(l => l.recommended_for_shortlist).length || 0;

        snsMessage = await createLevelingCompletedMessage(bid, totalSubmissions, recommendedSubmissions);
        publishResult = await publishToSNS(snsMessage);
        break;

      case "bid.bafo.requested":
        if (!event_data.submission_id) {
          throw new Error("submission_id required for BAFO requested event");
        }

        const { data: submission } = await supabase
          .from("submissions")
          .select("vendor_name")
          .eq("id", event_data.submission_id)
          .single();

        const { data: bafoRequest } = await supabase
          .from("bafo_requests")
          .select("response_deadline, price_reduction_target")
          .eq("submission_id", event_data.submission_id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single();

        snsMessage = await createBafoRequestedMessage(
          bid, 
          event_data.submission_id, 
          submission?.vendor_name || "Unknown Vendor",
          bafoRequest?.response_deadline,
          bafoRequest?.price_reduction_target
        );
        publishResult = await publishToSNS(snsMessage);
        break;

      case "bid.award.issued":
        if (!event_data.award_id) {
          throw new Error("award_id required for award issued event");
        }

        const { data: award } = await supabase
          .from("awards")
          .select(`
            *,
            submissions!winning_submission_id(vendor_name)
          `)
          .eq("id", event_data.award_id)
          .single();

        snsMessage = await createAwardIssuedMessage(bid, award);
        publishResult = await publishToSNS(snsMessage);
        break;

      default:
        return new Response(
          JSON.stringify({ error: `Unsupported event type: ${event_type}` }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }

    // Log the publication to the database
    await supabase.from("bid_events").insert({
      bid_id,
      event_type: `${event_type}.sns_published`,
      description: `SNS message published for ${event_type}`,
      event_data: {
        sns_message_id: publishResult?.messageId,
        topic_arn: bidTopicArn,
        original_event_data: event_data
      }
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: publishResult?.messageId,
        event_type,
        bid_id 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("SNS Publisher Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function createBidOpenedMessage(bid: any, eventData: any): Promise<SNSMessage> {
  const message = {
    topic: "bid.opened",
    bid_id: bid.id,
    rfp_number: bid.rfp_number,
    title: bid.title,
    submission_deadline: bid.submission_deadline,
    estimated_value: bid.estimated_value,
    published_at: bid.published_at || new Date().toISOString(),
    project_id: bid.project_id,
    ...eventData
  };

  return {
    TopicArn: bidTopicArn!,
    Subject: `Bid Opened: ${bid.rfp_number} - ${bid.title}`,
    Message: JSON.stringify(message),
    MessageAttributes: {
      event_type: {
        DataType: "String",
        StringValue: "bid.opened"
      },
      bid_id: {
        DataType: "String",
        StringValue: bid.id
      },
      rfp_number: {
        DataType: "String",
        StringValue: bid.rfp_number
      }
    }
  };
}

async function createLevelingCompletedMessage(
  bid: any, 
  totalSubmissions: number, 
  recommendedSubmissions: number
): Promise<SNSMessage> {
  const message = {
    topic: "bid.leveling.completed",
    bid_id: bid.id,
    rfp_number: bid.rfp_number,
    title: bid.title,
    total_submissions: totalSubmissions,
    recommended_submissions: recommendedSubmissions,
    completed_at: new Date().toISOString()
  };

  return {
    TopicArn: bidTopicArn!,
    Subject: `Bid Leveling Complete: ${bid.rfp_number} - ${recommendedSubmissions}/${totalSubmissions} Recommended`,
    Message: JSON.stringify(message),
    MessageAttributes: {
      event_type: {
        DataType: "String",
        StringValue: "bid.leveling.completed"
      },
      bid_id: {
        DataType: "String",
        StringValue: bid.id
      },
      rfp_number: {
        DataType: "String",
        StringValue: bid.rfp_number
      },
      total_submissions: {
        DataType: "Number",
        StringValue: totalSubmissions.toString()
      },
      recommended_submissions: {
        DataType: "Number",
        StringValue: recommendedSubmissions.toString()
      }
    }
  };
}

async function createBafoRequestedMessage(
  bid: any,
  submissionId: string,
  vendorName: string,
  responseDeadline?: string,
  priceReductionTarget?: number
): Promise<SNSMessage> {
  const message = {
    topic: "bid.bafo.requested",
    bid_id: bid.id,
    submission_id: submissionId,
    vendor_name: vendorName,
    rfp_number: bid.rfp_number,
    title: bid.title,
    response_deadline: responseDeadline,
    price_reduction_target: priceReductionTarget,
    requested_at: new Date().toISOString()
  };

  return {
    TopicArn: bidTopicArn!,
    Subject: `BAFO Requested: ${bid.rfp_number} - ${vendorName}`,
    Message: JSON.stringify(message),
    MessageAttributes: {
      event_type: {
        DataType: "String",
        StringValue: "bid.bafo.requested"
      },
      bid_id: {
        DataType: "String",
        StringValue: bid.id
      },
      submission_id: {
        DataType: "String",
        StringValue: submissionId
      },
      vendor_name: {
        DataType: "String",
        StringValue: vendorName
      },
      rfp_number: {
        DataType: "String",
        StringValue: bid.rfp_number
      }
    }
  };
}

async function createAwardIssuedMessage(bid: any, award: any): Promise<SNSMessage> {
  const message = {
    topic: "bid.award.issued",
    bid_id: bid.id,
    award_id: award.id,
    winning_submission_id: award.winning_submission_id,
    vendor_name: award.submissions?.vendor_name || "Unknown Vendor",
    rfp_number: bid.rfp_number,
    title: bid.title,
    award_amount: award.award_amount,
    contract_number: award.contract_number,
    awarded_at: award.awarded_at || new Date().toISOString()
  };

  return {
    TopicArn: bidTopicArn!,
    Subject: `Contract Awarded: ${bid.rfp_number} - ${award.submissions?.vendor_name} ($${award.award_amount.toLocaleString()})`,
    Message: JSON.stringify(message),
    MessageAttributes: {
      event_type: {
        DataType: "String",
        StringValue: "bid.award.issued"
      },
      bid_id: {
        DataType: "String",
        StringValue: bid.id
      },
      award_id: {
        DataType: "String",
        StringValue: award.id
      },
      vendor_name: {
        DataType: "String",
        StringValue: award.submissions?.vendor_name || "Unknown Vendor"
      },
      award_amount: {
        DataType: "Number",
        StringValue: award.award_amount.toString()
      }
    }
  };
}

async function publishToSNS(message: SNSMessage): Promise<{ messageId: string }> {
  // Simple HTTP-based SNS publish using AWS Signature Version 4
  // Note: In production, you should use the official AWS SDK for Deno
  
  if (!awsAccessKeyId || !awsSecretAccessKey || !bidTopicArn) {
    console.warn("AWS credentials or SNS topic ARN not configured. Skipping SNS publish.");
    return { messageId: `mock-${Date.now()}` };
  }

  try {
    // For this demo, we'll just log the message and return a mock ID
    // In production, implement proper AWS SNS SDK integration
    console.log("Publishing SNS message:", JSON.stringify(message, null, 2));
    
    // Mock implementation
    const mockMessageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // TODO: Replace with actual AWS SNS publish call
    // Example using AWS SDK v3:
    /*
    import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
    
    const snsClient = new SNSClient({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });
    
    const command = new PublishCommand(message);
    const result = await snsClient.send(command);
    return { messageId: result.MessageId! };
    */
    
    return { messageId: mockMessageId };
    
  } catch (error) {
    console.error("Failed to publish SNS message:", error);
    throw new Error(`SNS publish failed: ${error.message}`);
  }
}
