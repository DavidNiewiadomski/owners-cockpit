import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  FileText,
  CheckCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Send,
  Download,
  Eye,
  Edit,
  Share,
  Save,
  Settings,
  Users,
  Calendar,
  Shield,
  Zap,
  Target,
  BarChart3,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface RFPReviewData {
  basicInfo: any;
  scope: any;
  timeline: any;
  compliance: any;
  budget: any;
  aiEnhancements: any;
}

interface ReviewSubmitProps {
  onSubmit: (data: RFPReviewData & { comments: string; approved: boolean }) => void;
  formData: RFPReviewData;
  isSubmitting?: boolean;
}

interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  section: string;
  message: string;
  field?: string;
}

export function ReviewSubmit({ onSubmit, formData, isSubmitting = false }: ReviewSubmitProps) {
  const [comments, setComments] = useState('');
  const [approved, setApproved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isGenerating, setIsGenerating] = useState(false);

  // Validation and completeness check
  const validation = useMemo(() => {
    const issues: ValidationIssue[] = [];
    let completeness = 0;
    const totalSections = 6;

    // Basic Info validation
    if (formData.basicInfo?.title) {
      completeness++;
    } else {
      issues.push({
        severity: 'error',
        section: 'Basic Info',
        message: 'Project title is required',
        field: 'title'
      });
    }

    // Scope validation
    if (formData.scope) {
      completeness++;
    } else {
      issues.push({
        severity: 'warning',
        section: 'Scope',
        message: 'Scope definition is incomplete'
      });
    }

    // Timeline validation
    if (formData.timeline) {
      completeness++;
    } else {
      issues.push({
        severity: 'warning',
        section: 'Timeline',
        message: 'Timeline needs to be defined'
      });
    }

    // Compliance validation
    if (formData.compliance) {
      completeness++;
    } else {
      issues.push({
        severity: 'error',
        section: 'Compliance',
        message: 'Compliance requirements must be reviewed'
      });
    }

    // Budget validation
    if (formData.budget) {
      completeness++;
      if (formData.budget.totalBudget === 0) {
        issues.push({
          severity: 'warning',
          section: 'Budget',
          message: 'Total budget should be greater than zero'
        });
      }
    } else {
      issues.push({
        severity: 'warning',
        section: 'Budget',
        message: 'Budget planning is recommended'
      });
    }

    // AI Enhancements (optional)
    if (formData.aiEnhancements) {
      completeness++;
    }

    const completenessPercentage = (completeness / totalSections) * 100;
    const canSubmit = issues.filter(i => i.severity === 'error').length === 0;

    return {
      issues,
      completeness: completenessPercentage,
      canSubmit,
      errors: issues.filter(i => i.severity === 'error').length,
      warnings: issues.filter(i => i.severity === 'warning').length,
    };
  }, [formData]);

  const handleGenerateDocument = async () => {
    setIsGenerating(true);
    // Simulate document generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
  };

  const handleSubmit = () => {
    if (validation.canSubmit && approved) {
      onSubmit({
        ...formData,
        comments,
        approved,
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error': return AlertCircle;
      case 'warning': return AlertTriangle;
      case 'info': return CheckCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Review & Submit</h3>
        <p className="text-sm text-muted-foreground">
          Final review of your RFP before publication with AI-powered validation
        </p>
      </div>

      {/* Completeness Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            RFP Completeness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {validation.completeness.toFixed(0)}% Complete
              </span>
            </div>
            <Progress value={validation.completeness} className="h-3" />
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="space-y-1">
                <div className="text-2xl font-semibold text-green-600">
                  {6 - validation.errors - validation.warnings}
                </div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-semibold text-orange-600">
                  {validation.warnings}
                </div>
                <div className="text-sm text-muted-foreground">Warnings</div>
              </div>
              <div className="space-y-1">
                <div className="text-2xl font-semibold text-red-600">
                  {validation.errors}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-[500px]">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="publish">Publish</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Project Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Project Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Title:</span>
                    <span className="font-medium">{formData.basicInfo?.title || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="font-medium">{formData.basicInfo?.projectType || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Facility ID:</span>
                    <span className="font-medium">{formData.basicInfo?.facilityId || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Square Footage:</span>
                    <span className="font-medium">
                      {formData.basicInfo?.squareFootage ? 
                        `${formData.basicInfo.squareFootage.toLocaleString()} sq ft` : 
                        'Not set'}
                    </span>
                  </div>
                </div>

                {formData.budget && (
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Budget Information</span>
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Total Budget:</span>
                        <span className="font-medium">
                          ${formData.budget.totalBudget?.toLocaleString() || '0'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Line Items:</span>
                        <span>{formData.budget.lineItems?.length || 0}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Section Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Section Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Project Details', data: formData.basicInfo, icon: FileText },
                    { name: 'Scope Builder', data: formData.scope, icon: Target },
                    { name: 'Smart Timeline', data: formData.timeline, icon: Calendar },
                    { name: 'Compliance Center', data: formData.compliance, icon: Shield },
                    { name: 'Budget Planning', data: formData.budget, icon: DollarSign },
                    { name: 'AI Enhancement', data: formData.aiEnhancements, icon: Zap },
                  ].map((section) => {
                    const isComplete = !!section.data;
                    const SectionIcon = section.icon;
                    
                    return (
                      <div key={section.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <SectionIcon className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{section.name}</span>
                        </div>
                        <Badge 
                          className={isComplete ? 
                            'bg-green-100 text-green-700' : 
                            'bg-gray-100 text-gray-700'}
                        >
                          {isComplete ? 'Complete' : 'Incomplete'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validation" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Validation Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {validation.issues.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  <h3 className="text-lg font-medium mb-2">All Clear!</h3>
                  <p className="text-muted-foreground">
                    Your RFP has passed all validation checks and is ready for publication.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {validation.issues.map((issue, index) => {
                    const SeverityIcon = getSeverityIcon(issue.severity);
                    
                    return (
                      <Alert key={index} className={getSeverityColor(issue.severity)}>
                        <SeverityIcon className="h-4 w-4" />
                        <AlertDescription>
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-medium">{issue.section}:</span> {issue.message}
                              {issue.field && (
                                <span className="text-xs ml-2 opacity-75">({issue.field})</span>
                              )}
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </div>
                        </AlertDescription>
                      </Alert>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Document Preview
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleGenerateDocument} disabled={isGenerating}>
                    <FileText className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate PDF'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download Draft
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-6 bg-gray-50 min-h-[400px]">
                <div className="space-y-4">
                  <div className="text-center border-b pb-4">
                    <h1 className="text-2xl font-bold">{formData.basicInfo?.title || 'RFP Title'}</h1>
                    <p className="text-muted-foreground">Request for Proposal</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <h3 className="font-medium mb-2">Project Information</h3>
                      <div className="space-y-1">
                        <div>Project Type: {formData.basicInfo?.projectType || 'TBD'}</div>
                        <div>Facility ID: {formData.basicInfo?.facilityId || 'TBD'}</div>
                        <div>Square Footage: {formData.basicInfo?.squareFootage || 'TBD'}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2">Budget Summary</h3>
                      <div className="space-y-1">
                        <div>Total Budget: ${formData.budget?.totalBudget?.toLocaleString() || 'TBD'}</div>
                        <div>Line Items: {formData.budget?.lineItems?.length || 0}</div>
                        <div>Contingency: {formData.budget?.contingencyPercentage || 10}%</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center text-muted-foreground mt-8">
                    <p>This is a preview of your RFP document.</p>
                    <p>Generate the full PDF to see complete formatting and content.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="publish" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Publish RFP
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Final Review Comments</Label>
                  <Textarea
                    placeholder="Add any final comments or notes for the RFP..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="approval"
                    checked={approved}
                    onCheckedChange={setApproved}
                  />
                  <Label htmlFor="approval" className="cursor-pointer">
                    I have reviewed all sections and approve this RFP for publication
                  </Label>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium mb-2">What happens next?</h4>
                <div className="space-y-2 text-sm text-blue-700">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>RFP document will be generated and stored</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>Timeline events will be created automatically</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>Vendor invitations can be sent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>Project tracking begins</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="outline">
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft
                  </Button>
                  <Button variant="outline">
                    <Share className="w-4 h-4 mr-2" />
                    Share for Review
                  </Button>
                </div>
                
                <Button
                  onClick={handleSubmit}
                  disabled={!validation.canSubmit || !approved || isSubmitting}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Publishing...' : 'Publish RFP'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
