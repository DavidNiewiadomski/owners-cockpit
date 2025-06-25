import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface VoiceCommand {
  action: string;
  parameters?: Record<string, string>;
  originalText: string;
}

interface VoiceCommandDefinition {
  pattern: RegExp;
  action: string;
  description: string;
  examples: string[];
  parameters: string[];
}

export const useVoiceCommands = () => {
  const _toast = useToast();

  const processVoiceCommand = useCallback((text: string, availableCommands: VoiceCommandDefinition[]): VoiceCommand | null => {
    for (const command of availableCommands) {
      const match = text.match(command.pattern);
      if (match) {
        const parameters: Record<string, string> = {};
        command.parameters.forEach((param, index) => {
          parameters[param] = match[index + 1]?.trim() || '';
        });

        return {
          action: command.action,
          parameters: parameters,
          originalText: text,
        };
      }
    }
    return null;
  }, []);

  const executeVoiceCommand = useCallback(async (
    command: VoiceCommand,
    onSendMessage?: (message: string) => void,
    toast?: unknown
  ) => {
    try {
      switch (command.action) {
        case 'navigate_dashboard':
          if (command.parameters?.dashboard) {
            window.location.hash = `#/${command.parameters.dashboard}`;
            toast?.({
              title: "Navigation",
              description: `Navigated to ${command.parameters.dashboard} dashboard`,
            });
          }
          break;

        case 'search_projects':
          if (onSendMessage) {
            const query = command.parameters?.query || 'Show me all projects';
            onSendMessage(`Search projects: ${query}`);
          }
          break;

        case 'create_rfi':
          if (onSendMessage) {
            const subject = command.parameters?.subject || 'New RFI';
            onSendMessage(`Create an RFI about: ${subject}`);
          }
          break;

        case 'check_budget':
          if (onSendMessage) {
            const project = command.parameters?.project || 'current project';
            onSendMessage(`Show budget status for ${project}`);
          }
          break;

        case 'schedule_meeting':
          if (onSendMessage) {
            const topic = command.parameters?.topic || 'project review';
            onSendMessage(`Schedule a meeting about ${topic}`);
          }
          break;

        case 'generate_report':
          if (onSendMessage) {
            const type = command.parameters?.type || 'project status';
            onSendMessage(`Generate a ${type} report`);
          }
          break;

        case 'contract_search':
          if (onSendMessage) {
            const query = command.parameters?.query || 'contract status';
            onSendMessage(`Search contracts: ${query}`);
          }
          break;

        case 'draft_contract':
          if (onSendMessage) {
            const type = command.parameters?.type || 'service agreement';
            onSendMessage(`Draft a new ${type} contract`);
          }
          break;

        case 'site_analysis':
          if (onSendMessage) {
            const location = command.parameters?.location || 'selected site';
            onSendMessage(`Analyze site at ${location} for development potential`);
          }
          break;

        case 'zoning_check':
          if (onSendMessage) {
            const address = command.parameters?.address || 'current location';
            onSendMessage(`Check zoning requirements for ${address}`);
          }
          break;

        case 'feasibility_study':
          if (onSendMessage) {
            const projectType = command.parameters?.projectType || 'mixed-use development';
            onSendMessage(`Run feasibility analysis for ${projectType}`);
          }
          break;

        default:
          if (onSendMessage) {
            onSendMessage(command.originalText);
          }
      }
    } catch (error) {
      console.error('Error executing voice command:', error);
      toast?.({
        title: "Command Failed",
        description: "Failed to execute voice command",
        variant: "destructive",
      });
    }
  }, []);

  const getAvailableCommands = useCallback((): VoiceCommandDefinition[] => {
    return [
      {
        pattern: /navigate\s+to\s+(.*)\s+dashboard/i,
        action: 'navigate_dashboard',
        description: 'Navigate to a specific dashboard',
        examples: ['navigate to project dashboard', 'go to finance dashboard'],
        parameters: ['dashboard']
      },
      {
        pattern: /search\s+projects(?:\s+for\s+(.*))?/i,
        action: 'search_projects',
        description: 'Search for projects',
        examples: ['search projects', 'search projects for overdue tasks'],
        parameters: ['query']
      },
      {
        pattern: /create\s+an?\s+RFI(?:\s+about\s+(.*))?/i,
        action: 'create_rfi',
        description: 'Create a new Request for Information (RFI)',
        examples: ['create an RFI', 'create an RFI about budget'],
        parameters: ['subject']
      },
      {
        pattern: /check\s+budget(?:\s+status\s+for\s+(.*))?/i,
        action: 'check_budget',
        description: 'Check the budget status for a project',
        examples: ['check budget', 'check budget status for current project'],
        parameters: ['project']
      },
      {
        pattern: /schedule\s+a\s+meeting(?:\s+about\s+(.*))?/i,
        action: 'schedule_meeting',
        description: 'Schedule a meeting',
        examples: ['schedule a meeting', 'schedule a meeting about project review'],
        parameters: ['topic']
      },
      {
        pattern: /generate\s+(.*)\s+report/i,
        action: 'generate_report',
        description: 'Generate a report',
        examples: ['generate project status report', 'generate budget report'],
        parameters: ['type']
      },
      {
        pattern: /search\s+contracts(?:\s+for\s+(.*))?/i,
        action: 'contract_search',
        description: 'Search for contracts',
        examples: ['search contracts', 'search contracts for expiring soon'],
        parameters: ['query']
      },
      {
        pattern: /draft\s+a\s+new\s+(.*)\s+contract/i,
        action: 'draft_contract',
        description: 'Draft a new contract',
        examples: ['draft a new service agreement contract', 'draft a new NDA contract'],
        parameters: ['type']
      },

      // Preconstruction commands
      {
        pattern: /(?:analyze|check|evaluate)\s+(?:site|location|property)(?:\s+at\s+(.+))?/i,
        action: 'site_analysis',
        description: 'Analyze a site for development potential',
        examples: ['analyze site at 123 Main Street', 'evaluate property for development'],
        parameters: ['location']
      },
      {
        pattern: /(?:check|verify|review)\s+zoning(?:\s+(?:for|at)\s+(.+))?/i,
        action: 'zoning_check',
        description: 'Check zoning requirements and restrictions',
        examples: ['check zoning for downtown lot', 'verify zoning requirements'],
        parameters: ['address']
      },
      {
        pattern: /(?:run|generate|create)\s+feasibility\s+(?:study|analysis)(?:\s+for\s+(.+))?/i,
        action: 'feasibility_study',
        description: 'Run feasibility analysis for a development project',
        examples: ['run feasibility study for residential project', 'generate feasibility analysis'],
        parameters: ['projectType']
      }
    ];
  }, []);

  return {
    processVoiceCommand,
    executeVoiceCommand,
    getAvailableCommands,
  };
};
