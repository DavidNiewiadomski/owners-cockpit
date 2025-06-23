
export function getActionColor(action: string): string {
  switch (action.toLowerCase()) {
    case 'insert':
    case 'create':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case 'update':
    case 'modify':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'delete':
    case 'remove':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
}

export function formatTableName(tableName: string): string {
  return tableName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function generateRecordLink(tableName: string, recordId: string | null, projectId: string): string | null {
  if (!recordId) return null;
  
  // Generate appropriate links based on table name
  switch (tableName) {
    case 'projects':
      return `/project/${recordId}`;
    case 'tasks':
      return `/project/${projectId}/tasks/${recordId}`;
    case 'documents':
      return `/project/${projectId}/documents/${recordId}`;
    case 'user_roles':
      return `/settings/access/${projectId}`;
    default:
      return null;
  }
}
