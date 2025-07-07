/**
 * Comprehensive Bid Analysis Type Definitions
 * Based on Excel bid leveling workbook requirements
 */

// Core project and RFP information
export interface BidProject {
  id: string;
  rfp_id: string;
  project_name: string;
  project_location: string;
  facility_id: string;
  total_budget: number;
  project_type: string;
  status: 'draft' | 'bidding' | 'evaluation' | 'awarded' | 'cancelled';
  bid_due_date: string;
  estimated_duration: number; // days
  created_at: string;
  updated_at: string;
}

// CSI Division and trade code structure
export interface CSIDivision {
  id: string;
  division_number: string; // e.g., "01", "02", "03"
  division_name: string; // e.g., "General Requirements", "Site Work"
  description: string;
}

export interface CSICode {
  id: string;
  division_id: string;
  code: string; // e.g., "01 00 00", "02 41 00"
  title: string;
  description: string;
}

// Bid line items structure
export interface BidLineItem {
  id: string;
  bid_project_id: string;
  csi_code_id: string;
  csi_code: string;
  item_number: string;
  description: string;
  specification_section: string;
  quantity: number;
  unit_of_measure: string;
  engineer_estimate: number;
  unit_price_estimate: number;
  category: string; // HVAC, Electrical, Plumbing, etc.
  subcategory?: string;
  notes?: string;
  is_allowance: boolean;
  is_alternate: boolean;
  is_unit_price: boolean;
  created_at: string;
  updated_at: string;
}

// Vendor/contractor information
export interface BidVendor {
  id: string;
  name: string;
  company_type: 'gc' | 'subcontractor' | 'supplier' | 'manufacturer';
  license_number?: string;
  bonding_capacity: number;
  insurance_limits: {
    general_liability: number;
    professional_liability: number;
    workers_comp: number;
    auto_liability: number;
  };
  certifications: string[];
  minority_owned: boolean;
  woman_owned: boolean;
  veteran_owned: boolean;
  small_business: boolean;
  contact_info: {
    primary_contact: string;
    email: string;
    phone: string;
    address: string;
  };
  performance_history: {
    projects_completed: number;
    avg_performance_rating: number;
    on_time_delivery_rate: number;
    budget_compliance_rate: number;
    safety_rating: number;
  };
  prequalification_status: 'approved' | 'pending' | 'rejected' | 'expired';
  prequalification_expiry?: string;
  created_at: string;
  updated_at: string;
}

// Individual vendor bid submissions
export interface VendorBidSubmission {
  id: string;
  bid_project_id: string;
  vendor_id: string;
  submission_date: string;
  total_base_bid: number;
  total_alternates: number;
  total_bid_amount: number;
  bid_bond_amount: number;
  performance_bond_rate: number;
  unit_price_schedule: boolean;
  exceptions_taken: number;
  clarifications_requested: number;
  compliance_status: 'compliant' | 'non_compliant' | 'conditional';
  compliance_notes?: string;
  submitted_documents: {
    bid_form: boolean;
    bond: boolean;
    insurance_cert: boolean;
    references: boolean;
    financial_statements: boolean;
    project_schedule: boolean;
  };
  created_at: string;
  updated_at: string;
}

// Detailed line item pricing from vendors
export interface VendorLineItemBid {
  id: string;
  vendor_submission_id: string;
  line_item_id: string;
  unit_price: number;
  total_price: number;
  is_alternate: boolean;
  is_no_bid: boolean;
  is_allowance: boolean;
  vendor_notes?: string;
  clarification_requested?: string;
  created_at: string;
}

// Bid analysis and statistics
export interface LineItemAnalysis {
  id: string;
  line_item_id: string;
  analysis_date: string;
  participating_vendors: number;
  responding_vendors: number;
  no_bid_count: number;
  
  // Price statistics
  low_bid: number;
  high_bid: number;
  average_bid: number;
  median_bid: number;
  standard_deviation: number;
  coefficient_variation: number;
  
  // Engineer's estimate comparison
  engineer_estimate: number;
  avg_vs_estimate_variance: number;
  median_vs_estimate_variance: number;
  
  // Outlier detection
  outlier_threshold: number;
  outlier_vendor_ids: string[];
  outlier_count: number;
  
  // Risk assessment
  price_volatility: 'low' | 'medium' | 'high';
  market_competitiveness: 'poor' | 'fair' | 'good' | 'excellent';
  recommendation: string;
  
  created_at: string;
  updated_at: string;
}

// Vendor scoring and evaluation
export interface VendorEvaluation {
  id: string;
  vendor_submission_id: string;
  evaluator_id: string;
  evaluation_date: string;
  
  // Technical scoring (0-100)
  technical_score: number;
  technical_criteria: {
    experience: number;
    personnel_qualifications: number;
    project_approach: number;
    schedule_feasibility: number;
    quality_plan: number;
    safety_plan: number;
  };
  
  // Commercial scoring (0-100)
  commercial_score: number;
  commercial_criteria: {
    price_competitiveness: number;
    financial_stability: number;
    bonding_capacity: number;
    insurance_adequacy: number;
    contract_terms: number;
  };
  
  // Compliance scoring
  compliance_score: number;
  compliance_items: {
    bid_form_complete: boolean;
    bonds_adequate: boolean;
    insurance_compliant: boolean;
    references_satisfactory: boolean;
    licensing_current: boolean;
    minority_certification: boolean;
  };
  
  // Overall evaluation
  composite_score: number;
  ranking: number;
  recommendation: 'award' | 'consider' | 'reject';
  evaluator_notes: string;
  
  created_at: string;
  updated_at: string;
}

// Bid leveling and adjustment records
export interface BidLevelingAdjustment {
  id: string;
  line_item_analysis_id: string;
  vendor_line_item_bid_id: string;
  adjustment_type: 'scope_clarification' | 'unit_price_correction' | 'quantity_adjustment' | 'alternate_inclusion' | 'other';
  original_amount: number;
  adjusted_amount: number;
  adjustment_reason: string;
  approved_by: string;
  approval_date: string;
  created_at: string;
}

// BAFO (Best and Final Offer) requests and responses
export interface BAFORequest {
  id: string;
  bid_project_id: string;
  vendor_ids: string[];
  request_date: string;
  response_due_date: string;
  scope_clarifications: string;
  price_adjustments_allowed: boolean;
  specific_items: string[];
  status: 'sent' | 'responses_pending' | 'completed' | 'cancelled';
  created_by: string;
  created_at: string;
}

export interface BAFOResponse {
  id: string;
  bafo_request_id: string;
  vendor_id: string;
  response_date: string;
  revised_total_bid: number;
  line_item_adjustments: {
    line_item_id: string;
    original_price: number;
    revised_price: number;
    justification: string;
  }[];
  additional_clarifications: string;
  acceptance_status: 'accepted' | 'declined' | 'conditional';
  created_at: string;
}

// Award recommendations and decisions
export interface AwardRecommendation {
  id: string;
  bid_project_id: string;
  recommended_vendor_id: string;
  recommendation_date: string;
  recommended_amount: number;
  
  // Justification
  technical_justification: string;
  commercial_justification: string;
  risk_assessment: string;
  
  // Alternative considerations
  second_choice_vendor_id?: string;
  second_choice_amount?: number;
  
  // Approval workflow
  prepared_by: string;
  reviewed_by?: string;
  approved_by?: string;
  approval_status: 'draft' | 'under_review' | 'approved' | 'rejected';
  approval_date?: string;
  approval_notes?: string;
  
  created_at: string;
  updated_at: string;
}

// Bid protest and dispute tracking
export interface BidProtest {
  id: string;
  bid_project_id: string;
  protesting_vendor_id: string;
  protest_date: string;
  protest_grounds: string[];
  description: string;
  requested_remedy: string;
  status: 'filed' | 'under_review' | 'upheld' | 'denied' | 'withdrawn';
  resolution_date?: string;
  resolution_summary?: string;
  impact_on_award: boolean;
  created_at: string;
  updated_at: string;
}

// Market analysis and benchmarking
export interface MarketAnalysis {
  id: string;
  csi_division_id: string;
  analysis_period_start: string;
  analysis_period_end: string;
  
  // Market conditions
  market_activity_level: 'low' | 'moderate' | 'high' | 'very_high';
  price_trend: 'declining' | 'stable' | 'increasing' | 'volatile';
  material_cost_index: number;
  labor_availability: 'abundant' | 'adequate' | 'tight' | 'critical';
  
  // Benchmarking data
  regional_price_index: number;
  historical_price_variance: number;
  seasonal_adjustments: number[];
  economic_indicators: {
    inflation_rate: number;
    unemployment_rate: number;
    construction_index: number;
  };
  
  created_at: string;
  updated_at: string;
}

// Document management for bid process
export interface BidDocument {
  id: string;
  bid_project_id: string;
  vendor_id?: string;
  document_type: 'rfp' | 'addendum' | 'bid_submission' | 'clarification' | 'evaluation' | 'award_letter' | 'contract';
  file_name: string;
  file_size: number;
  file_path: string;
  mime_type: string;
  version: string;
  upload_date: string;
  uploaded_by: string;
  access_level: 'public' | 'restricted' | 'confidential';
  retention_period: number; // days
  created_at: string;
}

// Analytics and reporting aggregations
export interface BidAnalyticsReport {
  id: string;
  report_type: 'project_summary' | 'vendor_performance' | 'market_analysis' | 'cost_comparison';
  report_period_start: string;
  report_period_end: string;
  parameters: Record<string, any>;
  generated_date: string;
  generated_by: string;
  file_path?: string;
  
  // Summary metrics
  summary_data: {
    total_projects: number;
    total_bids_received: number;
    average_bid_count: number;
    total_contract_value: number;
    average_savings_vs_estimate: number;
    vendor_participation_rate: number;
    compliance_rate: number;
  };
  
  created_at: string;
}

// Configuration and settings
export interface BidAnalysisSettings {
  id: string;
  organization_id: string;
  
  // Outlier detection settings
  outlier_detection_method: 'iqr' | 'standard_deviation' | 'modified_z_score';
  outlier_threshold: number;
  minimum_bids_for_analysis: number;
  
  // Evaluation weights
  technical_weight: number;
  commercial_weight: number;
  compliance_weight: number;
  
  // Approval thresholds
  approval_threshold_amount: number;
  dual_approval_threshold: number;
  
  // Notification settings
  notification_preferences: {
    bid_submission: boolean;
    evaluation_complete: boolean;
    award_recommendation: boolean;
    protest_filed: boolean;
  };
  
  created_at: string;
  updated_at: string;
}

// API response types
export interface BidAnalysisApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
  meta?: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
}

export interface BidAnalysisDashboardData {
  project: BidProject;
  line_items: BidLineItem[];
  vendors: BidVendor[];
  submissions: VendorBidSubmission[];
  line_item_bids: VendorLineItemBid[];
  analyses: LineItemAnalysis[];
  evaluations: VendorEvaluation[];
  adjustments: BidLevelingAdjustment[];
  settings: BidAnalysisSettings;
}

// Filter and search interfaces
export interface BidAnalysisFilters {
  vendor_ids?: string[];
  csi_codes?: string[];
  price_range?: [number, number];
  compliance_status?: string[];
  outliers_only?: boolean;
  date_range?: [string, string];
}

export interface BidAnalysisSort {
  field: string;
  direction: 'asc' | 'desc';
}

// Export formats
export type ExportFormat = 'excel' | 'pdf' | 'csv' | 'json';

export interface ExportRequest {
  report_type: string;
  format: ExportFormat;
  filters?: BidAnalysisFilters;
  include_charts?: boolean;
  include_raw_data?: boolean;
}
