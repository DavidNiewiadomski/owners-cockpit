// TypeScript types for bid-core service

export type BidStatus = 
  | 'draft' 
  | 'open' 
  | 'evaluation' 
  | 'leveling_complete' 
  | 'bafo_requested' 
  | 'awarded' 
  | 'cancelled';

export type SubmissionStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'scored' 
  | 'shortlisted' 
  | 'rejected';

export type EvaluationPhase = 'technical' | 'commercial' | 'combined';

export type AwardStatus = 'pending' | 'awarded' | 'declined' | 'cancelled';

export interface Bid {
  id: string;
  title: string;
  description?: string;
  project_id?: string;
  rfp_number: string;
  bid_type: string;
  estimated_value?: number;
  currency: string;
  status: BidStatus;
  
  // Timeline
  published_at?: string;
  submission_deadline: string;
  evaluation_start?: string;
  evaluation_end?: string;
  award_date?: string;
  
  // Requirements
  bond_required: boolean;
  bond_percentage?: number;
  insurance_required: boolean;
  prequalification_required: boolean;
  
  // Evaluation criteria
  technical_weight: number;
  commercial_weight: number;
  
  // Internal tracking
  created_by: string;
  assigned_evaluator?: string;
  
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  bid_id: string;
  vendor_id: string;
  vendor_name: string;
  vendor_contact_email?: string;
  vendor_contact_phone?: string;
  
  // Submission details
  status: SubmissionStatus;
  submitted_at?: string;
  technical_proposal_url?: string;
  commercial_proposal_url?: string;
  
  // Pricing (hidden from vendors until bid opening)
  base_price?: number;
  contingency_amount?: number;
  total_price?: number;
  price_sealed: boolean;
  
  // Compliance
  bond_submitted: boolean;
  insurance_submitted: boolean;
  prequalification_passed?: boolean;
  
  // Internal tracking
  received_by?: string;
  opened_by?: string;
  opened_at?: string;
  
  created_at: string;
  updated_at: string;
}

export interface Leveling {
  id: string;
  bid_id: string;
  submission_id: string;
  
  // Adjustments
  scope_clarifications: ScopeClarification[];
  price_adjustments: PriceAdjustment[];
  technical_adjustments: TechnicalAdjustment[];
  
  // Leveled totals
  leveled_base_price?: number;
  leveled_total_price?: number;
  adjustment_rationale?: string;
  
  // Status
  is_complete: boolean;
  leveled_by: string;
  leveled_at?: string;
  
  // Recommendations
  recommended_for_shortlist: boolean;
  recommendation_notes?: string;
  
  created_at: string;
  updated_at: string;
}

export interface ScopeClarification {
  item: string;
  clarification: string;
  impact: 'none' | 'cost_increase' | 'cost_decrease' | 'scope_change';
}

export interface PriceAdjustment {
  category: string;
  original_amount: number;
  adjusted_amount: number;
  reason: string;
}

export interface TechnicalAdjustment {
  criterion: string;
  adjustment_type: 'compliance' | 'specification' | 'methodology';
  description: string;
  impact_score: number;
}

export interface Scorecard {
  id: string;
  bid_id: string;
  submission_id: string;
  evaluator_id: string;
  evaluation_phase: EvaluationPhase;
  
  // Technical scoring
  technical_scores: Record<string, number>;
  technical_total: number;
  technical_max_possible: number;
  technical_percentage: number;
  
  // Commercial scoring
  commercial_scores: Record<string, number>;
  commercial_total: number;
  commercial_max_possible: number;
  commercial_percentage: number;
  
  // Combined scoring
  weighted_technical_score: number;
  weighted_commercial_score: number;
  composite_score: number;
  
  // Notes
  strengths?: string;
  weaknesses?: string;
  recommendations?: string;
  
  // Status
  is_complete: boolean;
  submitted_at?: string;
  
  created_at: string;
  updated_at: string;
}

export interface BafoRequest {
  id: string;
  bid_id: string;
  submission_id: string;
  
  // Request details
  request_letter: string;
  specific_requirements?: string;
  price_reduction_target?: number;
  
  // Timeline
  requested_at: string;
  response_deadline: string;
  
  // Response
  vendor_response?: string;
  revised_price?: number;
  responded_at?: string;
  
  // Internal tracking
  requested_by: string;
  reviewed_by?: string;
  approved?: boolean;
  
  created_at: string;
  updated_at: string;
}

export interface Award {
  id: string;
  bid_id: string;
  winning_submission_id: string;
  
  // Award details
  award_amount: number;
  award_justification: string;
  contract_duration_months?: number;
  
  // Status
  status: AwardStatus;
  recommended_by: string;
  approved_by?: string;
  awarded_at?: string;
  
  // Contract
  contract_number?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  performance_bond_required: boolean;
  
  // Vendor response
  vendor_accepted?: boolean;
  vendor_acceptance_date?: string;
  vendor_decline_reason?: string;
  
  created_at: string;
  updated_at: string;
}

export interface BidEvent {
  id: string;
  bid_id: string;
  submission_id?: string;
  
  // Event details
  event_type: string;
  event_data: Record<string, any>;
  description: string;
  
  // Actor
  triggered_by?: string;
  actor_role?: string;
  
  // Timing
  occurred_at: string;
  
  // Metadata
  ip_address?: string;
  user_agent?: string;
  
  created_at: string;
}

// API request/response types
export interface CreateBidRequest {
  title: string;
  description?: string;
  project_id?: string;
  rfp_number: string;
  bid_type?: string;
  estimated_value?: number;
  currency?: string;
  submission_deadline: string;
  bond_required?: boolean;
  bond_percentage?: number;
  insurance_required?: boolean;
  prequalification_required?: boolean;
  technical_weight?: number;
  commercial_weight?: number;
}

export interface UpdateBidRequest extends Partial<CreateBidRequest> {
  status?: BidStatus;
  published_at?: string;
  evaluation_start?: string;
  evaluation_end?: string;
  award_date?: string;
  assigned_evaluator?: string;
}

export interface CreateSubmissionRequest {
  bid_id: string;
  vendor_name: string;
  vendor_contact_email?: string;
  vendor_contact_phone?: string;
  technical_proposal_url?: string;
  commercial_proposal_url?: string;
  base_price?: number;
  contingency_amount?: number;
  bond_submitted?: boolean;
  insurance_submitted?: boolean;
}

export interface UpdateSubmissionRequest extends Partial<CreateSubmissionRequest> {
  status?: SubmissionStatus;
}

export interface CreateLevelingRequest {
  bid_id: string;
  submission_id: string;
  scope_clarifications?: ScopeClarification[];
  price_adjustments?: PriceAdjustment[];
  technical_adjustments?: TechnicalAdjustment[];
  leveled_base_price?: number;
  leveled_total_price?: number;
  adjustment_rationale?: string;
  recommended_for_shortlist?: boolean;
  recommendation_notes?: string;
}

export interface UpdateLevelingRequest extends Partial<CreateLevelingRequest> {
  is_complete?: boolean;
}

export interface CreateScorecardRequest {
  bid_id: string;
  submission_id: string;
  evaluation_phase: EvaluationPhase;
  technical_scores?: Record<string, number>;
  commercial_scores?: Record<string, number>;
  strengths?: string;
  weaknesses?: string;
  recommendations?: string;
}

export interface UpdateScorecardRequest extends Partial<CreateScorecardRequest> {
  is_complete?: boolean;
}

export interface CreateBafoRequest {
  bid_id: string;
  submission_id: string;
  request_letter: string;
  specific_requirements?: string;
  price_reduction_target?: number;
  response_deadline: string;
}

export interface UpdateBafoRequest extends Partial<CreateBafoRequest> {
  vendor_response?: string;
  revised_price?: number;
  approved?: boolean;
}

export interface CreateAwardRequest {
  bid_id: string;
  winning_submission_id: string;
  award_amount: number;
  award_justification: string;
  contract_duration_months?: number;
  contract_number?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  performance_bond_required?: boolean;
}

export interface UpdateAwardRequest extends Partial<CreateAwardRequest> {
  status?: AwardStatus;
  approved_by?: string;
  awarded_at?: string;
  vendor_accepted?: boolean;
  vendor_acceptance_date?: string;
  vendor_decline_reason?: string;
}

// Aggregated types for dashboard/reporting
export interface BidSummary {
  total_bids: number;
  active_bids: number;
  completed_bids: number;
  total_value: number;
  average_submissions_per_bid: number;
}

export interface SubmissionSummary {
  total_submissions: number;
  submitted_count: number;
  under_review_count: number;
  scored_count: number;
  shortlisted_count: number;
  rejected_count: number;
}

export interface EvaluationProgress {
  bid_id: string;
  bid_title: string;
  total_submissions: number;
  leveled_submissions: number;
  scored_submissions: number;
  completion_percentage: number;
}

// SNS Topic Event Types
export interface BidOpenedEvent {
  topic: 'bid.opened';
  bid_id: string;
  rfp_number: string;
  title: string;
  submission_deadline: string;
  estimated_value?: number;
}

export interface LevelingCompletedEvent {
  topic: 'bid.leveling.completed';
  bid_id: string;
  rfp_number: string;
  title: string;
  total_submissions: number;
  recommended_submissions: number;
}

export interface BafoRequestedEvent {
  topic: 'bid.bafo.requested';
  bid_id: string;
  submission_id: string;
  vendor_name: string;
  response_deadline: string;
  price_reduction_target?: number;
}

export interface AwardIssuedEvent {
  topic: 'bid.award.issued';
  bid_id: string;
  award_id: string;
  winning_submission_id: string;
  vendor_name: string;
  award_amount: number;
  contract_number?: string;
}

export type SNSBidEvent = 
  | BidOpenedEvent 
  | LevelingCompletedEvent 
  | BafoRequestedEvent 
  | AwardIssuedEvent;
