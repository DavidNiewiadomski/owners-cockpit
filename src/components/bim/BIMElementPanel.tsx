
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { X, Link, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BIMElementPanelProps {
  element: any;
  projectId: string;
  onClose: () => void;
}

interface ElementBinding {
  id: string;
  binding_type: string;
  binding_id: string;
  metadata: any;
  binding_data?: any;
}

const BIMElementPanel: React.FC<BIMElementPanelProps> = ({ 
  element, 
  projectId, 
  onClose 
}) => {
  const [bindings, setBindings] = useState<ElementBinding[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadElementBindings();
  }, [element.id, projectId]);

  const loadElementBindings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('model_bindings')
        .select('*')
        .eq('project_id', projectId)
        .eq('element_id', element.id);

      if (error) throw error;

      // Load related data for each binding
      const bindingsWithData = await Promise.all(
        (data || []).map(async (binding) => {
          let bindingData = null;
          
          try {
            switch (binding.binding_type) {
              case 'task':
                const { data: taskData } = await supabase
                  .from('tasks')
                  .select('*')
                  .eq('id', binding.binding_id)
                  .single();
                bindingData = taskData;
                break;
              case 'budget_item':
                const { data: budgetData } = await supabase
                  .from('budget_items')
                  .select('*')
                  .eq('id', binding.binding_id)
                  .single();
                bindingData = budgetData;
                break;
              case 'rfi':
                const { data: rfiData } = await supabase
                  .from('rfi')
                  .select('*')
                  .eq('id', binding.binding_id)
                  .single();
                bindingData = rfiData;
                break;
              case 'safety_incident':
                const { data: safetyData } = await supabase
                  .from('safety_incidents')
                  .select('*')
                  .eq('id', binding.binding_id)
                  .single();
                bindingData = safetyData;
                break;
            }
          } catch (err) {
            console.warn(`Failed to load ${binding.binding_type} data:`, err);
          }

          return { ...binding, binding_data: bindingData };
        })
      );

      setBindings(bindingsWithData);
    } catch (error) {
      console.error('Failed to load element bindings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getBindingIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <Calendar className="w-4 h-4" />;
      case 'budget_item':
        return <DollarSign className="w-4 h-4" />;
      case 'rfi':
        return <AlertTriangle className="w-4 h-4" />;
      case 'safety_incident':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Link className="w-4 h-4" />;
    }
  };

  const getBindingColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-blue-100 text-blue-800';
      case 'budget_item':
        return 'bg-green-100 text-green-800';
      case 'rfi':
        return 'bg-yellow-100 text-yellow-800';
      case 'safety_incident':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatBindingTitle = (binding: ElementBinding) => {
    if (!binding.binding_data) return `${binding.binding_type} (${binding.binding_id.substring(0, 8)})`;
    
    switch (binding.binding_type) {
      case 'task':
        return binding.binding_data.name;
      case 'budget_item':
        return binding.binding_data.category;
      case 'rfi':
        return binding.binding_data.title;
      case 'safety_incident':
        return binding.binding_data.title;
      default:
        return binding.binding_type;
    }
  };

  const formatBindingDescription = (binding: ElementBinding) => {
    if (!binding.binding_data) return 'No details available';
    
    switch (binding.binding_type) {
      case 'task':
        return `Status: ${binding.binding_data.status} | Due: ${binding.binding_data.due_date || 'Not set'}`;
      case 'budget_item':
        return `Budgeted: $${binding.binding_data.budgeted_amount || 0} | Actual: $${binding.binding_data.actual_amount || 0}`;
      case 'rfi':
        return `Status: ${binding.binding_data.status} | Submitted by: ${binding.binding_data.submitted_by || 'Unknown'}`;
      case 'safety_incident':
        return `Severity: ${binding.binding_data.severity} | Date: ${binding.binding_data.incident_date}`;
      default:
        return binding.binding_data.description || 'No description';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="text-lg font-semibold">Element Details</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Element Information */}
        <Card className="p-4">
          <h4 className="font-medium mb-3">Element Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">{element.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Type:</span>
              <span>{element.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID:</span>
              <span className="font-mono text-xs">{element.id.substring(0, 8)}...</span>
            </div>
            {element.userData && Object.keys(element.userData).length > 0 && (
              <>
                <Separator className="my-3" />
                <h5 className="font-medium mb-2">Properties</h5>
                {Object.entries(element.userData).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="text-xs">{String(value)}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </Card>

        {/* Related Data */}
        <Card className="p-4">
          <h4 className="font-medium mb-3">Related Project Data</h4>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          ) : bindings.length > 0 ? (
            <div className="space-y-3">
              {bindings.map((binding) => (
                <div key={binding.id} className="border rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    {getBindingIcon(binding.binding_type)}
                    <Badge variant="secondary" className={getBindingColor(binding.binding_type)}>
                      {binding.binding_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <h5 className="font-medium text-sm mb-1">
                    {formatBindingTitle(binding)}
                  </h5>
                  <p className="text-xs text-muted-foreground">
                    {formatBindingDescription(binding)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Link className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No related project data found</p>
              <p className="text-xs">This element is not linked to any tasks, RFIs, or budget items</p>
            </div>
          )}
        </Card>

        {/* Actions */}
        <Card className="p-4">
          <h4 className="font-medium mb-3">Actions</h4>
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
              <Link className="w-4 h-4" />
              Link to Task
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
              <DollarSign className="w-4 h-4" />
              Link to Budget Item
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start gap-2">
              <AlertTriangle className="w-4 h-4" />
              Create RFI
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BIMElementPanel;
