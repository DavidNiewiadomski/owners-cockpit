import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  X, 
  MessageSquare, 
  Send, 
  Video, 
  Phone, 
  Calendar,
  Users,
  Search,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  Share,
  Bell,
  Star
} from 'lucide-react';

interface TeamsPopupProps {
  projectId: string;
  onClose: () => void;
}

interface Channel {
  id: string;
  name: string;
  type: 'channel' | 'chat';
  unreadCount: number;
  lastMessage: string;
  lastActivity: string;
  isOnline?: boolean;
}

interface Message {
  id: string;
  from: string;
  avatar: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'meeting' | 'action';
  reactions?: { emoji: string; count: number }[];
}

const TeamsPopup: React.FC<TeamsPopupProps> = ({ projectId, onClose }) => {
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock Teams data - in real app, fetch from Microsoft Graph API
  const getProjectChannels = () => {
    const channelData: Record<string, Channel[]> = {
      '11111111-1111-1111-1111-111111111111': [
        {
          id: 'general',
          name: '🏥 Medical Center General',
          type: 'channel',
          unreadCount: 8,
          lastMessage: 'Mike: MEP coordination meeting tomorrow at 8 AM',
          lastActivity: '5 min ago'
        },
        {
          id: 'mep',
          name: '⚡ MEP Coordination',
          type: 'channel',
          unreadCount: 3,
          lastMessage: 'Sarah: Updated electrical drawings attached',
          lastActivity: '12 min ago'
        },
        {
          id: 'medical-equipment',
          name: '🏥 Medical Equipment',
          type: 'channel',
          unreadCount: 2,
          lastMessage: 'Jessica: MRI delivery rescheduled to Jan 15',
          lastActivity: '1 hour ago'
        },
        {
          id: 'dr-adams',
          name: 'Dr. Patricia Adams',
          type: 'chat',
          unreadCount: 1,
          lastMessage: 'Thanks for the power distribution clarification',
          lastActivity: '2 hours ago',
          isOnline: true
        }
      ],
      'portfolio': [
        {
          id: 'portfolio-updates',
          name: '📊 Portfolio Updates',
          type: 'channel',
          unreadCount: 5,
          lastMessage: 'Weekly summary reports are ready',
          lastActivity: '30 min ago'
        }
      ]
    };
    
    return channelData[projectId] || channelData.portfolio;
  };

  const getChannelMessages = (channelId: string) => {
    const messageData: Record<string, Message[]> = {
      'general': [
        {
          id: '1',
          from: 'Mike Rodriguez',
          avatar: 'MR',
          content: 'Good morning team! We need to address the MEP coordination conflicts in the patient tower mechanical rooms before Friday\'s concrete pour. I\'ve scheduled a meeting for tomorrow at 8 AM on site.',
          timestamp: '5 min ago',
          type: 'text',
          reactions: [{ emoji: '👍', count: 3 }, { emoji: '✅', count: 2 }]
        },
        {
          id: '2',
          from: 'Sarah Chen',
          avatar: 'SC',
          content: 'I\'ll bring the updated structural drawings and coordinate with the steel team.',
          timestamp: '3 min ago',
          type: 'text'
        },
        {
          id: '3',
          from: 'Dr. Patricia Adams',
          avatar: 'PA',
          content: 'Can we also discuss the emergency power backup for medical gas compressors during the meeting?',
          timestamp: '1 min ago',
          type: 'text'
        }
      ],
      'mep': [
        {
          id: '1',
          from: 'Mike Rodriguez',
          avatar: 'MR',
          content: 'Latest electrical drawings show conflicts with HVAC ductwork. Need immediate resolution.',
          timestamp: '12 min ago',
          type: 'text'
        },
        {
          id: '2',
          from: 'Sarah Chen',
          avatar: 'SC',
          content: 'Electrical_Plans_Rev_C.pdf',
          timestamp: '10 min ago',
          type: 'file'
        }
      ]
    };
    
    return messageData[channelId] || [];
  };

  const channels = getProjectChannels();
  const messages = getChannelMessages(activeChannel);
  const activeChannelInfo = channels.find(c => c.id === activeChannel);

  const handleSendMessage = () => {
    if (message.trim()) {
      // In real implementation, send message via Microsoft Graph API
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleStartMeeting = () => {
    // In real implementation, start Teams meeting
    console.log('Starting Teams meeting for channel:', activeChannel);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[80vh] bg-white dark:bg-gray-900">
        <CardHeader className="pb-3 border-b bg-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Microsoft Teams - Project Collaboration
              <Badge variant="secondary" className="bg-white/20 text-white">
                {channels.reduce((total, channel) => total + channel.unreadCount, 0)} unread
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handleStartMeeting}
              >
                <Video className="w-4 h-4 mr-2" />
                Start Meeting
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={onClose}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full">
          <div className="flex h-full">
            {/* Channels Sidebar */}
            <div className="w-1/4 border-r border-border flex flex-col bg-muted/30">
              {/* Search */}
              <div className="p-3 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search channels..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-8 text-sm"
                  />
                </div>
              </div>

              {/* Channel List */}
              <ScrollArea className="flex-1">
                <div className="p-2">
                  <div className="text-xs font-medium text-muted-foreground mb-2 px-2">CHANNELS</div>
                  {channels.filter(c => c.type === 'channel').map((channel) => (
                    <div
                      key={channel.id}
                      className={`p-2 rounded-md mb-1 cursor-pointer transition-colors ${
                        activeChannel === channel.id
                          ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setActiveChannel(channel.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium truncate">{channel.name}</div>
                        {channel.unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                            {channel.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-1">
                        {channel.lastMessage}
                      </div>
                    </div>
                  ))}
                  
                  <div className="text-xs font-medium text-muted-foreground mb-2 px-2 mt-4">DIRECT MESSAGES</div>
                  {channels.filter(c => c.type === 'chat').map((channel) => (
                    <div
                      key={channel.id}
                      className={`p-2 rounded-md mb-1 cursor-pointer transition-colors ${
                        activeChannel === channel.id
                          ? 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setActiveChannel(channel.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                              {channel.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            {channel.isOnline && (
                              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border border-white" />
                            )}
                          </div>
                          <div className="text-sm font-medium truncate">{channel.name}</div>
                        </div>
                        {channel.unreadCount > 0 && (
                          <Badge variant="destructive" className="h-5 w-5 p-0 text-xs flex items-center justify-center">
                            {channel.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate mt-1 ml-8">
                        {channel.lastMessage}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{activeChannelInfo?.name}</h3>
                      {activeChannelInfo?.type === 'chat' && activeChannelInfo.isOnline && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Online
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleStartMeeting}>
                      <Video className="w-4 h-4 mr-2" />
                      Meet Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm">
                      <Users className="w-4 h-4 mr-2" />
                      {activeChannelInfo?.type === 'channel' ? 'Members' : 'Profile'}
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-medium">
                        {msg.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{msg.from}</span>
                          <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                        </div>
                        <div className="text-sm leading-relaxed">
                          {msg.type === 'file' ? (
                            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg w-fit">
                              <Paperclip className="w-4 h-4" />
                              <span>{msg.content}</span>
                            </div>
                          ) : (
                            <p>{msg.content}</p>
                          )}
                        </div>
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            {msg.reactions.map((reaction, idx) => (
                              <Button
                                key={idx}
                                variant="outline"
                                size="sm"
                                className="h-6 px-2 text-xs"
                              >
                                {reaction.emoji} {reaction.count}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mic className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      placeholder={`Message ${activeChannelInfo?.name}...`}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="min-h-[60px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="h-10"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  Press Enter to send, Shift+Enter for new line
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamsPopup;
