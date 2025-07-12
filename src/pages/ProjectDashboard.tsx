import React, { useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ProjectDashboard = () => {
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') || 'dashboard';
  const highlight = searchParams.get('highlight') || '';

  useEffect(() => {
    if (highlight) {
      toast.info(`Highlighting ${highlight} section`);
    }
  }, [highlight]);

  // Mock data
  const mockProject = {
    id: projectId,
    name: `Project ${projectId}`,
    status: 'Active',
    tasks: 15,
    budget: 1000000,
    safetyScore: 95,
  };

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">{mockProject.name} Dashboard</h1>
      <p>View: {view} | Highlight: {highlight}</p>
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Status: {mockProject.status}</p>
          <p>Tasks: {mockProject.tasks}</p>
          <p>Budget: ${mockProject.budget.toLocaleString()}</p>
          <p>Safety Score: {mockProject.safetyScore}%</p>
          <Button className="mt-4">View Details</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDashboard; 