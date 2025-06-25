/**
 * Core Object-Oriented UX (OOUX) Type System
 * 
 * This file defines the foundational object types that drive the entire platform's
 * user experience. Each object has consistent patterns for:
 * - Identity (what it is)
 * - State (current condition)
 * - Relationships (connections to other objects)
 * - Actions (what users can do with it)
 */

import { ReactNode } from 'react';

// ========================================
// FOUNDATIONAL TYPES
// ========================================

export type ObjectId = string;
export type Timestamp = Date | string;

export interface BaseObject {
  id: ObjectId;
  created_at: Timestamp;
  updated_at: Timestamp;
  created_by?: ObjectId;
  updated_by?: ObjectId;
}

export interface ObjectAction {
  id: string;
  label: string;
  icon: ReactNode;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost';
  permission?: string;
}

export interface ObjectMeta {
  title: string;
  subtitle?: string;
  description?: string;
  icon: ReactNode;
  status: ObjectStatus;
  priority?: ObjectPriority;
  tags?: string[];
}

export type ObjectStatus = 
  | 'active' 
  | 'inactive' 
  | 'pending' 
  | 'completed' 
  | 'cancelled' 
  | 'draft' 
  | 'archived';

export type ObjectPriority = 'low' | 'normal' | 'high' | 'urgent' | 'critical';

export type ProjectPhase = 
  | 'planning'
  | 'preconstruction' 
  | 'construction' 
  | 'closeout' 
  | 'facilities'
  | 'maintenance';

export type ProjectHealth = 'green' | 'yellow' | 'red' | 'unknown';

// ========================================
// PROJECT OBJECT (Master Container)
// ========================================

export interface ProjectObject extends BaseObject {
  // Identity
  name: string;
  description?: string;
  type: ProjectType;
  code?: string; // Project code/number
  
  // State
  phase: ProjectPhase;
  status: ProjectStatus;
  health: ProjectHealth;
  progress: number; // 0-100
  
  // Temporal
  start_date?: Timestamp;
  end_date?: Timestamp;
  estimated_completion?: Timestamp;
  
  // Location
  location?: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  
  // Financial
  budget?: {
    total: number;
    spent: number;
    remaining: number;
    currency: string;
  };
  
  // Relationships
  organization_id: ObjectId;
  owner_id: ObjectId;
  manager_id?: ObjectId;
  team_members: ObjectId[];
  
  // Nested Collections
  communications?: CommunicationObject[];
  documents?: DocumentObject[];
  action_items?: ActionItemObject[];
  contracts?: ContractObject[];
  
  // Metadata
  metadata?: Record<string, unknown>;
  
  // Object Actions
  actions: ProjectActions;
}

export type ProjectType = 
  | 'residential_single_family'
  | 'residential_multi_family'
  | 'commercial_office'
  | 'commercial_retail'
  | 'commercial_hospitality'
  | 'industrial_warehouse'
  | 'industrial_manufacturing'
  | 'mixed_use'
  | 'infrastructure'
  | 'institutional'
  | 'renovation'
  | 'tenant_improvement';

export type ProjectStatus = 
  | 'planning'
  | 'active'
  | 'on_hold'
  | 'completed'
  | 'cancelled'
  | 'archived';

export interface ProjectActions {
  // Primary Actions
  view: ObjectAction;
  edit: ObjectAction;
  
  // Secondary Actions
  archive: ObjectAction;
  duplicate: ObjectAction;
  export: ObjectAction;
  share: ObjectAction;
  
  // Workflow Actions
  changePhase: ObjectAction;
  updateStatus: ObjectAction;
  assignManager: ObjectAction;
  
  // Related Object Actions
  createCommunication: ObjectAction;
  uploadDocument: ObjectAction;
  createActionItem: ObjectAction;
  generateReport: ObjectAction;
  
  // Advanced Actions
  createTemplate: ObjectAction;
  scheduleReview: ObjectAction;
  requestApproval: ObjectAction;
}

// ========================================
// COMMUNICATION OBJECT (Content)
// ========================================

export interface CommunicationObject extends BaseObject {
  // Identity
  type: CommunicationType;
  title: string;
  subject?: string;
  
  // Content
  body?: string;
  summary?: string;
  transcript?: string;
  
  // Participants
  sender?: UserReference;
  recipients: UserReference[];
  participants: UserReference[];
  
  // Temporal
  message_timestamp: Timestamp;
  duration?: number; // in minutes for meetings/calls
  
  // Source
  provider: CommunicationProvider;
  external_id?: string;
  url?: string;
  
  // Classification
  priority: ObjectPriority;
  category?: CommunicationCategory;
  tags?: string[];
  
  // Relationships
  project_id: ObjectId;
  parent_id?: ObjectId; // For threaded conversations
  related_documents?: ObjectId[];
  related_action_items?: ObjectId[];
  
  // AI Processing
  ai_summary?: string;
  ai_action_items?: string[];
  ai_sentiment?: 'positive' | 'neutral' | 'negative';
  ai_urgency_score?: number; // 0-100
  
  // Metadata
  attachments?: AttachmentReference[];
  metadata?: Record<string, unknown>;
  
  // Object Actions
  actions: CommunicationActions;
}

export type CommunicationType = 
  | 'email'
  | 'meeting'
  | 'chat'
  | 'call'
  | 'video_call'
  | 'document_comment'
  | 'system_notification'
  | 'sms';

export type CommunicationProvider = 
  | 'teams'
  | 'outlook'
  | 'zoom'
  | 'google_meet'
  | 'slack'
  | 'whatsapp'
  | 'phone'
  | 'manual'
  | 'system';

export type CommunicationCategory = 
  | 'meeting'
  | 'status_update'
  | 'decision'
  | 'issue'
  | 'approval_request'
  | 'information'
  | 'urgent'
  | 'follow_up';

export interface CommunicationActions {
  // Primary Actions
  view: ObjectAction;
  reply: ObjectAction;
  
  // Secondary Actions
  forward: ObjectAction;
  archive: ObjectAction;
  delete: ObjectAction;
  
  // Content Actions
  summarize: ObjectAction;
  transcribe: ObjectAction;
  translate: ObjectAction;
  
  // Relationship Actions
  createActionItem: ObjectAction;
  linkToProject: ObjectAction;
  attachDocument: ObjectAction;
  
  // Workflow Actions
  markAsRead: ObjectAction;
  setPriority: ObjectAction;
  addTags: ObjectAction;
  
  // Advanced Actions
  scheduleFollowUp: ObjectAction;
  extractActionItems: ObjectAction;
  analyzeContractTerms: ObjectAction;
}

// ========================================
// USER OBJECT (Actor)
// ========================================

export interface UserObject extends BaseObject {
  // Identity
  name: string;
  email: string;
  username?: string;
  avatar_url?: string;
  
  // Role & Permissions
  primary_role: UserRole;
  secondary_roles?: UserRole[];
  permissions: Permission[];
  
  // Profile
  title?: string;
  department?: string;
  phone?: string;
  bio?: string;
  
  // Preferences
  preferences: UserPreferences;
  notification_settings: NotificationSettings;
  
  // Status
  status: UserStatus;
  last_active?: Timestamp;
  timezone?: string;
  
  // Relationships
  organization_id: ObjectId;
  managed_projects: ObjectId[];
  assigned_projects: ObjectId[];
  team_memberships: ObjectId[];
  
  // Activity
  recent_communications?: ObjectId[];
  recent_documents?: ObjectId[];
  pending_action_items?: ObjectId[];
  
  // Object Actions
  actions: UserActions;
}

export type UserRole = 
  | 'Executive'
  | 'Preconstruction'
  | 'Construction'
  | 'Facilities'
  | 'Sustainability'
  | 'Legal'
  | 'Finance'
  | 'Admin'
  | 'Viewer';

export type UserStatus = 
  | 'active'
  | 'away'
  | 'busy'
  | 'offline'
  | 'inactive'
  | 'suspended';

export interface Permission {
  resource: string;
  actions: string[];
  conditions?: Record<string, unknown>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  dashboard_layout?: Record<string, unknown>;
  default_project?: ObjectId;
  email_frequency: 'real_time' | 'daily' | 'weekly' | 'never';
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  in_app: boolean;
  sms: boolean;
  channels: {
    project_updates: boolean;
    action_items: boolean;
    communications: boolean;
    deadlines: boolean;
    approvals: boolean;
  };
}

export interface UserActions {
  // Profile Actions
  viewProfile: ObjectAction;
  editProfile: ObjectAction;
  changePassword: ObjectAction;
  
  // Role Actions
  switchRole: ObjectAction;
  managePermissions: ObjectAction;
  
  // Activity Actions
  viewActivity: ObjectAction;
  viewNotifications: ObjectAction;
  
  // Project Actions
  viewProjects: ObjectAction;
  createProject: ObjectAction;
  
  // Communication Actions
  sendMessage: ObjectAction;
  scheduleMeeting: ObjectAction;
  
  // System Actions
  exportData: ObjectAction;
  configureIntegrations: ObjectAction;
}

// ========================================
// DOCUMENT OBJECT (Content)
// ========================================

export interface DocumentObject extends BaseObject {
  // Identity
  name: string;
  description?: string;
  type: DocumentType;
  file_extension?: string;
  
  // File Properties
  size: number; // in bytes
  mime_type: string;
  checksum?: string;
  
  // Storage
  url: string;
  thumbnail_url?: string;
  preview_url?: string;
  
  // Classification
  category: DocumentCategory;
  subcategory?: string;
  discipline?: string;
  phase?: ProjectPhase;
  
  // Version Control
  version: number;
  is_latest: boolean;
  parent_document_id?: ObjectId;
  version_history?: DocumentVersion[];
  
  // Review & Approval
  review_status: ReviewStatus;
  approved_by?: ObjectId;
  approved_at?: Timestamp;
  review_deadline?: Timestamp;
  
  // Relationships
  project_id: ObjectId;
  folder_id?: ObjectId;
  uploaded_by: ObjectId;
  
  // AI Processing
  ai_extracted_text?: string;
  ai_summary?: string;
  ai_key_terms?: string[];
  ai_compliance_check?: ComplianceResult;
  
  // Access Control
  access_level: AccessLevel;
  shared_with?: ObjectId[];
  
  // Metadata
  custom_fields?: Record<string, unknown>;
  tags?: string[];
  
  // Object Actions
  actions: DocumentActions;
}

export type DocumentType = 
  | 'drawing'
  | 'specification'
  | 'contract'
  | 'report'
  | 'photo'
  | 'video'
  | 'spreadsheet'
  | 'presentation'
  | 'pdf'
  | 'cad'
  | 'bim'
  | 'other';

export type DocumentCategory = 
  | 'architectural'
  | 'structural'
  | 'mechanical'
  | 'electrical'
  | 'plumbing'
  | 'civil'
  | 'landscape'
  | 'interior'
  | 'specifications'
  | 'contracts'
  | 'permits'
  | 'reports'
  | 'photos'
  | 'correspondence'
  | 'submittals'
  | 'rfis'
  | 'change_orders'
  | 'other';

export type ReviewStatus = 
  | 'pending'
  | 'in_review'
  | 'approved'
  | 'approved_with_comments'
  | 'rejected'
  | 'revision_required';

export type AccessLevel = 
  | 'public'
  | 'project_team'
  | 'managers_only'
  | 'owner_only'
  | 'confidential';

export interface DocumentVersion {
  version: number;
  uploaded_at: Timestamp;
  uploaded_by: ObjectId;
  changes: string;
  url: string;
}

export interface ComplianceResult {
  passed: boolean;
  issues: string[];
  recommendations: string[];
  score: number; // 0-100
}

export interface DocumentActions {
  // Primary Actions
  view: ObjectAction;
  download: ObjectAction;
  
  // Edit Actions
  edit: ObjectAction;
  uploadRevision: ObjectAction;
  
  // Review Actions
  review: ObjectAction;
  approve: ObjectAction;
  reject: ObjectAction;
  
  // Sharing Actions
  share: ObjectAction;
  setPermissions: ObjectAction;
  
  // Organization Actions
  move: ObjectAction;
  copy: ObjectAction;
  archive: ObjectAction;
  delete: ObjectAction;
  
  // AI Actions
  summarize: ObjectAction;
  extractData: ObjectAction;
  checkCompliance: ObjectAction;
  
  // Workflow Actions
  createRFI: ObjectAction;
  createActionItem: ObjectAction;
  linkToCommunication: ObjectAction;
}

// ========================================
// ACTION ITEM OBJECT (Task)
// ========================================

export interface ActionItemObject extends BaseObject {
  // Identity
  title: string;
  description?: string;
  type: ActionItemType;
  
  // Assignment
  assigned_to: ObjectId;
  assigned_by: ObjectId;
  
  // Status & Progress
  status: ActionItemStatus;
  priority: ObjectPriority;
  progress: number; // 0-100
  
  // Temporal
  due_date?: Timestamp;
  start_date?: Timestamp;
  completed_at?: Timestamp;
  estimated_hours?: number;
  actual_hours?: number;
  
  // Classification
  category: ActionItemCategory;
  discipline?: string;
  
  // Relationships
  project_id: ObjectId;
  parent_item_id?: ObjectId; // For sub-tasks
  related_communications?: ObjectId[];
  related_documents?: ObjectId[];
  blocking_items?: ObjectId[];
  blocked_by_items?: ObjectId[];
  
  // Approval Workflow
  requires_approval: boolean;
  approved_by?: ObjectId;
  approval_status?: ApprovalStatus;
  
  // Comments & Updates
  comments?: ActionItemComment[];
  status_updates?: ActionItemUpdate[];
  
  // Object Actions
  actions: ActionItemActions;
}

export type ActionItemType = 
  | 'task'
  | 'issue'
  | 'change_request'
  | 'approval'
  | 'review'
  | 'inspection'
  | 'delivery'
  | 'meeting'
  | 'milestone';

export type ActionItemStatus = 
  | 'open'
  | 'in_progress'
  | 'pending_review'
  | 'pending_approval'
  | 'completed'
  | 'cancelled'
  | 'on_hold';

export type ActionItemCategory = 
  | 'design'
  | 'construction'
  | 'procurement'
  | 'quality_control'
  | 'safety'
  | 'compliance'
  | 'coordination'
  | 'scheduling'
  | 'budget'
  | 'communication'
  | 'administrative';

export type ApprovalStatus = 
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_revision';

export interface ActionItemComment {
  id: ObjectId;
  author_id: ObjectId;
  content: string;
  created_at: Timestamp;
  attachments?: AttachmentReference[];
}

export interface ActionItemUpdate {
  id: ObjectId;
  author_id: ObjectId;
  old_status: ActionItemStatus;
  new_status: ActionItemStatus;
  comment?: string;
  created_at: Timestamp;
}

export interface ActionItemActions {
  // Primary Actions
  view: ObjectAction;
  edit: ObjectAction;
  
  // Status Actions
  start: ObjectAction;
  complete: ObjectAction;
  cancel: ObjectAction;
  reopen: ObjectAction;
  
  // Assignment Actions
  reassign: ObjectAction;
  addCollaborator: ObjectAction;
  
  // Progress Actions
  updateProgress: ObjectAction;
  logTime: ObjectAction;
  
  // Communication Actions
  addComment: ObjectAction;
  requestUpdate: ObjectAction;
  
  // Workflow Actions
  requestApproval: ObjectAction;
  approve: ObjectAction;
  reject: ObjectAction;
  
  // Organization Actions
  createSubTask: ObjectAction;
  linkDependency: ObjectAction;
  attachDocument: ObjectAction;
  
  // Scheduling Actions
  setDueDate: ObjectAction;
  scheduleReminder: ObjectAction;
}

// ========================================
// SHARED REFERENCES & UTILITY TYPES
// ========================================

export interface UserReference {
  id: ObjectId;
  name: string;
  email?: string;
  avatar_url?: string;
  role?: string;
}

export interface AttachmentReference {
  id: ObjectId;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface ObjectReference {
  id: ObjectId;
  type: 'project' | 'communication' | 'document' | 'action_item' | 'user';
  title: string;
  url?: string;
}

// ========================================
// SEARCH & FILTERING
// ========================================

export interface ObjectSearchParams {
  query?: string;
  object_types?: string[];
  project_id?: ObjectId;
  created_after?: Timestamp;
  created_before?: Timestamp;
  status?: string[];
  assigned_to?: ObjectId;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export interface ObjectSearchResult {
  objects: (ProjectObject | CommunicationObject | DocumentObject | ActionItemObject | UserObject)[];
  total_count: number;
  facets?: Record<string, number>;
}

// ========================================
// UI TEMPLATES
// ========================================

export interface ObjectCardProps {
  object: ProjectObject | CommunicationObject | DocumentObject | ActionItemObject | UserObject;
  variant?: 'default' | 'compact' | 'detailed';
  showActions?: boolean;
  showRelationships?: boolean;
  onClick?: () => void;
  onActionClick?: (action: ObjectAction) => void;
}

export interface ObjectDetailProps {
  object: ProjectObject | CommunicationObject | DocumentObject | ActionItemObject | UserObject;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onActionClick?: (action: ObjectAction) => void;
}

export interface ObjectFormProps {
  object?: Partial<ProjectObject | CommunicationObject | DocumentObject | ActionItemObject | UserObject>;
  mode: 'create' | 'edit';
  onSave: (object: any) => void;
  onCancel: () => void;
}
