import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  // Mock data to look live
  const mockProjects = [
    { id: '1', name: 'Project A', status: 'Active' },
    { id: '2', name: 'Project B', status: 'Planning' },
  ];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">General Dashboard</h1>
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {mockProjects.map(project => (
              <li key={project.id} className="mb-2">
                {project.name} - {project.status}
              </li>
            ))}
          </ul>
          <Button className="mt-4">Load More Projects</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard; 