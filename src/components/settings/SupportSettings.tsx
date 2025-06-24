
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  HelpCircle, 
  MessageCircle, 
  BookOpen, 
  ExternalLink, 
  Mail,
  FileText,
  Video,
  Users
} from 'lucide-react';

const SupportSettings: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Get Help
          </CardTitle>
          <CardDescription>
            Find answers, contact support, and access resources
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-20 flex-col gap-2">
              <BookOpen className="h-6 w-6" />
              <span>Documentation</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Video className="h-6 w-6" />
              <span>Video Tutorials</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <Users className="h-6 w-6" />
              <span>Community Forum</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2">
              <MessageCircle className="h-6 w-6" />
              <span>Live Chat</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
          <CardDescription>
            Need help? Send us a message and we'll get back to you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" placeholder="Briefly describe your issue" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technical">Technical Issue</SelectItem>
                <SelectItem value="billing">Billing & Account</SelectItem>
                <SelectItem value="feature">Feature Request</SelectItem>
                <SelectItem value="integration">Integration Support</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Describe your issue in detail..."
              className="min-h-[120px]"
            />
          </div>

          <Button className="w-full">
            <Mail className="h-4 w-4 mr-2" />
            Send Message
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>
            Information that helps us troubleshoot issues
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Application Version:</span>
              <span>v2.1.4</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Browser:</span>
              <span>Chrome 120.0.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Operating System:</span>
              <span>Windows 11</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Login:</span>
              <span>2024-01-15 09:30 UTC</span>
            </div>
          </div>
          <Button variant="outline" className="w-full mt-4">
            <FileText className="h-4 w-4 mr-2" />
            Copy System Info
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feedback</CardTitle>
          <CardDescription>
            Help us improve by sharing your thoughts and suggestions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feedback">Your Feedback</Label>
            <Textarea
              id="feedback"
              placeholder="What would you like to see improved?"
              className="min-h-[100px]"
            />
          </div>
          <Button variant="outline" className="w-full">
            Submit Feedback
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SupportSettings;
