
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, AlertTriangle, Clock, DollarSign } from 'lucide-react';
import { generateConstructionDemoData } from '@/utils/constructionDemoData';

interface CriticalDocumentsProps {
  projectName: string;
}

const CriticalDocuments: React.FC<CriticalDocumentsProps> = ({ projectName }) => {
  const dashboardData = generateConstructionDemoData();
  
  // Filter documents for current project and separate overdue vs today's items
  const projectDocuments = dashboardData.criticalDocuments.filter(doc => 
    doc.projectName === projectName
  );
  
  const overdueItems = projectDocuments.filter(doc => 
    doc.priority === 'high' || doc.daysOpen > 5
  );
  
  const recentItems = dashboardData.criticalDocuments.filter(doc => 
    doc.daysOpen <= 2
  ).slice(0, 2);

  const getStatusColor = (type: string, priority: string, daysOpen: number) => {
    if (priority === 'high' || daysOpen > 5) return 'text-red-600';
    if (priority === 'medium' || daysOpen > 2) return 'text-amber-600';
    return 'text-foreground';
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'change_order':
        return <DollarSign className="h-4 w-4" />;
      case 'rfi':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Card className="linear-card">
      <CardHeader>
        <CardTitle className="linear-chart-title">
          <FileText className="h-5 w-5" />
          Critical Documents & Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Overdue Items ({overdueItems.length})</h4>
            <div className="space-y-2">
              {overdueItems.length > 0 ? (
                overdueItems.map((item) => (
                  <Button 
                    key={item.id}
                    variant="outline" 
                    className="w-full justify-start text-left h-auto p-3 hover:bg-accent/50"
                  >
                    <div className="flex items-start gap-2 w-full">
                      {getIcon(item.type)}
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className={`font-medium ${getStatusColor(item.type, item.priority, item.daysOpen)}`}>
                          {item.title}
                        </span>
                        <span className="text-sm text-muted-foreground truncate">
                          {item.status} • {item.daysOpen} days {item.value ? `• $${(item.value/1000).toFixed(0)}k` : ''}
                        </span>
                      </div>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="text-sm text-muted-foreground p-3 text-center">
                  No overdue items for {projectName}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Recent Activity</h4>
            <div className="space-y-2">
              {recentItems.length > 0 ? (
                recentItems.map((item) => (
                  <Button 
                    key={item.id}
                    variant="outline" 
                    className="w-full justify-start text-left h-auto p-3 hover:bg-accent/50"
                  >
                    <div className="flex items-start gap-2 w-full">
                      {getIcon(item.type)}
                      <div className="flex flex-col items-start flex-1 min-w-0">
                        <span className="font-medium text-foreground truncate">
                          {item.title}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {item.projectName} • {item.status}
                        </span>
                      </div>
                    </div>
                  </Button>
                ))
              ) : (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-left h-auto p-3 hover:bg-accent/50">
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-foreground">Daily Field Report - {projectName}</span>
                      <span className="text-sm text-muted-foreground">Updated 1 hour ago</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left h-auto p-3 hover:bg-accent/50">
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-foreground">Weekly Safety Report</span>
                      <span className="text-sm text-muted-foreground">Generated this morning</span>
                    </div>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Portfolio Summary */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-red-600">{dashboardData.portfolioSummary.totalOverdueRFIs}</div>
              <div className="text-xs text-muted-foreground">Overdue RFIs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{dashboardData.portfolioSummary.totalOpenRFIs}</div>
              <div className="text-xs text-muted-foreground">Open RFIs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{dashboardData.portfolioSummary.totalOpenSubmittals}</div>
              <div className="text-xs text-muted-foreground">Pending Submittals</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{dashboardData.portfolioSummary.totalChangeOrders}</div>
              <div className="text-xs text-muted-foreground">Change Orders</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CriticalDocuments;
