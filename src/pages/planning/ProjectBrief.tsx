import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Target,
  Users,
  DollarSign,
  Calendar,
  Building,
  MapPin,
  Download,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';

interface ProjectObjective {
  id: string;
  objective: string;
  priority: 'high' | 'medium' | 'low';
  status: 'achieved' | 'in-progress' | 'at-risk';
  owner: string;
}

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  organization: string;
  influence: 'high' | 'medium' | 'low';
  supportLevel: 'champion' | 'supportive' | 'neutral' | 'resistant';
}

const ProjectBrief: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock project data
  const projectData = {
    name: 'Metro Plaza Mixed-Use Development',
    type: 'Commercial Mixed-Use',
    location: '1200 Main Street, Metro City',
    client: 'Metro Development Partners LLC',
    architect: 'Stellar Architecture Group',
    contractor: 'BuildRight Construction',
    startDate: '2024-01-15',
    completionDate: '2025-06-30',
    totalBudget: 35000000,
    totalArea: '125,000 sq ft',
    floors: 15,
    units: {
      retail: '25,000 sq ft',
      office: '75,000 sq ft',
      residential: '25,000 sq ft (30 units)'
    }
  };

  const objectives: ProjectObjective[] = [
    {
      id: '1',
      objective: 'Achieve LEED Gold certification for sustainable design',
      priority: 'high',
      status: 'in-progress',
      owner: 'Design Team'
    },
    {
      id: '2',
      objective: 'Complete construction within 18-month timeline',
      priority: 'high',
      status: 'in-progress',
      owner: 'Project Manager'
    },
    {
      id: '3',
      objective: 'Maintain project budget within 2% variance',
      priority: 'high',
      status: 'achieved',
      owner: 'Finance Team'
    },
    {
      id: '4',
      objective: 'Achieve 50% pre-leasing before completion',
      priority: 'medium',
      status: 'in-progress',
      owner: 'Leasing Team'
    },
    {
      id: '5',
      objective: 'Zero safety incidents throughout construction',
      priority: 'high',
      status: 'in-progress',
      owner: 'Safety Manager'
    }
  ];

  const stakeholders: Stakeholder[] = [
    {
      id: '1',
      name: 'John Anderson',
      role: 'Owner Representative',
      organization: 'Metro Development Partners',
      influence: 'high',
      supportLevel: 'champion'
    },
    {
      id: '2',
      name: 'Sarah Mitchell',
      role: 'Project Manager',
      organization: 'BuildRight Construction',
      influence: 'high',
      supportLevel: 'champion'
    },
    {
      id: '3',
      name: 'David Chen',
      role: 'Lead Architect',
      organization: 'Stellar Architecture',
      influence: 'high',
      supportLevel: 'supportive'
    },
    {
      id: '4',
      name: 'City Planning Commission',
      role: 'Regulatory Body',
      organization: 'City of Metro',
      influence: 'high',
      supportLevel: 'neutral'
    },
    {
      id: '5',
      name: 'Neighborhood Association',
      role: 'Community Representative',
      organization: 'Downtown Residents Assoc.',
      influence: 'medium',
      supportLevel: 'neutral'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'achieved': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'at-risk': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSupportColor = (level: string) => {
    switch (level) {
      case 'champion': return 'bg-green-100 text-green-700';
      case 'supportive': return 'bg-blue-100 text-blue-700';
      case 'neutral': return 'bg-yellow-100 text-yellow-700';
      case 'resistant': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Project Brief
            </h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive overview of project scope, objectives, and stakeholders
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Brief
            </Button>
          </div>
        </div>

        {/* Project Header Card */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{projectData.name}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {projectData.type}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {projectData.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {projectData.startDate} - {projectData.completionDate}
                  </span>
                </div>
              </div>
              <Badge className="bg-blue-100 text-blue-700">Active Project</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="objectives">Objectives</TabsTrigger>
            <TabsTrigger value="stakeholders">Stakeholders</TabsTrigger>
            <TabsTrigger value="scope">Scope & Requirements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    Project Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    ${(projectData.totalBudget / 1000000).toFixed(1)}M
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Total investment
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    Total Area
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {projectData.totalArea}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {projectData.floors} floors
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    18 months
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Construction duration
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Project Description</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground">
                  Metro Plaza is a state-of-the-art mixed-use development located in the heart of downtown Metro City. 
                  The project combines premium office space, luxury residential units, and street-level retail to create 
                  a vibrant urban destination.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-foreground mb-2">Retail Space</h4>
                    <p className="text-2xl font-bold text-foreground">{projectData.units.retail}</p>
                    <p className="text-sm text-muted-foreground">Ground floor & mezzanine</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-foreground mb-2">Office Space</h4>
                    <p className="text-2xl font-bold text-foreground">{projectData.units.office}</p>
                    <p className="text-sm text-muted-foreground">Floors 2-10</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium text-foreground mb-2">Residential</h4>
                    <p className="text-2xl font-bold text-foreground">{projectData.units.residential}</p>
                    <p className="text-sm text-muted-foreground">Floors 11-15</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Key Project Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-border">
                    <div className="text-sm text-muted-foreground mb-1">Client</div>
                    <div className="font-medium text-foreground">{projectData.client}</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <div className="text-sm text-muted-foreground mb-1">Architect</div>
                    <div className="font-medium text-foreground">{projectData.architect}</div>
                  </div>
                  <div className="p-4 rounded-lg border border-border">
                    <div className="text-sm text-muted-foreground mb-1">General Contractor</div>
                    <div className="font-medium text-foreground">{projectData.contractor}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Objectives Tab */}
          <TabsContent value="objectives" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-muted-foreground" />
                    Project Objectives
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-muted-foreground">1 achieved</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {objectives.map((obj) => (
                    <div key={obj.id} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-foreground mb-2">{obj.objective}</p>
                          <div className="flex items-center gap-3 text-sm">
                            <Badge className={getPriorityColor(obj.priority)}>
                              {obj.priority} priority
                            </Badge>
                            <Badge className={getStatusColor(obj.status)}>
                              {obj.status}
                            </Badge>
                            <span className="text-muted-foreground">Owner: {obj.owner}</span>
                          </div>
                        </div>
                        {obj.status === 'achieved' && (
                          <CheckCircle2 className="h-5 w-5 text-green-400 ml-4" />
                        )}
                        {obj.status === 'at-risk' && (
                          <AlertTriangle className="h-5 w-5 text-red-400 ml-4" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stakeholders Tab */}
          <TabsContent value="stakeholders" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  Key Stakeholders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stakeholders.map((stakeholder) => (
                    <div key={stakeholder.id} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-foreground">{stakeholder.name}</h4>
                          <p className="text-sm text-muted-foreground">{stakeholder.role}</p>
                          <p className="text-sm text-muted-foreground">{stakeholder.organization}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getSupportColor(stakeholder.supportLevel)}>
                            {stakeholder.supportLevel}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-2">
                            {stakeholder.influence} influence
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scope Tab */}
          <TabsContent value="scope" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Project Scope</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium text-foreground mb-3">In Scope</h4>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                      <span>Complete architectural design and engineering for 15-story mixed-use building</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                      <span>Construction of structural frame, building envelope, and all interior spaces</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                      <span>Installation of all MEP systems including HVAC, electrical, plumbing, and fire protection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                      <span>Site development including parking, landscaping, and utility connections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                      <span>LEED Gold certification requirements and sustainable design features</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">Out of Scope</h4>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                      <span>Tenant fit-out beyond base building standards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                      <span>Furniture, fixtures, and equipment (FF&E) for individual tenants</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                      <span>Marketing and leasing activities</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-3">Key Requirements</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-blue-400" />
                        <span className="font-medium text-foreground">Performance</span>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Energy efficiency 30% above baseline</li>
                        <li>• Class A office specifications</li>
                        <li>• Smart building technology integration</li>
                      </ul>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                        <span className="font-medium text-foreground">Compliance</span>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Local building codes and zoning</li>
                        <li>• ADA accessibility requirements</li>
                        <li>• Environmental impact standards</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProjectBrief;