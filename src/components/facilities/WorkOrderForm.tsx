
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateWorkOrder, WorkOrder } from '@/hooks/useFacilitiesData';

interface WorkOrderFormProps {
  projectId: string;
  onSuccess?: (workOrder: WorkOrder) => void;
  onCancel?: () => void;
}

const WorkOrderForm: React.FC<WorkOrderFormProps> = ({ projectId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    work_type: 'corrective',
    assigned_to: '',
    due_date: '',
    estimated_hours: '',
  });

  const createWorkOrder = useCreateWorkOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const workOrderData = {
        ...formData,
        project_id: projectId,
        status: 'open', // Add the required status field with default value
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : undefined,
        due_date: formData.due_date || undefined,
      };

      const newWorkOrder = await createWorkOrder.mutateAsync(workOrderData);
      
      if (onSuccess) {
        onSuccess(newWorkOrder);
      }
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        work_type: 'corrective',
        assigned_to: '',
        due_date: '',
        estimated_hours: '',
      });
    } catch (error) {
      console.error('Error creating work order:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create Work Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter work order title"
                required
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the work to be performed"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="work_type">Work Type</Label>
              <Select value={formData.work_type} onValueChange={(value) => handleInputChange('work_type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="preventive">Preventive</SelectItem>
                  <SelectItem value="corrective">Corrective</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assigned_to">Assigned To</Label>
              <Input
                id="assigned_to"
                value={formData.assigned_to}
                onChange={(e) => handleInputChange('assigned_to', e.target.value)}
                placeholder="Technician name"
              />
            </div>

            <div>
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={formData.due_date}
                onChange={(e) => handleInputChange('due_date', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="estimated_hours">Estimated Hours</Label>
              <Input
                id="estimated_hours"
                type="number"
                step="0.5"
                value={formData.estimated_hours}
                onChange={(e) => handleInputChange('estimated_hours', e.target.value)}
                placeholder="Hours"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={createWorkOrder.isPending}>
              {createWorkOrder.isPending ? 'Creating...' : 'Create Work Order'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkOrderForm;
