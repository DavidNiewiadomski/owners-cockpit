
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, FileText, Calculator, Clock, Target, TrendingUp, Brain, Building } from 'lucide-react';
import PreconstructionAssistant from '../preconstruction/PreconstructionAssistant';

interface PreconstructionDashboardProps {
  projectId: string;
}

const PreconstructionDashboard: React.FC<PreconstructionDashboardProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const projects = [
    { id: 1, name: 'Downtown Office Tower', phase: 'Site Analysis', budget: 4200000, feasibility: 85, timeline: '18 months' },
    { id: 2, name: 'Suburban Retail Center', phase: 'Design Development', budget: 2800000, feasibility: 92, timeline: '14 months' },
    { id: 3, name: 'Industrial Warehouse', phase: 'Permitting', budget: 1600000, feasibility: 78, timeline: '12 months' },
    { id: 4, name: 'Mixed-Use Complex', phase: 'Evaluation', budget: 6500000, feasibility: 71, timeline: '24 months' }
  ];

  const siteData = [
    { location: 'Downtown District A', zoning: 'Commercial', score: 8.5, available: true },
    { location: 'Industrial Park B', zoning: 'Industrial', score: 7.2, available: true },
    { location: 'Suburban Area C', zoning: 'Mixed-Use', score: 9.1, available: false },
    { location: 'Waterfront D', zoning: 'High-Rise', score: 8.8, available: true }
  ];

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Portfolio Overview</TabsTrigger>
          <TabsTrigger value="ai-assistant">
            <Brain className="h-4 w-4 mr-2" />
            AI Assistant
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Pipeline Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Pipeline</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{projects.length}</div>
                <p className="text-xs text-muted-foreground">Projects in development</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
                <Calculator className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${(projects.reduce((sum, p) => sum + p.budget, 0) / 1000000).toFixed(1)}M
                </div>
                <p className="text-xs text-muted-foreground">Estimated project value</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Feasibility</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(projects.reduce((sum, p) => sum + p.feasibility, 0) / projects.length)}%
                </div>
                <p className="text-xs text-muted-foreground">Project viability score</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ready to Proceed</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {projects.filter(p => p.feasibility > 80).length}
                </div>
                <p className="text-xs text-muted-foreground">High-feasibility projects</p>
              </CardContent>
            </Card>
          </div>

          {/* Project Pipeline */}
          <Card>
            <CardHeader>
              <CardTitle>Project Development Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{project.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Phase: {project.phase}</span>
                        <span>Timeline: {project.timeline}</span>
                        <span>Budget: ${(project.budget / 1000000).toFixed(1)}M</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={project.feasibility > 80 ? 'default' : project.feasibility > 70 ? 'secondary' : 'outline'}
                      >
                        {project.feasibility}% Feasible
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Site Selection & Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  Site Selection Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {siteData.map((site, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <h4 className="font-medium">{site.location}</h4>
                        <p className="text-sm text-muted-foreground">Zoning: {site.zoning}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">Score: {site.score}/10</div>
                        <Badge variant={site.available ? 'default' : 'secondary'}>
                          {site.available ? 'Available' : 'Reserved'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('ai-assistant')}>
                  <Brain className="h-4 w-4 mr-2" />
                  Use AI Site Selector
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Feasibility Studies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium">Market Analysis Complete</h4>
                    <p className="text-sm text-muted-foreground">Downtown Office Tower - Strong demand for Class A office space</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-medium">Environmental Review</h4>
                    <p className="text-sm text-muted-foreground">Suburban Retail Center - Phase I ESA completed, no issues found</p>
                  </div>
                  <div className="border-l-4 border-amber-500 pl-4">
                    <h4 className="font-medium">Traffic Impact Study</h4>
                    <p className="text-sm text-muted-foreground">Mixed-Use Complex - Additional analysis required for peak hours</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('ai-assistant')}>
                  <Calculator className="h-4 w-4 mr-2" />
                  AI Feasibility Modeling
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle>AI Planning Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Recommended Priority</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                    Based on feasibility scores and market conditions, prioritize Suburban Retail Center (92% feasible) for immediate development.
                  </p>
                </div>
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 dark:text-green-100">Cost Optimization</h4>
                  <p className="text-sm text-green-800 dark:text-green-200 mt-1">
                    Bundling permits for Industrial Warehouse with existing applications could save 15-20% on processing fees.
                  </p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
                  <h4 className="font-medium text-amber-900 dark:text-amber-100">Risk Assessment</h4>
                  <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                    Mixed-Use Complex shows zoning risk. Consider alternative design or engage with planning commission early.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-assistant">
          <PreconstructionAssistant />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PreconstructionDashboard;
