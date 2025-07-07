import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Loader2
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import type { PerformanceScorecard, PerformanceKPI, KPITemplate } from '@/lib/api/performance';
import { performanceAPI } from '@/lib/api/performance';
import { useToast } from '@/hooks/use-toast';
import { mockKpiCollectorService } from '@/services/mockKpiCollector';

interface ScorecardGalleryProps {
  companyId: string;
  companyName: string;
  trigger?: React.ReactNode;
}

interface RadarDataPoint {
  metric: string;
  value: number;
  target: number;
  maxValue: number;
}

interface TrendDataPoint {
  period: string;
  score: number;
}

const ScorecardGallery: React.FC<ScorecardGalleryProps> = ({ 
  companyId, 
  companyName, 
  trigger 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('Q4-2024');
  const [scorecard, setScorecard] = useState<PerformanceScorecard | null>(null);
  const [kpiTemplates, setKpiTemplates] = useState<KPITemplate[]>([]);
  const [periods, setPeriods] = useState<string[]>([]);
  const [trendData, setTrendData] = useState<TrendDataPoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const { toast } = useToast();

  // Load data when modal opens or period changes
  useEffect(() => {
    if (isOpen) {
      loadScorecardData();
      loadKpiTemplates();
      loadAvailablePeriods();
      loadTrendData();
    }
  }, [isOpen, selectedPeriod, companyId]);

  const loadScorecardData = async () => {
    try {
      setLoading(true);
      const { data, error } = await performanceAPI.getCompanyScorecard(companyId, selectedPeriod);
      if (error) {
        console.error('Error loading scorecard:', error);
        toast({
          title: "Error",
          description: "Failed to load performance scorecard",
          variant: "destructive"
        });
        return;
      }
      setScorecard(data);
    } catch (error) {
      console.error('Error loading scorecard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadKpiTemplates = async () => {
    try {
      const { data } = await performanceAPI.getKPITemplates();
      setKpiTemplates(data);
    } catch (error) {
      console.error('Error loading KPI templates:', error);
    }
  };

  const loadAvailablePeriods = async () => {
    try {
      const { data } = await performanceAPI.getAvailablePeriods();
      setPeriods(data);
    } catch (error) {
      console.error('Error loading periods:', error);
    }
  };

  const loadTrendData = async () => {
    try {
      // Load last 4 quarters for trend analysis
      const currentYear = new Date().getFullYear();
      const trendPeriods = [
        `Q1-${currentYear}`,
        `Q2-${currentYear}`,
        `Q3-${currentYear}`,
        `Q4-${currentYear}`
      ];

      const trendResults: TrendDataPoint[] = [];
      
      for (const period of trendPeriods) {
        try {
          const { data } = await performanceAPI.getCompanyScorecard(companyId, period);
          if (data) {
            trendResults.push({
              period,
              score: data.overall_score
            });
          }
        } catch (error) {
          // Period might not have data, continue
        }
      }
      
      setTrendData(trendResults);
    } catch (error) {
      console.error('Error loading trend data:', error);
    }
  };

  // Prepare radar chart data
  const getRadarData = (): RadarDataPoint[] => {
    if (!scorecard || !kpiTemplates.length) return [];

    return scorecard.kpis.map(kpi => {
      const template = kpiTemplates.find(t => t.metric === kpi.metric);
      if (!template) return null;

      // Calculate target based on direction and typical good values
      let target = 100;
      let maxValue = 100;

      switch (kpi.metric) {
        case 'safety_incidents':
          target = 0;
          maxValue = Math.max(10, kpi.value * 2);
          break;
        case 'response_time':
          target = 2; // 2 hours
          maxValue = Math.max(24, kpi.value * 2);
          break;
        case 'defect_rate':
        case 'change_order_rate':
        case 'cost_variance':
        case 'schedule_variance':
          target = 5; // 5% or less
          maxValue = Math.max(50, kpi.value * 2);
          break;
        default:
          target = 95; // 95% or better for positive metrics
          maxValue = 100;
      }

      return {
        metric: kpi.metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: kpi.value,
        target,
        maxValue
      };
    }).filter(Boolean) as RadarDataPoint[];
  };

  const generatePdfBrief = async () => {
    try {
      setGeneratingPdf(true);

      // Try to call the real KPI collector service, fallback to mock
      let summary: string;
      
      try {
        const summaryResponse = await fetch(
          `http://localhost:3001/generate-summary/${companyId}/${selectedPeriod}`,
          { method: 'POST' }
        );
        
        if (summaryResponse.ok) {
          const data = await summaryResponse.json();
          summary = data.summary;
        } else {
          throw new Error('KPI service not available');
        }
      } catch (error) {
        console.log('Real KPI service not available, using mock service');
        const mockResponse = await mockKpiCollectorService.generateSummary(companyId, selectedPeriod);
        summary = mockResponse.summary;
      }

      // Call PDF service to generate PDF
      const pdfResponse = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'performance-brief',
          data: {
            companyName,
            period: selectedPeriod,
            summary,
            scorecard,
            radarData: getRadarData(),
            trendData
          }
        })
      });

      if (!pdfResponse.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Download the PDF
      const blob = await pdfResponse.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${companyName}-Performance-Brief-${selectedPeriod}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Performance brief PDF generated and downloaded",
      });

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF brief",
        variant: "destructive"
      });
    } finally {
      setGeneratingPdf(false);
    }
  };

  const getKpiStatus = (kpi: PerformanceKPI, template?: KPITemplate) => {
    if (!template) return 'neutral';

    const isGoodDirection = template.target_direction === 'up' ? kpi.value >= 80 : kpi.value <= 20;
    
    if (isGoodDirection) return 'good';
    if (template.target_direction === 'up' ? kpi.value >= 60 : kpi.value <= 40) return 'warning';
    return 'poor';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'poor':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Activity className="w-4 h-4 text-blue-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'poor':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const radarData = getRadarData();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <BarChart3 className="w-4 h-4 mr-2" />
            Performance Scorecard
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-blue-600" />
              <span>{companyName} - Performance Scorecard</span>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1-2024">Q1-2024</SelectItem>
                  <SelectItem value="Q2-2024">Q2-2024</SelectItem>
                  <SelectItem value="Q3-2024">Q3-2024</SelectItem>
                  <SelectItem value="Q4-2024">Q4-2024</SelectItem>
                  {periods.map(period => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={generatePdfBrief}
                disabled={generatingPdf || !scorecard}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {generatingPdf ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Generate PDF Brief
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading performance data...</span>
            </div>
          ) : !scorecard ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
                <p className="text-gray-500">No performance data found for {selectedPeriod}</p>
              </div>
            </div>
          ) : (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="radar">KPI Radar</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                {/* Overall Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Overall Performance Score</span>
                      <div className="flex items-center gap-2">
                        {scorecard.trend === 'up' && <TrendingUp className="w-5 h-5 text-green-600" />}
                        {scorecard.trend === 'down' && <TrendingDown className="w-5 h-5 text-red-600" />}
                        <span className="text-3xl font-bold text-blue-600">
                          {scorecard.overall_score}/100
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Current Period</div>
                        <div className="text-2xl font-bold">{scorecard.overall_score}</div>
                      </div>
                      {scorecard.previous_score && (
                        <div className="text-center">
                          <div className="text-sm text-gray-500 mb-1">Previous Period</div>
                          <div className="text-2xl font-bold">{scorecard.previous_score}</div>
                        </div>
                      )}
                      <div className="text-center">
                        <div className="text-sm text-gray-500 mb-1">Change</div>
                        <div className={`text-2xl font-bold ${
                          scorecard.trend === 'up' ? 'text-green-600' : 
                          scorecard.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {scorecard.previous_score ? 
                            `${scorecard.overall_score - scorecard.previous_score > 0 ? '+' : ''}${(scorecard.overall_score - scorecard.previous_score).toFixed(1)}` 
                            : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* KPI Summary Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {scorecard.kpis.map(kpi => {
                    const template = kpiTemplates.find(t => t.metric === kpi.metric);
                    const status = getKpiStatus(kpi, template);
                    
                    return (
                      <Card key={kpi.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {kpi.metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            {getStatusIcon(status)}
                          </div>
                          <div className="text-2xl font-bold mb-1">
                            {kpi.value}
                            {template?.unit && (
                              <span className="text-sm text-gray-500 ml-1">{template.unit}</span>
                            )}
                          </div>
                          <Badge className={getStatusColor(status)} variant="outline">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Badge>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="radar" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>KPI Performance vs Targets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 'dataMax']}
                          tick={false}
                        />
                        <Radar
                          name="Actual"
                          dataKey="value"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                        <Radar
                          name="Target"
                          dataKey="target"
                          stroke="#10b981"
                          fill="transparent"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                        />
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="period" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="score"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Individual KPI Trends */}
                <Card>
                  <CardHeader>
                    <CardTitle>KPI Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={radarData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="metric" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#3b82f6" />
                        <Bar dataKey="target" fill="#10b981" opacity={0.7} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="space-y-4">
                  {scorecard.kpis.map(kpi => {
                    const template = kpiTemplates.find(t => t.metric === kpi.metric);
                    const status = getKpiStatus(kpi, template);
                    
                    return (
                      <Card key={kpi.id}>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              {getStatusIcon(status)}
                              {kpi.metric.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            <Badge className={getStatusColor(status)} variant="outline">
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Value:</span>
                              <span className="ml-2">
                                {kpi.value}
                                {template?.unit && ` ${template.unit}`}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Weight:</span>
                              <span className="ml-2">{template?.weight || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Direction:</span>
                              <span className="ml-2">
                                {template?.target_direction === 'up' ? 'Higher is better' : 'Lower is better'}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Source:</span>
                              <span className="ml-2">{kpi.source || 'Manual'}</span>
                            </div>
                          </div>
                          {template?.description && (
                            <div className="mt-3">
                              <span className="font-medium text-gray-700">Description:</span>
                              <p className="mt-1 text-gray-600">{template.description}</p>
                            </div>
                          )}
                          {kpi.notes && (
                            <div className="mt-3">
                              <span className="font-medium text-gray-700">Notes:</span>
                              <p className="mt-1 text-gray-600">{kpi.notes}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ScorecardGallery;
