
import React, { useState } from 'react';
import AIInsightsPanel from './legal/AIInsightsPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Scale, Shield, FileText, Clock, BarChart3, Calendar, CheckCircle2, Building, DollarSign, Target, AlertTriangle, TrendingUp, Users, MapPin, Eye, Gavel, Zap, Activity } from 'lucide-react';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';
import { 
  useLegalMetrics, 
  useInsurancePolicies, 
  useInsuranceClaims, 
  useLegalContracts, 
  useLegalDisputes, 
  usePermitCompliance, 
  useLegalRiskAssessments,
  type InsurancePolicy,
  type InsuranceClaim,
  type LegalContract,
  type LegalDispute,
  type PermitCompliance,
  type LegalRiskAssessment
} from '@/hooks/useProjectMetrics';

interface LegalDashboardProps {
  projectId: string;
  activeCategory: string;
}

const LegalDashboard: React.FC<LegalDashboardProps> = ({ projectId, activeCategory }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: projects = [] } = useProjects();
  
  // Handle portfolio view
  const isPortfolioView = projectId === 'portfolio';
  const firstActiveProject = projects.find(p => p.status === 'active') || projects[0];
  const displayProjectId = isPortfolioView ? (firstActiveProject?.id || null) : projectId;
  
  // Fetch all legal and insurance data
  const { data: legalData, error, isLoading } = useLegalMetrics(displayProjectId);
  const { data: insurancePolicies } = useInsurancePolicies(displayProjectId);
  const { data: insuranceClaims } = useInsuranceClaims(displayProjectId);
  const { data: legalContracts } = useLegalContracts(displayProjectId);
  const { data: legalDisputes } = useLegalDisputes(displayProjectId);
  const { data: permitCompliance } = usePermitCompliance(displayProjectId);
  const { data: riskAssessments } = useLegalRiskAssessments(displayProjectId);
  
  const loading = isLoading;
  
  // Get the actual project name from the projects data
  const selectedProject = isPortfolioView ? null : projects.find(p => p.id === projectId);
  const displayProject = selectedProject || firstActiveProject;
  const projectName = isPortfolioView ? 'Portfolio Legal Overview' : displayProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);

  // Provide fallback data for portfolio view or when data is unavailable
  const fallbackData = {
    contracts_active: 15,
    contracts_pending: 3,
    compliance_score: 92,
    legal_risks: 2,
    documentation_complete: 88
  };

  const effectiveData = legalData || (isPortfolioView ? {
    contracts_active: 42, // Portfolio total
    contracts_pending: 8, // Portfolio total
    compliance_score: 94, // Portfolio average
    legal_risks: 3, // Portfolio total
    documentation_complete: 91 // Portfolio average
  } : fallbackData);

  if (error && !isPortfolioView) {
    console.error('Error fetching legal metrics:', error);
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-400">Error loading legal data</div>
      </div>
    );
  }

  if (loading && !isPortfolioView) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-foreground">Loading legal data...</div>
      </div>
    );
  }

  // Calculate comprehensive metrics from all data sources
  const totalInsurancePolicies = insurancePolicies?.length || 0;
  const activePolicies = insurancePolicies?.filter(p => p.status === 'active').length || 0;
  const totalClaims = insuranceClaims?.length || 0;
  const openClaims = insuranceClaims?.filter(c => c.status === 'open' || c.status === 'investigating').length || 0;
  const totalContracts = legalContracts?.length || 0;
  const activeContracts = legalContracts?.filter(c => c.status === 'active').length || 0;
  const totalDisputes = legalDisputes?.length || 0;
  const activeDisputes = legalDisputes?.filter(d => d.status === 'active' || d.status === 'mediation' || d.status === 'arbitration').length || 0;
  const totalPermits = permitCompliance?.length || 0;
  const issuedPermits = permitCompliance?.filter(p => p.status === 'issued').length || 0;
  const highRisks = riskAssessments?.filter(r => r.risk_score >= 15).length || 0;
  
  const totalInsuranceValue = insurancePolicies?.reduce((sum, policy) => sum + (policy.coverage_amount || 0), 0) || 0;
  const totalContractValue = legalContracts?.reduce((sum, contract) => sum + (contract.contract_value || 0), 0) || 0;
  const totalClaimAmount = insuranceClaims?.reduce((sum, claim) => sum + (claim.claim_amount || 0), 0) || 0;
  const totalDisputeAmount = legalDisputes?.reduce((sum, dispute) => sum + (dispute.amount_in_dispute || 0), 0) || 0;

  // Transform Supabase data to match AI panel expectations
  const transformedData = {
    summary: {
      activeContracts: activeContracts,
      totalContracts: totalContracts,
      complianceScore: effectiveData.compliance_score || 0,
      activeClaims: openClaims,
      compliantCOIs: activePolicies,
      totalCOIs: totalInsurancePolicies,
      totalContractValue: totalContractValue,
      contractsEndingSoon: 2
    },
    insights: {
      contractCompliance: `${activeContracts} active contracts with ${effectiveData.compliance_score || 0}% compliance rate`,
      insuranceCompliance: `${activePolicies}/${totalInsurancePolicies} insurance policies active`,
      claimsStatus: `${openClaims} open claims totaling $${(totalClaimAmount / 1000000).toFixed(1)}M`,
      riskAssessment: `${highRisks} high-risk items requiring immediate attention`
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'issued':
      case 'passed':
        return 'text-green-400';
      case 'pending':
      case 'under_review':
      case 'investigating':
        return 'text-yellow-400';
      case 'expired':
      case 'denied':
      case 'failed':
        return 'text-red-400';
      case 'settled':
      case 'completed':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 20) return 'text-red-400';
    if (score >= 15) return 'text-orange-400';
    if (score >= 10) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">
            {title}
          </h1>
          <p className="text-muted-foreground mt-1">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <Scale className="w-4 h-4 mr-2" />
            {effectiveData.compliance_score}% Compliant
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <Shield className="w-4 h-4 mr-2" />
            {totalInsuranceValue > 0 ? formatCurrency(totalInsuranceValue) : '0'} Coverage
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {highRisks} High Risks
          </Badge>
        </div>
      </div>

      <AIInsightsPanel projectData={transformedData} />
      
      {/* Owner Legal Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Owner Legal Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <FileText className="w-4 h-4 mr-2" />
              Review Major Contracts
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              Meet with Legal Counsel
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Sign Change Orders
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Shield className="w-4 h-4 mr-2" />
              Review Insurance Coverage
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Scale className="w-4 h-4 mr-2" />
              Address Owner Disputes
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Target className="w-4 h-4 mr-2" />
              Generate Compliance Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Contract Value</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalContractValue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Insurance Coverage</p>
                <p className="text-2xl font-bold text-foreground">{formatCurrency(totalInsuranceValue)}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Disputes</p>
                <p className="text-2xl font-bold text-foreground">{activeDisputes}</p>
                <p className="text-xs text-muted-foreground">{formatCurrency(totalDisputeAmount)} at stake</p>
              </div>
              <Gavel className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold text-foreground">{effectiveData.compliance_score}%</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabbed Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-6 bg-muted border-border">
          <TabsTrigger value="overview" className="text-foreground data-[state=active]:bg-card">Overview</TabsTrigger>
          <TabsTrigger value="contracts" className="text-foreground data-[state=active]:bg-card">Contracts</TabsTrigger>
          <TabsTrigger value="insurance" className="text-foreground data-[state=active]:bg-card">Insurance</TabsTrigger>
          <TabsTrigger value="disputes" className="text-foreground data-[state=active]:bg-card">Disputes</TabsTrigger>
          <TabsTrigger value="permits" className="text-foreground data-[state=active]:bg-card">Permits</TabsTrigger>
          <TabsTrigger value="risks" className="text-foreground data-[state=active]:bg-card">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Contract Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Contracts</span>
                    <Badge variant="outline" className="bg-card text-foreground border-border">{totalContracts}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Contracts</span>
                    <Badge variant="outline" className="bg-card text-foreground border-border">{activeContracts}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Value</span>
                    <Badge variant="outline" className="bg-card text-foreground border-border">{formatCurrency(totalContractValue)}</Badge>
                  </div>
                  <Progress value={(activeContracts / Math.max(totalContracts, 1)) * 100} className="w-full" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Insurance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Policies</span>
                    <Badge variant="outline" className="bg-card text-foreground border-border">{totalInsurancePolicies}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Active Policies</span>
                    <Badge variant="outline" className="bg-card text-foreground border-border">{activePolicies}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Coverage</span>
                    <Badge variant="outline" className="bg-card text-foreground border-border">{formatCurrency(totalInsuranceValue)}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Open Claims</span>
                    <Badge variant={openClaims > 0 ? "destructive" : "outline"} className="bg-card text-foreground border-border">{openClaims}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="grid gap-4">
            {legalContracts?.map((contract: LegalContract) => (
              <Card key={contract.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{contract.title}</h3>
                      <p className="text-sm text-muted-foreground">{contract.counterparty}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Type: {contract.contract_type}</span>
                        <span>Value: {contract.contract_value ? formatCurrency(contract.contract_value) : 'N/A'}</span>
                        <span>Start: {new Date(contract.start_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
                  </div>
                  {contract.key_obligations && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Key Obligations:</p>
                      <p className="text-sm text-foreground">{contract.key_obligations}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )) || (
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No contracts found for this project.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-4">
          <div className="grid gap-4">
            {insurancePolicies?.map((policy: InsurancePolicy) => (
              <Card key={policy.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{policy.policy_type.replace('_', ' ').toUpperCase()}</h3>
                      <p className="text-sm text-muted-foreground">{policy.insurance_company}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Policy: {policy.policy_number}</span>
                        <span>Coverage: {formatCurrency(policy.coverage_amount)}</span>
                        <span>Expires: {new Date(policy.expiration_date).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(policy.status)}>{policy.status}</Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Deductible</p>
                      <p className="text-foreground">{formatCurrency(policy.deductible)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Premium</p>
                      <p className="text-foreground">{formatCurrency(policy.premium_amount)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Auto Renewal</p>
                      <p className="text-foreground">{policy.auto_renewal ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No insurance policies found for this project.</p>
                </CardContent>
              </Card>
            )}
            
            {insuranceClaims && insuranceClaims.length > 0 && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-foreground">Insurance Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {insuranceClaims.map((claim: InsuranceClaim) => (
                      <div key={claim.id} className="flex justify-between items-center p-3 border border-border rounded">
                        <div>
                          <p className="text-foreground font-medium">{claim.claim_number}</p>
                          <p className="text-sm text-muted-foreground">{claim.description}</p>
                          <p className="text-xs text-muted-foreground">Reported: {new Date(claim.reported_date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(claim.status)}>{claim.status}</Badge>
                          <p className="text-sm text-foreground mt-1">{claim.claim_amount ? formatCurrency(claim.claim_amount) : 'TBD'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="disputes" className="space-y-4">
          <div className="grid gap-4">
            {legalDisputes?.map((dispute: LegalDispute) => (
              <Card key={dispute.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{dispute.dispute_type.toUpperCase()} Dispute</h3>
                      <p className="text-sm text-muted-foreground">vs. {dispute.counterparty}</p>
                      <p className="text-sm text-foreground">{dispute.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Filed: {new Date(dispute.filed_date).toLocaleDateString()}</span>
                        {dispute.amount_in_dispute && <span>Amount: {formatCurrency(dispute.amount_in_dispute)}</span>}
                        {dispute.legal_counsel && <span>Counsel: {dispute.legal_counsel}</span>}
                      </div>
                    </div>
                    <Badge className={getStatusColor(dispute.status)}>{dispute.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No legal disputes found for this project.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="permits" className="space-y-4">
          <div className="grid gap-4">
            {permitCompliance?.map((permit: PermitCompliance) => (
              <Card key={permit.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{permit.permit_type.toUpperCase()} Permit</h3>
                      <p className="text-sm text-muted-foreground">{permit.issuing_authority}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {permit.permit_number && <span>#{permit.permit_number}</span>}
                        {permit.issued_date && <span>Issued: {new Date(permit.issued_date).toLocaleDateString()}</span>}
                        {permit.expiration_date && <span>Expires: {new Date(permit.expiration_date).toLocaleDateString()}</span>}
                        {permit.cost && <span>Cost: {formatCurrency(permit.cost)}</span>}
                      </div>
                    </div>
                    <Badge className={getStatusColor(permit.status)}>{permit.status}</Badge>
                  </div>
                  {permit.inspection_required && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Inspection Status: 
                        <span className={getStatusColor(permit.inspection_status || 'pending')}>
                          {permit.inspection_status || 'Pending'}
                        </span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )) || (
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No permits found for this project.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <div className="grid gap-4">
            {riskAssessments?.map((risk: LegalRiskAssessment) => (
              <Card key={risk.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{risk.risk_category.toUpperCase()} Risk</h3>
                      <p className="text-sm text-foreground">{risk.risk_description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Probability: <span className="text-foreground">{risk.probability}</span></span>
                        <span>Impact: <span className="text-foreground">{risk.impact}</span></span>
                        {risk.responsible_party && <span>Owner: {risk.responsible_party}</span>}
                      </div>
                      {risk.mitigation_strategy && (
                        <div className="mt-2">
                          <p className="text-sm text-muted-foreground">Mitigation:</p>
                          <p className="text-sm text-foreground">{risk.mitigation_strategy}</p>
                        </div>
                      )}
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getRiskColor(risk.risk_score)}>Score: {risk.risk_score}</Badge>
                      <Badge className={getStatusColor(risk.status)}>{risk.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) || (
              <Card className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">No risk assessments found for this project.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LegalDashboard;
