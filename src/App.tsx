
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
  MessageCircle,
  Send,
  Bot,
  User,
  X,
  Activity,
  TrendingUp,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Hello! I\'m Atlas, your AI building management assistant. I can help you with project oversight, analytics, team coordination, and more. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const analyticsData = {
    budgetUtilization: 82.5,
    schedulePerformance: 89.2,
    teamEfficiency: 91.8,
    riskScore: 18.3,
    safetyScore: 97.1,
    qualityScore: 94.6
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: `I understand you're asking about "${userMessage.content}". As your building management AI, I can help you analyze project data, coordinate teams, track budgets, and optimize operations. Based on current metrics, your portfolio is performing well with ${analyticsData.schedulePerformance.toFixed(1)}% schedule performance and ${analyticsData.budgetUtilization.toFixed(1)}% budget utilization. What specific area would you like me to focus on?`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Owners Cockpit
            </h1>
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
              <Button variant="ghost" size="icon" className="relative hover:bg-blue-50" title="Microsoft Outlook">
                <Mail className="h-4 w-4" style={{ color: '#0078d4' }} />
                <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-green-500" />
              </Button>
              <Button variant="ghost" size="icon" className="relative hover:bg-purple-50" title="Microsoft Teams">
                <MessageCircle className="h-4 w-4" style={{ color: '#6264a7' }} />
                <Badge className="absolute -top-1 -left-1 h-4 w-4 p-0 bg-red-500 text-xs text-white">3</Badge>
              </Button>
              <Button variant="ghost" size="icon" className="relative hover:bg-blue-50" title="Zoom">
                <Video className="h-4 w-4" style={{ color: '#2D8CFF' }} />
              </Button>
              <Button variant="ghost" size="icon" className="relative hover:bg-green-50" title="Communications">
                <Phone className="h-4 w-4" style={{ color: '#25D366' }} />
                <Badge className="absolute -top-1 -right-1 h-3 w-3 p-0 bg-orange-500" />
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
                    <Card key={index} className="hover:shadow-md transition-shadow">
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

              {/* Real-time Analytics */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        Real-time Building Analytics
                      </CardTitle>
                      <CardDescription>
                        Live performance metrics across all active projects
                      </CardDescription>
                    </div>
                    <Badge className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      Live
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <div className="p-4 border rounded-lg bg-muted/20">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Budget Utilization</span>
                        </div>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold">{analyticsData.budgetUtilization}%</div>
                      <Badge variant="default" className="text-xs mt-1">Excellent</Badge>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-muted/20">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Schedule Performance</span>
                        </div>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold">{analyticsData.schedulePerformance}%</div>
                      <Badge variant="default" className="text-xs mt-1">Excellent</Badge>
                    </div>
                    
                    <div className="p-4 border rounded-lg bg-muted/20">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Safety Score</span>
                        </div>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold">{analyticsData.safetyScore}%</div>
                      <Badge variant="default" className="text-xs mt-1">Excellent</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Projects & Notifications */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Projects</CardTitle>
                    <CardDescription>
                      Latest updates from your active building projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentProjects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
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
                        <div key={notification.id} className="flex gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
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
                  <CardTitle>Building Projects</CardTitle>
                  <CardDescription>
                    Comprehensive management of all construction and renovation projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Project Management Module</h3>
                    <p className="text-muted-foreground mb-4">
                      Advanced project tracking, resource allocation, and timeline management.
                    </p>
                    <Button>Launch Project Manager</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="communications">
              <Card>
                <CardHeader>
                  <CardTitle>Communications Hub</CardTitle>
                  <CardDescription>
                    Centralized communication management for all building stakeholders
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Communication Center</h3>
                    <p className="text-muted-foreground mb-4">
                      Integrate with Teams, Outlook, Zoom, and other communication platforms.
                    </p>
                    <Button>Setup Communications</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* AI Assistant Button */}
      <Button
        onClick={() => setAiChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 z-40"
        size="icon"
      >
        <Brain className="w-6 h-6 text-white" />
        <div className="absolute -top-1 -right-1">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
        </div>
      </Button>

      {/* AI Chat Dialog */}
      <Dialog open={aiChatOpen} onOpenChange={setAiChatOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <DialogHeader className="p-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-primary" />
                <div>
                  <DialogTitle className="text-lg">Atlas - AI Building Assistant</DialogTitle>
                  <p className="text-sm text-muted-foreground">
                    Building Portfolio • Overview • Live Analytics
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setAiChatOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                
                <Card className={`max-w-[85%] ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/50'
                }`}>
                  <CardContent className="p-3">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-2 opacity-70 ${
                      message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </CardContent>
                </Card>
                
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <Card className="bg-muted/50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <span className="text-sm text-muted-foreground ml-2">Atlas is analyzing...</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Atlas about your building portfolio..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !chatInput.trim()}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              💡 Atlas has real-time access to your building data and analytics
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
