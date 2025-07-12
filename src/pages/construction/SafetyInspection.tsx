import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  Calendar,
  User,
  FileText,
  Download,
  Plus,
  Camera,
  Activity,
  HardHat
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';

interface InspectionItem {
  id: string;
  category: string;
  item: string;
  status: 'pass' | 'fail' | 'pending' | 'na';
  severity?: 'low' | 'medium' | 'high' | 'critical';
  notes?: string;
  lastChecked?: string;
}

interface SafetyIncident {
  id: string;
  date: string;
  type: string;
  severity: string;
  description: string;
  corrective: string;
  status: 'open' | 'closed';
}

const SafetyInspection: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Inspection checklist items
  const inspectionItems: InspectionItem[] = [
    // PPE Category
    {
      id: '1',
      category: 'PPE Compliance',
      item: 'Hard hats worn in designated areas',
      status: 'pass',
      lastChecked: '2024-12-15'
    },
    {
      id: '2',
      category: 'PPE Compliance',
      item: 'Safety glasses/goggles available and used',
      status: 'pass',
      lastChecked: '2024-12-15'
    },
    {
      id: '3',
      category: 'PPE Compliance',
      item: 'High-visibility vests worn',
      status: 'fail',
      severity: 'medium',
      notes: '3 workers without vests on Floor 8',
      lastChecked: '2024-12-15'
    },
    // Fall Protection
    {
      id: '4',
      category: 'Fall Protection',
      item: 'Guardrails installed at all openings',
      status: 'pass',
      lastChecked: '2024-12-14'
    },
    {
      id: '5',
      category: 'Fall Protection',
      item: 'Safety harnesses inspected and tagged',
      status: 'pass',
      lastChecked: '2024-12-14'
    },
    {
      id: '6',
      category: 'Fall Protection',
      item: 'Hole covers secured and marked',
      status: 'pending',
      notes: 'Inspection scheduled for today'
    },
    // Fire Safety
    {
      id: '7',
      category: 'Fire Safety',
      item: 'Fire extinguishers accessible and tagged',
      status: 'pass',
      lastChecked: '2024-12-13'
    },
    {
      id: '8',
      category: 'Fire Safety',
      item: 'Emergency exits clear and marked',
      status: 'pass',
      lastChecked: '2024-12-13'
    },
    {
      id: '9',
      category: 'Fire Safety',
      item: 'Hot work permits current',
      status: 'fail',
      severity: 'high',
      notes: 'Expired permit found for welding on Floor 9',
      lastChecked: '2024-12-15'
    },
    // Housekeeping
    {
      id: '10',
      category: 'Housekeeping',
      item: 'Walkways clear of debris',
      status: 'pass',
      lastChecked: '2024-12-15'
    },
    {
      id: '11',
      category: 'Housekeeping',
      item: 'Materials properly stored',
      status: 'pass',
      lastChecked: '2024-12-15'
    },
    {
      id: '12',
      category: 'Housekeeping',
      item: 'Waste disposal areas maintained',
      status: 'pending'
    }
  ];

  // Recent incidents
  const recentIncidents: SafetyIncident[] = [
    {
      id: '1',
      date: '2024-12-10',
      type: 'Near Miss',
      severity: 'Medium',
      description: 'Tool dropped from Floor 8, no injuries',
      corrective: 'Tool tethering policy reinforced',
      status: 'closed'
    },
    {
      id: '2',
      date: '2024-12-05',
      type: 'Minor Injury',
      severity: 'Low',
      description: 'Cut on hand from sharp edge',
      corrective: 'Edge protection installed',
      status: 'closed'
    }
  ];

  // Calculate statistics
  const totalItems = inspectionItems.length;
  const passedItems = inspectionItems.filter(i => i.status === 'pass').length;
  const failedItems = inspectionItems.filter(i => i.status === 'fail').length;
  const pendingItems = inspectionItems.filter(i => i.status === 'pending').length;
  const complianceRate = Math.round((passedItems / (totalItems - pendingItems)) * 100);

  // Filter items
  const filteredItems = inspectionItems.filter(item => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'issues') return item.status === 'fail';
    return item.category === selectedCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'bg-green-100 text-green-700';
      case 'fail': return 'bg-red-100 text-red-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'na': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Safety Inspection Checklist
            </h1>
            <p className="text-muted-foreground mt-1">
              Daily safety inspections, compliance tracking, and incident management
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              New Inspection
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Compliance Rate</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{complianceRate}%</div>
              <Progress value={complianceRate} className="mt-2" />
              <div className="text-xs text-muted-foreground mt-1">
                {passedItems} of {totalItems - pendingItems} items pass
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Issues</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{failedItems}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Require immediate attention
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Days Without Incident</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">6</div>
              <div className="text-xs text-muted-foreground mt-1">
                Last incident: Dec 10
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Inspections</CardTitle>
              <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{pendingItems}</div>
              <div className="text-xs text-muted-foreground mt-1">
                To be completed today
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Filters */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                All Items
              </Button>
              <Button
                variant={selectedCategory === 'issues' ? 'destructive' : 'outline'}
                onClick={() => setSelectedCategory('issues')}
                size="sm"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Issues Only
              </Button>
              <Button
                variant={selectedCategory === 'PPE Compliance' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('PPE Compliance')}
                size="sm"
              >
                PPE Compliance
              </Button>
              <Button
                variant={selectedCategory === 'Fall Protection' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('Fall Protection')}
                size="sm"
              >
                Fall Protection
              </Button>
              <Button
                variant={selectedCategory === 'Fire Safety' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('Fire Safety')}
                size="sm"
              >
                Fire Safety
              </Button>
              <Button
                variant={selectedCategory === 'Housekeeping' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('Housekeeping')}
                size="sm"
              >
                Housekeeping
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Inspection Checklist */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5 text-muted-foreground" />
              Safety Inspection Checklist
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                  <div className="flex items-start gap-4">
                    <Checkbox 
                      checked={item.status === 'pass'} 
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-medium text-foreground">{item.item}</span>
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                        {item.severity && (
                          <Badge className={getSeverityColor(item.severity)}>
                            {item.severity} priority
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{item.category}</span>
                        {item.lastChecked && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Last checked: {item.lastChecked}
                          </span>
                        )}
                      </div>
                      {item.notes && (
                        <div className="mt-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                          Note: {item.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Camera className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents & Training */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-muted-foreground" />
                Recent Safety Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentIncidents.map((incident) => (
                  <div key={incident.id} className="p-3 rounded-lg border border-border bg-card/50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm text-foreground">{incident.type}</span>
                          <Badge className={getSeverityColor(incident.severity.toLowerCase())}>
                            {incident.severity}
                          </Badge>
                          <Badge variant={incident.status === 'closed' ? 'default' : 'secondary'}>
                            {incident.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">{incident.description}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          <span className="text-green-400">Corrective Action:</span> {incident.corrective}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {incident.date}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardHat className="h-5 w-5 text-muted-foreground" />
                Safety Training Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-foreground">Fall Protection Training</span>
                    <Badge className="bg-green-100 text-green-700">Current</Badge>
                  </div>
                  <Progress value={95} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">145 of 153 workers certified</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-foreground">OSHA 10-Hour</span>
                    <Badge className="bg-green-100 text-green-700">Current</Badge>
                  </div>
                  <Progress value={100} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">All workers certified</div>
                </div>
                <div className="p-3 rounded-lg border border-border bg-card/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-foreground">First Aid/CPR</span>
                    <Badge className="bg-yellow-100 text-yellow-700">Expiring Soon</Badge>
                  </div>
                  <Progress value={78} className="h-2" />
                  <div className="text-xs text-muted-foreground mt-1">24 certifications expire this month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default SafetyInspection;