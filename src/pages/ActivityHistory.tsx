import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Activity,
  Calendar,
  Filter,
  Download,
  Clock,
  User,
  FileText,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Building,
  Briefcase,
  MessageSquare,
  TrendingUp,
  Shield,
  Search
} from 'lucide-react';
import MainLayout from '@/components/MainLayout';

interface ActivityItem {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  category: 'construction' | 'finance' | 'legal' | 'planning' | 'communication' | 'system';
  description: string;
  relatedItem?: string;
  impact?: 'high' | 'medium' | 'low';
  status?: 'completed' | 'pending' | 'failed';
}

interface ActivitySummary {
  category: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
}

const ActivityHistory: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7days');

  // Mock activity data
  const activities: ActivityItem[] = [
    {
      id: '1',
      timestamp: '2024-12-20 14:30:00',
      user: 'John Anderson',
      userRole: 'Owner',
      action: 'Approved Change Order',
      category: 'construction',
      description: 'Approved change order #CO-2024-045 for additional structural reinforcement',
      relatedItem: 'Metro Plaza Development',
      impact: 'high',
      status: 'completed'
    },
    {
      id: '2',
      timestamp: '2024-12-20 11:45:00',
      user: 'Sarah Mitchell',
      userRole: 'Project Manager',
      action: 'Updated Schedule',
      category: 'planning',
      description: 'Revised construction schedule for Phase 3 completion',
      relatedItem: 'Metro Plaza Development',
      impact: 'medium',
      status: 'completed'
    },
    {
      id: '3',
      timestamp: '2024-12-20 10:15:00',
      user: 'Michael Chen',
      userRole: 'Finance Director',
      action: 'Processed Payment',
      category: 'finance',
      description: 'Processed payment of $1.25M to BuildRight Construction',
      relatedItem: 'Invoice #INV-2024-0156',
      impact: 'high',
      status: 'completed'
    },
    {
      id: '4',
      timestamp: '2024-12-20 09:30:00',
      user: 'System',
      userRole: 'Automated',
      action: 'Safety Alert',
      category: 'system',
      description: 'Generated safety compliance reminder for upcoming OSHA inspection',
      relatedItem: 'All Projects',
      impact: 'medium',
      status: 'pending'
    },
    {
      id: '5',
      timestamp: '2024-12-19 16:20:00',
      user: 'David Chen',
      userRole: 'Architect',
      action: 'Submitted Design Revision',
      category: 'planning',
      description: 'Submitted revised lobby design plans for owner review',
      relatedItem: 'Metro Plaza Development',
      impact: 'medium',
      status: 'pending'
    },
    {
      id: '6',
      timestamp: '2024-12-19 15:00:00',
      user: 'Lisa Wong',
      userRole: 'Legal Counsel',
      action: 'Contract Review',
      category: 'legal',
      description: 'Completed review of subcontractor agreement with Metro Steel Supply',
      relatedItem: 'Contract #CTR-2024-089',
      impact: 'medium',
      status: 'completed'
    },
    {
      id: '7',
      timestamp: '2024-12-19 14:00:00',
      user: 'Tom Johnson',
      userRole: 'Safety Manager',
      action: 'Inspection Report',
      category: 'construction',
      description: 'Completed weekly safety inspection - no violations found',
      relatedItem: 'Metro Plaza Development',
      impact: 'low',
      status: 'completed'
    },
    {
      id: '8',
      timestamp: '2024-12-19 11:30:00',
      user: 'Emily Davis',
      userRole: 'Communications',
      action: 'Stakeholder Update',
      category: 'communication',
      description: 'Sent monthly progress update to all stakeholders and investors',
      relatedItem: 'All Projects',
      impact: 'low',
      status: 'completed'
    },
    {
      id: '9',
      timestamp: '2024-12-19 10:00:00',
      user: 'Robert Smith',
      userRole: 'Construction Manager',
      action: 'Material Order',
      category: 'construction',
      description: 'Placed order for structural steel - Batch 3',
      relatedItem: 'Metro Plaza Development',
      impact: 'high',
      status: 'completed'
    },
    {
      id: '10',
      timestamp: '2024-12-18 16:45:00',
      user: 'System',
      userRole: 'Automated',
      action: 'Budget Alert',
      category: 'system',
      description: 'Project approaching 75% budget utilization threshold',
      relatedItem: 'Tech Hub Renovation',
      impact: 'high',
      status: 'pending'
    }
  ];

  // Mock activity summary data
  const activitySummaries: ActivitySummary[] = [
    { category: 'Construction', count: 125, percentage: 35, trend: 'up', trendValue: 12 },
    { category: 'Finance', count: 87, percentage: 24, trend: 'up', trendValue: 8 },
    { category: 'Planning', count: 65, percentage: 18, trend: 'stable', trendValue: 0 },
    { category: 'Legal', count: 43, percentage: 12, trend: 'down', trendValue: -5 },
    { category: 'Communication', count: 32, percentage: 9, trend: 'up', trendValue: 15 },
    { category: 'System', count: 8, percentage: 2, trend: 'stable', trendValue: 0 }
  ];

  // Calculate statistics
  const totalActivities = activities.length;
  const todayActivities = activities.filter(a => a.timestamp.includes('2024-12-20')).length;
  const pendingActions = activities.filter(a => a.status === 'pending').length;
  const highImpactActions = activities.filter(a => a.impact === 'high').length;

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    if (selectedCategory === 'all') return true;
    return activity.category === selectedCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'construction': return <Building className="h-4 w-4" />;
      case 'finance': return <DollarSign className="h-4 w-4" />;
      case 'legal': return <Briefcase className="h-4 w-4" />;
      case 'planning': return <Calendar className="h-4 w-4" />;
      case 'communication': return <MessageSquare className="h-4 w-4" />;
      case 'system': return <Shield className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'construction': return 'bg-blue-100 text-blue-700';
      case 'finance': return 'bg-green-100 text-green-700';
      case 'legal': return 'bg-purple-100 text-purple-700';
      case 'planning': return 'bg-orange-100 text-orange-700';
      case 'communication': return 'bg-cyan-100 text-cyan-700';
      case 'system': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getImpactColor = (impact?: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-400" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default: return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + 
        ` at ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Activity History
            </h1>
            <p className="text-muted-foreground mt-1">
              Track all project activities and system events
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Log
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Activities</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalActivities}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Last 7 days
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Today's Actions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{todayActivities}</div>
              <div className="text-xs text-muted-foreground mt-1">
                So far today
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Actions</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{pendingActions}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Require attention
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">High Impact</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{highImpactActions}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Critical actions
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="timeline" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="timeline">Activity Timeline</TabsTrigger>
            <TabsTrigger value="summary">Category Summary</TabsTrigger>
            <TabsTrigger value="users">User Activity</TabsTrigger>
          </TabsList>

          {/* Timeline Tab */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Activities</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedTimeframe === '24hours' ? 'default' : 'outline'}
                      onClick={() => setSelectedTimeframe('24hours')}
                      size="sm"
                    >
                      24 Hours
                    </Button>
                    <Button
                      variant={selectedTimeframe === '7days' ? 'default' : 'outline'}
                      onClick={() => setSelectedTimeframe('7days')}
                      size="sm"
                    >
                      7 Days
                    </Button>
                    <Button
                      variant={selectedTimeframe === '30days' ? 'default' : 'outline'}
                      onClick={() => setSelectedTimeframe('30days')}
                      size="sm"
                    >
                      30 Days
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-6">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('all')}
                    size="sm"
                  >
                    All Categories
                  </Button>
                  <Button
                    variant={selectedCategory === 'construction' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('construction')}
                    size="sm"
                  >
                    Construction
                  </Button>
                  <Button
                    variant={selectedCategory === 'finance' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('finance')}
                    size="sm"
                  >
                    Finance
                  </Button>
                  <Button
                    variant={selectedCategory === 'legal' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('legal')}
                    size="sm"
                  >
                    Legal
                  </Button>
                  <Button
                    variant={selectedCategory === 'planning' ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory('planning')}
                    size="sm"
                  >
                    Planning
                  </Button>
                </div>

                <div className="space-y-4">
                  {filteredActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card/50 hover:bg-card/70 transition-colors">
                      <div className="mt-1">
                        <div className={`p-2 rounded-lg ${getCategoryColor(activity.category)}`}>
                          {getCategoryIcon(activity.category)}
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground">{activity.action}</h4>
                              {activity.status && getStatusIcon(activity.status)}
                              {activity.impact && (
                                <span className={`text-xs ${getImpactColor(activity.impact)}`}>
                                  {activity.impact} impact
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatTimestamp(activity.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span>{activity.user}</span>
                            <span>({activity.userRole})</span>
                          </div>
                          {activity.relatedItem && (
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{activity.relatedItem}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Category Summary Tab */}
          <TabsContent value="summary">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Activity by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activitySummaries.map((summary, index) => (
                    <div key={index} className="p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getCategoryColor(summary.category.toLowerCase())}`}>
                            {getCategoryIcon(summary.category.toLowerCase())}
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{summary.category}</h4>
                            <p className="text-sm text-muted-foreground">{summary.count} activities</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">{summary.percentage}%</div>
                          <div className="flex items-center gap-1 text-xs">
                            {summary.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-400" />}
                            {summary.trend === 'down' && <TrendingUp className="h-3 w-3 text-red-400 rotate-180" />}
                            {summary.trend === 'stable' && <Activity className="h-3 w-3 text-yellow-400" />}
                            <span className={`${summary.trend === 'up' ? 'text-green-400' : summary.trend === 'down' ? 'text-red-400' : 'text-yellow-400'}`}>
                              {summary.trend === 'up' ? '+' : summary.trend === 'down' ? '' : ''}{summary.trendValue}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${summary.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Activity Tab */}
          <TabsContent value="users">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Activity by User</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { user: 'John Anderson', role: 'Owner', actions: 45, lastActive: '2 hours ago' },
                    { user: 'Sarah Mitchell', role: 'Project Manager', actions: 38, lastActive: '4 hours ago' },
                    { user: 'Michael Chen', role: 'Finance Director', actions: 32, lastActive: '1 hour ago' },
                    { user: 'David Chen', role: 'Architect', actions: 28, lastActive: '1 day ago' },
                    { user: 'System', role: 'Automated', actions: 25, lastActive: 'Just now' },
                    { user: 'Lisa Wong', role: 'Legal Counsel', actions: 18, lastActive: '1 day ago' }
                  ].map((userData, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{userData.user}</h4>
                          <p className="text-sm text-muted-foreground">{userData.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-foreground">{userData.actions} actions</div>
                        <div className="text-xs text-muted-foreground">Last active: {userData.lastActive}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ActivityHistory;