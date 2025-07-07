import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import type { 
  Company, 
  Contact, 
  Interaction, 
  Opportunity,
  CompanyType,
  CompanyStatus,
  InteractionType,
  OpportunityStage,
  CreateCompanyInput,
  CreateContactInput,
  CreateInteractionInput,
  CreateOpportunityInput
} from '../services/crmService';

export interface CRMTask {
  id: string;
  title: string;
  description?: string;
  company_id?: string;
  contact_id?: string;
  opportunity_id?: string;
  assignee_id: string;
  assignee_name?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled' | 'on_hold';
  due_date?: string;
  reminder_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  tags: string[];
  attachments: any[];
  created_by: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  metadata: Record<string, any>;
}

export interface CRMDocument {
  id: string;
  name: string;
  type: 'contract' | 'proposal' | 'invoice' | 'report' | 'presentation' | 'other';
  file_path?: string;
  file_size?: number;
  mime_type?: string;
  company_id?: string;
  contact_id?: string;
  opportunity_id?: string;
  version: number;
  tags: string[];
  description?: string;
  shared_with: string[];
  is_public: boolean;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export interface CRMCommunication {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'sms' | 'chat' | 'video_call';
  subject?: string;
  content?: string;
  preview?: string;
  company_id?: string;
  contact_id?: string;
  opportunity_id?: string;
  from_user_id: string;
  to_contact_ids: string[];
  cc_contact_ids: string[];
  bcc_contact_ids: string[];
  status: 'draft' | 'sent' | 'delivered' | 'read' | 'completed' | 'failed';
  scheduled_at?: string;
  sent_at?: string;
  delivered_at?: string;
  read_at?: string;
  duration_minutes?: number;
  attendee_count?: number;
  attachments: any[];
  thread_id?: string;
  in_reply_to?: string;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export interface CRMActivity {
  id: string;
  entity_type: string;
  entity_id: string;
  activity_type: 'created' | 'updated' | 'deleted' | 'viewed' | 'shared' | 'commented' | 'status_changed';
  description?: string;
  user_id: string;
  user_name?: string;
  changes: Record<string, any>;
  company_id?: string;
  created_at: string;
  metadata: Record<string, any>;
}

export interface CRMAnalytics {
  id: string;
  metric_date: string;
  metric_type: 'daily' | 'weekly' | 'monthly';
  total_companies: number;
  active_companies: number;
  total_contacts: number;
  total_opportunities: number;
  opportunities_by_stage: Record<string, number>;
  total_pipeline_value: number;
  weighted_pipeline_value: number;
  conversion_rate: number;
  avg_deal_size: number;
  win_rate: number;
  activities_count: number;
  tasks_completed: number;
  communications_sent: number;
  diversity_metrics: Record<string, any>;
  risk_metrics: Record<string, any>;
  performance_metrics: Record<string, any>;
  created_at: string;
}

export interface UseCRMReturn {
  // Companies
  companies: Company[];
  loadingCompanies: boolean;
  fetchCompanies: (filters?: { status?: CompanyStatus; type?: CompanyType; search?: string }) => Promise<void>;
  createCompany: (input: CreateCompanyInput) => Promise<Company | null>;
  updateCompany: (id: string, updates: Partial<CreateCompanyInput>) => Promise<Company | null>;
  deleteCompany: (id: string) => Promise<boolean>;
  
  // Contacts
  contacts: Contact[];
  loadingContacts: boolean;
  fetchContacts: (companyId?: string) => Promise<void>;
  createContact: (input: CreateContactInput) => Promise<Contact | null>;
  updateContact: (id: string, updates: Partial<CreateContactInput>) => Promise<Contact | null>;
  deleteContact: (id: string) => Promise<boolean>;
  
  // Interactions
  interactions: Interaction[];
  loadingInteractions: boolean;
  fetchInteractions: (filters?: { company_id?: string; contact_id?: string; type?: InteractionType }) => Promise<void>;
  createInteraction: (input: CreateInteractionInput) => Promise<Interaction | null>;
  
  // Opportunities
  opportunities: Opportunity[];
  loadingOpportunities: boolean;
  fetchOpportunities: (filters?: { company_id?: string; stage?: OpportunityStage }) => Promise<void>;
  createOpportunity: (input: CreateOpportunityInput) => Promise<Opportunity | null>;
  updateOpportunityStage: (id: string, stage: OpportunityStage) => Promise<Opportunity | null>;
  
  // Tasks
  tasks: CRMTask[];
  loadingTasks: boolean;
  fetchTasks: (filters?: { assignee_id?: string; company_id?: string; status?: string }) => Promise<void>;
  createTask: (task: Partial<CRMTask>) => Promise<CRMTask | null>;
  updateTask: (id: string, updates: Partial<CRMTask>) => Promise<CRMTask | null>;
  deleteTask: (id: string) => Promise<boolean>;
  
  // Documents
  documents: CRMDocument[];
  loadingDocuments: boolean;
  fetchDocuments: (filters?: { company_id?: string; type?: string }) => Promise<void>;
  uploadDocument: (file: File, metadata: Partial<CRMDocument>) => Promise<CRMDocument | null>;
  deleteDocument: (id: string) => Promise<boolean>;
  
  // Communications
  communications: CRMCommunication[];
  loadingCommunications: boolean;
  fetchCommunications: (filters?: { company_id?: string; type?: string; status?: string }) => Promise<void>;
  createCommunication: (comm: Partial<CRMCommunication>) => Promise<CRMCommunication | null>;
  updateCommunication: (id: string, updates: Partial<CRMCommunication>) => Promise<CRMCommunication | null>;
  
  // Activities
  activities: CRMActivity[];
  loadingActivities: boolean;
  fetchActivities: (entityType?: string, entityId?: string) => Promise<void>;
  
  // Analytics
  analytics: CRMAnalytics | null;
  loadingAnalytics: boolean;
  fetchAnalytics: (date: string, type: 'daily' | 'weekly' | 'monthly') => Promise<void>;
  
  // Search
  searchCompanies: (query: string) => Promise<Company[]>;
  searchContacts: (query: string) => Promise<Contact[]>;
  
  // Error handling
  error: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
}

export const useCRM = (): UseCRMReturn => {
  // Companies state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  
  // Contacts state
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  
  // Interactions state
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loadingInteractions, setLoadingInteractions] = useState(false);
  
  // Opportunities state
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loadingOpportunities, setLoadingOpportunities] = useState(false);
  
  // Tasks state
  const [tasks, setTasks] = useState<CRMTask[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);
  
  // Documents state
  const [documents, setDocuments] = useState<CRMDocument[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  
  // Communications state
  const [communications, setCommunications] = useState<CRMCommunication[]>([]);
  const [loadingCommunications, setLoadingCommunications] = useState(false);
  
  // Activities state
  const [activities, setActivities] = useState<CRMActivity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  
  // Analytics state
  const [analytics, setAnalytics] = useState<CRMAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Loading state for initial load
  const [loading, setLoading] = useState(true);

  // Company operations
  const fetchCompanies = useCallback(async (filters?: { status?: CompanyStatus; type?: CompanyType; search?: string }) => {
    setLoadingCompanies(true);
    setError(null);
    try {
      let query = supabase.from('company').select('*');
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      setCompanies(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch companies';
      setError(message);
      toast.error(message);
    } finally {
      setLoadingCompanies(false);
    }
  }, []);

  const createCompany = useCallback(async (input: CreateCompanyInput): Promise<Company | null> => {
    try {
      const { data, error } = await supabase
        .from('company')
        .insert(input)
        .select()
        .single();
      
      if (error) throw error;
      
      setCompanies(prev => [...prev, data]);
      toast.success('Company created successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create company';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  const updateCompany = useCallback(async (id: string, updates: Partial<CreateCompanyInput>): Promise<Company | null> => {
    try {
      const { data, error } = await supabase
        .from('company')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setCompanies(prev => prev.map(c => c.id === id ? data : c));
      toast.success('Company updated successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update company';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  const deleteCompany = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('company')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setCompanies(prev => prev.filter(c => c.id !== id));
      toast.success('Company deleted successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete company';
      setError(message);
      toast.error(message);
      return false;
    }
  }, []);

  // Contact operations
  const fetchContacts = useCallback(async (companyId?: string) => {
    setLoadingContacts(true);
    setError(null);
    try {
      let query = supabase.from('contact').select('*, company:company_id(*)');
      
      if (companyId) {
        query = query.eq('company_id', companyId);
      }
      
      const { data, error } = await query.order('name');
      
      if (error) throw error;
      setContacts(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch contacts';
      setError(message);
      toast.error(message);
    } finally {
      setLoadingContacts(false);
    }
  }, []);

  const createContact = useCallback(async (input: CreateContactInput): Promise<Contact | null> => {
    try {
      const { data, error } = await supabase
        .from('contact')
        .insert(input)
        .select('*, company:company_id(*)')
        .single();
      
      if (error) throw error;
      
      setContacts(prev => [...prev, data]);
      toast.success('Contact created successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create contact';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  const updateContact = useCallback(async (id: string, updates: Partial<CreateContactInput>): Promise<Contact | null> => {
    try {
      const { data, error } = await supabase
        .from('contact')
        .update(updates)
        .eq('id', id)
        .select('*, company:company_id(*)')
        .single();
      
      if (error) throw error;
      
      setContacts(prev => prev.map(c => c.id === id ? data : c));
      toast.success('Contact updated successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update contact';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  const deleteContact = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('contact')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setContacts(prev => prev.filter(c => c.id !== id));
      toast.success('Contact deleted successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete contact';
      setError(message);
      toast.error(message);
      return false;
    }
  }, []);

  // Interaction operations
  const fetchInteractions = useCallback(async (filters?: { company_id?: string; contact_id?: string; type?: InteractionType }) => {
    setLoadingInteractions(true);
    setError(null);
    try {
      let query = supabase.from('interaction').select('*, company:company_id(*), contact:contact_id(*)');
      
      if (filters?.company_id) {
        query = query.eq('company_id', filters.company_id);
      }
      if (filters?.contact_id) {
        query = query.eq('contact_id', filters.contact_id);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      
      const { data, error } = await query.order('date', { ascending: false });
      
      if (error) throw error;
      setInteractions(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch interactions';
      setError(message);
      toast.error(message);
    } finally {
      setLoadingInteractions(false);
    }
  }, []);

  const createInteraction = useCallback(async (input: CreateInteractionInput): Promise<Interaction | null> => {
    try {
      const { data, error } = await supabase
        .from('interaction')
        .insert(input)
        .select('*, company:company_id(*), contact:contact_id(*)')
        .single();
      
      if (error) throw error;
      
      setInteractions(prev => [data, ...prev]);
      toast.success('Interaction recorded successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create interaction';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  // Opportunity operations
  const fetchOpportunities = useCallback(async (filters?: { company_id?: string; stage?: OpportunityStage }) => {
    setLoadingOpportunities(true);
    setError(null);
    try {
      let query = supabase.from('opportunity').select('*, company:company_id(*)');
      
      if (filters?.company_id) {
        query = query.eq('company_id', filters.company_id);
      }
      if (filters?.stage) {
        query = query.eq('stage', filters.stage);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setOpportunities(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch opportunities';
      setError(message);
      toast.error(message);
    } finally {
      setLoadingOpportunities(false);
    }
  }, []);

  const createOpportunity = useCallback(async (input: CreateOpportunityInput): Promise<Opportunity | null> => {
    try {
      const { data, error } = await supabase
        .from('opportunity')
        .insert(input)
        .select('*, company:company_id(*)')
        .single();
      
      if (error) throw error;
      
      setOpportunities(prev => [data, ...prev]);
      toast.success('Opportunity created successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create opportunity';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  const updateOpportunityStage = useCallback(async (id: string, stage: OpportunityStage): Promise<Opportunity | null> => {
    try {
      const { data, error } = await supabase
        .from('opportunity')
        .update({ stage })
        .eq('id', id)
        .select('*, company:company_id(*)')
        .single();
      
      if (error) throw error;
      
      setOpportunities(prev => prev.map(o => o.id === id ? data : o));
      toast.success('Opportunity stage updated');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update opportunity';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  // Task operations
  const fetchTasks = useCallback(async (filters?: { assignee_id?: string; company_id?: string; status?: string }) => {
    setLoadingTasks(true);
    setError(null);
    try {
      let query = supabase.from('crm_tasks').select('*');
      
      if (filters?.assignee_id) {
        query = query.eq('assignee_id', filters.assignee_id);
      }
      if (filters?.company_id) {
        query = query.eq('company_id', filters.company_id);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      const { data, error } = await query.order('due_date', { ascending: true });
      
      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
      setError(message);
      toast.error(message);
    } finally {
      setLoadingTasks(false);
    }
  }, []);

  const createTask = useCallback(async (task: Partial<CRMTask>): Promise<CRMTask | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('crm_tasks')
        .insert({
          ...task,
          created_by: user.id,
          assignee_id: task.assignee_id || user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setTasks(prev => [...prev, data]);
      toast.success('Task created successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  const updateTask = useCallback(async (id: string, updates: Partial<CRMTask>): Promise<CRMTask | null> => {
    try {
      const updateData: any = { ...updates };
      
      // If marking as completed, set completed_at
      if (updates.status === 'completed' && !updateData.completed_at) {
        updateData.completed_at = new Date().toISOString();
      }
      
      const { data, error } = await supabase
        .from('crm_tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setTasks(prev => prev.map(t => t.id === id ? data : t));
      toast.success('Task updated successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  const deleteTask = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('crm_tasks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Task deleted successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      setError(message);
      toast.error(message);
      return false;
    }
  }, []);

  // Document operations
  const fetchDocuments = useCallback(async (filters?: { company_id?: string; type?: string }) => {
    setLoadingDocuments(true);
    setError(null);
    try {
      let query = supabase.from('crm_documents').select('*');
      
      if (filters?.company_id) {
        query = query.eq('company_id', filters.company_id);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setDocuments(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch documents';
      setError(message);
      toast.error(message);
    } finally {
      setLoadingDocuments(false);
    }
  }, []);

  const uploadDocument = useCallback(async (file: File, metadata: Partial<CRMDocument>): Promise<CRMDocument | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Upload file to storage
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `crm-documents/${user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Create document record
      const { data, error } = await supabase
        .from('crm_documents')
        .insert({
          ...metadata,
          name: file.name,
          file_path: filePath,
          file_size: file.size,
          mime_type: file.type,
          uploaded_by: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setDocuments(prev => [data, ...prev]);
      toast.success('Document uploaded successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload document';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  const deleteDocument = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Get document to delete file
      const { data: doc } = await supabase
        .from('crm_documents')
        .select('file_path')
        .eq('id', id)
        .single();
      
      // Delete from storage if exists
      if (doc?.file_path) {
        await supabase.storage
          .from('documents')
          .remove([doc.file_path]);
      }
      
      // Delete record
      const { error } = await supabase
        .from('crm_documents')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setDocuments(prev => prev.filter(d => d.id !== id));
      toast.success('Document deleted successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete document';
      setError(message);
      toast.error(message);
      return false;
    }
  }, []);

  // Communication operations
  const fetchCommunications = useCallback(async (filters?: { company_id?: string; type?: string; status?: string }) => {
    setLoadingCommunications(true);
    setError(null);
    try {
      let query = supabase.from('crm_communications').select('*');
      
      if (filters?.company_id) {
        query = query.eq('company_id', filters.company_id);
      }
      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setCommunications(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch communications';
      setError(message);
      toast.error(message);
    } finally {
      setLoadingCommunications(false);
    }
  }, []);

  const createCommunication = useCallback(async (comm: Partial<CRMCommunication>): Promise<CRMCommunication | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('crm_communications')
        .insert({
          ...comm,
          from_user_id: user.id
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setCommunications(prev => [data, ...prev]);
      toast.success('Communication created successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create communication';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  const updateCommunication = useCallback(async (id: string, updates: Partial<CRMCommunication>): Promise<CRMCommunication | null> => {
    try {
      const { data, error } = await supabase
        .from('crm_communications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setCommunications(prev => prev.map(c => c.id === id ? data : c));
      toast.success('Communication updated successfully');
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update communication';
      setError(message);
      toast.error(message);
      return null;
    }
  }, []);

  // Activity operations
  const fetchActivities = useCallback(async (entityType?: string, entityId?: string) => {
    setLoadingActivities(true);
    setError(null);
    try {
      let query = supabase.from('crm_activities').select('*');
      
      if (entityType && entityId) {
        query = query.eq('entity_type', entityType).eq('entity_id', entityId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false }).limit(100);
      
      if (error) throw error;
      setActivities(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch activities';
      setError(message);
      toast.error(message);
    } finally {
      setLoadingActivities(false);
    }
  }, []);

  // Analytics operations
  const fetchAnalytics = useCallback(async (date: string, type: 'daily' | 'weekly' | 'monthly') => {
    setLoadingAnalytics(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('crm_analytics')
        .select('*')
        .eq('metric_date', date)
        .eq('metric_type', type)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Generate analytics if not exists
        await supabase.rpc('generate_crm_analytics', { p_date: date, p_type: type });
        
        // Fetch again
        const { data: newData } = await supabase
          .from('crm_analytics')
          .select('*')
          .eq('metric_date', date)
          .eq('metric_type', type)
          .single();
        
        setAnalytics(newData);
      } else {
        setAnalytics(data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch analytics';
      setError(message);
      toast.error(message);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  // Search operations
  const searchCompanies = useCallback(async (query: string): Promise<Company[]> => {
    try {
      const { data, error } = await supabase
        .from('company')
        .select('*')
        .textSearch('name', query, {
          type: 'websearch',
          config: 'english'
        })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to search companies';
      toast.error(message);
      return [];
    }
  }, []);

  const searchContacts = useCallback(async (query: string): Promise<Contact[]> => {
    try {
      const { data, error } = await supabase
        .from('contact')
        .select('*, company:company_id(*)')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%`)
        .limit(20);
      
      if (error) throw error;
      return data || [];
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to search contacts';
      toast.error(message);
      return [];
    }
  }, []);

  // Refresh function
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchCompanies(),
        fetchOpportunities(),
        fetchTasks(),
        fetchAnalytics(new Date().toISOString().split('T')[0], 'daily')
      ]);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  }, [fetchCompanies, fetchOpportunities, fetchTasks, fetchAnalytics]);

  // Initial data load
  useEffect(() => {
    refresh();
  }, []);

  return {
    // Companies
    companies,
    loadingCompanies,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    
    // Contacts
    contacts,
    loadingContacts,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
    
    // Interactions
    interactions,
    loadingInteractions,
    fetchInteractions,
    createInteraction,
    
    // Opportunities
    opportunities,
    loadingOpportunities,
    fetchOpportunities,
    createOpportunity,
    updateOpportunityStage,
    
    // Tasks
    tasks,
    loadingTasks,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    
    // Documents
    documents,
    loadingDocuments,
    fetchDocuments,
    uploadDocument,
    deleteDocument,
    
    // Communications
    communications,
    loadingCommunications,
    fetchCommunications,
    createCommunication,
    updateCommunication,
    
    // Activities
    activities,
    loadingActivities,
    fetchActivities,
    
    // Analytics
    analytics,
    loadingAnalytics,
    fetchAnalytics,
    
    // Search
    searchCompanies,
    searchContacts,
    
    // Error handling
    error,
    loading,
    refresh
  };
};
