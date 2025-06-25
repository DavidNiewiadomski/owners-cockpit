
import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, CheckCircle, FileText, MessageSquare, Zap, Eye } from 'lucide-react';
import type { Contract, ContractReview} from '@/types/contracts';
import { useToast } from '@/hooks/use-toast';

interface ContractReviewPanelProps {
  contract: Contract;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ContractReviewPanel: React.FC<ContractReviewPanelProps> = ({
  contract,
  open,
  onOpenChange
}) => {
  const [aiReview, setAiReview] = useState<ContractReview | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [contractText, setContractText] = useState('');
  const { toast } = useToast();

  // Mock contract text - in real implementation, this would be loaded from storage
  const mockContractText = `CONSTRUCTION AGREEMENT

This Construction Agreement ("Agreement") is entered into on January 15, 2024, between ABC Construction Corp, a corporation organized under the laws of the State of California ("Contractor") and TechCorp Inc. ("Owner") for the construction project known as Tower A Development.

ARTICLE 1 - SCOPE OF WORK
1.1 The Contractor agrees to provide all labor, materials, equipment, and services necessary for the construction of a 15-story commercial building located at 123 Main Street, San Francisco, CA.

1.2 The work includes but is not limited to:
- Site preparation and excavation
- Foundation and structural work
- MEP installations
- Interior finishing
- Landscaping and exterior work

ARTICLE 2 - CONTRACT PRICE
2.1 The total contract price is Two Million Five Hundred Thousand Dollars ($2,500,000).
2.2 This price includes all labor, materials, equipment, permits, and overhead costs.

ARTICLE 3 - TIME OF PERFORMANCE
3.1 Work shall commence on February 1, 2024.
3.2 Substantial completion shall be achieved by December 31, 2024.
3.3 Time is of the essence in this Agreement.

ARTICLE 4 - PAYMENT TERMS
4.1 Payment shall be made monthly based on completed work.
4.2 Retainage of 10% shall be withheld until final completion.
4.3 Final payment due within 30 days of substantial completion.

ARTICLE 5 - INDEMNIFICATION
5.1 Contractor shall indemnify Owner against all claims arising from Contractor's work.

ARTICLE 6 - INSURANCE
6.1 Contractor shall maintain general liability insurance of $1,000,000.
6.2 Worker's compensation insurance as required by law.

ARTICLE 7 - WARRANTY
7.1 Contractor warrants all work for a period of one (1) year from substantial completion.

[Additional standard clauses would continue...]`;

  const performAIAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis - in real implementation, this would call AI service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockReview: ContractReview = {
        id: 'review-1',
        contract_id: contract.id,
        review_type: 'ai_analysis',
        reviewer: 'AI Contract Analyzer',
        overall_risk: 'medium',
        findings: [
          {
            type: 'risk',
            severity: 'high',
            section: 'Article 5 - Indemnification',
            description: 'Indemnification clause is one-sided and overly broad, placing excessive risk on the contractor.',
            suggested_fix: 'Consider mutual indemnification or limit scope to contractor\'s negligent acts.',
            line_number: 25
          },
          {
            type: 'missing_clause',
            severity: 'medium',
            section: 'General',
            description: 'No force majeure clause found. This could create issues during unforeseen circumstances.',
            suggested_fix: 'Add standard force majeure clause covering acts of God, government actions, and other uncontrollable events.'
          },
          {
            type: 'compliance',
            severity: 'medium',
            section: 'Article 6 - Insurance',
            description: 'Professional liability insurance not specified. Required for design-build projects.',
            suggested_fix: 'Add professional liability coverage requirement of minimum $500,000.'
          },
          {
            type: 'suggestion',
            severity: 'low',
            section: 'Article 4 - Payment Terms',
            description: 'Payment terms could be more favorable. Industry standard retainage is 5-7%.',
            suggested_fix: 'Consider reducing retainage to 5% to improve cash flow.'
          },
          {
            type: 'risk',
            severity: 'medium',
            section: 'Article 7 - Warranty',
            description: 'Warranty period is shorter than industry standard for commercial construction.',
            suggested_fix: 'Extend warranty period to 2 years for better protection.'
          }
        ],
        recommendations: [
          'Review indemnification clause for fairness and legal compliance',
          'Add force majeure provisions to protect against unforeseen events',
          'Include professional liability insurance requirements',
          'Consider more favorable payment terms',
          'Extend warranty period to match industry standards'
        ],
        created_at: new Date().toISOString()
      };
      
      setAiReview(mockReview);
    } catch (_error) {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [contract.id, toast]);

  useEffect(() => {
    if (open && contract) {
      setContractText(mockContractText);
      // Auto-trigger AI analysis
      performAIAnalysis();
    }
  }, [open, contract, mockContractText, performAIAnalysis]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'low':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityVariant = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'risk':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'missing_clause':
        return <FileText className="h-4 w-4 text-yellow-600" />;
      case 'compliance':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'suggestion':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const renderContractContent = () => (
    <ScrollArea className="h-[600px]">
      <div className="p-4 font-mono text-sm whitespace-pre-wrap">
        {contractText}
      </div>
    </ScrollArea>
  );

  const renderAIAnalysis = () => {
    if (isAnalyzing) {
      return (
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <Zap className="h-8 w-8 animate-pulse text-primary" />
          <h3 className="text-lg font-medium">AI Analyzing Contract</h3>
          <p className="text-sm text-muted-foreground text-center">
            Our AI is reviewing the contract for risks, compliance issues, and improvement opportunities...
          </p>
        </div>
      );
    }

    if (!aiReview) {
      return (
        <div className="text-center py-8">
          <Button onClick={performAIAnalysis} className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Start AI Analysis
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Overall Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Overall Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>Risk Level:</span>
              <Badge variant={aiReview.overall_risk === 'high' ? 'destructive' : aiReview.overall_risk === 'medium' ? 'secondary' : 'default'}>
                {aiReview.overall_risk.toUpperCase()}
              </Badge>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Key Recommendations:</div>
              <ul className="text-sm space-y-1">
                {aiReview.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-muted-foreground">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Findings */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {aiReview.findings.map((finding, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {getTypeIcon(finding.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={getSeverityVariant(finding.severity)} className="flex items-center gap-1">
                          {getSeverityIcon(finding.severity)}
                          {finding.severity}
                        </Badge>
                        <span className="text-sm font-medium">{finding.section}</span>
                      </div>
                      <p className="text-sm mb-2">{finding.description}</p>
                      {finding.suggested_fix && (
                        <div className="text-sm text-muted-foreground">
                          <strong>Suggested Fix:</strong> {finding.suggested_fix}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {contract.title}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="content" className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Contract Content
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              AI Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="flex-1 overflow-hidden">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Contract Document</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {renderContractContent()}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analysis" className="flex-1 overflow-auto">
            {renderAIAnalysis()}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
