import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Lightbulb,
  Sparkles,
  ChevronRight,
  Mic,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FrontendAIService } from '@/lib/ai/frontend-ai-service';

interface AIEnhancedWidgetProps {
  title: string;
  description?: string;
  value: string | number;
  trend?: number;
  aiInsights?: boolean;
  children?: React.ReactNode;
  onAIAction?: (action: string) => void;
}

export const AIEnhancedWidget: React.FC<AIEnhancedWidgetProps> = ({
  title,
  description,
  value,
  trend,
  aiInsights = true,
  children,
  onAIAction
}) => {
  const [showAI, setShowAI] = useState(false);
  const [aiSuggestion, setAISuggestion] = useState<string>('');
  const [isThinking, setIsThinking] = useState(false);
  const [aiService] = useState(() => new FrontendAIService());

  useEffect(() => {
    if (aiInsights) {
      // Get AI insights when component mounts
      getAIInsights();
    }
  }, [value, trend]);

  const getAIInsights = async () => {
    setIsThinking(true);
    try {
      const response = await aiService.processMessage({
        message: `Based on this metric: ${title} = ${value}${trend ? ` (${trend > 0 ? '+' : ''}${trend}%)` : ''}, provide a brief actionable insight in 1-2 sentences.`,
        projectId: 'current',
        taskType: 'insight'
      });

      if (response.success) {
        setAISuggestion(response.message);
      }
    } catch (error) {
      console.error('Failed to get AI insights:', error);
    } finally {
      setIsThinking(false);
    }
  };

  const handleAIInteraction = () => {
    setShowAI(!showAI);
    if (!showAI && !aiSuggestion) {
      getAIInsights();
    }
  };

  const executeAIAction = (action: string) => {
    if (onAIAction) {
      onAIAction(action);
    }
  };

  return (
    <Card className="relative overflow-hidden group">
      {/* AI Glow Effect */}
      {aiInsights && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      )}

      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {description && (
              <CardDescription>{description}</CardDescription>
            )}
          </div>
          {aiInsights && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAIInteraction}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Brain className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Main Value Display */}
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold">{value}</div>
            {trend !== undefined && (
              <div className={`flex items-center gap-1 text-sm ${
                trend > 0 ? 'text-green-500' : trend < 0 ? 'text-red-500' : 'text-gray-500'
              }`}>
                {trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {Math.abs(trend)}%
              </div>
            )}
          </div>

          {/* Children Content */}
          {children}

          {/* AI Insights Section */}
          <AnimatePresence>
            {showAI && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t pt-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-primary mt-0.5" />
                    <div className="flex-1">
                      {isThinking ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                          <span className="text-sm text-muted-foreground">AI is analyzing...</span>
                        </div>
                      ) : (
                        <p className="text-sm">{aiSuggestion || 'No insights available'}</p>
                      )}
                    </div>
                  </div>

                  {aiSuggestion && !isThinking && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => executeAIAction('investigate')}
                        className="text-xs"
                      >
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Investigate
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => executeAIAction('optimize')}
                        className="text-xs"
                      >
                        <Lightbulb className="w-3 h-3 mr-1" />
                        Optimize
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => executeAIAction('report')}
                        className="text-xs"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Report
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};

// Budget Widget with AI
export const AIBudgetWidget: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [prediction, setPrediction] = useState<any>(null);

  useEffect(() => {
    // Simulate AI prediction
    setPrediction({
      overrunRisk: 23,
      suggestedAction: 'Review subcontractor costs',
      potentialSavings: 45000
    });
  }, [projectId]);

  return (
    <AIEnhancedWidget
      title="Budget Status"
      value="$4.2M"
      trend={-2.3}
      description="73% of total budget"
    >
      <div className="space-y-3">
        <Progress value={73} className="h-2" />
        
        {prediction && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">AI Alert</p>
                <p className="text-xs text-muted-foreground">
                  {prediction.overrunRisk}% overrun risk. {prediction.suggestedAction}.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AIEnhancedWidget>
  );
};

// Schedule Widget with AI
export const AIScheduleWidget: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [optimization, setOptimization] = useState<any>(null);

  useEffect(() => {
    // Simulate AI optimization
    setOptimization({
      daysToSave: 5,
      suggestion: 'Parallelize foundation and utility work',
      confidence: 87
    });
  }, [projectId]);

  return (
    <AIEnhancedWidget
      title="Schedule Performance"
      value="On Track"
      description="238 days remaining"
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span>Completion</span>
          <span className="font-medium">65%</span>
        </div>
        <Progress value={65} className="h-2" />
        
        {optimization && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">AI Optimization</p>
                <p className="text-xs text-muted-foreground">
                  Save {optimization.daysToSave} days: {optimization.suggestion}
                </p>
                <Badge variant="outline" className="mt-1 text-xs">
                  {optimization.confidence}% confidence
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </AIEnhancedWidget>
  );
};

// Safety Widget with AI
export const AISafetyWidget: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [riskPrediction, setRiskPrediction] = useState<any>(null);

  useEffect(() => {
    // Simulate AI risk prediction
    setRiskPrediction({
      upcomingRisk: 'Crane operation near power lines',
      riskLevel: 'medium',
      preventionAction: 'Schedule safety briefing and establish exclusion zone'
    });
  }, [projectId]);

  return (
    <AIEnhancedWidget
      title="Safety Score"
      value="98.5%"
      trend={0.5}
      description="0 incidents in 45 days"
    >
      {riskPrediction && (
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">AI Risk Detection</p>
              <p className="text-xs text-muted-foreground mb-1">
                {riskPrediction.upcomingRisk}
              </p>
              <p className="text-xs font-medium">
                Action: {riskPrediction.preventionAction}
              </p>
            </div>
          </div>
        </div>
      )}
    </AIEnhancedWidget>
  );
};