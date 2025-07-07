import React, { useState, useMemo } from 'react';
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
  Crosshair
} from 'lucide-react';
import CompanyProfile from './CompanyProfile';

// Type definitions for CRM
type CompanyType = 'sub' | 'gc' | 'supplier' | 'a/e';
type CompanyStatus = 'active' | 'inactive';
type OpportunityStage = 'prospect' | 'shortlisted' | 'invited' | 'negotiation' | 'closed';

interface Company {
  id: string;
  name: string;
  trade_codes: string[];
  type: CompanyType;
  status: CompanyStatus;
  risk_score: number;
  diversity_flags: Record<string, any>;
  created_at: string;
  updated_at: string;
  phone?: string;
  website?: string;
  address?: string;
  employees?: number;
  annual_revenue?: number;
  bonding_capacity?: number;
  certifications?: string[];
}

interface Opportunity {
  id: string;
  company_id: string;
  stage: OpportunityStage;
  est_value?: number;
  next_action_date?: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  description?: string;
}

// Mock data removed - now using real data from useCRM hook
const MOCK_COMPANIES: Company[] = [];/*[
  {
    id: '1',
    name: 'Turner Construction Company',
    trade_codes: ['GC', 'CM', 'Design-Build'],
    type: 'gc',
    status: 'active',
    risk_score: 15,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: false },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    website: 'https://turnerconstruction.com',
    address: '375 Hudson Street, New York, NY 10014',
    phone: '(212) 229-6000',
    employees: 12000,
    annual_revenue: 14500000000,
    bonding_capacity: 5000000000,
    certifications: ['LEED', 'OSHA 30', 'ISO 9001']
  },
  {
    id: '2',
    name: 'Metropolitan Steel Works',
    trade_codes: ['05-1000', '05-2000', 'Structural Steel'],
    type: 'sub',
    status: 'active',
    risk_score: 25,
    diversity_flags: { minority_owned: true, woman_owned: false, veteran_owned: false },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    website: 'https://metrosteel.com',
    address: '2845 Industrial Blvd, Chicago, IL 60616',
    phone: '(312) 555-0123',
    employees: 450,
    annual_revenue: 85000000,
    bonding_capacity: 50000000,
    certifications: ['AISC', 'AWS D1.1', 'OSHA 10']
  },
  {
    id: '3',
    name: 'Advanced MEP Solutions',
    trade_codes: ['15-0000', '16-0000', 'HVAC', 'Electrical'],
    type: 'sub',
    status: 'active',
    risk_score: 18,
    diversity_flags: { minority_owned: false, woman_owned: true, veteran_owned: false },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    website: 'https://advancedmep.com',
    address: '1247 Technology Drive, San Jose, CA 95110',
    phone: '(408) 555-0187',
    employees: 320,
    annual_revenue: 62000000,
    bonding_capacity: 35000000,
    certifications: ['NECA', 'SMACNA', 'LEED AP']
  },
  {
    id: '4',
    name: 'Premier Concrete Company',
    trade_codes: ['03-3000', '03-4000', 'Ready-Mix', 'Placement'],
    type: 'sub',
    status: 'active',
    risk_score: 8,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: true },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    website: 'https://premierconcrete.com',
    address: '5890 Commerce Street, Denver, CO 80239',
    phone: '(303) 555-0234',
    employees: 180,
    annual_revenue: 42000000,
    bonding_capacity: 25000000,
    certifications: ['ACI', 'NRMCA', 'OSHA 30']
  },
  {
    id: '5',
    name: 'Glass Tech Systems',
    trade_codes: ['08-4000', '08-8000', 'Curtain Wall', 'Glazing'],
    type: 'sub',
    status: 'active',
    risk_score: 22,
    diversity_flags: { minority_owned: false, woman_owned: true, veteran_owned: false },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    website: 'https://glasstech.com',
    address: '3421 Innovation Way, Seattle, WA 98101',
    phone: '(206) 555-0156',
    employees: 95,
    annual_revenue: 28000000,
    bonding_capacity: 15000000,
    certifications: ['GANA', 'AAMA', 'IGMA']
  },
  {
    id: '6',
    name: 'Diverse Construction Solutions',
    trade_codes: ['Site Work', 'Demolition', 'Excavation'],
    type: 'sub',
    status: 'active',
    risk_score: 35,
    diversity_flags: { minority_owned: true, woman_owned: true, veteran_owned: false },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    website: 'https://diverseconstruction.com',
    address: '1892 Industrial Park Road, Atlanta, GA 30318',
    phone: '(404) 555-0289',
    employees: 85,
    annual_revenue: 18500000,
    bonding_capacity: 10000000,
    certifications: ['MBE', 'WBE', 'OSHA 30']
  },
  {
    id: '7',
    name: 'Hilti Corporation',
    trade_codes: ['Fasteners', 'Tools', 'Software'],
    type: 'supplier',
    status: 'active',
    risk_score: 5,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: false },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    website: 'https://hilti.com',
    address: '7250 Dallas Parkway, Plano, TX 75024',
    phone: '(918) 252-6000',
    employees: 32000,
    annual_revenue: 6200000000,
    bonding_capacity: 0,
    certifications: ['ISO 9001', 'ISO 14001']
  },
  {
    id: '8',
    name: 'Gensler',
    trade_codes: ['Architecture', 'Interior Design', 'Planning'],
    type: 'a/e',
    status: 'active',
    risk_score: 12,
    diversity_flags: { minority_owned: false, woman_owned: false, veteran_owned: false },
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    website: 'https://gensler.com',
    address: 'One Rockefeller Plaza, New York, NY 10020',
    phone: '(212) 492-1400',
    employees: 6000,
    annual_revenue: 1500000000,
    bonding_capacity: 0,
    certifications: ['AIA', 'LEED', 'WELL AP']
  }
];*/

const MOCK_OPPORTUNITIES: Opportunity[] = [];/*[
  { id: '1', company_id: '1', stage: 'prospect', est_value: 3200000, next_action_date: '2024-12-15', owner_id: 'user1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', description: 'Downtown Office Tower - General Contract' },
  { id: '2', company_id: '2', stage: 'shortlisted', est_value: 1850000, next_action_date: '2024-12-10', owner_id: 'user1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', description: 'High-Rise Steel Framework' },
  { id: '3', company_id: '3', stage: 'invited', est_value: 2100000, next_action_date: '2024-12-08', owner_id: 'user1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', description: 'MEP Systems Installation' },
  { id: '4', company_id: '4', stage: 'negotiation', est_value: 950000, next_action_date: '2024-12-05', owner_id: 'user1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', description: 'Foundation Concrete Work' },
  { id: '5', company_id: '5', stage: 'closed', est_value: 1400000, next_action_date: '2024-11-30', owner_id: 'user1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', description: 'Curtain Wall System' },
  { id: '6', company_id: '6', stage: 'shortlisted', est_value: 650000, next_action_date: '2024-12-12', owner_id: 'user1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', description: 'Site Preparation & Excavation' },
  { id: '7', company_id: '7', stage: 'invited', est_value: 180000, next_action_date: '2024-12-18', owner_id: 'user1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', description: 'Specialty Fasteners & Tools' },
  { id: '8', company_id: '8', stage: 'prospect', est_value: 850000, next_action_date: '2024-12-20', owner_id: 'user1', created_at: '2024-01-01T00:00:00Z', updated_at: '2024-01-01T00:00:00Z', description: 'Corporate Headquarters - Architectural Services' }
];*/

// Mock CRM service removed - now using useCRM hook
const mockCrmService = {
  getOpportunities: async (): Promise<OpportunityWithCompany[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return MOCK_OPPORTUNITIES.map(opp => {
      const company = MOCK_COMPANIES.find(c => c.id === opp.company_id);
      return {
        ...opp,
        company: company!
      };
    }).filter(opp => opp.company);
  },
  
  updateOpportunityStage: async (id: string, stage: OpportunityStage): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Updated opportunity ${id} to stage ${stage}`);
  }
};

const STAGE_COLUMNS: Record<OpportunityStage, { title: string; color: string }> = {
  prospect: { title: 'Prospects', color: 'bg-gray-100 border-gray-300' },
  shortlisted: { title: 'Shortlisted', color: 'bg-blue-100 border-blue-300' },
  invited: { title: 'Invited', color: 'bg-yellow-100 border-yellow-300' },
  negotiation: { title: 'Negotiation', color: 'bg-orange-100 border-orange-300' },
  closed: { title: 'Closed', color: 'bg-green-100 border-green-300' }
};

interface OpportunityWithCompany extends Opportunity {
  company: Company;
}

interface Filters {
  search: string;
  tradeCodes: string[];
  diversityFlags: string[];
}

const CrmKanban: React.FC = () => {
  const crmData = useCRM();
  const [filteredOpportunities, setFilteredOpportunities] = useState<OpportunityWithCompany[]>([]);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    tradeCodes: [],
    diversityFlags: []
  });
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { toast } = useToast();

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

  // Map opportunities with companies
  const opportunities = useMemo(() => {
    if (!crmData.opportunities || !crmData.companies) return [];
    return crmData.opportunities.map(opp => {
      const company = crmData.companies.find(c => c.id === opp.company_id);
      return {
        ...opp,
        company: company || {
          id: opp.company_id,
          name: 'Unknown Company',
          trade_codes: [],
          type: 'sub' as CompanyType,
          status: 'active' as CompanyStatus,
          risk_score: 0,
          diversity_flags: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      };
    }).filter(opp => opp.company);
  }, [crmData.opportunities, crmData.companies]);

  useEffect(() => {
    applyFilters();
  }, [opportunities, filters]);

  const applyFilters = () => {
    let filtered = [...opportunities];

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(opp => 
        opp.company.name.toLowerCase().includes(searchTerm)
      );
    }

    // Trade codes filter
    if (filters.tradeCodes.length > 0) {
      filtered = filtered.filter(opp =>
        opp.company.trade_codes?.some(code => 
          filters.tradeCodes.some(filterCode => 
            code.toLowerCase().includes(filterCode.toLowerCase())
          )
        )
      );
    }

    // Diversity flags filter
    if (filters.diversityFlags.length > 0) {
      filtered = filtered.filter(opp => {
        const companyFlags = Object.keys(opp.company.diversity_flags || {});
        return filters.diversityFlags.some(flag => 
          companyFlags.includes(flag)
        );
      });
    }

    setFilteredOpportunities(filtered);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;
    
    if (source.droppableId === destination.droppableId) return;

    const opportunityId = draggableId;
    const newStage = destination.droppableId as OpportunityStage;

    try {
      // Optimistic update
      setOpportunities(prev => 
        prev.map(opp => 
          opp.id === opportunityId 
            ? { ...opp, stage: newStage }
            : opp
        )
      );

      // Update in backend
      await mockCrmService.updateOpportunityStage(opportunityId, newStage);
    } catch (err) {
      console.error('Failed to update opportunity stage:', err);
      // Revert optimistic update
      loadOpportunities();
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 20) return 'bg-green-500';
    if (score <= 40) return 'bg-yellow-500';
    if (score <= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const groupOpportunitiesByStage = () => {
    const grouped: Record<OpportunityStage, OpportunityWithCompany[]> = {
      prospect: [],
      shortlisted: [],
      invited: [],
      negotiation: [],
      closed: []
    };

    filteredOpportunities.forEach(opp => {
      grouped[opp.stage].push(opp);
    });

    return grouped;
  };

  const OpportunityCard: React.FC<{ opportunity: OpportunityWithCompany; index: number }> = ({ 
    opportunity, 
    index 
  }) => (
    <Draggable draggableId={opportunity.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`
            bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-pointer
            hover:shadow-md transition-shadow duration-200
            ${snapshot.isDragging ? 'shadow-lg rotate-2' : ''}
          `}
          onClick={() => setSelectedCompany(opportunity.company)}
        >
          {/* Company Name */}
          <h3 className="font-semibold text-gray-900 mb-2 truncate">
            {opportunity.company.name}
          </h3>

          {/* Estimated Value */}
          <div className="flex items-center text-green-600 mb-2">
            <DollarSign className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">
              {formatCurrency(opportunity.est_value)}
            </span>
          </div>

          {/* Next Action Date */}
          <div className="flex items-center text-gray-600 mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span className="text-sm">
              {formatDate(opportunity.next_action_date)}
            </span>
          </div>

          {/* Risk Score Pill with Shield Icon */}
          <div className="flex items-center justify-between">
            <div className={`
              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white
              ${getRiskScoreColor(opportunity.company.risk_score)}
            `}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              Risk: {opportunity.company.risk_score || 'N/A'}
            </div>
            {/* Risk Shield Icon */}
            {opportunity.company.risk_score > 40 && (
              <div className="ml-2">
                <Shield className={`w-4 h-4 ${
                  opportunity.company.risk_score > 60 ? 'text-red-500' : 'text-orange-500'
                }`} title={`High risk vendor (Score: ${opportunity.company.risk_score})`} />
              </div>
            )}
          </div>

          {/* Trade Codes (if any) */}
          {opportunity.company.trade_codes && opportunity.company.trade_codes.length > 0 && (
            <div className="mt-2">
              <div className="flex flex-wrap gap-1">
                {opportunity.company.trade_codes.slice(0, 2).map((code, idx) => (
                  <span key={idx} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                    {code}
                  </span>
                ))}
                {opportunity.company.trade_codes.length > 2 && (
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                    +{opportunity.company.trade_codes.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
        <button 
          onClick={loadOpportunities}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const groupedOpportunities = groupOpportunitiesByStage();

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header with Search and Filters */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">CRM Pipeline</h1>
          <button
            onClick={loadOpportunities}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search companies..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trade Codes
            </label>
            <input
              type="text"
              placeholder="Enter trade codes (comma separated)"
              onChange={(e) => {
                const codes = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                setFilters(prev => ({ ...prev, tradeCodes: codes }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diversity Flags
            </label>
            <input
              type="text"
              placeholder="Enter diversity flags (comma separated)"
              onChange={(e) => {
                const flags = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                setFilters(prev => ({ ...prev, diversityFlags: flags }));
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 p-6 overflow-x-auto">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-6 min-w-max">
            {Object.entries(STAGE_COLUMNS).map(([stage, config]) => (
              <div key={stage} className="w-80 flex-shrink-0">
                <div className={`rounded-lg border-2 ${config.color} p-4 h-full`}>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-900">{config.title}</h2>
                    <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                      {groupedOpportunities[stage as OpportunityStage].length}
                    </span>
                  </div>

                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`
                          min-h-96 space-y-3
                          ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}
                        `}
                      >
                        {groupedOpportunities[stage as OpportunityStage].map((opportunity, index) => (
                          <OpportunityCard
                            key={opportunity.id}
                            opportunity={opportunity}
                            index={index}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* Company Profile Modal */}
      {selectedCompany && (
        <CompanyProfile
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
};

export default CrmKanban;
