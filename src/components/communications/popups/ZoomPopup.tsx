import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Video, Calendar, Users, Clock } from 'lucide-react';

interface ZoomPopupProps {
  projectId: string;
  onClose: () => void;
}

const ZoomPopup: React.FC<ZoomPopupProps> = ({ projectId, onClose }) => {
  // Mock data - replace with actual API calls
  const upcomingMeetings = [
    {
      id: '1',
      title: 'Project Status Review',
      time: '2:00 PM Today',
      attendees: 8,
      duration: '30 min',
      meetingId: '123-456-789',
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Site Safety Meeting',
      time: '10:00 AM Tomorrow',
      attendees: 12,
      duration: '45 min',
      meetingId: '987-654-321',
      status: 'upcoming'
    }
  ];

  const recentMeetings = [
    {
      id: '3',
      title: 'Weekly Team Sync',
      time: 'Yesterday 3:00 PM',
      attendees: 6,
      duration: '45 min',
      status: 'completed',
      recording: true
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <Card className="w-full max-w-md bg-white shadow-xl" onClick={(e) => e.stopPropagation()}>
        <CardHeader className="bg-blue-500 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="w-5 h-5" />
              Zoom Meetings
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-blue-600">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {/* Quick Actions */}
          <div className="flex gap-2">
            <Button size="sm" className="flex-1">
              <Video className="w-4 h-4 mr-2" />
              Start Meeting
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
          </div>

          {/* Upcoming Meetings */}
          <div>
            <h4 className="font-medium mb-2">Upcoming Meetings</h4>
            <div className="space-y-2">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-sm">{meeting.title}</h5>
                    <Badge variant="outline" className="text-xs">
                      {meeting.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {meeting.time} ({meeting.duration})
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {meeting.attendees} attendees
                    </div>
                    <div className="text-gray-500">ID: {meeting.meetingId}</div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2 text-xs">
                    Join Meeting
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Meetings */}
          <div>
            <h4 className="font-medium mb-2">Recent Meetings</h4>
            <div className="space-y-2">
              {recentMeetings.map((meeting) => (
                <div key={meeting.id} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-medium text-sm">{meeting.title}</h5>
                    {meeting.recording && (
                      <Badge variant="secondary" className="text-xs">
                        Recorded
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div>{meeting.time} ({meeting.duration})</div>
                    <div>{meeting.attendees} attendees</div>
                  </div>
                  {meeting.recording && (
                    <Button size="sm" variant="outline" className="w-full mt-2 text-xs">
                      View Recording
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ZoomPopup;
