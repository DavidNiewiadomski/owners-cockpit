import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Brain,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Eye,
  Pause,
  Play,
  RotateCcw,
  MessageSquare,
  FileText,
  DollarSign,
  Users,
  Shield,
  Calendar,
  Building,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DecisionFramework } from '@/lib/ai/decision-framework';
import { formatDistanceToNow } from 'date-fns';

interface AIAction {
  id: string;
  timestamp: Date;
  type: 'decision' | 'action' | 'analysis' | 'communication' | 'workflow';
  category: string;
  title: string;
  description: string;
  status: 'pending' | 'executing' | 'completed' | 'failed' | 'approved' | 'rejected';
  impact: {
    users?: number;
    cost?: number;
    time?: number;
    risk?: 'low' | 'medium' | 'high';
  };
  result?: any;
  requiresApproval?: boolean;
  approvalLevel?: string;
  confidence?: number;
  relatedItems?: any[];
  duration?: number;
}

interface AIMetrics {
  totalActions: number;
  successRate: number;
  avgResponseTime: number;
  decisionsPerHour: number;
  costSavings: number;
  timeSaved: number;
  activeWorkflows: number;
  pendingApprovals: number;
}

interface DecisionDetails {
  factors: Array<{
    name: string;
    weight: number;
    value: number;
    reasoning: string;
  }>;
  options: Array<{
    title: string;
    score: number;
    risks: number;
  }>;
  recommendation?: string;
}

export const RealTimeAIMonitor: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [actions, setActions] = useState<AIAction[]>([]);
  const [metrics, setMetrics] = useState<AIMetrics>({
    totalActions: 0,
    successRate: 98.5,
    avgResponseTime: 1.2,
    decisionsPerHour: 24,
    costSavings: 125000,
    timeSaved: 480,
    activeWorkflows: 3,
    pendingApprovals: 2
  });
  const [selectedAction, setSelectedAction] = useState<AIAction | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState<'all' | 'decisions' | 'actions' | 'approvals'>('all');
  const [isConnected, setIsConnected] = useState(false);
  
  const subscriptionRef = useRef<any>(null);
  const decisionFrameworkRef = useRef<DecisionFramework | null>(null);

  useEffect(() => {
    // Initialize decision framework
    decisionFrameworkRef.current = new DecisionFramework({
      projectId,
      userId: 'system',
      projectPhase: 'construction',
      budgetRemaining: 2500000,
      scheduleFloat: 15,
      riskTolerance: 'medium',
      stakeholderPriorities: {
        cost: 0.3,
        schedule: 0.3,
        quality: 0.2,
        safety: 0.2
      }
    });

    // Set up real-time subscription
    const channel = supabase
      .channel(`ai-actions-${projectId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'ai_action_logs',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          if (!isPaused) {
            handleRealtimeUpdate(payload);
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
        if (status === 'SUBSCRIBED') {
          toast.success('Connected to real-time AI monitoring');
          loadRecentActions();
        }
      });

    subscriptionRef.current = channel;

    // Simulate some initial actions for demo
    if (projectId === 'demo') {
      simulateDemoActions();
    }

    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [projectId, isPaused]);

  const handleRealtimeUpdate = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;
    
    if (eventType === 'INSERT') {
      const action = transformToAction(newRecord);
      setActions(prev => [action, ...prev].slice(0, 50));
      
      // Update metrics
      updateMetrics(action);
      
      // Show notification for important actions
      if (action.requiresApproval || action.impact.risk === 'high') {
        toast.warning(`AI Action Requires Attention: ${action.title}`);
      }
    } else if (eventType === 'UPDATE') {
      setActions(prev => prev.map(a => 
        a.id === newRecord.id ? transformToAction(newRecord) : a
      ));
    }
  };

  const transformToAction = (record: any): AIAction => {
    return {
      id: record.id,
      timestamp: new Date(record.created_at),
      type: record.action_type || 'action',
      category: record.resource,
      title: record.action,
      description: record.description || `${record.action} on ${record.resource}`,
      status: record.status,
      impact: {
        users: record.affected_users,
        cost: record.cost_impact,
        time: record.time_impact,
        risk: record.risk_level
      },
      result: record.result_data,
      requiresApproval: record.requires_approval,
      approvalLevel: record.approval_level,
      confidence: record.confidence,
      relatedItems: record.related_items,
      duration: record.execution_time_ms
    };
  };

  const updateMetrics = (action: AIAction) => {
    setMetrics(prev => ({
      ...prev,
      totalActions: prev.totalActions + 1,
      successRate: action.status === 'failed' 
        ? (prev.successRate * prev.totalActions - 1) / (prev.totalActions + 1)
        : prev.successRate,
      avgResponseTime: action.duration 
        ? (prev.avgResponseTime * prev.totalActions + action.duration) / (prev.totalActions + 1) / 1000
        : prev.avgResponseTime,
      costSavings: prev.costSavings + (action.impact.cost || 0),
      timeSaved: prev.timeSaved + (action.impact.time || 0),
      pendingApprovals: action.requiresApproval 
        ? prev.pendingApprovals + 1 
        : prev.pendingApprovals
    }));
  };

  const loadRecentActions = async () => {
    const { data, error } = await supabase
      .from('ai_action_logs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data && !error) {
      setActions(data.map(transformToAction));
    }
  };

  const simulateDemoActions = () => {
    const demoActions: AIAction[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 5 * 60000),
        type: 'analysis',
        category: 'safety',
        title: 'Safety Risk Detected',
        description: 'Identified high-risk crane operation near active work area',
        status: 'completed',
        impact: { risk: 'high', users: 15 },
        confidence: 92,
        result: { area: 'Zone A', recommendation: 'Halt operations and secure area' }
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 3 * 60000),
        type: 'decision',
        category: 'schedule',
        title: 'Weather Impact Decision',
        description: 'Rescheduling concrete pour due to rain forecast',
        status: 'approved',
        impact: { time: -2, cost: 15000 },
        requiresApproval: true,
        approvalLevel: 'pm',
        confidence: 88
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 2 * 60000),
        type: 'action',
        category: 'communication',
        title: 'Subcontractor Notification',
        description: 'Sent schedule updates to 8 subcontractors',
        status: 'completed',
        impact: { users: 8 },
        duration: 350
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 1 * 60000),
        type: 'workflow',
        category: 'quality',
        title: 'Quality Inspection Scheduled',
        description: 'Automated inspection for completed foundation work',
        status: 'executing',
        impact: { time: 4 },
        confidence: 95
      }
    ];

    setActions(demoActions);
  };

  const handleApproval = async (actionId: string, approved: boolean) => {
    const action = actions.find(a => a.id === actionId);
    if (!action) return;

    // Update action status
    setActions(prev => prev.map(a => 
      a.id === actionId 
        ? { ...a, status: approved ? 'approved' : 'rejected' }
        : a
    ));

    // Update metrics
    setMetrics(prev => ({
      ...prev,
      pendingApprovals: Math.max(0, prev.pendingApprovals - 1)
    }));

    // Execute if approved
    if (approved) {
      toast.success(`Approved: ${action.title}`);
      // Trigger execution through platform-actions
      await supabase.functions.invoke('platform-actions', {
        body: {
          action: 'execute',
          resource: action.category,
          data: action.result,
          user_id: 'approver',
          project_id: projectId,
          ai_request_id: actionId
        }
      });
    } else {
      toast.info(`Rejected: ${action.title}`);
    }
  };

  const getActionIcon = (type: AIAction['type']) => {
    switch (type) {
      case 'decision':
        return Brain;
      case 'action':
        return Zap;
      case 'analysis':
        return Eye;
      case 'communication':
        return MessageSquare;
      case 'workflow':
        return Activity;
      default:
        return Activity;
    }
  };

  const getStatusColor = (status: AIAction['status']) => {
    switch (status) {
      case 'completed':
      case 'approved':
        return 'text-green-500';
      case 'executing':
        return 'text-blue-500';
      case 'pending':
        return 'text-yellow-500';
      case 'failed':
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredActions = actions.filter(action => {
    if (filter === 'all') return true;
    if (filter === 'decisions') return action.type === 'decision';
    if (filter === 'actions') return action.type === 'action' || action.type === 'workflow';
    if (filter === 'approvals') return action.requiresApproval;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Real-Time AI Monitor</h3>
            <p className="text-sm text-muted-foreground">
              Live feed of AI decisions and actions
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isConnected ? "secondary" : "destructive"} className="animate-pulse">
            {isConnected ? 'Live' : 'Disconnected'}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={loadRecentActions}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Actions Today</p>
                <p className="text-xl font-bold">{metrics.totalActions}</p>
              </div>
              <Zap className="w-6 h-6 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="text-xl font-bold">{metrics.successRate.toFixed(1)}%</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-500/20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Time Saved</p>
                <p className="text-xl font-bold">{Math.floor(metrics.timeSaved / 60)}h</p>
              </div>
              <Clock className="w-6 h-6 text-blue-500/20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Pending</p>
                <p className="text-xl font-bold">{metrics.pendingApprovals}</p>
              </div>
              <AlertTriangle className="w-6 h-6 text-yellow-500/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Action Feed */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>AI Activity Feed</CardTitle>
                <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
                  <TabsList>
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="decisions">Decisions</TabsTrigger>
                    <TabsTrigger value="actions">Actions</TabsTrigger>
                    <TabsTrigger value="approvals">
                      Approvals
                      {metrics.pendingApprovals > 0 && (
                        <Badge variant="destructive" className="ml-1 h-4 px-1">
                          {metrics.pendingApprovals}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredActions.map((action, index) => {
                    const Icon = getActionIcon(action.type);
                    return (
                      <motion.div
                        key={action.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedAction?.id === action.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedAction(action)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-full bg-background border ${getStatusColor(action.status)}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-medium flex items-center gap-2">
                                  {action.title}
                                  {action.requiresApproval && action.status === 'pending' && (
                                    <Badge variant="destructive" className="text-xs">
                                      Requires Approval
                                    </Badge>
                                  )}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {action.description}
                                </p>
                              </div>
                              
                              <div className="text-right">
                                <p className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(action.timestamp, { addSuffix: true })}
                                </p>
                                {action.confidence && (
                                  <Badge variant="secondary" className="text-xs mt-1">
                                    {action.confidence}% confident
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            {/* Impact indicators */}
                            <div className="flex items-center gap-3 mt-2">
                              {action.impact.users && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Users className="w-3 h-3" />
                                  {action.impact.users} affected
                                </div>
                              )}
                              {action.impact.cost && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <DollarSign className="w-3 h-3" />
                                  ${action.impact.cost.toLocaleString()}
                                </div>
                              )}
                              {action.impact.time && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="w-3 h-3" />
                                  {action.impact.time}h
                                </div>
                              )}
                              {action.impact.risk && (
                                <Badge 
                                  variant={
                                    action.impact.risk === 'high' ? 'destructive' :
                                    action.impact.risk === 'medium' ? 'secondary' :
                                    'outline'
                                  }
                                  className="text-xs"
                                >
                                  {action.impact.risk} risk
                                </Badge>
                              )}
                            </div>
                            
                            {/* Action buttons for approvals */}
                            {action.requiresApproval && action.status === 'pending' && (
                              <div className="flex items-center gap-2 mt-3">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApproval(action.id, true);
                                  }}
                                >
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApproval(action.id, false);
                                  }}
                                >
                                  Reject
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                
                {filteredActions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No AI actions to display</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Details Panel */}
        <div>
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>Action Details</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto">
              {selectedAction ? (
                <div className="space-y-4">
                  {/* Status */}
                  <div>
                    <p className="text-sm font-medium mb-2">Status</p>
                    <Badge className={getStatusColor(selectedAction.status)}>
                      {selectedAction.status}
                    </Badge>
                  </div>
                  
                  {/* Timing */}
                  <div>
                    <p className="text-sm font-medium mb-2">Timing</p>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Started: {selectedAction.timestamp.toLocaleTimeString()}</p>
                      {selectedAction.duration && (
                        <p>Duration: {(selectedAction.duration / 1000).toFixed(2)}s</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Decision Details */}
                  {selectedAction.type === 'decision' && selectedAction.result && (
                    <div>
                      <p className="text-sm font-medium mb-2">Decision Analysis</p>
                      <div className="space-y-3">
                        {selectedAction.result.factors?.map((factor: any, index: number) => (
                          <div key={index} className="space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="text-sm">{factor.name}</p>
                              <Badge variant="outline" className="text-xs">
                                Weight: {(factor.weight * 100).toFixed(0)}%
                              </Badge>
                            </div>
                            <Progress value={factor.value} className="h-2" />
                            <p className="text-xs text-muted-foreground">{factor.reasoning}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Result */}
                  {selectedAction.result && (
                    <div>
                      <p className="text-sm font-medium mb-2">Result</p>
                      <pre className="text-xs bg-muted p-3 rounded overflow-auto">
                        {JSON.stringify(selectedAction.result, null, 2)}
                      </pre>
                    </div>
                  )}
                  
                  {/* Related Items */}
                  {selectedAction.relatedItems && selectedAction.relatedItems.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Related Items</p>
                      <div className="space-y-2">
                        {selectedAction.relatedItems.map((item: any, index: number) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            <span>{item.name || item.id}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>Select an action to view details</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RealTimeAIMonitor;