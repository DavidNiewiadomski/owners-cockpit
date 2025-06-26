import { luxuryOfficeProject } from '@/data/sampleProjectData';

export interface DashboardTitleInfo {
  title: string;
  subtitle: string;
}

export const getDashboardTitle = (category: string, projectName?: string): DashboardTitleInfo => {
  // Always show "[Tab Name] Dashboard" as the main title
  const title = `${category} Dashboard`;
  
  // Subtitle shows either Portfolio Overview or selected project name
  const subtitle = projectName || 'Portfolio Overview';
  
  return { title, subtitle };
};

export const getCategoryDisplayName = (category: string): string => {
  const categoryMap: Record<string, string> = {
    'Overview': 'Overview',
    'Planning': 'Planning',
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
