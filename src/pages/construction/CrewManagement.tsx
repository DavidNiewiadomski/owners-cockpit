import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import {
  Users,
  UserPlus,
  Calendar,
  Clock,
  HardHat,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  Download,
  Phone,
  Mail
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';

interface CrewMember {
  id: string;
  name: string;
  role: string;
  trade: string;
  company: string;
  status: 'active' | 'on-break' | 'off-site';
  hoursToday: number;
  hoursWeek: number;
  certifications: string[];
  phone: string;
  email: string;
  safetyScore: number;
}

const CrewManagement: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('all');

  // Mock crew data
  const crewMembers: CrewMember[] = [
    {
      id: '1',
      name: 'John Martinez',
      role: 'Foreman',
      trade: 'General Construction',
      company: 'Metro Construction LLC',
      status: 'active',
      hoursToday: 8,
      hoursWeek: 40,
      certifications: ['OSHA 30', 'First Aid', 'Crane Operator'],
      phone: '(555) 123-4567',
      email: 'j.martinez@metroconstruction.com',
      safetyScore: 98
    },
    {
      id: '2',
      name: 'Sarah Chen',
      role: 'Lead Electrician',
      trade: 'Electrical',
      company: 'Bright Electric Co.',
      status: 'active',
      hoursToday: 7.5,
      hoursWeek: 38,
      certifications: ['Master Electrician', 'OSHA 10'],
      phone: '(555) 234-5678',
      email: 's.chen@brightelectric.com',
      safetyScore: 100
    },
    {
      id: '3',
      name: 'Michael Johnson',
      role: 'Plumber',
      trade: 'Plumbing',
      company: 'ProPlumb Services',
      status: 'on-break',
      hoursToday: 6,
      hoursWeek: 35,
      certifications: ['Journeyman Plumber', 'Backflow Prevention'],
      phone: '(555) 345-6789',
      email: 'm.johnson@proplumb.com',
      safetyScore: 95
    },
    {
      id: '4',
      name: 'David Kim',
      role: 'HVAC Technician',
      trade: 'Mechanical',
      company: 'Climate Control Systems',
      status: 'active',
      hoursToday: 8,
      hoursWeek: 42,
      certifications: ['EPA Universal', 'NATE Certified'],
      phone: '(555) 456-7890',
      email: 'd.kim@climatecontrol.com',
      safetyScore: 97
    },
    {
      id: '5',
      name: 'Lisa Thompson',
      role: 'Safety Manager',
      trade: 'Safety',
      company: 'Metro Construction LLC',
      status: 'active',
      hoursToday: 8,
      hoursWeek: 40,
      certifications: ['CSP', 'OSHA 500', 'EMT'],
      phone: '(555) 567-8901',
      email: 'l.thompson@metroconstruction.com',
      safetyScore: 100
    }
  ];

  // Summary statistics
  const totalCrew = crewMembers.length;
  const activeCrew = crewMembers.filter(m => m.status === 'active').length;
  const totalHoursToday = crewMembers.reduce((sum, m) => sum + m.hoursToday, 0);
  const avgSafetyScore = Math.round(crewMembers.reduce((sum, m) => sum + m.safetyScore, 0) / totalCrew);

  // Filter crew members
  const filteredCrew = crewMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrade = selectedTrade === 'all' || member.trade === selectedTrade;
    return matchesSearch && matchesTrade;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'on-break': return 'bg-yellow-100 text-yellow-700';
      case 'off-site': return 'bg-gray-100 text-gray-700';
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
              Crew Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage workforce, track hours, and monitor safety compliance
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add Crew Member
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Crew</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalCrew}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {activeCrew} active on site
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Hours Today</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalHoursToday}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Total workforce hours
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Safety Score</CardTitle>
              <HardHat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{avgSafetyScore}%</div>
              <div className="text-xs text-muted-foreground mt-1">
                Average compliance
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Certifications</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">100%</div>
              <div className="text-xs text-muted-foreground mt-1">
                All required certs valid
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search by name, role, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedTrade === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedTrade('all')}
                  size="sm"
                >
                  All Trades
                </Button>
                <Button
                  variant={selectedTrade === 'Electrical' ? 'default' : 'outline'}
                  onClick={() => setSelectedTrade('Electrical')}
                  size="sm"
                >
                  Electrical
                </Button>
                <Button
                  variant={selectedTrade === 'Plumbing' ? 'default' : 'outline'}
                  onClick={() => setSelectedTrade('Plumbing')}
                  size="sm"
                >
                  Plumbing
                </Button>
                <Button
                  variant={selectedTrade === 'Mechanical' ? 'default' : 'outline'}
                  onClick={() => setSelectedTrade('Mechanical')}
                  size="sm"
                >
                  Mechanical
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Crew List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Active Crew Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCrew.map((member) => (
                <div key={member.id} className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">{member.name}</h3>
                        <Badge className={getStatusColor(member.status)}>
                          {member.status}
                        </Badge>
                        <Badge variant="outline">{member.trade}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Role:</span>
                          <span className="ml-2 text-foreground">{member.role}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Company:</span>
                          <span className="ml-2 text-foreground">{member.company}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Hours Today:</span>
                          <span className="ml-2 text-foreground">{member.hoursToday}h</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Week Total:</span>
                          <span className="ml-2 text-foreground">{member.hoursWeek}h</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {member.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <div className="text-sm text-muted-foreground mb-1">Safety Score</div>
                      <div className="text-2xl font-bold text-green-400">{member.safetyScore}%</div>
                      <Progress value={member.safetyScore} className="w-20 h-2 mt-1" />
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Trade Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-muted-foreground" />
                Trade Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">General Construction</span>
                  <div className="flex items-center gap-2">
                    <Progress value={40} className="w-20" />
                    <span className="text-sm text-muted-foreground">2</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Electrical</span>
                  <div className="flex items-center gap-2">
                    <Progress value={20} className="w-20" />
                    <span className="text-sm text-muted-foreground">1</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Plumbing</span>
                  <div className="flex items-center gap-2">
                    <Progress value={20} className="w-20" />
                    <span className="text-sm text-muted-foreground">1</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">Mechanical</span>
                  <div className="flex items-center gap-2">
                    <Progress value={20} className="w-20" />
                    <span className="text-sm text-muted-foreground">1</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                Alerts & Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Certification Expiring</div>
                      <div className="text-xs text-muted-foreground">John Martinez's OSHA 30 expires in 30 days</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/10">
                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 text-blue-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Overtime Alert</div>
                      <div className="text-xs text-muted-foreground">2 crew members approaching 50 hours this week</div>
                    </div>
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-foreground">Safety Milestone</div>
                      <div className="text-xs text-muted-foreground">100 days without incidents</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CrewManagement;