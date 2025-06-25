import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Phone, User, Clock } from 'lucide-react';

interface WhatsAppPopupProps {
  projectId: string;
  onClose: () => void;
}

const WhatsAppPopup: React.FC<WhatsAppPopupProps> = ({ projectId, onClose }) => {
  // Mock data - replace with actual API calls
  const chatList = [
    {
      id: '1',
      name: 'Client - Johnson Builders',
      lastMessage: 'Looking forward to our next meeting.',
      time: '3 min ago',
      unread: 2,
      onlineStatus: 'online'
    },
    {
      id: '2',
      name: 'Supplier - FastMaterials',
      lastMessage: 'Your order has been shipped.',
      time: '10 min ago',
      unread: 0,
      onlineStatus: 'offline'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <Card className="w-full max-w-xs bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="bg-green-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              WhatsApp Chats
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-green-600">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          {chatList.map(chat => (
            <div key={chat.id} className="p-3 border rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-green-400" />
                  <span className="font-medium text-sm">{chat.name}</span>
                </div>
                {chat.unread > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {chat.unread}
                  </Badge>
                )}
              </div>
              <div className="text-xs text-gray-600">
                <div className="truncate">{chat.lastMessage}</div>
                <div className="text-gray-400 mt-1">{chat.time}</div>
              </div>
              <Button size="sm" variant="outline" className="w-full mt-2 text-xs">
                View Chat
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhatsAppPopup;

