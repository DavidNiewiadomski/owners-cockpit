import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  DollarSign, 
  Users, 
  Calendar,
  BarChart3,
  MessageSquare,
  Settings,
  Menu,
  Bell,
  Search,
  Brain,
  Mail,
  Video,
  Phone,
  MessageCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const stats = [
    {
      title: "Total Projects",
      value: "24",
      change: "+2 from last month",
      icon: Building,
      color: "text-blue-600"
    },
    {
      title: "Total Value",
      value: "$2.4M",
      change: "+12% from last month", 
      icon: DollarSign,
      color: "text-green-600"
    },
    {
      title: "Active Teams",
      value: "8",
      change: "+1 from last week",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Upcoming Deadlines",
      value: "5",
      change: "3 this week",
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  const recentProjects = [
    {
      id: 1,
      name: "Downtown Office Complex",
      status: "In Progress",
      progress: 75,
      budget: "$1.2M",
      deadline: "Dec 2024"
    },
    {
      id: 2,
      name: "Residential Tower A",
      status: "Planning",
      progress: 25,
      budget: "$800K",
      deadline: "Mar 2025"
    },
    {
      id: 3,
      name: "Community Center",
      status: "Review",
      progress: 90,
      budget: "$400K", 
      deadline: "Nov 2024"
    }
  ];

  const notifications = [
    {
      id: 1,
      title: "Budget approval needed",
      message: "Downtown Office Complex requires budget review",
      time: "2 hours ago",
      type: "urgent"
    },
    {
      id: 2,
      title: "Team meeting scheduled",
      message: "Weekly construction update at 3 PM",
      time: "4 hours ago",
      type: "info"
    },
    {
      id: 3,
      title: "Inspection completed",
      message: "Foundation inspection passed for Tower A",
      time: "1 day ago",
      type: "success"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Owners Cockpit</h1>
          </div>

          <div className="flex-1 mx-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search projects, documents, tasks..." 
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Communication Icons */}
            <div className="flex items-center gap-1 border-r border-border/40 pr-2 mr-2">
              <Button variant="ghost" size="icon" className="relative" title="Outlook">
                <Mail className="h-4 w-4" style={{ color: '#0078d4' }} />
              </Button>
              <Button variant="ghost" size="icon" className="relative" title="Teams">
                <MessageCircle className="h-4 w-4" style={{ color: '#6264a7' }} />
              </Button>
              <Button variant="ghost" size="icon" className="relative" title="Zoom">
                <Video className="h-4 w-4" style={{ color: '#2D8CFF' }} />
              </Button>
              <Button variant="ghost" size="icon" className="relative" title="Phone">
                <Phone className="h-4 w-4" style={{ color: '#25D366' }} />
              </Button>
            </div>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-xs">
                3
              </Badge>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-border bg-background`}>
          <nav className="p-4 space-y-2">
            <Button 
              variant={activeTab === 'overview' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Overview
            </Button>
            <Button 
              variant={activeTab === 'projects' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('projects')}
            >
              <Building className="mr-2 h-4 w-4" />
              Projects
            </Button>
            <Button 
              variant={activeTab === 'communications' ? 'default' : 'ghost'} 
              className="w-full justify-start"
              onClick={() => setActiveTab('communications')}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Communications
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={index}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                          {stat.title}
                        </CardTitle>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                          {stat.change}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Recent Projects & Notifications */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                    <CardDescription>
                      Latest updates from your active projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProjects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="space-y-1">
                            <p className="font-medium">{project.name}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{project.status}</Badge>
                              <span className="text-sm text-muted-foreground">{project.budget}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{project.progress}%</p>
                            <p className="text-xs text-muted-foreground">{project.deadline}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Recent updates and alerts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div key={notification.id} className="flex gap-3 p-3 border rounded-lg">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'urgent' ? 'bg-red-500' :
                            notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                          }`} />
                          <div className="flex-1 space-y-1">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground">{notification.message}</p>
                            <p className="text-xs text-muted-foreground">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                  <CardDescription>
                    Manage and monitor all construction projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    Projects module coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communications">
              <Card>
                <CardHeader>
                  <CardTitle>Communications</CardTitle>
                  <CardDescription>
                    Centralized communication hub
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-muted-foreground py-8">
                    Communications module coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* AI Assistant Coming Soon */}
      <Button
        onClick={() => alert('AI Assistant coming soon!')}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 z-40"
        size="icon"
      >
        <Brain className="w-6 h-6" />
        <div className="absolute -top-1 -right-1">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
      </Button>
    </div>
  );
};

export default Dashboard;
