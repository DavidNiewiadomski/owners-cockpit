import React, { useState, useEffect } from 'react';
import AIInsightsPanel from './division1/AIInsightsPanel';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle
} from '@/components/ui/sheet';
import { 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  FileText, 
  Upload, 
  Download, 
  RefreshCw, 
  MessageSquare, 
  Calendar,
  Users,
  AlertCircle,
  Eye,
  CheckSquare,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  Zap,
  Target,
  BarChart3,
  Loader2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import type { Division1Section } from '@/hooks/useDivision1Data';
import { useDivision1Data } from '@/hooks/useDivision1Data';
import { useAppState } from '@/hooks/useAppState';
import { useRouter } from '@/hooks/useRouter';
import { toast as sonnerToast } from 'sonner';
import { navigateWithProjectId, getValidProjectId } from '@/utils/navigationUtils';
import { useProjects } from '@/hooks/useProjects';
import { AutonomousAgent } from '@/lib/ai/autonomous-agent';

// Real Division 1 data types are imported from useDivision1Data hook
type FilterType = 'all' | 'overdue' | 'pending' | 'completed' | 'in_progress';

const Division1Dashboard: React.FC = () => {
  const router = useRouter();
  const { selectedProject } = useAppState();
  const { data: projects } = useProjects();
  
  // Get project ID for navigation
  const projectId = selectedProject ?? 'portfolio';
  const isPortfolioView = projectId === 'portfolio';

  // Get real data from hook - for portfolio view, use first active project
  const effectiveProjectId = isPortfolioView ? (projects?.[0]?.id || null) : projectId;
  const { sections: realSections, loading: isLoading, error } = useDivision1Data(effectiveProjectId);

  // Use real data if available, otherwise use demo data
  const sections: Division1Section[] = realSections && realSections.length > 0 ? realSections : [
    {
      id: '1',
      project_id: 'proj1',
      section_number: '01 10 00',
      title: 'Summary',
      status: 'completed',
      due_date: '2024-12-15',
      docs_on_file: 8,
      required_docs: 8,
      priority: 'high',
      completion_percentage: 100.0,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-12-15T00:00:00Z'
    },
    {
      id: '2',
      project_id: 'proj1',
      section_number: '01 20 00',
      title: 'Price and Payment Procedures',
      status: 'in_progress',
      due_date: '2025-01-30',
      docs_on_file: 12,
      required_docs: 15,
      priority: 'high',
      completion_percentage: 80.0,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2025-01-25T00:00:00Z'
    },
    {
      id: '3',
      project_id: 'proj1',
      section_number: '01 30 00',
      title: 'Administrative Requirements',
      status: 'in_progress',
      due_date: '2025-01-15',
      docs_on_file: 18,
      required_docs: 22,
      priority: 'medium',
      completion_percentage: 81.8,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2025-01-10T00:00:00Z'
    },
    {
      id: '4',
      project_id: 'proj1',
      section_number: '01 40 00',
      title: 'Quality Requirements',
      status: 'pending',
      due_date: '2025-02-15',
      docs_on_file: 5,
      required_docs: 12,
      priority: 'high',
      completion_percentage: 41.7,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-12-20T00:00:00Z'
    },
    {
      id: '5',
      project_id: 'proj1',
      section_number: '01 50 00',
      title: 'Temporary Facilities and Controls',
      status: 'completed',
      due_date: '2024-12-01',
      docs_on_file: 14,
      required_docs: 14,
      priority: 'medium',
      completion_percentage: 100.0,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-12-01T00:00:00Z'
    },
    {
      id: '6',
      project_id: 'proj1',
      section_number: '01 60 00',
      title: 'Product Requirements',
      status: 'in_progress',
      due_date: '2025-01-20',
      docs_on_file: 9,
      required_docs: 16,
      priority: 'medium',
      completion_percentage: 56.3,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2025-01-05T00:00:00Z'
    },
    {
      id: '7',
      project_id: 'proj1',
      section_number: '01 70 00',
      title: 'Execution and Closeout Requirements',
      status: 'pending',
      due_date: '2025-03-01',
      docs_on_file: 3,
      required_docs: 18,
      priority: 'high',
      completion_percentage: 16.7,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-11-30T00:00:00Z'
    },
    {
      id: '8',
      project_id: 'proj1',
      section_number: '01 80 00',
      title: 'Performance Requirements',
      status: 'pending',
      due_date: '2025-02-28',
      docs_on_file: 2,
      required_docs: 10,
      priority: 'medium',
      completion_percentage: 20.0,
      created_at: '2024-01-15T00:00:00Z',
      updated_at: '2024-12-10T00:00:00Z'
    }
  ];

  // Calculate summary metrics
  const totalSections = sections.length;
  const completedSections = sections.filter(s => s.status === 'completed').length;
  const pendingSections = sections.filter(s => s.status === 'pending').length;
  const overdueSections = sections.filter(s => {
    if (!s.due_date) return false;
    const dueDate = new Date(s.due_date);
    const today = new Date();
    return dueDate < today && s.status !== 'completed';
  }).length;

  const totalDocs = sections.reduce((sum, s) => sum + s.required_docs, 0);
  const docsOnFile = sections.reduce((sum, s) => sum + s.docs_on_file, 0);
  const missingDocs = totalDocs - docsOnFile;
  const overallCompliance = Math.round((completedSections / totalSections) * 100);
  const criticalIssues = 3;

  const summary = {
    totalSections,
    completedSections,
    pendingSections,
    overdueSections,
    totalDocs,
    docsOnFile,
    missingDocs,
    overallCompliance,
    criticalIssues,
    totalBudget: 1250000,
    actualSpent: 980000,
    remainingBudget: 270000,
    budgetVariance: 12.0,
    nextDeadline: {
      sectionNumber: '01 30 00',
      title: 'Administrative Requirements',
      daysUntil: 14
    }
  };

  // States (single block)
  const [selectedSection, setSelectedSection] = useState<Division1Section | null>(null);
  const [isIssueDrawerOpen, setIsIssueDrawerOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sectionNotes, setSectionNotes] = useState<Record<string, string[]>>({});
  const [uploadedDocuments, setUploadedDocuments] = useState<string[]>([]);
  const [localDocsOnFile, setLocalDocsOnFile] = useState<number>(docsOnFile);

  const handleSectionClick = (section: Division1Section) => {
    setSelectedSection(section);
    setIsIssueDrawerOpen(true);
  };

  const handleResolveIssue = async (issueId: string) => {
    toast({
      title: "Issue Resolved",
      description: "Issue has been marked as resolved.",
    });
  };

  // Modular upload function
  const performUpload = async (files: FileList | null, sectionId?: string) => {
    try {
      if (!files || files.length === 0) return;
      const newDocs = Array.from(files).filter(file =>
        ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/png', 'image/jpeg'].includes(file.type)
      ).map(file => file.name);
      if (newDocs.length !== files.length) throw new Error('Invalid file type');
      setUploadedDocuments((prev: string[]) => [...prev, ...newDocs]);
      setLocalDocsOnFile((prev: number) => prev + newDocs.length);
      if (sectionId) {
        const sectionIndex = sections.findIndex(s => s.id === sectionId);
        if (sectionIndex !== -1) sections[sectionIndex].docs_on_file += newDocs.length;
      }
      sonnerToast.success(`${newDocs.length} documents uploaded`);
    } catch (error) {
      sonnerToast.error('Upload failed: ' + (error as Error).message);
    }
  };

  const handleSheetUploadDocuments = () => {
    if (!selectedSection) return;
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg';
    fileInput.onchange = (e) => performUpload((e.target as HTMLInputElement).files, selectedSection.id);
    fileInput.click();
  };

  const handleAddNote = () => {
    if (!selectedSection) return;
    
    const note = prompt('Add a note for this section:');
    if (note && note.trim()) {
      setSectionNotes(prev => ({
        ...prev,
        [selectedSection.id]: [...(prev[selectedSection.id] || []), note.trim()]
      }));
      sonnerToast.success('Note added successfully');
    }
  };

  const handleMarkAsComplete = () => {
    if (!selectedSection) return;
    
    sonnerToast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          // Update the section status
          const sectionIndex = sections.findIndex(s => s.id === selectedSection.id);
          if (sectionIndex !== -1) {
            sections[sectionIndex].status = 'completed';
            sections[sectionIndex].completion_percentage = 100;
          }
          setSelectedSection({...selectedSection, status: 'completed', completion_percentage: 100});
          resolve(`${selectedSection.title} marked as complete`);
        }, 1000);
      }),
      {
        loading: 'Marking section as complete...',
        success: (msg) => {
          setIsIssueDrawerOpen(false);
          return msg as string;
        },
        error: 'Failed to mark as complete'
      }
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_review': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in_progress': return <Eye className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'overdue': return <AlertTriangle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'pending': return 'outline';
      case 'overdue': return 'destructive';
      default: return 'outline';
    }
  };

  // Calculate if section is overdue
  const getSectionStatus = (section: Division1Section) => {
    if (section.status === 'completed') return 'completed';
    if (!section.due_date) return section.status;
    const dueDate = new Date(section.due_date);
    const today = new Date();
    return dueDate < today ? 'overdue' : section.status;
  };

  // Filter and sort sections based on filter
  const filteredSections = filter === 'all' ? sections : sections.filter(section => {
    const status = getSectionStatus(section);
    return status === filter;
  });
  
  const sortedSections = filteredSections.sort((a, b) => {
    const statusA = getSectionStatus(a);
    const statusB = getSectionStatus(b);
    if (statusA === 'overdue' && statusB !== 'overdue') return -1;
    if (statusB === 'overdue' && statusA !== 'overdue') return 1;
    return a.section_number.localeCompare(b.section_number);
  });

  // Button click handlers
  const handleReviewComplianceReport = () => {
    const validProjectId = getValidProjectId(projectId, isPortfolioView);
    if (!validProjectId && !isPortfolioView) {
      sonnerToast.warning('Please select a project to review compliance reports', {
        description: 'Navigate to a specific project to access this feature',
        duration: 4000,
      });
      return;
    }
    
    // Switch to Legal tab in the dashboard
    sessionStorage.setItem('activeCategory', 'Legal');
    sessionStorage.setItem('legalView', 'compliance-report');
    window.dispatchEvent(new CustomEvent('activeCategoryChange', { detail: 'Legal' }));
    sonnerToast.success('Opening compliance report dashboard');
  };

  const handleScheduleMeeting = () => {
    sonnerToast.info('Opening calendar to schedule Division 1 meeting');
    window.open('https://calendar.google.com/calendar/u/0/r/eventedit?text=Division+1+Compliance+Meeting', '_blank');
  };

  const handleApproveChanges = () => {
    const validProjectId = getValidProjectId(projectId, isPortfolioView);
    if (!validProjectId && !isPortfolioView) {
      sonnerToast.warning('Please select a project to approve changes', {
        description: 'Navigate to a specific project to access this feature',
        duration: 4000,
      });
      return;
    }
    
    // Navigate to action-items page with division filter
    navigateWithProjectId(
      router,
      '/action-items',
      validProjectId,
      {
        allowPortfolio: true,
        additionalParams: { type: 'approvals', division: '1' },
        fallbackMessage: 'Please select a project to view Division 1 approvals'
      }
    );
    if (validProjectId) {
      sonnerToast.info('Navigating to pending Division 1 approvals');
    }
  };

  // Enhanced download with real blob
  const handleDownloadReport = async () => {
    try {
      const reportContent = JSON.stringify(summary, null, 2);
      const blob = new Blob([reportContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'division1_report.json';
      link.click();
      URL.revokeObjectURL(url);
      sonnerToast.success('Report downloaded');
    } catch (error) {
      sonnerToast.error('Download failed');
    }
  };

  const handleUploadDocument = () => {
    const validProjectId = getValidProjectId(projectId, isPortfolioView);
    if (!validProjectId && !isPortfolioView) {
      sonnerToast.warning('Please select a project to upload documents', { description: 'Navigate to a specific project to access this feature', duration: 4000 });
      return;
    }
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg';
    fileInput.onchange = (e) => performUpload((e.target as HTMLInputElement).files);
    fileInput.click();
  };

  const handleGenerateDivision1Report = async () => {
    try {
      const reportContent = JSON.stringify(sections, null, 2);
      const blob = new Blob([reportContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'full_division1_report.json';
      link.click();
      URL.revokeObjectURL(url);
      sonnerToast.success('Report generated and downloaded');
    } catch (error) {
      sonnerToast.error('Generation failed');
    }
  };

  // Loading state
  if (isLoading && (!sections || sections.length === 0)) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading Division 1 data...</span>
        </div>
      </div>
    );
  }

  // Trigger agent for proactive compliance check
  useEffect(() => {
    const agent = new AutonomousAgent('user', projectId);
    agent.operate('Check compliance risks', 'autonomous');
  }, [projectId]);

  return (
    <div className="p-6 space-y-6">
      {/* AI Insights Panel */}
      <AIInsightsPanel projectData={{
        name: selectedProject ? projects?.find(p => p.id === selectedProject)?.name ?? `Project ${selectedProject}` : 'Portfolio',
        compliancePercent: summary.overallCompliance,
        overdueItems: summary.overdueSections,
        missingDocs: summary.missingDocs,
        daysUntilNextDeadline: summary.nextDeadline?.daysUntil || 0,
        sectionsCompliant: summary.completedSections,
        totalSections: summary.totalSections,
        criticalAlerts: [
          { id: '1', description: `${summary.criticalIssues} high-priority issues requiring attention` },
          { id: '2', description: `${summary.overdueSections} sections are overdue` },
          { id: '3', description: `${summary.missingDocs} documents missing from compliance records` }
        ],
        upcomingDeadlines: summary.nextDeadline ? [
          { 
            id: '1', 
            title: `${summary.nextDeadline.sectionNumber} - ${summary.nextDeadline.title}`, 
            daysUntil: summary.nextDeadline.daysUntil 
          }
        ] : []
      }} />

      {/* Owner Quick Actions */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Division 1 Owner Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleReviewComplianceReport}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Review Compliance Report
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleScheduleMeeting}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleApproveChanges}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Changes
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleDownloadReport}
            >
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleUploadDocument}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
            <Button 
              variant="outline" 
              className="justify-start border-border hover:bg-accent text-foreground hover:text-accent-foreground"
              onClick={handleGenerateDivision1Report}
            >
              <Target className="w-4 h-4 mr-2" />
              Generate Division 1 Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Header KPI Strip - Different metrics from AI Insights */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 transition-all duration-300">
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center p-6">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <h3 className="text-sm font-medium text-muted-foreground">Budget Impact</h3>
            </div>
            <span className="text-3xl font-bold text-green-600">${(summary.totalBudget / 1000000).toFixed(2)}M</span>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <h3 className="text-sm font-medium text-muted-foreground">Budget Utilized</h3>
            </div>
            <span className="text-3xl font-bold text-blue-600">{((summary.actualSpent / summary.totalBudget) * 100).toFixed(1)}%</span>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center p-6">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-purple-500" />
              <h3 className="text-sm font-medium text-muted-foreground">Pending Sections</h3>
            </div>
            <span className="text-3xl font-bold text-purple-600">{summary.pendingSections}</span>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="flex flex-col items-center p-6">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-5 w-5 text-orange-500" />
              <h3 className="text-sm font-medium text-muted-foreground">Critical Issues</h3>
            </div>
            <span className="text-3xl font-bold text-orange-600">{summary.criticalIssues}</span>
          </CardContent>
        </Card>
      </div>

      {/* Horizontal Progress Bar */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold">Division 1 Completion</h4>
            <Badge variant="outline">{summary.completedSections} / {summary.totalSections} sections compliant</Badge>
          </div>
          <div className="space-y-2">
            <Progress value={summary.overallCompliance} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>0%</span>
            <span className="font-medium text-[#4FB0FF]">{summary.overallCompliance}%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing and Payments Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <DollarSign className="h-5 w-5 text-green-500" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Progress Billing #2</p>
                  <p className="text-sm text-muted-foreground">General Contractor • Jun 28, 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">+$500,000</p>
                  <Badge variant="outline" className="text-xs">Completed</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Division 1 Admin Fee</p>
                  <p className="text-sm text-muted-foreground">Project Management • Jul 1, 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-600">$75,000</p>
                  <Badge variant="secondary" className="text-xs">Pending</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-foreground">Steel Supplier Payment</p>
                  <p className="text-sm text-muted-foreground">ABC Steel Corp • Jun 25, 2025</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-600">-$250,000</p>
                  <Badge variant="destructive" className="text-xs">Pending</Badge>
                </div>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 border-border hover:bg-accent">
              <FileText className="w-4 h-4 mr-2" />
              View All Transactions
            </Button>
          </CardContent>
        </Card>

        {/* Cash Flow Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              Monthly Cash Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={[
                { month: 'May', inflow: 3200000, outflow: 3100000 },
                { month: 'Jun', inflow: 3000000, outflow: 2750000 },
                { month: 'Jul', inflow: 2800000, outflow: 2900000 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${(value as number).toLocaleString()}`} />
                <Line type="monotone" dataKey="inflow" stroke="#10b981" strokeWidth={2} name="Cash Inflow" />
                <Line type="monotone" dataKey="outflow" stroke="#ef4444" strokeWidth={2} name="Cash Outflow" />
              </LineChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Net Cash Flow (Jun)</p>
                <p className="text-lg font-semibold text-green-600">+$250,000</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Cumulative</p>
                <p className="text-lg font-semibold text-blue-600">$350,000</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status and Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Payment Status */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Shield className="h-5 w-5 text-purple-500" />
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Invoices Pending</span>
                <Badge variant="secondary">3</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Amount Pending</span>
                <span className="font-semibold text-amber-600">$325,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Overdue Payments</span>
                <span className="font-semibold text-red-600">$0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Next Payment Due</span>
                <span className="font-semibold text-blue-600">Jul 5</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Budget Impact */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <BarChart3 className="h-5 w-5 text-orange-500" />
              Division 1 Budget Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Budget</span>
                <span className="font-semibold text-foreground">$1,250,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Spent to Date</span>
                <span className="font-semibold text-blue-600">$980,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Remaining Budget</span>
                <span className="font-semibold text-green-600">$270,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Budget Variance</span>
                <span className="font-semibold text-red-600">+12.0%</span>
              </div>
            </div>
            <Progress value={78.4} className="h-2 mt-4" />
            <p className="text-xs text-muted-foreground mt-2">78.4% of budget utilized</p>
          </CardContent>
        </Card>

        {/* Risk Indicators */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Financial Risk Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Cash Flow Risk</span>
                <Badge variant="secondary">Low</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Budget Overrun Risk</span>
                <Badge variant="destructive">Medium</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Payment Delay Risk</span>
                <Badge variant="outline">Low</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Overall Risk Score</span>
                <span className="font-semibold text-orange-600">2.3/5</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Pills */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Section Status</h3>
        <div className="flex gap-2">
          {(['all', 'overdue', 'pending', 'completed', 'in_progress'] as FilterType[]).map((filterOption) => (
            <Button
              key={filterOption}
              variant={filter === filterOption ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterOption)}
              className="capitalize"
            >
              {filterOption === 'all' ? 'All' : filterOption}
            </Button>
          ))}
        </div>
      </div>

      {/* Section Status Table */}
      <Card className="bg-card border-border">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Section #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Docs On File</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSections.map((section) => (
                <TableRow 
                  key={section.id} 
                  className="hover:bg-muted/50 cursor-pointer" 
                  onClick={() => handleSectionClick(section)}
                >
                  <TableCell className="font-medium">{section.section_number}</TableCell>
                  <TableCell>{section.title}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(getSectionStatus(section))} className="flex items-center gap-1">
                      {getStatusIcon(getSectionStatus(section))}
                      {getSectionStatus(section)}
                    </Badge>
                  </TableCell>
                  <TableCell>{section.due_date ? new Date(section.due_date).toLocaleDateString() : 'N/A'}</TableCell>
                  <TableCell>✅ {section.docs_on_file} / {section.required_docs}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      View Issues
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>

      {/* Issue Sheet */}
      <Sheet open={isIssueDrawerOpen} onOpenChange={setIsIssueDrawerOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Issues for Section {selectedSection?.section_number}</SheetTitle>
            <SheetDescription>
              Review and manage issues for {selectedSection?.title}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {/* Section Details */}
            <div className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Status</span>
                {selectedSection && (
                  <Badge variant={getStatusBadgeVariant(getSectionStatus(selectedSection))} className="flex items-center gap-1">
                    {getStatusIcon(getSectionStatus(selectedSection))}
                    {getSectionStatus(selectedSection)}
                  </Badge>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Due Date</span>
                <span className="font-medium">{selectedSection?.due_date ? new Date(selectedSection.due_date).toLocaleDateString() : 'Not set'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Documents</span>
                <span className="font-medium">{selectedSection?.docs_on_file} / {selectedSection?.required_docs}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Progress</span>
                <span className="font-medium">{selectedSection?.completion_percentage.toFixed(1)}%</span>
              </div>
            </div>

            {/* Related Issues */}
            <div>
              <h5 className="font-semibold mb-2">Related Issues</h5>
              {selectedSection?.priority === 'high' ? (
                <div className="space-y-2">
                  <div className="p-3 border border-amber-200 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-400">Documentation Review Pending</p>
                    <p className="text-xs text-amber-700 dark:text-amber-500">Awaiting approval from project stakeholders</p>
                  </div>
                  {selectedSection.completion_percentage < 50 && (
                    <div className="p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
                      <p className="text-sm font-medium text-red-800 dark:text-red-400">Compliance Gap Identified</p>
                      <p className="text-xs text-red-700 dark:text-red-500">Section requires additional documentation to meet standards</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No critical issues identified for this section.</p>
              )}
            </div>
            
            {/* Actions */}
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleSheetUploadDocuments}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Documents
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleAddNote}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Note
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handleMarkAsComplete}
                disabled={selectedSection?.status === 'completed'}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {selectedSection?.status === 'completed' ? 'Already Complete' : 'Mark as Complete'}
              </Button>
            </div>
            
            {/* Notes Section */}
            {selectedSection && sectionNotes[selectedSection.id]?.length > 0 && (
              <div className="mt-4">
                <h5 className="font-semibold mb-2">Notes</h5>
                <div className="space-y-2">
                  {sectionNotes[selectedSection.id].map((note, index) => (
                    <div key={index} className="p-2 bg-muted rounded-lg">
                      <p className="text-sm">{note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>


      {/* Alerts & Upcoming */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.criticalIssues > 0 && (
                <div className="p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <p className="text-sm text-red-800 dark:text-red-400">
                    {summary.criticalIssues} high-priority issues requiring immediate attention
                  </p>
                </div>
              )}
              {summary.overdueSections > 0 && (
                <div className="p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <p className="text-sm text-red-800 dark:text-red-400">
                    {summary.overdueSections} sections are overdue and need immediate action
                  </p>
                </div>
              )}
              {summary.missingDocs > 0 && (
                <div className="p-3 border border-amber-200 rounded-lg bg-amber-50 dark:bg-amber-950/20">
                  <p className="text-sm text-amber-800 dark:text-amber-400">
                    {summary.missingDocs} documents are missing from compliance records
                  </p>
                </div>
              )}
              {summary.criticalIssues === 0 && summary.overdueSections === 0 && summary.missingDocs === 0 && (
                <p className="text-sm text-muted-foreground">No critical alerts at this time.</p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Calendar className="h-5 w-5 text-blue-500" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.nextDeadline ? (
                <div className="p-3 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <p className="font-medium text-blue-900 dark:text-blue-400">
                    {summary.nextDeadline.sectionNumber} - {summary.nextDeadline.title}
                  </p>
                  <p className="text-sm text-blue-700 dark:text-blue-500">
                    Due in {summary.nextDeadline.daysUntil} days
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
              )}
              
              {/* Show additional sections with near deadlines */}
              {sections.filter(s => {
                if (!s.due_date || s.status === 'completed') return false;
                const dueDate = new Date(s.due_date);
                const today = new Date();
                const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return daysUntil > 0 && daysUntil <= 14; // Next 14 days
              }).slice(0, 3).map((section) => {
                const dueDate = new Date(section.due_date!);
                const today = new Date();
                const daysUntil = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <div key={section.id} className="p-3 border border-border rounded-lg">
                    <p className="font-medium text-foreground">
                      {section.section_number} - {section.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due in {daysUntil} days
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      <div>
        <h3>Uploaded Documents</h3>
        <ul>
          {uploadedDocuments.map((doc, idx) => <li key={idx}>{doc}</li>)}
        </ul>
      </div>
    </div>
  );
};

export default Division1Dashboard;

