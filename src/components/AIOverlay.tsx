
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Mic, Send, X, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface AIOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPrompt?: string;
}

interface OverlayResponse {
  action: 'navigate' | 'query' | 'tool' | 'chat';
  path?: string;
  data?: any;
  message?: string;
  toolName?: string;
  toolArgs?: any;
}

const AIOverlay: React.FC<AIOverlayProps> = ({ isOpen, onClose, defaultPrompt = '' }) => {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recentQueries, setRecentQueries] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setPrompt(defaultPrompt);
  }, [defaultPrompt]);

  // Load recent queries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('overlay_history');
    if (stored) {
      try {
        setRecentQueries(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to load overlay history:', e);
      }
    }
  }, []);

  const saveQuery = (query: string) => {
    const updated = [query, ...recentQueries.filter(q => q !== query)].slice(0, 5);
    setRecentQueries(updated);
    localStorage.setItem('overlay_history', JSON.stringify(updated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isProcessing) return;

    setIsProcessing(true);
    saveQuery(prompt);

    try {
      const response = await fetch('/api/overlay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() })
      });

      if (!response.ok) throw new Error('Failed to process request');

      const result: OverlayResponse = await response.json();
      await executeAction(result);
      
      setPrompt('');
      onClose();
    } catch (error) {
      console.error('Overlay error:', error);
      toast({
        title: "Command Failed",
        description: "Sorry, I couldn't process that request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const executeAction = async (result: OverlayResponse) => {
    switch (result.action) {
      case 'navigate':
        if (result.path) {
          window.location.href = result.path;
          toast({
            title: "Navigating",
            description: result.message || `Going to ${result.path}`
          });
        }
        break;
        
      case 'query':
        toast({
          title: "Data Retrieved",
          description: result.message || "Here's what I found"
        });
        break;
        
      case 'tool':
        if (result.toolName) {
          // This would integrate with your MCP tools
          toast({
            title: "Action Executed",
            description: result.message || `Executed ${result.toolName}`
          });
        }
        break;
        
      case 'chat':
        toast({
          title: "AI Response",
          description: result.message || "Command processed"
        });
        break;
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Not Available",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive"
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setPrompt(transcript);
    };

    recognition.onerror = () => {
      toast({
        title: "Voice Input Failed",
        description: "Could not capture voice input. Please try typing instead.",
        variant: "destructive"
      });
      setIsListening(false);
    };

    recognition.start();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-6 bg-background/95 backdrop-blur border-border/50 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Ask Anything</h2>
                </div>
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Go to Project Alpha schedule, Show budget overrun chart, Create RFI..."
                    className="flex-1 text-base"
                    disabled={isProcessing}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={startVoiceInput}
                    disabled={isProcessing || isListening}
                    className="px-3"
                  >
                    <Mic className={`w-4 h-4 ${isListening ? 'text-red-500 animate-pulse' : ''}`} />
                  </Button>
                  <Button
                    type="submit"
                    disabled={!prompt.trim() || isProcessing}
                    className="px-4"
                  >
                    {isProcessing ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </form>

              {recentQueries.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">Recent commands:</p>
                  <div className="flex flex-wrap gap-2">
                    {recentQueries.map((query, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() => setPrompt(query)}
                      >
                        {query.length > 40 ? `${query.substring(0, 40)}...` : query}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 text-xs text-muted-foreground">
                <p className="mb-1">Try commands like:</p>
                <ul className="space-y-1">
                  <li>• "Go to Project Alpha schedule"</li>
                  <li>• "Show budget overrun chart"</li>
                  <li>• "Create RFI about steel delay"</li>
                  <li>• "Summarize last meeting"</li>
                </ul>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIOverlay;
