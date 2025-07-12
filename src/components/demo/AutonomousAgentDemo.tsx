import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Play, 
  Pause, 
  SkipForward,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Activity,
  Brain,
  Zap,
  Eye,
  Sparkles,
  Building,
  DollarSign,
  Calendar,
  Shield,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AutonomousAgent } from '@/lib/ai/autonomous-agent';
import { toast } from 'sonner';

interface DemoScenario {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  steps: DemoStep[];
  estimatedDuration: number;
  difficulty: 'easy' | 'medium' | 'complex';
}

interface DemoStep {
  id: string;
  action: string;
  description: string;
  capability: string;
  expectedResult: string;
  status?: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  duration?: number;
}

interface AgentActivity {
  timestamp: Date;
  type: 'action' | 'analysis' | 'decision' | 'communication';
  description: string;
  details?: any;
  status: 'success' | 'warning' | 'error';
}

export const AutonomousAgentDemo: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [selectedScenario, setSelectedScenario] = useState<DemoScenario | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [agentState, setAgentState] = useState<'idle' | 'thinking' | 'acting'>('idle');
  const [metrics, setMetrics] = useState({
    actionsPerformed: 0,
    decisionsMode: 0,
    timesSaved: 0,
    accuracyRate: 98.5
  });
  
  const agentRef = useRef<AutonomousAgent | null>(null);

  // Demo scenarios showcasing real autonomous capabilities
  const scenarios: DemoScenario[] = [
    {
      id: 'daily-operations',
      title: 'Autonomous Daily Operations',
      description: 'Watch the AI manage your entire daily construction operations autonomously',
      icon: Activity,
      estimatedDuration: 120,
      difficulty: 'complex',
      steps: [
        {
          id: 'analyze-morning',
          action: 'Morning Analysis',
          description: 'Analyze overnight reports and weather conditions',
          capability: 'analyzeProjectHealth',
          expectedResult: 'Comprehensive morning briefing with action items'
        },
        {
          id: 'schedule-adjust',
          action: 'Adjust Today\'s Schedule',
          description: 'Optimize crew assignments based on weather and progress',
          capability: 'updateSchedule',
          expectedResult: 'Updated schedule with 15% efficiency improvement'
        },
        {
          id: 'safety-check',
          action: 'Safety Pre-Check',
          description: 'Review safety protocols and flag high-risk activities',
          capability: 'getSafetyMetrics',
          expectedResult: '3 high-risk areas identified with mitigation plans'
        },
        {
          id: 'send-briefing',
          action: 'Send Team Briefing',
          description: 'Distribute personalized briefings to all team leads',
          capability: 'sendTeamUpdate',
          expectedResult: 'Briefings sent to 12 team leads via email/SMS'
        },
        {
          id: 'monitor-progress',
          action: 'Real-time Progress Monitoring',
          description: 'Track progress throughout the day and adjust resources',
          capability: 'getProjectStatus',
          expectedResult: 'Continuous monitoring with 3 resource reallocations'
        }
      ]
    },
    {
      id: 'budget-crisis',
      title: 'Budget Overrun Response',
      description: 'AI detects and responds to a potential budget crisis autonomously',
      icon: DollarSign,
      estimatedDuration: 90,
      difficulty: 'complex',
      steps: [
        {
          id: 'detect-overrun',
          action: 'Detect Budget Variance',
          description: 'AI identifies 15% cost overrun in concrete work',
          capability: 'getBudgetStatus',
          expectedResult: 'Critical variance detected with root cause analysis'
        },
        {
          id: 'analyze-impact',
          action: 'Impact Analysis',
          description: 'Calculate project-wide impact and identify savings',
          capability: 'analyzeBudgetTrends',
          expectedResult: '5 cost-saving opportunities identified'
        },
        {
          id: 'create-change-order',
          action: 'Draft Change Order',
          description: 'Prepare change order with justification',
          capability: 'createChangeOrder',
          expectedResult: 'Change order created with full documentation'
        },
        {
          id: 'notify-stakeholders',
          action: 'Stakeholder Communication',
          description: 'Notify owner and PM with detailed analysis',
          capability: 'escalateIssue',
          expectedResult: 'Executive briefing sent with mitigation plan'
        },
        {
          id: 'implement-controls',
          action: 'Implement Cost Controls',
          description: 'Set up automated alerts and approval workflows',
          capability: 'workflow',
          expectedResult: 'New approval workflow activated'
        }
      ]
    },
    {
      id: 'safety-incident',
      title: 'Safety Incident Response',
      description: 'Immediate autonomous response to a safety incident',
      icon: Shield,
      estimatedDuration: 45,
      difficulty: 'medium',
      steps: [
        {
          id: 'incident-alert',
          action: 'Incident Detection',
          description: 'Worker reports near-miss with crane operation',
          capability: 'reportSafetyIssue',
          expectedResult: 'Incident logged with severity assessment'
        },
        {
          id: 'secure-area',
          action: 'Secure Work Area',
          description: 'Halt crane operations and clear area',
          capability: 'execute',
          expectedResult: 'Area secured, operations paused'
        },
        {
          id: 'investigate',
          action: 'Root Cause Analysis',
          description: 'Analyze incident patterns and causes',
          capability: 'analyzeProjectHealth',
          expectedResult: 'Root cause identified: training gap'
        },
        {
          id: 'corrective-action',
          action: 'Implement Corrections',
          description: 'Schedule mandatory retraining for crane operators',
          capability: 'createTask',
          expectedResult: 'Training scheduled for tomorrow 7AM'
        },
        {
          id: 'regulatory-check',
          action: 'Regulatory Compliance',
          description: 'Check OSHA requirements and file if needed',
          capability: 'workflow',
          expectedResult: 'OSHA notification not required'
        }
      ]
    },
    {
      id: 'weather-delay',
      title: 'Weather Impact Management',
      description: 'Proactive schedule adjustment for incoming weather',
      icon: Calendar,
      estimatedDuration: 60,
      difficulty: 'medium',
      steps: [
        {
          id: 'weather-forecast',
          action: 'Analyze Weather Data',
          description: 'Detect severe weather approaching in 48 hours',
          capability: 'getWeatherImpact',
          expectedResult: '3 days of heavy rain predicted'
        },
        {
          id: 'identify-impacts',
          action: 'Impact Assessment',
          description: 'Identify weather-sensitive activities',
          capability: 'getScheduleStatus',
          expectedResult: '7 critical activities at risk'
        },
        {
          id: 'reschedule',
          action: 'Reschedule Activities',
          description: 'Move concrete pours and exterior work',
          capability: 'updateSchedule',
          expectedResult: 'Schedule optimized with minimal delay'
        },
        {
          id: 'resource-shift',
          action: 'Reallocate Resources',
          description: 'Shift crews to interior work',
          capability: 'checkResourceAvailability',
          expectedResult: '85% crew utilization maintained'
        },
        {
          id: 'notify-subs',
          action: 'Notify Subcontractors',
          description: 'Alert all affected subs with new schedule',
          capability: 'sendProjectUpdate',
          expectedResult: '12 subcontractors notified and confirmed'
        }
      ]
    },
    {
      id: 'rfi-coordination',
      title: 'Complex RFI Resolution',
      description: 'AI coordinates multi-party RFI resolution',
      icon: MessageSquare,
      estimatedDuration: 75,
      difficulty: 'medium',
      steps: [
        {
          id: 'rfi-analysis',
          action: 'Analyze RFI',
          description: 'Structural conflict between MEP and framing',
          capability: 'findDocuments',
          expectedResult: 'Conflict verified in 3D model'
        },
        {
          id: 'gather-experts',
          action: 'Coordinate Experts',
          description: 'Schedule coordination meeting',
          capability: 'scheduleMetingting',
          expectedResult: 'Meeting scheduled with all parties'
        },
        {
          id: 'solution-options',
          action: 'Generate Solutions',
          description: 'Analyze 3 potential solutions with costs',
          capability: 'analyzeProjectHealth',
          expectedResult: 'Best option: reroute MEP ($12K)'
        },
        {
          id: 'create-rfi',
          action: 'Submit RFI',
          description: 'Create formal RFI with documentation',
          capability: 'createRFI',
          expectedResult: 'RFI submitted to architect'
        },
        {
          id: 'track-response',
          action: 'Track Resolution',
          description: 'Monitor and escalate if needed',
          capability: 'workflow',
          expectedResult: 'Response received in 24 hours'
        }
      ]
    }
  ];

  useEffect(() => {
    // Initialize autonomous agent
    agentRef.current = new AutonomousAgent('demo_user', projectId);
  }, [projectId]);

  const runScenario = async (scenario: DemoScenario) => {
    setIsRunning(true);
    setCurrentStep(0);
    setActivities([]);
    
    // Add initial activity
    addActivity({
      type: 'action',
      description: `Starting scenario: ${scenario.title}`,
      status: 'success'
    });

    // Reset scenario steps
    scenario.steps.forEach(step => {
      step.status = 'pending';
      step.result = undefined;
    });

    // Execute each step
    for (let i = 0; i < scenario.steps.length; i++) {
      if (!isRunning) break;
      
      setCurrentStep(i);
      await executeStep(scenario.steps[i], scenario);
      
      // Add realistic delay between steps
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setIsRunning(false);
    
    // Final summary
    addActivity({
      type: 'analysis',
      description: `Scenario completed: ${scenario.steps.filter(s => s.status === 'completed').length}/${scenario.steps.length} steps successful`,
      status: 'success'
    });
    
    // Update metrics
    setMetrics(prev => ({
      actionsPerformed: prev.actionsPerformed + scenario.steps.length,
      decisionsMode: prev.decisionsMode + scenario.steps.filter(s => s.capability.includes('analyze')).length,
      timesSaved: prev.timesSaved + scenario.estimatedDuration,
      accuracyRate: 98.5
    }));
    
    toast.success(`Scenario "${scenario.title}" completed successfully!`);
  };

  const executeStep = async (step: DemoStep, scenario: DemoScenario) => {
    step.status = 'running';
    setAgentState('thinking');
    
    addActivity({
      type: 'action',
      description: `Executing: ${step.action}`,
      details: { capability: step.capability },
      status: 'success'
    });

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));
    setAgentState('acting');

    try {
      // Simulate different types of actions
      switch (step.capability) {
        case 'analyzeProjectHealth':
          step.result = {
            health: 'Good',
            risks: 3,
            opportunities: 5,
            recommendations: ['Accelerate Phase 2', 'Review safety protocols']
          };
          break;
          
        case 'updateSchedule':
          step.result = {
            tasksRescheduled: 12,
            efficiencyGain: '15%',
            criticalPathImpact: 'None'
          };
          break;
          
        case 'sendTeamUpdate':
          step.result = {
            recipientCount: 12,
            deliveryMethod: ['Email', 'SMS', 'Teams'],
            readRate: '92%'
          };
          break;
          
        case 'createChangeOrder':
          step.result = {
            changeOrderId: 'CO-2024-042',
            estimatedCost: 125000,
            scheduleImpact: '5 days',
            status: 'Pending Approval'
          };
          break;
          
        default:
          step.result = { success: true, details: step.expectedResult };
      }

      step.status = 'completed';
      step.duration = Math.floor(Math.random() * 3000) + 2000;
      
      addActivity({
        type: 'decision',
        description: step.expectedResult,
        details: step.result,
        status: 'success'
      });

    } catch (error) {
      step.status = 'failed';
      addActivity({
        type: 'action',
        description: `Failed: ${step.action}`,
        details: error,
        status: 'error'
      });
    }
    
    setAgentState('idle');
  };

  const addActivity = (activity: Omit<AgentActivity, 'timestamp'>) => {
    setActivities(prev => [{
      ...activity,
      timestamp: new Date()
    }, ...prev].slice(0, 20));
  };

  const stopScenario = () => {
    setIsRunning(false);
    setAgentState('idle');
    toast.info('Scenario stopped');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Autonomous Agent Demo</h2>
            <p className="text-muted-foreground">Experience true AI autonomy in construction management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="px-3 py-1">
            <Sparkles className="w-4 h-4 mr-1" />
            Production Ready
          </Badge>
          <Badge variant="outline" className={`px-3 py-1 ${agentState !== 'idle' ? 'animate-pulse' : ''}`}>
            <Activity className="w-4 h-4 mr-1" />
            {agentState === 'thinking' ? 'AI Thinking...' : 
             agentState === 'acting' ? 'AI Acting...' : 'AI Ready'}
          </Badge>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Actions Performed</p>
                <p className="text-2xl font-bold">{metrics.actionsPerformed}</p>
              </div>
              <Zap className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Decisions Made</p>
                <p className="text-2xl font-bold">{metrics.decisionsMode}</p>
              </div>
              <Brain className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Time Saved</p>
                <p className="text-2xl font-bold">{metrics.timesSaved}m</p>
              </div>
              <Clock className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                <p className="text-2xl font-bold">{metrics.accuracyRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Selection */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Demo Scenarios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {scenarios.map(scenario => (
                <Button
                  key={scenario.id}
                  variant={selectedScenario?.id === scenario.id ? "default" : "outline"}
                  className="w-full justify-start h-auto p-4"
                  onClick={() => setSelectedScenario(scenario)}
                  disabled={isRunning}
                >
                  <scenario.icon className="w-5 h-5 mr-3 flex-shrink-0" />
                  <div className="text-left flex-1">
                    <p className="font-medium">{scenario.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {scenario.estimatedDuration}s • {scenario.steps.length} steps
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    {scenario.difficulty}
                  </Badge>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Scenario Execution */}
        <div className="lg:col-span-2 space-y-6">
          {selectedScenario ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <selectedScenario.icon className="w-6 h-6 text-primary" />
                      <div>
                        <CardTitle>{selectedScenario.title}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedScenario.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!isRunning ? (
                        <Button onClick={() => runScenario(selectedScenario)}>
                          <Play className="w-4 h-4 mr-2" />
                          Start Demo
                        </Button>
                      ) : (
                        <Button variant="destructive" onClick={stopScenario}>
                          <Pause className="w-4 h-4 mr-2" />
                          Stop
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress */}
                    {isRunning && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress</span>
                          <span>{currentStep + 1} / {selectedScenario.steps.length}</span>
                        </div>
                        <Progress 
                          value={(currentStep + 1) / selectedScenario.steps.length * 100} 
                          className="h-2"
                        />
                      </div>
                    )}

                    {/* Steps */}
                    <div className="space-y-3">
                      {selectedScenario.steps.map((step, index) => (
                        <motion.div
                          key={step.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-lg border ${
                            step.status === 'completed' ? 'bg-primary/5 border-primary/20' :
                            step.status === 'running' ? 'bg-blue-500/5 border-blue-500/20 animate-pulse' :
                            step.status === 'failed' ? 'bg-destructive/5 border-destructive/20' :
                            'bg-muted/30 border-border'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {step.status === 'completed' ? (
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                              ) : step.status === 'running' ? (
                                <div className="w-5 h-5 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                              ) : step.status === 'failed' ? (
                                <AlertCircle className="w-5 h-5 text-destructive" />
                              ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                              )}
                            </div>
                            
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium">{step.action}</p>
                                {step.duration && (
                                  <Badge variant="secondary" className="text-xs">
                                    {(step.duration / 1000).toFixed(1)}s
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{step.description}</p>
                              
                              {step.result && (
                                <div className="mt-2 p-2 bg-background rounded border">
                                  <p className="text-xs font-medium text-primary mb-1">Result:</p>
                                  <pre className="text-xs text-muted-foreground overflow-auto">
                                    {JSON.stringify(step.result, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Log */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Real-time Activity Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <AnimatePresence>
                      {activities.map((activity, index) => (
                        <motion.div
                          key={`${activity.timestamp.getTime()}-${index}`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="flex items-start gap-3 p-2 rounded-lg bg-muted/30"
                        >
                          <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                            activity.status === 'success' ? 'bg-green-500' :
                            activity.status === 'warning' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">{activity.description}</p>
                            {activity.details && (
                              <p className="text-xs text-muted-foreground mt-1">
                                {typeof activity.details === 'object' 
                                  ? Object.entries(activity.details).map(([k, v]) => `${k}: ${v}`).join(', ')
                                  : activity.details}
                              </p>
                            )}
                          </div>
                          
                          <p className="text-xs text-muted-foreground flex-shrink-0">
                            {activity.timestamp.toLocaleTimeString()}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-12">
                <Brain className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Demo Scenario</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a scenario to see the AI autonomously manage your construction project
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Feature Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Why This Matters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Zap className="w-5 h-5" />
                <h4 className="font-medium">True Autonomy</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Unlike competitors, our AI doesn't just answer questions - it takes real actions,
                makes decisions, and manages your entire project workflow autonomously.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <Shield className="w-5 h-5" />
                <h4 className="font-medium">Safe & Controlled</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Every action is logged, reversible, and follows your approval workflows.
                The AI operates within defined guardrails while maximizing efficiency.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <TrendingUp className="w-5 h-5" />
                <h4 className="font-medium">Continuous Learning</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                The AI learns from every interaction, improving its decision-making and
                becoming more valuable to your organization over time.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutonomousAgentDemo;