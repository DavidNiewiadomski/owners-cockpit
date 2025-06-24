
export interface ActionItem {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  status: 'Open' | 'In Progress' | 'Done';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  due_date?: string;
  assignee?: string;
  source_type?: string;
  source_id?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateActionItemData {
  title: string;
  description?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  due_date?: string;
  assignee?: string;
  source_type?: string;
  source_id?: string;
}

export interface UpdateActionItemData extends Partial<CreateActionItemData> {
  status?: 'Open' | 'In Progress' | 'Done';
}
