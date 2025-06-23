
import React from 'react';
import { Card } from '@/components/ui/card';
import { Building2, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const PortfolioDashboard: React.FC = () => {
  console.log('PortfolioDashboard rendering');
  
  return (
    <div className="h-full p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Portfolio Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Overview of all projects and portfolio-wide metrics
        </p>
      </div>
      
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Projects</h3>
              <p className="text-2xl font-bold text-blue-600">12</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Portfolio Value</h3>
              <p className="text-2xl font-bold text-green-600">$2.4B</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">At Risk</h3>
              <p className="text-2xl font-bold text-orange-600">3</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Completed</h3>
              <p className="text-2xl font-bold text-purple-600">8</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Project List */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Projects</h2>
        <div className="space-y-4">
          {[
            { name: "Downtown Office Complex", status: "In Progress", budget: "$50M" },
            { name: "Residential Tower A", status: "Planning", budget: "$75M" },
            { name: "Shopping Center Renovation", status: "Completed", budget: "$25M" },
          ].map((project, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-sm text-muted-foreground">{project.status}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{project.budget}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default PortfolioDashboard;
