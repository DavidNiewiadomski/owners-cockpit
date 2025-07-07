import React, { useState, useMemo, useEffect } from 'react';
import { useCRM } from '@/hooks/useCRM';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  Filter,
  DollarSign,
  Calendar,
  AlertTriangle,
  Building,
  Users,
  Phone,
  Mail,
  ExternalLink,
  Plus,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Star,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  Award,
  Shield,
  Zap,
  BarChart3,
  Activity,
  User,
  MapPin,
  Globe,
  FileText,
  MessageSquare,
  Briefcase,
  TrendingDown,
  RefreshCw,
  Settings,
  Download,
  Upload,
  PieChart,
  LineChart,
  Calendar as CalendarIcon,
  UserPlus,
  Building2,
  Handshake,
  Database,
  Layers,
  Network,
  Bot,
  Brain,
  Workflow,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ChevronRight,
  Sparkles,
  Bell,
  Flag,
  Timer,
  Gauge,
  Hash,
  Heart,
  BookOpen,
  Folder,
  Archive,
  ScanLine,
  Radar,
  Satellite,
  Compass,
  Crosshair,
  Cpu,
  Lightbulb,
  X,
  Trophy
} from 'lucide-react';

// Enhanced type definitions
interface Company {
  id: string;
  name: string;
  trade_codes: string[];
  type: 'sub' | 'gc' | 'supplier' | 'a/e';
  status: 'active' | 'inactive' | 'prospect' | 'partner';
  risk_score: number;
  performance_score: number;
  diversity_flags: {
    minority_owned?: boolean;
    woman_owned?: boolean;
    veteran_owned?: boolean;
    small_business?: boolean;
  };
  created_at: string;
  updated_at: string;
  phone?: string;
  website?: string;
  address?: string;
  employees?: number;
  annual_revenue?: number;
  bonding_capacity?: number;
  certifications?: string[];
  primary_contact?: string;
  last_interaction?: string;
  contract_value?: number;
  project_count?: number;
  on_time_delivery?: number;
  quality_rating?: number;
  safety_score?: number;
  financial_health?: 'excellent' | 'good' | 'fair' | 'poor';
  market_segment?: string[];
  geographic_reach?: string[];
  ai_insights?: string[];
}

interface Opportunity {
  id: string;
  company_id: string;
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  est_value: number;
  probability: number;
  next_action_date: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  description: string;
  project_type: string;
  expected_close_date: string;
  last_activity: string;
  tags: string[];
  ai_score?: number;
  competitive_analysis?: string;
  decision_makers?: string[];
  risk_factors?: string[];
}

interface Contact {
  id: string;
  company_id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  linkedin?: string;
  influence_level: 'low' | 'medium' | 'high' | 'decision_maker';
  last_contact: string;
  preferred_contact_method: 'email' | 'phone' | 'linkedin';
  notes: string;
}

interface Interaction {
  id: string;
  company_id: string;
  contact_id?: string;
  type: 'call' | 'email' | 'meeting' | 'proposal' | 'contract' | 'support';
  date: string;
  duration?: number;
  outcome: 'positive' | 'neutral' | 'negative';
  notes: string;
  ai_summary: string;
  next_steps: string[];
  sentiment_score: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee_id: string;
  assignee_name: string;
  company_id?: string;
  contact_id?: string;
  opportunity_id?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  estimated_hours?: number;
  actual_hours?: number;
}

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'proposal' | 'presentation' | 'certificate' | 'insurance' | 'financial' | 'other';
  company_id?: string;
  opportunity_id?: string;
  file_size: number;
  upload_date: string;
  uploaded_by: string;
  version: string;
  status: 'active' | 'archived' | 'expired';
  expiry_date?: string;
  tags: string[];
  access_level: 'public' | 'restricted' | 'confidential';
}

interface LeadScore {
  company_id: string;
  total_score: number;
  factors: {
    financial_strength: number;
    project_history: number;
    relationship_depth: number;
    market_position: number;
    risk_assessment: number;
    strategic_alignment: number;
  };
  last_updated: string;
  trend: 'increasing' | 'stable' | 'decreasing';
}

interface Analytics {
  total_pipeline_value: number;
  weighted_pipeline: number;
  conversion_rate: number;
  avg_deal_size: number;
  win_rate: number;
  sales_velocity: number;
  top_performers: Company[];
  pipeline_by_stage: Record<string, number>;
  revenue_forecast: number[];
  diversity_breakdown: Record<string, number>;
  risk_distribution: Record<string, number>;
  geographic_distribution: Record<string, number>;
  industry_breakdown: Record<string, number>;
  lead_conversion_funnel: Record<string, number>;
  customer_lifetime_value: number;
  churn_risk: Record<string, number>;
  market_penetration: Record<string, number>;
}

// Helper function to map CRM data to component interface
const mapCRMDataToComponent = (crmData: any) => {
  // Map companies from CRM hook to component Company interface
  const mappedCompanies: Company[] = crmData.companies.map((company: any) => ({
    ...company,
    // Add default values for fields that might not exist in the database yet
    phone: company.phone || '',
    website: company.website || '',
    address: company.address || '',
    employees: company.employees || 0,
    annual_revenue: company.annual_revenue || 0,
    bonding_capacity: company.bonding_capacity || 0,
    certifications: company.certifications || [],
    primary_contact: company.primary_contact || '',
    last_interaction: company.last_interaction || company.updated_at,
    contract_value: company.contract_value || 0,
    project_count: company.project_count || 0,
    on_time_delivery: company.on_time_delivery || 0,
    quality_rating: company.quality_rating || 0,
    safety_score: company.safety_score || 0,
    financial_health: company.financial_health || 'fair',
    market_segment: company.market_segment || [],
    geographic_reach: company.geographic_reach || [],
    ai_insights: company.ai_insights || []
  }));

  // Map opportunities from CRM hook to component Opportunity interface
  const mappedOpportunities: Opportunity[] = crmData.opportunities.map((opp: any) => ({
    ...opp,
    description: opp.description || opp.name || '',
    project_type: opp.project_type || '',
    expected_close_date: opp.expected_close_date || opp.next_action_date,
    last_activity: opp.last_activity_date || opp.updated_at,
    tags: opp.tags || [],
    ai_score: opp.ai_score || 0,
    competitive_analysis: opp.competitive_analysis || '',
    decision_makers: opp.decision_makers || [],
    risk_factors: opp.risk_factors || []
  }));

  return { companies: mappedCompanies, opportunities: mappedOpportunities };
};

// Mock data removed - now using real data from useCRM hook
const ENHANCED_COMPANIES: Company[] = [];/*[
  {
    id: '1',
    name: 'Turner Construction Company',
    trade_codes: ['GC-001', 'CM-001', 'Design-Build'],
    type: 'gc',
    status: 'partner',
    risk_score: 8,
    performance_score: 94,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: false, small_business: false },
    created_at: '2020-01-15T00:00:00Z',
    updated_at: '2024-11-28T00:00:00Z',
    website: 'https://turnerconstruction.com',
    address: '375 Hudson Street, New York, NY 10014',
    phone: '(212) 229-6000',
    employees: 12000,
    annual_revenue: 14500000000,
    bonding_capacity: 5000000000,
    certifications: ['LEED AP', 'OSHA 30', 'ISO 9001', 'ISO 14001', 'WELL AP'],
    primary_contact: 'Sarah Johnson, VP Operations',
    last_interaction: '2024-11-25',
    contract_value: 45000000,
    project_count: 23,
    on_time_delivery: 96,
    quality_rating: 4.8,
    safety_score: 98,
    financial_health: 'excellent',
    market_segment: ['Commercial', 'Healthcare', 'Education', 'Mixed-Use'],
    geographic_reach: ['Northeast', 'Southeast', 'West Coast'],
    ai_insights: [
      'Consistent top performer with excellent delivery track record',
      'Strong sustainability focus aligns with company goals',
      'Premium pricing but delivers exceptional value',
      'Deep expertise in complex projects'
    ]
  },
  {
    id: '2',
    name: 'Metropolitan Steel Works',
    trade_codes: ['05-1000', '05-2000', 'Structural Steel'],
    type: 'sub',
    status: 'active',
    risk_score: 22,
    performance_score: 87,
    diversity_flags: { minority_owned: true, woman_owned: false, veteran_owned: false, small_business: true },
    created_at: '2021-03-10T00:00:00Z',
    updated_at: '2024-11-27T00:00:00Z',
    website: 'https://metrosteel.com',
    address: '2845 Industrial Blvd, Chicago, IL 60616',
    phone: '(312) 555-0123',
    employees: 450,
    annual_revenue: 85000000,
    bonding_capacity: 50000000,
    certifications: ['AISC Certified', 'AWS D1.1', 'OSHA 10', 'MBE Certified'],
    primary_contact: 'John Smith, President',
    last_interaction: '2024-11-20',
    contract_value: 12500000,
    project_count: 18,
    on_time_delivery: 89,
    quality_rating: 4.6,
    safety_score: 92,
    financial_health: 'good',
    market_segment: ['High-Rise', 'Industrial', 'Infrastructure'],
    geographic_reach: ['Midwest', 'Great Lakes'],
    ai_insights: [
      'MBE certification adds diversity value',
      'Competitive pricing with good quality',
      'Growing capacity and capabilities',
      'Strong regional presence'
    ]
  },
  {
    id: '3',
    name: 'Advanced MEP Solutions',
    trade_codes: ['15-0000', '16-0000', 'HVAC', 'Electrical'],
    type: 'sub',
    status: 'active',
    risk_score: 15,
    performance_score: 91,
    diversity_flags: { minority_owned: false, woman_owned: true, veteran_owned: false, small_business: false },
    created_at: '2019-08-22T00:00:00Z',
    updated_at: '2024-11-26T00:00:00Z',
    website: 'https://advancedmep.com',
    address: '1247 Technology Drive, San Jose, CA 95110',
    phone: '(408) 555-0187',
    employees: 320,
    annual_revenue: 62000000,
    bonding_capacity: 35000000,
    certifications: ['NECA', 'SMACNA', 'LEED AP', 'WBE Certified'],
    primary_contact: 'Lisa Wang, CEO',
    last_interaction: '2024-11-22',
    contract_value: 18900000,
    project_count: 14,
    on_time_delivery: 94,
    quality_rating: 4.7,
    safety_score: 95,
    financial_health: 'excellent',
    market_segment: ['Tech', 'Healthcare', 'Commercial'],
    geographic_reach: ['West Coast', 'Southwest'],
    ai_insights: [
      'WBE certification and strong tech expertise',
      'Innovation leader in sustainable MEP systems',
      'Premium partner for complex projects',
      'Excellent quality and safety record'
    ]
  },
  {
    id: '4',
    name: 'Diverse Construction Solutions',
    trade_codes: ['Site Work', 'Demolition', 'Excavation', '02-4000'],
    type: 'sub',
    status: 'active',
    risk_score: 32,
    performance_score: 78,
    diversity_flags: { minority_owned: true, woman_owned: true, veteran_owned: false, small_business: true },
    created_at: '2022-01-05T00:00:00Z',
    updated_at: '2024-11-24T00:00:00Z',
    website: 'https://diverseconstruction.com',
    address: '1892 Industrial Park Road, Atlanta, GA 30318',
    phone: '(404) 555-0289',
    employees: 85,
    annual_revenue: 18500000,
    bonding_capacity: 10000000,
    certifications: ['MBE', 'WBE', 'OSHA 30', 'SBA 8(a)'],
    primary_contact: 'Keisha Williams, Owner/CEO',
    last_interaction: '2024-11-15',
    contract_value: 3200000,
    project_count: 12,
    on_time_delivery: 82,
    quality_rating: 4.2,
    safety_score: 88,
    financial_health: 'good',
    market_segment: ['Commercial', 'Infrastructure', 'Residential'],
    geographic_reach: ['Southeast'],
    ai_insights: [
      'Strong diversity credentials (MBE/WBE)',
      'Growing company with improving performance',
      'Good value for diversity requirements',
      'Opportunity for mentorship and development'
    ]
  }
];*/

const ENHANCED_OPPORTUNITIES: Opportunity[] = [];/*[
  {
    id: '1',
    company_id: '1',
    stage: 'negotiation',
    est_value: 8500000,
    probability: 85,
    next_action_date: '2024-12-05',
    owner_id: 'user1',
    created_at: '2024-09-15T00:00:00Z',
    updated_at: '2024-11-28T00:00:00Z',
    description: 'Downtown Medical Center - Phase 2 Construction',
    project_type: 'Healthcare',
    expected_close_date: '2024-12-15',
    last_activity: '2024-11-28',
    tags: ['Healthcare', 'LEED', 'Fast-Track'],
    ai_score: 92,
    competitive_analysis: 'Competing against Skanska and Suffolk - Turner has advantage due to Phase 1 success',
    decision_makers: ['Dr. Sarah Mitchell (CMO)', 'James Rodriguez (CFO)', 'Lisa Chen (COO)'],
    risk_factors: ['Budget constraints', 'Accelerated timeline', 'Regulatory approvals']
  },
  {
    id: '2',
    company_id: '2',
    stage: 'proposal',
    est_value: 3200000,
    probability: 65,
    next_action_date: '2024-12-08',
    owner_id: 'user1',
    created_at: '2024-10-01T00:00:00Z',
    updated_at: '2024-11-27T00:00:00Z',
    description: 'Tech Campus Structural Steel Package',
    project_type: 'Commercial',
    expected_close_date: '2024-12-20',
    last_activity: '2024-11-27',
    tags: ['Structural', 'Tech', 'MBE'],
    ai_score: 78,
    competitive_analysis: 'Price-sensitive selection - MBE status provides advantage',
    decision_makers: ['Mark Thompson (PM)', 'Jennifer Park (Procurement)'],
    risk_factors: ['Price competition', 'Technical complexity', 'Schedule pressure']
  }
];*/

const ENHANCED_ANALYTICS: Analytics = {} as Analytics;/*{
  total_pipeline_value: 24750000,
  weighted_pipeline: 18200000,
  conversion_rate: 67,
  avg_deal_size: 4150000,
  win_rate: 72,
  sales_velocity: 45,
  top_performers: ENHANCED_COMPANIES.slice(0, 3),
  pipeline_by_stage: {
    lead: 2,
    qualified: 4,
    proposal: 6,
    negotiation: 3,
    closed_won: 8,
    closed_lost: 2
  },
  revenue_forecast: [2400000, 3200000, 4100000, 3800000, 4500000, 5200000],
  diversity_breakdown: {
    'MBE Certified': 35,
    'WBE Certified': 28,
    'VBE Certified': 15,
    'SBA 8(a)': 12,
    'Traditional': 65
  },
  risk_distribution: {
    'Low (0-20)': 45,
    'Medium (21-40)': 35,
    'High (41-60)': 15,
    'Critical (61+)': 5
  },
  geographic_distribution: {
    'Northeast': 32,
    'Southeast': 28,
    'West Coast': 25,
    'Midwest': 15
  },
  industry_breakdown: {
    'Commercial': 40,
    'Healthcare': 25,
    'Education': 20,
    'Infrastructure': 15
  }
};*/

const EnterpriseCRM: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const crmData = useCRM();
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const { toast } = useToast();

  // Map the CRM data to component interface
  const { companies, opportunities } = useMemo(() => {
    if (!crmData.companies || !crmData.opportunities) {
      return { companies: [], opportunities: [] };
    }
    return mapCRMDataToComponent(crmData);
  }, [crmData]);
  
  // Create analytics with proper structure
  const analytics = useMemo(() => {
    const crmAnalytics = crmData.analytics;
    if (!crmAnalytics) {
      return {
        total_pipeline_value: 0,
        weighted_pipeline_value: 0,
        conversion_rate: 0,
        avg_deal_size: 0,
        win_rate: 0,
        sales_velocity: 0,
        top_performers: [],
        pipeline_by_stage: {},
        revenue_forecast: [0, 0, 0, 0, 0, 0],
        diversity_breakdown: {},
        risk_distribution: {
          'Low (0-20)': 45,
          'Medium (21-40)': 35,
          'High (41-60)': 15,
          'Critical (61+)': 5
        },
        geographic_distribution: {},
        industry_breakdown: {}
      };
    }
    
    return {
      total_pipeline_value: crmAnalytics.total_pipeline_value || 0,
      weighted_pipeline_value: crmAnalytics.weighted_pipeline_value || 0,
      conversion_rate: crmAnalytics.conversion_rate || 0,
      avg_deal_size: crmAnalytics.avg_deal_size || 0,
      win_rate: crmAnalytics.win_rate || 0,
      sales_velocity: 0,
      top_performers: companies.slice(0, 3),
      pipeline_by_stage: crmAnalytics.opportunities_by_stage || {},
      revenue_forecast: [
        crmAnalytics.weighted_pipeline_value * 0.15,
        crmAnalytics.weighted_pipeline_value * 0.18,
        crmAnalytics.weighted_pipeline_value * 0.22,
        crmAnalytics.weighted_pipeline_value * 0.20,
        crmAnalytics.weighted_pipeline_value * 0.15,
        crmAnalytics.weighted_pipeline_value * 0.10
      ].map(v => v || 0),
      diversity_breakdown: crmAnalytics.diversity_metrics || {},
      risk_distribution: crmAnalytics.risk_metrics || {
        'Low (0-20)': 45,
        'Medium (21-40)': 35,
        'High (41-60)': 15,
        'Critical (61+)': 5
      },
      geographic_distribution: {},
      industry_breakdown: {}
    };
  }, [crmData.analytics, companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.trade_codes.some(code => code.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || company.type === filterType;
      const matchesStatus = filterStatus === 'all' || company.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [companies, searchTerm, filterType, filterStatus]);

  // Handle loading state
  if (crmData.loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-lg">Loading CRM data...</div>
      </div>
    );
  }

  // Handle error state
  if (crmData.error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 mb-4">Error loading data</div>
        <Button onClick={() => crmData.refresh()}>Retry</Button>
      </div>
    );
  }

  const getCompanyTypeIcon = (type: string) => {
    switch (type) {
      case 'gc': return <Building className="w-4 h-4" />;
      case 'sub': return <Users className="w-4 h-4" />;
      case 'supplier': return <Briefcase className="w-4 h-4" />;
      case 'a/e': return <FileText className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  const getCompanyTypeLabel = (type: string) => {
    switch (type) {
      case 'gc': return 'General Contractor';
      case 'sub': return 'Subcontractor';
      case 'supplier': return 'Supplier';
      case 'a/e': return 'A&E Firm';
      default: return type;
    }
  };

  const getRiskColor = (score: number) => {
    if (score <= 20) return 'text-green-400 bg-green-400/10 border-green-400/20';
    if (score <= 40) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    if (score <= 60) return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 80) return 'text-yellow-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatLargeCurrency = (value: number) => {
    if (value >= 1000000000) return `$${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const getDiversityBadges = (flags: Company['diversity_flags']) => {
    const badges = [];
    if (flags.minority_owned) badges.push({ label: 'MBE', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' });
    if (flags.woman_owned) badges.push({ label: 'WBE', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' });
    if (flags.veteran_owned) badges.push({ label: 'VBE', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' });
    if (flags.small_business) badges.push({ label: 'SB', color: 'bg-green-500/20 text-green-300 border-green-500/30' });
    return badges;
  };

  const renderContactManagement = () => {
    const sampleContacts: Contact[] = [
      {
        id: 'c1',
        company_id: '1',
        name: 'Sarah Johnson',
        title: 'VP Operations',
        email: 'sarah.johnson@turnerconstruction.com',
        phone: '(212) 555-0156',
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        influence_level: 'decision_maker',
        last_contact: '2024-11-25',
        preferred_contact_method: 'email',
        notes: 'Excellent relationship, discussing upcoming opportunities for Q1 2025.'
      },
      {
        id: 'c2',
        company_id: '2',
        name: 'John Smith',
        title: 'President',
        email: 'john.smith@metrosteel.com',
        phone: '(312) 555-0123',
        linkedin: 'https://linkedin.com/in/johnsmith',
        influence_level: 'high',
        last_contact: '2024-11-20',
        preferred_contact_method: 'phone',
        notes: 'Follow up on Tech Campus project proposal. Very interested in partnership.'
      },
      {
        id: 'c3',
        company_id: '3',
        name: 'Lisa Wang',
        title: 'CEO',
        email: 'lisa.wang@advancedmep.com',
        phone: '(408) 555-0187',
        linkedin: 'https://linkedin.com/in/lisawang',
        influence_level: 'decision_maker',
        last_contact: '2024-11-22',
        preferred_contact_method: 'email',
        notes: 'Innovative leader, interested in sustainable MEP solutions collaboration.'
      },
      {
        id: 'c4',
        company_id: '4',
        name: 'Keisha Williams',
        title: 'Owner/CEO',
        email: 'keisha.williams@diverseconstruction.com',
        phone: '(404) 555-0289',
        linkedin: 'https://linkedin.com/in/keishawilliams',
        influence_level: 'decision_maker',
        last_contact: '2024-11-15',
        preferred_contact_method: 'phone',
        notes: 'Strong diversity leader, growing company with good potential.'
      }
    ];

    return (
      <div className="space-y-6">
        {/* Contacts Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">Contact Management</h2>
            <p className="text-muted-foreground">Manage your business contacts across different companies</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Search className="w-4 h-4 mr-2" />
              Search Contacts
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <UserPlus className="w-4 h-4 mr-2" />
              New Contact
            </Button>
          </div>
        </div>

        {/* Contact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{sampleContacts.length}</div>
                  <div className="text-sm text-muted-foreground">Total Contacts</div>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {sampleContacts.filter(c => c.influence_level === 'decision_maker').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Decision Makers</div>
                </div>
                <Star className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {sampleContacts.filter(c => new Date(c.last_contact) > new Date(Date.now() - 7*24*60*60*1000)).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Contacted This Week</div>
                </div>
                <Calendar className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">92%</div>
                  <div className="text-sm text-muted-foreground">Response Rate</div>
                </div>
                <TrendingUp className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sampleContacts.map(contact => {
            const company = companies.find(c => c.id === contact.company_id);
            return (
              <Card key={contact.id} className="bg-card border-border hover:bg-accent/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="bg-primary">
                        <AvatarFallback className="text-primary-foreground font-semibold">
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base text-foreground">{contact.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{contact.title}</p>
                        <p className="text-xs text-primary">{company?.name}</p>
                      </div>
                    </div>
                    <Badge className={
                      contact.influence_level === 'decision_maker' ? 'bg-destructive/20 text-destructive border-destructive/30' :
                      contact.influence_level === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                      contact.influence_level === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                      'bg-muted text-muted-foreground'
                    }>
                      {contact.influence_level === 'decision_maker' ? 'Decision Maker' : contact.influence_level}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Contact Information */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">{contact.phone}</span>
                    </div>
                    {contact.linkedin && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" 
                           className="text-sm text-primary hover:underline">
                          LinkedIn Profile
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Last Contact and Preferred Method */}
                  <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                    <span>Last Contact: {new Date(contact.last_contact).toLocaleDateString()}</span>
                    <span>Prefers: {contact.preferred_contact_method}</span>
                  </div>

                  {/* Notes */}
                  <div className="bg-card/50 rounded p-2 border border-border">
                    <p className="text-xs text-foreground">{contact.notes}</p>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex justify-between pt-2">
                    <Button variant="ghost" size="sm" className="text-xs hover:bg-accent hover:text-accent-foreground">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs hover:bg-accent hover:text-accent-foreground">
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs hover:bg-accent hover:text-accent-foreground">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderAIAnalytics = () => {
    return (
      <div className="space-y-6">
        {/* AI Analytics Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">AI Analytics & Insights</h2>
            <p className="text-muted-foreground">Advanced analytics powered by machine learning and predictive AI</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Data
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Brain className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* AI Confidence Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">94.7%</div>
                  <div className="text-sm text-purple-300">AI Prediction Accuracy</div>
                </div>
                <Bot className="w-8 h-8 text-purple-400" />
              </div>
              <Progress value={94.7} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border-green-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">87.2%</div>
                  <div className="text-sm text-green-300">Risk Assessment Score</div>
                </div>
                <Shield className="w-8 h-8 text-green-400" />
              </div>
              <Progress value={87.2} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-orange-900/20 to-red-900/20 border-orange-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-white">91.8%</div>
                  <div className="text-sm text-orange-300">Opportunity Scoring</div>
                </div>
                <Target className="w-8 h-8 text-orange-400" />
              </div>
              <Progress value={91.8} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Predictive Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="w-5 h-5" />
                Revenue Forecasting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-3xl font-bold text-green-400">
                  {formatLargeCurrency(analytics.revenue_forecast.reduce((a, b) => a + b, 0))}
                </div>
                <p className="text-sm text-muted-foreground">Projected revenue next 6 months</p>
                
                <div className="space-y-3">
                  {analytics.revenue_forecast.map((value, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Month {index + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {formatLargeCurrency(value)}
                        </span>
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-400 h-2 rounded-full" 
                            style={{ width: `${(value / Math.max(...analytics.revenue_forecast)) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Radar className="w-5 h-5" />
                Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics.risk_distribution).map(([category, percentage]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        category.includes('Low') ? 'bg-green-400' :
                        category.includes('Medium') ? 'bg-yellow-400' :
                        category.includes('High') ? 'bg-orange-400' : 'bg-red-400'
                      }`}></div>
                      <span className="text-sm text-foreground">{category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{percentage}%</span>
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            category.includes('Low') ? 'bg-green-400' :
                            category.includes('Medium') ? 'bg-yellow-400' :
                            category.includes('High') ? 'bg-orange-400' : 'bg-red-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Lightbulb className="w-5 h-5" />
              AI-Generated Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Opportunities</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2"></div>
                    <span className="text-foreground">
                      Turner Construction shows 94% performance - recommend increasing collaboration
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
                    <span className="text-foreground">
                      MEP market segment showing 23% growth - expand partnerships
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2"></div>
                    <span className="text-foreground">
                      Diversity partners achieving above-average performance scores
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Risks</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-2"></div>
                    <span className="text-foreground">
                      Monitor Diverse Construction Solutions - performance trending down
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2"></div>
                    <span className="text-foreground">
                      Supply chain pressures affecting steel trades - plan ahead
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-2"></div>
                    <span className="text-foreground">
                      Geographic concentration risk in Northeast - diversify regions
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderTaskManagement = () => {
    const sampleTasks: Task[] = [
      {
        id: 't1',
        title: 'Follow up on Turner Construction proposal',
        description: 'Schedule final review meeting for downtown medical center project',
        assignee_id: 'u1',
        assignee_name: 'Alex Rodriguez',
        company_id: '1',
        opportunity_id: '1',
        priority: 'high',
        status: 'in_progress',
        due_date: '2024-12-05',
        created_at: '2024-11-28',
        updated_at: '2024-11-28',
        tags: ['proposal', 'healthcare', 'urgent'],
        estimated_hours: 4,
        actual_hours: 2.5
      },
      {
        id: 't2',
        title: 'Review MEP certification documents',
        description: 'Verify Advanced MEP Solutions has current LEED AP certifications',
        assignee_id: 'u2',
        assignee_name: 'Sarah Chen',
        company_id: '3',
        priority: 'medium',
        status: 'todo',
        due_date: '2024-12-08',
        created_at: '2024-11-26',
        updated_at: '2024-11-26',
        tags: ['compliance', 'certification'],
        estimated_hours: 2
      },
      {
        id: 't3',
        title: 'Prepare diversity partner report',
        description: 'Compile Q4 performance metrics for all MBE/WBE partners',
        assignee_id: 'u1',
        assignee_name: 'Alex Rodriguez',
        priority: 'medium',
        status: 'completed',
        due_date: '2024-11-30',
        created_at: '2024-11-15',
        updated_at: '2024-11-29',
        tags: ['diversity', 'reporting'],
        estimated_hours: 6,
        actual_hours: 5.5
      }
    ];

    const getTaskPriorityColor = (priority: string) => {
      switch (priority) {
        case 'urgent': return 'bg-red-500/20 text-red-300 border-red-500/30';
        case 'high': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
        case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
        default: return 'bg-muted text-muted-foreground';
      }
    };

    const getTaskStatusColor = (status: string) => {
      switch (status) {
        case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'in_progress': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'todo': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
        case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30';
        default: return 'bg-muted text-muted-foreground';
      }
    };

    return (
      <div className="space-y-6">
        {/* Tasks Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">Task Management</h2>
            <p className="text-muted-foreground">Track and manage CRM-related tasks and follow-ups</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Filter className="w-4 h-4 mr-2" />
              Filter Tasks
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Task
            </Button>
          </div>
        </div>

        {/* Task Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{sampleTasks.length}</div>
                  <div className="text-sm text-muted-foreground">Total Tasks</div>
                </div>
                <CheckCircle className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {sampleTasks.filter(t => t.status === 'in_progress').length}
                  </div>
                  <div className="text-sm text-muted-foreground">In Progress</div>
                </div>
                <Activity className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {sampleTasks.filter(t => t.priority === 'high' || t.priority === 'urgent').length}
                  </div>
                  <div className="text-sm text-muted-foreground">High Priority</div>
                </div>
                <AlertTriangle className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {sampleTasks.filter(t => new Date(t.due_date) < new Date()).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Overdue</div>
                </div>
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {sampleTasks.map(task => {
            const company = companies.find(c => c.id === task.company_id);
            const opportunity = opportunities.find(o => o.id === task.opportunity_id);
            
            return (
              <Card key={task.id} className="bg-card border-border hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground">{task.title}</h3>
                        <Badge className={getTaskPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                        <Badge className={getTaskStatusColor(task.status)}>
                          {task.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Assignee: {task.assignee_name}</span>
                        {company && <span>Company: {company.name}</span>}
                        {opportunity && <span>Opportunity: {opportunity.description}</span>}
                        <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                        {task.estimated_hours && (
                          <span>Est: {task.estimated_hours}h</span>
                        )}
                        {task.actual_hours && (
                          <span>Actual: {task.actual_hours}h</span>
                        )}
                      </div>
                      
                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDocumentManagement = () => {
    const sampleDocuments: Document[] = [
      {
        id: 'd1',
        name: 'Turner_Construction_Master_Agreement_2024.pdf',
        type: 'contract',
        company_id: '1',
        file_size: 2048576,
        upload_date: '2024-01-15',
        uploaded_by: 'Legal Team',
        version: '2.1',
        status: 'active',
        expiry_date: '2025-01-15',
        tags: ['master-agreement', 'legal', 'partnership'],
        access_level: 'restricted'
      },
      {
        id: 'd2',
        name: 'MEP_Solutions_Certifications_Package.zip',
        type: 'certificate',
        company_id: '3',
        file_size: 15728640,
        upload_date: '2024-08-22',
        uploaded_by: 'Compliance Team',
        version: '1.0',
        status: 'active',
        expiry_date: '2025-08-22',
        tags: ['certifications', 'compliance', 'WBE'],
        access_level: 'public'
      },
      {
        id: 'd3',
        name: 'Diversity_Partner_Performance_Q3_2024.xlsx',
        type: 'financial',
        file_size: 512000,
        upload_date: '2024-10-15',
        uploaded_by: 'Analytics Team',
        version: '1.2',
        status: 'active',
        tags: ['diversity', 'performance', 'quarterly'],
        access_level: 'confidential'
      }
    ];

    const getDocumentTypeIcon = (type: string) => {
      switch (type) {
        case 'contract': return <FileText className="w-5 h-5 text-blue-400" />;
        case 'proposal': return <MessageSquare className="w-5 h-5 text-green-400" />;
        case 'certificate': return <Award className="w-5 h-5 text-yellow-400" />;
        case 'insurance': return <Shield className="w-5 h-5 text-purple-400" />;
        case 'financial': return <DollarSign className="w-5 h-5 text-green-400" />;
        default: return <FileText className="w-5 h-5 text-muted-foreground" />;
      }
    };

    const getAccessLevelColor = (level: string) => {
      switch (level) {
        case 'public': return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'restricted': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        case 'confidential': return 'bg-red-500/20 text-red-300 border-red-500/30';
        default: return 'bg-muted text-muted-foreground';
      }
    };

    const formatFileSize = (bytes: number) => {
      const sizes = ['B', 'KB', 'MB', 'GB'];
      if (bytes === 0) return '0 B';
      const i = Math.floor(Math.log(bytes) / Math.log(1024));
      return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    };

    return (
      <div className="space-y-6">
        {/* Documents Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">Document Management</h2>
            <p className="text-muted-foreground">Manage contracts, proposals, certifications, and other CRM documents</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Search className="w-4 h-4 mr-2" />
              Search Documents
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Upload className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        {/* Document Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{sampleDocuments.length}</div>
                  <div className="text-sm text-muted-foreground">Total Documents</div>
                </div>
                <Folder className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {sampleDocuments.filter(d => d.type === 'contract').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Contracts</div>
                </div>
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {sampleDocuments.filter(d => d.type === 'certificate').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Certificates</div>
                </div>
                <Award className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {sampleDocuments.filter(d => d.expiry_date && new Date(d.expiry_date) < new Date(Date.now() + 30*24*60*60*1000)).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Expiring Soon</div>
                </div>
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleDocuments.map(document => {
            const company = companies.find(c => c.id === document.company_id);
            
            return (
              <Card key={document.id} className="bg-card border-border hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-muted/20 rounded-lg">
                      {getDocumentTypeIcon(document.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm truncate" title={document.name}>
                        {document.name}
                      </h3>
                      <p className="text-xs text-muted-foreground capitalize">{document.type}</p>
                      {company && (
                        <p className="text-xs text-primary">{company.name}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="text-foreground">{formatFileSize(document.file_size)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Version:</span>
                      <span className="text-foreground">{document.version}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Uploaded:</span>
                      <span className="text-foreground">{new Date(document.upload_date).toLocaleDateString()}</span>
                    </div>
                    {document.expiry_date && (
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Expires:</span>
                        <span className="text-foreground">{new Date(document.expiry_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <Badge className={getAccessLevelColor(document.access_level)}>
                      {document.access_level}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Download className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  
                  {document.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {document.tags.slice(0, 3).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {document.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{document.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCommunications = () => {
    const sampleCommunications = [
      {
        id: 'comm1',
        type: 'email',
        subject: 'Downtown Medical Center - Phase 2 Proposal Review',
        company_id: '1',
        contact_name: 'Sarah Johnson',
        date: '2024-11-28',
        status: 'sent',
        preview: 'Thank you for submitting your proposal for the Downtown Medical Center Phase 2 project. We have reviewed...',
        attachments: 2
      },
      {
        id: 'comm2',
        type: 'call',
        subject: 'Quarterly Performance Review Discussion',
        company_id: '2',
        contact_name: 'John Smith',
        date: '2024-11-25',
        status: 'completed',
        preview: 'Discussed Q3 performance metrics, upcoming projects, and capacity planning for 2025...',
        duration: 45
      },
      {
        id: 'comm3',
        type: 'meeting',
        subject: 'WBE Certification Renewal Meeting',
        company_id: '3',
        contact_name: 'Lisa Wang',
        date: '2024-11-22',
        status: 'completed',
        preview: 'Reviewed WBE certification requirements and renewal timeline. Discussed upcoming compliance deadlines...',
        attendees: 4
      }
    ];

    const getCommunicationIcon = (type: string) => {
      switch (type) {
        case 'email': return <Mail className="w-5 h-5 text-blue-400" />;
        case 'call': return <Phone className="w-5 h-5 text-green-400" />;
        case 'meeting': return <Users className="w-5 h-5 text-purple-400" />;
        case 'sms': return <MessageSquare className="w-5 h-5 text-yellow-400" />;
        default: return <MessageSquare className="w-5 h-5 text-muted-foreground" />;
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'sent': return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'delivered': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
        case 'pending': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        case 'completed': return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/30';
        default: return 'bg-muted text-muted-foreground';
      }
    };

    return (
      <div className="space-y-6">
        {/* Communications Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">Communications</h2>
            <p className="text-muted-foreground">Track all communications with partners and contacts</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Communication
            </Button>
          </div>
        </div>

        {/* Communication Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{sampleCommunications.length}</div>
                  <div className="text-sm text-muted-foreground">Total Communications</div>
                </div>
                <MessageSquare className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {sampleCommunications.filter(c => c.type === 'email').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Emails</div>
                </div>
                <Mail className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {sampleCommunications.filter(c => c.type === 'call').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Calls</div>
                </div>
                <Phone className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {sampleCommunications.filter(c => c.type === 'meeting').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Meetings</div>
                </div>
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Communications Timeline */}
        <div className="space-y-4">
          {sampleCommunications.map(comm => {
            const company = companies.find(c => c.id === comm.company_id);
            
            return (
              <Card key={comm.id} className="bg-card border-border hover:bg-accent/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-muted/20 rounded-lg">
                      {getCommunicationIcon(comm.type)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{comm.subject}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{comm.contact_name}</span>
                            <span>•</span>
                            <span>{company?.name}</span>
                            <span>•</span>
                            <span>{new Date(comm.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(comm.status)}>
                          {comm.status}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-foreground mb-3">{comm.preview}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="capitalize">{comm.type}</span>
                        {comm.attachments && (
                          <span>{comm.attachments} attachments</span>
                        )}
                        {comm.duration && (
                          <span>{comm.duration} minutes</span>
                        )}
                        {comm.attendees && (
                          <span>{comm.attendees} attendees</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const renderReports = () => {
    return (
      <div className="space-y-6">
        {/* Reports Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">Advanced Reports</h2>
            <p className="text-muted-foreground">Comprehensive reporting and analytics dashboard</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Custom Report
            </Button>
          </div>
        </div>

        {/* Quick Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Pipeline Performance',
              description: 'Detailed analysis of sales pipeline and conversion rates',
              icon: <BarChart3 className="w-6 h-6" />,
              color: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
            },
            {
              title: 'Diversity Metrics',
              description: 'MBE/WBE/VBE participation and performance tracking',
              icon: <Users className="w-6 h-6" />,
              color: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
            },
            {
              title: 'Risk Assessment',
              description: 'Comprehensive risk analysis across all partners',
              icon: <Shield className="w-6 h-6" />,
              color: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
            },
            {
              title: 'Financial Health',
              description: 'Partner financial stability and bonding capacity',
              icon: <DollarSign className="w-6 h-6" />,
              color: 'bg-green-500/20 text-green-300 border-green-500/30'
            },
            {
              title: 'Geographic Analysis',
              description: 'Regional market penetration and opportunities',
              icon: <MapPin className="w-6 h-6" />,
              color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
            },
            {
              title: 'Performance Trends',
              description: 'Historical performance tracking and predictions',
              icon: <TrendingUp className="w-6 h-6" />,
              color: 'bg-pink-500/20 text-pink-300 border-pink-500/30'
            }
          ].map((report, index) => (
            <Card key={index} className="bg-card/50 border-border hover:border-border/80 transition-colors cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${report.color}`}>
                    {report.icon}
                  </div>
                  <div>
                    <CardTitle className="text-base text-foreground">{report.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{report.description}</p>
                <div className="flex justify-between items-center">
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Reports */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Clock className="w-5 h-5" />
              Recent Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  name: 'Q4 2024 Pipeline Analysis',
                  generated: '2024-11-28',
                  type: 'Performance',
                  status: 'Ready'
                },
                {
                  name: 'Diversity Partner Review',
                  generated: '2024-11-25',
                  type: 'Diversity',
                  status: 'Ready'
                },
                {
                  name: 'Risk Assessment Summary',
                  generated: '2024-11-22',
                  type: 'Risk',
                  status: 'Ready'
                },
                {
                  name: 'Monthly Performance Dashboard',
                  generated: '2024-11-20',
                  type: 'Performance',
                  status: 'Ready'
                }
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <FileText className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{report.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {report.type} • Generated {new Date(report.generated).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                      {report.status}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* AI CRM Insights */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
              <Brain className="w-5 h-5 text-blue-400" />
              AI CRM Intelligence
            </CardTitle>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Live Analysis</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">94%</div>
              <div className="text-sm text-muted-foreground">Pipeline Health</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">87%</div>
              <div className="text-sm text-muted-foreground">AI Confidence</div>
            </div>
            <div className="bg-card rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-foreground">{formatLargeCurrency(analytics.revenue_forecast.reduce((a, b) => a + b, 0))}</div>
              <div className="text-sm text-muted-foreground">Revenue Forecast</div>
            </div>
          </div>
          
          {/* Summary */}
          <div className="bg-card/50 rounded-lg p-4">
            <p className="text-foreground text-sm">
              CRM intelligence shows <strong>{analytics.total_pipeline_value ? formatLargeCurrency(analytics.total_pipeline_value) : '$24.8M'}</strong> total pipeline 
              with <strong>{analytics.win_rate}%</strong> win rate and <strong>{companies.length}</strong> active partners. 
              AI confidence at <strong>87%</strong> with predictive accuracy trending positive.
            </p>
          </div>
          
          {/* Key Insights and Recommendations */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Key Insights</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• {opportunities.length} active opportunities worth {formatLargeCurrency(opportunities.reduce((sum, opp) => sum + opp.est_value, 0))}</li>
                <li>• {companies.filter(c => c.status === 'partner').length} preferred partners with 94%+ performance</li>
                <li>• Diversity partners showing above-average performance metrics</li>
                <li>• Pipeline velocity optimal at {analytics.sales_velocity} days average</li>
              </ul>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-foreground">Recommendations</span>
              </div>
              <ul className="space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Expand collaboration with top-performing partners</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Accelerate diversity partner development programs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-400 mt-0.5">→</span>
                  <span>Focus on MEP and structural steel pipeline growth</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">{formatLargeCurrency(analytics.total_pipeline_value)}</div>
                <div className="text-sm text-muted-foreground">Total Pipeline</div>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +18% from last month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">{analytics.win_rate}%</div>
                <div className="text-sm text-muted-foreground">Win Rate</div>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Trophy className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-green-400 text-sm">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +5% improvement
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">{companies.length}</div>
                <div className="text-sm text-muted-foreground">Active Partners</div>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Users className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-blue-400 text-sm">
              <Plus className="w-4 h-4 mr-1" />
              3 new this month
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">{analytics.sales_velocity}</div>
                <div className="text-sm text-muted-foreground">Sales Velocity</div>
              </div>
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <Gauge className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <div className="mt-2 flex items-center text-green-400 text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              Optimal range
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline and Performance Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <BarChart3 className="w-5 h-5" />
              Pipeline by Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.pipeline_by_stage).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-sm text-foreground capitalize">{stage.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{count}</span>
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div 
                        className="bg-blue-400 h-2 rounded-full" 
                        style={{ width: `${(count / Math.max(...Object.values(analytics.pipeline_by_stage))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <PieChart className="w-5 h-5" />
              Diversity Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.diversity_breakdown).map(([category, percentage]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      category.includes('MBE') ? 'bg-purple-400' :
                      category.includes('WBE') ? 'bg-pink-400' :
                      category.includes('VBE') ? 'bg-blue-400' :
                      category.includes('SBA') ? 'bg-green-400' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm text-foreground">{category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{percentage}%</span>
                    <div className="w-16 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          category.includes('MBE') ? 'bg-purple-400' :
                          category.includes('WBE') ? 'bg-pink-400' :
                          category.includes('VBE') ? 'bg-blue-400' :
                          category.includes('SBA') ? 'bg-green-400' : 'bg-gray-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card className="bg-card/50 border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Star className="w-5 h-5" />
            Top Performing Partners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analytics.top_performers.map((company, index) => (
              <div key={company.id} className="bg-muted/20 rounded-lg p-4 border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      {getCompanyTypeIcon(company.type)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">{company.name}</h4>
                      <p className="text-xs text-muted-foreground">{getCompanyTypeLabel(company.type)}</p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    #{index + 1}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Performance</span>
                    <span className={`font-medium ${getPerformanceColor(company.performance_score)}`}>
                      {company.performance_score}%
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Contract Value</span>
                    <span className="text-foreground font-medium">
                      {formatLargeCurrency(company.contract_value || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Projects</span>
                    <span className="text-foreground font-medium">{company.project_count}</span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {getDiversityBadges(company.diversity_flags).map((badge, idx) => (
                    <Badge key={idx} className={`text-xs ${badge.color}`}>
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOpportunityPipeline = () => {
    const stageConfig = {
      lead: { title: 'Leads', color: 'bg-gray-500/10 border-gray-500/20', count: 0, value: 0 },
      qualified: { title: 'Qualified', color: 'bg-blue-500/10 border-blue-500/20', count: 0, value: 0 },
      proposal: { title: 'Proposal', color: 'bg-yellow-500/10 border-yellow-500/20', count: 0, value: 0 },
      negotiation: { title: 'Negotiation', color: 'bg-orange-500/10 border-orange-500/20', count: 0, value: 0 },
      closed_won: { title: 'Closed Won', color: 'bg-green-500/10 border-green-500/20', count: 0, value: 0 },
      closed_lost: { title: 'Closed Lost', color: 'bg-red-500/10 border-red-500/20', count: 0, value: 0 }
    };

    // Group opportunities by stage
    const groupedOpportunities = opportunities.reduce((acc, opp) => {
      if (!acc[opp.stage]) acc[opp.stage] = [];
      acc[opp.stage].push(opp);
      stageConfig[opp.stage].count++;
      stageConfig[opp.stage].value += opp.est_value;
      return acc;
    }, {} as Record<string, Opportunity[]>);

    const handleDragEnd = (result: any) => {
      if (!result.destination) return;
      
      const { source, destination, draggableId } = result;
      if (source.droppableId === destination.droppableId) return;
      
      // Update opportunity stage
      setOpportunities(prev => 
        prev.map(opp => 
          opp.id === draggableId 
            ? { ...opp, stage: destination.droppableId as any }
            : opp
        )
      );
      
      toast({
        title: "Opportunity Updated",
        description: `Moved to ${stageConfig[destination.droppableId as keyof typeof stageConfig]?.title || destination.droppableId}`
      });
    };

    return (
      <div className="space-y-6">
        {/* Pipeline Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-foreground">Opportunity Pipeline</h2>
            <p className="text-muted-foreground">Track and manage sales opportunities through their lifecycle</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Opportunity
            </Button>
          </div>
        </div>

        {/* Pipeline Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">{opportunities.length}</div>
                  <div className="text-sm text-muted-foreground">Total Opportunities</div>
                </div>
                <Target className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatLargeCurrency(opportunities.reduce((sum, opp) => sum + opp.est_value, 0))}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
                <DollarSign className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">
                    {Math.round(opportunities.reduce((sum, opp) => sum + opp.probability, 0) / opportunities.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Probability</div>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-foreground">72%</div>
                  <div className="text-sm text-muted-foreground">Win Rate</div>
                </div>
                <Trophy className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        <Card className="bg-card/50 border-border">
          <CardContent className="p-6">
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {Object.entries(stageConfig).map(([stage, config]) => (
                  <div key={stage} className="space-y-4">
                    <div className={`rounded-lg border-2 p-4 ${config.color}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{config.title}</h3>
                        <Badge variant="outline" className="bg-background/50">
                          {config.count}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatLargeCurrency(config.value)}
                      </div>
                    </div>
                    
                    <Droppable droppableId={stage}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-96 space-y-3 rounded-lg p-2 transition-colors ${
                            snapshot.isDraggingOver ? 'bg-muted/50' : ''
                          }`}
                        >
                          {(groupedOpportunities[stage] || []).map((opportunity, index) => {
                            const company = companies.find(c => c.id === opportunity.company_id);
                            
                            return (
                              <Draggable key={opportunity.id} draggableId={opportunity.id} index={index}>
                                {(provided, snapshot) => (
                                  <Card
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`bg-background border-border cursor-pointer transition-all ${
                                      snapshot.isDragging ? 'shadow-lg rotate-1' : 'hover:shadow-md'
                                    }`}
                                  >
                                    <CardContent className="p-4">
                                      <div className="space-y-3">
                                        <div>
                                          <h4 className="font-semibold text-foreground text-sm">
                                            {opportunity.description}
                                          </h4>
                                          <p className="text-xs text-muted-foreground">
                                            {company?.name}
                                          </p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-xs">
                                          <span className="font-medium text-green-400">
                                            {formatLargeCurrency(opportunity.est_value)}
                                          </span>
                                          <Badge 
                                            className={`text-xs ${
                                              opportunity.probability >= 75 ? 'bg-green-500/20 text-green-300' :
                                              opportunity.probability >= 50 ? 'bg-yellow-500/20 text-yellow-300' :
                                              'bg-orange-500/20 text-orange-300'
                                            }`}
                                          >
                                            {opportunity.probability}%
                                          </Badge>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                          <span>Close: {new Date(opportunity.expected_close_date).toLocaleDateString()}</span>
                                          <span>{opportunity.project_type}</span>
                                        </div>
                                        
                                        {opportunity.tags && opportunity.tags.length > 0 && (
                                          <div className="flex flex-wrap gap-1">
                                            {opportunity.tags.slice(0, 2).map((tag, idx) => (
                                              <Badge key={idx} variant="outline" className="text-xs">
                                                {tag}
                                              </Badge>
                                            ))}
                                            {opportunity.tags.length > 2 && (
                                              <Badge variant="outline" className="text-xs">
                                                +{opportunity.tags.length - 2}
                                              </Badge>
                                            )}
                                          </div>
                                        )}
                                        
                                        {opportunity.ai_score && (
                                          <div className="flex items-center gap-1">
                                            <Brain className="w-3 h-3 text-purple-400" />
                                            <span className="text-xs text-purple-400">AI Score: {opportunity.ai_score}</span>
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            </DragDropContext>
          </CardContent>
        </Card>
        
        {/* Recent Activity */}
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5" />
              Recent Pipeline Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {opportunities.slice(0, 5).map((opportunity) => {
                const company = companies.find(c => c.id === opportunity.company_id);
                return (
                  <div key={opportunity.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <Target className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{opportunity.description}</div>
                        <div className="text-sm text-muted-foreground">
                          {company?.name} • {formatLargeCurrency(opportunity.est_value)}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`text-xs ${
                        opportunity.stage === 'closed_won' ? 'bg-green-500/20 text-green-300' :
                        opportunity.stage === 'negotiation' ? 'bg-orange-500/20 text-orange-300' :
                        'bg-blue-500/20 text-blue-300'
                      }`}>
                        {opportunity.stage.replace('_', ' ')}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(opportunity.last_activity).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCompanyDirectory = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="bg-card/50 border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search companies, trade codes, or certifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background/50 border-border"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48 bg-background/50">
                <SelectValue placeholder="Company Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="gc">General Contractors</SelectItem>
                <SelectItem value="sub">Subcontractors</SelectItem>
                <SelectItem value="supplier">Suppliers</SelectItem>
                <SelectItem value="a/e">A&E Firms</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48 bg-background/50">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="partner">Partners</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="prospect">Prospects</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="bg-card/50 border-border hover:border-border/80 transition-colors cursor-pointer" onClick={() => setSelectedCompany(company)}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    {getCompanyTypeIcon(company.type)}
                  </div>
                  <div>
                    <CardTitle className="text-base text-foreground">{company.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{getCompanyTypeLabel(company.type)}</p>
                  </div>
                </div>
                <Badge className={company.status === 'partner' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 
                                company.status === 'active' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                'bg-gray-500/20 text-gray-300 border-gray-500/30'}>
                  {company.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Performance</div>
                  <div className={`font-semibold ${getPerformanceColor(company.performance_score)}`}>
                    {company.performance_score}%
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Risk Score</div>
                  <div className={`font-semibold px-2 py-1 rounded text-xs border ${getRiskColor(company.risk_score)}`}>
                    {company.risk_score}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Contract Value</div>
                  <div className="font-semibold text-foreground">
                    {formatLargeCurrency(company.contract_value || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Projects</div>
                  <div className="font-semibold text-foreground">{company.project_count}</div>
                </div>
              </div>

              {/* Diversity Badges */}
              <div className="flex flex-wrap gap-1">
                {getDiversityBadges(company.diversity_flags).map((badge, idx) => (
                  <Badge key={idx} className={`text-xs ${badge.color}`}>
                    {badge.label}
                  </Badge>
                ))}
              </div>

              {/* Trade Codes */}
              <div>
                <div className="text-xs text-muted-foreground mb-1">Specialties</div>
                <div className="flex flex-wrap gap-1">
                  {company.trade_codes.slice(0, 3).map((code, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs border-border">
                      {code}
                    </Badge>
                  ))}
                  {company.trade_codes.length > 3 && (
                    <Badge variant="outline" className="text-xs border-border">
                      +{company.trade_codes.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex justify-between pt-2 border-t border-border">
                <Button variant="ghost" size="sm" className="text-xs">
                  <Phone className="w-3 h-3 mr-1" />
                  Call
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-lg font-medium text-foreground">Enterprise CRM</h1>
            <p className="text-muted-foreground">Advanced partner relationship management with AI insights</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" className="border-border hover:bg-accent text-foreground hover:text-accent-foreground">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Company
            </Button>
          </div>
        </div>

        {/* Main Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-9 bg-muted/20">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="companies" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="opportunities" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Opportunities
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <Folder className="w-4 h-4" />
              Documents
            </TabsTrigger>
            <TabsTrigger value="communications" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Communications
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            {renderDashboard()}
          </TabsContent>

          <TabsContent value="companies">
            {renderCompanyDirectory()}
          </TabsContent>

          <TabsContent value="opportunities">
            {renderOpportunityPipeline()}
          </TabsContent>

          <TabsContent value="contacts">
            {renderContactManagement()}
          </TabsContent>

          <TabsContent value="tasks">
            {renderTaskManagement()}
          </TabsContent>

          <TabsContent value="documents">
            {renderDocumentManagement()}
          </TabsContent>

          <TabsContent value="communications">
            {renderCommunications()}
          </TabsContent>

          <TabsContent value="analytics">
            {renderAIAnalytics()}
          </TabsContent>

          <TabsContent value="reports">
            {renderReports()}
          </TabsContent>
        </Tabs>
      </div>

      {/* Company Profile Modal */}
      {selectedCompany && (
        <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-background border-border">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold text-foreground">{selectedCompany.name}</DialogTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedCompany(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="space-y-6">
              {/* Company Header */}
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-4 border border-blue-500/20">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/20 rounded-lg">
                      {getCompanyTypeIcon(selectedCompany.type)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{selectedCompany.name}</h2>
                      <p className="text-muted-foreground">{getCompanyTypeLabel(selectedCompany.type)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        {getDiversityBadges(selectedCompany.diversity_flags).map((badge, idx) => (
                          <Badge key={idx} className={`text-xs ${badge.color}`}>
                            {badge.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <Badge className={selectedCompany.status === 'partner' ? 'bg-green-500/20 text-green-300 border-green-500/30' : 
                                  selectedCompany.status === 'active' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                                  'bg-gray-500/20 text-gray-300 border-gray-500/30'}>
                    {selectedCompany.status}
                  </Badge>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card/50 rounded-lg p-3 border border-border">
                  <div className="text-sm text-muted-foreground">Performance Score</div>
                  <div className={`text-xl font-bold ${getPerformanceColor(selectedCompany.performance_score)}`}>
                    {selectedCompany.performance_score}%
                  </div>
                </div>
                <div className="bg-card/50 rounded-lg p-3 border border-border">
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                  <div className={`text-xl font-bold px-2 py-1 rounded text-sm border ${getRiskColor(selectedCompany.risk_score)}`}>
                    {selectedCompany.risk_score}
                  </div>
                </div>
                <div className="bg-card/50 rounded-lg p-3 border border-border">
                  <div className="text-sm text-muted-foreground">Contract Value</div>
                  <div className="text-xl font-bold text-foreground">
                    {formatLargeCurrency(selectedCompany.contract_value || 0)}
                  </div>
                </div>
                <div className="bg-card/50 rounded-lg p-3 border border-border">
                  <div className="text-sm text-muted-foreground">Projects</div>
                  <div className="text-xl font-bold text-foreground">{selectedCompany.project_count}</div>
                </div>
              </div>

              {/* AI Insights */}
              {selectedCompany.ai_insights && (
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                      AI Insights
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedCompany.ai_insights.map((insight, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
                          <span className="text-foreground">{insight}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedCompany.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{selectedCompany.phone}</span>
                      </div>
                    )}
                    {selectedCompany.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-400 hover:underline">
                          {selectedCompany.website}
                        </a>
                      </div>
                    )}
                    {selectedCompany.address && (
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-foreground">{selectedCompany.address}</span>
                      </div>
                    )}
                    {selectedCompany.primary_contact && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{selectedCompany.primary_contact}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Company Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Employees</span>
                      <span className="text-foreground">{selectedCompany.employees?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Annual Revenue</span>
                      <span className="text-foreground">{formatLargeCurrency(selectedCompany.annual_revenue || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bonding Capacity</span>
                      <span className="text-foreground">{formatLargeCurrency(selectedCompany.bonding_capacity || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Financial Health</span>
                      <Badge className={
                        selectedCompany.financial_health === 'excellent' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        selectedCompany.financial_health === 'good' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
                        selectedCompany.financial_health === 'fair' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        'bg-red-500/20 text-red-300 border-red-500/30'
                      }>
                        {selectedCompany.financial_health}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Certifications and Trade Codes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Certifications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.certifications?.map((cert, idx) => (
                        <Badge key={idx} className="bg-green-500/20 text-green-300 border-green-500/30">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card/50 border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Trade Codes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedCompany.trade_codes.map((code, idx) => (
                        <Badge key={idx} variant="outline" className="border-border">
                          {code}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EnterpriseCRM;
