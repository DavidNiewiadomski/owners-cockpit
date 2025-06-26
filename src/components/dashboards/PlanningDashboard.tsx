import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  MapPin,
  Briefcase,
  Globe,
  DollarSign,
  Users,
  Compass,
  Clock,
  FileText,
  CheckCircle,
  TrendingUp,
  Shield,
  AlertTriangle,
  Target,
  Calendar,
  Building,
  Zap,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PlanningDashboardProps {
  projectId: string;
}

const PlanningDashboard: React.FC<PlanningDashboardProps> = ({ projectId }) => {
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
      default: return 'bg-gray-100 text-gray-700';
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
      default: return 'bg-gray-100 text-gray-700';
    }
  };
  
  return (
    <div className="min-h-screen bg-white dark:bg-[#0D1117] p-6 space-y-6">
      {/* Planning Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
            🎯 PLANNING DASHBOARD 🎯 Strategic Planning Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Site Selection, Business Case Development & Feasibility Analysis
          </p>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
              Phase: {planningMetrics.projectPhase}
            </Badge>
            <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700">
              {planningMetrics.overallProgress}% Planning Complete
            </Badge>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            Phase 1
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Strategic Planning
          </div>
        </div>
      </div>

      {/* AI Planning Insights */}
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white dark:from-blue-950 dark:to-gray-900">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
            <Zap className="w-5 h-5 text-blue-600" />
            AI Strategic Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Site Recommendation:</strong> Downtown Business District scores highest (92/100) despite higher cost due to prime location and transport access. 
            <strong>Market Outlook:</strong> Strong demand for Class A office space with 94% occupancy rates. ESG requirements becoming critical for tenant attraction. 
            <strong>Next Steps:</strong> Finalize site selection by July 1st, secure zoning pre-approval, and begin stakeholder alignment for business case approval.
          </p>
        </CardContent>
      </Card>

      {/* Key Planning KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Planning Progress */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Planning Progress</CardTitle>
            <Target className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{planningMetrics.overallProgress}%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 of 8 phases complete</div>
            <Progress value={planningMetrics.overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        {/* Investment Analysis */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Projected ROI</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">18.2%</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">5-year IRR projection</div>
            <div className="flex items-center mt-2 text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">Above target 15%</span>
            </div>
          </CardContent>
        </Card>

        {/* Market Demand */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Market Demand</CardTitle>
            <BarChart3 className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Strong</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">94% occupancy rate</div>
            <div className="flex items-center mt-2 text-blue-600">
              <Building className="w-4 h-4 mr-1" />
              <span className="text-sm">$65/sq ft target</span>
            </div>
          </CardContent>
        </Card>

        {/* Risk Level */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Risk Assessment</CardTitle>
            <Shield className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">Medium</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">4 risks identified</div>
            <div className="flex items-center mt-2 text-yellow-600">
              <AlertTriangle className="w-4 h-4 mr-1" />
              <span className="text-sm">Mitigation plans active</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Site Selection Analysis */}
      <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
            <MapPin className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Site Selection Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {siteOptions.map((site) => (
              <div key={site.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{site.name}</h3>
                      {site.selected && <Badge className="bg-green-100 text-green-700">Selected</Badge>}
                      <div className={`text-lg font-bold ${getScoreColor(site.score)}`}>
                        Score: {site.score}/100
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{site.address}</p>
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
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <DollarSign className="h-5 w-5 text-gray-600 dark:text-gray-400" />
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
                  formatter={(value: any) => [`$${(value / 1000000).toFixed(1)}M`, '']}
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
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Globe className="h-5 w-5 text-gray-600 dark:text-gray-400" />
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
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <div>
                      <div className="font-medium text-sm">{trend.trend}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">Impact: {trend.impact}</div>
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
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
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
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{risk.description}</p>
                  <div className="text-sm">
                    <div className="font-medium text-green-700 dark:text-green-400">Mitigation:</div>
                    <div className="text-gray-600 dark:text-gray-400">{risk.mitigation}</div>
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
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
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
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stakeholder.role}</div>
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
        <Card className="lg:col-span-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Calendar className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Planning Milestones & Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planningMilestones.map((milestone) => (
                <div key={milestone.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <div className={`w-3 h-3 rounded-full ${
                    milestone.status === 'completed' ? 'bg-green-500' :
                    milestone.status === 'in-progress' ? 'bg-blue-500' :
                    'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium">{milestone.milestone}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Due: {milestone.dueDate} • Owner: {milestone.owner}
                    </div>
                    <Progress value={milestone.progress} className="mt-2 h-2" />
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(milestone.status)}>
                      {milestone.status.replace('-', ' ')}
                    </Badge>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {milestone.progress}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-white">
              <Compass className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full justify-between text-sm">
              Finalize Site Selection
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm">
              Schedule Stakeholder Meetings
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm">
              Review Business Case
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm">
              Update Risk Mitigation
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm">
              Financial Model Review
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full justify-between text-sm">
              Market Analysis Update
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanningDashboard;

