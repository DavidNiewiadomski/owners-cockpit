import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Calendar, 
  DollarSign, 
  Users, 
  Building,
  BarChart3,
  Target,
  AlertTriangle
} from 'lucide-react';
import CreateProjectModal from '@/components/CreateProjectModal';
import { useProjects } from '@/hooks/useProjects';
import { format } from 'date-fns';

interface ProjectPortfolioGridProps {
  onProjectSelect: (projectId: string) => void;
}

const ProjectPortfolioGrid: React.FC<ProjectPortfolioGridProps> = ({ onProjectSelect }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: projects = [], isLoading } = useProjects();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'design': return 'bg-purple-100 text-purple-800';
      case 'construction': return 'bg-orange-100 text-orange-800';
      case 'closeout': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressForProject = (projectId: string) => {
    // Mock progress data - in real app, this would come from aggregated task/milestone data
    const progressData: Record<string, number> = {
      '11111111-1111-1111-1111-111111111111': 68, // Medical Center
      '22222222-2222-2222-2222-222222222222': 32, // Corporate Campus
      '33333333-3333-3333-3333-333333333333': 15, // Tech Hub
      '44444444-4444-4444-4444-444444444444': 100, // Research Facility
      '55555555-5555-5555-5555-555555555555': 45, // Green Residential
    };
    return progressData[projectId] || 0;
  };

  const getBudgetForProject = (projectId: string) => {
    // Mock budget data - in real app, this would come from aggregated budget items
    const budgetData: Record<string, { total: number; spent: number }> = {
      '11111111-1111-1111-1111-111111111111': { total: 45000000, spent: 32750000 },
      '22222222-2222-2222-2222-222222222222': { total: 28500000, spent: 9550000 },
      '33333333-3333-3333-3333-333333333333': { total: 15800000, spent: 1235000 },
      '44444444-4444-4444-4444-444444444444': { total: 21300000, spent: 21250000 },
      '55555555-5555-5555-5555-555555555555': { total: 18600000, spent: 8525000 },
    };
    return budgetData[projectId] || { total: 0, spent: 0 };
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-2 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Project Portfolio</h2>
          <p className="text-muted-foreground">
            Manage and monitor all your construction projects
          </p>
        </div>
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          const progress = getProgressForProject(project.id);
          const budget = getBudgetForProject(project.id);
          const budgetUtilization = budget.total > 0 ? (budget.spent / budget.total) * 100 : 0;

          return (
            <Card 
              key={project.id} 
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
              onClick={() => onProjectSelect(project.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">
                    {project.name}
                  </CardTitle>
                  <Badge 
                    variant="secondary" 
                    className={getStatusColor(project.status)}
                  >
                    {project.status}
                  </Badge>
                </div>
                {project.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {project.description}
                  </p>
                )}
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Progress
                    </span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Budget
                    </span>
                    <span className="font-medium">
                      {budgetUtilization.toFixed(0)}% used
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    ${(budget.spent / 1000000).toFixed(1)}M / ${(budget.total / 1000000).toFixed(1)}M
                  </div>
                  <Progress value={budgetUtilization} className="h-2" />
                </div>

                {/* Timeline */}
                {(project.start_date || project.end_date) && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {project.start_date && format(new Date(project.start_date), 'MMM yyyy')}
                      {project.start_date && project.end_date && ' - '}
                      {project.end_date && format(new Date(project.end_date), 'MMM yyyy')}
                    </span>
                  </div>
                )}

                {/* Source */}
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Building className="w-3 h-3" />
                    {project.source || 'Manual'}
                  </span>
                  <span className="text-muted-foreground">
                    Updated {format(new Date(project.updated_at), 'MMM d')}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {/* Add Project Card */}
        <Card 
          className="border-dashed border-2 hover:border-primary/50 cursor-pointer transition-colors"
          onClick={() => setShowCreateModal(true)}
        >
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[280px] text-muted-foreground hover:text-primary transition-colors">
            <Plus className="w-12 h-12 mb-4" />
            <h3 className="font-medium text-lg mb-2">Create New Project</h3>
            <p className="text-sm text-center">
              Start a new construction project and begin tracking progress
            </p>
          </CardContent>
        </Card>
      </div>

      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(projectId) => {
          onProjectSelect(projectId);
        }}
      />
    </div>
  );
};

export default ProjectPortfolioGrid;
