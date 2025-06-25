
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calculator, TrendingUp, AlertTriangle, BarChart3 } from 'lucide-react';
import type { Site, DevelopmentScenario, RiskFactor } from '@/types/preconstruction';

interface FeasibilityModelerProps {
  site: Site;
}

const FeasibilityModeler: React.FC<FeasibilityModelerProps> = ({ site: _site }) => {
  const [scenarios, setScenarios] = useState<DevelopmentScenario[]>([]);
  const [isModeling, setIsModeling] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Mock scenarios for demonstration
  const mockScenarios: DevelopmentScenario[] = [
    {
      id: '1',
      name: 'Conservative 4-Story',
      buildingType: 'residential',
      units: 32,
      floors: 4,
      grossFloorArea: 28000,
      parkingSpaces: 24,
      estimatedCost: 8500000,
      estimatedRevenue: 12800000,
      roi: 18.5,
      feasibilityScore: 85,
      constraints: ['Height under limit', 'FAR: 4.5/6.0', 'Parking adequate']
    },
    {
      id: '2',
      name: 'Optimal 6-Story',
      buildingType: 'residential',
      units: 48,
      floors: 6,
      grossFloorArea: 42000,
      parkingSpaces: 36,
      estimatedCost: 12200000,
      estimatedRevenue: 19200000,
      roi: 22.1,
      feasibilityScore: 92,
      constraints: ['Maximizes FAR', 'Height: 180/200ft', 'Premium location']
    },
    {
      id: '3',
      name: 'Mixed-Use Alternative',
      buildingType: 'mixed_use',
      units: 36,
      floors: 5,
      grossFloorArea: 38000,
      parkingSpaces: 40,
      estimatedCost: 11800000,
      estimatedRevenue: 18500000,
      roi: 24.7,
      feasibilityScore: 88,
      constraints: ['Commercial ground floor', 'Higher revenue/sqft', 'Complex permits']
    }
  ];

  const mockRiskFactors: RiskFactor[] = [
    {
      category: 'market',
      risk: 'Interest rate volatility affecting financing costs',
      impact: 'medium',
      mitigation: 'Lock in construction financing early',
      probability: 0.6
    },
    {
      category: 'regulatory',
      risk: 'Potential zoning changes in historic district',
      impact: 'high',
      mitigation: 'Fast-track approval process',
      probability: 0.3
    },
    {
      category: 'environmental',
      risk: 'Soil remediation may be required',
      impact: 'medium',
      mitigation: 'Phase II environmental assessment',
      probability: 0.4
    }
  ];

  const runFeasibilityModel = async () => {
    setIsModeling(true);
    
    // Simulate AI modeling
    setTimeout(() => {
      setScenarios(mockScenarios);
      setIsModeling(false);
    }, 2000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getROIBadgeVariant = (roi: number) => {
    if (roi >= 20) return 'default';
    if (roi >= 15) return 'secondary';
    return 'outline';
  };

  const getRiskBadgeVariant = (impact: string) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-purple-600" />
            AI Feasibility Modeling
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Generate multiple development scenarios with AI-powered financial modeling
            </p>
            
            <Button onClick={runFeasibilityModel} disabled={isModeling} className="w-full">
              <BarChart3 className="h-4 w-4 mr-2" />
              {isModeling ? 'AI Generating Scenarios...' : 'Generate Feasibility Scenarios'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {scenarios.length > 0 && (
        <Tabs defaultValue="scenarios">
          <TabsList>
            <TabsTrigger value="scenarios">Development Scenarios</TabsTrigger>
            <TabsTrigger value="comparison">Financial Comparison</TabsTrigger>
            <TabsTrigger value="risks">Risk Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="space-y-4">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className={`cursor-pointer transition-all ${
                selectedScenario === scenario.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
              }`} onClick={() => setSelectedScenario(scenario.id)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h4 className="text-lg font-semibold">{scenario.name}</h4>
                        <Badge variant={getROIBadgeVariant(scenario.roi)}>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {scenario.roi}% ROI
                        </Badge>
                        <Badge variant="outline">
                          {scenario.feasibilityScore}% Feasible
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-muted-foreground">Units</div>
                          <div className="font-semibold">{scenario.units}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Floors</div>
                          <div className="font-semibold">{scenario.floors}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">GFA</div>
                          <div className="font-semibold">{scenario.grossFloorArea.toLocaleString()} sf</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">Parking</div>
                          <div className="font-semibold">{scenario.parkingSpaces} spaces</div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-sm font-medium">Key Constraints:</div>
                        <div className="flex flex-wrap gap-1">
                          {scenario.constraints.map((constraint, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {constraint}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="text-right space-y-2">
                      <div>
                        <div className="text-sm text-muted-foreground">Est. Cost</div>
                        <div className="text-lg font-bold text-red-600">
                          {formatCurrency(scenario.estimatedCost)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Est. Revenue</div>
                        <div className="text-lg font-bold text-green-600">
                          {formatCurrency(scenario.estimatedRevenue)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Net Profit</div>
                        <div className="text-lg font-bold">
                          {formatCurrency(scenario.estimatedRevenue - scenario.estimatedCost)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Financial Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Scenario</th>
                        <th className="text-right p-2">Cost</th>
                        <th className="text-right p-2">Revenue</th>
                        <th className="text-right p-2">Profit</th>
                        <th className="text-right p-2">ROI</th>
                        <th className="text-right p-2">Cost/Unit</th>
                        <th className="text-right p-2">Revenue/SF</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scenarios.map((scenario) => (
                        <tr key={scenario.id} className="border-b">
                          <td className="p-2 font-medium">{scenario.name}</td>
                          <td className="p-2 text-right">{formatCurrency(scenario.estimatedCost)}</td>
                          <td className="p-2 text-right">{formatCurrency(scenario.estimatedRevenue)}</td>
                          <td className="p-2 text-right font-semibold">
                            {formatCurrency(scenario.estimatedRevenue - scenario.estimatedCost)}
                          </td>
                          <td className="p-2 text-right">
                            <Badge variant={getROIBadgeVariant(scenario.roi)}>
                              {scenario.roi}%
                            </Badge>
                          </td>
                          <td className="p-2 text-right">
                            {formatCurrency(scenario.estimatedCost / scenario.units)}
                          </td>
                          <td className="p-2 text-right">
                            ${(scenario.estimatedRevenue / scenario.grossFloorArea).toFixed(0)}/sf
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="risks">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">AI Risk Assessment</h3>
              {mockRiskFactors.map((risk, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <AlertTriangle className="h-5 w-5 text-amber-500" />
                          <span className="font-medium capitalize">{risk.category} Risk</span>
                          <Badge variant={getRiskBadgeVariant(risk.impact)}>
                            {risk.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm mb-2">{risk.risk}</p>
                        <div className="text-sm">
                          <strong>Mitigation:</strong> {risk.mitigation}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">
                          {(risk.probability * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-muted-foreground">Probability</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default FeasibilityModeler;
