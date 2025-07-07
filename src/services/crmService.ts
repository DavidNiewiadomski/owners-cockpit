import { supabase } from '../lib/supabase';

// Type definitions
export type CompanyType = 'sub' | 'gc' | 'supplier' | 'a/e';
export type CompanyStatus = 'active' | 'inactive';
export type InteractionType = 'call' | 'email' | 'meeting';
export type OpportunityStage = 'prospect' | 'shortlisted' | 'invited' | 'negotiation' | 'closed';

export interface Company {
  id: string;
  name: string;
  trade_codes: string[];
  type: CompanyType;
  status: CompanyStatus;
  risk_score: number;
  diversity_flags: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  company_id: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface Interaction {
  id: string;
  company_id: string;
  contact_id?: string;
  user_id: string;
  type: InteractionType;
  date: string;
  medium?: string;
  notes?: string;
  ai_summary?: string;
  created_at: string;
  updated_at: string;
  company?: Company;
  contact?: Contact;
}

export interface Opportunity {
  id: string;
  company_id: string;
  rfp_id?: string;
  stage: OpportunityStage;
  est_value?: number;
  next_action_date?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  company?: Company;
}

export interface CreateCompanyInput {
  name: string;
  trade_codes?: string[];
  type?: CompanyType;
  status?: CompanyStatus;
  risk_score?: number;
  diversity_flags?: Record<string, any>;
}

export interface CreateContactInput {
  company_id: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
}

export interface CreateInteractionInput {
  company_id: string;
  contact_id?: string;
  user_id: string;
  type: InteractionType;
  date: string;
  medium?: string;
  notes?: string;
  ai_summary?: string;
}

export interface CreateOpportunityInput {
  company_id: string;
  rfp_id?: string;
  stage?: OpportunityStage;
  est_value?: number;
  next_action_date?: string;
  owner_id: string;
}

class CRMService {
  // Company operations
  async getCompanies(filters?: {
    status?: CompanyStatus;
    type?: CompanyType;
    search?: string;
  }): Promise<Company[]> {
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

    if (error) {
      console.error('Error fetching companies:', error);
      throw new Error(`Failed to fetch companies: ${error.message}`);
    }

    return data || [];
  }

  async getCompanyById(id: string): Promise<Company | null> {
    const { data, error } = await supabase
      .from('company')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Not found
      }
      console.error('Error fetching company:', error);
      throw new Error(`Failed to fetch company: ${error.message}`);
    }

    return data;
  }

  async createCompany(input: CreateCompanyInput): Promise<Company> {
    const { data, error } = await supabase
      .from('company')
      .insert(input)
      .select()
      .single();

    if (error) {
      console.error('Error creating company:', error);
      throw new Error(`Failed to create company: ${error.message}`);
    }

    // Emit SNS event
    await this.emitEvent('crm.company.created', { company: data });

    return data;
  }

  async updateCompany(id: string, updates: Partial<CreateCompanyInput>): Promise<Company> {
    const { data, error } = await supabase
      .from('company')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating company:', error);
      throw new Error(`Failed to update company: ${error.message}`);
    }

    return data;
  }

  async deleteCompany(id: string): Promise<void> {
    const { error } = await supabase
      .from('company')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting company:', error);
      throw new Error(`Failed to delete company: ${error.message}`);
    }
  }

  // Contact operations
  async getContacts(companyId?: string): Promise<Contact[]> {
    let query = supabase
      .from('contact')
      .select(`
        *,
        company:company_id (*)
      `);

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    const { data, error } = await query.order('name');

    if (error) {
      console.error('Error fetching contacts:', error);
      throw new Error(`Failed to fetch contacts: ${error.message}`);
    }

    return data || [];
  }

  async createContact(input: CreateContactInput): Promise<Contact> {
    const { data, error } = await supabase
      .from('contact')
      .insert(input)
      .select(`
        *,
        company:company_id (*)
      `)
      .single();

    if (error) {
      console.error('Error creating contact:', error);
      throw new Error(`Failed to create contact: ${error.message}`);
    }

    return data;
  }

  async updateContact(id: string, updates: Partial<CreateContactInput>): Promise<Contact> {
    const { data, error } = await supabase
      .from('contact')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        company:company_id (*)
      `)
      .single();

    if (error) {
      console.error('Error updating contact:', error);
      throw new Error(`Failed to update contact: ${error.message}`);
    }

    return data;
  }

  async deleteContact(id: string): Promise<void> {
    const { error } = await supabase
      .from('contact')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contact:', error);
      throw new Error(`Failed to delete contact: ${error.message}`);
    }
  }

  // Interaction operations
  async getInteractions(filters?: {
    company_id?: string;
    contact_id?: string;
    user_id?: string;
    type?: InteractionType;
  }): Promise<Interaction[]> {
    let query = supabase
      .from('interaction')
      .select(`
        *,
        company:company_id (*),
        contact:contact_id (*)
      `);

    if (filters?.company_id) {
      query = query.eq('company_id', filters.company_id);
    }

    if (filters?.contact_id) {
      query = query.eq('contact_id', filters.contact_id);
    }

    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id);
    }

    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query.order('date', { ascending: false });

    if (error) {
      console.error('Error fetching interactions:', error);
      throw new Error(`Failed to fetch interactions: ${error.message}`);
    }

    return data || [];
  }

  async createInteraction(input: CreateInteractionInput): Promise<Interaction> {
    const { data, error } = await supabase
      .from('interaction')
      .insert(input)
      .select(`
        *,
        company:company_id (*),
        contact:contact_id (*)
      `)
      .single();

    if (error) {
      console.error('Error creating interaction:', error);
      throw new Error(`Failed to create interaction: ${error.message}`);
    }

    return data;
  }

  // Opportunity operations
  async getOpportunities(filters?: {
    company_id?: string;
    stage?: OpportunityStage;
    owner_id?: string;
  }): Promise<Opportunity[]> {
    let query = supabase
      .from('opportunity')
      .select(`
        *,
        company:company_id (*)
      `);

    if (filters?.company_id) {
      query = query.eq('company_id', filters.company_id);
    }

    if (filters?.stage) {
      query = query.eq('stage', filters.stage);
    }

    if (filters?.owner_id) {
      query = query.eq('owner_id', filters.owner_id);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching opportunities:', error);
      throw new Error(`Failed to fetch opportunities: ${error.message}`);
    }

    return data || [];
  }

  async createOpportunity(input: CreateOpportunityInput): Promise<Opportunity> {
    const { data, error } = await supabase
      .from('opportunity')
      .insert(input)
      .select(`
        *,
        company:company_id (*)
      `)
      .single();

    if (error) {
      console.error('Error creating opportunity:', error);
      throw new Error(`Failed to create opportunity: ${error.message}`);
    }

    return data;
  }

  async updateOpportunityStage(id: string, stage: OpportunityStage): Promise<Opportunity> {
    const { data, error } = await supabase
      .from('opportunity')
      .update({ stage })
      .eq('id', id)
      .select(`
        *,
        company:company_id (*)
      `)
      .single();

    if (error) {
      console.error('Error updating opportunity stage:', error);
      throw new Error(`Failed to update opportunity stage: ${error.message}`);
    }

    // Emit SNS event
    await this.emitEvent('crm.opportunity.stage_changed', { 
      opportunity: data,
      previous_stage: null, // Would need to fetch previous value in real implementation
      new_stage: stage
    });

    return data;
  }

  // AI Enhancement operations
  async generateAISummary(interactionId: string, notes: string): Promise<string> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-ai-summary', {
        body: { interactionId, notes }
      });

      if (error) {
        console.error('Error generating AI summary:', error);
        throw new Error(`Failed to generate AI summary: ${error.message}`);
      }

      return data.summary;
    } catch (error) {
      console.error('AI summary generation failed:', error);
      // Return empty string as fallback
      return '';
    }
  }

  async generateCompanyRiskScore(companyId: string): Promise<number> {
    try {
      const { data, error } = await supabase.functions.invoke('generate-risk-score', {
        body: { companyId }
      });

      if (error) {
        console.error('Error generating risk score:', error);
        throw new Error(`Failed to generate risk score: ${error.message}`);
      }

      return data.riskScore;
    } catch (error) {
      console.error('Risk score generation failed:', error);
      // Return default risk score
      return 50;
    }
  }

  // Event emission (SNS simulation)
  private async emitEvent(eventType: string, payload: any): Promise<void> {
    try {
      // In a real implementation, this would emit to SNS
      // For now, we'll just log the event
      console.log(`Event emitted: ${eventType}`, payload);
      
      // Optionally store events in a local table for debugging
      await supabase.from('events').insert({
        event_type: eventType,
        payload,
        created_at: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to emit event:', error);
      // Don't throw here - event emission failures shouldn't break the main operation
    }
  }
}

export const crmService = new CRMService();
