import { supabase } from '@/integrations/supabase/client';
import { VoiceService } from './voice-service';
import { UnifiedAIService } from './unified-ai-service';
import { shouldUseLocalProxy, getAIEndpoint, logAIConfig } from './config';
import { AutonomousAgent } from '@/lib/ai/autonomous-agent';

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  audioUrl?: string;
  toolCalls?: any[];
  isVoiceInput?: boolean;
  metadata?: any;
}

export interface AIConversationRequest {
  message: string;
  projectId: string;
  userId?: string;
  conversationId?: string;
  enableVoice?: boolean;
  voiceOptimized?: boolean;
  isVoiceInput?: boolean;
  context?: any;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  taskType?: string;
  voiceId?: string;
  voiceSettings?: any;
}

export interface AIConversationResponse {
  success: boolean;
  message: string;
  audioUrl?: string;
  toolCalls?: any[];
  metadata?: {
    model: string;
    tokens: number;
    responseTime: number;
    hasVoice: boolean;
    toolsUsed: string[];
  };
  error?: string;
}

export interface PlatformAction {
  type: 'navigate' | 'execute' | 'update' | 'create' | 'send';
  target: string;
  parameters: any;
  requiresConfirmation?: boolean;
}

export class FrontendAIService {
  private voiceService: VoiceService | null = null;
  private isInitialized = false;
  private conversationHistory: AIMessage[] = [];
  private currentConversationId: string;
  private userId: string;
  private projectId: string;

  constructor(userId: string, projectId: string) {
    this.userId = userId;
    this.projectId = projectId;
    this.currentConversationId = this.generateConversationId();
  }

  async initialize(): Promise<boolean> {
    try {
      // Initialize voice service for client-side voice features
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        // We'll use the browser's Web Speech API and AudioContext
        // No API keys needed in the browser
        this.voiceService = new VoiceService(
          {} as UnifiedAIService, // We don't need the full unified service on frontend
          {
            defaultVoice: 'en-US',
            defaultLanguage: 'en-US',
            enableTranscription: true,
            enableRealTime: true
          }
        );
      }

      this.isInitialized = true;
      console.log('✅ Frontend AI Service initialized');
      logAIConfig(); // Log AI configuration for debugging
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Frontend AI Service:', error);
      return false;
    }
  }

  async processMessage(request: AIConversationRequest): Promise<AIConversationResponse> {
    const startTime = Date.now();

    try {
      // Add user message to history
      const userMessage: AIMessage = {
        id: this.generateMessageId(),
        role: 'user',
        content: request.message,
        timestamp: new Date().toISOString(),
        isVoiceInput: request.isVoiceInput,
        metadata: request.context
      };
      this.conversationHistory.push(userMessage);

      let data: any;
      let error: any;

      // Check if we should use local proxy
      if (shouldUseLocalProxy()) {
        // Use local proxy server
        console.log('🔄 Using local AI proxy server');
        try {
          const response = await fetch(getAIEndpoint('construction-assistant'), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: request.message,
              user_id: request.userId || 'demo_user',
              project_id: request.projectId,
              conversation_id: request.conversationId || this.currentConversationId,
              task_type: request.taskType || 'analysis',
              latency_requirement: request.priority === 'urgent' ? 'low' : 'medium',
              ai_budget: 1000,
              enable_voice: request.enableVoice || false,
              voice_optimized: request.voiceOptimized || false,
              context: {
                ...request.context,
                conversationHistory: this.conversationHistory.slice(-10) // Last 10 messages
              },
              tools_enabled: true,
              require_approval: false,
              voice_id: request.voiceId,
              voice_settings: request.voiceSettings
            })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
          }

          data = await response.json();
        } catch (fetchError) {
          error = fetchError;
        }
      } else {
        // Use Supabase edge function
        console.log('🚀 Using Supabase edge function');
        const result = await supabase.functions.invoke('construction-assistant', {
          body: {
            message: request.message,
            user_id: request.userId || 'demo_user',
            project_id: request.projectId,
            conversation_id: request.conversationId || this.currentConversationId,
            task_type: request.taskType || 'analysis',
            latency_requirement: request.priority === 'urgent' ? 'low' : 'medium',
            ai_budget: 1000,
            enable_voice: request.enableVoice || false,
            voice_optimized: request.voiceOptimized || false,
            context: {
              ...request.context,
              conversationHistory: this.conversationHistory.slice(-10) // Last 10 messages
            },
            tools_enabled: true,
            require_approval: false,
            voice_id: request.voiceId,
            voice_settings: request.voiceSettings
          }
        });
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('AI service error:', error);
        throw new Error(`AI processing failed: ${error.message || error}`);
      }

      if (!data) {
        throw new Error('No data received from AI service');
      }
      
      // Check if we got a valid response (even if using fallback)
      if (!data.response && !data.success) {
        throw new Error('Invalid response format from AI service');
      }

      // Add assistant message to history
      const assistantMessage: AIMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date().toISOString(),
        audioUrl: data.audio_url,
        toolCalls: data.tool_results,
        metadata: data.model_info
      };
      this.conversationHistory.push(assistantMessage);

      // Play audio if available and requested
      if (data.audio_url && request.enableVoice) {
        // Don't await to avoid blocking the response
        this.playAudioResponse(data.audio_url).catch(err => {
          console.warn('Audio playback failed, continuing with text response:', err);
        });
      }

      return {
        success: true,
        message: data.response,
        audioUrl: data.audio_url,
        toolCalls: data.tool_results || [],
        metadata: {
          model: data.model_info?.model_used || 'unknown',
          tokens: data.model_info?.token_count || 0,
          responseTime: Date.now() - startTime,
          hasVoice: !!data.audio_url,
          toolsUsed: (data.tool_results || []).map((t: any) => t.name || 'tool')
        }
      };
    } catch (error: any) {
      console.error('❌ Message processing failed:', error);
      return {
        success: false,
        message: 'I apologize, but I encountered an error processing your request. Please try again.',
        error: error.message || 'Unknown error',
        metadata: {
          model: 'error',
          tokens: 0,
          responseTime: Date.now() - startTime,
          hasVoice: false,
          toolsUsed: []
        }
      };
    }
  }

  // Voice input handling
  async startVoiceRecording(
    onTranscript?: (transcript: string) => void,
    onError?: (error: Error) => void
  ): Promise<void> {
    try {
      // Use Web Speech API directly for real-time transcription
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      
      if (!SpeechRecognition) {
        throw new Error('Speech recognition not supported in this browser');
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const lastResult = event.results[event.results.length - 1];
        const transcript = lastResult[0].transcript;
        
        // Only send final results
        if (lastResult.isFinal && onTranscript) {
          onTranscript(transcript);
          recognition.stop();
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        onError?.(new Error(`Speech recognition failed: ${event.error}`));
      };

      recognition.onend = () => {
        console.log('🎤 Voice recording ended');
      };

      recognition.start();
      console.log('🎤 Voice recording started');
      
      // Store recognition instance for stopping
      (this as any).currentRecognition = recognition;
    } catch (error) {
      console.error('Failed to start voice recording:', error);
      onError?.(error as Error);
    }
  }

  stopVoiceRecording(): void {
    const recognition = (this as any).currentRecognition;
    if (recognition) {
      recognition.stop();
      (this as any).currentRecognition = null;
      console.log('🎤 Voice recording stopped');
    }
  }


  // Play audio response
  private async playAudioResponse(audioUrl: string): Promise<void> {
    try {
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Failed to play audio response:', error);
    }
  }

  // Platform actions
  private async executePlatformAction(action: PlatformAction): Promise<boolean> {
    try {
      switch (action.type) {
        case 'navigate':
          // Navigate to different views in the app
          window.location.hash = action.target;
          return true;

        case 'execute':
          // Execute specific functions
          const { data, error } = await supabase.functions.invoke(action.target, {
            body: action.parameters
          });
          return !error;

        case 'update':
          // Update data in the database
          const { error: updateError } = await supabase
            .from('projects') // Assuming 'projects' table, adjust as needed
            .update(action.parameters.data)
            .eq('id', action.parameters.id);
          return !updateError;

        case 'create':
          // Create new records
          const { error: createError } = await supabase
            .from('tasks') // Assuming 'tasks' table
            .insert(action.parameters);
          return !createError;

        case 'send':
          // Send communications (email, SMS, etc.)
          const { error: sendError } = await supabase.functions.invoke('send-communication', {
            body: {
              type: action.target,
              ...action.parameters
            }
          });
          return !sendError;

        default:
          console.warn('Unknown action type:', action.type);
          return false;
      }
    } catch (error) {
      console.error('Platform action failed:', error);
      return false;
    }
  }

  // Voice commands
  async processVoiceCommand(audioBlob: Blob): Promise<AIConversationResponse> {
    try {
      const transcript = await this.transcribeAudioBrowser(audioBlob);
      
      if (!transcript) {
        throw new Error('Could not transcribe audio');
      }

      // Process as regular message with voice enabled
      return this.processMessage({
        message: transcript,
        projectId: 'current',
        enableVoice: true,
        isVoiceInput: true
      });
    } catch (error: any) {
      console.error('Voice command processing failed:', error);
      return {
        success: false,
        message: 'Sorry, I could not understand your voice command. Please try again.',
        error: error.message || 'Unknown error'
      };
    }
  }

  // Utility methods
  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getConversationHistory(): AIMessage[] {
    return [...this.conversationHistory];
  }

  clearConversation(): void {
    this.conversationHistory = [];
    this.currentConversationId = this.generateConversationId();
  }

  // Real-time voice transcription
  async enableContinuousListening(
    onTranscript: (transcript: string) => void,
    onCommand?: (command: any) => void
  ): Promise<void> {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      throw new Error('Speech recognition not supported');
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = async (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      const transcript = lastResult[0].transcript;

      if (lastResult.isFinal) {
        onTranscript(transcript);

        // Check if it's a command
        if (this.isCommand(transcript) && onCommand) {
          const command = await this.parseCommand(transcript);
          onCommand(command);
        }
      }
    };

    recognition.start();
  }

  private isCommand(transcript: string): boolean {
    const commandPhrases = [
      'navigate to',
      'show me',
      'open',
      'create',
      'send',
      'schedule',
      'update',
      'find'
    ];
    
    const lower = transcript.toLowerCase();
    return commandPhrases.some(phrase => lower.includes(phrase));
  }

  private async parseCommand(transcript: string): Promise<PlatformAction | null> {
    // Use AI to parse natural language into structured commands
    const response = await this.processMessage({
      message: `Parse this command into a structured action: "${transcript}". Respond with JSON only.`,
      projectId: 'system',
      taskType: 'command_parsing'
    });

    try {
      return JSON.parse(response.message);
    } catch {
      return null;
    }
  }

  async triggerAgent(goal: string, mode: 'assisted' | 'autonomous'): Promise<any> {
    const agent = new AutonomousAgent(this.userId, this.projectId);
    return agent.operate(goal, mode);
  }

  private async transcribeAudioBrowser(audioBlob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const recognition = new (window as any).SpeechRecognition();
      // Mock transcription for now
      resolve('Mock transcribed text');
    });
  }
}