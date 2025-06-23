
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, FileText, Users, Calendar } from 'lucide-react';
import { ContractType, Contract, ContractTemplate, TemplateVariable } from '@/types/contracts';
import { useToast } from '@/hooks/use-toast';

interface ContractDraftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContractDrafted: (contract: Contract) => void;
}

export const ContractDraftDialog: React.FC<ContractDraftDialogProps> = ({
  open,
  onOpenChange,
  onContractDrafted
}) => {
  const [step, setStep] = useState<'template' | 'details' | 'ai_draft' | 'review'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [aiInstructions, setAiInstructions] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftedContract, setDraftedContract] = useState<string>('');
  const { toast } = useToast();

  // Mock templates - in real implementation, these would come from API
  const templates: ContractTemplate[] = [
    {
      id: '1',
      name: 'General Construction Agreement',
      type: 'construction',
      description: 'Standard construction contract for building projects',
      template_content: '',
      variables: [
        { name: 'contractor_name', label: 'Contractor Name', type: 'text', required: true },
        { name: 'project_name', label: 'Project Name', type: 'text', required: true },
        { name: 'contract_value', label: 'Contract Value', type: 'number', required: true },
        { name: 'start_date', label: 'Start Date', type: 'date', required: true },
        { name: 'completion_date', label: 'Completion Date', type: 'date', required: true },
        { name: 'scope_description', label: 'Scope of Work', type: 'text', required: true }
      ],
      created_at: '2024-01-01T00:00:00Z',
      is_active: true
    },
    {
      id: '2',
      name: 'Service Agreement',
      type: 'service_agreement',
      description: 'Professional services contract template',
      template_content: '',
      variables: [
        { name: 'service_provider', label: 'Service Provider', type: 'text', required: true },
        { name: 'service_description', label: 'Services Description', type: 'text', required: true },
        { name: 'monthly_fee', label: 'Monthly Fee', type: 'number', required: true },
        { name: 'term_months', label: 'Term (Months)', type: 'number', required: true },
        { name: 'start_date', label: 'Start Date', type: 'date', required: true }
      ],
      created_at: '2024-01-01T00:00:00Z',
      is_active: true
    },
    {
      id: '3',
      name: 'Non-Disclosure Agreement',
      type: 'nda',
      description: 'Standard NDA for confidential information protection',
      template_content: '',
      variables: [
        { name: 'disclosing_party', label: 'Disclosing Party', type: 'text', required: true },
        { name: 'receiving_party', label: 'Receiving Party', type: 'text', required: true },
        { name: 'purpose', label: 'Purpose of Disclosure', type: 'text', required: true },
        { name: 'term_years', label: 'Term (Years)', type: 'number', required: true }
      ],
      created_at: '2024-01-01T00:00:00Z',
      is_active: true
    }
  ];

  useEffect(() => {
    if (!open) {
      setStep('template');
      setSelectedTemplate(null);
      setFormData({});
      setAiInstructions('');
      setDraftedContract('');
    }
  }, [open]);

  const handleTemplateSelect = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    setStep('details');
  };

  const handleFormSubmit = async () => {
    if (!selectedTemplate) return;

    // Validate required fields
    const missingFields = selectedTemplate.variables
      .filter(variable => variable.required && !formData[variable.name])
      .map(variable => variable.label);

    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setStep('ai_draft');

    try {
      // Simulate AI drafting - in real implementation, this would call AI service
      await new Promise(resolve => setTimeout(resolve, 3000));

      const draftContent = generateMockContract(selectedTemplate, formData);
      setDraftedContract(draftContent);
      setStep('review');
    } catch (error) {
      toast({
        title: "Drafting Failed",
        description: "Failed to generate contract draft. Please try again.",
        variant: "destructive",
      });
      setStep('details');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockContract = (template: ContractTemplate, data: Record<string, any>): string => {
    // This is a simplified mock - real implementation would use AI
    switch (template.type) {
      case 'construction':
        return `CONSTRUCTION AGREEMENT

This Construction Agreement ("Agreement") is entered into between ${data.contractor_name} ("Contractor") and [Company Name] ("Owner") for the project known as ${data.project_name}.

1. SCOPE OF WORK
The Contractor agrees to provide all labor, materials, equipment, and services necessary for: ${data.scope_description}

2. CONTRACT PRICE
The total contract price is $${data.contract_value?.toLocaleString()}.

3. TIME OF PERFORMANCE
Work shall commence on ${data.start_date} and shall be substantially completed by ${data.completion_date}.

4. PAYMENT TERMS
Payment shall be made according to the approved payment schedule...

[Additional standard clauses would be generated here by AI]`;

      case 'service_agreement':
        return `SERVICE AGREEMENT

This Service Agreement is between ${data.service_provider} ("Provider") and [Company Name] ("Client").

1. SERVICES
Provider shall provide: ${data.service_description}

2. COMPENSATION
Monthly fee: $${data.monthly_fee?.toLocaleString()}
Term: ${data.term_months} months
Start Date: ${data.start_date}

[Additional clauses would be generated here by AI]`;

      default:
        return 'Contract content would be generated here by AI based on the template and provided information.';
    }
  };

  const handleAcceptDraft = () => {
    if (!selectedTemplate) return;

    const newContract: Contract = {
      id: Date.now().toString(),
      title: formData.project_name || formData.service_description || 'New Contract',
      type: selectedTemplate.type,
      status: 'draft',
      counterparty: formData.contractor_name || formData.service_provider || formData.receiving_party || 'TBD',
      value: formData.contract_value || formData.monthly_fee,
      currency: 'USD',
      start_date: formData.start_date,
      end_date: formData.completion_date,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: 'current_user@company.com',
      description: formData.scope_description || formData.service_description,
      ai_risk_score: Math.floor(Math.random() * 40) + 20, // Mock risk score
      risk_level: 'low'
    };

    onContractDrafted(newContract);
    onOpenChange(false);
  };

  const renderTemplateSelection = () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Choose a contract template to get started. Our AI will help you customize it based on your specific needs.
      </div>
      <div className="grid grid-cols-1 gap-3">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleTemplateSelect(template)}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{template.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <FileText className="h-3 w-3" />
                    <span>{template.type.replace('_', ' ')}</span>
                    <span>•</span>
                    <span>{template.variables.length} fields</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">Select</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderDetailsForm = () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Fill in the details for your {selectedTemplate?.name}. The AI will use this information to draft your contract.
      </div>
      <div className="grid grid-cols-1 gap-4">
        {selectedTemplate?.variables.map((variable) => (
          <div key={variable.name} className="space-y-2">
            <Label htmlFor={variable.name}>
              {variable.label} {variable.required && <span className="text-red-500">*</span>}
            </Label>
            {variable.type === 'text' && (
              <Input
                id={variable.name}
                value={formData[variable.name] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [variable.name]: e.target.value }))}
                placeholder={`Enter ${variable.label.toLowerCase()}`}
              />
            )}
            {variable.type === 'number' && (
              <Input
                id={variable.name}
                type="number"
                value={formData[variable.name] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [variable.name]: parseFloat(e.target.value) || '' }))}
                placeholder={`Enter ${variable.label.toLowerCase()}`}
              />
            )}
            {variable.type === 'date' && (
              <Input
                id={variable.name}
                type="date"
                value={formData[variable.name] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [variable.name]: e.target.value }))}
              />
            )}
          </div>
        ))}
        <div className="space-y-2">
          <Label htmlFor="ai-instructions">Additional Instructions for AI (Optional)</Label>
          <Textarea
            id="ai-instructions"
            value={aiInstructions}
            onChange={(e) => setAiInstructions(e.target.value)}
            placeholder="Any specific clauses, terms, or modifications you'd like the AI to include..."
            rows={3}
          />
        </div>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep('template')}>Back</Button>
        <Button onClick={handleFormSubmit} className="flex items-center gap-2">
          <Wand2 className="h-4 w-4" />
          Generate Contract with AI
        </Button>
      </div>
    </div>
  );

  const renderAIDraft = () => (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <h3 className="text-lg font-medium">AI is Drafting Your Contract</h3>
      <p className="text-sm text-muted-foreground text-center">
        Our AI is analyzing your requirements and generating a customized contract based on the {selectedTemplate?.name} template.
        This may take a few moments...
      </p>
    </div>
  );

  const renderReview = () => (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        Review your AI-generated contract draft. You can make edits or accept it as-is.
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contract Draft</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={draftedContract}
            onChange={(e) => setDraftedContract(e.target.value)}
            rows={15}
            className="font-mono text-sm"
          />
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setStep('details')}>Back to Details</Button>
        <Button onClick={handleAcceptDraft} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Accept Draft
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'template' && 'Select Contract Template'}
            {step === 'details' && 'Contract Details'}
            {step === 'ai_draft' && 'Generating Contract'}
            {step === 'review' && 'Review Contract Draft'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {step === 'template' && renderTemplateSelection()}
          {step === 'details' && renderDetailsForm()}
          {step === 'ai_draft' && renderAIDraft()}
          {step === 'review' && renderReview()}
        </div>
      </DialogContent>
    </Dialog>
  );
};
