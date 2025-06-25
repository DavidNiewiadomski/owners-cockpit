import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plus, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (projectId: string) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'planning' as const,
    source: 'manual',
    start_date: null as Date | null,
    end_date: null as Date | null
  });
  
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleDateChange = (field: 'start_date' | 'end_date', date: Date | undefined) => {
    setFormData(prev => ({ ...prev, [field]: date || null }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Project name is required');
      return false;
    }
    
    if (formData.start_date && formData.end_date && formData.start_date > formData.end_date) {
      setError('End date must be after start date');
      return false;
    }
    
    return true;
  };

  const handleCreate = async () => {
    if (!validateForm() || !user) return;

    setIsCreating(true);
    setError(null);

    try {
      const projectData = {
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        source: formData.source,
        start_date: formData.start_date ? format(formData.start_date, 'yyyy-MM-dd') : null,
        end_date: formData.end_date ? format(formData.end_date, 'yyyy-MM-dd') : null,
        owner_id: user.id,
      };

      const { data, error: createError } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (createError) throw createError;

      // Create user-project relationship
      const { error: relationError } = await supabase
        .from('user_projects')
        .insert({
          user_id: user.id,
          project_id: data.id,
          role: 'owner'
        });

      if (relationError) throw relationError;

      // Invalidate projects query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['projects'] });

      toast({
        title: 'Project Created',
        description: `${formData.name} has been created successfully.`,
      });

      if (onSuccess) {
        onSuccess(data.id);
      }

      handleClose();
    } catch (err) {
      console.error('Failed to create project:', err);
      setError(err instanceof Error ? err.message : 'Failed to create project');
      
      toast({
        title: 'Creation Failed',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      status: 'planning',
      source: 'manual',
      start_date: null,
      end_date: null
    });
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create New Project
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="project-name">Project Name *</Label>
            <Input
              id="project-name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter project name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter project description"
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label>Project Status</Label>
            <Select value={formData.status} onValueChange={(value: any) => handleInputChange('status', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="closeout">Closeout</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !formData.start_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? format(formData.start_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date || undefined}
                    onSelect={(date) => handleDateChange('start_date', date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !formData.end_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date ? format(formData.end_date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.end_date || undefined}
                    onSelect={(date) => handleDateChange('end_date', date)}
                    initialFocus
                    disabled={(date) =>
                      formData.start_date ? date < formData.start_date : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-red-700">
              <AlertCircle className="w-4 h-4" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!formData.name.trim() || isCreating}
              className="gap-2"
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectModal;
