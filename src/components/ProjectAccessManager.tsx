
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGrantProjectAccess, useUserProjects } from '@/hooks/useUserProjects';
import { toast } from 'sonner';

interface ProjectAccessManagerProps {
  projectId: string;
}

export function ProjectAccessManager({ projectId }: ProjectAccessManagerProps) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: userProjects } = useUserProjects();
  const _grantAccess = useGrantProjectAccess();

  const currentProject = userProjects?.find(up => up.project_id === projectId);

  const handleGrantAccess = async () => {
    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsLoading(true);
    try {
      // Note: In a real app, you'd need to look up the user by email first
      // For now, this is a placeholder for the grant access functionality
      toast.info('Access management requires additional implementation for user lookup by email');
    } catch (_error) {
      toast.error('Failed to grant access');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentProject) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don't have access to this project.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Access</CardTitle>
        <CardDescription>
          Manage who can access "{currentProject.project.name}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Grant access to user (by email)</Label>
          <div className="flex space-x-2">
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              onClick={handleGrantAccess} 
              disabled={isLoading}
            >
              {isLoading ? 'Granting...' : 'Grant Access'}
            </Button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600">
          <p><strong>Your role:</strong> {currentProject.role}</p>
          <p><strong>Project status:</strong> {currentProject.project.status}</p>
        </div>
      </CardContent>
    </Card>
  );
}
