
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Calendar, 
  Settings,
  Plug,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useProjects } from '@/hooks/useProjects';
import IntegrationsModal from '@/components/integrations/IntegrationsModal';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const PortfolioDashboard = () => {
  const [showIntegrations, setShowIntegrations] = useState(false);
  const { data: projects, isLoading, error } = useProjects();

  const totalProjects = projects?.length || 0;
  const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
  const completedProjects = projects?.filter(p => p.status === 'completed').length || 0;
  const onHoldProjects = projects?.filter(p => p.status === 'on_hold').length || 0;
  const planningProjects = projects?.filter(p => p.status === 'planning').length || 0;

  const projectStatusData = useMemo(() => {
    return [
      { name: 'Active', value: activeProjects },
      { name: 'Planning', value: planningProjects },
      { name: 'Completed', value: completedProjects },
      { name: 'On Hold', value: onHoldProjects },
    ];
  }, [activeProjects, planningProjects, completedProjects, onHoldProjects]);

  // Mock data for budget calculations since the fields don't exist yet
  const totalBudget = projects?.length ? projects.length * 500000 : 0;
  const totalCost = projects?.length ? projects.length * 425000 : 0;
  const budgetVariance = totalBudget - totalCost;

  // Mock health score since the field doesn't exist yet
  const avgProjectHealth = useMemo(() => {
    if (!projects || projects.length === 0) return 0;
    return 75; // Mock average health score
  }, [projects]);

  const projectHealthStatus = useMemo(() => {
    if (avgProjectHealth >= 80) return { label: 'Good', color: 'green' };
    if (avgProjectHealth >= 50) return { label: 'Moderate', color: 'yellow' };
    return { label: 'Critical', color: 'red' };
  }, [avgProjectHealth]);

  const costVarianceData = useMemo(() => {
    return projects?.map((project, index) => ({
      name: project.name,
      variance: 75000 - (index * 10000), // Mock variance data
    })) || [];
  }, [projects]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Overview</h1>
          <p className="text-muted-foreground">
            Comprehensive view of all your construction projects
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowIntegrations(true)}
            className="flex items-center gap-2"
          >
            <Plug className="w-4 h-4" />
            Integrations
          </Button>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              All projects in the portfolio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              Projects currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Combined budget across all projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Variance</CardTitle>
            {budgetVariance >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${budgetVariance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Difference between budget and actual cost
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Project Status Overview</CardTitle>
          <CardDescription>Distribution of projects by status</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-center">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {projectStatusData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Project Health */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Project Health</CardTitle>
          <CardDescription>Average health score across all projects</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center">
          {projectHealthStatus.label === 'Good' && (
            <CheckCircle className="w-6 h-6 text-green-500 mr-2" />
          )}
          {projectHealthStatus.label === 'Moderate' && (
            <AlertTriangle className="w-6 h-6 text-yellow-500 mr-2" />
          )}
          {projectHealthStatus.label === 'Critical' && (
            <AlertTriangle className="w-6 h-6 text-red-500 mr-2" />
          )}
          <div className="text-2xl font-bold">{avgProjectHealth.toFixed(1)}</div>
          <p className="text-sm text-muted-foreground ml-2">
            ({projectHealthStatus.label})
          </p>
        </CardContent>
      </Card>

      {/* Cost Variance Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Variance Analysis</CardTitle>
          <CardDescription>Budget variance for each project</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={costVarianceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="variance" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Integrations Modal */}
      <IntegrationsModal
        isOpen={showIntegrations}
        onClose={() => setShowIntegrations(false)}
        projectId="portfolio"
      />
    </div>
  );
};

export default PortfolioDashboard;
