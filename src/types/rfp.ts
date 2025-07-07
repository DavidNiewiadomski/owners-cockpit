export type RfpStatus = 'draft' | 'open' | 'evaluation' | 'leveling_complete' | 'bafo_requested' | 'awarded' | 'cancelled';
export type VendorSubmissionStatus = 'pending' | 'opened' | 'scored' | 'bafo';

export interface Rfp {
  id: string;
  title: string;
  description?: string;
  project_id?: string;
  rfp_number: string;
  bid_type?: string;
  estimated_value?: number;
  currency?: string;
  status: RfpStatus;
  
  // Timeline
  published_at?: string;
  submission_deadline: string;
  evaluation_start?: string;
  evaluation_end?: string;
  award_date?: string;
  
  // Requirements
  bond_required?: boolean;
  bond_percentage?: number;
  insurance_required?: boolean;
  prequalification_required?: boolean;
  
  // Evaluation criteria
  technical_weight?: number;
  commercial_weight?: number;
  
  // Internal tracking
  created_by: string;
  assigned_evaluator?: string;
  
  created_at: string;
  updated_at: string;
}

export interface DatabaseTimelineEvent {
  id: string;
  rfp_id: string;
  name: string;
  deadline: string;
  mandatory: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScopeItem {
  id: string;
  rfp_id: string;
  csi_code: string | null;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Addendum {
  id: string;
  rfp_id: string;
  number: number;
  body: string | null;
  issued_at: string;
  created_at: string;
  updated_at: string;
}

export interface VendorSubmission {
  id: string;
  rfp_id: string;
  vendor_id: string;
  sealed: boolean;
  received_at: string;
  tech_score: number | null;
  cost_score: number | null;
  composite_score: number | null;
  status: VendorSubmissionStatus;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: string;
  rfp_id: string;
  vendor_id: string;
  body: string;
  answer: string | null;
  created_at: string;
  answered_at: string | null;
  updated_at: string;
}

export interface CreateRfpRequest {
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

export interface UpdateRfpRequest {
  title?: string;
  description?: string;
  project_id?: string;
  rfp_number?: string;
  bid_type?: string;
  estimated_value?: number;
  currency?: string;
  status?: RfpStatus;
  published_at?: string;
  submission_deadline?: string;
  evaluation_start?: string;
  evaluation_end?: string;
  award_date?: string;
  bond_required?: boolean;
  bond_percentage?: number;
  insurance_required?: boolean;
  prequalification_required?: boolean;
  technical_weight?: number;
  commercial_weight?: number;
  assigned_evaluator?: string;
}

export interface CreateTimelineEventRequest {
  rfp_id: string;
  name: string;
  deadline: string;
  mandatory?: boolean;
}

export interface CreateScopeItemRequest {
  rfp_id: string;
  csi_code?: string;
  description: string;
}

export interface CreateAddendumRequest {
  rfp_id: string;
  number: number;
  body?: string;
}

export interface CreateVendorSubmissionRequest {
  rfp_id: string;
  vendor_id: string;
}

export interface UpdateVendorSubmissionRequest {
  tech_score?: number;
  cost_score?: number;
  composite_score?: number;
  status?: VendorSubmissionStatus;
}

export interface CreateQuestionRequest {
  rfp_id: string;
  vendor_id: string;
  body: string;
}

export interface UpdateQuestionRequest {
  answer?: string;
  answered_at?: string;
}

export interface RfpWithDetails extends Rfp {
  timeline_events?: TimelineEvent[];
  scope_items?: ScopeItem[];
  addenda?: Addendum[];
  vendor_submissions?: VendorSubmission[];
  questions?: Question[];
}

// RFP Creation Wizard Types
export interface TimelineEvent {
  id: string;
  title: string;
  type: 'milestone' | 'task' | 'deadline';
  date: string;
  duration?: number;
  dependencies?: string[];
  status: 'pending' | 'active' | 'completed' | 'at-risk';
  description?: string;
  criticalPath?: boolean;
  assignee?: string;
}

export interface RFPSettings {
  defaultDurations: {
    vendorResponsePeriod: number;
    evaluationPeriod: number;
    clarificationPeriod: number;
    negotiationPeriod: number;
  };
  notifications: {
    emailEnabled: boolean;
    reminderDays: number;
    escalationThreshold: number;
  };
  workflow: {
    requireTechnicalReview: boolean;
    requireLegalReview: boolean;
    requireFinancialReview: boolean;
    minimumReviewers: number;
  };
  ai: {
    enabled: boolean;
    assistanceLevel: 'minimal' | 'moderate' | 'comprehensive';
    autoSuggest: boolean;
    languageModel: string;
  };
}

export interface BudgetLineItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  category: string;
}

export interface BudgetData {
  totalBudget: number;
  contingency: number;
  contingencyPercentage: number;
  lineItems: BudgetLineItem[];
  categories: {
    [key: string]: {
      budget: number;
      spent: number;
      remaining: number;
    };
  };
}
