import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  RefreshCw, 
  Activity,
  Database,
  Brain,
  Mic,
  FileText,
  Cloud,
  Shield,
  Zap,
  Clock,
  TrendingUp,
  Server
} from 'lucide-react';
import { testAllConnections, ServiceTestResult, SystemHealthCheck } from '@/lib/services/test-connections';
import { aiRouter } from '@/lib/services/ai-router';
import { snowflakeClient } from '@/lib/services/snowflake-client';
import { supabase } from '@/integrations/supabase/client';

const SystemStatus: React.FC = () => {
  const [healthData, setHealthData] = useState<SystemHealthCheck | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Service icon mapping
  const serviceIcons: Record<string, React.ReactNode> = {
    'Supabase': <Database className="w-5 h-5" />,
    'Azure OpenAI': <Brain className="w-5 h-5" />,
    'OpenAI': <Brain className="w-5 h-5" />,
    'Anthropic': <Brain className="w-5 h-5" />,
    'Google Gemini': <Brain className="w-5 h-5" />,
    'ElevenLabs': <Mic className="w-5 h-5" />,
    'Snowflake': <Cloud className="w-5 h-5" />,
    'Google Cloud Vision': <FileText className="w-5 h-5" />,
    'Adobe PDF Services': <FileText className="w-5 h-5" />,
    'GitHub': <Server className="w-5 h-5" />
  };

  // Load health data
  const loadHealthData = async () => {
    try {
      setIsRefreshing(true);
      const data = await testAllConnections();
      setHealthData(data);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to load health data:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadHealthData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadHealthData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'healthy':
        return 'text-green-500';
      case 'warning':
      case 'degraded':
        return 'text-yellow-500';
      case 'error':
      case 'unhealthy':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'healthy':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'warning':
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'error':
      case 'unhealthy':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  // Calculate statistics
  const calculateStats = () => {
    if (!healthData) return { healthy: 0, degraded: 0, unhealthy: 0, uptime: 0 };
    
    const services = healthData.services;
    const healthy = services.filter(s => s.status === 'success').length;
    const degraded = services.filter(s => s.status === 'warning').length;
    const unhealthy = services.filter(s => s.status === 'error').length;
    const uptime = Math.round((healthy / services.length) * 100);
    
    return { healthy, degraded, unhealthy, uptime };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading system status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Status</h1>
          <p className="text-muted-foreground">
            Monitor the health of all integrated services
          </p>
        </div>
        <Button 
          onClick={loadHealthData} 
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Overall Status Alert */}
      {healthData && (
        <Alert className={
          healthData.overall === 'healthy' ? 'border-green-500' :
          healthData.overall === 'degraded' ? 'border-yellow-500' :
          'border-red-500'
        }>
          <div className="flex items-center gap-2">
            {getStatusIcon(healthData.overall)}
            <AlertTitle>
              System Status: {healthData.overall.charAt(0).toUpperCase() + healthData.overall.slice(1)}
            </AlertTitle>
          </div>
          <AlertDescription>
            Last checked: {lastRefresh.toLocaleTimeString()} | 
            Response time: {healthData.totalResponseTime}ms
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Uptime</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uptime}%</div>
            <Progress value={stats.uptime} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Healthy Services</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.healthy}</div>
            <p className="text-xs text-muted-foreground">
              {healthData?.services.length} total services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Degraded</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-500">{stats.degraded}</div>
            <p className="text-xs text-muted-foreground">
              Limited functionality
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unhealthy</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.unhealthy}</div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Service Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="ai">AI Services</TabsTrigger>
          <TabsTrigger value="data">Data Services</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Services</CardTitle>
              <CardDescription>
                Real-time status of all integrated services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthData?.services.map((service) => (
                  <div key={service.service} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {serviceIcons[service.service] || <Server className="w-5 h-5" />}
                      <div>
                        <h3 className="font-medium">{service.service}</h3>
                        <p className="text-sm text-muted-foreground">
                          {service.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={
                        service.status === 'success' ? 'default' :
                        service.status === 'warning' ? 'secondary' :
                        'destructive'
                      }>
                        {service.status}
                      </Badge>
                      {service.responseTime !== undefined && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {service.responseTime}ms
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Service Configuration</CardTitle>
              <CardDescription>
                Available AI providers and routing preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthData?.services
                  .filter(s => ['OpenAI', 'Azure OpenAI', 'Anthropic', 'Google Gemini'].includes(s.service))
                  .map((service) => (
                    <div key={service.service} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          {service.service}
                        </h3>
                        {getStatusIcon(service.status)}
                      </div>
                      {service.details && (
                        <pre className="text-xs bg-muted p-2 rounded mt-2 overflow-x-auto">
                          {JSON.stringify(service.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))}
                  
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">AI Router Statistics</h4>
                  <pre className="text-xs">
                    {JSON.stringify(aiRouter.getProviderStats(), null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Data Services</CardTitle>
              <CardDescription>
                Database and data warehouse connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthData?.services
                  .filter(s => ['Supabase', 'Snowflake'].includes(s.service))
                  .map((service) => (
                    <div key={service.service} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium flex items-center gap-2">
                          {service.service === 'Supabase' ? 
                            <Database className="w-4 h-4" /> : 
                            <Cloud className="w-4 h-4" />
                          }
                          {service.service}
                        </h3>
                        {getStatusIcon(service.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{service.message}</p>
                      {service.error && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertDescription>{service.error}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>External Integrations</CardTitle>
              <CardDescription>
                Third-party services and APIs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthData?.services
                  .filter(s => ['ElevenLabs', 'Google Cloud Vision', 'Adobe PDF Services', 'GitHub'].includes(s.service))
                  .map((service) => (
                    <div key={service.service} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium flex items-center gap-2">
                          {serviceIcons[service.service]}
                          {service.service}
                        </h3>
                        {getStatusIcon(service.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{service.message}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Test individual services or perform maintenance tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => window.open('/test-ai-enhanced.html', '_blank')}>
              <Zap className="w-4 h-4 mr-2" />
              Open AI Test Suite
            </Button>
            <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>
              <Shield className="w-4 h-4 mr-2" />
              Test Auth Flow
            </Button>
            <Button variant="outline" size="sm" onClick={async () => {
              const connected = await snowflakeClient.testConnection();
              alert(`Snowflake connection: ${connected ? 'Success' : 'Failed'}`);
            }}>
              <Cloud className="w-4 h-4 mr-2" />
              Test Snowflake
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatus;