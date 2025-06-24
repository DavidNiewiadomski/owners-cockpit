
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MessageSquare, Mail, Video, Users, Clock, ExternalLink } from 'lucide-react';
import { useCommunications, useSearchCommunications } from '@/hooks/useCommunications';
import { formatDistanceToNow } from 'date-fns';

interface CommunicationsDashboardProps {
  projectId: string;
}

const CommunicationsDashboard: React.FC<CommunicationsDashboardProps> = ({ projectId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const { data: communications = [], isLoading } = useCommunications(projectId);
  const searchMutation = useSearchCommunications();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchMutation.mutate({ query: searchQuery, projectId });
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'teams': return <MessageSquare className="w-4 h-4" />;
      case 'outlook': return <Mail className="w-4 h-4" />;
      case 'zoom': return <Video className="w-4 h-4" />;
      case 'google_meet': return <Video className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'chat_message': return 'bg-green-100 text-green-800';
      case 'meeting_recording': return 'bg-purple-100 text-purple-800';
      case 'meeting_transcript': return 'bg-orange-100 text-orange-800';
      case 'channel_message': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCommunications = communications.filter(comm => {
    const providerMatch = filterProvider === 'all' || comm.provider === filterProvider;
    const typeMatch = filterType === 'all' || comm.comm_type === filterType;
    return providerMatch && typeMatch;
  });

  const searchResults = searchMutation.data || [];
  const displayedCommunications = searchQuery.trim() ? searchResults : filteredCommunications;

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Communications</h2>
          <p className="text-muted-foreground">
            Unified view of project communications across platforms
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {communications.length} total messages
        </Badge>
      </div>

      {/* Search and Filters */}
      <Card className="p-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium mb-2 block">Search Communications</label>
            <div className="flex gap-2">
              <Input
                placeholder="Search messages, emails, meetings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button onClick={handleSearch} disabled={searchMutation.isPending}>
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Provider</label>
            <Select value={filterProvider} onValueChange={setFilterProvider}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="teams">Teams</SelectItem>
                <SelectItem value="outlook">Outlook</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="google_meet">Meet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Type</label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="chat_message">Chat</SelectItem>
                <SelectItem value="meeting_recording">Recording</SelectItem>
                <SelectItem value="meeting_transcript">Transcript</SelectItem>
                <SelectItem value="channel_message">Channel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Communications List */}
      <div className="space-y-4">
        {displayedCommunications.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No Communications Found</h3>
            <p className="text-muted-foreground">
              {searchQuery.trim() 
                ? "No communications match your search criteria."
                : "No communications have been ingested for this project yet."
              }
            </p>
          </Card>
        ) : (
          displayedCommunications.map((comm) => (
            <Card key={comm.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getProviderIcon(comm.provider)}
                  <Badge variant="outline" className="text-xs">
                    {comm.provider}
                  </Badge>
                  <Badge className={`text-xs ${getTypeColor(comm.comm_type)}`}>
                    {comm.comm_type.replace('_', ' ')}
                  </Badge>
                  {'similarity' in comm && (
                    <Badge variant="secondary" className="text-xs">
                      {Math.round((comm as any).similarity * 100)}% match
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {formatDistanceToNow(new Date(comm.message_ts), { addSuffix: true })}
                </div>
              </div>

              {comm.subject && (
                <h4 className="font-medium mb-2">{comm.subject}</h4>
              )}

              {comm.body && (
                <p className="text-muted-foreground text-sm mb-3 line-clamp-3">
                  {comm.body}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  {comm.speaker?.name && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {comm.speaker.name}
                    </div>
                  )}
                  {comm.participants.length > 0 && (
                    <div>
                      {comm.participants.length} participant{comm.participants.length !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                
                {comm.url && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={comm.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunicationsDashboard;
