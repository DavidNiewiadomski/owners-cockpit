import React, { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FileText,
  Target,
  Clock,
  Shield,
  Zap,
  AlertCircle,
  Calendar as CalendarIcon,
  ChevronLeft,
  Building2,
  DollarSign,
  Settings,
  ArrowLeft,
  ArrowRight,
  Building,
  Users,
  CalendarDays,
} from 'lucide-react';
import { ScopeBuilder } from './RFPScopeBuilder';
import { RFPSmartTimeline } from './RFPSmartTimeline';
import { ComplianceCenter } from './RFPComplianceCenter';
import { AIEnhancement } from './RFPAIEnhancement';
import { BudgetPlanning } from './RFPBudgetPlanning';
import { ReviewSubmit } from './RFPReviewSubmit';
import type { TimelineEvent, RFPSettings, BudgetData } from '@/types/rfp';
import { rfpService } from '@/services/rfpService';

interface RFPFormData {
  basicInfo: {
    title: string;
    facilityId: string;
    projectType: string;
    description?: string;
    estimatedValue?: number;
    squareFootage?: number;
    floors?: number;
    siteConditions?: string;
    phasing: boolean;
    numberOfPhases?: number;
    dueDate?: string;
    location?: string;
    duration?: string;
    requirements: {
      prequalification: boolean;
      bond: boolean;
      insurance: boolean;
    };
  };
  scope: {
    csiCodes: string[];
    description: string;
    specifications: string[];
    exclusions: string[];
  } | null;
  timeline: {
    events: TimelineEvent[];
    settings: RFPSettings;
  } | null;
  compliance: {
    requirements: any[];
    status: string;
  } | null;
  budget: BudgetData | null;
  aiEnhancements: {
    suggestions: string[];
    optimizations: string[];
    applied: boolean;
  } | null;
}

interface RFPCreationWizardProps {
  onClose?: () => void;
  onComplete?: (data: RFPFormData) => void;
}

export function RFPCreationWizard({ onClose, onComplete }: RFPCreationWizardProps = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<RFPFormData>({
    basicInfo: {
      title: '',
      facilityId: '',
      projectType: '',
      description: '',
      estimatedValue: 0,
      squareFootage: 0,
      floors: 0,
      siteConditions: '',
      phasing: false,
      numberOfPhases: 0,
      dueDate: '',
      location: '',
      duration: '',
      requirements: {
        prequalification: false,
        bond: false,
        insurance: false
      }
    },
    scope: null,
    timeline: null,
    compliance: null,
    budget: null,
    aiEnhancements: null
  });

  const handleBasicInfoChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        [field]: value
      }
    }));
  };

  const handleRequirementsChange = (field: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      basicInfo: {
        ...prev.basicInfo,
        requirements: {
          ...prev.basicInfo.requirements,
          [field]: value
        }
      }
    }));
  };

const steps = [
    {
      id: 1,
      title: 'Project Details',
      description: 'Define core project information',
      icon: FileText,
      estimatedTime: '5-10 min'
    },
    {
      id: 2,
      title: 'Scope Builder',
      description: 'AI-powered scope definition with CSI codes',
      icon: Target,
      estimatedTime: '10-15 min'
    },
    {
      id: 3,
      title: 'Smart Timeline',
      description: 'Auto-generated timeline with dependencies',
      icon: Clock,
      estimatedTime: '5-8 min'
    },
    {
      id: 4,
      title: 'Compliance Center',
      description: 'Comprehensive regulatory requirements',
      icon: Shield,
      estimatedTime: '8-12 min'
    },
    {
      id: 5,
      title: 'Budget Planning',
      description: 'Cost estimation and budget allocation',
      icon: DollarSign,
      estimatedTime: '10-15 min'
    },
    {
      id: 6,
      title: 'AI Enhancement',
      description: 'AI-generated content and optimization',
      icon: Zap,
      estimatedTime: '3-5 min'
    },
    {
      id: 7,
      title: 'Review & Submit',
      description: 'Final review and document generation',
      icon: FileText,
      estimatedTime: '5-10 min'
    }
  ];

  const handleStepSave = (step: number, data: any) => {
    switch (step) {
      case 1:
        setFormData(prev => ({ ...prev, basicInfo: { ...prev.basicInfo, ...data } }));
        break;
      case 2:
        setFormData(prev => ({ ...prev, scope: data }));
        break;
      case 3:
        setFormData(prev => ({ ...prev, timeline: data }));
        break;
      case 4:
        setFormData(prev => ({ ...prev, compliance: data }));
        break;
      case 5:
        setFormData(prev => ({ ...prev, budget: data }));
        break;
      case 6:
        setFormData(prev => ({ ...prev, aiEnhancements: data }));
        break;
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return Boolean(
          formData.basicInfo.title &&
          formData.basicInfo.facilityId &&
          formData.basicInfo.projectType
        );
      case 2:
        return Boolean(formData.scope);
      case 3:
        return Boolean(formData.timeline);
      case 4:
        return Boolean(formData.compliance);
      case 5:
        return Boolean(formData.budget);
      case 6:
        return true; // AI enhancements are optional
      case 7:
        return validateStep(1) && validateStep(2) && validateStep(3) && validateStep(4);
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">Project Information</h3>
              <p className="text-sm text-muted-foreground">
                Define the core details of your RFP project. This information will be used throughout the document.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Project Title *</Label>
                  <Input
                    placeholder="e.g., Hospital East Wing Renovation Phase 2"
                    value={formData.basicInfo.title}
                    onChange={(e) => handleBasicInfoChange('title', e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    A clear, descriptive title for your RFP project
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Facility ID *</Label>
                    <Input
                      placeholder="e.g., NYC-HOSP-001"
                      value={formData.basicInfo.facilityId}
                      onChange={(e) => handleBasicInfoChange('facilityId', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Project Type *</Label>
                    <Select
                      value={formData.basicInfo.projectType}
                      onValueChange={(value) => handleBasicInfoChange('projectType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="renovation">Renovation</SelectItem>
                        <SelectItem value="new-construction">New Construction</SelectItem>
                        <SelectItem value="tenant-improvement">Tenant Improvement</SelectItem>
                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Project Scale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Square Footage</Label>
                    <Input
                      type="number"
                      placeholder="Enter total square footage"
                      value={formData.basicInfo.squareFootage}
                      onChange={(e) => handleBasicInfoChange('squareFootage', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Number of Floors</Label>
                    <Input
                      type="number"
                      placeholder="Enter number of floors"
                      value={formData.basicInfo.floors}
                      onChange={(e) => handleBasicInfoChange('floors', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label>Site Conditions</Label>
                  <Textarea
                    placeholder="Describe any relevant site conditions or constraints..."
                    value={formData.basicInfo.siteConditions}
                    onChange={(e) => handleBasicInfoChange('siteConditions', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="phasing"
                      checked={formData.basicInfo.phasing}
                      onCheckedChange={(checked) => handleBasicInfoChange('phasing', checked)}
                    />
                    <Label htmlFor="phasing">Project requires phasing</Label>
                  </div>
                  {formData.basicInfo.phasing && (
                    <Input
                      placeholder="Enter number of phases"
                      type="number"
                      className="mt-2"
                      value={formData.basicInfo.numberOfPhases}
                      onChange={(e) => handleBasicInfoChange('numberOfPhases', e.target.value)}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
            <div>
              <h3 className="text-lg font-medium mb-2">Project Information</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Define the core details of your RFP project. This information will be used throughout the document.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Project Title *</Label>
                <Input 
                  placeholder="e.g., Hospital East Wing Renovation Phase 2"
                  value={formData.basicInfo.title}
                  onChange={(e) => handleBasicInfoChange('title', e.target.value)}
                  className="mt-1.5"
                />
                <p className="text-sm text-muted-foreground mt-1.5">
                  A clear, descriptive title for your RFP project
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Select
                    value={formData.basicInfo.category}
                    onValueChange={(value) => handleBasicInfoChange('category', value)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="structural">Structural</SelectItem>
                      <SelectItem value="mep">MEP</SelectItem>
                      <SelectItem value="concrete">Concrete</SelectItem>
                      <SelectItem value="facade">Facade</SelectItem>
                      <SelectItem value="sitework">Sitework</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>CSI Division *</Label>
                  <Select
                    value={formData.basicInfo.division}
                    onValueChange={(value) => handleBasicInfoChange('division', value)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select division" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="03">Division 03 - Concrete</SelectItem>
                      <SelectItem value="05">Division 05 - Metals</SelectItem>
                      <SelectItem value="23">Division 23 - HVAC</SelectItem>
                      <SelectItem value="26">Division 26 - Electrical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Project Description *</Label>
                <Textarea
                  placeholder="Detailed description of the project scope and requirements..."
                  value={formData.basicInfo.description}
                  onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                  rows={4}
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Estimated Value *</Label>
                  <div className="relative mt-1.5">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      type="number"
                      placeholder="0"
                      value={formData.basicInfo.estimatedValue}
                      onChange={(e) => handleBasicInfoChange('estimatedValue', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label>Due Date *</Label>
                  <div className="relative mt-1.5">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {formData.basicInfo.dueDate ? (
                            format(new Date(formData.basicInfo.dueDate), 'PPP')
                          ) : (
                            <span className="text-muted-foreground">Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.basicInfo.dueDate ? new Date(formData.basicInfo.dueDate) : undefined}
                          onSelect={(date) => handleBasicInfoChange('dueDate', date ? format(date, 'yyyy-MM-dd') : '')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Project Type</Label>
                  <Select
                    value={formData.basicInfo.projectType}
                    onValueChange={(value) => handleBasicInfoChange('projectType', value)}
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New Construction</SelectItem>
                      <SelectItem value="renovation">Renovation</SelectItem>
                      <SelectItem value="tenant">Tenant Improvement</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Project Duration</Label>
                  <div className="relative mt-1.5">
                    <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="e.g., 180 days"
                      value={formData.basicInfo.duration}
                      onChange={(e) => handleBasicInfoChange('duration', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Project Location</Label>
                <div className="relative mt-1.5">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Project location or facility ID"
                    value={formData.basicInfo.location}
                    onChange={(e) => handleBasicInfoChange('location', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Requirements</Label>
                <div className="grid grid-cols-3 gap-4 mt-1.5">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="prequalification"
                      checked={formData.basicInfo.requirements.prequalification}
                      onCheckedChange={(checked) =>
                        handleRequirementsChange('prequalification', checked as boolean)
                      }
                    />
                    <Label htmlFor="prequalification">Prequalification Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="bond"
                      checked={formData.basicInfo.requirements.bond}
                      onCheckedChange={(checked) =>
                        handleRequirementsChange('bond', checked as boolean)
                      }
                    />
                    <Label htmlFor="bond">Performance Bond Required</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="insurance"
                      checked={formData.basicInfo.requirements.insurance}
                      onCheckedChange={(checked) =>
                        handleRequirementsChange('insurance', checked as boolean)
                      }
                    />
                    <Label htmlFor="insurance">Insurance Required</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <ScopeBuilder
            onSave={(data) => handleStepSave(2, data)}
            initialData={formData.scope}
          />
        );

      case 3:
        return (
          <RFPSmartTimeline
            onSave={(data) => handleStepSave(3, data)}
            initialData={formData.timeline}
          />
        );

      case 4:
        return (
          <ComplianceCenter
            onSave={(data) => handleStepSave(4, data)}
            initialData={formData.compliance}
          />
        );

      case 5:
        return (
          <BudgetPlanning
            onSave={(data) => handleStepSave(5, data)}
            initialData={formData.budget}
          />
        );

      case 6:
        return (
          <AIEnhancement
            onSave={(data) => handleStepSave(6, data)}
            initialData={formData.aiEnhancements}
          />
        );

      case 7:
        return (
          <ReviewSubmit
            onSubmit={async (data) => {
              setIsSubmitting(true);
              try {
                const { data: rfp, error } = await rfpService.createRFP(data);
                if (error) {
                  console.error('Error creating RFP:', error);
                  // Handle error (show toast, etc.)
                } else {
                  console.log('RFP created successfully:', rfp);
                  if (onComplete) {
                    onComplete(data);
                  }
                }
              } catch (error) {
                console.error('Failed to create RFP:', error);
              } finally {
                setIsSubmitting(false);
              }
            }}
            formData={formData}
            isSubmitting={isSubmitting}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">RFP Creation Wizard</h2>
          <p className="text-muted-foreground">
            Create professional RFP documents with AI assistance
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <Button variant="outline" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex justify-between text-sm mb-1.5">
            <span>Overall Progress</span>
            <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        </div>
        <span className="text-sm font-medium">Step {currentStep} of {totalSteps}</span>
      </div>

      {/* Step Navigation */}
      <div className="flex gap-4">
        <div className="w-64 space-y-2">
          {steps.map((step) => {
            const StepIcon = step.icon;
            return (
              <div
                key={step.id}
                className={`p-3 rounded-lg border transition-all cursor-pointer
                  ${currentStep === step.id ? 'bg-primary/10 border-primary/20' : 'hover:bg-accent/50'}`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div className="flex items-center gap-3 mb-1">
                  <StepIcon className={`w-5 h-5 ${currentStep === step.id ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className={`font-medium ${currentStep === step.id ? 'text-primary' : ''}`}>
                    {step.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pl-8">
                  {step.description}
                </p>
                <p className="text-xs text-muted-foreground pl-8 mt-1">
                  Est. {step.estimatedTime}
                </p>
              </div>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 border rounded-lg p-6">
          {renderStepContent()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        <Button
          onClick={() => {
            if (currentStep < totalSteps) {
              setCurrentStep(currentStep + 1);
            } else if (currentStep === totalSteps && onComplete) {
              onComplete(formData);
            }
          }}
          disabled={currentStep === totalSteps && !validateStep(currentStep)}
        >
          {currentStep === totalSteps ? 'Complete RFP' : 'Next'}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
