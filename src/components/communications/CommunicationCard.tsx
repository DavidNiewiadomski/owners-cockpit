
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Mail, 
  Video, 
  Users, 
  Clock, 
  Play, 
  FileText,
  Reply,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Communication } from '@/hooks/useCommunications';

interface CommunicationCardProps {
  communication: Communication;
  onMeetingClick: (communication: Communication) => void;
  onReplyClick: (communication: Communication) => void;
}

const CommunicationCard: React.FC<CommunicationCardProps> = ({
  communication,
  onMeetingClick,
  onReplyClick,
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting_recording':
      case 'meeting_transcript':
        return <Video className="w-5 h-5" />;
      case 'email':
        return <Mail className="w-5 h-5" />;
      case 'chat_message':
        return <MessageSquare className="w-5 h-5" />;
      case 'channel_message':
        return <Users className="w-5 h-5" />;
      default:
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  const getProviderLogo = (provider: string) => {
    switch (provider) {
      case 'teams':
        return <div className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-white text-xs font-bold">T</div>;
      case 'outlook':
        return <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">O</div>;
      case 'zoom':
        return <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">Z</div>;
      case 'google_meet':
        return <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">G</div>;
      default:
        return <div className="w-6 h-6 bg-gray-500 rounded flex items-center justify-center text-white text-xs font-bold">?</div>;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-100 text-blue-800';
      case 'chat_message':
      case 'channel_message':
        return 'bg-green-100 text-green-800';
      case 'meeting_recording':
      case 'meeting_transcript':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isMeeting = communication.comm_type === 'meeting_recording' || communication.comm_type === 'meeting_transcript';
  const isEmailOrChat = communication.comm_type === 'email' || communication.comm_type === 'chat_message' || communication.comm_type === 'channel_message';

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-muted-foreground">
            {getTypeIcon(communication.comm_type)}
          </div>
          <div className="flex items-center gap-2">
            {getProviderLogo(communication.provider)}
            <Badge className={`text-xs ${getTypeColor(communication.comm_type)}`}>
              {communication.comm_type.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Processed
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          {formatDistanceToNow(new Date(communication.message_ts), { addSuffix: true })}
        </div>
      </div>

      {communication.subject && (
        <h4 className="font-semibold mb-2 text-lg">{communication.subject}</h4>
      )}

      {communication.speaker?.name && (
        <div className="flex items-center gap-1 mb-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          {communication.speaker.name}
          {communication.participants.length > 1 && (
            <span>+ {communication.participants.length - 1} others</span>
          )}
        </div>
      )}

      {communication.body && (
        <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
          {communication.body}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {isMeeting && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMeetingClick(communication)}
                className="flex items-center gap-1"
              >
                <Play className="w-4 h-4" />
                Play
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onMeetingClick(communication)}
                className="flex items-center gap-1"
              >
                <FileText className="w-4 h-4" />
                View Summary
              </Button>
            </>
          )}
          
          {isEmailOrChat && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReplyClick(communication)}
              className="flex items-center gap-1"
            >
              <Reply className="w-4 h-4" />
              Draft Reply
            </Button>
          )}
        </div>

        {communication.url && (
          <Button variant="ghost" size="sm" asChild>
            <a href={communication.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        )}
      </div>
    </Card>
  );
};

export default CommunicationCard;
