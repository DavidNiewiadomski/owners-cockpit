
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, MessagesSquare, Video, Mail, Users } from 'lucide-react';
import { useCommunications, useSearchCommunications } from '@/hooks/useCommunications';
import CommunicationCard from '@/components/communications/CommunicationCard';
import MeetingSummaryModal from '@/components/communications/MeetingSummaryModal';
import SmartReplyDrawer from '@/components/communications/SmartReplyDrawer';
import { useDebounce } from '@/hooks/useDebounce';
import { supabase } from '@/integrations/supabase/client';

const CommunicationsPage: React.FC = () => {
  const { id: projectId } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedMeeting, setSelectedMeeting] = useState<unknown>(null);
  const [selectedThread, setSelectedThread] = useState<unknown>(null);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showReplyDrawer, setShowReplyDrawer] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 300);
  const { data: communications = [], isLoading } = useCommunications(projectId!);
  const searchMutation = useSearchCommunications();

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'c' && event.ctrlKey) {
        event.preventDefault();
        window.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Search handler
  useEffect(() => {
    if (debouncedSearch.trim() && projectId) {
      searchMutation.mutate({ query: debouncedSearch, projectId });
    }
  }, [debouncedSearch, projectId, searchMutation]);

  // Realtime subscription
  useEffect(() => {
    if (!projectId) return;

    const channel = supabase
      .channel('communications-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'communications',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          console.log('Communication update:', payload);
          // The query will be invalidated automatically by React Query
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  const displayedCommunications = searchQuery.trim() 
    ? (searchMutation.data || [])
    : communications;

  const filteredCommunications = displayedCommunications.filter(comm => {
    switch (activeTab) {
      case 'meetings':
        return comm.comm_type === 'meeting_recording' || comm.comm_type === 'meeting_transcript';
      case 'chats':
        return comm.comm_type === 'chat_message' || comm.comm_type === 'channel_message';
      case 'emails':
        return comm.comm_type === 'email';
      default:
        return true;
    }
  });

  const handleMeetingClick = (communication: unknown) => {
    setSelectedMeeting(communication);
    setShowMeetingModal(true);
  };

  const handleReplyClick = (communication: unknown) => {
    setSelectedThread(communication);
    setShowReplyDrawer(true);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
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
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <MessagesSquare className="w-8 h-8" />
            Communications
          </h1>
          <p className="text-muted-foreground mt-1">
            Project meetings, chats, and emails - all in one place
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Press <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+C</kbd> to focus
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search communications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <MessagesSquare className="w-4 h-4" />
            All
          </TabsTrigger>
          <TabsTrigger value="meetings" className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Meetings
          </TabsTrigger>
          <TabsTrigger value="chats" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Chats
          </TabsTrigger>
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Emails
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {filteredCommunications.length === 0 ? (
            <Card className="p-12 text-center">
              <MessagesSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Communications Yet</h3>
              <p className="text-muted-foreground mb-4">
                Connect your communication tools to see meetings, chats, and emails here.
              </p>
              <button className="text-primary hover:underline">
                Set up integrations →
              </button>
            </Card>
          ) : (
            filteredCommunications.map((comm) => (
              <CommunicationCard
                key={comm.id}
                communication={comm}
                onMeetingClick={handleMeetingClick}
                onReplyClick={handleReplyClick}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="meetings" className="space-y-4">
          {filteredCommunications.map((comm) => (
            <CommunicationCard
              key={comm.id}
              communication={comm}
              onMeetingClick={handleMeetingClick}
              onReplyClick={handleReplyClick}
            />
          ))}
        </TabsContent>

        <TabsContent value="chats" className="space-y-4">
          {filteredCommunications.map((comm) => (
            <CommunicationCard
              key={comm.id}
              communication={comm}
              onMeetingClick={handleMeetingClick}
              onReplyClick={handleReplyClick}
            />
          ))}
        </TabsContent>

        <TabsContent value="emails" className="space-y-4">
          {filteredCommunications.map((comm) => (
            <CommunicationCard
              key={comm.id}
              communication={comm}
              onMeetingClick={handleMeetingClick}
              onReplyClick={handleReplyClick}
            />
          ))}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <MeetingSummaryModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        meeting={selectedMeeting}
        projectId={projectId!}
      />

      <SmartReplyDrawer
        isOpen={showReplyDrawer}
        onClose={() => setShowReplyDrawer(false)}
        thread={selectedThread}
        projectId={projectId!}
      />
    </div>
  );
};

export default CommunicationsPage;
