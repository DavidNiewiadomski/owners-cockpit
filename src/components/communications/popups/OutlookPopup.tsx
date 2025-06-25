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
  Mail, 
  Send, 
  Reply, 
  Forward, 
  Archive, 
  Trash2, 
  Star, 
  Calendar,
  Paperclip,
  Search,
  RefreshCw,
  AlertCircle,
  Clock,
  User,
  Building
} from 'lucide-react';

interface OutlookPopupProps {
  projectId: string;
  onClose: () => void;
}

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  isImportant: boolean;
  hasAttachments: boolean;
  category: string;
}

const OutlookPopup: React.FC<OutlookPopupProps> = ({ projectId, onClose }) => {
  const [activeTab, setActiveTab] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock email data - in real app, fetch from Microsoft Graph API
  const getProjectEmails = () => {
    const emailData: Record<string, Email[]> = {
      '11111111-1111-1111-1111-111111111111': [
        {
          id: '1',
          from: 'Dr. Patricia Adams',
          fromEmail: 'patricia.adams@medcenter.com',
          subject: 'RE: Emergency Power Distribution Questions',
          preview: 'Thanks for the clarification on emergency power routing. The updated drawings...',
          body: 'Thanks for the clarification on emergency power routing. The updated drawings showing approved distribution paths for OR suites look good. I have a few follow-up questions:\n\n1. What about backup power for the medical gas compressors?\n2. Can we get redundant feeds to the critical care units?\n\nLet me know when you have time to discuss.\n\nBest,\nDr. Adams',
          timestamp: '2 hours ago',
          isRead: false,
          isImportant: true,
          hasAttachments: true,
          category: 'Medical Center'
        },
        {
          id: '2',
          from: 'Mike Rodriguez',
          fromEmail: 'mike.rodriguez@contractor.com',
          subject: 'MEP Coordination Issues - Urgent',
          preview: 'We have conflicts between HVAC ductwork and structural steel...',
          body: 'We have conflicts between HVAC ductwork and structural steel in the patient tower mechanical rooms. Need to schedule coordination meeting ASAP to resolve before concrete pour on Friday.\n\nCan we meet tomorrow at 8 AM on site?\n\nMike',
          timestamp: '4 hours ago',
          isRead: false,
          isImportant: true,
          hasAttachments: false,
          category: 'Construction'
        },
        {
          id: '3',
          from: 'Jessica Wu',
          fromEmail: 'jessica.wu@medequip.com',
          subject: 'Medical Equipment Delivery Update',
          preview: 'MRI equipment delivery has been rescheduled to accommodate...',
          body: 'MRI equipment delivery has been rescheduled to accommodate the building readiness timeline. New delivery date is January 15th, which aligns with the completion of the imaging suite.\n\nPlease confirm this works with your schedule.',
          timestamp: '1 day ago',
          isRead: true,
          isImportant: false,
          hasAttachments: false,
          category: 'Equipment'
        }
      ],
      'portfolio': [
        {
          id: '1',
          from: 'Construction Manager',
          fromEmail: 'manager@construction.com',
          subject: 'Weekly Portfolio Report',
          preview: 'This week\'s progress across all active projects...',
          body: 'Weekly portfolio summary with progress updates from all active projects.',
          timestamp: '1 hour ago',
          isRead: false,
          isImportant: false,
          hasAttachments: true,
          category: 'Reports'
        }
      ]
    };
    
    return emailData[projectId] || emailData.portfolio;
  };

  const emails = getProjectEmails();
  const filteredEmails = emails.filter(email => 
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    // Mark as read in real implementation
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedEmail(null);
  };

  const handleReply = (email: Email) => {
    setIsComposing(true);
    setSelectedEmail(email);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[80vh] bg-white dark:bg-gray-900">
        <CardHeader className="pb-3 border-b bg-blue-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Outlook - Project Communications
              <Badge variant="secondary" className="bg-white/20 text-white">
                {emails.filter(e => !e.isRead).length} unread
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={handleCompose}
              >
                <Send className="w-4 h-4 mr-2" />
                Compose
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <RefreshCw className="w-4 h-4" />
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
            {/* Email List Sidebar */}
            <div className="w-1/3 border-r border-border flex flex-col">
              {/* Search */}
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search emails..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Email List */}
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {filteredEmails.map((email) => (
                    <div
                      key={email.id}
                      className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors border ${
                        selectedEmail?.id === email.id
                          ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                          : 'hover:bg-muted border-transparent'
                      } ${!email.isRead ? 'font-medium' : ''}`}
                      onClick={() => handleEmailClick(email)}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium">
                            {email.from.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm truncate">{email.from}</div>
                            <div className="text-xs text-muted-foreground">{email.timestamp}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {email.isImportant && <AlertCircle className="w-3 h-3 text-red-500" />}
                          {email.hasAttachments && <Paperclip className="w-3 h-3 text-muted-foreground" />}
                          {!email.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                        </div>
                      </div>
                      <div className="text-sm font-medium mb-1 truncate">{email.subject}</div>
                      <div className="text-xs text-muted-foreground truncate">{email.preview}</div>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {email.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Email Content */}
            <div className="flex-1 flex flex-col">
              {selectedEmail ? (
                <>
                  {/* Email Header */}
                  <div className="p-4 border-b bg-muted/30">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{selectedEmail.subject}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="w-4 h-4" />
                          <span>{selectedEmail.from}</span>
                          <span>({selectedEmail.fromEmail})</span>
                          <Clock className="w-4 h-4 ml-2" />
                          <span>{selectedEmail.timestamp}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleReply(selectedEmail)}>
                          <Reply className="w-4 h-4 mr-2" />
                          Reply
                        </Button>
                        <Button variant="outline" size="sm">
                          <Forward className="w-4 h-4 mr-2" />
                          Forward
                        </Button>
                        <Button variant="outline" size="sm">
                          <Archive className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Email Body */}
                  <ScrollArea className="flex-1 p-4">
                    <div className="prose max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {selectedEmail.body}
                      </pre>
                    </div>
                  </ScrollArea>

                  {/* Quick Actions */}
                  <div className="p-4 border-t bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Button size="sm" onClick={() => handleReply(selectedEmail)}>
                        <Reply className="w-4 h-4 mr-2" />
                        Quick Reply
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Meeting
                      </Button>
                      <Button variant="outline" size="sm">
                        <Building className="w-4 h-4 mr-2" />
                        Create Action Item
                      </Button>
                    </div>
                  </div>
                </>
              ) : isComposing ? (
                /* Compose Email */
                <div className="flex-1 p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">To:</label>
                      <Input placeholder="Enter email addresses..." className="mt-1" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Subject:</label>
                      <Input 
                        placeholder="Email subject..." 
                        className="mt-1"
                        defaultValue={selectedEmail ? `RE: ${selectedEmail.subject}` : ''}
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-sm font-medium">Message:</label>
                      <Textarea 
                        placeholder="Type your message..." 
                        className="mt-1 min-h-[300px]"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Button variant="outline">
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach Files
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setIsComposing(false)}>
                          Cancel
                        </Button>
                        <Button>
                          <Send className="w-4 h-4 mr-2" />
                          Send
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* No Selection */
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select an email to view its content</p>
                    <p className="text-sm mt-2">or click Compose to write a new message</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OutlookPopup;
