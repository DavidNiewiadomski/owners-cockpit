
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface QualityMetricsProps {
  qualityMetrics: {
    defectRate: number;
    reworkHours: number;
    inspectionPass: number;
    punchListItems: number;
  };
}

const QualityMetrics: React.FC<QualityMetricsProps> = ({ qualityMetrics }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <Card className="linear-kpi-card">
        <CardContent className="p-4 text-center">
          <div className="linear-kpi-value text-red-700">{qualityMetrics.defectRate}%</div>
          <p className="linear-kpi-label">Defect Rate</p>
          <p className="text-xs text-muted-foreground mt-1">Target: &lt;2.5%</p>
        </CardContent>
      </Card>
      
      <Card className="linear-kpi-card">
        <CardContent className="p-4 text-center">
          <div className="linear-kpi-value text-yellow-700">{qualityMetrics.reworkHours}</div>
          <p className="linear-kpi-label">Rework Hours</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </CardContent>
      </Card>
      
      <Card className="linear-kpi-card">
        <CardContent className="p-4 text-center">
          <div className="linear-kpi-value text-green-700">{qualityMetrics.inspectionPass}%</div>
          <p className="linear-kpi-label">Inspection Pass</p>
          <p className="text-xs text-muted-foreground mt-1">First time right</p>
        </CardContent>
      </Card>
      
      <Card className="linear-kpi-card">
        <CardContent className="p-4 text-center">
          <div className="linear-kpi-value text-blue-700">{qualityMetrics.punchListItems}</div>
          <p className="linear-kpi-label">Open Punch Items</p>
          <p className="text-xs text-muted-foreground mt-1">Pending completion</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QualityMetrics;
