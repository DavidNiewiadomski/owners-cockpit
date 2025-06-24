
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ListTodo } from 'lucide-react';
import { useActionItems } from '@/hooks/useActionItems';
import { ActionItemsKanban } from '@/components/actionItems/ActionItemsKanban';
import { CreateActionItemModal } from '@/components/actionItems/CreateActionItemModal';
import { ActionItem } from '@/types/actionItems';

const ActionItemsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: actionItems = [], isLoading } = useActionItems(projectId || '');

  const openItems = actionItems.filter(item => item.status === 'Open');
  const inProgressItems = actionItems.filter(item => item.status === 'In Progress');
  const doneItems = actionItems.filter(item => item.status === 'Done');

  const openCount = openItems.length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ListTodo className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Action Items</h1>
          {openCount > 0 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {openCount} Open
            </Badge>
          )}
        </div>
        
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Action Item
        </Button>
      </div>

      <ActionItemsKanban
        openItems={openItems}
        inProgressItems={inProgressItems}
        doneItems={doneItems}
        projectId={projectId || ''}
      />

      <CreateActionItemModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        projectId={projectId || ''}
      />
    </div>
  );
};

export default ActionItemsPage;
