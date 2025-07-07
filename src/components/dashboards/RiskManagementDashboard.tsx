import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Shield, 
  TrendingUp, 
  TrendingDown,
  Clock,
  DollarSign,
  FileText,
  Target,
  BarChart3,
  Activity,
  Zap,
  Users,
  Building,
  MapPin,
  Eye,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart, 
  Bar,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';

interface RiskManagementDashboardProps {
  projectId: string;
  activeCategory: string;
}

const RiskManagementDashboard: React.FC<RiskManagementDashboardProps> = ({ projectId, activeCategory }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: projects = [] } = useProjects();
  
  // Handle portfolio view
  const isPortfolioView = projectId === 'portfolio';
  const firstActiveProject = projects.find(p => p.status === 'active') || projects[0];
  const displayProjectId = isPortfolioView ? (firstActiveProject?.id || null) : projectId;
  
  // Get the actual project name from the projects data
  const selectedProject = isPortfolioView ? null : projects.find(p => p.id === projectId);
  const displayProject = selectedProject || firstActiveProject;
  const projectName = isPortfolioView ? 'Portfolio Risk Management' : displayProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);

  // Comprehensive risk metrics for owners
  const riskMetrics = {
    overallRiskScore: 68, // Medium risk
    financialExposure: 8500000,
    insuranceCoverage: 45000000,
    activeClaims: 2,
    complianceScore: 94,
    criticalRisks: 3,
    highRisks: 8,
    mediumRisks: 15,
    lowRisks: 24
  };

  // Financial risk analysis
  const financialRisks = [
    {
      category: 'Market Risk',
      description: 'Property value fluctuation due to market conditions',
      likelihood: 'High',
      impact: 'High',
      riskScore: 85,
      financialExposure: 3200000,
      mitigation: 'Diversified portfolio strategy, market monitoring',
      owner: 'Investment Committee',
      status: 'Active',
      lastReview: '2024-12-01'
    },
    {
      category: 'Interest Rate Risk',
      description: 'Rising interest rates affecting financing costs',
      likelihood: 'Medium',
      impact: 'High',
      riskScore: 72,
      financialExposure: 1800000,
      mitigation: 'Rate hedging instruments, fixed-rate financing',
      owner: 'Finance Team',
      status: 'Monitored',
      lastReview: '2024-11-28'
    },
    {
      category: 'Tenant Credit Risk',
      description: 'Major tenant bankruptcy or lease default',
      likelihood: 'Low',
      impact: 'High',
      riskScore: 45,
      financialExposure: 2400000,
      mitigation: 'Credit screening, diversified tenant base',
      owner: 'Leasing Team',
      status: 'Controlled',
      lastReview: '2024-12-05'
    },
    {
      category: 'Construction Cost Overrun',
      description: 'Project costs exceeding budget estimates',
      likelihood: 'Medium',
      impact: 'Medium',
      riskScore: 58,
      financialExposure: 1100000,
      mitigation: 'Fixed-price contracts, contingency reserves',
      owner: 'Project Manager',
      status: 'Active',
      lastReview: '2024-12-03'
    }
  ];

  // Operational risks
  const operationalRisks = [
    {
      category: 'Property Damage',
      description: 'Natural disasters, fire, vandalism',
      likelihood: 'Low',
      impact: 'High',
      riskScore: 42,
      mitigation: 'Comprehensive insurance, security systems',
      status: 'Controlled'
    },
    {
      category: 'Regulatory Compliance',
      description: 'Changes in zoning, building codes, safety regulations',
      likelihood: 'Medium',
      impact: 'Medium',
      riskScore: 55,
      mitigation: 'Regular compliance audits, legal monitoring',
      status: 'Monitored'
    },
    {
      category: 'Technology Systems',
      description: 'Building management system failures',
      likelihood: 'Medium',
      impact: 'Low',
      riskScore: 35,
      mitigation: 'Redundant systems, maintenance contracts',
      status: 'Controlled'
    }
  ];

  // Insurance coverage breakdown
  const insuranceCoverage = [
    { type: 'General Liability', coverage: 15000000, premium: 48000, status: 'Active', expiry: '2025-03-15' },
    { type: 'Property Insurance', coverage: 25000000, premium: 125000, status: 'Active', expiry: '2025-02-28' },
    { type: 'Builders Risk', coverage: 8000000, premium: 22000, status: 'Active', expiry: '2025-06-30' },
    { type: 'Professional Liability', coverage: 5000000, premium: 15000, status: 'Active', expiry: '2025-04-15' },
    { type: 'Cyber Liability', coverage: 2000000, premium: 8500, status: 'Active', expiry: '2025-05-01' }
  ];

  // Risk trend data
  const riskTrends = [
    { month: 'Jul', overall: 65, financial: 70, operational: 45, regulatory: 55 },
    { month: 'Aug', overall: 68, financial: 72, operational: 48, regulatory: 58 },
    { month: 'Sep', overall: 64, financial: 68, operational: 42, regulatory: 52 },
    { month: 'Oct', overall: 66, financial: 71, operational: 44, regulatory: 54 },
    { month: 'Nov', overall: 69, financial: 75, operational: 46, regulatory: 57 },
    { month: 'Dec', overall: 68, financial: 73, operational: 45, regulatory: 56 }
  ];

  // Claims and incidents
  const recentClaims = [
    {
      id: 'CLM-2024-001',
      type: 'Property Damage',
      description: 'Water damage from pipe burst - 3rd floor',
      dateReported: '2024-11-15',
      status: 'Open',
      estimatedValue: 85000,
      insurer: 'ABC Insurance',
      adjuster: 'John Smith'
    },
    {
      id: 'CLM-2024-002',
      type: 'Liability',
      description: 'Slip and fall incident in lobby',
      dateReported: '2024-10-28',
      status: 'Investigating',
      estimatedValue: 25000,
      insurer: 'XYZ Liability',
      adjuster: 'Sarah Johnson'
    }
  ];

  // Risk mitigation action items
  const actionItems = [
    {
      priority: 'High',
      description: 'Review and update property insurance coverage limits',
      owner: 'Risk Manager',
      dueDate: '2024-12-20',
      status: 'In Progress'
    },
    {
      priority: 'Medium',
      description: 'Conduct quarterly tenant credit review',
      owner: 'Leasing Manager',
      dueDate: '2024-12-31',
      status: 'Pending'
    },
    {
      priority: 'High',
      description: 'Implement enhanced security measures',
      owner: 'Operations Manager',
      dueDate: '2025-01-15',
      status: 'Planning'
    }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-500';
    if (score >= 60) return 'text-orange-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };

  const getRiskBadgeColor = (likelihood: string) => {
    switch (likelihood.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-400';
      case 'open': return 'text-red-400';
      case 'investigating': return 'text-yellow-400';
      case 'controlled': return 'text-blue-400';
      case 'monitored': return 'text-orange-400';
      default: return 'text-gray-400';
    }
  };

  const pieColors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];

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
            <Shield className="w-4 h-4 mr-2" />
            Risk Score: {riskMetrics.overallRiskScore}
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <DollarSign className="w-4 h-4 mr-2" />
            ${(riskMetrics.financialExposure / 1000000).toFixed(1)}M Exposure
          </Badge>
          <Badge variant="outline" className="bg-card text-foreground border-border">
            <AlertTriangle className="w-4 h-4 mr-2" />
            {riskMetrics.criticalRisks} Critical Risks
          </Badge>
        </div>
      </div>

      {/* AI Risk Insights */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Activity className="w-5 h-5 text-red-400" />
              AI Risk Analysis & Insights
            </CardTitle>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Live Monitoring</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{riskMetrics.overallRiskScore}</div>
              <div className="text-sm text-muted-foreground">Risk Score</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{riskMetrics.criticalRisks}</div>
              <div className="text-sm text-muted-foreground">Critical Risks</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">${(riskMetrics.financialExposure / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-muted-foreground">Financial Exposure</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{riskMetrics.complianceScore}%</div>
              <div className="text-sm text-muted-foreground">Compliance</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-card/50 rounded-lg p-4">
            <p className="text-foreground text-sm">
              Portfolio risk assessment shows medium exposure with {riskMetrics.criticalRisks} critical risks requiring immediate attention. Financial exposure of ${(riskMetrics.financialExposure / 1000000).toFixed(1)}M is adequately covered by ${(riskMetrics.insuranceCoverage / 1000000).toFixed(1)}M insurance. Compliance score at {riskMetrics.complianceScore}% indicates strong regulatory adherence.
            </p>
          </div>
          
          {/* Key Insights and Recommendations */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Critical Risk Areas</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• Market volatility driving property value risk exposure to $3.2M</li>
                <li>• Interest rate sensitivity affecting $1.8M in variable rate debt</li>
                <li>• Tenant concentration risk with major lease renewals pending</li>
                <li>• Construction cost overruns threatening $1.1M project budget</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Immediate Actions</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Execute interest rate hedging strategy for $1.8M exposure</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Accelerate tenant diversification and lease renewal negotiations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Review property insurance coverage limits before renewal</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
            <Target className="h-5 w-5 text-muted-foreground" />
            Risk Management Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Review Critical Risks
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Shield className="w-4 h-4 mr-2" />
              Update Insurance
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <FileText className="w-4 h-4 mr-2" />
              Compliance Audit
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <BarChart3 className="w-4 h-4 mr-2" />
              Risk Assessment
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Users className="w-4 h-4 mr-2" />
              Team Meeting
            </Button>
            <Button variant="outline" className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Eye className="w-4 h-4 mr-2" />
              Monitor Trends
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Risk Overview KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Risk Score</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getRiskColor(riskMetrics.overallRiskScore)}`}>{riskMetrics.overallRiskScore}</div>
            <div className="text-xs text-muted-foreground mt-1">Medium Risk Level</div>
            <Progress value={riskMetrics.overallRiskScore} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Financial Exposure</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">${(riskMetrics.financialExposure / 1000000).toFixed(1)}M</div>
            <div className="text-xs text-muted-foreground mt-1">Total risk exposure</div>
            <div className="flex items-center mt-2 text-green-400">
              <TrendingDown className="w-4 h-4 mr-1" />
              <span className="text-sm">-12% vs last quarter</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Insurance Coverage</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">${(riskMetrics.insuranceCoverage / 1000000).toFixed(0)}M</div>
            <div className="text-xs text-muted-foreground mt-1">Coverage ratio: 5.3x</div>
            <div className="flex items-center mt-2 text-green-400">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              <span className="text-sm">Adequate coverage</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{riskMetrics.activeClaims}</div>
            <div className="text-xs text-muted-foreground mt-1">Open insurance claims</div>
            <div className="flex items-center mt-2 text-orange-400">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">Avg 45 days resolution</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed Risk Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-muted border-border">
          <TabsTrigger value="overview" className="text-foreground data-[state=active]:bg-card">Risk Portfolio</TabsTrigger>
          <TabsTrigger value="financial" className="text-foreground data-[state=active]:bg-card">Financial Risks</TabsTrigger>
          <TabsTrigger value="operational" className="text-foreground data-[state=active]:bg-card">Operations</TabsTrigger>
          <TabsTrigger value="insurance" className="text-foreground data-[state=active]:bg-card">Insurance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risk Distribution */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">Risk Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Critical', value: riskMetrics.criticalRisks, color: '#ef4444' },
                        { name: 'High', value: riskMetrics.highRisks, color: '#f97316' },
                        { name: 'Medium', value: riskMetrics.mediumRisks, color: '#eab308' },
                        { name: 'Low', value: riskMetrics.lowRisks, color: '#22c55e' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieColors.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Risk Trends */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-foreground">Risk Score Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={riskTrends}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-sm" />
                    <YAxis className="text-sm" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="overall" stroke="#3b82f6" strokeWidth={3} name="Overall" />
                    <Line type="monotone" dataKey="financial" stroke="#ef4444" strokeWidth={2} name="Financial" />
                    <Line type="monotone" dataKey="operational" stroke="#10b981" strokeWidth={2} name="Operational" />
                    <Line type="monotone" dataKey="regulatory" stroke="#f59e0b" strokeWidth={2} name="Regulatory" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4">
            {financialRisks.map((risk, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{risk.category}</h3>
                      <p className="text-sm text-muted-foreground">{risk.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted-foreground">Owner: {risk.owner}</span>
                        <span className="text-muted-foreground">Last Review: {risk.lastReview}</span>
                        <span className="text-muted-foreground">Exposure: ${(risk.financialExposure / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getRiskColor(risk.riskScore)}>
                        Score: {risk.riskScore}
                      </Badge>
                      <Badge className={getStatusColor(risk.status)}>
                        {risk.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center gap-4 mb-2">
                        <Badge className={getRiskBadgeColor(risk.likelihood)}>
                          {risk.likelihood} Likelihood
                        </Badge>
                        <Badge className={getRiskBadgeColor(risk.impact)}>
                          {risk.impact} Impact
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mitigation:</p>
                      <p className="text-sm text-foreground">{risk.mitigation}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-4">
          <div className="grid gap-4">
            {operationalRisks.map((risk, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">{risk.category}</h3>
                      <p className="text-sm text-muted-foreground">{risk.description}</p>
                      <div className="flex items-center gap-4">
                        <Badge className={getRiskBadgeColor(risk.likelihood)}>
                          {risk.likelihood} Likelihood
                        </Badge>
                        <Badge className={getRiskBadgeColor(risk.impact)}>
                          {risk.impact} Impact
                        </Badge>
                        <Badge className={getStatusColor(risk.status)}>
                          {risk.status}
                        </Badge>
                      </div>
                    </div>
                    <div className={`text-2xl font-bold ${getRiskColor(risk.riskScore)}`}>
                      {risk.riskScore}
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Mitigation Strategy:</p>
                    <p className="text-sm text-foreground">{risk.mitigation}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="space-y-4">
          <div className="grid gap-4">
            {/* Insurance Coverage Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-foreground">Coverage Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {insuranceCoverage.map((policy, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border border-border rounded">
                        <div>
                          <p className="text-foreground font-medium">{policy.type}</p>
                          <p className="text-sm text-muted-foreground">Expires: {policy.expiry}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-foreground font-medium">${(policy.coverage / 1000000).toFixed(0)}M</p>
                          <p className="text-sm text-muted-foreground">${policy.premium.toLocaleString()}/year</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-foreground">Active Claims</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentClaims.map((claim) => (
                      <div key={claim.id} className="p-3 border border-border rounded">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-foreground font-medium">{claim.id}</p>
                            <p className="text-sm text-muted-foreground">{claim.type}</p>
                          </div>
                          <Badge className={getStatusColor(claim.status)}>
                            {claim.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground mb-2">{claim.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          <span>Reported: {claim.dateReported}</span>
                          <span>Value: ${claim.estimatedValue.toLocaleString()}</span>
                          <span>Insurer: {claim.insurer}</span>
                          <span>Adjuster: {claim.adjuster}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Action Items */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">Risk Management Action Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {actionItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border rounded">
                <div className="flex items-center gap-4">
                  <Badge className={item.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}>
                    {item.priority}
                  </Badge>
                  <div>
                    <p className="text-foreground font-medium">{item.description}</p>
                    <p className="text-sm text-muted-foreground">Owner: {item.owner} • Due: {item.dueDate}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RiskManagementDashboard;
