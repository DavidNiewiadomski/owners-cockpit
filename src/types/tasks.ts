
export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  completedDate?: Date;
  progress: number; // 0-100
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  projectId: string;
  dependencies?: string[];
  isLate?: boolean;
}

export interface TasksResponse {
  tasks: Task[];
  totalCount: number;
}
