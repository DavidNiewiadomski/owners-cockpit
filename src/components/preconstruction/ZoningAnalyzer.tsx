
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle, Building, Calculator, FileText } from 'lucide-react';
import type { Site, ZoningAnalysisRequest, PermitRequirement } from '@/types/preconstruction';

interface ZoningAnalyzerProps {
  site: Site;
}

const ZoningAnalyzer: React.FC<ZoningAnalyzerProps> = ({ site }) => {
  const [analysisRequest, setAnalysisRequest] = useState<Partial<ZoningAnalysisRequest>>({
    siteId: site.id,
    proposedUse: 'Multi-family residential',
    buildingSpecs: {
      floors: 5,
      units: 40,
      grossArea: 35000,
      height: 60
    }
  });
  const [analysis, setAnalysis] = useState<unknown>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock permit requirements
  const mockPermitRequirements: PermitRequirement[] = [
    {
      type: 'Site Plan Review',
      authority: 'Planning Commission',
      estimatedDuration: 8,
      cost: 5000,
      requirements: ['Architectural drawings', 'Traffic study', 'Environmental assessment'],
      priority: 'critical'
    },
    {
      type: 'Building Permit',
      authority: 'Building Department',
      estimatedDuration: 6,
      cost: 15000,
      requirements: ['Structural plans', 'MEP drawings', 'Energy compliance'],
      priority: 'critical'
    },
    {
      type: 'Zoning Variance',
      authority: 'Zoning Board',
      estimatedDuration: 12,
      cost: 8000,
      requirements: ['Hardship justification', 'Neighbor notification', 'Public hearing'],
      priority: 'high'
    }
  ];

  const runZoningAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const maxUnits = Math.floor((site.parcelSize * site.zoning.maxFAR) / 875); // avg 875 sq ft per unit
      const requiredParking = Math.ceil((analysisRequest.buildingSpecs?.units || 0) * site.zoning.parkingRatio);
      const compliance = {
        height: (analysisRequest.buildingSpecs?.height || 0) <= site.zoning.maxHeight,
        far: ((analysisRequest.buildingSpecs?.grossArea || 0) / site.parcelSize) <= site.zoning.maxFAR,
        use: site.zoning.permittedUses.includes('Multi-family residential'),
        setbacks: true // simplified for demo
      };

      setAnalysis({
        maxUnits,
        requiredParking,
        compliance,
        recommendations: [
          maxUnits < (analysisRequest.buildingSpecs?.units || 0) 
            ? `Reduce units to ${maxUnits} to comply with FAR` 
            : 'Unit count is within zoning limits',
          `Provide ${requiredParking} parking spaces minimum`,
          compliance.height ? 'Height complies with zoning' : 'Reduce height to comply',
        ],
        warnings: site.zoning.specialRestrictions.length > 0 
          ? [`Special restrictions apply: ${site.zoning.specialRestrictions.join(', ')}`]
          : []
      });
      setIsAnalyzing(false);
    }, 1500);
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-green-600" />
            AI Zoning Analysis for {site.address}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="analysis">
            <TabsList>
              <TabsTrigger value="analysis">Zoning Analysis</TabsTrigger>
              <TabsTrigger value="permits">Permit Requirements</TabsTrigger>
              <TabsTrigger value="timeline">Approval Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-4">
              {/* Current Zoning Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Zoning</div>
                    <div className="text-lg font-semibold">{site.zoning.zone}</div>
                    <div className="text-sm">{site.zoning.designation}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Max FAR</div>
                    <div className="text-lg font-semibold">{site.zoning.maxFAR}</div>
                    <div className="text-sm">Floor Area Ratio</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-sm text-muted-foreground">Max Height</div>
                    <div className="text-lg font-semibold">{site.zoning.maxHeight} ft</div>
                    <div className="text-sm">Height Limit</div>
                  </CardContent>
                </Card>
              </div>

              {/* Proposed Development */}
              <div className="space-y-4">
                <h4 className="font-medium">Proposed Development</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium">Floors</label>
                    <Input 
                      type="number" 
                      value={analysisRequest.buildingSpecs?.floors}
                      onChange={(e) => setAnalysisRequest(prev => ({
                        ...prev,
                        buildingSpecs: { ...prev.buildingSpecs!, floors: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Units</label>
                    <Input 
                      type="number" 
                      value={analysisRequest.buildingSpecs?.units}
                      onChange={(e) => setAnalysisRequest(prev => ({
                        ...prev,
                        buildingSpecs: { ...prev.buildingSpecs!, units: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Gross Area (sq ft)</label>
                    <Input 
                      type="number" 
                      value={analysisRequest.buildingSpecs?.grossArea}
                      onChange={(e) => setAnalysisRequest(prev => ({
                        ...prev,
                        buildingSpecs: { ...prev.buildingSpecs!, grossArea: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Height (ft)</label>
                    <Input 
                      type="number" 
                      value={analysisRequest.buildingSpecs?.height}
                      onChange={(e) => setAnalysisRequest(prev => ({
                        ...prev,
                        buildingSpecs: { ...prev.buildingSpecs!, height: parseInt(e.target.value) }
                      }))}
                    />
                  </div>
                </div>
                
                <Button onClick={runZoningAnalysis} disabled={isAnalyzing} className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  {isAnalyzing ? 'AI Analyzing Zoning...' : 'Run AI Zoning Analysis'}
                </Button>
              </div>

              {/* Analysis Results */}
              {analysis && (
                <div className="space-y-4 mt-6">
                  <h4 className="font-medium">Analysis Results</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {analysis.compliance.far ? 
                            <CheckCircle className="h-4 w-4 text-green-600" /> : 
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          }
                          <span className="font-medium">FAR Compliance</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Current: {((analysisRequest.buildingSpecs?.grossArea || 0) / site.parcelSize).toFixed(2)}
                          / Max: {site.zoning.maxFAR}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          {analysis.compliance.height ? 
                            <CheckCircle className="h-4 w-4 text-green-600" /> : 
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                          }
                          <span className="font-medium">Height Compliance</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Proposed: {analysisRequest.buildingSpecs?.height} ft / Max: {site.zoning.maxHeight} ft
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-medium">AI Recommendations:</h5>
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>

                  {analysis.warnings.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium">Warnings:</h5>
                      {analysis.warnings.map((warning: string, index: number) => (
                        <div key={index} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                          <span>{warning}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="permits" className="space-y-4">
              <div className="space-y-4">
                {mockPermitRequirements.map((permit, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <FileText className="h-5 w-5 text-blue-600" />
                            <h4 className="font-semibold">{permit.type}</h4>
                            <Badge variant={getPriorityBadgeVariant(permit.priority)}>
                              {permit.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Authority: {permit.authority}
                          </p>
                          <div className="text-sm">
                            <strong>Requirements:</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                              {permit.requirements.map((req, reqIndex) => (
                                <li key={reqIndex}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold">{permit.estimatedDuration} weeks</div>
                          <div className="text-sm text-muted-foreground">Duration</div>
                          <div className="text-lg font-semibold mt-2">${permit.cost.toLocaleString()}</div>
                          <div className="text-sm text-muted-foreground">Est. Cost</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">AI-Generated Approval Timeline</h4>
                    <div className="space-y-3">
                      {[
                        { phase: 'Pre-Application Meeting', duration: '2 weeks', status: 'upcoming' },
                        { phase: 'Site Plan Review', duration: '8 weeks', status: 'upcoming' },
                        { phase: 'Zoning Variance (if needed)', duration: '12 weeks', status: 'conditional' },
                        { phase: 'Building Permit', duration: '6 weeks', status: 'upcoming' },
                        { phase: 'Final Inspections', duration: '4 weeks', status: 'upcoming' }
                      ].map((phase, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              phase.status === 'conditional' ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />
                            <span className="font-medium">{phase.phase}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{phase.duration}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded">
                      <p className="text-sm">
                        <strong>Total Estimated Timeline:</strong> 24-32 weeks depending on variance requirements
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZoningAnalyzer;
