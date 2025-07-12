import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp,
  DollarSign,
  Target,
  BarChart3,
  Calendar,
  Users,
  Building,
  FileText,
  Download,
  CheckCircle2,
  AlertTriangle,
  PieChart,
  Activity,
  Calculator
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FinancialMetric {
  metric: string;
  value: number;
  target: number;
  status: 'exceeds' | 'meets' | 'below';
}

interface MarketAssumption {
  assumption: string;
  value: string;
  sensitivity: 'high' | 'medium' | 'low';
  source: string;
}

const BusinessCase: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [activeTab, setActiveTab] = useState('executive');

  // Financial projections data
  const revenueProjections = [
    { year: 'Year 1', revenue: 0, costs: 2800000, netIncome: -2800000 },
    { year: 'Year 2', revenue: 4200000, costs: 3200000, netIncome: 1000000 },
    { year: 'Year 3', revenue: 8900000, costs: 3800000, netIncome: 5100000 },
    { year: 'Year 4', revenue: 12400000, costs: 4200000, netIncome: 8200000 },
    { year: 'Year 5', revenue: 13800000, costs: 4500000, netIncome: 9300000 },
    { year: 'Year 10', revenue: 18500000, costs: 5200000, netIncome: 13300000 }
  ];

  const financialMetrics: FinancialMetric[] = [
    { metric: 'Net Present Value (NPV)', value: 25500000, target: 20000000, status: 'exceeds' },
    { metric: 'Internal Rate of Return (IRR)', value: 18.2, target: 15.0, status: 'exceeds' },
    { metric: 'Payback Period', value: 3.8, target: 5.0, status: 'exceeds' },
    { metric: 'Return on Investment (ROI)', value: 156, target: 125, status: 'exceeds' },
    { metric: 'Debt Service Coverage Ratio', value: 1.85, target: 1.25, status: 'exceeds' }
  ];

  const fundingSources = [
    { source: 'Equity Investment', amount: 10500000, percentage: 30 },
    { source: 'Senior Debt', amount: 21000000, percentage: 60 },
    { source: 'Mezzanine Financing', amount: 3500000, percentage: 10 }
  ];

  const marketAssumptions: MarketAssumption[] = [
    { assumption: 'Office Rent ($/sq ft/year)', value: '$65', sensitivity: 'high', source: 'Market Research Q4 2024' },
    { assumption: 'Retail Rent ($/sq ft/year)', value: '$85', sensitivity: 'high', source: 'Retail Broker Analysis' },
    { assumption: 'Occupancy Rate', value: '94%', sensitivity: 'medium', source: 'Downtown Market Report' },
    { assumption: 'Annual Rent Escalation', value: '3%', sensitivity: 'low', source: 'Historical Average' },
    { assumption: 'Cap Rate', value: '6.5%', sensitivity: 'high', source: 'Recent Comparables' },
    { assumption: 'Construction Cost Inflation', value: '4%', sensitivity: 'medium', source: 'Construction Index' }
  ];

  const keyRisks = [
    { risk: 'Market Demand Fluctuation', impact: 'high', likelihood: 'medium', mitigation: 'Pre-leasing strategy, flexible space design' },
    { risk: 'Construction Delays', impact: 'medium', likelihood: 'medium', mitigation: 'Fixed-price contracts, penalty clauses' },
    { risk: 'Interest Rate Changes', impact: 'high', likelihood: 'high', mitigation: 'Rate hedging, quick execution' },
    { risk: 'Regulatory Changes', impact: 'medium', likelihood: 'low', mitigation: 'Early permit applications, legal review' }
  ];

  const getSensitivityColor = (sensitivity: string) => {
    switch (sensitivity) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'exceeds') return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (status === 'meets') return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
    return <AlertTriangle className="h-4 w-4 text-red-500" />;
  };

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Business Case Review
            </h1>
            <p className="text-muted-foreground mt-1">
              Financial analysis, market assumptions, and investment rationale
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Business Case
            </Button>
            <Button className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approve Business Case
            </Button>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Project NPV</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">$25.5M</div>
              <Progress value={127} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                127% of target
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">IRR</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">18.2%</div>
              <div className="text-xs text-muted-foreground mt-1">
                vs 15% target
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Payback</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">3.8 years</div>
              <div className="text-xs text-muted-foreground mt-1">
                Under 5 year target
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Investment</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">$35M</div>
              <div className="text-xs text-muted-foreground mt-1">
                Fully funded
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">ROI</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">156%</div>
              <div className="text-xs text-muted-foreground mt-1">
                10-year projection
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="executive">Executive Summary</TabsTrigger>
            <TabsTrigger value="financial">Financial Analysis</TabsTrigger>
            <TabsTrigger value="market">Market Analysis</TabsTrigger>
            <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
            <TabsTrigger value="recommendation">Recommendation</TabsTrigger>
          </TabsList>

          {/* Executive Summary */}
          <TabsContent value="executive" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Investment Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-sm max-w-none text-foreground">
                  <p>
                    The Metro Plaza Mixed-Use Development presents a compelling investment opportunity with projected returns 
                    significantly exceeding our investment criteria. The project combines prime downtown location, strong market 
                    fundamentals, and experienced development team to deliver exceptional value.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                      Key Strengths
                    </h4>
                    <ul className="space-y-2 text-sm text-foreground">
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div>
                        <span>Prime downtown location with excellent accessibility</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div>
                        <span>Strong pre-leasing interest from Fortune 500 tenants</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div>
                        <span>18.2% IRR exceeds 15% hurdle rate</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5"></div>
                        <span>Experienced development and construction team</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-foreground flex items-center gap-2">
                      <Activity className="h-5 w-5 text-blue-400" />
                      Financial Highlights
                    </h4>
                    <div className="space-y-3">
                      {financialMetrics.slice(0, 4).map((metric, index) => (
                        <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                          <span className="text-sm text-foreground">{metric.metric}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-foreground">
                              {metric.metric.includes('%') || metric.metric.includes('Ratio') 
                                ? `${metric.value}${metric.metric.includes('IRR') ? '%' : ''}`
                                : metric.metric.includes('Period') 
                                  ? `${metric.value} years`
                                  : `$${(metric.value / 1000000).toFixed(1)}M`
                              }
                            </span>
                            {getStatusIcon(metric.status)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financial Analysis */}
          <TabsContent value="financial" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    Revenue & Profit Projections
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueProjections}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="year" className="text-sm" />
                      <YAxis className="text-sm" tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
                      <Tooltip 
                        formatter={(value: number) => [`$${(value / 1000000).toFixed(1)}M`, '']}
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: 'none',
                          borderRadius: '8px'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        name="Revenue"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="netIncome" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        name="Net Income"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-muted-foreground" />
                    Funding Structure
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={fundingSources}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ percentage }) => `${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="percentage"
                      >
                        {fundingSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {fundingSources.map((source, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded`} style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                          <span className="text-foreground">{source.source}</span>
                        </div>
                        <span className="font-medium text-foreground">${(source.amount / 1000000).toFixed(1)}M</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Sensitivity Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-3">Rent Sensitivity</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">-10%</span>
                        <span className="text-red-400">IRR: 14.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Case</span>
                        <span className="text-green-400">IRR: 18.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">+10%</span>
                        <span className="text-green-400">IRR: 21.5%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-3">Construction Cost</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">-10%</span>
                        <span className="text-green-400">IRR: 20.1%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Case</span>
                        <span className="text-green-400">IRR: 18.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">+10%</span>
                        <span className="text-yellow-400">IRR: 16.3%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <h4 className="font-medium text-foreground mb-3">Occupancy Rate</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">85%</span>
                        <span className="text-red-400">IRR: 13.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">94% (Base)</span>
                        <span className="text-green-400">IRR: 18.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">98%</span>
                        <span className="text-green-400">IRR: 20.8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Market Analysis */}
          <TabsContent value="market">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Market Assumptions & Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {marketAssumptions.map((assumption, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-foreground">{assumption.assumption}</h4>
                            <Badge className={getSensitivityColor(assumption.sensitivity)}>
                              {assumption.sensitivity} sensitivity
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="font-medium text-foreground">{assumption.value}</span>
                            <span className="text-muted-foreground">Source: {assumption.source}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Assessment */}
          <TabsContent value="risks">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                  Risk Assessment Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {keyRisks.map((risk, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-foreground">{risk.risk}</h4>
                        <div className="flex gap-2">
                          <Badge className={risk.impact === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}>
                            {risk.impact} impact
                          </Badge>
                          <Badge className={risk.likelihood === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}>
                            {risk.likelihood} likelihood
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Mitigation: </span>
                        {risk.mitigation}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendation */}
          <TabsContent value="recommendation">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  Investment Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/30">
                  <h3 className="text-xl font-bold text-green-400 mb-3">RECOMMENDED FOR APPROVAL</h3>
                  <p className="text-foreground">
                    Based on comprehensive analysis, the Metro Plaza Mixed-Use Development exceeds all investment criteria 
                    and presents a compelling opportunity for value creation.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Key Decision Factors</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mb-2" />
                      <h5 className="font-medium text-foreground mb-1">Financial Performance</h5>
                      <p className="text-sm text-muted-foreground">
                        All financial metrics exceed targets with 18.2% IRR and $25.5M NPV
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mb-2" />
                      <h5 className="font-medium text-foreground mb-1">Market Position</h5>
                      <p className="text-sm text-muted-foreground">
                        Prime location with strong tenant demand and limited competition
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mb-2" />
                      <h5 className="font-medium text-foreground mb-1">Risk Profile</h5>
                      <p className="text-sm text-muted-foreground">
                        Manageable risks with comprehensive mitigation strategies in place
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <CheckCircle2 className="h-5 w-5 text-green-400 mb-2" />
                      <h5 className="font-medium text-foreground mb-1">Execution Team</h5>
                      <p className="text-sm text-muted-foreground">
                        Experienced team with proven track record in similar developments
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Conditions for Approval</h4>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5"></div>
                      <span>Achieve minimum 35% pre-leasing before construction start</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5"></div>
                      <span>Secure fixed-price construction contract with performance bonds</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5"></div>
                      <span>Implement interest rate hedging strategy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5"></div>
                      <span>Monthly reporting on key performance indicators</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default BusinessCase;