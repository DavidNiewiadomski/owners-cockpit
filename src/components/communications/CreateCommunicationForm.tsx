
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useCreateCommunication } from '@/hooks/useCommunications';
import { toast } from '@/hooks/use-toast';

interface CreateCommunicationFormProps {
  projectId: string;
  onSuccess?: () => void;
}

const CreateCommunicationForm: React.FC<CreateCommunicationFormProps> = ({ 
  projectId, 
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    provider: 'manual' as const,
    comm_type: 'email' as const,
    subject: '',
    body: '',
    speaker_name: '',
    speaker_email: '',
    url: '',
    thread_id: ''
  });
  
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState('');

  const createMutation = useCreateCommunication();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createMutation.mutateAsync({
        project_id: projectId,
        provider: formData.provider,
        comm_type: formData.comm_type,
        subject: formData.subject || undefined,
        body: formData.body || undefined,
        speaker: {
          name: formData.speaker_name || undefined,
          email: formData.speaker_email || undefined,
        },
        message_ts: new Date().toISOString(),
        url: formData.url || undefined,
        participants,
        thread_id: formData.thread_id || undefined,
        external_id: crypto.randomUUID(),
        metadata: {}
      });

      toast({
        title: "Communication Created",
        description: "The communication has been successfully added to the project.",
      });

      // Reset form
      setFormData({
        provider: 'manual',
        comm_type: 'email',
        subject: '',
        body: '',
        speaker_name: '',
        speaker_email: '',
        url: '',
        thread_id: ''
      });
      setParticipants([]);
      
      onSuccess?.();
    } catch (_error) {
      toast({
        title: "Error",
        description: "Failed to create communication. Please try again.",
        variant: "destructive"
      });
    }
  };

  const addParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const removeParticipant = (participant: string) => {
    setParticipants(participants.filter(p => p !== participant));
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Add Communication</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="provider">Provider</Label>
            <Select 
              value={formData.provider} 
              onValueChange={(value: unknown) => setFormData({ ...formData, provider: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="teams">Teams</SelectItem>
                <SelectItem value="outlook">Outlook</SelectItem>
                <SelectItem value="zoom">Zoom</SelectItem>
                <SelectItem value="google_meet">Google Meet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="comm_type">Type</Label>
            <Select 
              value={formData.comm_type} 
              onValueChange={(value: unknown) => setFormData({ ...formData, comm_type: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="chat_message">Chat Message</SelectItem>
                <SelectItem value="meeting_recording">Meeting Recording</SelectItem>
                <SelectItem value="meeting_transcript">Meeting Transcript</SelectItem>
                <SelectItem value="channel_message">Channel Message</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            placeholder="Communication subject or title"
          />
        </div>

        <div>
          <Label htmlFor="body">Content</Label>
          <Textarea
            id="body"
            rows={4}
            value={formData.body}
            onChange={(e) => setFormData({ ...formData, body: e.target.value })}
            placeholder="Communication content or body"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="speaker_name">Speaker Name</Label>
            <Input
              id="speaker_name"
              value={formData.speaker_name}
              onChange={(e) => setFormData({ ...formData, speaker_name: e.target.value })}
              placeholder="Name of the speaker/sender"
            />
          </div>

          <div>
            <Label htmlFor="speaker_email">Speaker Email</Label>
            <Input
              id="speaker_email"
              type="email"
              value={formData.speaker_email}
              onChange={(e) => setFormData({ ...formData, speaker_email: e.target.value })}
              placeholder="Email of the speaker/sender"
            />
          </div>
        </div>

        <div>
          <Label>Participants</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              placeholder="Add participant email"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addParticipant())}
            />
            <Button type="button" onClick={addParticipant} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {participants.map((participant) => (
              <Badge key={participant} variant="secondary" className="flex items-center gap-1">
                {participant}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeParticipant(participant)}
                />
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="Link to original communication"
            />
          </div>

          <div>
            <Label htmlFor="thread_id">Thread ID</Label>
            <Input
              id="thread_id"
              value={formData.thread_id}
              onChange={(e) => setFormData({ ...formData, thread_id: e.target.value })}
              placeholder="Thread or conversation ID"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create Communication'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CreateCommunicationForm;
