import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRfpMutations } from '@/hooks/useRfpData';
import type { Rfp, CreateRfpRequest, UpdateRfpRequest } from '@/types/rfp';

// Import step components
import { ProjectMetaForm } from './steps/ProjectMetaForm';
import { ScopeBuilder } from './steps/ScopeBuilder';
import { TimelineAuto } from './steps/TimelineAuto';
import { ComplianceSwitches } from './steps/ComplianceSwitches';
import { PreviewPane } from './steps/PreviewPane';
import { PublishPane } from './steps/PublishPane';

export interface RfpWizardData {
  // Project Meta
  title: string;
  facility_id: string;
  budget_cap?: number;
  release_date?: string;
  proposal_due?: string;
  contract_start?: string;
  
  // Scope
  scope_items: Array<{
    csi_code: string;
    description: string;
  }>;
  
  // Timeline
  timeline_events: Array<{
    name: string;
    deadline: string;
    mandatory: boolean;
  }>;
  
  // Compliance
  compliance: {
    mwbe?: boolean;
    ll86?: boolean;
    ada?: boolean;
    osha?: boolean;
    [key: string]: any;
  };
}

interface RfpWizardProps {
  facilityId?: string;
  existingRfp?: Rfp;
  onComplete?: (rfp: Rfp) => void;
  onCancel?: () => void;
}

const WIZARD_STEPS = [
  { id: 'meta', title: 'Project Details', description: 'Basic RFP information' },
  { id: 'scope', title: 'Scope Builder', description: 'Define project scope with CSI codes' },
  { id: 'timeline', title: 'Timeline', description: 'Auto-generate timeline events' },
  { id: 'compliance', title: 'Compliance', description: 'Set compliance requirements' },
  { id: 'preview', title: 'Preview', description: 'Review RFP document' },
  { id: 'publish', title: 'Publish', description: 'Final review and publish' },
];

export function RfpWizard({ facilityId, existingRfp, onComplete, onCancel }: RfpWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [wizardData, setWizardData] = useState<RfpWizardData>({
    title: existingRfp?.title || '',
    facility_id: existingRfp?.facility_id || facilityId || '',
    budget_cap: existingRfp?.budget_cap || undefined,
    release_date: existingRfp?.release_date || undefined,
    proposal_due: existingRfp?.proposal_due || undefined,
    contract_start: existingRfp?.contract_start || undefined,
    scope_items: [],
    timeline_events: [],
    compliance: existingRfp?.compliance || {},
  });
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [currentRfp, setCurrentRfp] = useState<Rfp | null>(existingRfp || null);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { createRfp, updateRfp, loading: mutationLoading } = useRfpMutations();

  // Auto-save draft functionality
  const saveDraftMutation = useMutation({
    mutationFn: async (data: Partial<RfpWizardData>) => {
      if (currentRfp) {
        // Update existing RFP
        const updateData: UpdateRfpRequest = {
          title: data.title,
          facility_id: data.facility_id,
          budget_cap: data.budget_cap,
          release_date: data.release_date,
          proposal_due: data.proposal_due,
          contract_start: data.contract_start,
          compliance: data.compliance,
        };
        return await updateRfp(currentRfp.id, updateData);
      } else {
        // Create new RFP
        const createData: CreateRfpRequest = {
          title: data.title || 'Untitled RFP',
          facility_id: data.facility_id || facilityId || '',
          budget_cap: data.budget_cap,
          release_date: data.release_date,
          proposal_due: data.proposal_due,
          contract_start: data.contract_start,
          compliance: data.compliance || {},
        };
        return await createRfp(createData);
      }
    },
    onSuccess: (rfp) => {
      if (rfp && !currentRfp) {
        setCurrentRfp(rfp);
      }
      queryClient.invalidateQueries({ queryKey: ['rfps'] });
    },
    onError: (error) => {
      console.error('Failed to save draft:', error);
      toast({
        title: 'Save Failed',
        description: 'Failed to save RFP draft. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Save draft when wizard data changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (wizardData.title || wizardData.facility_id) {
        saveDraftMutation.mutate(wizardData);
      }
    }, 1000); // Debounce saves

    return () => clearTimeout(timeoutId);
  }, [wizardData]);

  const updateWizardData = (stepData: Partial<RfpWizardData>) => {
    setWizardData(prev => ({ ...prev, ...stepData }));
  };

  const markStepCompleted = (stepIndex: number) => {
    setCompletedSteps(prev => {
      if (!prev.includes(stepIndex)) {
        return [...prev, stepIndex];
      }
      return prev;
    });
  };

  const isStepValid = (stepIndex: number): boolean => {
    switch (stepIndex) {
      case 0: // Project Meta
        return !!(wizardData.title && wizardData.facility_id);
      case 1: // Scope
        return wizardData.scope_items.length > 0;
      case 2: // Timeline
        return wizardData.timeline_events.length > 0;
      case 3: // Compliance
        return true; // Always valid
      case 4: // Preview
        return true; // Always valid
      case 5: // Publish
        return completedSteps.length >= 4; // All previous steps completed
      default:
        return false;
    }
  };

  const canNavigateToStep = (stepIndex: number): boolean => {
    if (stepIndex === 0) return true;
    return completedSteps.includes(stepIndex - 1) || isStepValid(stepIndex - 1);
  };

  const handleNext = () => {
    if (isStepValid(currentStep)) {
      markStepCompleted(currentStep);
      if (currentStep < WIZARD_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast({
        title: 'Step Incomplete',
        description: 'Please complete all required fields before proceeding.',
        variant: 'destructive',
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepIndex: number) => {
    if (canNavigateToStep(stepIndex)) {
      setCurrentStep(stepIndex);
    }
  };

  const handleComplete = () => {
    if (currentRfp && onComplete) {
      onComplete(currentRfp);
    }
  };

  const renderCurrentStep = () => {
    const stepProps = {
      data: wizardData,
      onDataChange: updateWizardData,
      rfpId: currentRfp?.id,
    };

    switch (currentStep) {
      case 0:
        return <ProjectMetaForm {...stepProps} />;
      case 1:
        return <ScopeBuilder {...stepProps} />;
      case 2:
        return <TimelineAuto {...stepProps} />;
      case 3:
        return <ComplianceSwitches {...stepProps} />;
      case 4:
        return <PreviewPane {...stepProps} />;
      case 5:
        return <PublishPane {...stepProps} onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {existingRfp ? 'Edit RFP' : 'Create New RFP'}
            </h1>
            <p className="text-gray-400">
              {wizardData.title || 'Untitled RFP'}
            </p>
          </div>
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Step {currentStep + 1} of {WIZARD_STEPS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {WIZARD_STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => handleStepClick(index)}
              disabled={!canNavigateToStep(index)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors whitespace-nowrap ${
                index === currentStep
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : completedSteps.includes(index)
                  ? 'bg-green-600 border-green-600 text-white'
                  : canNavigateToStep(index)
                  ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                  : 'border-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center space-x-2">
                {completedSteps.includes(index) ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-xs">
                    {index + 1}
                  </span>
                )}
                <div className="text-left">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-xs opacity-75">{step.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">
            {WIZARD_STEPS[currentStep].title}
          </CardTitle>
          <p className="text-gray-400">
            {WIZARD_STEPS[currentStep].description}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderCurrentStep()}
        </CardContent>
      </Card>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-2">
          {saveDraftMutation.isPending && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Saving...</span>
            </Badge>
          )}
          
          {!isStepValid(currentStep) && (
            <Badge variant="destructive" className="flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" />
              <span>Incomplete</span>
            </Badge>
          )}
        </div>

        <Button
          onClick={handleNext}
          disabled={currentStep === WIZARD_STEPS.length - 1 || !isStepValid(currentStep)}
          className="flex items-center space-x-2"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
