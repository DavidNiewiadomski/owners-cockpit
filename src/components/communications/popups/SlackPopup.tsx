import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Slack, Hash, MessageCircle, Users, Settings } from 'lucide-react';

interface SlackPopupProps {
  projectId: string;
  onClose: () => void;
}

const SlackPopup: React.FC<SlackPopupProps> = ({ projectId, onClose }) => {
  // Mock data - replace with actual API calls
  const channels = [
    {
      id: '1',
      name: 'general-construction',
      type: 'public',
      unread: 5,
      lastMessage: 'Site inspection completed ✅',
      time: '2 min ago'
    },
    {
      id: '2',
      name: 'safety-alerts',
      type: 'public',
      unread: 2,
      lastMessage: 'Weather update: Strong winds expected',
      time: '15 min ago'
    },
    {
      id: '3',
      name: 'project-leads',
      type: 'private',
      unread: 0,
      lastMessage: 'Budget review meeting scheduled',
      time: '1 hour ago'
    }
  ];

  const directMessages = [
    {
      id: '1',
      name: 'Sarah Johnson',
      role: 'Site Manager',
      unread: 3,
      lastMessage: 'Can we review the schedule?',
      time: '5 min ago',
      online: true
    },
    {
      id: '2',
      name: 'Mike Chen',
      role: 'Safety Officer',
      unread: 0,
      lastMessage: 'Thanks for the update',
      time: '30 min ago',
      online: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <Card className="w-full max-w-md bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="bg-green-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Slack className="w-5 h-5" />
              Slack Workspace
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-green-700">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Connection Status */}
          <div className="p-3 border rounded-lg bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Connect to Slack</span>
            </div>
            <p className="text-xs text-yellow-600 mt-1">
              Authorize access to sync channels and messages
            </p>
            <Button size="sm" className="w-full mt-2 bg-green-600 hover:bg-green-700">
              Connect Workspace
            </Button>
          </div>

          {/* Channels Preview */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Channels Preview
            </h4>
            <div className="space-y-2">
              {channels.map((channel) => (
                <div key={channel.id} className="p-3 border rounded-lg opacity-60">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <Hash className="w-3 h-3" />
                      <span className="font-medium text-sm">#{channel.name}</span>
                      {channel.type === 'private' && (
                        <Badge variant="secondary" className="text-xs">Private</Badge>
                      )}
                    </div>
                    {channel.unread > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {channel.unread}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    <div className="truncate">{channel.lastMessage}</div>
                    <div className="text-gray-400 mt-1">{channel.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Direct Messages Preview */}
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Direct Messages Preview
            </h4>
            <div className="space-y-2">
              {directMessages.map((dm) => (
                <div key={dm.id} className="p-3 border rounded-lg opacity-60">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${dm.online ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="font-medium text-sm">{dm.name}</span>
                    </div>
                    {dm.unread > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {dm.unread}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-600">
                    <div className="text-gray-500">{dm.role}</div>
                    <div className="truncate mt-1">{dm.lastMessage}</div>
                    <div className="text-gray-400 mt-1">{dm.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1" disabled>
                <Users className="w-4 h-4 mr-2" />
                Browse Channels
              </Button>
              <Button size="sm" variant="outline" className="flex-1" disabled>
                <MessageCircle className="w-4 h-4 mr-2" />
                New Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlackPopup;
