
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Loader2, Send, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Communication } from '@/hooks/useCommunications';

interface SmartReplyDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  thread: Communication | null;
  projectId: string;
}

const SmartReplyDrawer: React.FC<SmartReplyDrawerProps> = ({
  isOpen,
  onClose,
  thread,
  projectId,
}) => {
  const [prompt, setPrompt] = useState('');
  const [draftReply, setDraftReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleGenerateReply = async () => {
    if (!thread || !prompt.trim()) return;

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('draft-reply', {
        body: {
          thread_id: thread.external_id,
          prompt: prompt.trim(),
          project_id: projectId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) throw error;

      setDraftReply(data.draft);
      toast({
        title: "Reply Generated",
        description: "AI-generated reply is ready for review.",
      });
    } catch (error) {
      console.error('Error generating reply:', error);
      toast({
        title: "Error",
        description: "Failed to generate reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendReply = async () => {
    if (!thread || !draftReply.trim()) return;

    setIsSending(true);
    try {
      const { error } = await supabase.functions.invoke('send-reply', {
        body: {
          message_id: thread.external_id,
          reply_body: draftReply,
          project_id: projectId,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }
      });

      if (error) throw error;

      toast({
        title: "Reply Sent",
        description: "Your reply has been sent successfully.",
      });
      
      setPrompt('');
      setDraftReply('');
      onClose();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setPrompt('');
    setDraftReply('');
    onClose();
  };

  if (!thread) return null;

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Smart Reply
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Original Message */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">{thread.subject || 'Original Message'}</h4>
            <p className="text-sm text-muted-foreground line-clamp-4">
              {thread.body}
            </p>
          </div>

          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt">How would you like to reply?</Label>
            <Textarea
              id="prompt"
              placeholder="e.g., 'Acknowledge receipt and ask for more details about the budget revision'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-20"
            />
            <Button
              onClick={handleGenerateReply}
              disabled={!prompt.trim() || isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Reply
                </>
              )}
            </Button>
          </div>

          {/* Generated Reply */}
          {draftReply && (
            <div className="space-y-2">
              <Label htmlFor="reply">Generated Reply</Label>
              <Textarea
                id="reply"
                value={draftReply}
                onChange={(e) => setDraftReply(e.target.value)}
                className="min-h-32"
              />
              <Button
                onClick={handleSendReply}
                disabled={!draftReply.trim() || isSending}
                className="w-full"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SmartReplyDrawer;
