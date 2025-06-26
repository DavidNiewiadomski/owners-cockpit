import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  Users,
  Activity,
  Zap
} from 'lucide-react';

interface AnalyticsData {
  budgetUtilization: number;
  schedulePerformance: number;
  teamEfficiency: number;
  riskScore: number;
  safetyScore: number;
  qualityScore: number;
}

const ProjectAnalytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    budgetUtilization: 0,
    schedulePerformance: 0,
    teamEfficiency: 0,
    riskScore: 0,
    safetyScore: 0,
    qualityScore: 0
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Simulate real-time data updates
  useEffect(() => {
    const updateAnalytics = () => {
      setIsUpdating(true);
      
      // Simulate API call with realistic construction metrics
      setTimeout(() => {
        setAnalytics({
          budgetUtilization: 75 + Math.random() * 10,
          schedulePerformance: 85 + Math.random() * 10,
          teamEfficiency: 88 + Math.random() * 8,
          riskScore: 25 + Math.random() * 15,
          safetyScore: 95 + Math.random() * 4,
          qualityScore: 92 + Math.random() * 6
        });
        setIsUpdating(false);
      }, 1000);
    };

    // Initial load
    updateAnalytics();

    // Update every 30 seconds
    const interval = setInterval(updateAnalytics, 30000);

    return () => clearInterval(interval);
  }, []);

  const getScoreColor = (score: number, inverse = false) => {
    if (inverse) {
      // For risk score - lower is better
      if (score < 20) return 'text-green-600';
      if (score < 35) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      // For other scores - higher is better
      if (score >= 85) return 'text-green-600';
      if (score >= 70) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getScoreIcon = (score: number, inverse = false) => {
    if (inverse) {
      if (score < 20) return CheckCircle;
      if (score < 35) return Clock;
      return AlertTriangle;
    } else {
      if (score >= 85) return TrendingUp;
      if (score >= 70) return Activity;
      return TrendingDown;
    }
  };

  const getBadgeVariant = (score: number, inverse = false) => {
    if (inverse) {
      if (score < 20) return 'default';
      if (score < 35) return 'secondary';
      return 'destructive';
    } else {
      if (score >= 85) return 'default';
      if (score >= 70) return 'secondary';
      return 'destructive';
    }
  };

  const metrics = [
    {
      title: 'Budget Utilization',
      value: analytics.budgetUtilization,
      icon: DollarSign,
      suffix: '%',
      description: 'Current spend vs allocation',
      inverse: false
    },
    {
      title: 'Schedule Performance',
      value: analytics.schedulePerformance,
      icon: Clock,
      suffix: '%',
      description: 'On-time milestone completion',
      inverse: false
    },
    {
      title: 'Team Efficiency',
      value: analytics.teamEfficiency,
      icon: Users,
      suffix: '%',
      description: 'Productivity vs baseline',
      inverse: false
    },
    {
      title: 'Risk Level',
      value: analytics.riskScore,
      icon: AlertTriangle,
      suffix: '%',
      description: 'Overall project risk',
      inverse: true
    },
    {
      title: 'Safety Score',
      value: analytics.safetyScore,
      icon: CheckCircle,
      suffix: '%',
      description: 'Safety compliance rating',
      inverse: false
    },
    {
      title: 'Quality Score',
      value: analytics.qualityScore,
      icon: Zap,
      suffix: '%',
      description: 'Quality assurance rating',
      inverse: false
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Real-time Project Analytics
            </CardTitle>
            <CardDescription>
              Live performance metrics across all active projects
            </CardDescription>
          </div>
          <Badge 
            variant={isUpdating ? "secondary" : "default"} 
            className="flex items-center gap-1"
          >
            <div className={`w-2 h-2 rounded-full ${isUpdating ? 'bg-yellow-500' : 'bg-green-500'} ${!isUpdating ? 'animate-pulse' : ''}`} />
            {isUpdating ? 'Updating...' : 'Live'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const ScoreIcon = getScoreIcon(metric.value, metric.inverse);
            
            return (
              <div key={index} className="p-4 border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{metric.title}</span>
                  </div>
                  <ScoreIcon className={`w-4 h-4 ${getScoreColor(metric.value, metric.inverse)}`} />
                </div>
                
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      {metric.value.toFixed(1)}{metric.suffix}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                  
                  <Badge 
                    variant={getBadgeVariant(metric.value, metric.inverse)}
                    className="text-xs"
                  >
                    {metric.inverse 
                      ? metric.value < 20 ? 'Low' : metric.value < 35 ? 'Medium' : 'High'
                      : metric.value >= 85 ? 'Excellent' : metric.value >= 70 ? 'Good' : 'Needs Attention'
                    }
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100">
                AI Insights Available
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                Atlas has identified 3 optimization opportunities based on current metrics. 
                Click the AI assistant to get detailed recommendations.
              </p>
              <Button variant="outline" size="sm" className="mt-2 text-blue-700 border-blue-300 hover:bg-blue-100">
                View AI Recommendations
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectAnalytics;
