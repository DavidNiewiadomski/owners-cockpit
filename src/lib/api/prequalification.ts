/**
 * API Service for Vendor Prequalification System
 */
import { supabase } from '@/lib/supabase';
import type {
  Prequalification,
  PrequalSummary,
  PrequalDashboardData,
  VendorPortalData,
  CreatePrequalRequest,
  UpdatePrequalRequest,
  SubmitPrequalRequest,
  PrequalReviewRequest,
  PrequalFilters,
  PrequalSort,
  ApiResponse,
  PaginatedResponse,
  InsuranceCertificate,
  SafetyMetric,
  Litigation,
  ProjectReference,
  FinancialStatement,
  BondingCapacity,
  PrequalDocumentUpload,
  PrequalScoringCriteria,
  PrequalScore,
} from '@/types/prequalification';

class PrequalificationAPI {
  private baseUrl = '/api/prequalification';

  // Admin endpoints
  async getPrequalifications(
    filters?: PrequalFilters,
    sort?: PrequalSort,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<PrequalSummary>> {
    const { data, error } = await supabase
      .from('prequal_summary')
      .select('*')
      .range((page - 1) * limit, page * limit - 1);

    if (error) throw error;

    return {
      success: true,
      data: data || [],
      pagination: {
        page,
        per_page: limit,
        total: data?.length || 0,
        total_pages: Math.ceil((data?.length || 0) / limit),
      },
    };
  }

  async getPrequalification(id: string): Promise<ApiResponse<Prequalification>> {
    const { data, error } = await supabase
      .from('prequal')
      .select(`
        *,
        company:companies(*),
        insurance_certificates(*),
        safety_metrics(*),
        litigation_cases:litigation(*),
        project_references(*),
        documents:prequal_document_upload(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as Prequalification,
    };
  }

  async createPrequalRequest(request: CreatePrequalRequest): Promise<ApiResponse<{ id: string; form_url: string }>> {
    try {
      // Create the prequalification record
      const { data: prequal, error: prequalError } = await supabase
        .from('prequal')
        .insert({
          company_id: request.company_id,
          requested_trades: request.requested_trades,
          project_size_limit: request.project_size_limit,
          geographic_limits: request.geographic_limits,
          contact_name: request.contact_name,
          contact_title: request.contact_title,
          contact_email: request.contact_email,
          contact_phone: request.contact_phone,
          status: 'pending',
        })
        .select()
        .single();

      if (prequalError) throw prequalError;

      // Generate form URL for vendor
      const formUrl = `${window.location.origin}/vendor/prequalification/${prequal.id}`;

      // TODO: Send email notification to vendor with form link
      await this.sendPrequalificationInvite(request.contact_email, formUrl);

      return {
        success: true,
        data: {
          id: prequal.id,
          form_url: formUrl,
        },
        message: 'Prequalification request created and invitation sent to vendor.',
      };
    } catch (error) {
      throw error;
    }
  }

  async updatePrequalification(id: string, updates: UpdatePrequalRequest): Promise<ApiResponse<Prequalification>> {
    const { data, error } = await supabase
      .from('prequal')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      success: true,
      data: data as Prequalification,
    };
  }

  async reviewPrequalification(id: string, review: PrequalReviewRequest): Promise<ApiResponse<Prequalification>> {
    try {
      // Update prequalification status and notes
      const { data: prequal, error: prequalError } = await supabase
        .from('prequal')
        .update({
          status: review.status,
          review_notes: review.review_notes,
          reviewed_at: new Date().toISOString(),
          // reviewed_by: user.id, // TODO: Add user context
        })
        .eq('id', id)
        .select()
        .single();

      if (prequalError) throw prequalError;

      // Insert individual criterion scores
      if (review.scores && review.scores.length > 0) {
        const { error: scoresError } = await supabase
          .from('prequal_score')
          .upsert(
            review.scores.map(score => ({
              prequal_id: id,
              criteria_id: score.criteria_id,
              score: score.score,
              notes: score.notes,
              // scored_by: user.id, // TODO: Add user context
            }))
          );

        if (scoresError) throw scoresError;

        // Calculate overall score
        await this.calculatePrequalScore(id);
      }

      return {
        success: true,
        data: prequal as Prequalification,
        message: 'Prequalification reviewed successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  async getDashboardData(): Promise<ApiResponse<PrequalDashboardData>> {
    try {
      // Get summary statistics
      const { data: summaryData, error: summaryError } = await supabase
        .from('prequal_summary')
        .select('*');

      if (summaryError) throw summaryError;

      const summary = {
        total_applications: summaryData?.length || 0,
        pending_review: summaryData?.filter(p => p.status === 'pending').length || 0,
        approved: summaryData?.filter(p => p.status === 'approved').length || 0,
        expired: summaryData?.filter(p => p.expiry_status === 'expired').length || 0,
        approval_rate: summaryData?.length ? 
          (summaryData.filter(p => p.status === 'approved').length / summaryData.length) * 100 : 0,
        average_score: summaryData?.length ? 
          summaryData.reduce((sum, p) => sum + (p.score || 0), 0) / summaryData.length : 0,
        documents_pending_review: 0, // TODO: Calculate from document uploads
      };

      const recent_applications = summaryData?.slice(0, 10) || [];
      const expiring_soon = summaryData?.filter(p => p.expiry_status === 'expiring_soon') || [];
      const high_scoring_vendors = summaryData?.filter(p => (p.score || 0) >= 85).slice(0, 10) || [];

      // TODO: Get category scores from prequal_scoring_criteria
      const category_scores: any[] = [];

      return {
        success: true,
        data: {
          summary,
          recent_applications,
          expiring_soon,
          high_scoring_vendors,
          category_scores,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Vendor endpoints
  async getVendorPrequalification(id: string): Promise<ApiResponse<Prequalification>> {
    return this.getPrequalification(id);
  }

  async submitPrequalification(id: string, submission: SubmitPrequalRequest): Promise<ApiResponse<Prequalification>> {
    try {
      // Insert insurance certificates
      if (submission.insurance_certificates.length > 0) {
        const { error: insuranceError } = await supabase
          .from('insurance_certificate')
          .insert(
            submission.insurance_certificates.map(cert => ({
              prequal_id: id,
              ...cert,
            }))
          );

        if (insuranceError) throw insuranceError;
      }

      // Insert safety metrics
      if (submission.safety_metrics.length > 0) {
        const prequal = await this.getPrequalification(id);
        const { error: safetyError } = await supabase
          .from('safety_metric')
          .insert(
            submission.safety_metrics.map(metric => ({
              company_id: prequal.data.company_id,
              ...metric,
            }))
          );

        if (safetyError) throw safetyError;
      }

      // Insert litigation cases
      if (submission.litigation_cases.length > 0) {
        const prequal = await this.getPrequalification(id);
        const { error: litigationError } = await supabase
          .from('litigation')
          .insert(
            submission.litigation_cases.map(litigation => ({
              company_id: prequal.data.company_id,
              ...litigation,
            }))
          );

        if (litigationError) throw litigationError;
      }

      // Insert project references
      if (submission.project_references.length > 0) {
        const prequal = await this.getPrequalification(id);
        const { error: referencesError } = await supabase
          .from('project_reference')
          .insert(
            submission.project_references.map(ref => ({
              company_id: prequal.data.company_id,
              ...ref,
            }))
          );

        if (referencesError) throw referencesError;
      }

      // Insert financial statements
      if (submission.financial_statements.length > 0) {
        const prequal = await this.getPrequalification(id);
        const { error: financialError } = await supabase
          .from('financial_statement')
          .insert(
            submission.financial_statements.map(stmt => ({
              company_id: prequal.data.company_id,
              ...stmt,
            }))
          );

        if (financialError) throw financialError;
      }

      // Insert bonding capacity
      if (submission.bonding_capacity.length > 0) {
        const prequal = await this.getPrequalification(id);
        const { error: bondingError } = await supabase
          .from('bonding_capacity')
          .insert(
            submission.bonding_capacity.map(bonding => ({
              company_id: prequal.data.company_id,
              ...bonding,
            }))
          );

        if (bondingError) throw bondingError;
      }

      // Update prequalification status
      const { data: updatedPrequal, error: updateError } = await supabase
        .from('prequal')
        .update({
          status: 'pending',
          submitted_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;

      return {
        success: true,
        data: updatedPrequal as Prequalification,
        message: 'Prequalification submitted successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  async uploadDocument(
    prequalId: string,
    file: File,
    requirementId?: string,
    description?: string
  ): Promise<ApiResponse<PrequalDocumentUpload>> {
    try {
      // Upload file to Supabase Storage
      const fileName = `${prequalId}/${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('prequalification-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('prequalification-documents')
        .getPublicUrl(fileName);

      // Insert document record
      const { data: document, error: documentError } = await supabase
        .from('prequal_document_upload')
        .insert({
          prequal_id: prequalId,
          requirement_id: requirementId,
          file_name: fileName,
          original_file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          file_url: urlData.publicUrl,
          description,
        })
        .select()
        .single();

      if (documentError) throw documentError;

      return {
        success: true,
        data: document as PrequalDocumentUpload,
        message: 'Document uploaded successfully.',
      };
    } catch (error) {
      throw error;
    }
  }

  async getVendorPortalData(companyId: string): Promise<ApiResponse<VendorPortalData>> {
    try {
      // Get active applications
      const { data: activeApplications, error: activeError } = await supabase
        .from('prequal')
        .select('*')
        .eq('company_id', companyId)
        .in('status', ['pending', 'approved']);

      if (activeError) throw activeError;

      // Get expiring qualifications
      const { data: expiringQualifications, error: expiringError } = await supabase
        .from('prequal')
        .select('*')
        .eq('company_id', companyId)
        .eq('status', 'approved')
        .lt('expiry_date', new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()); // 90 days

      if (expiringError) throw expiringError;

      // Get document requirements
      const { data: documentRequirements, error: reqError } = await supabase
        .from('prequal_document_requirement')
        .select('*')
        .eq('active', true);

      if (reqError) throw reqError;

      // Get submitted documents
      const activeIds = activeApplications?.map(app => app.id) || [];
      const { data: submittedDocuments, error: docsError } = await supabase
        .from('prequal_document_upload')
        .select('*')
        .in('prequal_id', activeIds);

      if (docsError) throw docsError;

      // Get application history
      const { data: applicationHistory, error: historyError } = await supabase
        .from('prequal')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (historyError) throw historyError;

      return {
        success: true,
        data: {
          active_applications: activeApplications || [],
          expiring_qualifications: expiringQualifications || [],
          document_requirements: documentRequirements || [],
          submitted_documents: submittedDocuments || [],
          application_history: applicationHistory || [],
        },
      };
    } catch (error) {
      throw error;
    }
  }

  // Scoring and criteria
  async getScoringCriteria(): Promise<ApiResponse<PrequalScoringCriteria[]>> {
    const { data, error } = await supabase
      .from('prequal_scoring_criteria')
      .select('*')
      .eq('active', true)
      .order('category', { ascending: true });

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  }

  async getPrequalScores(prequalId: string): Promise<ApiResponse<PrequalScore[]>> {
    const { data, error } = await supabase
      .from('prequal_score')
      .select(`
        *,
        criteria:prequal_scoring_criteria(*)
      `)
      .eq('prequal_id', prequalId);

    if (error) throw error;

    return {
      success: true,
      data: data || [],
    };
  }

  // Helper methods
  private async calculatePrequalScore(prequalId: string): Promise<number> {
    const { data, error } = await supabase.rpc('calculate_prequal_score', {
      prequal_id_param: prequalId,
    });

    if (error) throw error;
    return data || 0;
  }

  private async sendPrequalificationInvite(email: string, formUrl: string): Promise<void> {
    // TODO: Implement email service integration
    console.log(`Sending prequalification invite to ${email} with form URL: ${formUrl}`);
  }
}

export const prequalificationAPI = new PrequalificationAPI();
