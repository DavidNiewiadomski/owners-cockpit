import { luxuryOfficeProject } from '@/data/sampleProjectData';

export interface DashboardTitleInfo {
  title: string;
  subtitle: string;
}

export const getDashboardTitle = (category: string, projectName?: string): DashboardTitleInfo => {
  // Map category names to proper dashboard titles
  const categoryTitleMap: Record<string, string> = {
    'Overview': 'Overview Dashboard',
    'Planning': 'Planning Dashboard',
    'Procurement': 'Procurement Dashboard',
    'Preconstruction': 'Preconstruction Dashboard',
    'Design': 'Design Dashboard',
    'Construction': 'Construction Dashboard',
    'Sustainability': 'Sustainability Dashboard',
    'Legal': 'Legal & Insurance Dashboard',
    'Finance': 'Finance Dashboard',
    'Facilities': 'Facilities Dashboard'
  };
  
  // Get the proper title or fallback to "[category] Dashboard"
  const title = categoryTitleMap[category] || `${category} Dashboard`;
  
  // Subtitle shows either Portfolio Overview or selected project name
  const subtitle = projectName || 'Portfolio Overview';
  
  return { title, subtitle };
};

export const getCategoryDisplayName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'Overview': 'Overview',
    'Planning': 'Planning',
    'Procurement': 'Procurement',
    'Design': 'Design',
    'Preconstruction': 'Preconstruction',
    'Construction': 'Construction',
    'Sustainability': 'Sustainability',
    'Legal': 'Legal & Insurance',
    'Finance': 'Finance',
    'Facilities': 'Facilities'
  };
  
  return categoryMap[category] || category;
};

export const getProjectBadges = (projectId: string) => {
  if (projectId === 'portfolio') {
    return [
      { icon: 'Building', text: 'Multiple Projects' },
      { icon: 'DollarSign', text: 'Portfolio View' }
    ];
  }
  
  // Return project-specific badges
  const project = luxuryOfficeProject;
  return [
    { icon: 'Building', text: `${project.basicInfo.floors} Floors` },
    { icon: 'DollarSign', text: `${(project.financial.totalBudget / 1000000).toFixed(1)}M Budget` }
  ];
};
