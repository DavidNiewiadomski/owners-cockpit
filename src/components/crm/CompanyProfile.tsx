import React, { useState, useEffect } from 'react';

// Mock interfaces to match our CRM structure
interface Company {
  id: string;
  name: string;
  trade_codes: string[];
  type: string;
  status: string;
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

interface Contact {
  id: string;
  company_id: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  created_at: string;
  updated_at: string;
}

interface Interaction {
  id: string;
  company_id: string;
  contact_id?: string;
  user_id: string;
  type: string;
  date: string;
  medium?: string;
  notes?: string;
  ai_summary?: string;
  created_at: string;
  updated_at: string;
}

// Mock contacts and interactions for demonstration
const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    company_id: '1',
    name: 'Sarah Johnson',
    title: 'Senior Project Manager',
    email: 's.johnson@turner.com',
    phone: '(212) 229-6045',
    linkedin: 'sarah-johnson-turner',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    company_id: '1',
    name: 'Michael Chen',
    title: 'Procurement Director',
    email: 'm.chen@turner.com',
    phone: '(212) 229-6087',
    linkedin: 'michael-chen-construction',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

const MOCK_INTERACTIONS: Interaction[] = [
  {
    id: '1',
    company_id: '1',
    contact_id: '1',
    user_id: 'user1',
    type: 'call',
    date: '2024-11-28',
    medium: 'phone',
    notes: 'Initial qualification call. Discussed project requirements and timeline. Company shows strong interest and has relevant experience.',
    ai_summary: 'Positive initial contact. Company qualified for next stage.',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    company_id: '1',
    contact_id: '2',
    user_id: 'user1',
    type: 'email',
    date: '2024-11-25',
    medium: 'email',
    notes: 'Sent RFP documentation package. Requested prequalification forms and references. Response expected within 5 business days.',
    ai_summary: 'RFP package distributed. Awaiting prequalification documents.',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  X,
  Building,
  Phone,
  Mail,
  ExternalLink,
  MapPin,
  Users,
  TrendingUp,
  Shield,
  Award,
  Calendar,
  DollarSign,
  FileText,
  MessageSquare,
  Edit,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Briefcase,
  Target,
  Globe,
  User,
  BarChart3
} from 'lucide-react';
import ScorecardGallery from '@/components/procurement/ScorecardGallery';

interface CompanyProfileProps {
  company: Company;
  onClose: () => void;
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ company, onClose }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanyData();
  }, [company.id]);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Filter mock data by company ID
      const companyContacts = MOCK_CONTACTS.filter(c => c.company_id === company.id);
      const companyInteractions = MOCK_INTERACTIONS.filter(i => i.company_id === company.id);
      
      setContacts(companyContacts);
      setInteractions(companyInteractions);
    } catch (error) {
      console.error('Failed to load company data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score <= 20) return 'text-green-600 bg-green-100';
    if (score <= 40) return 'text-yellow-600 bg-yellow-100';
    if (score <= 60) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

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
      case 'a/e': return 'Architect/Engineer';
      default: return type;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDiversityBadges = () => {
    const badges = [];
    if (company.diversity_flags?.minority_owned) badges.push({ label: 'MBE', color: 'bg-purple-100 text-purple-700' });
    if (company.diversity_flags?.woman_owned) badges.push({ label: 'WBE', color: 'bg-pink-100 text-pink-700' });
    if (company.diversity_flags?.veteran_owned) badges.push({ label: 'VBE', color: 'bg-blue-100 text-blue-700' });
    return badges;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                {getCompanyTypeIcon(company.type)}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">{company.name}</h2>
                <div className="flex items-center gap-4 text-blue-100">
                  <span className="flex items-center gap-1">
                    {getCompanyTypeIcon(company.type)}
                    {getCompanyTypeLabel(company.type)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    {company.status}
                  </span>
                </div>
                
                {/* Diversity Badges */}
                <div className="flex gap-2 mt-3">
                  {getDiversityBadges().map((badge, index) => (
                    <span key={index} className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
              <TabsTrigger value="interactions">Activity ({interactions.length})</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {(company as any).phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{(company as any).phone}</span>
                      </div>
                    )}
                    {(company as any).website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <a href={(company as any).website} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline flex items-center gap-1">
                          {(company as any).website}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {(company as any).address && (
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                        <span>{(company as any).address}</span>
                      </div>
                    )}
                    {(company as any).employees && (
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{(company as any).employees.toLocaleString()} employees</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Risk & Performance */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Risk Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Risk Score</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskScoreColor(company.risk_score)}`}>
                        {company.risk_score}/100
                      </span>
                    </div>
                    <Progress value={company.risk_score} className="h-2" />
                    
                    {(company as any).annual_revenue && (
                      <div className="flex items-center justify-between">
                        <span>Annual Revenue</span>
                        <span className="font-medium">{formatCurrency((company as any).annual_revenue)}</span>
                      </div>
                    )}
                    
                    {(company as any).bonding_capacity && (company as any).bonding_capacity > 0 && (
                      <div className="flex items-center justify-between">
                        <span>Bonding Capacity</span>
                        <span className="font-medium">{formatCurrency((company as any).bonding_capacity)}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Trade Codes */}
              {company.trade_codes && company.trade_codes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Trade Codes & Specialties
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {company.trade_codes.map((code, index) => (
                        <Badge key={index} variant="outline">{code}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Certifications */}
              {(company as any).certifications && (company as any).certifications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Certifications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {(company as any).certifications.map((cert: string, index: number) => (
                        <Badge key={index} className="bg-green-100 text-green-700">{cert}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="contacts" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : contacts.length > 0 ? (
                <div className="grid gap-4">
                  {contacts.map((contact) => (
                    <Card key={contact.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${contact.name}`} />
                            <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold">{contact.name}</h4>
                            {contact.title && <p className="text-sm text-gray-600">{contact.title}</p>}
                            <div className="flex items-center gap-4 mt-2">
                              {contact.email && (
                                <a href={`mailto:${contact.email}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                                  <Mail className="w-3 h-3" />
                                  {contact.email}
                                </a>
                              )}
                              {contact.phone && (
                                <a href={`tel:${contact.phone}`} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                                  <Phone className="w-3 h-3" />
                                  {contact.phone}
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No contacts found</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="interactions" className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : interactions.length > 0 ? (
                <div className="space-y-4">
                  {interactions.map((interaction) => (
                    <Card key={interaction.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            {interaction.type === 'call' && <Phone className="w-4 h-4 text-blue-600" />}
                            {interaction.type === 'email' && <Mail className="w-4 h-4 text-blue-600" />}
                            {interaction.type === 'meeting' && <Calendar className="w-4 h-4 text-blue-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium capitalize">{interaction.type}</span>
                              <span className="text-sm text-gray-500">{formatDate(interaction.date)}</span>
                            </div>
                            {interaction.medium && (
                              <p className="text-sm text-gray-600 mb-2">via {interaction.medium}</p>
                            )}
                            {interaction.notes && (
                              <p className="text-sm mb-2">{interaction.notes}</p>
                            )}
                            {interaction.ai_summary && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <p className="text-sm text-blue-800">
                                  <strong>AI Summary:</strong> {interaction.ai_summary}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No interactions recorded</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              {/* Performance Scorecard Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      Performance Scorecard
                    </div>
                    <ScorecardGallery 
                      companyId={company.id}
                      companyName={company.name}
                      trigger={
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Detailed Scorecard
                        </Button>
                      }
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive performance analysis with KPI tracking, trends, and AI-generated insights.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">92.5</div>
                      <div className="text-sm text-gray-600">Overall Score</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">↗ +3.2</div>
                      <div className="text-sm text-gray-600">Trend</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Overall Rating</span>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">4.8/5</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>On-time Delivery</span>
                      <span className="text-green-600 font-medium">96%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Quality Score</span>
                      <span className="text-green-600 font-medium">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Safety Record</span>
                      <span className="text-green-600 font-medium">Excellent</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-5 h-5" />
                      Financial Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Credit Rating</span>
                      <Badge className="bg-green-100 text-green-700">A+</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Payment Terms</span>
                      <span>Net 30</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Insurance Status</span>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Current
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer Actions */}
        <div className="border-t bg-gray-50 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Last updated: {formatDate(company.updated_at)}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Company
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="w-4 h-4 mr-2" />
              Add Interaction
            </Button>
            <Button onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;

