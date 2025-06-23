
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Zap, Droplets, TrendingUp, TrendingDown } from 'lucide-react';

const SustainabilityMetrics = () => {
  // Mock sustainability data for the widget
  const metrics = {
    carbonFootprint: { value: 300, target: 280, unit: 'tons CO₂', trend: 'up' },
    renewableEnergy: { value: 22, target: 25, unit: '%', trend: 'up' },
    waterUsage: { value: 1.2, lastYear: 1.22, unit: 'M gallons', trend: 'down' },
    wasteRecycling: { value: 85, target: 90, unit: '%', trend: 'up' }
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          Sustainability Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Carbon Footprint */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Carbon Emissions</span>
          </div>
          <div className="text-right">
            <div className="font-medium">{metrics.carbonFootprint.value} {metrics.carbonFootprint.unit}</div>
            <div className="text-xs text-red-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              vs {metrics.carbonFootprint.target} target
            </div>
          </div>
        </div>

        {/* Renewable Energy */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Renewable Energy</span>
          </div>
          <div className="text-right">
            <div className="font-medium text-green-600">{metrics.renewableEnergy.value}{metrics.renewableEnergy.unit}</div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +10% this quarter
            </div>
          </div>
        </div>

        {/* Water Usage */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Water Usage YTD</span>
          </div>
          <div className="text-right">
            <div className="font-medium">{metrics.waterUsage.value} {metrics.waterUsage.unit}</div>
            <div className="text-xs text-green-600 flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              -2% vs last year
            </div>
          </div>
        </div>

        {/* Waste Recycling */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-green-600 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-white" />
            </div>
            <span className="text-sm">Waste Diverted</span>
          </div>
          <div className="text-right">
            <div className="font-medium text-green-600">{metrics.wasteRecycling.value}{metrics.wasteRecycling.unit}</div>
            <div className="text-xs text-muted-foreground">
              Target: {metrics.wasteRecycling.target}%
            </div>
          </div>
        </div>

        <div className="pt-2 border-t">
          <Badge variant="secondary" className="w-full justify-center">
            View Full Sustainability Dashboard
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default SustainabilityMetrics;
