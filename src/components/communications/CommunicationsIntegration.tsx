
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Mail, 
  MessageSquare, 
  Video, 
  Settings, 
  RefreshCw, 
  Send, 
  Bot,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useOffice365Tokens, useStartOffice365Auth } from '@/hooks/useOffice365Integration';
import { useCommunications } from '@/hooks/useCommunications';
import CommunicationCard from './CommunicationCard';
import SmartReplyDrawer from './SmartReplyDrawer';
import { useToast } from '@/hooks/use-toast';

interface CommunicationsIntegrationProps {
  projectId: string;
}

const CommunicationsIntegration: React.FC<CommunicationsIntegrationProps> = ({ projectId }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCommunication, setSelectedCommunication] = useState<any>(null);
  const [showReplyDrawer, setShowReplyDrawer] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');

  const { data: tokens = [], isLoading: tokensLoading } = useOffice365Tokens(projectId);
  const { data: communications = [], isLoading: commsLoading } = useCommunications(projectId);
  const startAuth = useStartOffice365Auth();
  const { toast } = useToast();

  const handleConnectProvider = async (provider: 'outlook' | 'teams' | 'zoom') => {
    if (provider === 'outlook' || provider === 'teams') {
      try {
        await startAuth.mutateAsync({ projectId });
      } catch (error) {
        console.error('Failed to start OAuth:', error);
        toast({
          title: "Connection Failed",
          description: "Failed to start authentication process.",
          variant: "destructive",
        });
      }
    } else if (provider === 'zoom') {
      // For Zoom, we'd need to implement Zoom OAuth
      toast({
        title: "Coming Soon",
        description: "Zoom integration is coming soon.",
      });
    }
  };

  const handleAIAction = async (action: 'summarize' | 'reply' | 'analyze') => {
    if (!selectedCommunication) return;

    try {
      const prompt = action === 'summarize' 
        ? 'Summarize this communication and highlight key points'
        : action === 'reply'
        ? aiPrompt || 'Draft a professional reply to this message'
        : 'Analyze this communication for sentiment and important topics';

      // This would call the AI service
      toast({
        title: "AI Processing",
        description: `${action} request sent to AI agent.`,
      });
    } catch (error) {
      toast({
        title: "AI Error",
        description: "Failed to process AI request.",
        variant: "destructive",
      });
    }
  };

  const getProviderStatus = (provider: string) => {
    const token = tokens.find(t => t.provider === provider);
    if (token) {
      return { status: 'connected', lastSync: token.updated_at };
    }
    return { status: 'disconnected', lastSync: null };
  };

  const filteredCommunications = communications.filter(comm => 
    selectedProvider === 'all' || comm.provider === selectedProvider
  );

  const providerConfigs = [
    {
      id: 'outlook',
      name: 'Outlook',
      icon: <Mail className="w-6 h-6" />,
      description: 'Email integration for reading and sending emails',
      color: 'bg-blue-500',
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      icon: <MessageSquare className="w-6 h-6" />,
      description: 'Chat and channel message integration',
      color: 'bg-purple-500',
    },
    {
      id: 'zoom',
      name: 'Zoom',
      icon: <Video className="w-6 h-6" />,
      description: 'Meeting recordings and transcripts',
      color: 'bg-blue-600',
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Communications Hub</h1>
          <p className="text-muted-foreground">
            Connect and manage your communication platforms with AI assistance
          </p>
        </div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {providerConfigs.map((provider) => {
              const status = getProviderStatus(provider.id);
              return (
                <Card key={provider.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg text-white ${provider.color}`}>
                          {provider.icon}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{provider.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {provider.description}
                          </p>
                        </div>
                      </div>
                      {status.status === 'connected' ? (
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Disconnected
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {status.status === 'connected' && status.lastSync && (
                        <p className="text-xs text-muted-foreground">
                          Last sync: {new Date(status.lastSync).toLocaleString()}
                        </p>
                      )}
                      <Button
                        onClick={() => handleConnectProvider(provider.id as any)}
                        disabled={startAuth.isPending}
                        className="w-full"
                        variant={status.status === 'connected' ? 'outline' : 'default'}
                      >
                        {status.status === 'connected' ? (
                          <>
                            <Settings className="w-4 h-4 mr-2" />
                            Configure
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-4 h-4 mr-2" />
                            Connect
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communications.slice(0, 3).map((comm) => (
                  <div key={comm.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{comm.provider}</Badge>
                      <div>
                        <p className="font-medium">{comm.subject || 'No subject'}</p>
                        <p className="text-sm text-muted-foreground">
                          {comm.speaker?.name} • {new Date(comm.message_ts).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          <div className="flex items-center space-x-4">
            <Select value={selectedProvider} onValueChange={setSelectedProvider}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Providers</SelectItem>
                <SelectItem value="outlook">Outlook</SelectItem>
                <SelectItem value="teams">Microsoft Teams</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline">
              {filteredCommunications.length} messages
            </Badge>
          </div>

          <div className="space-y-4">
            {filteredCommunications.map((comm) => (
              <CommunicationCard
                key={comm.id}
                communication={comm}
                onMeetingClick={(communication) => {
                  setSelectedCommunication(communication);
                  // Handle meeting click
                }}
                onReplyClick={(communication) => {
                  setSelectedCommunication(communication);
                  setShowReplyDrawer(true);
                }}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-assistant" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span>AI Communication Assistant</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => handleAIAction('summarize')}
                  disabled={!selectedCommunication}
                  variant="outline"
                >
                  Summarize Selected
                </Button>
                <Button
                  onClick={() => handleAIAction('analyze')}
                  disabled={!selectedCommunication}
                  variant="outline"
                >
                  Analyze Sentiment
                </Button>
                <Button
                  onClick={() => setShowReplyDrawer(true)}
                  disabled={!selectedCommunication}
                  variant="outline"
                >
                  Smart Reply
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">AI Prompt</label>
                  <Textarea
                    placeholder="Enter custom AI instructions for processing communications..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={() => handleAIAction('reply')}>
                  <Bot className="w-4 h-4 mr-2" />
                  Process with AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Integration Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Sync Frequency</h4>
                  <Select defaultValue="15min">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5min">Every 5 minutes</SelectItem>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                      <SelectItem value="1hour">Every hour</SelectItem>
                      <SelectItem value="manual">Manual only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <h4 className="font-medium">AI Processing</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Auto-summarize long messages</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Sentiment analysis</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Auto-reply suggestions</span>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SmartReplyDrawer
        isOpen={showReplyDrawer}
        onClose={() => setShowReplyDrawer(false)}
        thread={selectedCommunication}
        projectId={projectId}
      />
    </div>
  );
};

export default CommunicationsIntegration;
