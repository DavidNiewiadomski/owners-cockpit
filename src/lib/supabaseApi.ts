import { supabase } from '@/integrations/supabase/client';

export interface ChatRAGResponse {
  answer: string;
  citations: Citation[];
  actions?: Action[];
  usage?: {
    total_tokens: number;
  };
}

export interface Citation {
  id: string;
  snippet: string;
  source: 'document' | 'communication';
  similarity?: number;
  speaker?: string;
  timestamp?: string;
  comm_type?: string;
  provider?: string;
}

export interface Action {
  id: string;
  type: 'teams_message' | 'outlook_email' | 'calendar_event' | 'platform_action';
  description: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface ChatRAGRequest {
  question: string;
  project_id: string;
  conversation_id?: string;
  search_only?: boolean;
  include_communications?: boolean;
  match_count?: number;
  context?: Record<string, any>;
  enable_actions?: boolean;
}

export interface InsightsResponse {
  insights: Array<{
    type: 'risk' | 'opportunity' | 'trend' | 'recommendation';
    title: string;
    description: string;
    confidence: number;
    impact: 'low' | 'medium' | 'high';
    category: string;
    data_points: any[];
  }>;
  summary: string;
  last_updated: string;
}

export interface AutopilotResponse {
  action_type: string;
  success: boolean;
  result: any;
  message: string;
  follow_up_actions?: Action[];
}

export interface AutopilotRequest {
  command: string;
  project_id?: string;
  context?: Record<string, any>;
  voice_data?: {
    transcript: string;
    confidence: number;
  };
}

class SupabaseApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
  }

  private async makeRequest<T>(
    functionName: string, 
    data: any, 
    options: RequestInit = {}
  ): Promise<T> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}/${functionName}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Chat with RAG (Retrieval Augmented Generation)
   */
  async chatRAG(request: ChatRAGRequest): Promise<ChatRAGResponse> {
    return this.makeRequest<ChatRAGResponse>('chatRag', request);
  }

  /**
   * Generate AI insights for a project
   */
  async generateInsights(projectId: string, options: {
    types?: string[];
    timeframe?: string;
    include_communications?: boolean;
    include_documents?: boolean;
  } = {}): Promise<InsightsResponse> {
    return this.makeRequest<InsightsResponse>('generateInsights', {
      project_id: projectId,
      ...options,
    });
  }

  /**
   * Execute autopilot commands (voice or text)
   */
  async executeAutopilot(request: AutopilotRequest): Promise<AutopilotResponse> {
    return this.makeRequest<AutopilotResponse>('autopilotEngine', request);
  }

  /**
   * Send a message via Microsoft Teams
   */
  async sendTeamsMessage(data: {
    team_id: string;
    channel_id: string;
    message: string;
    project_id?: string;
    reply_to?: string;
  }): Promise<{ success: boolean; message_id?: string; error?: string }> {
    return this.makeRequest('teams-bot', {
      action: 'send_message',
      ...data,
    });
  }

  /**
   * Draft a reply for communications
   */
  async draftReply(data: {
    original_message: string;
    context?: string;
    tone?: 'professional' | 'friendly' | 'urgent';
    project_id?: string;
  }): Promise<{ draft: string; suggestions: string[] }> {
    return this.makeRequest('draft-reply', data);
  }

  /**
   * Send a reply via the appropriate channel
   */
  async sendReply(data: {
    draft_id: string;
    message: string;
    recipient?: string;
    channel?: 'teams' | 'outlook' | 'phone';
    project_id?: string;
  }): Promise<{ success: boolean; message_id?: string; error?: string }> {
    return this.makeRequest('send-reply', data);
  }

  /**
   * Ingest communications from various sources
   */
  async ingestCommunications(data: {
    source: 'teams' | 'outlook' | 'phone';
    project_id?: string;
    sync_history?: boolean;
    date_range?: {
      from: string;
      to: string;
    };
  }): Promise<{ success: boolean; processed: number; errors: any[] }> {
    return this.makeRequest('ingestComms', data);
  }

  /**
   * Upload and process documents
   */
  async ingestUpload(formData: FormData): Promise<{ 
    success: boolean; 
    document_id?: string; 
    chunks_created?: number;
    error?: string;
  }> {
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers = {
      'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
    };

    const response = await fetch(`${this.baseUrl}/ingestUpload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(errorData.error || `Upload failed: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Sync with Procore
   */
  async syncProcore(projectId: string, options: {
    sync_type?: 'full' | 'incremental';
    entities?: string[];
  } = {}): Promise<{ success: boolean; synced: any; errors: any[] }> {
    return this.makeRequest('procoreSync', {
      project_id: projectId,
      ...options,
    });
  }

  /**
   * Create risk alerts
   */
  async createRiskAlert(data: {
    project_id: string;
    risk_type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    suggested_actions?: string[];
  }): Promise<{ success: boolean; alert_id?: string }> {
    return this.makeRequest('riskAlert', data);
  }

  /**
   * Generate weekly summary
   */
  async generateWeeklySummary(projectId: string, options: {
    week_start?: string;
    include_metrics?: boolean;
    include_communications?: boolean;
    include_documents?: boolean;
  } = {}): Promise<{
    summary: string;
    metrics: any;
    highlights: string[];
    action_items: Action[];
  }> {
    return this.makeRequest('weeklySummary', {
      project_id: projectId,
      ...options,
    });
  }

  /**
   * Set up autopilot for a project
   */
  async setupAutopilot(data: {
    project_id: string;
    automation_rules: any[];
    notification_preferences: any;
    voice_commands?: boolean;
  }): Promise<{ success: boolean; config_id?: string }> {
    return this.makeRequest('setupAutopilot', data);
  }

  /**
   * Office 365 authentication
   */
  async office365Auth(redirectUri: string): Promise<{ auth_url: string }> {
    return this.makeRequest('office365-auth', { redirect_uri: redirectUri });
  }

  /**
   * Handle Office 365 callback
   */
  async office365Callback(code: string, state: string): Promise<{ 
    success: boolean; 
    user: any; 
    tokens: any; 
  }> {
    return this.makeRequest('office365-callback', { code, state });
  }

  /**
   * Test integrations
   */
  async testIntegration(integrationType: string): Promise<{ 
    success: boolean; 
    status: string; 
    details: any; 
  }> {
    return this.makeRequest('testIntegration', { 
      integration_type: integrationType 
    });
  }

  /**
   * Mock sync for development/testing
   */
  async mockSync(projectId: string): Promise<{ 
    success: boolean; 
    mock_data: any; 
  }> {
    return this.makeRequest('mockSync', { project_id: projectId });
  }

  /**
   * Seed actions for a project
   */
  async seedActions(projectId: string, actionTypes: string[]): Promise<{ 
    success: boolean; 
    actions_created: number; 
  }> {
    return this.makeRequest('seed-actions', { 
      project_id: projectId,
      action_types: actionTypes
    });
  }
}

// Export singleton instance
export const supabaseApi = new SupabaseApiClient();

// Export types
export type {
  ChatRAGRequest,
  ChatRAGResponse,
  Citation,
  Action,
  InsightsResponse,
  AutopilotRequest,
  AutopilotResponse,
};
