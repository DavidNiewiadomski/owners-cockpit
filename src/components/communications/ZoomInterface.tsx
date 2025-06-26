import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Video, Users, Calendar, Play, Clock, FileText } from 'lucide-react';
import { sampleZoomMeetings } from '@/data/sampleCommunications';

const ZoomInterface: React.FC = () => {
  const [meetings] = useState(sampleZoomMeetings);

  const joinMeeting = (meetingId: string) => {
    console.log(`Joining meeting ${meetingId}`);
    // In a real app, this would open the Zoom client or web interface
  };

  const scheduleMeeting = () => {
    console.log('Schedule new meeting');
    // In a real app, this would open the meeting scheduler
  };

  return (
    <div className="h-[600px] bg-background border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border bg-[#2D8CFF] text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Video className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-semibold">Zoom Meetings</h2>
              <p className="text-blue-100">Video conferencing and collaboration</p>
            </div>
          </div>
          <Button 
            onClick={scheduleMeeting}
            className="bg-white text-[#2D8CFF] hover:bg-gray-100"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <Video className="h-8 w-8 mx-auto mb-2 text-[#2D8CFF]" />
              <h3 className="font-semibold mb-1">Start Instant Meeting</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Begin a meeting immediately
              </p>
              <Button className="w-full bg-[#2D8CFF] hover:bg-[#1e7ae6]">
                Start Meeting
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-[#2D8CFF]" />
              <h3 className="font-semibold mb-1">Join Meeting</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Enter meeting ID to join
              </p>
              <Button variant="outline" className="w-full">
                Join by ID
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-[#2D8CFF]" />
              <h3 className="font-semibold mb-1">Schedule Meeting</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Plan future meetings
              </p>
              <Button variant="outline" className="w-full" onClick={scheduleMeeting}>
                Schedule
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Meetings List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Meetings</h3>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {meetings.map((meeting) => (
                <Card key={meeting.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{meeting.title}</h4>
                          {meeting.status === 'upcoming' && (
                            <Badge variant="outline" className="text-xs">
                              Upcoming
                            </Badge>
                          )}
                          {meeting.status === 'completed' && (
                            <Badge variant="secondary" className="text-xs">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{meeting.time}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{meeting.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            <span>{meeting.participants} participants</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Host: {meeting.host}
                        </p>
                        {meeting.agenda && (
                          <p className="text-sm mt-1">{meeting.agenda}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 ml-4">
                        {meeting.status === 'upcoming' && (
                          <Button 
                            onClick={() => joinMeeting(meeting.id)}
                            className="bg-[#2D8CFF] hover:bg-[#1e7ae6]"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        )}
                        {meeting.status === 'completed' && meeting.recording && (
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            Recording
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ZoomInterface;
