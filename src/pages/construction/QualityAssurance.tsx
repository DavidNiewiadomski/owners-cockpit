import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ClipboardCheck,
  Camera,
  FileText,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Plus,
  BarChart3
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface QualityCheck {
  id: string;
  area: string;
  type: string;
  inspector: string;
  date: string;
  status: 'pass' | 'pass-with-notes' | 'fail' | 'pending';
  score: number;
  findings: string[];
  images?: number;
  reworkRequired?: boolean;
}

interface DefectItem {
  id: string;
  location: string;
  category: string;
  description: string;
  severity: 'minor' | 'major' | 'critical';
  status: 'open' | 'in-progress' | 'resolved';
  assignedTo: string;
  dateReported: string;
  dueDate: string;
}

const QualityAssurance: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [selectedView, setSelectedView] = useState<'inspections' | 'defects' | 'analytics'>('inspections');
  const [filterType, setFilterType] = useState<string>('all');

  // Mock quality data
  const qualityChecks: QualityCheck[] = [
    {
      id: '1',
      area: 'Floor 10 - MEP Installation',
      type: 'MEP Systems',
      inspector: 'John Davis',
      date: '2024-12-15',
      status: 'pass',
      score: 96,
      findings: ['Proper alignment', 'Clean installations', 'Good workmanship'],
      images: 12
    },
    {
      id: '2',
      area: 'Floor 9 - Electrical Work',
      type: 'Electrical',
      inspector: 'Sarah Miller',
      date: '2024-12-15',
      status: 'pass-with-notes',
      score: 88,
      findings: ['Minor conduit spacing issue', 'Overall good quality'],
      images: 8,
      reworkRequired: false
    },
    {
      id: '3',
      area: 'Floor 8 - Plumbing',
      type: 'Plumbing',
      inspector: 'Mike Johnson',
      date: '2024-12-14',
      status: 'fail',
      score: 65,
      findings: ['Incorrect pipe slope', 'Missing hangers', 'Requires rework'],
      images: 15,
      reworkRequired: true
    },
    {
      id: '4',
      area: 'Exterior Facade - North',
      type: 'Exterior',
      inspector: 'Lisa Chen',
      date: '2024-12-14',
      status: 'pending',
      score: 0,
      findings: [],
      images: 0
    }
  ];

  const defects: DefectItem[] = [
    {
      id: 'd1',
      location: 'Floor 8 - Room 812',
      category: 'Plumbing',
      description: 'Incorrect pipe slope causing drainage issues',
      severity: 'major',
      status: 'in-progress',
      assignedTo: 'ProPlumb Team',
      dateReported: '2024-12-14',
      dueDate: '2024-12-18'
    },
    {
      id: 'd2',
      location: 'Floor 9 - Corridor',
      category: 'Electrical',
      description: 'Conduit spacing not per specifications',
      severity: 'minor',
      status: 'open',
      assignedTo: 'Electrical Team B',
      dateReported: '2024-12-15',
      dueDate: '2024-12-20'
    },
    {
      id: 'd3',
      location: 'Floor 7 - Mechanical Room',
      category: 'HVAC',
      description: 'Vibration isolators installed incorrectly',
      severity: 'major',
      status: 'resolved',
      assignedTo: 'HVAC Team A',
      dateReported: '2024-12-10',
      dueDate: '2024-12-12'
    }
  ];

  // Quality trends data
  const qualityTrends = [
    { week: 'Week 47', score: 92, inspections: 18, defects: 3 },
    { week: 'Week 48', score: 94, inspections: 22, defects: 2 },
    { week: 'Week 49', score: 90, inspections: 20, defects: 4 },
    { week: 'Week 50', score: 88, inspections: 25, defects: 5 },
    { week: 'Week 51', score: 91, inspections: 19, defects: 3 }
  ];

  // Calculate statistics
  const totalInspections = qualityChecks.length;
  const passedInspections = qualityChecks.filter(q => q.status === 'pass' || q.status === 'pass-with-notes').length;
  const failedInspections = qualityChecks.filter(q => q.status === 'fail').length;
  const averageScore = Math.round(
    qualityChecks.filter(q => q.score > 0).reduce((sum, q) => sum + q.score, 0) / 
    qualityChecks.filter(q => q.score > 0).length
  );
  const openDefects = defects.filter(d => d.status === 'open' || d.status === 'in-progress').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-700';
      case 'pass-with-notes': return 'bg-blue-100 text-blue-700';
      case 'fail': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'resolved': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'open': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'major': return 'bg-orange-100 text-orange-700';
      case 'minor': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Quality Assurance Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track quality inspections, manage defects, and monitor compliance
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Inspection
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Quality Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{averageScore}%</div>
              <Progress value={averageScore} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                Average across inspections
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pass Rate</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {Math.round((passedInspections / (totalInspections - 1)) * 100)}%
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {passedInspections} of {totalInspections - 1} inspections
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Failed Inspections</CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{failedInspections}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Require rework
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Open Defects</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{openDefects}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Pending resolution
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">4</div>
              <div className="text-xs text-muted-foreground mt-1">
                Inspections completed
              </div>
            </CardContent>
          </Card>
        </div>

        {/* View Toggle */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Button
                variant={selectedView === 'inspections' ? 'default' : 'outline'}
                onClick={() => setSelectedView('inspections')}
                size="sm"
              >
                <ClipboardCheck className="w-4 h-4 mr-2" />
                Inspections
              </Button>
              <Button
                variant={selectedView === 'defects' ? 'default' : 'outline'}
                onClick={() => setSelectedView('defects')}
                size="sm"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Defects
              </Button>
              <Button
                variant={selectedView === 'analytics' ? 'default' : 'outline'}
                onClick={() => setSelectedView('analytics')}
                size="sm"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Content based on selected view */}
        {selectedView === 'inspections' && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
                Recent Quality Inspections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {qualityChecks.map((check) => (
                  <div key={check.id} className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{check.area}</h3>
                          <Badge className={getStatusColor(check.status)}>
                            {check.status}
                          </Badge>
                          {check.reworkRequired && (
                            <Badge variant="destructive">Rework Required</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Type:</span>
                            <span className="ml-2 text-foreground">{check.type}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Inspector:</span>
                            <span className="ml-2 text-foreground">{check.inspector}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date:</span>
                            <span className="ml-2 text-foreground">{check.date}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Photos:</span>
                            <span className="ml-2 text-foreground">{check.images || 0}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {check.findings.map((finding, index) => (
                            <div key={index} className="text-sm text-muted-foreground">
                              • {finding}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4 text-center">
                        <div className="text-sm text-muted-foreground mb-1">Score</div>
                        <div className="text-2xl font-bold text-foreground">{check.score > 0 ? `${check.score}%` : '-'}</div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            <Camera className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedView === 'defects' && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                Active Defects & Non-Conformances
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {defects.map((defect) => (
                  <div key={defect.id} className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-foreground">{defect.location}</h3>
                          <Badge className={getSeverityColor(defect.severity)}>
                            {defect.severity}
                          </Badge>
                          <Badge className={getStatusColor(defect.status)}>
                            {defect.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground mb-2">{defect.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Category:</span>
                            <span className="ml-2 text-foreground">{defect.category}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Assigned to:</span>
                            <span className="ml-2 text-foreground">{defect.assignedTo}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Reported:</span>
                            <span className="ml-2 text-foreground">{defect.dateReported}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Due:</span>
                            <span className="ml-2 text-foreground">{defect.dueDate}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="ml-4">
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedView === 'analytics' && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-muted-foreground" />
                    Quality Score Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={qualityTrends}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="week" className="text-sm" />
                      <YAxis className="text-sm" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                          border: 'none',
                          borderRadius: '8px'
                        }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        dot={{ fill: '#10b981' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                    Defects by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground">Plumbing</span>
                        <span className="text-sm font-medium text-foreground">2</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground">Electrical</span>
                        <span className="text-sm font-medium text-foreground">1</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground">HVAC</span>
                        <span className="text-sm font-medium text-foreground">1</span>
                      </div>
                      <Progress value={20} className="h-2" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-foreground">Structural</span>
                        <span className="text-sm font-medium text-foreground">0</span>
                      </div>
                      <Progress value={0} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  Inspector Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="text-sm text-muted-foreground mb-1">John Davis</div>
                    <div className="text-xl font-bold text-foreground">12</div>
                    <div className="text-xs text-muted-foreground">Inspections this month</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="text-sm text-muted-foreground mb-1">Sarah Miller</div>
                    <div className="text-xl font-bold text-foreground">10</div>
                    <div className="text-xs text-muted-foreground">Inspections this month</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="text-sm text-muted-foreground mb-1">Mike Johnson</div>
                    <div className="text-xl font-bold text-foreground">8</div>
                    <div className="text-xs text-muted-foreground">Inspections this month</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card/50">
                    <div className="text-sm text-muted-foreground mb-1">Lisa Chen</div>
                    <div className="text-xl font-bold text-foreground">9</div>
                    <div className="text-xs text-muted-foreground">Inspections this month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default QualityAssurance;