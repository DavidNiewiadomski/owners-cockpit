
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Building, Calculator, FileCheck } from 'lucide-react';
import { Site } from '@/types/preconstruction';
import SiteSelector from './SiteSelector';
import ZoningAnalyzer from './ZoningAnalyzer';
import FeasibilityModeler from './FeasibilityModeler';

const PreconstructionAssistant: React.FC = () => {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [activeTab, setActiveTab] = useState('site-selection');

  const handleSiteSelect = (site: Site) => {
    setSelectedSite(site);
    setActiveTab('zoning-analysis');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">AI Preconstruction Assistant</CardTitle>
          <p className="text-muted-foreground">
            Intelligent site selection, zoning analysis, and feasibility modeling powered by AI
          </p>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="site-selection" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Site Selection
          </TabsTrigger>
          <TabsTrigger value="zoning-analysis" disabled={!selectedSite}>
            <Building className="h-4 w-4" />
            Zoning Analysis
          </TabsTrigger>
          <TabsTrigger value="feasibility" disabled={!selectedSite}>
            <Calculator className="h-4 w-4" />
            Feasibility
          </TabsTrigger>
          <TabsTrigger value="permits" disabled={!selectedSite}>
            <FileCheck className="h-4 w-4" />
            Permits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="site-selection">
          <SiteSelector onSiteSelect={handleSiteSelect} />
        </TabsContent>

        <TabsContent value="zoning-analysis">
          {selectedSite ? (
            <ZoningAnalyzer site={selectedSite} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Select a site first to analyze zoning requirements</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="feasibility">
          {selectedSite ? (
            <FeasibilityModeler site={selectedSite} />
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Select a site first to run feasibility modeling</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="permits">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <FileCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Permit Intelligence</h3>
                <p className="text-muted-foreground">
                  AI-powered permit requirement analysis and timeline estimation
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  This feature integrates with the zoning analysis to provide comprehensive permit guidance
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreconstructionAssistant;
