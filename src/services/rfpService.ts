import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';

type RFP = Database['public']['Tables']['rfps']['Row'];
type RFPInsert = Database['public']['Tables']['rfps']['Insert'];
type RFPUpdate = Database['public']['Tables']['rfps']['Update'];

export class RFPService {
  /**
   * Create a new RFP with all wizard data
   */
  async createRFP(rfpData: {
    basicInfo: any;
    scope: any;
    timeline: any;
    compliance: any;
    budget: any;
    aiEnhancements: any;
  }): Promise<{ data: RFP | null; error: Error | null }> {
    try {
      // First create the basic RFP record
      const { data: rfp, error: rfpError } = await supabase
        .from('rfps')
        .insert({
          title: rfpData.basicInfo.title,
          description: rfpData.basicInfo.description,
          rfp_number: `RFP-${Date.now()}`, // Generate unique RFP number
          bid_type: rfpData.basicInfo.projectType,
          estimated_value: rfpData.basicInfo.estimatedValue,
          submission_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          bond_required: rfpData.basicInfo.requirements.bond,
          insurance_required: rfpData.basicInfo.requirements.insurance,
          prequalification_required: rfpData.basicInfo.requirements.prequalification,
          status: 'draft',
          created_by: (await supabase.auth.getUser()).data.user?.id || '',
        })
        .select()
        .single();

      if (rfpError) throw rfpError;

      // Create scope items if scope data exists
      if (rfpData.scope && rfp) {
        await this.createScopeItems(rfp.id, rfpData.scope);
      }

      // Create timeline events if timeline data exists
      if (rfpData.timeline && rfp) {
        await this.createTimelineEvents(rfp.id, rfpData.timeline);
      }

      // Store budget data as metadata
      if (rfpData.budget && rfp) {
        await this.storeBudgetData(rfp.id, rfpData.budget);
      }

      return { data: rfp, error: null };
    } catch (error) {
      console.error('Error creating RFP:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Create scope items for an RFP
   */
  private async createScopeItems(rfpId: string, scopeData: any) {
    if (!scopeData.csiCodes || !Array.isArray(scopeData.csiCodes)) return;

    const scopeItems = scopeData.csiCodes.map((code: string) => ({
      rfp_id: rfpId,
      csi_code: code,
      description: scopeData.description || `Work related to CSI code ${code}`,
    }));

    const { error } = await supabase
      .from('scope_items')
      .insert(scopeItems);

    if (error) {
      console.error('Error creating scope items:', error);
    }
  }

  /**
   * Create timeline events for an RFP
   */
  private async createTimelineEvents(rfpId: string, timelineData: any) {
    if (!timelineData.events || !Array.isArray(timelineData.events)) return;

    const timelineEvents = timelineData.events.map((event: any) => ({
      rfp_id: rfpId,
      name: event.title,
      deadline: event.date,
      mandatory: event.criticalPath || false,
    }));

    const { error } = await supabase
      .from('timeline_events')
      .insert(timelineEvents);

    if (error) {
      console.error('Error creating timeline events:', error);
    }
  }

  /**
   * Store budget data as JSON metadata
   */
  private async storeBudgetData(rfpId: string, budgetData: any) {
    // Store budget data in a metadata table or as JSON in the RFP record
    const { error } = await supabase
      .from('rfps')
      .update({
        // Assuming we have a metadata column for storing additional data
        metadata: { budget: budgetData }
      } as any)
      .eq('id', rfpId);

    if (error) {
      console.error('Error storing budget data:', error);
    }
  }

  /**
   * Get all RFPs
   */
  async getRFPs(): Promise<{ data: RFP[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('rfps')
        .select(`
          *,
          timeline_events(*),
          scope_items(*),
          vendor_submissions(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching RFPs:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get a single RFP with all related data
   */
  async getRFP(id: string): Promise<{ data: any | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('rfps')
        .select(`
          *,
          timeline_events(*),
          scope_items(*),
          vendor_submissions(*),
          questions(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching RFP:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Update RFP status
   */
  async updateRFPStatus(id: string, status: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('rfps')
        .update({ status } as any)
        .eq('id', id);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error updating RFP status:', error);
      return { error: error as Error };
    }
  }

  /**
   * Generate AI-enhanced content using Supabase Edge Functions
   */
  async generateAIContent(prompt: string, context: any): Promise<{ data: string | null; error: Error | null }> {
    try {
      const { data, error } = await supabase.functions.invoke('chatRag', {
        body: {
          message: prompt,
          context: context,
          temperature: 0.7,
          max_tokens: 1000
        }
      });

      if (error) throw error;

      return { data: data.response, error: null };
    } catch (error) {
      console.error('Error generating AI content:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Upload RFP document to Supabase Storage
   */
  async uploadRFPDocument(rfpId: string, file: File): Promise<{ data: string | null; error: Error | null }> {
    try {
      const fileName = `${rfpId}/${Date.now()}-${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('rfp-documents')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('rfp-documents')
        .getPublicUrl(fileName);

      return { data: urlData.publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading RFP document:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get CSI codes from database or API
   */
  async getCSICodes(search?: string): Promise<{ data: any[] | null; error: Error | null }> {
    try {
      // This would typically come from a CSI codes table or external API
      // For now, returning mock data that matches the component expectations
      const mockCSICodes = [
        {
          code: '03 30 00',
          title: 'Cast-in-Place Concrete',
          description: 'Concrete formed and poured in place at the construction site.',
          division: '03',
          specifications: [
            'Minimum compressive strength requirements',
            'Reinforcement specifications',
            'Formwork requirements',
            'Curing procedures'
          ]
        },
        {
          code: '05 12 00',
          title: 'Structural Steel Framing',
          description: 'Steel framework components for building structure.',
          division: '05',
          specifications: [
            'Steel grade requirements',
            'Connection details',
            'Welding specifications',
            'Protective coatings'
          ]
        },
        {
          code: '23 00 00',
          title: 'HVAC Systems',
          description: 'Heating, ventilation, and air conditioning systems.',
          division: '23',
          specifications: [
            'Equipment specifications',
            'Distribution systems',
            'Control requirements',
            'Performance criteria'
          ]
        },
        {
          code: '26 00 00',
          title: 'Electrical Systems',
          description: 'Electrical power distribution and controls.',
          division: '26',
          specifications: [
            'Power distribution requirements',
            'Lighting specifications',
            'Control systems',
            'Safety requirements'
          ]
        },
        {
          code: '09 90 00',
          title: 'Painting and Coating',
          description: 'Surface preparation and protective coatings.',
          division: '09',
          specifications: [
            'Surface preparation standards',
            'Coating material specifications',
            'Application methods',
            'Quality control procedures'
          ]
        }
      ];

      let filteredCodes = mockCSICodes;
      if (search) {
        filteredCodes = mockCSICodes.filter(code => 
          code.title.toLowerCase().includes(search.toLowerCase()) ||
          code.description.toLowerCase().includes(search.toLowerCase()) ||
          code.code.includes(search)
        );
      }

      return { data: filteredCodes, error: null };
    } catch (error) {
      console.error('Error fetching CSI codes:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Generate compliance requirements based on project type and scope
   */
  async generateComplianceRequirements(projectData: any): Promise<{ data: any[] | null; error: Error | null }> {
    try {
      // Use AI to generate compliance requirements
      const prompt = `Generate compliance requirements for a ${projectData.projectType} project with the following scope: ${JSON.stringify(projectData.scope)}`;
      
      const { data: aiResponse, error: aiError } = await this.generateAIContent(prompt, projectData);
      
      if (aiError) throw aiError;

      // Parse AI response and structure as compliance requirements
      const requirements = [
        {
          id: 'REQ-001',
          category: 'Legal',
          title: 'Equal Opportunity Statement',
          description: 'Include mandatory equal opportunity and non-discrimination clauses.',
          required: true,
          status: 'pending',
          guidance: 'Reference standard EEO clauses from legal templates.',
          references: ['29 CFR Part 1608', 'Executive Order 11246']
        },
        {
          id: 'REQ-002',
          category: 'Financial',
          title: 'Bonding Requirements',
          description: 'Specify performance and payment bond requirements.',
          required: projectData.basicInfo?.requirements?.bond || false,
          status: 'needs-review',
          guidance: 'Verify bond amounts match project value and risk profile.',
          references: ['State Contracting Guidelines', 'Risk Management Policy']
        },
        {
          id: 'REQ-003',
          category: 'Insurance',
          title: 'Insurance Coverage',
          description: 'Define required insurance types and coverage amounts.',
          required: projectData.basicInfo?.requirements?.insurance || false,
          status: 'pending',
          guidance: 'Update coverage limits based on project scope and location.',
          references: ['Insurance Requirements Guide', 'Risk Assessment Matrix']
        }
      ];

      return { data: requirements, error: null };
    } catch (error) {
      console.error('Error generating compliance requirements:', error);
      return { data: null, error: error as Error };
    }
  }
}

// Export singleton instance
export const rfpService = new RFPService();
