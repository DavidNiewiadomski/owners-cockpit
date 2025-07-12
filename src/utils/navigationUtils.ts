import { toast } from 'sonner';

/**
 * Safely navigate with projectId validation
 * @param router - Router instance from useRouter hook
 * @param path - The path to navigate to
 * @param projectId - The project ID (may be null/undefined)
 * @param options - Additional options for navigation
 */
export const navigateWithProjectId = (
  router: { push: (path: string) => void },
  path: string,
  projectId: string | null | undefined,
  options?: {
    fallbackMessage?: string;
    allowPortfolio?: boolean;
    additionalParams?: Record<string, string>;
  }
) => {
  const { 
    fallbackMessage = 'Please select a project first to use this feature', 
    allowPortfolio = false,
    additionalParams = {}
  } = options || {};

  // Check if we should navigate
  if (!shouldNavigate(projectId, allowPortfolio)) {
    handleNoProjectNavigation(fallbackMessage);
    return;
  }

  // Build the URL with valid projectId
  const params = new URLSearchParams();
  
  // Only add projectId if it's valid
  if (projectId && projectId !== 'null' && projectId !== 'undefined') {
    params.append('projectId', projectId);
  }
  
  // Add any additional parameters
  Object.entries(additionalParams).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });

  const queryString = params.toString();
  const fullPath = queryString ? `${path}?${queryString}` : path;

  router.push(fullPath);
};

/**
 * Check if navigation should proceed based on projectId
 */
export const shouldNavigate = (
  projectId: string | null | undefined,
  allowPortfolio: boolean = false
): boolean => {
  // If portfolio view is allowed, we can always navigate
  if (allowPortfolio) return true;
  
  // Otherwise, we need a valid projectId
  return !!(projectId && projectId !== 'null' && projectId !== 'undefined' && projectId !== 'portfolio');
};

/**
 * Handle navigation when no project is selected
 */
export const handleNoProjectNavigation = (message: string = 'Please select a project first') => {
  toast.warning(message, {
    description: 'Navigate to a specific project to access this feature',
    duration: 4000,
  });
};

/**
 * Get a valid project ID or show warning
 */
export const getValidProjectId = (
  projectId: string | null | undefined,
  isPortfolioView: boolean = false
): string | null => {
  if (isPortfolioView || !projectId || projectId === 'portfolio' || projectId === 'null' || projectId === 'undefined') {
    return null;
  }
  return projectId;
};