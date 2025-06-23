
import { useCallback } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { useToast } from '@/hooks/use-toast';

interface VoiceCommand {
  pattern: RegExp;
  action: string;
  description: string;
  roleSpecific?: string[];
}

interface ProcessedCommand {
  action: string;
  parameters: Record<string, any>;
  confidence: number;
  needsConfirmation: boolean;
}

export const useVoiceCommands = () => {
  const { currentRole, getRoleConfig } = useRole();
  const { toast } = useToast();

  // Define voice command patterns
  const commands: VoiceCommand[] = [
    {
      pattern: /draft\s+(an?\s+)?email\s+to\s+(.+?)\s+about\s+(.+)/i,
      action: 'draft_email',
      description: 'Draft an email to someone about a topic',
    },
    {
      pattern: /send\s+(an?\s+)?email\s+to\s+(.+?)\s+about\s+(.+)/i,
      action: 'send_email',
      description: 'Send an email to someone about a topic',
    },
    {
      pattern: /what'?s\s+the\s+(.+?)\s+on\s+(.+)/i,
      action: 'get_sensor_reading',
      description: 'Get sensor reading for a location',
      roleSpecific: ['Facilities'],
    },
    {
      pattern: /show\s+me\s+(.+?)\s+(report|summary|dashboard)/i,
      action: 'show_report',
      description: 'Display a specific report or summary',
    },
    {
      pattern: /create\s+(a\s+)?work\s+order\s+for\s+(.+)/i,
      action: 'create_work_order',
      description: 'Create a new work order',
      roleSpecific: ['Facilities'],
    },
    {
      pattern: /schedule\s+(a\s+)?meeting\s+(.+)/i,
      action: 'schedule_meeting',
      description: 'Schedule a meeting',
    },
    {
      pattern: /what'?s\s+the\s+status\s+of\s+(.+)/i,
      action: 'get_status',
      description: 'Get status of a project, task, or system',
    },
    {
      pattern: /summarize\s+(.+)/i,
      action: 'summarize',
      description: 'Provide a summary of something',
    },
    {
      pattern: /open\s+(.+)/i,
      action: 'navigate',
      description: 'Navigate to a specific page or section',
    },
  ];

  const processVoiceCommand = useCallback((transcript: string): ProcessedCommand | null => {
    const normalizedTranscript = transcript.trim().toLowerCase();
    
    if (!normalizedTranscript) {
      return null;
    }

    // Try to match against known command patterns
    for (const command of commands) {
      const match = normalizedTranscript.match(command.pattern);
      
      if (match) {
        // Check if command is role-specific
        if (command.roleSpecific && !command.roleSpecific.includes(currentRole)) {
          continue;
        }

        const parameters: Record<string, any> = {};
        let confidence = 0.8; // Base confidence for pattern match
        let needsConfirmation = false;

        // Extract parameters based on command type
        switch (command.action) {
          case 'draft_email':
          case 'send_email':
            parameters.recipient = match[2]?.trim();
            parameters.subject = match[3]?.trim();
            needsConfirmation = command.action === 'send_email';
            break;
            
          case 'get_sensor_reading':
            parameters.sensorType = match[1]?.trim();
            parameters.location = match[2]?.trim();
            break;
            
          case 'show_report':
            parameters.reportType = match[1]?.trim();
            parameters.format = match[2]?.trim();
            break;
            
          case 'create_work_order':
            parameters.description = match[2]?.trim();
            needsConfirmation = true;
            break;
            
          case 'schedule_meeting':
            parameters.details = match[2]?.trim();
            needsConfirmation = true;
            break;
            
          case 'get_status':
            parameters.item = match[1]?.trim();
            break;
            
          case 'summarize':
            parameters.topic = match[1]?.trim();
            break;
            
          case 'navigate':
            parameters.destination = match[1]?.trim();
            break;
        }

        return {
          action: command.action,
          parameters,
          confidence,
          needsConfirmation,
        };
      }
    }

    // If no specific command pattern matched, treat as general query
    return {
      action: 'general_query',
      parameters: { query: transcript },
      confidence: 0.6,
      needsConfirmation: false,
    };
  }, [currentRole]);

  const executeVoiceCommand = useCallback(async (
    command: ProcessedCommand,
    onSendMessage?: (message: string) => void
  ) => {
    const roleConfig = getRoleConfig(currentRole);
    
    try {
      switch (command.action) {
        case 'draft_email':
          if (onSendMessage) {
            const message = `Draft an email to ${command.parameters.recipient} about ${command.parameters.subject}`;
            onSendMessage(message);
          }
          break;
          
        case 'send_email':
          if (onSendMessage) {
            const message = `Send an email to ${command.parameters.recipient} about ${command.parameters.subject}`;
            onSendMessage(message);
          }
          break;
          
        case 'get_sensor_reading':
          if (onSendMessage) {
            const message = `What's the current ${command.parameters.sensorType} reading for ${command.parameters.location}?`;
            onSendMessage(message);
          }
          break;
          
        case 'show_report':
          if (onSendMessage) {
            const message = `Show me the ${command.parameters.reportType} ${command.parameters.format}`;
            onSendMessage(message);
          }
          break;
          
        case 'create_work_order':
          if (onSendMessage) {
            const message = `Create a work order for ${command.parameters.description}`;
            onSendMessage(message);
          }
          break;
          
        case 'schedule_meeting':
          if (onSendMessage) {
            const message = `Schedule a meeting: ${command.parameters.details}`;
            onSendMessage(message);
          }
          break;
          
        case 'get_status':
          if (onSendMessage) {
            const message = `What's the status of ${command.parameters.item}?`;
            onSendMessage(message);
          }
          break;
          
        case 'summarize':
          if (onSendMessage) {
            const message = `Provide a summary of ${command.parameters.topic}`;
            onSendMessage(message);
          }
          break;
          
        case 'navigate':
          toast({
            title: "Navigation",
            description: `Opening ${command.parameters.destination}...`,
          });
          // TODO: Implement navigation logic
          break;
          
        case 'general_query':
          if (onSendMessage) {
            onSendMessage(command.parameters.query);
          }
          break;
          
        default:
          toast({
            title: "Unknown Command",
            description: "I didn't understand that command. Please try again.",
            variant: "destructive",
          });
      }
    } catch (error) {
      console.error('Voice command execution error:', error);
      toast({
        title: "Command Execution Error",
        description: "Failed to execute the voice command. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentRole, getRoleConfig, toast]);

  const getAvailableCommands = useCallback(() => {
    return commands.filter(cmd => 
      !cmd.roleSpecific || cmd.roleSpecific.includes(currentRole)
    );
  }, [currentRole]);

  return {
    processVoiceCommand,
    executeVoiceCommand,
    getAvailableCommands,
  };
};
