
export type ContractType = 
  | 'construction'
  | 'service_agreement'
  | 'lease'
  | 'nda'
  | 'maintenance'
  | 'insurance'
  | 'consulting'
  | 'supplier';

export type ContractStatus = 
  | 'draft'
  | 'under_review'
  | 'negotiation'
  | 'pending_signature'
  | 'executed'
  | 'expired'
  | 'terminated';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Contract {
  id: string;
  title: string;
  type: ContractType;
  status: ContractStatus;
  counterparty: string;
  value?: number;
  currency?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  project_id?: string;
  description?: string;
  ai_risk_score?: number;
  risk_level?: RiskLevel;
  document_url?: string;
  metadata?: Record<string, any>;
}

export interface ContractTemplate {
  id: string;
  name: string;
  type: ContractType;
  description: string;
  template_content: string;
  variables: TemplateVariable[];
  created_at: string;
  is_active: boolean;
}

export interface TemplateVariable {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  required: boolean;
  options?: string[];
  default_value?: string;
}

export interface ContractReview {
  id: string;
  contract_id: string;
  review_type: 'ai_analysis' | 'human_review';
  reviewer: string;
  findings: ReviewFinding[];
  overall_risk: RiskLevel;
  recommendations: string[];
  created_at: string;
}

export interface ReviewFinding {
  type: 'risk' | 'suggestion' | 'compliance' | 'missing_clause';
  severity: 'low' | 'medium' | 'high';
  section: string;
  description: string;
  suggested_fix?: string;
  line_number?: number;
}

export interface ContractDraftRequest {
  template_id: string;
  variables: Record<string, any>;
  additional_instructions?: string;
}

export interface ContractNegotiation {
  id: string;
  contract_id: string;
  round: number;
  changes: NegotiationChange[];
  summary: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  created_by: string;
}

export interface NegotiationChange {
  section: string;
  original_text: string;
  proposed_text: string;
  change_type: 'addition' | 'deletion' | 'modification';
  impact_assessment?: string;
  rationale?: string;
}
