import { luxuryOfficeProject } from '@/data/sampleProjectData';

export interface DashboardTitleInfo {
  title: string;
  subtitle: string;
}

export const getDashboardTitle = (category: string, projectId: string): DashboardTitleInfo => {
  // Determine if we're in portfolio or project view
  const isPortfolio = projectId === 'portfolio';
  
  // Get project name if not portfolio
  const projectName = isPortfolio ? null : luxuryOfficeProject.name;
  const projectDescription = isPortfolio ? null : luxuryOfficeProject.description;
  
  // Generate title based on category
  let title: string;
  let subtitle: string;
  
  if (isPortfolio) {
    title = `Portfolio ${category}`;
    subtitle = 'All Projects • Portfolio Management & Analytics';
  } else {
    title = `${category} Dashboard`;
    subtitle = `${projectName} • ${projectDescription}`;
  }
  
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
