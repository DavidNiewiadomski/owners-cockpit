import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Sparkles,
  Check,
  FileText,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Wand2,
  Download,
  Upload,
  Save
} from 'lucide-react';

interface AIEnhancementProps {
  onSave: (data: any) => void;
  initialData?: any;
}

export function AIEnhancement({ onSave, initialData }: AIEnhancementProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [enhancementSuggestions, setEnhancementSuggestions] = useState([
    {
      id: '1',
      section: 'Scope of Work',
      original: 'Contractor shall provide all necessary equipment and materials.',
      suggestion: 'Contractor shall provide all necessary equipment, materials, and skilled labor required for the complete execution of the work, including but not limited to tools, machinery, transportation, and safety equipment in accordance with industry standards and applicable regulations.',
      reasoning: 'Enhanced clarity and specificity regarding contractor responsibilities',
      status: 'pending'
    },
    {
      id: '2',
      section: 'Quality Control',
      original: 'Regular quality inspections will be performed.',
      suggestion: 'Quality control inspections shall be conducted at key project milestones and at minimum bi-weekly intervals by qualified QC personnel. Inspection reports must be submitted within 48 hours and include photographic documentation, test results, and corrective actions if required.',
      reasoning: 'Added specific requirements for inspection frequency and documentation',
      status: 'accepted'
    },
    {
      id: '3',
      section: 'Project Schedule',
      original: 'Project to be completed within agreed timeline.',
      suggestion: 'Project shall be completed within 180 calendar days from Notice to Proceed, with critical milestones defined in Attachment A. Contractor must submit a detailed CPM schedule within 10 days of award, showing resource loading, dependencies, and float time for each activity.',
      reasoning: 'Improved schedule clarity with specific requirements',
      status: 'pending'
    }
  ]);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const interval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsAnalyzing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleSuggestionAction = (id: string, action: 'accept' | 'reject') => {
    setEnhancementSuggestions(prev =>
      prev.map(suggestion =>
        suggestion.id === id
          ? { ...suggestion, status: action === 'accept' ? 'accepted' : 'rejected' }
          : suggestion
      )
    );
  };

  const handleSave = () => {
    const enhancedContent = enhancementSuggestions
      .filter(suggestion => suggestion.status === 'accepted')
      .reduce((acc, suggestion) => {
        return {
          ...acc,
          [suggestion.section]: suggestion.suggestion
        };
      }, {});

    onSave(enhancedContent);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">AI Enhancement</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Leverage AI to enhance RFP content quality and completeness
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Content Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  Analyze RFP content for potential improvements
                </p>
              </div>
              <Button onClick={startAnalysis} disabled={isAnalyzing}>
                <Wand2 className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Start Analysis'}
              </Button>
            </div>

            {isAnalyzing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Analysis in progress...</span>
                  <span>{analysisProgress}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {enhancementSuggestions.map(suggestion => (
          <Card key={suggestion.id}>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{suggestion.section}</h4>
                  <Badge
                    variant="outline"
                    className={
                      suggestion.status === 'accepted'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : suggestion.status === 'rejected'
                        ? 'bg-red-100 text-red-700 border-red-200'
                        : 'bg-blue-100 text-blue-700 border-blue-200'
                    }
                  >
                    {suggestion.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div>
                    <Label>Original Text</Label>
                    <div className="mt-1.5 p-3 bg-muted rounded-lg text-sm">
                      {suggestion.original}
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-1 h-px bg-border" />
                    <ArrowRight className="w-4 h-4 mx-4 text-muted-foreground" />
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  <div>
                    <Label>Enhanced Version</Label>
                    <div className="mt-1.5 p-3 bg-green-50 rounded-lg text-sm">
                      {suggestion.suggestion}
                    </div>
                  </div>

                  <div>
                    <Label>Reasoning</Label>
                    <div className="mt-1.5 text-sm text-muted-foreground">
                      {suggestion.reasoning}
                    </div>
                  </div>
                </div>

                {suggestion.status === 'pending' && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionAction(suggestion.id, 'reject')}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleSuggestionAction(suggestion.id, 'accept')}
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Analysis
        </Button>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Enhancements
        </Button>
      </div>
    </div>
  );
}
