
import React from 'react';
import FinancialPerformanceChart from './FinancialPerformanceChart';
import RiskDistributionChart from './RiskDistributionChart';

interface ChartsSectionProps {
  projectData: {
    monthlySpend: Array<{
      month: string;
      budget: number;
      actual: number;
      forecast: number;
    }>;
    riskBreakdown: Array<{
      category: string;
      value: number;
      color: string;
    }>;
  };
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ projectData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <FinancialPerformanceChart monthlySpend={projectData.monthlySpend} />
      <RiskDistributionChart riskBreakdown={projectData.riskBreakdown} />
    </div>
  );
};

export default ChartsSection;
