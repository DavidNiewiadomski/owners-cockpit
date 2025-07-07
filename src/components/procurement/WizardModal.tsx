import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  X, 
  Eye,
  Download,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Building,
  Users,
  Award
} from 'lucide-react';
import { prequalificationAPI } from '@/lib/api/prequalification';
import type { PrequalSummary, Prequalification, PrequalReviewRequest } from '@/types/prequalification';

interface WizardModalProps {
  company: PrequalSummary;
  onClose: () => void;
  onApproved: () => void;
}

interface WizardStep {
  id: string;
  title: string;
  completed: boolean;
}

const WizardModal: React.FC<WizardModalProps> = ({ company, onClose, onApproved }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [prequalification, setPrequalification] = useState<Prequalification | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({
    status: 'pending' as 'approved' | 'rejected' | 'pending',
    review_notes: '',
    expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
    scores: [] as Array<{ criteria_id: string; score: number; notes: string }>
  });

  const steps: WizardStep[] = [
    { id: 'overview', title: 'Company Overview', completed: false },
    { id: 'documents', title: 'Document Review', completed: false },
    { id: 'financial', title: 'Financial Assessment', completed: false },
    { id: 'insurance', title: 'Insurance Coverage', completed: false },
    { id: 'scoring', title: 'Risk Scoring', completed: false },
    { id: 'decision', title: 'Final Decision', completed: false }
  ];

  useEffect(() => {
    loadPrequalificationDetails();
  }, [company.id]);

  const loadPrequalificationDetails = async () => {
    try {
      setLoading(true);
      const { data } = await prequalificationAPI.getPrequalification(company.id);
      setPrequalification(data);
    } catch (error) {
      console.error('Failed to load prequalification details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitReview = async () => {
    try {
      const reviewRequest: PrequalReviewRequest = {
        status: reviewData.status,
        review_notes: reviewData.review_notes,
        scores: reviewData.scores
      };

      await prequalificationAPI.reviewPrequalification(company.id, reviewRequest);
      onApproved();
      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const renderStepContent = () => {
    if (loading || !prequalification) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    switch (steps[currentStep].id) {
      case 'overview':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Company Name</Label>
                    <p className="text-sm text-gray-600">{prequalification.company?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Contact Person</Label>
                    <p className="text-sm text-gray-600">{prequalification.contact_name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm text-gray-600">{prequalification.contact_email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-sm text-gray-600">{prequalification.contact_phone}</p>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Requested Trade Codes</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {prequalification.requested_trades?.map((trade, index) => (
                      <Badge key={index} variant="outline">{trade}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Project Size Limit</Label>
                  <p className="text-sm text-gray-600">
                    ${prequalification.project_size_limit?.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Uploaded Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prequalification.documents?.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{doc.original_file_name}</p>
                          <p className="text-sm text-gray-500">
                            Uploaded {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'financial':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Annual Revenue</Label>
                    <p className="text-sm text-gray-600">
                      ${prequalification.company?.annual_revenue?.toLocaleString() || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Bonding Capacity</Label>
                    <p className="text-sm text-gray-600">
                      ${prequalification.company?.bonding_capacity?.toLocaleString() || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Employee Count</Label>
                    <p className="text-sm text-gray-600">
                      {prequalification.company?.employees || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Years in Business</Label>
                    <p className="text-sm text-gray-600">
                      {prequalification.company?.years_in_business || 'Not provided'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'insurance':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Insurance Certificates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prequalification.insurance_certificates?.map((cert) => (
                    <div key={cert.id} className="p-4 border rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Policy Type</Label>
                          <p className="text-sm text-gray-600">{cert.policy_type}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Carrier</Label>
                          <p className="text-sm text-gray-600">{cert.carrier_name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Coverage Limit</Label>
                          <p className="text-sm text-gray-600">
                            ${cert.coverage_limit?.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Expiry Date</Label>
                          <p className="text-sm text-gray-600">
                            {new Date(cert.expiry_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'scoring':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Risk Assessment & Scoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Current Risk Score</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            company.risk_score <= 20 ? 'bg-green-500' :
                            company.risk_score <= 40 ? 'bg-yellow-500' :
                            company.risk_score <= 60 ? 'bg-orange-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${company.risk_score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{company.risk_score}/100</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Financial Stability</Label>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="Score 0-100" 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Insurance Coverage</Label>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="Score 0-100" 
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Experience & References</Label>
                      <Input 
                        type="number" 
                        min="0" 
                        max="100" 
                        placeholder="Score 0-100" 
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'decision':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Final Decision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Decision</Label>
                  <div className="flex gap-4 mt-2">
                    <Button 
                      variant={reviewData.status === 'approved' ? 'default' : 'outline'}
                      onClick={() => setReviewData(prev => ({ ...prev, status: 'approved' }))}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button 
                      variant={reviewData.status === 'rejected' ? 'destructive' : 'outline'}
                      onClick={() => setReviewData(prev => ({ ...prev, status: 'rejected' }))}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                </div>

                {reviewData.status === 'approved' && (
                  <div>
                    <Label className="text-sm font-medium">Expiry Date</Label>
                    <Input 
                      type="date"
                      value={reviewData.expiry_date.toISOString().split('T')[0]}
                      onChange={(e) => setReviewData(prev => ({ 
                        ...prev, 
                        expiry_date: new Date(e.target.value) 
                      }))}
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium">Review Notes</Label>
                  <Textarea 
                    placeholder="Add any notes or conditions..."
                    value={reviewData.review_notes}
                    onChange={(e) => setReviewData(prev => ({ 
                      ...prev, 
                      review_notes: e.target.value 
                    }))}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Review Prequalification - {company.company_name}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-full">
          {/* Step Navigator */}
          <div className="w-64 border-r p-4 space-y-2">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  index === currentStep 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    step.completed ? 'bg-green-500 text-white' :
                    index === currentStep ? 'bg-blue-500 text-white' :
                    'bg-gray-200 text-gray-600'
                  }`}>
                    {step.completed ? <CheckCircle className="w-3 h-3" /> : index + 1}
                  </div>
                  <span className="text-sm font-medium">{step.title}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{steps[currentStep].title}</h3>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={handlePreviousStep}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {currentStep === steps.length - 1 ? (
                  <Button 
                    onClick={handleSubmitReview}
                    disabled={reviewData.status === 'pending'}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Review
                  </Button>
                ) : (
                  <Button onClick={handleNextStep}>
                    Next
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WizardModal;
