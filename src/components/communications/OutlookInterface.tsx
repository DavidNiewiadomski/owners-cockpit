import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Send, 
  Reply, 
  Forward, 
  Archive, 
  Star, 
  Trash2, 
  Calendar,
  Paperclip,
  Search,
  Inbox,
  DraftingCompass,
  Users,
  Settings
} from 'lucide-react';
import { sampleEmails, ownerCompanyProfile } from '@/data/sampleCommunications';

interface Email {
  id: string;
  from: string;
  fromName?: string;
  fromTitle?: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  hasAttachment: boolean;
  priority: 'high' | 'normal' | 'low';
  category?: string;
}

const OutlookInterface: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [composing, setComposing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [composeData, setComposeData] = useState({
    to: '',
    subject: '',
    body: ''
  });

  // Load realistic construction owner emails
  useEffect(() => {
    setEmails(sampleEmails as Email[]);
    setSelectedEmail(sampleEmails[0] as Email);
  }, []);

  const handleSendEmail = () => {
    const newEmail: Email = {
      id: Date.now().toString(),
      from: `${ownerCompanyProfile.owner.toLowerCase().replace(' ', '.')}@${ownerCompanyProfile.name.toLowerCase().replace(/\s+/g, '')}.com`,
      fromName: ownerCompanyProfile.owner,
      fromTitle: 'Building Owner',
      subject: composeData.subject,
      body: composeData.body,
      timestamp: 'Just now',
      read: true,
      starred: false,
      hasAttachment: false,
      priority: 'normal',
      category: 'owner'
    };

    setEmails(prev => [newEmail, ...prev]);
    setComposeData({ to: '', subject: '', body: '' });
    setComposing(false);
  };

  const toggleStar = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, starred: !email.starred } : email
    ));
  };

  const markAsRead = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, read: true } : email
    ));
  };

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.from.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[600px] bg-background rounded-lg overflow-hidden border border-border/40">
      {/* Sidebar */}
      <div className="w-64 bg-[#0078d4] text-white flex flex-col border-r border-border/20">
        <div className="p-4 border-b border-blue-600">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-6 w-6" />
            <span className="font-semibold text-lg">{ownerCompanyProfile.name}</span>
          </div>
          <Button 
            className="w-full bg-white text-[#0078d4] hover:bg-gray-100"
            onClick={() => setComposing(true)}
          >
            <Send className="h-4 w-4 mr-2" />
            New Email
          </Button>
        </div>
        
        <div className="flex-1 p-2">
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-blue-600">
              <Inbox className="h-4 w-4 mr-2" />
              Inbox ({emails.filter(e => !e.read).length})
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-blue-600">
              <DraftingCompass className="h-4 w-4 mr-2" />
              Drafts
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-blue-600">
              <Send className="h-4 w-4 mr-2" />
              Sent Items
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-blue-600">
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
            <Button variant="ghost" className="w-full justify-start text-white hover:bg-blue-600">
              <Trash2 className="h-4 w-4 mr-2" />
              Deleted Items
            </Button>
          </div>
        </div>

        <div className="p-2 border-t border-blue-600">
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-blue-600">
            <Calendar className="h-4 w-4 mr-2" />
            Calendar
          </Button>
          <Button variant="ghost" className="w-full justify-start text-white hover:bg-blue-600">
            <Users className="h-4 w-4 mr-2" />
            People
          </Button>
        </div>
      </div>

      {/* Email List */}
      <div className="w-80 border-r border-border">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emails..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(600px-80px)]">
          {filteredEmails.map((email) => (
            <div
              key={email.id}
              className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 ${
                selectedEmail?.id === email.id ? 'bg-muted' : ''
              } ${!email.read ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}
              onClick={() => {
                setSelectedEmail(email);
                markAsRead(email.id);
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${!email.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                  <div className="flex flex-col">
                    <span className={`text-sm ${!email.read ? 'font-semibold' : 'font-normal'}`}>
                      {email.fromName || email.from.split('@')[0]}
                    </span>
                    {email.fromTitle && (
                      <span className="text-xs text-muted-foreground">
                        {email.fromTitle}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {email.priority === 'high' && <Badge variant="destructive" className="h-2 w-2 p-0" />}
                  {email.hasAttachment && <Paperclip className="h-3 w-3 text-muted-foreground" />}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(email.id);
                    }}
                  >
                    <Star className={`h-3 w-3 ${email.starred ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                  </Button>
                </div>
              </div>
              <div className="space-y-1">
                <p className={`text-sm line-clamp-1 ${!email.read ? 'font-semibold' : 'font-normal'}`}>
                  {email.subject}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {email.body}
                </p>
                <p className="text-xs text-muted-foreground">
                  {email.timestamp}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Email Content or Compose */}
      <div className="flex-1 flex flex-col">
        {composing ? (
          /* Compose Email */
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">New Email</h2>
              <Button variant="ghost" onClick={() => setComposing(false)}>
                Cancel
              </Button>
            </div>
            <div className="space-y-4">
              <Input
                placeholder="To: email@example.com"
                value={composeData.to}
                onChange={(e) => setComposeData(prev => ({ ...prev, to: e.target.value }))}
              />
              <Input
                placeholder="Subject"
                value={composeData.subject}
                onChange={(e) => setComposeData(prev => ({ ...prev, subject: e.target.value }))}
              />
              <Textarea
                placeholder="Write your email..."
                value={composeData.body}
                onChange={(e) => setComposeData(prev => ({ ...prev, body: e.target.value }))}
                className="min-h-[300px]"
              />
              <div className="flex items-center gap-2">
                <Button onClick={handleSendEmail} className="bg-[#0078d4] hover:bg-[#106ebe]">
                  <Send className="h-4 w-4 mr-2" />
                  Send
                </Button>
                <Button variant="outline">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Attach
                </Button>
              </div>
            </div>
          </div>
        ) : selectedEmail ? (
          /* Email Content */
          <div className="flex-1 flex flex-col">
            <div className="p-6 border-b border-border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{selectedEmail.subject}</h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>From: {selectedEmail.fromName || selectedEmail.from}</span>
                    {selectedEmail.fromTitle && <span>({selectedEmail.fromTitle})</span>}
                    <span>{selectedEmail.timestamp}</span>
                    {selectedEmail.priority === 'high' && (
                      <Badge variant="destructive">High Priority</Badge>
                    )}
                    {selectedEmail.category && (
                      <Badge variant="outline" className="capitalize">{selectedEmail.category}</Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Reply className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                  <Button variant="outline" size="sm">
                    <Forward className="h-4 w-4 mr-1" />
                    Forward
                  </Button>
                  <Button variant="outline" size="sm">
                    <Archive className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-6">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {selectedEmail.body}
              </div>
            </ScrollArea>
          </div>
        ) : (
          /* No Email Selected */
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Select an email to read</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutlookInterface;
