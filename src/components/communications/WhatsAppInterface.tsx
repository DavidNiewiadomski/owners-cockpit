import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Phone, Send, Paperclip, Smile, Search, Video, MoreVertical } from 'lucide-react';
import { sampleWhatsAppChats } from '@/data/sampleCommunications';

const WhatsAppInterface: React.FC = () => {
  const [chats, setChats] = useState(sampleWhatsAppChats);
  const [selectedChat, setSelectedChat] = useState(sampleWhatsAppChats[0]);
  const [newMessage, setNewMessage] = useState('');

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
      timestamp: 'Just now',
      unread: 0 // Clear unread count since we're in the chat
    };

    setChats(prev => prev.map(chat => 
      chat.id === selectedChat.id ? updatedChat : chat
    ));
    
    setSelectedChat(updatedChat);
    setNewMessage('');

    // Simulate reply from contact after 2-3 seconds
    if (selectedChat.name !== 'Project Investors Group') {
      setTimeout(() => {
        const replyMessage = {
          id: (Date.now() + 1).toString(),
          sender: selectedChat.name.split(' - ')[1] || selectedChat.name,
          content: getAutoReply(newMessage, selectedChat.name),
          timestamp: 'Just now',
          type: 'text' as const
        };

        const updatedChatWithReply = {
          ...updatedChat,
          messages: [...updatedChat.messages, replyMessage],
          lastMessage: replyMessage.content,
          timestamp: 'Just now'
        };

        setChats(prev => prev.map(chat => 
          chat.id === selectedChat.id ? updatedChatWithReply : chat
        ));
        
        if (selectedChat.id === updatedChatWithReply.id) {
          setSelectedChat(updatedChatWithReply);
        }
      }, 2000 + Math.random() * 2000); // 2-4 seconds delay
    }
  };

  const getAutoReply = (message: string, contactName: string): string => {
    const lowerMsg = message.toLowerCase();
    
    if (contactName.includes('Tony')) {
      if (lowerMsg.includes('ready') || lowerMsg.includes('delivery')) {
        return 'All set! Equipment is staged and crew will be here at 5:30 AM to prepare.';
      }
      if (lowerMsg.includes('time') || lowerMsg.includes('when')) {
        return 'Steel delivery truck should arrive exactly at 6 AM. I\'ll call you 15 min before.';
      }
      return 'Roger that! Everything is on schedule for tomorrow morning. 👍';
    }
    
    if (contactName.includes('Electrical')) {
      if (lowerMsg.includes('inspection') || lowerMsg.includes('ready')) {
        return 'Perfect timing! Inspector confirmed for Wednesday 10 AM. All circuits tested and labeled.';
      }
      if (lowerMsg.includes('great') || lowerMsg.includes('good')) {
        return 'Thanks! The team did excellent work. Moving to floors 4-6 next week.';
      }
      return 'Thanks for the update! Will coordinate with the inspector this week.';
    }
    
    // Default replies
    const replies = [
      'Got it, thanks for the update!',
      'Sounds good, let me know if you need anything else.',
      'Perfect, appreciate the quick response.',
      'Thanks! Will follow up on this.',
      'Excellent work, keep me posted on progress.'
    ];
    
    return replies[Math.floor(Math.random() * replies.length)];
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const makeCall = (phone: string) => {
    console.log(`Calling ${phone}`);
    // In a real app, this would initiate a phone call
  };

  return (
    <div className="flex h-[600px] bg-background border rounded-lg overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-[#25D366] text-white flex flex-col">
        <div className="p-4 border-b border-green-600">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="h-6 w-6" />
            <span className="font-semibold text-lg">WhatsApp Business</span>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-200" />
            <Input
              placeholder="Search chats..."
              className="pl-10 bg-green-800 border-green-600 text-white placeholder:text-green-200"
            />
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-green-600 transition-colors ${
                  selectedChat?.id === chat.id ? 'bg-green-600' : ''
                }`}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-green-400">
                    <AvatarFallback className="bg-green-300 text-green-800 font-semibold">
                      {getInitials(chat.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm truncate">{chat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-200">{chat.timestamp}</span>
                        {chat.unread > 0 && (
                          <Badge variant="secondary" className="bg-white text-green-800 h-5 px-1.5 text-xs">
                            {chat.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-green-100 truncate">{chat.lastMessage}</p>
                      <div className="flex items-center gap-1">
                        {chat.online && <div className="w-2 h-2 rounded-full bg-green-300"></div>}
                      </div>
                    </div>
                    {chat.phone && (
                      <p className="text-xs text-green-200 mt-1">{chat.phone}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-border bg-[#25D366] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green-300 text-green-800 font-semibold">
                      {getInitials(selectedChat.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedChat.name}</h3>
                    <p className="text-sm text-green-100">
                      {selectedChat.online ? (
                        'Online'
                      ) : selectedChat.lastSeen ? (
                        `Last seen ${selectedChat.lastSeen}`
                      ) : (
                        selectedChat.phone
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white hover:bg-green-600"
                    onClick={() => selectedChat.phone && makeCall(selectedChat.phone)}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-green-600">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-green-600">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              className="flex-1 p-4 overflow-y-auto"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundColor: '#e5ddd5'
              }}
            >
              <div className="space-y-3">
                {selectedChat.messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm ${
                        message.sender === 'You' 
                          ? 'bg-[#dcf8c6] text-black' 
                          : 'bg-white text-black'
                      }`}
                    >
                      {message.type === 'text' ? (
                        <p className="text-sm">{message.content}</p>
                      ) : message.type === 'image' ? (
                        <div className="space-y-2">
                          <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-500">📷 Photo</span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      ) : null}
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                        {message.sender === 'You' && (
                          <span className="text-blue-500 text-xs">✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border bg-white">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon" className="text-gray-500">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-[#25D366] hover:bg-[#1ea952]"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground bg-[#e5ddd5]">
            <div className="text-center">
              <Phone className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppInterface;
