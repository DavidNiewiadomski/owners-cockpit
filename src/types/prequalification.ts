/**
 * TypeScript types for Vendor Prequalification System
 */

export type PrequalStatus = 'pending' | 'approved' | 'expired' | 'denied';
export type InsuranceType = 'general_liability' | 'professional_liability' | 'workers_comp' | 'auto_liability' | 'umbrella' | 'cyber_liability';
export type LitigationStatus = 'active' | 'settled' | 'dismissed' | 'pending';
export type DocumentReviewStatus = 'approved' | 'rejected' | 'needs_revision';

export interface Company {
  id: string;
  name: string;
  duns_number?: string;
  tax_id?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  website?: string;
  primary_contact_name?: string;
  primary_contact_title?: string;
  primary_contact_email?: string;
  primary_contact_phone?: string;
  company_type?: string;
  specialty_codes?: string[];
  years_in_business?: number;
  employee_count?: number;
  annual_revenue?: number;
  bonding_capacity?: number;
  created_at: string;
  updated_at: string;
}

export interface Prequalification {
  id: string;
  company_id: string;
  status: PrequalStatus;
  expiry_date?: string;
  submitted_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  review_notes?: string;
  score?: number;
  renewal_required_at?: string;
  application_version?: string;
  requested_trades?: string[];
  project_size_limit?: number;
  geographic_limits?: string[];
  contact_name?: string;
  contact_title?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
  
  // Related data
  company?: Company;
  insurance_certificates?: InsuranceCertificate[];
  safety_metrics?: SafetyMetric[];
  litigation_cases?: Litigation[];
  project_references?: ProjectReference[];
  documents?: PrequalDocumentUpload[];
}

export interface InsuranceCertificate {
  id: string;
  prequal_id: string;
  insurance_type: InsuranceType;
  carrier: string;
  policy_number?: string;
  coverage_limit: number;
  deductible?: number;
  effective_date: string;
  expiry_date: string;
  file_url?: string;
  file_name?: string;
  file_size?: number;
  verified: boolean;
  verified_at?: string;
  verified_by?: string;
  additional_insured: boolean;
  waiver_of_subrogation: boolean;
  primary_and_noncontributory: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface SafetyMetric {
  id: string;
  company_id: string;
  period_year: number;
  period_quarter?: number;
  emr?: number;
  dart_rate?: number;
  trir?: number;
  ltir?: number;
  osha_incidents: number;
  near_misses: number;
  first_aid_cases: number;
  safety_training_hours?: number;
  certified_safety_personnel?: number;
  safety_certifications?: string[];
  total_work_hours?: number;
  number_of_employees?: number;
  number_of_projects?: number;
  verified: boolean;
  verified_at?: string;
  verified_by?: string;
  source?: string;
  created_at: string;
  updated_at: string;
}

export interface Litigation {
  id: string;
  company_id: string;
  case_number?: string;
  court_jurisdiction?: string;
  case_title?: string;
  plaintiff?: string;
  defendant?: string;
  status: LitigationStatus;
  case_type?: string;
  filed_date?: string;
  resolution_date?: string;
  claim_amount?: number;
  settlement_amount?: number;
  settled: boolean;
  description?: string;
  impact_on_operations?: string;
  lessons_learned?: string;
  notes?: string;
  related_project_name?: string;
  related_project_value?: number;
  resolution_type?: string;
  insurance_covered?: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinancialStatement {
  id: string;
  company_id: string;
  statement_year: number;
  statement_type: string;
  total_assets?: number;
  current_assets?: number;
  cash_and_equivalents?: number;
  accounts_receivable?: number;
  inventory?: number;
  total_liabilities?: number;
  current_liabilities?: number;
  accounts_payable?: number;
  short_term_debt?: number;
  long_term_debt?: number;
  stockholders_equity?: number;
  total_revenue?: number;
  gross_profit?: number;
  operating_income?: number;
  net_income?: number;
  ebitda?: number;
  current_ratio?: number;
  debt_to_equity_ratio?: number;
  profit_margin?: number;
  file_url?: string;
  file_name?: string;
  accountant_name?: string;
  accountant_firm?: string;
  verified: boolean;
  verified_at?: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectReference {
  id: string;
  company_id: string;
  project_name: string;
  project_description?: string;
  client_name: string;
  client_contact_name?: string;
  client_contact_title?: string;
  client_contact_email?: string;
  client_contact_phone?: string;
  project_value?: number;
  contract_start_date?: string;
  contract_end_date?: string;
  actual_completion_date?: string;
  project_location?: string;
  project_type?: string;
  trade_categories?: string[];
  completed_on_time?: boolean;
  completed_on_budget?: boolean;
  final_change_order_percentage?: number;
  quality_rating?: number;
  safety_incidents: number;
  reference_checked: boolean;
  reference_checked_at?: string;
  reference_checked_by?: string;
  reference_response?: string;
  reference_rating?: number;
  notable_challenges?: string;
  innovative_solutions?: string;
  lessons_learned?: string;
  created_at: string;
  updated_at: string;
}

export interface BondingCapacity {
  id: string;
  company_id: string;
  surety_company: string;
  surety_rating?: string;
  single_project_limit: number;
  aggregate_limit: number;
  available_capacity?: number;
  bid_bonds: boolean;
  performance_bonds: boolean;
  payment_bonds: boolean;
  maintenance_bonds: boolean;
  supply_bonds: boolean;
  current_backlog?: number;
  bonded_backlog?: number;
  agent_name?: string;
  agent_email?: string;
  agent_phone?: string;
  effective_date: string;
  expiry_date: string;
  letter_url?: string;
  letter_date?: string;
  verified: boolean;
  verified_at?: string;
  verified_by?: string;
  created_at: string;
  updated_at: string;
}

export interface PrequalScoringCriteria {
  id: string;
  category: string;
  criterion: string;
  description?: string;
  weight: number;
  min_score: number;
  max_score: number;
  excellent_threshold?: number;
  good_threshold?: number;
  acceptable_threshold?: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PrequalScore {
  id: string;
  prequal_id: string;
  criteria_id: string;
  score: number;
  notes?: string;
  scored_by?: string;
  scored_at: string;
  created_at: string;
  
  // Related data
  criteria?: PrequalScoringCriteria;
}

export interface PrequalDocumentRequirement {
  id: string;
  name: string;
  description?: string;
  required: boolean;
  category?: string;
  accepted_formats?: string[];
  max_file_size?: number;
  active: boolean;
  created_at: string;
}

export interface PrequalDocumentUpload {
  id: string;
  prequal_id: string;
  requirement_id?: string;
  file_name: string;
  original_file_name?: string;
  file_size?: number;
  file_type?: string;
  file_url: string;
  description?: string;
  uploaded_by?: string;
  reviewed: boolean;
  reviewed_at?: string;
  reviewed_by?: string;
  review_status?: DocumentReviewStatus;
  review_notes?: string;
  created_at: string;
  updated_at: string;
  
  // Related data
  requirement?: PrequalDocumentRequirement;
}

export interface PrequalSummary {
  id: string;
  company_id: string;
  company_name: string;
  status: PrequalStatus;
  score?: number;
  expiry_date?: string;
  submitted_at?: string;
  reviewed_at?: string;
  insurance_certificates_count: number;
  safety_metrics_count: number;
  litigation_cases_count: number;
  project_references_count: number;
  documents_uploaded: number;
  expiry_status: 'expired' | 'expiring_soon' | 'current';
}

// Request/Response types
export interface CreatePrequalRequest {
  company_id: string;
  requested_trades: string[];
  project_size_limit?: number;
  geographic_limits?: string[];
  contact_name: string;
  contact_title?: string;
  contact_email: string;
  contact_phone?: string;
}

export interface UpdatePrequalRequest {
  status?: PrequalStatus;
  expiry_date?: string;
  review_notes?: string;
  score?: number;
  renewal_required_at?: string;
  requested_trades?: string[];
  project_size_limit?: number;
  geographic_limits?: string[];
}

export interface SubmitPrequalRequest {
  insurance_certificates: Omit<InsuranceCertificate, 'id' | 'prequal_id' | 'created_at' | 'updated_at'>[];
  safety_metrics: Omit<SafetyMetric, 'id' | 'company_id' | 'created_at' | 'updated_at'>[];
  litigation_cases: Omit<Litigation, 'id' | 'company_id' | 'created_at' | 'updated_at'>[];
  project_references: Omit<ProjectReference, 'id' | 'company_id' | 'created_at' | 'updated_at'>[];
  financial_statements: Omit<FinancialStatement, 'id' | 'company_id' | 'created_at' | 'updated_at'>[];
  bonding_capacity: Omit<BondingCapacity, 'id' | 'company_id' | 'created_at' | 'updated_at'>[];
}

export interface PrequalReviewRequest {
  status: PrequalStatus;
  review_notes?: string;
  scores: Array<{
    criteria_id: string;
    score: number;
    notes?: string;
  }>;
}

export interface PrequalFilters {
  status?: PrequalStatus[];
  company_name?: string;
  expiry_status?: string[];
  score_range?: [number, number];
  submitted_after?: string;
  submitted_before?: string;
  trade_categories?: string[];
}

export interface PrequalSort {
  field: 'company_name' | 'status' | 'score' | 'submitted_at' | 'expiry_date';
  direction: 'asc' | 'desc';
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  message?: string;
}

// Form data types for frontend
export interface PrequalFormData {
  company_info: Partial<Company>;
  contact_info: {
    contact_name: string;
    contact_title?: string;
    contact_email: string;
    contact_phone?: string;
  };
  project_info: {
    requested_trades: string[];
    project_size_limit?: number;
    geographic_limits?: string[];
  };
  insurance_certificates: Partial<InsuranceCertificate>[];
  safety_metrics: Partial<SafetyMetric>[];
  litigation_cases: Partial<Litigation>[];
  project_references: Partial<ProjectReference>[];
  financial_statements: Partial<FinancialStatement>[];
  bonding_capacity: Partial<BondingCapacity>[];
  documents: File[];
}

// Dashboard data types
export interface PrequalDashboardData {
  summary: {
    total_applications: number;
    pending_review: number;
    approved: number;
    expired: number;
    approval_rate: number;
    average_score: number;
    documents_pending_review: number;
  };
  recent_applications: PrequalSummary[];
  expiring_soon: PrequalSummary[];
  high_scoring_vendors: PrequalSummary[];
  category_scores: Array<{
    category: string;
    average_score: number;
    count: number;
  }>;
}

export interface VendorPortalData {
  active_applications: Prequalification[];
  expiring_qualifications: Prequalification[];
  document_requirements: PrequalDocumentRequirement[];
  submitted_documents: PrequalDocumentUpload[];
  application_history: Prequalification[];
}
