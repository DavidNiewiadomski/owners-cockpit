import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  FileCheck,
  Settings,
  Download,
  ExternalLink,
  Book,
  FileText,
  Scale,
} from 'lucide-react';

interface ComplianceRequirement {
  id: string;
  category: string;
  title: string;
  description: string;
  required: boolean;
  status: 'compliant' | 'non-compliant' | 'needs-review';
  guidance?: string;
  references?: string[];
}

interface ComplianceCenterProps {
  onSave: (complianceData: any) => void;
}

export function ComplianceCenter({ onSave }: ComplianceCenterProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock compliance requirements
  const requirements: ComplianceRequirement[] = [
    {
      id: 'REQ-001',
      category: 'Legal',
      title: 'Equal Opportunity Statement',
      description: 'Include mandatory equal opportunity and non-discrimination clauses.',
      required: true,
      status: 'compliant',
      guidance: 'Reference standard EEO clauses from legal templates.',
      references: ['29 CFR Part 1608', 'Executive Order 11246']
    },
    {
      id: 'REQ-002',
      category: 'Financial',
      title: 'Bonding Requirements',
      description: 'Specify performance and payment bond requirements.',
      required: true,
      status: 'needs-review',
      guidance: 'Verify bond amounts match project value and risk profile.',
      references: ['State Contracting Guidelines', 'Risk Management Policy']
    },
    {
      id: 'REQ-003',
      category: 'Insurance',
      title: 'Insurance Coverage',
      description: 'Define required insurance types and coverage amounts.',
      required: true,
      status: 'non-compliant',
      guidance: 'Update coverage limits based on project scope and location.',
      references: ['Insurance Requirements Guide', 'Risk Assessment Matrix']
    },
    {
      id: 'REQ-004',
      category: 'Technical',
      title: 'Quality Control Requirements',
      description: 'Specify quality control procedures and documentation.',
      required: true,
      status: 'compliant',
      guidance: 'Include industry standard QC requirements.',
      references: ['ISO 9001:2015', 'Project QA/QC Manual']
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'bg-green-100 text-green-700';
      case 'non-compliant': return 'bg-rose-100 text-rose-700';
      case 'needs-review': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAnalyzeCompliance = async () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Compliance Center</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Comprehensive regulatory and compliance requirements management
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Compliance Dashboard */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Compliance Status</Label>
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleAnalyzeCompliance}
              disabled={isAnalyzing}
            >
              <Shield className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Analyze Requirements'}
            </Button>
          </div>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {Math.round((requirements.filter(r => r.status === 'compliant').length / requirements.length) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Overall Compliance</div>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-green-100 text-green-700">
                    {requirements.filter(r => r.status === 'compliant').length} Compliant
                  </Badge>
                  <Badge className="bg-rose-100 text-rose-700">
                    {requirements.filter(r => r.status === 'non-compliant').length} Non-Compliant
                  </Badge>
                </div>
              </div>

              <Progress
                value={(requirements.filter(r => r.status === 'compliant').length / requirements.length) * 100}
                className="h-2"
              />

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-orange-600">
                  <AlertTriangle className="w-4 h-4" />
                  {requirements.filter(r => r.status === 'needs-review').length} items need review
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  {requirements.filter(r => r.required).length} mandatory requirements
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <FileCheck className="w-4 h-4 mr-2" />
              Load Template
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configure Rules
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Requirements List */}
        <div className="space-y-4">
          <Label>Requirements Checklist</Label>
          <div className="space-y-4">
            {requirements.map((req) => (
              <Card key={req.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{req.category}</Badge>
                      <span className="font-medium">{req.title}</span>
                      {req.required && (
                        <Badge className="bg-blue-100 text-blue-700">Required</Badge>
                      )}
                    </div>
                    <Badge className={getStatusColor(req.status)}>
                      {req.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {req.description}
                  </p>

                  {req.guidance && (
                    <div className="flex items-start gap-2 p-2 bg-blue-50 rounded-md text-sm">
                      <Book className="w-4 h-4 text-blue-500 mt-0.5" />
                      <span className="text-blue-700">{req.guidance}</span>
                    </div>
                  )}

                  {req.references && req.references.length > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Scale className="w-4 h-4 text-muted-foreground" />
                      <div className="flex gap-1">
                        {req.references.map((ref, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {ref}
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id={`req-${req.id}`} />
                      <Label htmlFor={`req-${req.id}`} className="text-sm">
                        Mark as reviewed
                      </Label>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FileText className="w-4 h-4" />
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
