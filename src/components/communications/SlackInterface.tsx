import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, Hash, Lock, Plus, Smile, Paperclip, Search } from 'lucide-react';
import { sampleSlackChannels } from '@/data/sampleCommunications';

const SlackInterface: React.FC = () => {
  const [channels] = useState(sampleSlackChannels);
  const [selectedChannel, setSelectedChannel] = useState(sampleSlackChannels[0]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    console.log(`Sending message: ${newMessage}`);
    setNewMessage('');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="flex h-[600px] bg-background border rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 bg-[#4A154B] text-white flex flex-col">
        <div className="p-4 border-b border-purple-700">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-6 w-6" />
            <span className="font-semibold text-lg">Construction Team</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-200" />
            <Input
              placeholder="Search channels..."
              className="pl-10 bg-purple-800 border-purple-600 text-white placeholder:text-purple-200"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            <div className="mb-4">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-sm font-medium text-purple-200">Channels</span>
                <Button variant="ghost" size="icon" className="h-5 w-5 text-purple-200">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-purple-600 ${
                    selectedChannel?.id === channel.id ? 'bg-purple-600' : ''
                  }`}
                  onClick={() => setSelectedChannel(channel)}
                >
                  <Hash className="h-4 w-4 text-purple-300" />
                  <span className="text-sm flex-1">{channel.name}</span>
                  {channel.unread > 0 && (
                    <Badge variant="destructive" className="h-4 px-1.5 text-xs">
                      {channel.unread}
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            <div>
              <div className="px-2 py-1 mb-2">
                <span className="text-sm font-medium text-purple-200">Direct Messages</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-purple-600">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm">Mike Rodriguez</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-purple-600">
                  <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  <span className="text-sm">Sarah Chen</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 rounded cursor-pointer hover:bg-purple-600">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-sm">James Wright</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChannel && (
          <>
            {/* Channel Header */}
            <div className="p-4 border-b border-border bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">{selectedChannel.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>•</span>
                    <span>{selectedChannel.members} members</span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedChannel.purpose}
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedChannel.messages.map((message) => (
                  <div key={message.id} className="flex gap-3 hover:bg-muted/50 p-2 rounded">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-[#4A154B] text-white">
                        {getInitials(message.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{message.displayName}</span>
                        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      
                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {message.reactions.map((reaction, index) => (
                            <div 
                              key={index}
                              className="flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs cursor-pointer hover:bg-muted/80"
                            >
                              <span>{reaction.emoji}</span>
                              <span>{reaction.count}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="border rounded-lg p-3">
                <Input
                  placeholder={`Message #${selectedChannel.name}`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Paperclip className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <Smile className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    size="sm"
                    className="bg-[#4A154B] hover:bg-[#3d1240]"
                  >
                    <Send className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SlackInterface;
