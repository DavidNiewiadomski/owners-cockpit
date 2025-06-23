
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calculator, FileCheck, TrendingUp, DollarSign, Calendar, MessageSquare, MapPin } from 'lucide-react';
import PreconstructionAssistant from '@/components/preconstruction/PreconstructionAssistant';

interface PreconstructionDashboardProps {
  projectId: string;
}

const PreconstructionDashboard: React.FC<PreconstructionDashboardProps> = ({ projectId }) => {
  const handleInsightClick = (insight: string) => {
    console.log('Opening chat with insight:', insight);
  };

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <Card className="border border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-foreground">
            AI Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
              onClick={() => handleInsightClick("Site Zoning Compliance Issue")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="destructive" className="mt-0.5">High Priority</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Site Zoning Compliance Issue</h4>
                  <p className="text-xs text-muted-foreground mt-1">Proposed building height exceeds zoning limits by 15 feet. Recommend design revision or variance application.</p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
              onClick={() => handleInsightClick("Soil Analysis Complete")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="default" className="mt-0.5">Medium Priority</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Soil Analysis Complete</h4>
                  <p className="text-xs text-muted-foreground mt-1">Geotechnical report shows stable conditions. Foundation design can proceed as planned.</p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
            
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-muted/50"
              onClick={() => handleInsightClick("Early Bird Material Pricing")}
            >
              <div className="flex items-start gap-3 w-full">
                <Badge variant="secondary" className="mt-0.5">Opportunity</Badge>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Early Bird Material Pricing</h4>
                  <p className="text-xs text-muted-foreground mt-1">Steel prices projected to increase 8% next quarter. Lock in current rates to save $450K.</p>
                </div>
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Feasibility</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">92%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                Strong ROI projection
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Analysis</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Site evaluation complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimated Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.8M</div>
            <p className="text-xs text-muted-foreground">
              Within target range
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Timeline</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 mo</div>
            <p className="text-xs text-muted-foreground">
              Projected completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Preconstruction Assistant */}
      <PreconstructionAssistant />
    </div>
  );
};

export default PreconstructionDashboard;
