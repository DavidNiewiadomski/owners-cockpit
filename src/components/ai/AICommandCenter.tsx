import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Activity, 
  Shield, 
  DollarSign, 
  MessageSquare, 
  AlertTriangle,
  TrendingUp,
  Pause,
  Play,
  Mic,
  Search,
  Sparkles,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  Users,
  FileText,
  Eye
} from 'lucide-react';
import { aiAgentFramework, AIAgent, AgentAction } from '@/lib/ai/agent-framework';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '@/hooks/useAppState';
import { useRouter } from '@/hooks/useRouter';
import { FrontendAIService } from '@/lib/ai/frontend-ai-service';
import { supabase } from '@/lib/supabaseClient';

const AICommandCenter: React.FC = () => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [recentActions, setRecentActions] = useState<AgentAction[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<any>({});
  const [commandInput, setCommandInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const { selectedProject } = useAppState();
  const router = useRouter();
  const [aiService] = useState(() => new FrontendAIService());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Initialize AI service
    aiService.initialize();
    
    // Start the AI agent framework
    aiAgentFramework.start();
    
    // Load initial data
    loadAgentData();
    
    // Subscribe to real-time updates
    const unsubscribe = aiAgentFramework.subscribeToActions((action) => {
      setRecentActions(prev => [action, ...prev].slice(0, 20));
    });
    
    // Update data every 5 seconds
    const interval = setInterval(loadAgentData, 5000);
    
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const loadAgentData = () => {
    setAgents(aiAgentFramework.getAgents());
    setRecentActions(aiAgentFramework.getRecentActions(20));
    setSystemMetrics(aiAgentFramework.getSystemMetrics());
    loadPredictions();
  };

  const loadPredictions = async () => {
    try {
      // Fetch from seeded DB
      const { data: projectData } = await supabase.from('projects').select('*').eq('id', selectedProject).single();
      const baseRisk = projectData ? projectData.risk_score || 50 : 50;

      // Mock external data fetch
      let weatherImpact = 0;
      try {
        const response = await fetch('https://api.weather.example.com/forecast?location=' + (projectData?.location || 'default'));
        const weatherData = await response.json();
        weatherImpact = weatherData.forecast?.some((day: any) => day.condition === 'rain') ? 20 : 0;
      } catch {} // Ignore

      setPredictions([
        {
          type: 'risk',
          title: 'Weather delay likely next week',
          probability: baseRisk + weatherImpact,
          impact: weatherImpact > 10 ? 'high' : 'medium',
          recommendation: 'Reschedule outdoor work'
        },
        {
          type: 'budget',
          title: 'Steel prices increasing',
          probability: 92,
          impact: 'medium',
          recommendation: 'Lock in current pricing'
        },
        {
          type: 'schedule',
          title: 'Permit approval faster than expected',
          probability: 85,
          impact: 'positive',
          recommendation: 'Accelerate foundation work'
        }
      ]);
    } catch (error) {
      console.error('Failed to load predictions:', error);
      setPredictions([]); // Fallback
    }
  };

  const handleCommand = async () => {
    if (!commandInput.trim()) return;
    
    setIsProcessing(true);
    try {
      // Process natural language command
      const response = await aiService.processMessage({
        message: commandInput,
        projectId: selectedProject || 'portfolio',
        taskType: 'command',
        priority: 'high'
      });
      
      if (response.success) {
        // Parse and execute command
        // In a real implementation, this would navigate or execute actions
        console.log('Command processed:', response);
      }
    } catch (error) {
      console.error('Command failed:', error);
    } finally {
      setIsProcessing(false);
      setCommandInput('');
    }
  };

  const toggleAgent = (agentId: string) => {
    const agent = agents.find(a => a.id === agentId);
    if (agent?.status === 'active') {
      aiAgentFramework.pauseAgent(agentId);
    } else {
      aiAgentFramework.resumeAgent(agentId);
    }
    loadAgentData();
  };

  const getAgentIcon = (agentId: string) => {
    switch (agentId) {
      case 'project-guardian': return <Shield className="w-5 h-5" />;
      case 'risk-prevention': return <AlertTriangle className="w-5 h-5" />;
      case 'communication-agent': return <MessageSquare className="w-5 h-5" />;
      case 'compliance-agent': return <FileText className="w-5 h-5" />;
      case 'budget-optimizer': return <DollarSign className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      case 'positive': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Brain className="w-10 h-10 text-primary" />
              AI Command Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Your intelligent construction management hub
            </p>
          </div>
          <Badge variant="secondary" className="px-4 py-2">
            <Sparkles className="w-4 h-4 mr-2" />
            {systemMetrics.activeAgents} Active Agents
          </Badge>
        </div>

        {/* Natural Language Command Bar */}
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCommand()}
                placeholder="Ask me anything or give a command... (e.g., 'Show me overdue tasks' or 'Schedule a safety meeting')"
                className="flex-1 border-0 focus-visible:ring-0"
                disabled={isProcessing}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsListening(!isListening)}
                className={isListening ? 'text-primary' : ''}
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Button onClick={handleCommand} disabled={isProcessing}>
                <Zap className="w-4 h-4 mr-2" />
                Execute
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actions Performed</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalActions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Issues Prevented</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {systemMetrics.totalIssuesPrevented || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Proactive interventions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Saved</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              ${(systemMetrics.totalCostSaved || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Through AI optimization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Optimized</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {systemMetrics.totalTimeOptimized || 0}h
            </div>
            <p className="text-xs text-muted-foreground">
              Efficiency gains
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agents">AI Agents</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="actions">Recent Actions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        {/* AI Agents Tab */}
        <TabsContent value="agents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      {getAgentIcon(agent.id)}
                      {agent.name}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleAgent(agent.id)}
                    >
                      {agent.status === 'active' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <CardDescription>{agent.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                        {agent.status}
                      </Badge>
                    </div>
                    {agent.metrics && (
                      <>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Actions</span>
                          <span className="font-medium">{agent.metrics.actionsPerformed}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Issues Prevented</span>
                          <span className="font-medium text-green-500">
                            {agent.metrics.issuesPrevented}
                          </span>
                        </div>
                      </>
                    )}
                    {agent.lastAction && (
                      <p className="text-xs text-muted-foreground">
                        Last action: {new Date(agent.lastAction).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Predictions Tab */}
        <TabsContent value="predictions" className="space-y-4">
          <div className="grid gap-4">
            {predictions.map((prediction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Alert className="border-l-4" style={{
                  borderLeftColor: prediction.impact === 'high' ? '#ef4444' : 
                                   prediction.impact === 'positive' ? '#3b82f6' : '#eab308'
                }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4" />
                        <h3 className="font-semibold">{prediction.title}</h3>
                        <Badge variant="outline" className={getImpactColor(prediction.impact)}>
                          {prediction.probability}% probability
                        </Badge>
                      </div>
                      <AlertDescription>
                        <p className="mb-2">Impact: {prediction.impact}</p>
                        <p className="font-medium">Recommendation: {prediction.recommendation}</p>
                      </AlertDescription>
                    </div>
                    <Button size="sm">Take Action</Button>
                  </div>
                </Alert>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Recent Actions Tab */}
        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Activity Feed</CardTitle>
              <CardDescription>
                Real-time log of all AI agent actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                <AnimatePresence>
                  {recentActions.map((action, index) => (
                    <motion.div
                      key={`${action.agentId}-${action.timestamp}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div className="mt-1">
                        {getAgentIcon(action.agentId)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{action.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {action.type}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getImpactColor(action.impact)}`}
                          >
                            {action.impact} impact
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(action.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Schedule Efficiency</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <Progress value={87} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Budget Optimization</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Risk Mitigation</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="relative inline-flex">
                    <div className="w-32 h-32 rounded-full border-8 border-primary/20" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <p className="text-3xl font-bold">94%</p>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    AI improves with every interaction
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AICommandCenter;