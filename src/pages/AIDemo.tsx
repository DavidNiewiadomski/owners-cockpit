import React from 'react';
import { AutonomousAgentDemo } from '@/components/demo/AutonomousAgentDemo';
import { RealTimeAIMonitor } from '@/components/ai/RealTimeAIMonitor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Activity, Sparkles, Zap } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

const AIDemo = () => {
  const { selectedProject } = useAppState();
  const projectId = selectedProject || 'demo';

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Brain className="w-8 h-8 text-primary" />
            AI Autonomous Agent Demo
          </h1>
          <p className="text-muted-foreground mt-2">
            Experience the future of construction management with true AI autonomy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            <Sparkles className="w-4 h-4 mr-1" />
            Production Ready
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            Project: {projectId}
          </Badge>
        </div>
      </div>

      {/* Introduction Card */}
      <Card>
        <CardHeader>
          <CardTitle>Welcome to the Future of Construction Management</CardTitle>
          <CardDescription>
            Unlike traditional AI that just answers questions, our autonomous agent can actually operate your entire construction platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Real Actions</h4>
                <p className="text-sm text-muted-foreground">
                  Creates tasks, sends emails, updates schedules - not just chat
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">Smart Decisions</h4>
                <p className="text-sm text-muted-foreground">
                  Analyzes risks, makes recommendations, learns from outcomes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-primary mt-1" />
              <div>
                <h4 className="font-medium">24/7 Operation</h4>
                <p className="text-sm text-muted-foreground">
                  Monitors projects continuously and responds instantly
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Demo Content */}
      <Tabs defaultValue="scenarios" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="scenarios">Demo Scenarios</TabsTrigger>
          <TabsTrigger value="monitor">Real-Time Monitor</TabsTrigger>
        </TabsList>

        <TabsContent value="scenarios" className="space-y-4">
          <AutonomousAgentDemo projectId={projectId} />
        </TabsContent>

        <TabsContent value="monitor" className="space-y-4">
          <RealTimeAIMonitor projectId={projectId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIDemo;