import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle,
  Info,
  Plus,
  X,
  FileCheck,
  Users,
  Building,
  Globe,
  Calculator
} from 'lucide-react';
import type { RfpWizardData } from '../RfpWizardEnhanced';

interface ComplianceSwitchesEnhancedProps {
  data: RfpWizardData;
  onDataChange: (data: Partial<RfpWizardData>) => void;
  errors?: string[];
}

// Comprehensive compliance categories
const COMPLIANCE_CATEGORIES = {
  diversity: {
    title: 'Diversity & Inclusion',
    icon: Users,
    color: 'bg-purple-100 text-purple-800',
    requirements: [
      {
        key: 'mwbe',
        name: 'MWBE (Minority/Women Business Enterprise)',
        description: 'Requirements for minority and women-owned business participation',
        required: false,
        documentation: ['MWBE certification', 'Participation plan', 'Good faith efforts documentation']
      },
      {
        key: 'section_3',
        name: 'Section 3 Requirements',
        description: 'Employment opportunities for low-income residents',
        required: false,
        documentation: ['Section 3 plan', 'Resident hiring commitments']
      },
      {
        key: 'dbe',
        name: 'DBE (Disadvantaged Business Enterprise)',
        description: 'Federal DBE requirements for transportation projects',
        required: false,
        documentation: ['DBE certification', 'Subcontracting plan']
      }
    ]
  },
  safety: {
    title: 'Safety & Health',
    icon: Shield,
    color: 'bg-red-100 text-red-800',
    requirements: [
      {
        key: 'osha',
        name: 'OSHA Compliance',
        description: 'Occupational Safety and Health Administration requirements',
        required: true,
        documentation: ['Safety plan', 'OSHA 30-hour certification', 'Accident reporting procedures']
      },
      {
        key: 'safety_training',
        name: 'Site Safety Training',
        description: 'Mandatory safety training for all workers',
        required: true,
        documentation: ['Training certificates', 'Site-specific safety orientation']
      }
    ]
  },
  accessibility: {
    title: 'Accessibility',
    icon: Building,
    color: 'bg-blue-100 text-blue-800',
    requirements: [
      {
        key: 'ada',
        name: 'ADA Compliance',
        description: 'Americans with Disabilities Act requirements',
        required: true,
        documentation: ['ADA compliance plan', 'Accessibility audits', 'Reasonable accommodation procedures']
      },
      {
        key: 'section_504',
        name: 'Section 504 Compliance',
        description: 'Federal accessibility requirements',
        required: false,
        documentation: ['Section 504 compliance documentation']
      }
    ]
  },
  environmental: {
    title: 'Environmental',
    icon: Globe,
    color: 'bg-green-100 text-green-800',
    requirements: [
      {
        key: 'leed_required',
        name: 'LEED Certification',
        description: 'Leadership in Energy and Environmental Design requirements',
        required: false,
        documentation: ['LEED scorecard', 'Sustainability plan', 'Energy modeling']
      },
      {
        key: 'environmental_impact',
        name: 'Environmental Impact Assessment',
        description: 'Environmental review and mitigation measures',
        required: false,
        documentation: ['Environmental assessment', 'Mitigation plan', 'Permit applications']
      },
      {
        key: 'waste_management',
        name: 'Construction Waste Management',
        description: 'Waste reduction and recycling requirements',
        required: false,
        documentation: ['Waste management plan', 'Recycling procedures']
      }
    ]
  },
  financial: {
    title: 'Financial & Insurance',
    icon: Calculator,
    color: 'bg-yellow-100 text-yellow-800',
    requirements: [
      {
        key: 'prevailing_wage',
        name: 'Prevailing Wage Requirements',
        description: 'Local prevailing wage compliance',
        required: false,
        documentation: ['Wage determination', 'Certified payroll records', 'Fringe benefit documentation']
      },
      {
        key: 'bonding_required',
        name: 'Performance & Payment Bonds',
        description: 'Required bonding for contract performance',
        required: false,
        documentation: ['Performance bond', 'Payment bond', 'Surety information']
      },
      {
        key: 'insurance_general',
        name: 'General Liability Insurance',
        description: 'Minimum insurance coverage requirements',
        required: true,
        documentation: ['Insurance certificates', 'Additional insured endorsements']
      }
    ]
  },
  regulatory: {
    title: 'Local Regulations',
    icon: FileCheck,
    color: 'bg-indigo-100 text-indigo-800',
    requirements: [
      {
        key: 'll86',
        name: 'Local Law 86 (NYC)',
        description: 'NYC construction worker safety training requirements',
        required: false,
        documentation: ['LL86 certificates', 'Site safety manager certification']
      },
      {
        key: 'local_permits',
        name: 'Local Permit Requirements',
        description: 'Municipal permits and approvals',
        required: true,
        documentation: ['Building permits', 'Trade permits', 'Inspection certificates']
      }
    ]
  }
};

const INSURANCE_TYPES = [
  'General Liability',
  'Professional Liability',
  'Workers Compensation',
  'Commercial Auto',
  'Umbrella/Excess',
  'Cyber Liability',
  'Environmental Liability'
];

export function ComplianceSwitchesEnhanced({ data, onDataChange, errors = [] }: ComplianceSwitchesEnhancedProps) {
  const [customRequirement, setCustomRequirement] = useState({
    name: '',
    description: '',
    required: false
  });
  const [insuranceRequirements, setInsuranceRequirements] = useState<string[]>(
    data.compliance?.insurance_requirements || []
  );

  // Update insurance requirements when data changes
  useEffect(() => {
    setInsuranceRequirements(data.compliance?.insurance_requirements || []);
  }, [data.compliance?.insurance_requirements]);

  const updateCompliance = (key: string, value: any) => {
    const updatedCompliance = {
      ...data.compliance,
      [key]: value
    };
    onDataChange({ compliance: updatedCompliance });
  };

  const addCustomRequirement = () => {
    if (!customRequirement.name) return;

    const customKey = `custom_${Date.now()}`;
    updateCompliance(customKey, {
      name: customRequirement.name,
      description: customRequirement.description,
      required: customRequirement.required,
      custom: true
    });

    setCustomRequirement({ name: '', description: '', required: false });
  };

  const removeCustomRequirement = (key: string) => {
    const updatedCompliance = { ...data.compliance };
    delete updatedCompliance[key];
    onDataChange({ compliance: updatedCompliance });
  };

  const addInsuranceRequirement = (type: string) => {
    if (!insuranceRequirements.includes(type)) {
      const updated = [...insuranceRequirements, type];
      setInsuranceRequirements(updated);
      updateCompliance('insurance_requirements', updated);
    }
  };

  const removeInsuranceRequirement = (type: string) => {
    const updated = insuranceRequirements.filter(req => req !== type);
    setInsuranceRequirements(updated);
    updateCompliance('insurance_requirements', updated);
  };

  const getComplianceStats = () => {
    const allRequirements = Object.values(COMPLIANCE_CATEGORIES).flatMap(cat => cat.requirements);
    const enabled = allRequirements.filter(req => data.compliance[req.key] === true);
    const required = allRequirements.filter(req => req.required);
    const missing = required.filter(req => !data.compliance[req.key]);
    
    return {
      total: allRequirements.length,
      enabled: enabled.length,
      required: required.length,
      missing: missing.length
    };
  };

  const stats = getComplianceStats();
  const customRequirements = Object.entries(data.compliance).filter(([key, value]) => 
    typeof value === 'object' && value?.custom
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Compliance Management</h2>
        <p className="text-muted-foreground">
          Configure regulatory and compliance requirements for your RFP
        </p>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {errors.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </AlertDescription>
        </Alert>
      )}

      {/* Compliance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.enabled}</div>
              <div className="text-sm text-muted-foreground">Enabled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.required}</div>
              <div className="text-sm text-muted-foreground">Required</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.missing}</div>
              <div className="text-sm text-muted-foreground">Missing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{customRequirements.length}</div>
              <div className="text-sm text-muted-foreground">Custom</div>
            </div>
          </div>
          
          {stats.missing > 0 && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                You have {stats.missing} required compliance item(s) that need to be addressed.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Compliance Categories */}
      {Object.entries(COMPLIANCE_CATEGORIES).map(([categoryKey, category]) => {
        const IconComponent = category.icon;
        return (
          <Card key={categoryKey}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconComponent className="w-5 h-5" />
                {category.title}
                <Badge className={category.color}>
                  {category.requirements.filter(req => data.compliance[req.key]).length} of {category.requirements.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.requirements.map((requirement) => (
                <div key={requirement.key} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{requirement.name}</h4>
                        {requirement.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        {data.compliance[requirement.key] && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {requirement.description}
                      </p>
                      {requirement.documentation && (
                        <div className="text-xs text-muted-foreground">
                          <strong>Documentation required:</strong> {requirement.documentation.join(', ')}
                        </div>
                      )}
                    </div>
                    <Switch
                      checked={data.compliance[requirement.key] || false}
                      onCheckedChange={(checked) => updateCompliance(requirement.key, checked)}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* Insurance Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Insurance Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {INSURANCE_TYPES.map((type) => (
              <div
                key={type}
                className={`p-2 border rounded cursor-pointer transition-colors ${
                  insuranceRequirements.includes(type)
                    ? 'bg-primary/10 border-primary'
                    : 'hover:bg-accent'
                }`}
                onClick={() => {
                  if (insuranceRequirements.includes(type)) {
                    removeInsuranceRequirement(type);
                  } else {
                    addInsuranceRequirement(type);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm">{type}</span>
                  {insuranceRequirements.includes(type) && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {insuranceRequirements.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Selected Insurance Types:</h4>
              <div className="flex flex-wrap gap-2">
                {insuranceRequirements.map((type) => (
                  <Badge key={type} variant="secondary" className="flex items-center gap-1">
                    {type}
                    <X 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={() => removeInsuranceRequirement(type)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custom Requirements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Custom Requirements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="custom-name">Requirement Name</Label>
              <Input
                id="custom-name"
                value={customRequirement.name}
                onChange={(e) => setCustomRequirement({ ...customRequirement, name: e.target.value })}
                placeholder="e.g., Local Business Preference"
              />
            </div>
            <div className="flex items-end">
              <div className="flex items-center space-x-2">
                <Switch
                  id="custom-required"
                  checked={customRequirement.required}
                  onCheckedChange={(checked) => setCustomRequirement({ ...customRequirement, required: checked })}
                />
                <Label htmlFor="custom-required">Required</Label>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="custom-description">Description</Label>
            <Textarea
              id="custom-description"
              value={customRequirement.description}
              onChange={(e) => setCustomRequirement({ ...customRequirement, description: e.target.value })}
              placeholder="Detailed description of the custom requirement..."
              rows={2}
            />
          </div>
          
          <Button onClick={addCustomRequirement} disabled={!customRequirement.name}>
            <Plus className="w-4 h-4 mr-2" />
            Add Custom Requirement
          </Button>
          
          {/* Display Custom Requirements */}
          {customRequirements.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Custom Requirements:</h4>
              {customRequirements.map(([key, requirement]: [string, any]) => (
                <div key={key} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{requirement.name}</span>
                      {requirement.required && (
                        <Badge variant="destructive" className="text-xs">Required</Badge>
                      )}
                    </div>
                    {requirement.description && (
                      <p className="text-sm text-muted-foreground">{requirement.description}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeCustomRequirement(key)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Summary */}
      <Card className="border-dashed">
        <CardContent className="pt-6">
          <div className="text-center">
            <Info className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <h3 className="font-medium mb-2">Compliance Configuration Complete</h3>
            <p className="text-sm text-muted-foreground">
              {stats.enabled} compliance requirements configured. 
              {stats.missing > 0 && `${stats.missing} required items still need attention.`}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
