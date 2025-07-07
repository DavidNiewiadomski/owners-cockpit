import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  Filter,
  RefreshCw,
  Zap,
  Brain,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Info,
  Loader2,
} from 'lucide-react';
import { useLeadTimes, useLeadTimeSummary } from '@/hooks/useLeadTime';
import { useForecast, useModelStatus } from '@/hooks/useLeadTimePredictor';
import { useToast } from '@/hooks/use-toast';
import { format, parseISO, addDays, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { LeadTimeDebug } from '@/components/debug/LeadTimeDebug';

interface LeadTimeBoardProps {
  rfpId?: string;
  onSelectItem?: (itemId: string) => void;
}

interface GanttRow {
  id: string;
  work_pkg: string;
  scope_csi: string[];
  rfq_issue_date: string;
  award_due: string;
  delivery_est: string;
  actual_delivery_date?: string;
  status: 'pending' | 'ontrack' | 'late' | 'delivered' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  fab_lead_days: number;
  contract_value?: number;
  aiPrediction?: {
    delivery_est: number;
    confidence_interval: { lower: number; upper: number };
    shap_values?: any;
  };
}

export function LeadTimeBoard({ rfpId, onSelectItem }: LeadTimeBoardProps) {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAiPredictions, setShowAiPredictions] = useState(true);
  const [timeRange, setTimeRange] = useState<'3months' | '6months' | '1year'>('6months');

  // Data hooks
  const { data: leadTimes = [], isLoading } = useLeadTimes({
    rfp_id: rfpId,
    status: selectedStatus !== 'all' ? [selectedStatus] : undefined,
    priority: selectedPriority !== 'all' ? [selectedPriority] : undefined,
  });

  const { data: summary } = useLeadTimeSummary(rfpId);
  const { data: modelStatus } = useModelStatus();
  const forecastMutation = useForecast();

  // Calculate time range for Gantt chart
  const timeRangeStart = useMemo(() => {
    const today = new Date();
    const months = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12;
    return new Date(today.getFullYear(), today.getMonth() - 1, 1);
  }, [timeRange]);

  const timeRangeEnd = useMemo(() => {
    const start = timeRangeStart;
    const months = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12;
    return addDays(start, months * 30);
  }, [timeRangeStart, timeRange]);

  // Filter and process lead times
  const filteredLeadTimes = useMemo(() => {
    return leadTimes.filter(item =>
      item.work_pkg.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scope_csi.some(csi => csi.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [leadTimes, searchTerm]);

  // Generate AI predictions for items
  useEffect(() => {
    if (showAiPredictions && filteredLeadTimes.length > 0) {
      filteredLeadTimes.forEach(async (item) => {
        if (!item.aiPrediction && item.status !== 'delivered') {
          try {
            const prediction = await forecastMutation.mutateAsync({
              work_pkg: item.work_pkg,
              fab_start_date: item.rfq_issue_date,
              region: 'US', // Default, could be enhanced
              urgency: item.priority === 'critical' ? 'critical' : 'normal',
              project_size: 'medium', // Default, could be enhanced
            });
            
            // Store prediction in item (this is a simplified approach)
            item.aiPrediction = prediction;
          } catch (error) {
            console.error('Failed to get AI prediction for', item.work_pkg, error);
          }
        }
      });
    }
  }, [showAiPredictions, filteredLeadTimes, forecastMutation]);

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'ontrack':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'late':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Zap className="w-3 h-3 text-red-500" />;
      case 'high':
        return <TrendingUp className="w-3 h-3 text-orange-500" />;
      case 'medium':
        return <BarChart3 className="w-3 h-3 text-blue-500" />;
      case 'low':
        return <TrendingDown className="w-3 h-3 text-green-500" />;
      default:
        return null;
    }
  };

  const calculateBarPosition = (startDate: string, endDate: string) => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    const totalDays = differenceInDays(timeRangeEnd, timeRangeStart);
    const startOffset = differenceInDays(start, timeRangeStart);
    const duration = differenceInDays(end, start);
    
    const leftPercent = Math.max(0, (startOffset / totalDays) * 100);
    const widthPercent = Math.min(100 - leftPercent, (duration / totalDays) * 100);
    
    return { left: `${leftPercent}%`, width: `${widthPercent}%` };
  };

  const renderGanttBar = (item: GanttRow) => {
    const isLate = item.status === 'late';
    const isDelivered = item.status === 'delivered';
    
    const mainBarPosition = calculateBarPosition(item.rfq_issue_date, item.delivery_est);
    const actualBarPosition = item.actual_delivery_date 
      ? calculateBarPosition(item.rfq_issue_date, item.actual_delivery_date)
      : null;

    return (
      <div className="relative h-8 bg-gray-100 rounded">
        {/* Timeline markers */}
        <div className="absolute inset-0 flex">
          {/* Main timeline bar */}
          <div
            className={cn(
              'absolute h-6 rounded top-1',
              isLate ? 'bg-red-500' : getStatusColor(item.status),
              'opacity-80'
            )}
            style={mainBarPosition}
          >
            <div className="flex items-center justify-between h-full px-2 text-xs text-white font-medium">
              <span>{format(parseISO(item.rfq_issue_date), 'MMM dd')}</span>
              <span>{format(parseISO(item.delivery_est), 'MMM dd')}</span>
            </div>
          </div>

          {/* Actual delivery bar (if delivered) */}
          {actualBarPosition && (
            <div
              className="absolute h-2 bg-green-600 rounded top-0 opacity-90"
              style={actualBarPosition}
            />
          )}

          {/* AI prediction bar (if available) */}
          {showAiPredictions && item.aiPrediction && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="absolute h-2 bg-purple-400 rounded bottom-0 opacity-70 cursor-help"
                    style={calculateBarPosition(
                      item.rfq_issue_date,
                      addDays(parseISO(item.rfq_issue_date), item.aiPrediction.delivery_est).toISOString()
                    )}
                  >
                    <Brain className="w-3 h-3 text-purple-600 absolute -right-1 -top-1" />
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <div className="space-y-2">
                    <div className="font-semibold flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      AI Risk Analysis
                    </div>
                    <div className="text-sm">
                      <div>Predicted delivery: {item.aiPrediction.delivery_est} days</div>
                      <div>Confidence: {item.aiPrediction.confidence_interval.lower}-{item.aiPrediction.confidence_interval.upper} days</div>
                    </div>
                    {item.aiPrediction.shap_values && (
                      <div className="space-y-1 text-xs">
                        <div className="font-medium">Risk Drivers:</div>
                        <div className="grid grid-cols-2 gap-1">
                          <div>Work Package: {item.aiPrediction.shap_values.work_package_impact > 0 ? '+' : ''}{item.aiPrediction.shap_values.work_package_impact} days</div>
                          <div>Region: {item.aiPrediction.shap_values.region_impact > 0 ? '+' : ''}{item.aiPrediction.shap_values.region_impact} days</div>
                          <div>Urgency: {item.aiPrediction.shap_values.urgency_impact > 0 ? '+' : ''}{item.aiPrediction.shap_values.urgency_impact} days</div>
                          <div>Size: {item.aiPrediction.shap_values.size_impact > 0 ? '+' : ''}{item.aiPrediction.shap_values.size_impact} days</div>
                          <div>Seasonal: {item.aiPrediction.shap_values.seasonal_impact > 0 ? '+' : ''}{item.aiPrediction.shap_values.seasonal_impact.toFixed(1)} days</div>
                          <div>Market: {item.aiPrediction.shap_values.enr_impact > 0 ? '+' : ''}{(item.aiPrediction.shap_values.enr_impact * 10).toFixed(1)} days</div>
                        </div>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    );
  };

  const renderTimelineHeader = () => {
    const months = [];
    const current = new Date(timeRangeStart);
    
    while (current <= timeRangeEnd) {
      months.push(new Date(current));
      current.setMonth(current.getMonth() + 1);
    }

    return (
      <div className="flex bg-gray-50 border-b sticky top-0 z-10">
        <div className="w-80 p-3 font-semibold border-r">Work Package</div>
        <div className="flex-1 relative">
          <div className="flex">
            {months.map((month, index) => (
              <div key={index} className="flex-1 p-3 text-center text-sm border-r">
                {format(month, 'MMM yyyy')}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading lead times...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <LeadTimeDebug />
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Lead Time Board</h2>
          <p className="text-muted-foreground">Gantt-style view of work package delivery schedules</p>
        </div>
        <div className="flex items-center gap-3">
          {modelStatus && (
            <Badge variant={modelStatus.status === 'trained' ? 'default' : 'secondary'}>
              AI Model: {modelStatus.model_version}
            </Badge>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAiPredictions(!showAiPredictions)}
          >
            <Brain className="w-4 h-4 mr-2" />
            {showAiPredictions ? 'Hide' : 'Show'} AI Predictions
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{summary?.total_items || 0}</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
              <Package className="w-6 h-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-red-600">{summary?.late_items || 0}</div>
                <div className="text-sm text-muted-foreground">Late Items</div>
              </div>
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-600">{summary?.critical_items || 0}</div>
                <div className="text-sm text-muted-foreground">Critical Items</div>
              </div>
              <Zap className="w-6 h-6 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{summary?.avg_lead_days ? Math.round(summary.avg_lead_days) : 0}</div>
                <div className="text-sm text-muted-foreground">Avg Lead Days</div>
              </div>
              <Clock className="w-6 h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & View Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <Label>Search</Label>
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="ontrack">On Track</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Time Range</Label>
              <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedStatus('all');
                  setSelectedPriority('all');
                  setSearchTerm('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gantt Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Timeline View</span>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span>Planned</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span>Actual</span>
              </div>
              {showAiPredictions && (
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded"></div>
                  <Brain className="w-3 h-3" />
                  <span>AI Prediction</span>
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto max-h-96">
            {renderTimelineHeader()}
            
            {filteredLeadTimes.map((item) => (
              <div key={item.id} className="flex border-b hover:bg-gray-50">
                <div className="w-80 p-3 border-r">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPriorityIcon(item.priority)}
                      <div>
                        <div className="font-medium">{item.work_pkg}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.scope_csi.join(', ')}
                        </div>
                      </div>
                    </div>
                    <Badge className={cn(
                      'text-xs',
                      item.status === 'late' ? 'bg-red-100 text-red-700' : 
                      item.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      item.status === 'ontrack' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    )}>
                      {item.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {item.fab_lead_days} days • ${((item.contract_value || 0) / 1000).toFixed(0)}K
                  </div>
                </div>
                <div className="flex-1 p-3">
                  {renderGanttBar(item)}
                </div>
              </div>
            ))}

            {filteredLeadTimes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No lead time items found
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LeadTimeBoard;
