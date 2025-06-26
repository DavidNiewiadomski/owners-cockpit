import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MessageCircle, 
  Send, 
  Paperclip, 
  Video, 
  Phone, 
  MoreHorizontal,
  Users,
  Search,
  Calendar
} from 'lucide-react';
import { sampleTeamsChats, ownerCompanyProfile } from '@/data/sampleCommunications';

const TeamsInterface: React.FC = () => {
  const [chats, setChats] = useState(sampleTeamsChats);
  const [selectedChat, setSelectedChat] = useState(sampleTeamsChats[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;

    const message = {
      id: Date.now().toString(),
      sender: 'You',
      content: newMessage,
      timestamp: 'Just now',
      type: 'text' as const
    };

    // Update the selected chat
    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, message],
      lastMessage: newMessage,
      timestamp: 'Just now'
    };

    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id ? updatedChat : chat
    ));
    
    setSelectedChat(updatedChat);
    setNewMessage('');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredChats = chats.filter(chat =>
    chat.channelName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[600px] bg-background rounded-lg overflow-hidden border border-border/40">
      {/* Sidebar */}
      <div className="w-72 bg-[#6264a7] text-white flex flex-col border-r border-border/20">
        <div className="p-4 border-b border-purple-600">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-6 w-6" />
            <span className="font-semibold text-lg">Teams</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-200" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-purple-800 border-purple-600 text-white placeholder:text-purple-200"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-purple-600 transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-purple-600' : ''
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex -space-x-2">
                    {chat.participants.slice(0, 3).map((participant, index) => (
                      <Avatar key={index} className="h-8 w-8 border-2 border-purple-400">
                        <AvatarFallback className="text-xs bg-purple-300 text-purple-800">
                          {getInitials(participant)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm truncate">{chat.channelName}</span>
                      {chat.unread > 0 && (
                        <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-purple-200 truncate">
                      {chat.participants.length} members
                    </p>
                  </div>
                </div>
                <p className="text-sm text-purple-100 truncate">{chat.lastMessage}</p>
                <p className="text-xs text-purple-300 mt-1">{chat.timestamp}</p>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-purple-600">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-purple-600">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-purple-600 mt-1">
            <Users className="h-4 w-4 mr-2" />
            Team Directory
          </Button>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-muted/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {selectedChat.participants.slice(0, 3).map((participant, index) => (
                      <Avatar key={index} className="h-8 w-8 border-2 border-background">
                        <AvatarFallback className="text-xs">
                          {getInitials(participant)}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedChat.channelName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedChat.participants.length} members
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {selectedChat.messages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(message.sender)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{message.sender}</span>
                        <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                      </div>
                      {message.type === 'text' ? (
                        <p className="text-sm">{message.content}</p>
                      ) : (
                        <div className="flex items-center gap-2 p-2 bg-muted rounded">
                          <Paperclip className="h-4 w-4" />
                          <span className="text-sm">{message.fileName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-[#6264a7] hover:bg-[#5a5c9a]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsInterface;
