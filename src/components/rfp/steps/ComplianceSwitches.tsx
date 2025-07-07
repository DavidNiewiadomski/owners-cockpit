import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Info, Shield, Building, Accessibility, HardHat } from 'lucide-react';

interface ComplianceSwitchesProps {
  data: {
    compliance: {
      mwbe?: boolean;
      ll86?: boolean;
      ada?: boolean;
      osha?: boolean;
      [key: string]: any;
    };
  };
  onDataChange: (data: Partial<typeof data>) => void;
  rfpId?: string;
}

const COMPLIANCE_REQUIREMENTS = [
  {
    key: 'mwbe',
    title: 'MWBE (Minority and Women-Owned Business Enterprise)',
    description: 'Requires participation of certified minority and women-owned business enterprises in the project.',
    icon: Building,
    category: 'Diversity & Inclusion',
    mandatory: false,
    details: [
      'Minimum 20% MWBE participation required',
      'Contractors must submit MWBE utilization plan',
      'Quarterly compliance reporting required',
      'Good faith efforts documentation required'
    ]
  },
  {
    key: 'll86',
    title: 'Local Law 86 (Environmental Requirements)',
    description: 'New York City environmental compliance requirements for construction projects.',
    icon: Shield,
    category: 'Environmental',
    mandatory: true,
    details: [
      'Environmental impact assessment required',
      'Sustainable construction practices',
      'Waste reduction and recycling plans',
      'Air quality monitoring during construction'
    ]
  },
  {
    key: 'ada',
    title: 'ADA (Americans with Disabilities Act)',
    description: 'Ensures accessibility compliance for all facility users.',
    icon: Accessibility,
    category: 'Accessibility',
    mandatory: true,
    details: [
      'Full ADA Title III compliance required',
      'Accessible routes and entrances',
      'Compliant restroom facilities',
      'Accessible parking requirements'
    ]
  },
  {
    key: 'osha',
    title: 'OSHA (Occupational Safety and Health Administration)',
    description: 'Workplace safety and health requirements for construction activities.',
    icon: HardHat,
    category: 'Safety',
    mandatory: true,
    details: [
      'OSHA 30-hour training for supervisors',
      'Daily safety inspections required',
      'Incident reporting protocols',
      'Personal protective equipment requirements'
    ]
  }
];

export function ComplianceSwitches({ data, onDataChange }: ComplianceSwitchesProps) {
  const handleComplianceChange = (key: string, value: boolean) => {
    onDataChange({
      compliance: {
        ...data.compliance,
        [key]: value
      }
    });
  };

  const getComplianceCount = () => {
    return COMPLIANCE_REQUIREMENTS.filter(req => data.compliance[req.key]).length;
  };

  const getMandatoryCount = () => {
    return COMPLIANCE_REQUIREMENTS.filter(req => req.mandatory && data.compliance[req.key]).length;
  };

  const getMandatoryTotal = () => {
    return COMPLIANCE_REQUIREMENTS.filter(req => req.mandatory).length;
  };

  return (
    <div className="space-y-6">
      {/* Compliance Overview */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Compliance Requirements Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {getComplianceCount()}
              </div>
              <div className="text-sm text-gray-400">Total Selected</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">
                {getMandatoryCount()} / {getMandatoryTotal()}
              </div>
              <div className="text-sm text-gray-400">Mandatory Enabled</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {getComplianceCount() - getMandatoryCount()}
              </div>
              <div className="text-sm text-gray-400">Optional Selected</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Requirements */}
      <div className="space-y-4">
        {COMPLIANCE_REQUIREMENTS.map((requirement) => (
          <Card
            key={requirement.key}
            className={`bg-gray-800 border-gray-600 transition-all ${
              data.compliance[requirement.key] ? 'ring-2 ring-blue-500' : ''
            }`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <requirement.icon className="w-6 h-6 text-blue-400 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <CardTitle className="text-white text-lg">
                        {requirement.title}
                      </CardTitle>
                      <Badge 
                        variant={requirement.mandatory ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {requirement.mandatory ? "Mandatory" : "Optional"}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {requirement.category}
                      </Badge>
                    </div>
                    <p className="text-gray-400 text-sm">
                      {requirement.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={data.compliance[requirement.key] || false}
                  onCheckedChange={(value) => handleComplianceChange(requirement.key, value)}
                  disabled={requirement.mandatory}
                />
              </div>
            </CardHeader>
            
            {(data.compliance[requirement.key] || requirement.mandatory) && (
              <CardContent className="pt-0">
                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Info className="w-4 h-4 text-blue-400" />
                    <span className="text-white font-medium">Requirements Details</span>
                  </div>
                  <ul className="space-y-2">
                    {requirement.details.map((detail, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm text-gray-300">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Compliance Summary */}
      <Card className="bg-gray-800 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Compliance Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-sm text-gray-400">
              Selected compliance requirements will be included in the RFP documentation and vendor submissions will be evaluated against these criteria.
            </div>
            
            {getMandatoryCount() < getMandatoryTotal() && (
              <div className="bg-yellow-900/50 border border-yellow-600 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-yellow-400" />
                  <span className="text-yellow-400 font-medium">Notice</span>
                </div>
                <p className="text-yellow-200 text-sm mt-1">
                  Some mandatory compliance requirements are not enabled. These will be automatically included in the final RFP.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <h4 className="text-white font-medium mb-2">Enabled Requirements</h4>
                <div className="space-y-1">
                  {COMPLIANCE_REQUIREMENTS
                    .filter(req => data.compliance[req.key] || req.mandatory)
                    .map(req => (
                      <div key={req.key} className="flex items-center space-x-2 text-sm">
                        <span className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-gray-300">{req.title}</span>
                        {req.mandatory && (
                          <Badge variant="destructive" className="text-xs">Mandatory</Badge>
                        )}
                      </div>
                    ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-white font-medium mb-2">Impact on Vendors</h4>
                <div className="text-sm text-gray-400 space-y-1">
                  <p>• Vendors must demonstrate compliance with all enabled requirements</p>
                  <p>• Documentation and certifications will be required</p>
                  <p>• Compliance scoring will affect vendor evaluation</p>
                  <p>• Non-compliance may result in proposal rejection</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
