import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  Activity,
  Target,
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  FileText,
  Download,
  Plus,
  BarChart3
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, BarChart, Bar } from 'recharts';

interface Risk {
  id: string;
  category: string;
  description: string;
  probability: number;
  impact: number;
  riskScore: number;
  status: 'active' | 'mitigated' | 'closed' | 'monitoring';
  owner: string;
  mitigation: string;
  dueDate: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface MitigationAction {
  id: string;
  riskId: string;
  action: string;
  status: 'planned' | 'in-progress' | 'completed';
  owner: string;
  dueDate: string;
  cost: number;
}

const RiskManagement: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [activeTab, setActiveTab] = useState('matrix');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock risk data
  const risks: Risk[] = [
    {
      id: '1',
      category: 'Financial',
      description: 'Interest rate increases affecting project financing',
      probability: 4,
      impact: 4,
      riskScore: 16,
      status: 'active',
      owner: 'Finance Team',
      mitigation: 'Rate lock agreements, accelerated financing timeline',
      dueDate: '2024-12-30',
      trend: 'increasing'
    },
    {
      id: '2',
      category: 'Construction',
      description: 'Material cost inflation exceeding budget',
      probability: 3,
      impact: 4,
      riskScore: 12,
      status: 'active',
      owner: 'Procurement Team',
      mitigation: 'Fixed-price contracts, early material procurement',
      dueDate: '2025-01-15',
      trend: 'stable'
    },
    {
      id: '3',
      category: 'Market',
      description: 'Reduced tenant demand due to remote work trends',
      probability: 3,
      impact: 3,
      riskScore: 9,
      status: 'monitoring',
      owner: 'Leasing Team',
      mitigation: 'Flexible space design, amenity enhancements',
      dueDate: '2025-03-01',
      trend: 'decreasing'
    },
    {
      id: '4',
      category: 'Regulatory',
      description: 'Zoning changes affecting development rights',
      probability: 2,
      impact: 5,
      riskScore: 10,
      status: 'mitigated',
      owner: 'Legal Team',
      mitigation: 'Early permit applications, grandfathering provisions',
      dueDate: '2024-11-30',
      trend: 'stable'
    },
    {
      id: '5',
      category: 'Environmental',
      description: 'Unexpected soil contamination during excavation',
      probability: 2,
      impact: 4,
      riskScore: 8,
      status: 'monitoring',
      owner: 'Environmental Consultant',
      mitigation: 'Phase II environmental assessment completed',
      dueDate: '2025-01-30',
      trend: 'stable'
    },
    {
      id: '6',
      category: 'Schedule',
      description: 'Weather delays impacting critical path',
      probability: 3,
      impact: 2,
      riskScore: 6,
      status: 'active',
      owner: 'Project Manager',
      mitigation: 'Schedule buffers, weather contingency planning',
      dueDate: '2025-02-15',
      trend: 'stable'
    }
  ];

  const mitigationActions: MitigationAction[] = [
    {
      id: 'ma1',
      riskId: '1',
      action: 'Execute interest rate hedge agreement',
      status: 'in-progress',
      owner: 'CFO',
      dueDate: '2024-12-20',
      cost: 50000
    },
    {
      id: 'ma2',
      riskId: '2',
      action: 'Lock in steel and concrete pricing',
      status: 'completed',
      owner: 'Procurement Manager',
      dueDate: '2024-12-01',
      cost: 25000
    },
    {
      id: 'ma3',
      riskId: '3',
      action: 'Develop flexible workspace marketing plan',
      status: 'planned',
      owner: 'Marketing Director',
      dueDate: '2025-01-31',
      cost: 15000
    }
  ];

  // Risk statistics
  const totalRisks = risks.length;
  const activeRisks = risks.filter(r => r.status === 'active').length;
  const highRisks = risks.filter(r => r.riskScore >= 15).length;
  const mitigatedRisks = risks.filter(r => r.status === 'mitigated').length;
  const avgRiskScore = Math.round(risks.reduce((sum, r) => sum + r.riskScore, 0) / totalRisks);

  // Filter risks
  const filteredRisks = risks.filter(risk => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'high') return risk.riskScore >= 15;
    if (filterCategory === 'active') return risk.status === 'active';
    return risk.category === filterCategory;
  });

  // Prepare scatter plot data
  const scatterData = risks.map(risk => ({
    x: risk.probability,
    y: risk.impact,
    name: risk.description,
    category: risk.category,
    score: risk.riskScore
  }));

  // Risk by category data
  const riskByCategory = [
    { category: 'Financial', count: risks.filter(r => r.category === 'Financial').length, avgScore: 16 },
    { category: 'Construction', count: risks.filter(r => r.category === 'Construction').length, avgScore: 12 },
    { category: 'Market', count: risks.filter(r => r.category === 'Market').length, avgScore: 9 },
    { category: 'Regulatory', count: risks.filter(r => r.category === 'Regulatory').length, avgScore: 10 },
    { category: 'Environmental', count: risks.filter(r => r.category === 'Environmental').length, avgScore: 8 },
    { category: 'Schedule', count: risks.filter(r => r.category === 'Schedule').length, avgScore: 6 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-700';
      case 'monitoring': return 'bg-yellow-100 text-yellow-700';
      case 'mitigated': return 'bg-green-100 text-green-700';
      case 'closed': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskLevelColor = (score: number) => {
    if (score >= 15) return 'bg-red-100 text-red-700';
    if (score >= 10) return 'bg-orange-100 text-orange-700';
    if (score >= 5) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'increasing') return <TrendingUp className="h-4 w-4 text-red-500" />;
    if (trend === 'decreasing') return <TrendingUp className="h-4 w-4 text-green-500 rotate-180" />;
    return <Activity className="h-4 w-4 text-yellow-500" />;
  };

  const getRiskColor = (score: number) => {
    if (score >= 15) return '#ef4444';
    if (score >= 10) return '#f97316';
    if (score >= 5) return '#eab308';
    return '#22c55e';
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Risk Management Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Identify, assess, and mitigate project risks
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Risk Register
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Add New Risk
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Risks</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalRisks}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Identified risks
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Risks</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{activeRisks}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Require attention
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Priority</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-400">{highRisks}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Score ≥ 15
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Mitigated</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{mitigatedRisks}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Under control
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Risk Score</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{avgRiskScore}</div>
              <Progress value={(avgRiskScore / 25) * 100} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="matrix">Risk Matrix</TabsTrigger>
            <TabsTrigger value="register">Risk Register</TabsTrigger>
            <TabsTrigger value="mitigation">Mitigation Plans</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Risk Matrix */}
          <TabsContent value="matrix" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  Risk Assessment Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">Probability vs Impact</h4>
                    <ResponsiveContainer width="100%" height={400}>
                      <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          type="number" 
                          dataKey="x" 
                          name="Probability" 
                          domain={[0, 5]}
                          ticks={[1, 2, 3, 4, 5]}
                          label={{ value: 'Probability', position: 'insideBottom', offset: -10 }}
                        />
                        <YAxis 
                          type="number" 
                          dataKey="y" 
                          name="Impact" 
                          domain={[0, 5]}
                          ticks={[1, 2, 3, 4, 5]}
                          label={{ value: 'Impact', angle: -90, position: 'insideLeft' }}
                        />
                        <Tooltip 
                          cursor={{ strokeDasharray: '3 3' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-background p-3 rounded-lg shadow-lg border border-border">
                                  <p className="text-sm font-medium text-foreground">{data.name}</p>
                                  <p className="text-xs text-muted-foreground">Category: {data.category}</p>
                                  <p className="text-xs text-muted-foreground">Risk Score: {data.score}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Scatter name="Risks" data={scatterData}>
                          {scatterData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getRiskColor(entry.score)} />
                          ))}
                        </Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-4">Risk Heat Map</h4>
                    <div className="grid grid-cols-5 gap-1">
                      {[5, 4, 3, 2, 1].map((impact) => (
                        <React.Fragment key={impact}>
                          {[1, 2, 3, 4, 5].map((probability) => {
                            const score = impact * probability;
                            const risk = risks.find(r => r.probability === probability && r.impact === impact);
                            return (
                              <div
                                key={`${impact}-${probability}`}
                                className="aspect-square flex items-center justify-center text-xs font-medium rounded"
                                style={{ backgroundColor: getRiskColor(score) + '33' }}
                              >
                                {risk ? (
                                  <div className="text-center">
                                    <div className="font-bold">{score}</div>
                                    <div className="text-[10px]">{risk.category.slice(0, 3)}</div>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">{score}</span>
                                )}
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#22c55e' }}></div>
                        <span className="text-muted-foreground">Low Risk (1-4)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#eab308' }}></div>
                        <span className="text-muted-foreground">Medium Risk (5-9)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f97316' }}></div>
                        <span className="text-muted-foreground">High Risk (10-14)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                        <span className="text-muted-foreground">Critical Risk (15-25)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Risk Register */}
          <TabsContent value="register" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    Risk Register
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={filterCategory === 'all' ? 'default' : 'outline'}
                      onClick={() => setFilterCategory('all')}
                      size="sm"
                    >
                      All Risks
                    </Button>
                    <Button
                      variant={filterCategory === 'high' ? 'default' : 'outline'}
                      onClick={() => setFilterCategory('high')}
                      size="sm"
                    >
                      High Priority
                    </Button>
                    <Button
                      variant={filterCategory === 'active' ? 'default' : 'outline'}
                      onClick={() => setFilterCategory('active')}
                      size="sm"
                    >
                      Active Only
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRisks.map((risk) => (
                    <div key={risk.id} className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-foreground">{risk.description}</h4>
                            <Badge className={getRiskLevelColor(risk.riskScore)}>
                              Score: {risk.riskScore}
                            </Badge>
                            <Badge className={getStatusColor(risk.status)}>
                              {risk.status}
                            </Badge>
                            {getTrendIcon(risk.trend)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-muted-foreground">Category:</span>
                              <span className="ml-2 text-foreground">{risk.category}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Probability:</span>
                              <span className="ml-2 text-foreground">{risk.probability}/5</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Impact:</span>
                              <span className="ml-2 text-foreground">{risk.impact}/5</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Owner:</span>
                              <span className="ml-2 text-foreground">{risk.owner}</span>
                            </div>
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">Mitigation: </span>
                            <span className="text-foreground">{risk.mitigation}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            Due: {risk.dueDate}
                          </div>
                        </div>
                        <Button size="sm" variant="outline" className="ml-4">
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Mitigation Plans */}
          <TabsContent value="mitigation">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                  Active Mitigation Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mitigationActions.map((action) => {
                    const relatedRisk = risks.find(r => r.id === action.riskId);
                    return (
                      <div key={action.id} className="p-4 rounded-lg border border-border bg-card/50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground mb-1">{action.action}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              Related Risk: {relatedRisk?.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Owner:</span>
                                <span className="ml-2 text-foreground">{action.owner}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Due:</span>
                                <span className="ml-2 text-foreground">{action.dueDate}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Cost:</span>
                                <span className="ml-2 text-foreground">${(action.cost / 1000).toFixed(0)}K</span>
                              </div>
                            </div>
                          </div>
                          <Badge className={
                            action.status === 'completed' ? 'bg-green-100 text-green-700' :
                            action.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }>
                            {action.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Risks by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={riskByCategory}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="category" className="text-sm" />
                      <YAxis className="text-sm" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: 'none',
                          borderRadius: '8px'
                        }} 
                      />
                      <Bar dataKey="count" fill="#3b82f6" name="Risk Count" />
                      <Bar dataKey="avgScore" fill="#f59e0b" name="Avg Score" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Risk Trend Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Increasing Risks</span>
                        <Badge className="bg-red-100 text-red-700">
                          {risks.filter(r => r.trend === 'increasing').length}
                        </Badge>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Stable Risks</span>
                        <Badge className="bg-yellow-100 text-yellow-700">
                          {risks.filter(r => r.trend === 'stable').length}
                        </Badge>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>
                    <div className="p-4 rounded-lg border border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">Decreasing Risks</span>
                        <Badge className="bg-green-100 text-green-700">
                          {risks.filter(r => r.trend === 'decreasing').length}
                        </Badge>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default RiskManagement;