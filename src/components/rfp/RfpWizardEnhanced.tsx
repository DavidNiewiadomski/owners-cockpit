import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  AlertCircle, 
  Save, 
  Clock, 
  FileText, 
  Users, 
  Calendar,
  Target,
  Zap,
  Brain,
  Shield,
  Eye,
  Send,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRfpMutations } from '@/hooks/useRfpData';
import type { Rfp, CreateRfpRequest, UpdateRfpRequest } from '@/types/rfp';

// Enhanced step components (we'll create these next)
import { ProjectMetaFormEnhanced } from './steps/ProjectMetaFormEnhanced';
import { ScopeBuilderEnhanced } from './steps/ScopeBuilderEnhanced';
import { TimelineAutoEnhanced } from './steps/TimelineAutoEnhanced';
import { ComplianceSwitchesEnhanced } from './steps/ComplianceSwitchesEnhanced';
import { PreviewPaneEnhanced } from './steps/PreviewPaneEnhanced';
import { PublishPaneEnhanced } from './steps/PublishPaneEnhanced';

export interface RfpWizardData {
  // Project Meta
  title: string;
  facility_id: string;
  project_type: string;
  budget_cap?: number;
  project_size_sqft?: number;
  release_date?: string;
  proposal_due?: string;
  contract_start?: string;
  
  // Enhanced scope data
  scope_items: Array<{
    id: string;
    csi_code: string;
    description: string;
    estimated_cost?: number;
    priority: 'critical' | 'high' | 'medium' | 'low';
    ai_generated?: boolean;
  }>;
  
  // Enhanced timeline
  timeline_events: Array<{
    id: string;
    name: string;
    deadline: string;
    mandatory: boolean;
    description?: string;
    dependencies?: string[];
    ai_generated?: boolean;
  }>;
  
  // Enhanced compliance
  compliance: {
    mwbe?: boolean;
    ll86?: boolean;
    ada?: boolean;
    osha?: boolean;
    leed_required?: boolean;
    prevailing_wage?: boolean;
    bonding_required?: boolean;
    insurance_requirements?: string[];
    [key: string]: any;
  };

  // AI-generated content
  ai_generated_content: {
    scope_of_work?: string;
    evaluation_criteria?: string;
    special_conditions?: string;
    technical_specifications?: string;
  };
}

interface RfpWizardEnhancedProps {
  facilityId?: string;
  existingRfp?: Rfp;
  onComplete?: (rfp: Rfp) => void;
  onCancel?: () => void;
  mode?: 'create' | 'edit' | 'template';
}

const ENHANCED_WIZARD_STEPS = [
  { 
    id: 'meta', 
    title: 'Project Details', 
    description: 'Define core project information',
    icon: FileText,
    estimatedTime: '5-10 min'
  },
  { 
    id: 'scope', 
    title: 'Scope Builder', 
    description: 'AI-powered scope definition with CSI codes',
    icon: Target,
    estimatedTime: '10-15 min'
  },
  { 
    id: 'timeline', 
    title: 'Smart Timeline', 
    description: 'Auto-generated timeline with dependencies',
    icon: Calendar,
    estimatedTime: '5-8 min'
  },
  { 
    id: 'compliance', 
    title: 'Compliance Center', 
    description: 'Comprehensive regulatory requirements',
    icon: Shield,
    estimatedTime: '8-12 min'
  },
  { 
    id: 'ai-enhance', 
    title: 'AI Enhancement', 
    description: 'AI-generated content and optimization',
    icon: Brain,
    estimatedTime: '3-5 min'
  },
  { 
    id: 'preview', 
    title: 'Live Preview', 
    description: 'Real-time document preview and validation',
    icon: Eye,
    estimatedTime: '5-10 min'
  },
  { 
    id: 'publish', 
    title: 'Publish & Share', 
    description: 'Final review, approvals, and distribution',
    icon: Send,
    estimatedTime: '5-8 min'
  },
];

export function RfpWizardEnhanced({ 
  facilityId, 
  existingRfp, 
  onComplete, 
  onCancel,
  mode = 'create'
}: RfpWizardEnhancedProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<RfpWizardData>({
    title: existingRfp?.title || '',
    facility_id: existingRfp?.facility_id || facilityId || '',
    project_type: 'renovation',
    budget_cap: existingRfp?.budget_cap || undefined,
    project_size_sqft: undefined,
    release_date: existingRfp?.release_date || undefined,
    proposal_due: existingRfp?.proposal_due || undefined,
    contract_start: existingRfp?.contract_start || undefined,
    scope_items: [],
    timeline_events: [],
    compliance: existingRfp?.compliance || {},
    ai_generated_content: {}
  });
  
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentRfp, setCurrentRfp] = useState<Rfp | null>(existingRfp || null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const { toast } = useToast();
  const { createRfp, updateRfp, loading: mutationLoading } = useRfpMutations();

  // Auto-save functionality with debouncing
  const autoSave = useCallback(async () => {
    if (!wizardData.title || !wizardData.facility_id) return;
    
    try {
      setIsAutoSaving(true);
      
      if (currentRfp) {
        const updateData: UpdateRfpRequest = {
          title: wizardData.title,
          facility_id: wizardData.facility_id,
          budget_cap: wizardData.budget_cap,
          release_date: wizardData.release_date,
          proposal_due: wizardData.proposal_due,
          contract_start: wizardData.contract_start,
          compliance: wizardData.compliance,
        };
        await updateRfp(currentRfp.id, updateData);
      } else {
        const createData: CreateRfpRequest = {
          title: wizardData.title,
          facility_id: wizardData.facility_id,
          budget_cap: wizardData.budget_cap,
          release_date: wizardData.release_date,
          proposal_due: wizardData.proposal_due,
          contract_start: wizardData.contract_start,
          compliance: wizardData.compliance,
        };
        const newRfp = await createRfp(createData);
        if (newRfp) {
          setCurrentRfp(newRfp);
        }
      }
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [wizardData, currentRfp, createRfp, updateRfp]);

  // Debounced auto-save
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (wizardData.title && wizardData.facility_id) {
        autoSave();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [wizardData, autoSave]);

  const updateWizardData = (stepData: Partial<RfpWizardData>) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
  };

  const markStepCompleted = (stepIndex: number) => {
    setCompletedSteps(prev => {
      if (!prev.includes(stepIndex)) {
        return [...prev, stepIndex].sort((a, b) => a - b);
      }
      return prev;
    });
  };

  const validateStep = (stepIndex: number): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    switch (stepIndex) {
      case 0: // Project Meta
        if (!wizardData.title.trim()) errors.push('Project title is required');
        if (!wizardData.facility_id.trim()) errors.push('Facility ID is required');
        if (!wizardData.project_type) errors.push('Project type is required');
        break;
      case 1: // Scope
        if (wizardData.scope_items.length === 0) {
          errors.push('At least one scope item is required');
        }
        break;
      case 2: // Timeline
        if (wizardData.timeline_events.length === 0) {
          errors.push('Timeline events are required');
        }
        break;
      case 3: // Compliance
        // Compliance step is always valid, but we can add warnings
        break;
      case 4: // AI Enhancement
        // Optional step, always valid
        break;
      case 5: // Preview
        // Preview step validates all previous steps
        const allStepsValid = [0, 1, 2, 3].every(step => validateStep(step).isValid);
        if (!allStepsValid) errors.push('Complete all previous steps before preview');
        break;
      case 6: // Publish
        if (completedSteps.length < 5) {
          errors.push('Complete all previous steps before publishing');
        }
        break;
    }

    return { isValid: errors.length === 0, errors };
  };

  const handleNext = () => {
    const validation = validateStep(currentStep);
    
    if (validation.isValid) {
      markStepCompleted(currentStep);
      if (currentStep < ENHANCED_WIZARD_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      setValidationErrors({ [currentStep]: validation.errors });
      toast({
        title: 'Step Incomplete',
        description: validation.errors[0],
        variant: 'destructive',
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Clear validation errors when going back
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[currentStep];
        return newErrors;
      });
    }
  };

  const jumpToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.includes(stepIndex - 1)) {
      setCurrentStep(stepIndex);
    }
  };

  const getStepIcon = (step: typeof ENHANCED_WIZARD_STEPS[0], stepIndex: number) => {
    const IconComponent = step.icon;
    if (completedSteps.includes(stepIndex)) {
      return <Check className="w-5 h-5 text-green-600" />;
    }
    if (stepIndex === currentStep) {
      return <IconComponent className="w-5 h-5 text-blue-600" />;
    }
    return <IconComponent className="w-5 h-5 text-gray-400" />;
  };

  const renderStepContent = () => {
    const stepId = ENHANCED_WIZARD_STEPS[currentStep].id;
    
    switch (stepId) {
      case 'meta':
        return (
          <ProjectMetaFormEnhanced
            data={wizardData}
            onDataChange={updateWizardData}
            errors={validationErrors[currentStep] || []}
          />
        );
      case 'scope':
        return (
          <ScopeBuilderEnhanced
            data={wizardData}
            onDataChange={updateWizardData}
            errors={validationErrors[currentStep] || []}
          />
        );
      case 'timeline':
        return (
          <TimelineAutoEnhanced
            data={wizardData}
            onDataChange={updateWizardData}
            errors={validationErrors[currentStep] || []}
          />
        );
      case 'compliance':
        return (
          <ComplianceSwitchesEnhanced
            data={wizardData}
            onDataChange={updateWizardData}
            errors={validationErrors[currentStep] || []}
          />
        );
      case 'ai-enhance':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Brain className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Enhancement Coming Soon</h3>
              <p className="text-muted-foreground">
                Advanced AI features for content generation and optimization
              </p>
            </div>
          </div>
        );
      case 'preview':
        return (
          <PreviewPaneEnhanced
            data={wizardData}
            rfp={currentRfp}
            errors={validationErrors[currentStep] || []}
          />
        );
      case 'publish':
        return (
          <PublishPaneEnhanced
            data={wizardData}
            rfp={currentRfp}
            onComplete={onComplete}
            errors={validationErrors[currentStep] || []}
          />
        );
      default:
        return <div>Step content not found</div>;
    }
  };

  const currentStepData = ENHANCED_WIZARD_STEPS[currentStep];
  const progressPercentage = ((currentStep + 1) / ENHANCED_WIZARD_STEPS.length) * 100;
  const completionPercentage = (completedSteps.length / ENHANCED_WIZARD_STEPS.length) * 100;

  return (
    <div className="flex h-full bg-background">
      {/* Sidebar Navigation */}
      <div className="w-80 bg-card border-r border-border p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">RFP Creation Wizard</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Create professional RFP documents with AI assistance
          </p>
          
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(completionPercentage)}%</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>

          {/* Auto-save status */}
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            {isAutoSaving ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Saving...</span>
              </>
            ) : lastSaved ? (
              <>
                <Save className="w-3 h-3" />
                <span>Saved {lastSaved.toLocaleTimeString()}</span>
              </>
            ) : (
              <>
                <Clock className="w-3 h-3" />
                <span>Auto-save enabled</span>
              </>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Step Navigation */}
        <div className="space-y-3">
          {ENHANCED_WIZARD_STEPS.map((step, index) => (
            <motion.div
              key={step.id}
              className={`cursor-pointer p-3 rounded-lg border transition-all duration-200 ${
                index === currentStep
                  ? 'bg-primary/10 border-primary'
                  : completedSteps.includes(index)
                  ? 'bg-green-50 border-green-200 hover:bg-green-100'
                  : 'bg-card border-border hover:bg-accent'
              }`}
              onClick={() => jumpToStep(index)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getStepIcon(step, index)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{step.title}</h4>
                    {index === currentStep && (
                      <Badge variant="secondary" className="text-xs px-2 py-0">
                        Current
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {step.description}
                  </p>
                  <p className="text-xs text-muted-foreground opacity-75">
                    Est. {step.estimatedTime}
                  </p>
                </div>
              </div>
              
              {validationErrors[index] && (
                <Alert className="mt-2 py-2">
                  <AlertCircle className="h-3 w-3" />
                  <AlertDescription className="text-xs">
                    {validationErrors[index][0]}
                  </AlertDescription>
                </Alert>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold mb-1">{currentStepData.title}</h1>
              <p className="text-muted-foreground">{currentStepData.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium">
                  Step {currentStep + 1} of {ENHANCED_WIZARD_STEPS.length}
                </div>
                <div className="text-xs text-muted-foreground">
                  {currentStepData.estimatedTime}
                </div>
              </div>
              <Progress value={progressPercentage} className="w-24 h-2" />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        <div className="border-t border-border p-6">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {currentStep < ENHANCED_WIZARD_STEPS.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2"
                  disabled={mutationLoading}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (onComplete && currentRfp) {
                      onComplete(currentRfp);
                    }
                  }}
                  className="flex items-center gap-2"
                  disabled={!currentRfp || mutationLoading}
                >
                  Complete RFP
                  <Send className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
