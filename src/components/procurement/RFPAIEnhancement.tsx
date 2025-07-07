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
  Zap,
  Brain,
  Wand2,
  ArrowRight,
  Check,
  RefreshCw,
  RotateCw,
  Eye,
  ScrollText,
  FileText,
  MessageSquare,
  Settings2,
} from 'lucide-react';

interface AIEnhancementProps {
  onSave: (aiData: any) => void;
  initialData?: any;
}

export function AIEnhancement({ onSave, initialData }: AIEnhancementProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSections, setSelectedSections] = useState<string[]>([]);

  // Mock sections data
  const sections = [
    {
      id: 'scope',
      title: 'Scope of Work',
      status: 'enhanced',
      suggestions: 3,
      confidence: 92,
      improvements: [
        'Added detailed technical specifications',
        'Enhanced clarity of deliverables',
        'Included industry-standard references'
      ]
    },
    {
      id: 'requirements',
      title: 'Technical Requirements',
      status: 'needs-review',
      suggestions: 5,
      confidence: 85,
      improvements: [
        'Updated performance metrics',
        'Added testing procedures',
        'Included quality standards',
        'Specified acceptance criteria',
        'Added reference documents'
      ]
    },
    {
      id: 'timeline',
      title: 'Project Timeline',
      status: 'pending',
      suggestions: 2,
      confidence: 88,
      improvements: [
        'Optimized milestone sequencing',
        'Added dependency mapping'
      ]
    }
  ];

  const handleEnhance = async () => {
    setIsProcessing(true);
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enhanced': return 'bg-green-100 text-green-700';
      case 'needs-review': return 'bg-orange-100 text-orange-700';
      case 'pending': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">AI Enhancement</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Optimize RFP content with AI-powered suggestions and improvements
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Enhancement Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Content Enhancement</Label>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleEnhance}
              disabled={isProcessing}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isProcessing ? 'Processing...' : 'Enhance Content'}
            </Button>
          </div>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label>Enhancement Focus</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    <Brain className="w-3 h-3 mr-1" />
                    Technical Clarity
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Language
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    <ScrollText className="w-3 h-3 mr-1" />
                    Structure
                  </Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                    <FileText className="w-3 h-3 mr-1" />
                    Completeness
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Custom Instructions</Label>
                <Textarea
                  placeholder="Add specific instructions for AI enhancement..."
                  rows={3}
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg space-y-2">
                <div className="font-medium text-blue-700">AI Enhancement Stats</div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Sections Enhanced</div>
                    <div className="font-medium">{sections.filter(s => s.status === 'enhanced').length} of {sections.length}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Avg. Confidence</div>
                    <div className="font-medium">
                      {Math.round(sections.reduce((sum, s) => sum + s.confidence, 0) / sections.length)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Total Suggestions</div>
                    <div className="font-medium">{sections.reduce((sum, s) => sum + s.suggestions, 0)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Processing Time</div>
                    <div className="font-medium">~2 min</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

              <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    Preview Changes
                  </Button>
                  <Button variant="outline" size="sm">
                    <Settings2 className="w-4 h-4 mr-2" />
                    AI Settings
                  </Button>
                  <Button variant="outline" size="sm">
                    <RotateCw className="w-4 h-4 mr-2" />
                    Reset All
                  </Button>
                  <Button onClick={() => onSave({ sections, applied: true })}>
                    Save Enhancements
                  </Button>
                </div>
        </div>

        {/* Enhancement Results */}
        <div className="space-y-4">
          <Label>Enhancement Results</Label>
          <div className="space-y-4">
            {sections.map((section) => (
              <Card key={section.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{section.title}</div>
                    <Badge className={getStatusColor(section.status)}>
                      {section.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4 text-purple-500" />
                      <span>{section.suggestions} suggestions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-500" />
                      <span>{section.confidence}% confidence</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {section.improvements.map((improvement, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm p-2 bg-accent/50 rounded-md"
                      >
                        <ArrowRight className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>{improvement}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <Button variant="outline" size="sm">
                      <Check className="w-4 h-4 mr-2" />
                      Apply All
                    </Button>
                    <Button variant="ghost" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
