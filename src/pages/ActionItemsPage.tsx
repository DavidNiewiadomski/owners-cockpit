
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ListTodo, FileText, CheckCircle2, DollarSign } from 'lucide-react';
import { useActionItems } from '@/hooks/useActionItems';
import { ActionItemsKanban } from '@/components/actionItems/ActionItemsKanban';
import { CreateActionItemModal } from '@/components/actionItems/CreateActionItemModal';

const ActionItemsPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchParams] = useSearchParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: actionItems = [], isLoading } = useActionItems(projectId || '');
  
  // Get filter type from query parameters (supports both 'type' and 'filter' for compatibility)
  const filterType = searchParams.get('type') || searchParams.get('filter') || 'all';
  const division = searchParams.get('division');

  // Filter items based on type and division
  const filteredItems = actionItems.filter(item => {
    // First filter by type
    let matchesType = true;
    if (filterType !== 'all') {
      if (filterType === 'change-orders') matchesType = item.type === 'change-order';
      else if (filterType === 'approvals') matchesType = item.type === 'approval';
      else if (filterType === 'draw-requests') matchesType = item.type === 'draw-request';
    }
    
    // Then filter by division if specified
    let matchesDivision = true;
    if (division) {
      // Assuming items have a division property or metadata
      matchesDivision = item.division === division || item.metadata?.division === division;
    }
    
    return matchesType && matchesDivision;
  });

  const openItems = filteredItems.filter(item => item.status === 'Open');
  const inProgressItems = filteredItems.filter(item => item.status === 'In Progress');
  const doneItems = filteredItems.filter(item => item.status === 'Done');

  const openCount = openItems.length;
  
  // Get title and icon based on filter type
  const getPageDetails = () => {
    let baseDetails = { title: 'Action Items', icon: <ListTodo className="h-6 w-6 text-primary" /> };
    
    switch (filterType) {
      case 'change-orders':
        baseDetails = { title: 'Change Orders', icon: <FileText className="h-6 w-6 text-primary" /> };
        break;
      case 'approvals':
        baseDetails = { title: 'Pending Approvals', icon: <CheckCircle2 className="h-6 w-6 text-primary" /> };
        break;
      case 'draw-requests':
        baseDetails = { title: 'Draw Requests', icon: <DollarSign className="h-6 w-6 text-primary" /> };
        break;
    }
    
    // Add division suffix if specified
    if (division === '1') {
      baseDetails.title = `Division 1 ${baseDetails.title}`;
    }
    
    return baseDetails;
  };
  
  const { title, icon } = getPageDetails();

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
          {icon}
          <h1 className="text-2xl font-bold">{title}</h1>
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
