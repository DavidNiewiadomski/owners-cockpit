import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type {
  BidProject,
  BidLineItem,
  BidVendor,
  VendorBidSubmission,
  VendorLineItemBid,
  LineItemAnalysis,
  VendorEvaluation,
  BidAnalysisDashboardData,
  BidAnalysisFilters,
  BidAnalysisSort
} from '@/types/bidAnalysis';

interface UseBidAnalysisReturn {
  data: BidAnalysisDashboardData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  applyFilters: (filters: BidAnalysisFilters) => void;
  applySorting: (sort: BidAnalysisSort) => void;
}

export function useBidAnalysis(rfpId?: string): UseBidAnalysisReturn {
  const [data, setData] = useState<BidAnalysisDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BidAnalysisFilters>({});
  const [sorting, setSorting] = useState<BidAnalysisSort>({ field: 'created_at', direction: 'desc' });
  const { toast } = useToast();

  const fetchBidAnalysisData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch project data
      let projectQuery = supabase
        .from('bid_projects')
        .select('*');

      if (rfpId) {
        projectQuery = projectQuery.eq('rfp_id', rfpId);
      }

      const { data: projects, error: projectError } = await projectQuery;

      if (projectError) {
        throw new Error(`Failed to fetch projects: ${projectError.message}`);
      }

      if (!projects || projects.length === 0) {
        // Create mock data if no projects exist
        const mockData = createMockBidAnalysisData(rfpId);
        setData(mockData);
        return;
      }

      const project = projects[0] as BidProject;

      // Fetch line items
      const { data: lineItems, error: lineItemsError } = await supabase
        .from('bid_line_items')
        .select('*')
        .eq('bid_project_id', project.id)
        .order(sorting.field, { ascending: sorting.direction === 'asc' });

      if (lineItemsError) {
        throw new Error(`Failed to fetch line items: ${lineItemsError.message}`);
      }

      // Fetch vendors
      const { data: vendors, error: vendorsError } = await supabase
        .from('bid_vendors')
        .select('*');

      if (vendorsError) {
        throw new Error(`Failed to fetch vendors: ${vendorsError.message}`);
      }

      // Fetch vendor submissions
      const { data: submissions, error: submissionsError } = await supabase
        .from('vendor_bid_submissions')
        .select('*')
        .eq('bid_project_id', project.id);

      if (submissionsError) {
        throw new Error(`Failed to fetch submissions: ${submissionsError.message}`);
      }

      // Fetch line item bids
      const { data: lineItemBids, error: lineItemBidsError } = await supabase
        .from('vendor_line_item_bids')
        .select('*');

      if (lineItemBidsError) {
        throw new Error(`Failed to fetch line item bids: ${lineItemBidsError.message}`);
      }

      // Fetch analyses
      const { data: analyses, error: analysesError } = await supabase
        .from('line_item_analyses')
        .select('*');

      if (analysesError) {
        throw new Error(`Failed to fetch analyses: ${analysesError.message}`);
      }

      // Fetch evaluations
      const { data: evaluations, error: evaluationsError } = await supabase
        .from('vendor_evaluations')
        .select('*');

      if (evaluationsError) {
        throw new Error(`Failed to fetch evaluations: ${evaluationsError.message}`);
      }

      // Fetch settings
      const { data: settings, error: settingsError } = await supabase
        .from('bid_analysis_settings')
        .select('*')
        .limit(1);

      if (settingsError) {
        console.warn('Failed to fetch settings:', settingsError.message);
      }

      // Apply filters to line items
      let filteredLineItems = lineItems as BidLineItem[];
      
      if (filters.csi_codes?.length) {
        filteredLineItems = filteredLineItems.filter(item => 
          filters.csi_codes!.includes(item.csi_code)
        );
      }

      if (filters.vendor_ids?.length) {
        const filteredSubmissionIds = (submissions as VendorBidSubmission[])
          .filter(sub => filters.vendor_ids!.includes(sub.vendor_id))
          .map(sub => sub.id);
        
        const validLineItemIds = (lineItemBids as VendorLineItemBid[])
          .filter(bid => filteredSubmissionIds.includes(bid.vendor_submission_id))
          .map(bid => bid.line_item_id);
        
        filteredLineItems = filteredLineItems.filter(item => 
          validLineItemIds.includes(item.id)
        );
      }

      if (filters.price_range) {
        const [minPrice, maxPrice] = filters.price_range;
        filteredLineItems = filteredLineItems.filter(item => 
          item.engineer_estimate >= minPrice && item.engineer_estimate <= maxPrice
        );
      }

      // Construct final data object
      const dashboardData: BidAnalysisDashboardData = {
        project,
        line_items: filteredLineItems,
        vendors: vendors as BidVendor[],
        submissions: submissions as VendorBidSubmission[],
        line_item_bids: lineItemBids as VendorLineItemBid[],
        analyses: analyses as LineItemAnalysis[],
        evaluations: evaluations as VendorEvaluation[],
        adjustments: [], // This would be fetched if needed
        settings: settings?.[0] || createDefaultSettings()
      };

      setData(dashboardData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching bid analysis data:', err);
      
      // Fall back to mock data on error
      const mockData = createMockBidAnalysisData(rfpId);
      setData(mockData);
      
      toast({
        title: "Data Loading Issue",
        description: "Using sample data for demonstration. Please check your database connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refresh = async () => {
    await fetchBidAnalysisData();
  };

  const applyFilters = (newFilters: BidAnalysisFilters) => {
    setFilters(newFilters);
  };

  const applySorting = (newSorting: BidAnalysisSort) => {
    setSorting(newSorting);
  };

  useEffect(() => {
    fetchBidAnalysisData();
  }, [rfpId, filters, sorting]);

  return {
    data,
    loading,
    error,
    refresh,
    applyFilters,
    applySorting
  };
}

function createDefaultSettings() {
  return {
    id: 'default',
    organization_id: 'default',
    outlier_detection_method: 'iqr' as const,
    outlier_threshold: 1.5,
    minimum_bids_for_analysis: 3,
    technical_weight: 40.0,
    commercial_weight: 40.0,
    compliance_weight: 20.0,
    approval_threshold_amount: 100000.0,
    dual_approval_threshold: 500000.0,
    notification_preferences: {
      bid_submission: true,
      evaluation_complete: true,
      award_recommendation: true,
      protest_filed: true
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

function createMockBidAnalysisData(rfpId?: string): BidAnalysisDashboardData {
  const projectId = rfpId || 'RFP-2024-002';
  
  const mockProject: BidProject = {
    id: '1',
    rfp_id: projectId,
    project_name: 'MEP Systems Installation',
    project_location: 'Downtown Metro City',
    facility_id: 'FAC-001',
    total_budget: 5800000,
    project_type: 'Office Building',
    status: 'evaluation',
    bid_due_date: '2024-08-30T17:00:00Z',
    estimated_duration: 180,
    created_at: '2024-07-01T10:00:00Z',
    updated_at: '2024-08-25T15:30:00Z'
  };

  const mockVendors: BidVendor[] = [
    {
      id: 'vendor-1',
      name: 'Advanced MEP Solutions',
      company_type: 'subcontractor',
      license_number: 'MEP-2024-001',
      bonding_capacity: 15000000,
      insurance_limits: {
        general_liability: 2000000,
        professional_liability: 1000000,
        workers_comp: 1000000,
        auto_liability: 1000000
      },
      certifications: ['NECA Certified', 'SMACNA Member', 'LEED AP'],
      minority_owned: false,
      woman_owned: false,
      veteran_owned: true,
      small_business: false,
      contact_info: {
        primary_contact: 'Sarah Johnson',
        email: 'sarah.johnson@advancedmep.com',
        phone: '(555) 987-6543',
        address: '1234 Industrial Blvd, Metro City, ST 12345'
      },
      performance_history: {
        projects_completed: 87,
        avg_performance_rating: 4.7,
        on_time_delivery_rate: 94,
        budget_compliance_rate: 91,
        safety_rating: 98
      },
      prequalification_status: 'approved',
      prequalification_expiry: '2025-12-31T23:59:59Z',
      created_at: '2023-01-15T10:00:00Z',
      updated_at: '2024-08-15T14:20:00Z'
    },
    {
      id: 'vendor-2',
      name: 'Premier HVAC Corp',
      company_type: 'subcontractor',
      license_number: 'HVAC-2024-002',
      bonding_capacity: 12000000,
      insurance_limits: {
        general_liability: 2000000,
        professional_liability: 1000000,
        workers_comp: 1000000,
        auto_liability: 1000000
      },
      certifications: ['SMACNA Certified', 'NATE Certified', 'EPA Section 608'],
      minority_owned: false,
      woman_owned: false,
      veteran_owned: false,
      small_business: false,
      contact_info: {
        primary_contact: 'Michael Rodriguez',
        email: 'm.rodriguez@premierhvac.com',
        phone: '(555) 234-5678',
        address: '5678 Commerce Way, Metro City, ST 12345'
      },
      performance_history: {
        projects_completed: 65,
        avg_performance_rating: 4.5,
        on_time_delivery_rate: 89,
        budget_compliance_rate: 87,
        safety_rating: 96
      },
      prequalification_status: 'approved',
      prequalification_expiry: '2025-06-30T23:59:59Z',
      created_at: '2023-03-20T10:00:00Z',
      updated_at: '2024-08-10T16:45:00Z'
    }
  ];

  const mockLineItems: BidLineItem[] = [
    {
      id: 'line-1',
      bid_project_id: '1',
      csi_code_id: 'csi-1',
      csi_code: '23 05 00',
      item_number: '23-001',
      description: 'HVAC System - Main Air Handling Units',
      specification_section: '23700',
      quantity: 4,
      unit_of_measure: 'EA',
      engineer_estimate: 450000,
      unit_price_estimate: 112500,
      category: 'HVAC',
      subcategory: 'Air Handling',
      notes: null,
      is_allowance: false,
      is_alternate: false,
      is_unit_price: true,
      created_at: '2024-07-01T10:00:00Z',
      updated_at: '2024-08-15T14:30:00Z'
    },
    {
      id: 'line-2',
      bid_project_id: '1',
      csi_code_id: 'csi-2',
      csi_code: '23 07 00',
      item_number: '23-002',
      description: 'Ductwork and Distribution System',
      specification_section: '23300',
      quantity: 15000,
      unit_of_measure: 'LF',
      engineer_estimate: 850000,
      unit_price_estimate: 56.67,
      category: 'HVAC',
      subcategory: 'Ductwork',
      notes: null,
      is_allowance: false,
      is_alternate: false,
      is_unit_price: true,
      created_at: '2024-07-01T10:00:00Z',
      updated_at: '2024-08-15T14:30:00Z'
    }
  ];

  const mockSubmissions: VendorBidSubmission[] = [
    {
      id: 'sub-1',
      bid_project_id: '1',
      vendor_id: 'vendor-1',
      submission_date: '2024-08-28T16:30:00Z',
      total_base_bid: 5750000,
      total_alternates: 125000,
      total_bid_amount: 5875000,
      bid_bond_amount: 58750,
      performance_bond_rate: 1.0,
      unit_price_schedule: true,
      exceptions_taken: 2,
      clarifications_requested: 3,
      compliance_status: 'compliant',
      compliance_notes: 'All requirements met with minor clarifications on HVAC sequences',
      submitted_documents: {
        bid_form: true,
        bond: true,
        insurance_cert: true,
        references: true,
        financial_statements: true,
        project_schedule: true
      },
      created_at: '2024-08-28T16:30:00Z',
      updated_at: '2024-08-28T16:30:00Z'
    },
    {
      id: 'sub-2',
      bid_project_id: '1',
      vendor_id: 'vendor-2',
      submission_date: '2024-08-29T14:15:00Z',
      total_base_bid: 5920000,
      total_alternates: 85000,
      total_bid_amount: 6005000,
      bid_bond_amount: 60050,
      performance_bond_rate: 1.0,
      unit_price_schedule: true,
      exceptions_taken: 1,
      clarifications_requested: 2,
      compliance_status: 'compliant',
      compliance_notes: 'Fully compliant submission with alternative HVAC control system proposed',
      submitted_documents: {
        bid_form: true,
        bond: true,
        insurance_cert: true,
        references: true,
        financial_statements: true,
        project_schedule: true
      },
      created_at: '2024-08-29T14:15:00Z',
      updated_at: '2024-08-29T14:15:00Z'
    }
  ];

  const mockLineItemBids: VendorLineItemBid[] = [
    {
      id: 'bid-1',
      vendor_submission_id: 'sub-1',
      line_item_id: 'line-1',
      unit_price: 112500,
      total_price: 450000,
      is_alternate: false,
      is_no_bid: false,
      is_allowance: false,
      vendor_notes: 'Premium efficiency units with advanced controls',
      clarification_requested: null,
      created_at: '2024-08-28T16:30:00Z'
    },
    {
      id: 'bid-2',
      vendor_submission_id: 'sub-1',
      line_item_id: 'line-2',
      unit_price: 56.67,
      total_price: 850000,
      is_alternate: false,
      is_no_bid: false,
      is_allowance: false,
      vendor_notes: 'Includes all fittings and supports',
      clarification_requested: null,
      created_at: '2024-08-28T16:30:00Z'
    },
    {
      id: 'bid-3',
      vendor_submission_id: 'sub-2',
      line_item_id: 'line-1',
      unit_price: 118750,
      total_price: 475000,
      is_alternate: false,
      is_no_bid: false,
      is_allowance: false,
      vendor_notes: 'Standard efficiency with 5-year warranty',
      clarification_requested: null,
      created_at: '2024-08-29T14:15:00Z'
    },
    {
      id: 'bid-4',
      vendor_submission_id: 'sub-2',
      line_item_id: 'line-2',
      unit_price: 58.00,
      total_price: 870000,
      is_alternate: false,
      is_no_bid: false,
      is_allowance: false,
      vendor_notes: 'Galvanized steel with acoustic lining',
      clarification_requested: null,
      created_at: '2024-08-29T14:15:00Z'
    }
  ];

  const mockAnalyses: LineItemAnalysis[] = [
    {
      id: 'analysis-1',
      line_item_id: 'line-1',
      analysis_date: '2024-08-30T10:00:00Z',
      participating_vendors: 2,
      responding_vendors: 2,
      no_bid_count: 0,
      low_bid: 450000,
      high_bid: 475000,
      average_bid: 462500,
      median_bid: 462500,
      standard_deviation: 17677.67,
      coefficient_variation: 0.0382,
      engineer_estimate: 450000,
      avg_vs_estimate_variance: 0.0278,
      median_vs_estimate_variance: 0.0278,
      outlier_threshold: 26516.50,
      outlier_vendor_ids: [],
      outlier_count: 0,
      price_volatility: 'low',
      market_competitiveness: 'good',
      recommendation: 'Competitive pricing from both vendors with good technical solutions',
      created_at: '2024-08-30T10:00:00Z',
      updated_at: '2024-08-30T10:00:00Z'
    }
  ];

  const mockEvaluations: VendorEvaluation[] = [
    {
      id: 'eval-1',
      vendor_submission_id: 'sub-1',
      evaluator_id: 'evaluator-1',
      evaluation_date: '2024-08-30T14:00:00Z',
      technical_score: 92.5,
      technical_criteria: {
        experience: 95,
        personnel_qualifications: 90,
        project_approach: 92,
        schedule_feasibility: 94,
        quality_plan: 90,
        safety_plan: 94
      },
      commercial_score: 88.0,
      commercial_criteria: {
        price_competitiveness: 90,
        financial_stability: 88,
        bonding_capacity: 85,
        insurance_adequacy: 90,
        contract_terms: 87
      },
      compliance_score: 95.0,
      compliance_items: {
        bid_form_complete: true,
        bonds_adequate: true,
        insurance_compliant: true,
        references_satisfactory: true,
        licensing_current: true,
        minority_certification: false
      },
      composite_score: 90.3,
      ranking: 1,
      recommendation: 'award',
      evaluator_notes: 'Excellent technical approach with competitive pricing and strong track record',
      created_at: '2024-08-30T14:00:00Z',
      updated_at: '2024-08-30T14:00:00Z'
    }
  ];

  return {
    project: mockProject,
    line_items: mockLineItems,
    vendors: mockVendors,
    submissions: mockSubmissions,
    line_item_bids: mockLineItemBids,
    analyses: mockAnalyses,
    evaluations: mockEvaluations,
    adjustments: [],
    settings: createDefaultSettings()
  };
}
