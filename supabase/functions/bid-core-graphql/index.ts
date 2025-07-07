import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

// GraphQL schema definition
const typeDefs = `
  scalar DateTime
  scalar JSON

  enum BidStatus {
    DRAFT
    OPEN
    EVALUATION
    LEVELING_COMPLETE
    BAFO_REQUESTED
    AWARDED
    CANCELLED
  }

  enum SubmissionStatus {
    DRAFT
    SUBMITTED
    UNDER_REVIEW
    SCORED
    SHORTLISTED
    REJECTED
  }

  enum EvaluationPhase {
    TECHNICAL
    COMMERCIAL
    COMBINED
  }

  enum AwardStatus {
    PENDING
    AWARDED
    DECLINED
    CANCELLED
  }

  type Bid {
    id: ID!
    title: String!
    description: String
    project_id: String
    rfp_number: String!
    bid_type: String!
    estimated_value: Float
    currency: String!
    status: BidStatus!
    
    # Timeline
    published_at: DateTime
    submission_deadline: DateTime!
    evaluation_start: DateTime
    evaluation_end: DateTime
    award_date: DateTime
    
    # Requirements
    bond_required: Boolean!
    bond_percentage: Float
    insurance_required: Boolean!
    prequalification_required: Boolean!
    
    # Evaluation criteria
    technical_weight: Float!
    commercial_weight: Float!
    
    # Internal tracking
    created_by: String!
    assigned_evaluator: String
    
    created_at: DateTime!
    updated_at: DateTime!

    # Related data
    submissions: [Submission!]!
    events: [BidEvent!]!
    awards: [Award!]!
  }

  type Submission {
    id: ID!
    bid_id: String!
    vendor_id: String!
    vendor_name: String!
    vendor_contact_email: String
    vendor_contact_phone: String
    
    # Submission details
    status: SubmissionStatus!
    submitted_at: DateTime
    technical_proposal_url: String
    commercial_proposal_url: String
    
    # Pricing (may be hidden based on role)
    base_price: Float
    contingency_amount: Float
    total_price: Float
    price_sealed: Boolean!
    
    # Compliance
    bond_submitted: Boolean!
    insurance_submitted: Boolean!
    prequalification_passed: Boolean
    
    # Internal tracking
    received_by: String
    opened_by: String
    opened_at: DateTime
    
    created_at: DateTime!
    updated_at: DateTime!

    # Related data
    bid: Bid!
    leveling: Leveling
    scorecards: [Scorecard!]!
    bafo_requests: [BafoRequest!]!
  }

  type Leveling {
    id: ID!
    bid_id: String!
    submission_id: String!
    
    # Adjustments
    scope_clarifications: JSON!
    price_adjustments: JSON!
    technical_adjustments: JSON!
    
    # Leveled totals
    leveled_base_price: Float
    leveled_total_price: Float
    adjustment_rationale: String
    
    # Status
    is_complete: Boolean!
    leveled_by: String!
    leveled_at: DateTime
    
    # Recommendations
    recommended_for_shortlist: Boolean!
    recommendation_notes: String
    
    created_at: DateTime!
    updated_at: DateTime!

    # Related data
    bid: Bid!
    submission: Submission!
  }

  type Scorecard {
    id: ID!
    bid_id: String!
    submission_id: String!
    evaluator_id: String!
    evaluation_phase: EvaluationPhase!
    
    # Technical scoring
    technical_scores: JSON!
    technical_total: Float!
    technical_max_possible: Float!
    technical_percentage: Float!
    
    # Commercial scoring
    commercial_scores: JSON!
    commercial_total: Float!
    commercial_max_possible: Float!
    commercial_percentage: Float!
    
    # Combined scoring
    weighted_technical_score: Float!
    weighted_commercial_score: Float!
    composite_score: Float!
    
    # Notes
    strengths: String
    weaknesses: String
    recommendations: String
    
    # Status
    is_complete: Boolean!
    submitted_at: DateTime
    
    created_at: DateTime!
    updated_at: DateTime!

    # Related data
    bid: Bid!
    submission: Submission!
  }

  type BafoRequest {
    id: ID!
    bid_id: String!
    submission_id: String!
    
    # Request details
    request_letter: String!
    specific_requirements: String
    price_reduction_target: Float
    
    # Timeline
    requested_at: DateTime!
    response_deadline: DateTime!
    
    # Response
    vendor_response: String
    revised_price: Float
    responded_at: DateTime
    
    # Internal tracking
    requested_by: String!
    reviewed_by: String
    approved: Boolean
    
    created_at: DateTime!
    updated_at: DateTime!

    # Related data
    bid: Bid!
    submission: Submission!
  }

  type Award {
    id: ID!
    bid_id: String!
    winning_submission_id: String!
    
    # Award details
    award_amount: Float!
    award_justification: String!
    contract_duration_months: Int
    
    # Status
    status: AwardStatus!
    recommended_by: String!
    approved_by: String
    awarded_at: DateTime
    
    # Contract
    contract_number: String
    contract_start_date: String
    contract_end_date: String
    performance_bond_required: Boolean!
    
    # Vendor response
    vendor_accepted: Boolean
    vendor_acceptance_date: DateTime
    vendor_decline_reason: String
    
    created_at: DateTime!
    updated_at: DateTime!

    # Related data
    bid: Bid!
    winning_submission: Submission!
  }

  type BidEvent {
    id: ID!
    bid_id: String!
    submission_id: String
    
    # Event details
    event_type: String!
    event_data: JSON!
    description: String!
    
    # Actor
    triggered_by: String
    actor_role: String
    
    # Timing
    occurred_at: DateTime!
    
    # Metadata
    ip_address: String
    user_agent: String
    
    created_at: DateTime!

    # Related data
    bid: Bid!
    submission: Submission
  }

  # Input types
  input CreateBidInput {
    title: String!
    description: String
    project_id: String
    rfp_number: String!
    bid_type: String
    estimated_value: Float
    currency: String
    submission_deadline: DateTime!
    bond_required: Boolean
    bond_percentage: Float
    insurance_required: Boolean
    prequalification_required: Boolean
    technical_weight: Float
    commercial_weight: Float
  }

  input UpdateBidInput {
    title: String
    description: String
    status: BidStatus
    published_at: DateTime
    evaluation_start: DateTime
    evaluation_end: DateTime
    award_date: DateTime
    assigned_evaluator: String
    bond_required: Boolean
    bond_percentage: Float
    insurance_required: Boolean
    prequalification_required: Boolean
    technical_weight: Float
    commercial_weight: Float
  }

  input CreateSubmissionInput {
    bid_id: String!
    vendor_name: String!
    vendor_contact_email: String
    vendor_contact_phone: String
    technical_proposal_url: String
    commercial_proposal_url: String
    base_price: Float
    contingency_amount: Float
    bond_submitted: Boolean
    insurance_submitted: Boolean
  }

  input UpdateSubmissionInput {
    status: SubmissionStatus
    technical_proposal_url: String
    commercial_proposal_url: String
    base_price: Float
    contingency_amount: Float
    bond_submitted: Boolean
    insurance_submitted: Boolean
  }

  input CreateLevelingInput {
    bid_id: String!
    submission_id: String!
    scope_clarifications: JSON
    price_adjustments: JSON
    technical_adjustments: JSON
    leveled_base_price: Float
    leveled_total_price: Float
    adjustment_rationale: String
    recommended_for_shortlist: Boolean
    recommendation_notes: String
  }

  input UpdateLevelingInput {
    scope_clarifications: JSON
    price_adjustments: JSON
    technical_adjustments: JSON
    leveled_base_price: Float
    leveled_total_price: Float
    adjustment_rationale: String
    is_complete: Boolean
    recommended_for_shortlist: Boolean
    recommendation_notes: String
  }

  input CreateScorecardInput {
    bid_id: String!
    submission_id: String!
    evaluation_phase: EvaluationPhase!
    technical_scores: JSON
    commercial_scores: JSON
    strengths: String
    weaknesses: String
    recommendations: String
  }

  input UpdateScorecardInput {
    technical_scores: JSON
    commercial_scores: JSON
    strengths: String
    weaknesses: String
    recommendations: String
    is_complete: Boolean
  }

  input CreateBafoRequestInput {
    bid_id: String!
    submission_id: String!
    request_letter: String!
    specific_requirements: String
    price_reduction_target: Float
    response_deadline: DateTime!
  }

  input UpdateBafoRequestInput {
    vendor_response: String
    revised_price: Float
    approved: Boolean
  }

  input CreateAwardInput {
    bid_id: String!
    winning_submission_id: String!
    award_amount: Float!
    award_justification: String!
    contract_duration_months: Int
    contract_number: String
    contract_start_date: String
    contract_end_date: String
    performance_bond_required: Boolean
  }

  input UpdateAwardInput {
    status: AwardStatus
    approved_by: String
    awarded_at: DateTime
    vendor_accepted: Boolean
    vendor_acceptance_date: DateTime
    vendor_decline_reason: String
  }

  # Aggregate types
  type BidSummary {
    total_bids: Int!
    active_bids: Int!
    completed_bids: Int!
    total_value: Float!
    average_submissions_per_bid: Float!
  }

  type SubmissionSummary {
    total_submissions: Int!
    submitted_count: Int!
    under_review_count: Int!
    scored_count: Int!
    shortlisted_count: Int!
    rejected_count: Int!
  }

  # Query type
  type Query {
    # Bids
    bid(id: ID!): Bid
    bids(status: BidStatus, limit: Int, offset: Int): [Bid!]!
    bidSummary: BidSummary!
    
    # Submissions
    submission(id: ID!): Submission
    submissions(bid_id: String, vendor_id: String, status: SubmissionStatus, limit: Int, offset: Int): [Submission!]!
    submissionSummary(bid_id: String): SubmissionSummary!
    
    # Leveling
    leveling(id: ID!): Leveling
    levelingByBid(bid_id: String!): [Leveling!]!
    
    # Scorecards
    scorecard(id: ID!): Scorecard
    scorecards(bid_id: String, submission_id: String, evaluator_id: String): [Scorecard!]!
    
    # BAFO Requests
    bafoRequest(id: ID!): BafoRequest
    bafoRequests(bid_id: String, submission_id: String): [BafoRequest!]!
    
    # Awards
    award(id: ID!): Award
    awards(bid_id: String, status: AwardStatus): [Award!]!
    
    # Events
    bidEvent(id: ID!): BidEvent
    bidEvents(bid_id: String, event_type: String, limit: Int, offset: Int): [BidEvent!]!
  }

  # Mutation type
  type Mutation {
    # Bids
    createBid(input: CreateBidInput!): Bid!
    updateBid(id: ID!, input: UpdateBidInput!): Bid!
    deleteBid(id: ID!): Boolean!
    
    # Submissions
    createSubmission(input: CreateSubmissionInput!): Submission!
    updateSubmission(id: ID!, input: UpdateSubmissionInput!): Submission!
    
    # Leveling
    createLeveling(input: CreateLevelingInput!): Leveling!
    updateLeveling(id: ID!, input: UpdateLevelingInput!): Leveling!
    
    # Scorecards
    createScorecard(input: CreateScorecardInput!): Scorecard!
    updateScorecard(id: ID!, input: UpdateScorecardInput!): Scorecard!
    
    # BAFO Requests
    createBafoRequest(input: CreateBafoRequestInput!): BafoRequest!
    updateBafoRequest(id: ID!, input: UpdateBafoRequestInput!): BafoRequest!
    
    # Awards
    createAward(input: CreateAwardInput!): Award!
    updateAward(id: ID!, input: UpdateAwardInput!): Award!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`;

// Simple GraphQL parser/executor (for demo purposes)
// In production, use a proper GraphQL library like graphql-deno
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
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

    // Parse GraphQL request
    const { query, variables, operationName } = await req.json();

    if (req.method === "GET") {
      // Handle introspection query or simple GET requests
      if (query === 'query IntrospectionQuery { __schema { types { name } } }') {
        return new Response(
          JSON.stringify({
            data: {
              __schema: {
                types: [
                  { name: "Bid" },
                  { name: "Submission" },
                  { name: "Leveling" },
                  { name: "Scorecard" },
                  { name: "BafoRequest" },
                  { name: "Award" },
                  { name: "BidEvent" }
                ]
              }
            }
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // Simple GraphQL query resolver
    const result = await executeGraphQLQuery(query, variables, supabase, user, roles);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("GraphQL Error:", error);
    return new Response(
      JSON.stringify({ 
        errors: [{ 
          message: error.message || "Internal server error",
          extensions: { code: "INTERNAL_ERROR" }
        }] 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function executeGraphQLQuery(
  query: string, 
  variables: any, 
  supabase: any, 
  user: any, 
  roles: string[]
) {
  const isBidAdmin = roles.includes("BID_ADMIN");
  const isBidReviewer = roles.includes("BID_REVIEWER");
  const isVendor = roles.includes("VENDOR");

  // Simple query parsing (for demo - use proper GraphQL parser in production)
  
  // Handle schema introspection
  if (query.includes("__schema") || query.includes("__type")) {
    return {
      data: {
        __schema: {
          types: typeDefs.match(/type \w+/g)?.map(t => ({ name: t.split(' ')[1] })) || []
        }
      }
    };
  }

  // Handle bid queries
  if (query.includes("query") && query.includes("bids")) {
    let bidQuery = supabase.from("bids").select("*").order("created_at", { ascending: false });
    
    // Apply role-based filtering
    if (isVendor && !isBidAdmin && !isBidReviewer) {
      bidQuery = bidQuery.in("status", ["open", "evaluation"])
                        .not("published_at", "is", null)
                        .gte("submission_deadline", new Date().toISOString());
    }

    const { data: bids, error } = await bidQuery;
    
    if (error) {
      return { errors: [{ message: error.message }] };
    }

    return { data: { bids } };
  }

  // Handle submission queries
  if (query.includes("query") && query.includes("submissions")) {
    let submissionQuery = supabase.from("submissions").select("*").order("created_at", { ascending: false });
    
    // Apply role-based filtering
    if (isVendor && !isBidAdmin && !isBidReviewer) {
      submissionQuery = submissionQuery.eq("vendor_id", user.id);
    }

    const { data: submissions, error } = await submissionQuery;
    
    if (error) {
      return { errors: [{ message: error.message }] };
    }

    // Hide internal cost fields from vendors
    if (isVendor && !isBidAdmin && !isBidReviewer) {
      submissions?.forEach((submission: any) => {
        delete submission.opened_by;
        delete submission.opened_at;
      });
    }

    return { data: { submissions } };
  }

  // Handle mutations
  if (query.includes("mutation")) {
    // createBid mutation
    if (query.includes("createBid")) {
      if (!isBidAdmin) {
        return { errors: [{ message: "Insufficient permissions" }] };
      }

      const bidData = { ...variables.input, created_by: user.id };
      const { data: newBid, error } = await supabase
        .from("bids")
        .insert(bidData)
        .select()
        .single();

      if (error) {
        return { errors: [{ message: error.message }] };
      }

      return { data: { createBid: newBid } };
    }

    // createSubmission mutation
    if (query.includes("createSubmission")) {
      if (!isVendor && !isBidAdmin) {
        return { errors: [{ message: "Insufficient permissions" }] };
      }

      const submissionData = { ...variables.input };
      if (isVendor) {
        submissionData.vendor_id = user.id;
      }

      const { data: newSubmission, error } = await supabase
        .from("submissions")
        .insert(submissionData)
        .select()
        .single();

      if (error) {
        return { errors: [{ message: error.message }] };
      }

      return { data: { createSubmission: newSubmission } };
    }

    // createLeveling mutation
    if (query.includes("createLeveling")) {
      if (!isBidAdmin && !isBidReviewer) {
        return { errors: [{ message: "Insufficient permissions" }] };
      }

      const levelingData = { ...variables.input, leveled_by: user.id };
      const { data: newLeveling, error } = await supabase
        .from("leveling")
        .insert(levelingData)
        .select()
        .single();

      if (error) {
        return { errors: [{ message: error.message }] };
      }

      return { data: { createLeveling: newLeveling } };
    }

    // createScorecard mutation
    if (query.includes("createScorecard")) {
      if (!isBidAdmin && !isBidReviewer) {
        return { errors: [{ message: "Insufficient permissions" }] };
      }

      const scorecardData = { ...variables.input, evaluator_id: user.id };
      const { data: newScorecard, error } = await supabase
        .from("scorecards")
        .insert(scorecardData)
        .select()
        .single();

      if (error) {
        return { errors: [{ message: error.message }] };
      }

      return { data: { createScorecard: newScorecard } };
    }
  }

  // Default response for unhandled queries
  return { 
    errors: [{ 
      message: "Query not implemented in this demo GraphQL resolver",
      extensions: { code: "NOT_IMPLEMENTED" }
    }] 
  };
}
