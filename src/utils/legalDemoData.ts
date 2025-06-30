
import { addDays, subDays, format } from 'date-fns';

export interface LegalContract {
  id: string;
  projectOrScope: string;
  vendor: string;
  value: number;
  originalValue: number;
  percentBilled: number;
  percentComplete: number;
  endDate: string;
  status: 'active' | 'nearing_completion' | 'over_budget' | 'completed';
  type: 'construction' | 'service' | 'professional' | 'maintenance';
  changeOrdersCount: number;
  changeOrdersValue: number;
}

export interface InsuranceStatus {
  vendorName: string;
  policyType: string;
  expiryDate: string;
  status: 'valid' | 'expiring' | 'expired';
  daysToExpiry: number;
}

export interface LegalClaim {
  id: string;
  project: string;
  claimant: string;
  type: string;
  amount: number;
  status: 'active' | 'negotiation' | 'pending' | 'resolved';
  filedDate: string;
  description: string;
}

export interface ChangeOrder {
  id: string;
  contractId: string;
  project: string;
  number: string;
  description: string;
  value: number;
  status: 'signed' | 'pending_signature' | 'under_review';
  cumulativeValue: number;
}

export interface LegalAlert {
  id: string;
  type: 'contract_expiration' | 'insurance_expiring' | 'lien_release' | 'pending_approval';
  message: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  daysRemaining: number;
}

export interface ActionItem {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'Open' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  due_date?: string;
  assignee?: string;
  source_type?: string;
  source_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface LegalDemoData {
  contracts: LegalContract[];
  insuranceStatuses: InsuranceStatus[];
  claims: LegalClaim[];
  changeOrders: ChangeOrder[];
  alerts: LegalAlert[];
  actionItems: ActionItem[];
  summary: {
    totalContracts: number;
    activeContracts: number;
    totalContractValue: number;
    compliantCOIs: number;
    totalCOIs: number;
    activeClaims: number;
    pendingChangeOrders: number;
    contractsEndingSoon: number;
    complianceScore: number;
  };
  insights: {
    contractCompliance: string;
    insuranceCompliance: string;
    claimsStatus: string;
    riskAssessment: string;
  };
}

export const generateLegalDemoData = (): LegalDemoData => {
  const today = new Date();
  
  // Generate contracts
  const contracts: LegalContract[] = [
    {
      id: 'C001',
      projectOrScope: 'GC Contract – Tower Alpha',
      vendor: 'ABC Construction Corp',
      value: 50000000,
      originalValue: 48500000,
      percentBilled: 80,
      percentComplete: 80,
      endDate: format(addDays(today, 180), 'yyyy-MM-dd'),
      status: 'active',
      type: 'construction',
      changeOrdersCount: 5,
      changeOrdersValue: 1500000
    },
    {
      id: 'C002',
      projectOrScope: 'MEP Services – Tower Alpha',
      vendor: 'ElectroMech Systems',
      value: 8500000,
      originalValue: 8000000,
      percentBilled: 85,
      percentComplete: 85,
      endDate: format(addDays(today, 120), 'yyyy-MM-dd'),
      status: 'nearing_completion',
      type: 'service',
      changeOrdersCount: 3,
      changeOrdersValue: 500000
    },
    {
      id: 'C003',
      projectOrScope: 'Architect Agreement – Project Beta',
      vendor: 'Design Partners LLC',
      value: 2500000,
      originalValue: 2500000,
      percentBilled: 84,
      percentComplete: 84,
      endDate: format(addDays(today, 45), 'yyyy-MM-dd'),
      status: 'active',
      type: 'professional',
      changeOrdersCount: 0,
      changeOrdersValue: 0
    },
    {
      id: 'C004',
      projectOrScope: 'Site Security Services',
      vendor: 'SecureGuard Inc',
      value: 450000,
      originalValue: 400000,
      percentBilled: 105,
      percentComplete: 100,
      endDate: format(addDays(today, 200), 'yyyy-MM-dd'),
      status: 'over_budget',
      type: 'service',
      changeOrdersCount: 2,
      changeOrdersValue: 50000
    },
    {
      id: 'C005',
      projectOrScope: 'Elevator Maintenance Agreement',
      vendor: 'Vertical Solutions',
      value: 120000,
      originalValue: 120000,
      percentBilled: 45,
      percentComplete: 50,
      endDate: format(addDays(today, 365), 'yyyy-MM-dd'),
      status: 'active',
      type: 'maintenance',
      changeOrdersCount: 0,
      changeOrdersValue: 0
    }
  ];

  // Generate insurance statuses
  const insuranceStatuses: InsuranceStatus[] = [
    {
      vendorName: 'ABC Construction Corp',
      policyType: 'General Liability',
      expiryDate: format(addDays(today, 150), 'yyyy-MM-dd'),
      status: 'valid',
      daysToExpiry: 150
    },
    {
      vendorName: 'ElectroMech Systems',
      policyType: 'Workers Compensation',
      expiryDate: format(addDays(today, 90), 'yyyy-MM-dd'),
      status: 'valid',
      daysToExpiry: 90
    },
    {
      vendorName: 'ACME Concrete',
      policyType: 'General Liability',
      expiryDate: format(addDays(today, 22), 'yyyy-MM-dd'),
      status: 'expiring',
      daysToExpiry: 22
    },
    {
      vendorName: 'Steel Solutions',
      policyType: 'Workers Compensation',
      expiryDate: format(addDays(today, 35), 'yyyy-MM-dd'),
      status: 'expiring',
      daysToExpiry: 35
    },
    {
      vendorName: 'Design Partners LLC',
      policyType: 'Professional Liability',
      expiryDate: format(addDays(today, 200), 'yyyy-MM-dd'),
      status: 'valid',
      daysToExpiry: 200
    },
    {
      vendorName: 'SecureGuard Inc',
      policyType: 'General Liability',
      expiryDate: format(addDays(today, 75), 'yyyy-MM-dd'),
      status: 'valid',
      daysToExpiry: 75
    }
  ];

  // Generate claims
  const claims: LegalClaim[] = [
    {
      id: 'CL001',
      project: 'Tower Alpha',
      claimant: 'ABC Construction Corp',
      type: 'Delay Claim',
      amount: 200000,
      status: 'negotiation',
      filedDate: format(subDays(today, 30), 'yyyy-MM-dd'),
      description: 'Weather delays extending project timeline by 3 weeks'
    }
  ];

  // Generate change orders
  const changeOrders: ChangeOrder[] = [
    {
      id: 'CO001',
      contractId: 'C001',
      project: 'Tower Alpha',
      number: 'CO-005',
      description: 'Additional HVAC capacity for data center requirements',
      value: 125000,
      status: 'signed',
      cumulativeValue: 1200000
    },
    {
      id: 'CO002',
      contractId: 'C003',
      project: 'Project Beta',
      number: 'CO-002',
      description: 'Electrical system upgrade for enhanced capacity',
      value: 75000,
      status: 'pending_signature',
      cumulativeValue: 150000
    },
    {
      id: 'CO003',
      contractId: 'C002',
      project: 'Tower Alpha',
      number: 'CO-003',
      description: 'Additional fire safety systems',
      value: 95000,
      status: 'signed',
      cumulativeValue: 500000
    }
  ];

  // Generate alerts
  const alerts: LegalAlert[] = [
    {
      id: 'A001',
      type: 'contract_expiration',
      message: 'Architect Agreement for Project Beta ends in 45 days',
      priority: 'medium',
      dueDate: format(addDays(today, 45), 'yyyy-MM-dd'),
      daysRemaining: 45
    },
    {
      id: 'A002',
      type: 'lien_release',
      message: 'Lien release needed for Tower Alpha final payment',
      priority: 'high',
      dueDate: format(addDays(today, 7), 'yyyy-MM-dd'),
      daysRemaining: 7
    },
    {
      id: 'A003',
      type: 'insurance_expiring',
      message: 'ACME Concrete insurance expires in 22 days',
      priority: 'medium',
      dueDate: format(addDays(today, 22), 'yyyy-MM-dd'),
      daysRemaining: 22
    },
    {
      id: 'A004',
      type: 'pending_approval',
      message: 'Change Order CO-002 awaiting signature',
      priority: 'medium',
      dueDate: format(addDays(today, 14), 'yyyy-MM-dd'),
      daysRemaining: 14
    }
  ];

  // Calculate summary metrics
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const totalContractValue = contracts.reduce((sum, c) => sum + c.value, 0);
  const compliantCOIs = insuranceStatuses.filter(i => i.status === 'valid').length;
  const totalCOIs = insuranceStatuses.length;
  const activeClaims = claims.length;
  const pendingChangeOrders = changeOrders.filter(co => co.status === 'pending_signature').length;
  const contractsEndingSoon = contracts.filter(c => {
    const endDate = new Date(c.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 60 && diffDays > 0;
  }).length;

  const complianceScore = Math.round(
    ((compliantCOIs / totalCOIs) * 0.4 + 
     (activeContracts / contracts.length) * 0.3 + 
     (1 - (activeClaims / Math.max(contracts.length, 1))) * 0.3) * 100
  );

  const summary = {
    totalContracts: contracts.length,
    activeContracts,
    totalContractValue,
    compliantCOIs,
    totalCOIs,
    activeClaims,
    pendingChangeOrders,
    contractsEndingSoon,
    complianceScore
  };

  // Generate action items
  const actionItems: ActionItem[] = [
    {
      id: 'lai-001',
      project_id: 'proj-001',
      title: 'Renew ACME Concrete insurance policy',
      description: 'Follow up with ACME Concrete to renew General Liability policy expiring in 22 days',
      status: 'Open',
      priority: 'High',
      due_date: format(addDays(today, 15), 'yyyy-MM-dd'),
      assignee: 'Legal Team - Insurance Coordinator',
      source_type: 'insurance_expiry',
      source_id: 'A003',
      created_by: 'system',
      created_at: format(subDays(today, 2), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      updated_at: format(subDays(today, 2), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    },
    {
      id: 'lai-002',
      project_id: 'proj-002',
      title: 'Obtain lien release for Tower Alpha',
      description: 'Secure final lien release documentation from ABC Construction Corp for Tower Alpha project payment',
      status: 'In Progress',
      priority: 'Critical',
      due_date: format(addDays(today, 7), 'yyyy-MM-dd'),
      assignee: 'Sarah Martinez - Legal Counsel',
      source_type: 'lien_release',
      source_id: 'A002',
      created_by: 'system',
      created_at: format(subDays(today, 5), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      updated_at: format(today, "yyyy-MM-dd'T'HH:mm:ss'Z'")
    },
    {
      id: 'lai-003',
      project_id: 'proj-003',
      title: 'Execute Change Order CO-002',
      description: 'Obtain signature on pending Change Order CO-002 for electrical system upgrade on Project Beta',
      status: 'Open',
      priority: 'Medium',
      due_date: format(addDays(today, 14), 'yyyy-MM-dd'),
      assignee: 'Tom Wilson - Contracts Manager',
      source_type: 'change_order',
      source_id: 'CO002',
      created_by: 'system',
      created_at: format(subDays(today, 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      updated_at: format(subDays(today, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    },
    {
      id: 'lai-004',
      project_id: 'proj-001',
      title: 'Review delay claim from ABC Construction',
      description: 'Evaluate weather delay claim for $200,000 from ABC Construction Corp and prepare response',
      status: 'In Progress',
      priority: 'High',
      due_date: format(addDays(today, 10), 'yyyy-MM-dd'),
      assignee: 'Jennifer Park - Claims Specialist',
      source_type: 'legal_claim',
      source_id: 'CL001',
      created_by: 'system',
      created_at: format(subDays(today, 7), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      updated_at: format(subDays(today, 2), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    },
    {
      id: 'lai-005',
      project_id: 'proj-003',
      title: 'Prepare contract renewal for Design Partners',
      description: 'Draft renewal agreement for Design Partners LLC architect contract ending in 45 days',
      status: 'Open',
      priority: 'Medium',
      due_date: format(addDays(today, 30), 'yyyy-MM-dd'),
      assignee: 'Michael Chen - Contract Administrator',
      source_type: 'contract_expiry',
      source_id: 'A001',
      created_by: 'system',
      created_at: format(subDays(today, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      updated_at: format(subDays(today, 1), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    },
    {
      id: 'lai-006',
      project_id: 'proj-001',
      title: 'Audit SecureGuard contract performance',
      description: 'Review SecureGuard Inc over-budget status and assess contract terms for future projects',
      status: 'Open',
      priority: 'Low',
      due_date: format(addDays(today, 21), 'yyyy-MM-dd'),
      assignee: 'Legal Team - Contract Review',
      source_type: 'budget_variance',
      source_id: 'C004',
      created_by: 'system',
      created_at: format(subDays(today, 3), "yyyy-MM-dd'T'HH:mm:ss'Z'"),
      updated_at: format(subDays(today, 3), "yyyy-MM-dd'T'HH:mm:ss'Z'")
    }
  ];

  const insights = {
    contractCompliance: `All contracts are on track with no major issues. ${contractsEndingSoon} contract${contractsEndingSoon !== 1 ? 's' : ''} ending within 60 days - start reviewing close-out terms and renewal options.`,
    insuranceCompliance: `Insurance compliance is strong with ${compliantCOIs}/${totalCOIs} contractor COIs current. ${insuranceStatuses.filter(i => i.status === 'expiring').length} insurance policies expiring within 35 days (reminders sent). Overall risk exposure is minimal.`,
    claimsStatus: `${activeClaims} active claim${activeClaims !== 1 ? 's' : ''} totaling $${claims.reduce((sum, c) => sum + c.amount, 0).toLocaleString()}. No new claims this quarter. Legal risk remains low with ongoing disputes well-managed.`,
    riskAssessment: complianceScore >= 90 ? 'Low risk profile with strong compliance across all areas.' : 
                   complianceScore >= 75 ? 'Moderate risk - monitor expiring policies and pending items.' :
                   'Elevated risk - immediate attention needed for compliance gaps.'
  };

  return {
    contracts,
    insuranceStatuses,
    claims,
    changeOrders,
    alerts,
    actionItems,
    summary,
    insights
  };
};
