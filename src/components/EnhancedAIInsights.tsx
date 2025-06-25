import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Lightbulb,
  Target,
  BarChart3,
  Clock,
  DollarSign,
  Users,
  Shield
} from 'lucide-react';
import { supabaseApi } from '@/lib/supabaseApi';

interface Insight {
  id: string;
  type: 'risk' | 'opportunity' | 'trend' | 'recommendation';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  data_points: string[];
  suggested_actions: string[];
  created_at: string;
}

interface EnhancedAIInsightsProps {
  projectId: string;
}

const getInsightIcon = (type: string, category: string) => {
  switch (type) {
    case 'risk': return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case 'opportunity': return <TrendingUp className="h-5 w-5 text-green-500" />;
    case 'trend': return <BarChart3 className="h-5 w-5 text-blue-500" />;
    case 'recommendation': return <Lightbulb className="h-5 w-5 text-yellow-500" />;
    default: return <Brain className="h-5 w-5 text-gray-500" />;
  }
};

const getCategoryIcon = (category: string) => {
  switch (category.toLowerCase()) {
    case 'schedule': return <Clock className="h-4 w-4" />;
    case 'budget': return <DollarSign className="h-4 w-4" />;
    case 'safety': return <Shield className="h-4 w-4" />;
    case 'quality': return <CheckCircle className="h-4 w-4" />;
    case 'resources': return <Users className="h-4 w-4" />;
    default: return <Target className="h-4 w-4" />;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return 'text-green-600';
  if (confidence >= 0.6) return 'text-yellow-600';
  return 'text-red-600';
};

export const EnhancedAIInsights: React.FC<EnhancedAIInsightsProps> = ({ projectId }) => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  const loadInsights = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Sample insights for demonstration
      const sampleInsights: Insight[] = [
        {
          id: '1',
          type: 'risk',
          title: 'Schedule Risk: Foundation Delay',
          description: 'Weather conditions and permit delays are affecting foundation work, potentially impacting the critical path by 2-3 weeks.',
          confidence: 0.85,
          impact: 'high',
          category: 'schedule',
          data_points: ['3 weather delays this week', 'Permit approval pending 5 days', 'Critical path dependency'],
          suggested_actions: ['Expedite permit processing', 'Arrange covered work areas', 'Update project timeline'],
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          type: 'opportunity',
          title: 'Cost Savings: Bulk Material Purchase',
          description: 'Current material pricing trends and upcoming needs present an opportunity for 15% savings through bulk purchasing.',
          confidence: 0.92,
          impact: 'medium',
          category: 'budget',
          data_points: ['Steel prices down 12% this month', '$250K material order upcoming', 'Supplier offering volume discounts'],
          suggested_actions: ['Negotiate bulk pricing', 'Accelerate material orders', 'Lock in current rates'],
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          type: 'trend',
          title: 'Safety Performance Improving',
          description: 'Safety incident rates have decreased by 40% over the past month following new training initiatives.',
          confidence: 0.78,
          impact: 'low',
          category: 'safety',
          data_points: ['Zero incidents last 10 days', '95% training completion', 'Improved safety scores'],
          suggested_actions: ['Continue current training program', 'Share best practices with other projects', 'Recognize safety champions'],
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          type: 'recommendation',
          title: 'Resource Optimization: Crane Utilization',
          description: 'Analysis shows crane is underutilized during morning hours. Optimizing schedule could improve efficiency by 25%.',
          confidence: 0.88,
          impact: 'medium',
          category: 'resources',
          data_points: ['Crane idle 3hrs daily', 'Morning availability 60%', 'Peak usage 2-6 PM'],
          suggested_actions: ['Reschedule morning activities', 'Coordinate with subcontractors', 'Update equipment schedule'],
          created_at: new Date().toISOString()
        }
      ];
      
      setInsights(sampleInsights);
      setLastGenerated(new Date().toLocaleString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  const generateNewInsights = async () => {
    setGenerating(true);
    setError(null);
    
    try {
      const response = await supabaseApi.generateInsights(projectId, {
        types: ['risk', 'opportunity', 'trend', 'recommendation'],
        include_communications: true,
        include_documents: true
      });
      
      console.log('✅ AI Insights generated:', response);
      await loadInsights(); // Reload the insights
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights');
      console.error('❌ Failed to generate insights:', err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [projectId]);

  const insightsByType = insights.reduce((acc, insight) => {
    if (!acc[insight.type]) acc[insight.type] = [];
    acc[insight.type].push(insight);
    return acc;
  }, {} as Record<string, Insight[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">AI Insights</h2>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            Enhanced with Gemini AI
          </Badge>
        </div>
        
        <div className="flex items-center space-x-3">
          {lastGenerated && (
            <span className="text-sm text-gray-500">
              Last updated: {lastGenerated}
            </span>
          )}
          <Button
            onClick={generateNewInsights}
            disabled={generating}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {generating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Generate New Insights
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Insights Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({insights.length})</TabsTrigger>
          <TabsTrigger value="risk">Risks ({insightsByType.risk?.length || 0})</TabsTrigger>
          <TabsTrigger value="opportunity">Opportunities ({insightsByType.opportunity?.length || 0})</TabsTrigger>
          <TabsTrigger value="trend">Trends ({insightsByType.trend?.length || 0})</TabsTrigger>
          <TabsTrigger value="recommendation">Actions ({insightsByType.recommendation?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <InsightsList insights={insights} loading={loading} />
        </TabsContent>

        {Object.entries(insightsByType).map(([type, typeInsights]) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <InsightsList insights={typeInsights} loading={loading} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

interface InsightsListProps {
  insights: Insight[];
  loading: boolean;
}

const InsightsList: React.FC<InsightsListProps> = ({ insights, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading insights...</span>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>No insights available. Generate new insights to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {insights.map((insight) => (
        <Card key={insight.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                {getInsightIcon(insight.type, insight.category)}
                <div>
                  <CardTitle className="text-lg">{insight.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className={getImpactColor(insight.impact)}>
                      {insight.impact}
                    </Badge>
                    <div className="flex items-center space-x-1">
                      {getCategoryIcon(insight.category)}
                      <span className="text-sm text-gray-500 capitalize">{insight.category}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                  {Math.round(insight.confidence * 100)}%
                </div>
                <div className="text-xs text-gray-500">confidence</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <p className="text-gray-700">{insight.description}</p>
            
            {insight.data_points.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Supporting Data:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {insight.data_points.map((point, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {insight.suggested_actions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Suggested Actions:</h4>
                <div className="space-y-2">
                  {insight.suggested_actions.map((action, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default EnhancedAIInsights;
