import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  MapPin,
  Globe,
  DollarSign,
  Users,
  Clock,
  CheckCircle,
  CheckCircle2,
  TrendingUp,
  Shield,
  AlertTriangle,
  Target,
  Calendar,
  Building,
  Zap,
  BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboardTitle } from '@/utils/dashboardUtils';
import { useProjects } from '@/hooks/useProjects';

interface PlanningDashboardProps {
  projectId: string;
  activeCategory: string;
}

const PlanningDashboard: React.FC<PlanningDashboardProps> = ({ projectId, activeCategory }) => {
  const { data: projects = [] } = useProjects();
  
  // Get the actual project name from the projects data
  const selectedProject = projects.find(p => p.id === projectId);
  const projectName = selectedProject?.name;
  
  const { title, subtitle } = getDashboardTitle(activeCategory, projectName);
  // Comprehensive planning phase data
  const planningMetrics = {
    projectPhase: 'Site Selection',
    overallProgress: 45,
    timelineProgress: {
      feasibilityStudy: 100,
      siteAnalysis: 85,
      businessCase: 70,
      stakeholderApproval: 30,
      permitPrep: 0
    },
    budgetAllocation: {
      feasibilityStudies: 250000,
      siteAcquisition: 8500000,
      legalFees: 180000,
      consultingFees: 420000,
      contingency: 800000
    }
  };
  
  // Site analysis data
  const siteOptions = [
    {
      id: 1,
      name: 'Downtown Business District',
      address: '1200 Main Street, Metro City',
      score: 92,
      pros: ['Prime location', 'Public transport access', 'High foot traffic'],
      cons: ['Higher cost', 'Zoning restrictions'],
      cost: 12500000,
      size: '2.3 acres',
      zoning: 'Commercial Mixed-Use',
      selected: true,
      dueDate: '2024-07-15'
    },
    {
      id: 2,
      name: 'Suburban Commercial Hub',
      address: '450 Commerce Blvd, Westfield',
      score: 78,
      pros: ['Lower cost', 'Ample parking', 'Growing area'],
      cons: ['Less foot traffic', 'Limited transit'],
      cost: 8300000,
      size: '3.1 acres',
      zoning: 'Commercial',
      selected: false,
      dueDate: '2024-07-22'
    },
    {
      id: 3,
      name: 'Industrial District',
      address: '890 Industry Way, Port District',
      score: 65,
      pros: ['Very low cost', 'Large lot size', 'Easy logistics'],
      cons: ['Poor location', 'Limited amenities'],
      cost: 5100000,
      size: '4.8 acres',
      zoning: 'Industrial',
      selected: false,
      dueDate: '2024-07-29'
    }
  ];
  
  // Market analysis data
  const marketAnalysis = {
    targetMarket: 'Class A Office Space',
    demandForecast: 'Strong',
    competitiveLandscape: 'Moderate Competition',
    marketTrends: [
      { trend: 'Remote Work Impact', impact: 'Medium', status: 'Monitored' },
      { trend: 'ESG Requirements', impact: 'High', status: 'Incorporated' },
      { trend: 'Tech Integration', impact: 'High', status: 'Planned' }
    ],
    demographics: {
      primaryTenants: 'Tech Companies',
      avgLeaseSize: '5,200 sq ft',
      targetRent: '$65/sq ft',
      occupancyRate: '94%'
    }
  };
  
  // Financial projections
  const financialProjections = [
    { year: 'Year 1', revenue: 0, expenses: 2800000, netIncome: -2800000 },
    { year: 'Year 2', revenue: 4200000, expenses: 3200000, netIncome: 1000000 },
    { year: 'Year 3', revenue: 8900000, expenses: 3800000, netIncome: 5100000 },
    { year: 'Year 4', revenue: 12400000, expenses: 4200000, netIncome: 8200000 },
    { year: 'Year 5', revenue: 13800000, expenses: 4500000, netIncome: 9300000 }
  ];
  
  // Risk assessment
  const riskFactors = [
    {
      category: 'Market Risk',
      level: 'Medium',
      description: 'Office demand volatility post-pandemic',
      mitigation: 'Flexible space design, mixed-use components',
      probability: 40,
      impact: 'High'
    },
    {
      category: 'Regulatory Risk',
      level: 'Low',
      description: 'Zoning and permit delays',
      mitigation: 'Early engagement with city planning',
      probability: 20,
      impact: 'Medium'
    },
    {
      category: 'Construction Risk',
      level: 'Medium',
      description: 'Material cost inflation',
      mitigation: 'Fixed-price contracts, value engineering',
      probability: 60,
      impact: 'Medium'
    },
    {
      category: 'Financial Risk',
      level: 'Low',
      description: 'Interest rate fluctuation',
      mitigation: 'Rate hedging strategies',
      probability: 30,
      impact: 'Medium'
    }
  ];
  
  // Stakeholder matrix
  const stakeholders = [
    {
      name: 'City Planning Commission',
      role: 'Regulatory Approval',
      influence: 'High',
      engagement: 'Active',
      status: 'Supportive',
      lastContact: '2024-06-18',
      nextAction: 'Zoning presentation'
    },
    {
      name: 'Neighborhood Association',
      role: 'Community Representative',
      influence: 'Medium',
      engagement: 'Regular',
      status: 'Neutral',
      lastContact: '2024-06-15',
      nextAction: 'Community meeting'
    },
    {
      name: 'Environmental Agency',
      role: 'Environmental Compliance',
      influence: 'High',
      engagement: 'Scheduled',
      status: 'Pending Review',
      lastContact: '2024-06-10',
      nextAction: 'Impact assessment'
    },
    {
      name: 'Major Tenant Prospects',
      role: 'Pre-leasing Partners',
      influence: 'High',
      engagement: 'Active',
      status: 'Interested',
      lastContact: '2024-06-20',
      nextAction: 'LOI negotiations'
    }
  ];
  
  // Planning milestones
  const planningMilestones = [
    {
      id: 1,
      milestone: 'Market Research Completion',
      dueDate: '2024-05-15',
      status: 'completed',
      progress: 100,
      owner: 'Market Research Team'
    },
    {
      id: 2,
      milestone: 'Site Selection Finalized',
      dueDate: '2024-07-01',
      status: 'in-progress',
      progress: 85,
      owner: 'Development Team'
    },
    {
      id: 3,
      milestone: 'Business Case Approval',
      dueDate: '2024-07-15',
      status: 'in-progress',
      progress: 70,
      owner: 'Executive Committee'
    },
    {
      id: 4,
      milestone: 'Funding Secured',
      dueDate: '2024-08-01',
      status: 'pending',
      progress: 30,
      owner: 'Finance Team'
    },
    {
      id: 5,
      milestone: 'Permits & Approvals',
      dueDate: '2024-09-30',
      status: 'pending',
      progress: 0,
      owner: 'Legal & Regulatory'
    }
  ];
  
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'High': return 'bg-red-100 text-red-700';
      default: return 'bg-[#0D1117] text-gray-700';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'Supportive': return 'bg-green-100 text-green-700';
      case 'Neutral': return 'bg-yellow-100 text-yellow-700';
      case 'Interested': return 'bg-blue-100 text-blue-700';
      default: return 'bg-[#0D1117] text-gray-700';
    }
  };
  
  return (
    <div className="min-h-screen bg-[#0D1117] p-6 space-y-6">
      {/* Planning Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            {title}
          </h1>
          <p className="text-slate-400 mt-1">
            {subtitle}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-[#0D1117] text-slate-300 border-slate-700">
            <Target className="w-4 h-4 mr-2" />
            {planningMetrics.overallProgress}% Complete
          </Badge>
          <Badge variant="outline" className="bg-[#0D1117] text-slate-300 border-slate-700">
            Phase: {planningMetrics.projectPhase}
          </Badge>
        </div>
      </div>

      {/* AI Planning Insights */}
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Zap className="w-5 h-5 text-blue-400" />
              AI Strategic Planning Insights
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{planningMetrics.overallProgress}%</div>
              <div className="text-sm text-slate-400">Planning Progress</div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{siteOptions.find(s => s.selected)?.score || 0}</div>
              <div className="text-sm text-slate-400">Site Score</div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">18.2%</div>
              <div className="text-sm text-slate-400">Projected ROI</div>
            </div>
            <div className="bg-[#0D1117] rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-white">{riskFactors.filter(r => r.level === 'Medium').length}</div>
              <div className="text-sm text-slate-400">Active Risks</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-[#0D1117]/50 rounded-lg p-4">
            <p className="text-slate-300 text-sm">
              Strategic planning at {planningMetrics.overallProgress}% completion with Downtown Business District selected (score: 92/100). Market analysis shows strong demand for Class A office space with 94% occupancy rates. Financial projections indicate 18.2% ROI with manageable risk profile.
            </p>
          </div>
          
          {/* Key Insights and Recommendations */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-white">Key Insights</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li>• Site selection favors Downtown Business District with 92/100 score despite higher cost</li>
                <li>• Market demand strong with 94% occupancy rates and $65/sq ft target achievable</li>
                <li>• Financial model projects 18.2% IRR exceeding 15% target threshold</li>
                <li>• Stakeholder alignment proceeding with {stakeholders.filter(s => s.status === 'Supportive').length} supportive parties</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-white">Recommendations</span>
              </div>
              <ul className="space-y-2 text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Finalize site selection by July 1st to maintain project timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Secure zoning pre-approval to mitigate regulatory risks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Begin stakeholder alignment for business case approval</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <Clock className="h-5 w-5 text-slate-400" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Target className="w-4 h-4 mr-2" />
              Finalize Site Selection
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Stakeholder Meetings
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Review Business Case
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Update Risk Mitigation
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Financial Model Review
            </Button>
            <Button variant="outline" className="justify-start border-slate-700 hover:bg-[#0D1117] text-slate-300 hover:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Market Analysis Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Planning KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Planning Progress */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Planning Progress</CardTitle>
            <Target className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{planningMetrics.overallProgress}%</div>
            <div className="text-xs text-slate-400 mt-1">5 of 8 phases complete</div>
            <Progress value={planningMetrics.overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        {/* Investment Analysis */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Projected ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">18.2%</div>
            <div className="text-xs text-slate-400 mt-1">5-year IRR projection</div>
            <div className="flex items-center mt-2 text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">Above target 15%</span>
            </div>
          </CardContent>
        </Card>

        {/* Market Demand */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Market Demand</CardTitle>
            <BarChart3 className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">Strong</div>
            <div className="text-xs text-slate-400 mt-1">94% occupancy rate</div>
            <div className="flex items-center mt-2 text-blue-400">
              <Building className="w-4 h-4 mr-1" />
              <span className="text-sm">$65/sq ft target</span>
            </div>
          </CardContent>
        </Card>

        {/* Risk Level */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Risk Assessment</CardTitle>
            <Shield className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">Medium</div>
            <div className="text-xs text-slate-400 mt-1">4 risks identified</div>
            <div className="flex items-center mt-2 text-yellow-400">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span className="text-sm">Mitigation plans active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Site Selection Analysis */}
      <Card className="bg-[#0D1117] border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
            <MapPin className="h-5 w-5 text-slate-400" />
            Site Selection Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {siteOptions.map((site) => (
              <div key={site.id} className="border rounded-lg p-4 hover:bg-[#0D1117]/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{site.name}</h3>
                      {site.selected && <Badge className="bg-green-100 text-green-700">Selected</Badge>}
                      <div className={`text-lg font-bold ${getScoreColor(site.score)}`}>
                        Score: {site.score}/100
                      </div>
                    </div>
                    <p className="text-sm text-slate-400 mb-2">{site.address}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Size:</span> {site.size}
                      </div>
                      <div>
                        <span className="font-medium">Cost:</span> ${(site.cost / 1000000).toFixed(1)}M
                      </div>
                      <div>
                        <span className="font-medium">Zoning:</span> {site.zoning}
                      </div>
                      <div>
                        <span className="font-medium">Decision Due:</span> {site.dueDate}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Advantages</h4>
                    <ul className="text-sm space-y-1">
                      {site.pros.map((pro, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">Challenges</h4>
                    <ul className="text-sm space-y-1">
                      {site.cons.map((con, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Projections and Market Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Projections */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <DollarSign className="h-5 w-5 text-slate-400" />
              5-Year Financial Projections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={financialProjections}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="year" className="text-sm" />
                <YAxis className="text-sm" tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                <Tooltip 
                  formatter={(value: number) => [`$${(value / 1000000).toFixed(1)}M`, '']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '12px', 
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
                <Bar dataKey="netIncome" fill="#3b82f6" name="Net Income" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Market Analysis */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Globe className="h-5 w-5 text-slate-400" />
              Market Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Target Market:</span>
                <div className="text-blue-600">{marketAnalysis.targetMarket}</div>
              </div>
              <div>
                <span className="font-medium">Demand Forecast:</span>
                <div className="text-green-600">{marketAnalysis.demandForecast}</div>
              </div>
              <div>
                <span className="font-medium">Primary Tenants:</span>
                <div>{marketAnalysis.demographics.primaryTenants}</div>
              </div>
              <div>
                <span className="font-medium">Target Rent:</span>
                <div className="text-green-600">{marketAnalysis.demographics.targetRent}</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Market Trends</h4>
              <div className="space-y-2">
                {marketAnalysis.marketTrends.map((trend, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-[#0D1117]/50">
                    <div>
                      <div className="font-medium text-sm">{trend.trend}</div>
                      <div className="text-xs text-slate-400">Impact: {trend.impact}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {trend.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment and Stakeholder Management */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Assessment */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Shield className="h-5 w-5 text-orange-500" />
              Risk Assessment Matrix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {riskFactors.map((risk, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{risk.category}</h4>
                    <Badge className={getRiskColor(risk.level)}>
                      {risk.level} Risk
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400 mb-2">{risk.description}</p>
                  <div className="text-sm">
                    <div className="font-medium text-green-700 dark:text-green-400">Mitigation:</div>
                    <div className="text-slate-400">{risk.mitigation}</div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span>Probability: {risk.probability}%</span>
                    <span>Impact: {risk.impact}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Stakeholder Management */}
        <Card className="bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Users className="h-5 w-5 text-blue-500" />
              Stakeholder Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stakeholders.map((stakeholder, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{stakeholder.name}</h4>
                    <Badge className={getStatusColor(stakeholder.status)}>
                      {stakeholder.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-400 mb-2">{stakeholder.role}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="font-medium">Influence:</span> {stakeholder.influence}
                    </div>
                    <div>
                      <span className="font-medium">Engagement:</span> {stakeholder.engagement}
                    </div>
                    <div>
                      <span className="font-medium">Last Contact:</span> {stakeholder.lastContact}
                    </div>
                    <div>
                      <span className="font-medium">Next Action:</span> {stakeholder.nextAction}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Planning Timeline and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Planning Milestones */}
        <Card className="lg:col-span-2 bg-[#0D1117] border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-white">
              <Calendar className="h-5 w-5 text-slate-400" />
              Planning Milestones & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planningMilestones.map((milestone) => (
                  <div key={milestone.id} className="flex items-center gap-4 p-4 rounded-lg bg-[#0D1117]/50">
                  <div className={`w-3 h-3 rounded-full ${
                    milestone.status === 'completed' ? 'bg-green-500' :
                    milestone.status === 'in-progress' ? 'bg-blue-500' :
                    'bg-slate-600'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{milestone.milestone}</div>
                    <div className="text-sm text-slate-400">
                      Due: {milestone.dueDate} • Owner: {milestone.owner}
                    </div>
                    <Progress value={milestone.progress} className="mt-2 h-2" />
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(milestone.status)}>
                      {milestone.status.replace('-', ' ')}
                    </Badge>
                    <div className="text-sm text-slate-400 mt-1">
                      {milestone.progress}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default PlanningDashboard;

