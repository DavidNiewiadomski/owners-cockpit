import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Minus, Loader2 } from 'lucide-react';
import { usePerformanceScorecardManager } from '@/hooks/usePerformanceScorecard';

interface PerformanceScorecardsProps {}

const PerformanceScorecards: React.FC<PerformanceScorecardsProps> = () => {
  const {
    scorecards: dataBaseScorecards,
    periods: dataPeriods,
    selectedPeriod,
    setSelectedPeriod,
    isLoading
  } = usePerformanceScorecardManager();

  // Sample performance scorecard data
  const sampleScorecards = [
    {
      company_id: 'comp_001',
      company_name: 'Metropolitan Steel Works',
      overall_score: 94.5,
      trend: 'up' as const,
      quality_score: 96,
      schedule_score: 94,
      budget_score: 92,
      safety_score: 98,
      communication_score: 95
    },
    {
      company_id: 'comp_002',
      company_name: 'Advanced MEP Solutions',
      overall_score: 89.2,
      trend: 'stable' as const,
      quality_score: 90,
      schedule_score: 88,
      budget_score: 91,
      safety_score: 87,
      communication_score: 90
    },
    {
      company_id: 'comp_003',
      company_name: 'Premier Concrete Co.',
      overall_score: 96.8,
      trend: 'up' as const,
      quality_score: 98,
      schedule_score: 97,
      budget_score: 95,
      safety_score: 99,
      communication_score: 96
    },
    {
      company_id: 'comp_004',
      company_name: 'Glass Tech Systems',
      overall_score: 87.3,
      trend: 'down' as const,
      quality_score: 89,
      schedule_score: 85,
      budget_score: 88,
      safety_score: 86,
      communication_score: 88
    },
    {
      company_id: 'comp_005',
      company_name: 'Elite Electrical Systems',
      overall_score: 92.1,
      trend: 'up' as const,
      quality_score: 94,
      schedule_score: 91,
      budget_score: 90,
      safety_score: 95,
      communication_score: 92
    },
    {
      company_id: 'comp_006',
      company_name: 'Precision Plumbing Corp',
      overall_score: 85.7,
      trend: 'stable' as const,
      quality_score: 87,
      schedule_score: 84,
      budget_score: 86,
      safety_score: 85,
      communication_score: 87
    }
  ];

  // Use database data if available, otherwise use sample data
  const scorecards = dataBaseScorecards?.length > 0 ? dataBaseScorecards : sampleScorecards;
  const periods = dataPeriods?.length > 0 ? dataPeriods : ['Q1-2024', 'Q2-2024', 'Q3-2024', 'Q4-2024'];

  const renderTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-green-600" />;
      case 'down':
        return <TrendingDown className="text-red-600" />;
      default:
        return <Minus className="text-yellow-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Supplier Performance Scorecards
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Q1-2024">Q1-2024</SelectItem>
              <SelectItem value="Q2-2024">Q2-2024</SelectItem>
              <SelectItem value="Q3-2024">Q3-2024</SelectItem>
              <SelectItem value="Q4-2024">Q4-2024</SelectItem>
              {periods.map(period => (
                <SelectItem key={period} value={period}>
                  {period}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="ml-2">Loading performance data...</span>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Overall Score</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scorecards.map(scorecard => (
                <TableRow key={scorecard.company_id}>
                  <TableCell>{scorecard.company_name}</TableCell>
                  <TableCell>{scorecard.overall_score}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={scorecard.trend === 'down' ? 'destructive' : 'secondary'}
                      className={`flex items-center gap-1 ${
                        scorecard.trend === 'up' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                        scorecard.trend === 'down' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                        'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                      }`}
                    >
                      {renderTrendIcon(scorecard.trend || 'stable')}
                      <span className="ml-1">
                        {scorecard.trend === 'up' ? 'Improving' :
                         scorecard.trend === 'down' ? 'Declining' : 'Stable'}
                      </span>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default PerformanceScorecards;
