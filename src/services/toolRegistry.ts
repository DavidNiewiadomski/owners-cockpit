import { supabase } from '@/integrations/supabase/client';

export interface Tool {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (params: any) => Promise<any>;
  category: 'data' | 'action' | 'communication' | 'report';
  requiredPermissions?: string[];
}

export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  metadata?: {
    timestamp: string;
    executionTime: number;
    cacheKey?: string;
  };
}

class ToolRegistryService {
  private tools: Map<string, Tool> = new Map();
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.registerDefaultTools();
  }

  private registerDefaultTools(): void {
    // Data Retrieval Tools
    this.registerTool({
      name: 'getConstructionProgress',
      description: 'Get current construction progress and milestone status for a project',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project identifier' },
          includeDetails: { type: 'boolean', description: 'Include detailed milestone data' }
        },
        required: ['projectId']
      },
      execute: this.getConstructionProgress.bind(this),
      category: 'data'
    });

    this.registerTool({
      name: 'getProjectFinancials',
      description: 'Retrieve budget, costs, and financial status for a project',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project identifier' },
          includeForecasts: { type: 'boolean', description: 'Include financial forecasts' }
        },
        required: ['projectId']
      },
      execute: this.getProjectFinancials.bind(this),
      category: 'data'
    });

    this.registerTool({
      name: 'getSafetyMetrics',
      description: 'Get safety incidents, compliance, and training status',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project identifier' },
          timeframe: { type: 'string', enum: ['week', 'month', 'quarter'], description: 'Time period' }
        },
        required: ['projectId']
      },
      execute: this.getSafetyMetrics.bind(this),
      category: 'data'
    });

    this.registerTool({
      name: 'getMaintenanceSchedule',
      description: 'Retrieve maintenance schedules and facility status',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project identifier' },
          urgent: { type: 'boolean', description: 'Show only urgent maintenance items' }
        },
        required: ['projectId']
      },
      execute: this.getMaintenanceSchedule.bind(this),
      category: 'data'
    });

    this.registerTool({
      name: 'getTeamCommunications',
      description: 'Get recent team communications and pending items',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project identifier' },
          priority: { type: 'string', enum: ['all', 'high', 'urgent'], description: 'Filter by priority' }
        },
        required: ['projectId']
      },
      execute: this.getTeamCommunications.bind(this),
      category: 'data'
    });

    this.registerTool({
      name: 'getWeatherConditions',
      description: 'Get current and forecasted weather conditions for construction site',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project identifier' },
          days: { type: 'number', description: 'Number of forecast days' }
        },
        required: ['projectId']
      },
      execute: this.getWeatherConditions.bind(this),
      category: 'data'
    });

    // Action Tools
    this.registerTool({
      name: 'sendTeamNotification',
      description: 'Send notification to team members via Teams or email',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project identifier' },
          message: { type: 'string', description: 'Notification message' },
          recipients: { type: 'array', items: { type: 'string' }, description: 'List of recipient IDs' },
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] }
        },
        required: ['projectId', 'message', 'recipients']
      },
      execute: this.sendTeamNotification.bind(this),
      category: 'action'
    });

    this.registerTool({
      name: 'createMaintenanceRequest',
      description: 'Create a new maintenance request or work order',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project identifier' },
          description: { type: 'string', description: 'Issue description' },
          priority: { type: 'string', enum: ['low', 'medium', 'high', 'emergency'] },
          location: { type: 'string', description: 'Location within building' }
        },
        required: ['projectId', 'description', 'priority']
      },
      execute: this.createMaintenanceRequest.bind(this),
      category: 'action'
    });

    this.registerTool({
      name: 'updateProjectStatus',
      description: 'Update project milestone or phase status',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project identifier' },
          milestone: { type: 'string', description: 'Milestone name' },
          status: { type: 'string', enum: ['not_started', 'in_progress', 'completed', 'delayed'] },
          notes: { type: 'string', description: 'Status update notes' }
        },
        required: ['projectId', 'milestone', 'status']
      },
      execute: this.updateProjectStatus.bind(this),
      category: 'action'
    });

    // Report Generation Tools
    this.registerTool({
      name: 'generateProgressReport',
      description: 'Generate comprehensive project progress report',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project identifier' },
          format: { type: 'string', enum: ['summary', 'detailed', 'executive'] },
          includeFinancials: { type: 'boolean', description: 'Include financial data' }
        },
        required: ['projectId']
      },
      execute: this.generateProgressReport.bind(this),
      category: 'report'
    });

    this.registerTool({
      name: 'generateSafetyReport',
      description: 'Generate safety compliance and incident report',
      parameters: {
        type: 'object',
        properties: {
          projectId: { type: 'string', description: 'Project identifier' },
          period: { type: 'string', enum: ['weekly', 'monthly', 'quarterly'] }
        },
        required: ['projectId', 'period']
      },
      execute: this.generateSafetyReport.bind(this),
      category: 'report'
    });

    console.log(`🔧 Registered ${this.tools.size} tools in registry`);
  }

  registerTool(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  async executeTool(name: string, parameters: any): Promise<ToolResult> {
    const startTime = Date.now();
    
    try {
      const tool = this.tools.get(name);
      if (!tool) {
        return {
          success: false,
          error: `Tool '${name}' not found`,
          metadata: {
            timestamp: new Date().toISOString(),
            executionTime: Date.now() - startTime
          }
        };
      }

      // Check cache for data tools
      if (tool.category === 'data') {
        const cacheKey = `${name}:${JSON.stringify(parameters)}`;
        const cached = this.cache.get(cacheKey);
        if (cached && cached.expiry > Date.now()) {
          return {
            success: true,
            data: cached.data,
            metadata: {
              timestamp: new Date().toISOString(),
              executionTime: Date.now() - startTime,
              cacheKey
            }
          };
        }
      }

      const result = await tool.execute(parameters);
      
      // Cache successful data results
      if (tool.category === 'data' && result) {
        const cacheKey = `${name}:${JSON.stringify(parameters)}`;
        this.cache.set(cacheKey, {
          data: result,
          expiry: Date.now() + this.cacheTimeout
        });
      }

      return {
        success: true,
        data: result,
        metadata: {
          timestamp: new Date().toISOString(),
          executionTime: Date.now() - startTime
        }
      };
    } catch (error) {
      console.error(`❌ Tool execution failed for '${name}':`, error);
      return {
        success: false,
        error: error.message || 'Tool execution failed',
        metadata: {
          timestamp: new Date().toISOString(),
          executionTime: Date.now() - startTime
        }
      };
    }
  }

  getAvailableTools(): Tool[] {
    return Array.from(this.tools.values());
  }

  getToolsByCategory(category: Tool['category']): Tool[] {
    return Array.from(this.tools.values()).filter(tool => tool.category === category);
  }

  // Tool Implementation Methods
  private async getConstructionProgress(params: { projectId: string; includeDetails?: boolean }) {
    try {
      // Simulate real-time construction data
      const mockData = {
        projectId: params.projectId,
        overallProgress: 78.5,
        currentPhase: 'Interior Finishes',
        milestones: [
          {
            name: 'Foundation Complete',
            status: 'completed',
            completionDate: '2024-03-15',
            progress: 100
          },
          {
            name: 'Structural Frame',
            status: 'completed',
            completionDate: '2024-05-20',
            progress: 100
          },
          {
            name: 'Mechanical Rough-in',
            status: 'in_progress',
            progress: 85,
            estimatedCompletion: '2024-12-30'
          },
          {
            name: 'Electrical Installation',
            status: 'in_progress',
            progress: 72,
            estimatedCompletion: '2025-01-15'
          },
          {
            name: 'Interior Finishes',
            status: 'in_progress',
            progress: 45,
            estimatedCompletion: '2025-02-28'
          }
        ],
        criticalPath: [
          'Drywall installation behind schedule by 3 days',
          'HVAC ductwork pending material delivery',
          'Elevator installation awaiting permit approval'
        ],
        weeklyProgress: 4.2,
        timeline: {
          originalCompletion: '2025-03-31',
          currentProjection: '2025-04-15',
          variance: '+15 days'
        }
      };

      return mockData;
    } catch (error) {
      throw new Error(`Failed to retrieve construction progress: ${error.message}`);
    }
  }

  private async getProjectFinancials(params: { projectId: string; includeForecasts?: boolean }) {
    try {
      const mockData = {
        projectId: params.projectId,
        budget: {
          total: 5200000,
          spent: 3875000,
          remaining: 1325000,
          contingency: 260000
        },
        variance: {
          amount: 167000,
          percentage: 3.2,
          reason: 'Material cost increases and change orders'
        },
        cashFlow: {
          monthlyBurn: 425000,
          projectedRunway: '3.1 months',
          nextPayment: {
            amount: 675000,
            dueDate: '2024-12-30'
          }
        },
        costBreakdown: [
          { category: 'Labor', budgeted: 2080000, actual: 2156000, variance: 76000 },
          { category: 'Materials', budgeted: 1872000, actual: 1945000, variance: 73000 },
          { category: 'Equipment', budgeted: 624000, actual: 606000, variance: -18000 },
          { category: 'Subcontractors', budgeted: 416000, actual: 434000, variance: 18000 },
          { category: 'Other', budgeted: 208000, actual: 234000, variance: 26000 }
        ],
        changeOrders: [
          {
            id: 'CO-001',
            description: 'Electrical panel upgrade',
            amount: 23500,
            status: 'approved'
          },
          {
            id: 'CO-002',
            description: 'Additional fire safety equipment',
            amount: 18200,
            status: 'pending'
          }
        ]
      };

      return mockData;
    } catch (error) {
      throw new Error(`Failed to retrieve project financials: ${error.message}`);
    }
  }

  private async getSafetyMetrics(params: { projectId: string; timeframe?: string }) {
    try {
      const mockData = {
        projectId: params.projectId,
        timeframe: params.timeframe || 'month',
        summary: {
          incidentFreedays: 45,
          totalIncidents: 0,
          nearMisses: 3,
          safetyScore: 96.5
        },
        compliance: {
          trainingCompliance: 89,
          ppeCompliance: 94,
          inspectionCompliance: 92,
          certificationStatus: 'current'
        },
        training: {
          completed: 47,
          pending: 8,
          overdue: 2,
          nextDeadline: '2024-12-31'
        },
        inspections: [
          {
            type: 'OSHA Safety',
            date: '2024-12-20',
            result: 'passed',
            findings: 0
          },
          {
            type: 'Fire Safety',
            date: '2024-12-18',
            result: 'passed',
            findings: 2,
            notes: 'Minor signage updates required'
          }
        ],
        incidents: [], // No incidents this period
        recommendations: [
          'Schedule advanced fall protection training',
          'Update emergency evacuation procedures',
          'Review ladder safety protocols'
        ]
      };

      return mockData;
    } catch (error) {
      throw new Error(`Failed to retrieve safety metrics: ${error.message}`);
    }
  }

  private async getMaintenanceSchedule(params: { projectId: string; urgent?: boolean }) {
    try {
      const mockData = {
        projectId: params.projectId,
        filterUrgent: params.urgent || false,
        scheduled: [
          {
            id: 'MNT-001',
            type: 'HVAC Filter Replacement',
            priority: 'medium',
            scheduledDate: '2024-12-28',
            estimatedDuration: '2 hours',
            assignedTo: 'Facilities Team'
          },
          {
            id: 'MNT-002',
            type: 'Elevator Inspection',
            priority: 'high',
            scheduledDate: '2024-12-30',
            estimatedDuration: '4 hours',
            assignedTo: 'Certified Inspector'
          },
          {
            id: 'MNT-003',
            type: 'Fire System Test',
            priority: 'high',
            scheduledDate: '2025-01-05',
            estimatedDuration: '3 hours',
            assignedTo: 'Fire Safety Contractor'
          }
        ],
        urgent: [
          {
            id: 'URG-001',
            issue: 'Main electrical panel warning light',
            reported: '2024-12-25T09:30:00Z',
            priority: 'urgent',
            status: 'in_progress',
            eta: '2024-12-25T16:00:00Z'
          }
        ],
        completed: [
          {
            id: 'MNT-045',
            type: 'Plumbing Inspection',
            completedDate: '2024-12-22',
            result: 'passed',
            nextDue: '2025-06-22'
          }
        ],
        summary: {
          totalScheduled: 12,
          overdue: 1,
          thisWeek: 3,
          nextMonth: 8
        }
      };

      return mockData;
    } catch (error) {
      throw new Error(`Failed to retrieve maintenance schedule: ${error.message}`);
    }
  }

  private async getTeamCommunications(params: { projectId: string; priority?: string }) {
    try {
      const mockData = {
        projectId: params.projectId,
        filter: params.priority || 'all',
        pending: [
          {
            id: 'RFI-123',
            type: 'Request for Information',
            from: 'General Contractor',
            subject: 'Electrical panel specifications clarification',
            priority: 'high',
            dueDate: '2024-12-27',
            daysOverdue: 0
          },
          {
            id: 'CO-456',
            type: 'Change Order',
            from: 'Structural Engineer',
            subject: 'Foundation modification approval needed',
            priority: 'urgent',
            dueDate: '2024-12-26',
            daysOverdue: 1
          }
        ],
        recent: [
          {
            id: 'MSG-789',
            type: 'Team Message',
            from: 'Project Manager',
            subject: 'Weather delay contingency plan',
            timestamp: '2024-12-25T14:30:00Z',
            priority: 'medium'
          },
          {
            id: 'RPT-101',
            type: 'Status Report',
            from: 'Site Supervisor',
            subject: 'Weekly progress update',
            timestamp: '2024-12-25T08:00:00Z',
            priority: 'low'
          }
        ],
        actionItems: [
          {
            id: 'ACT-001',
            description: 'Approve material substitution for windows',
            assignedTo: 'Owner',
            dueDate: '2024-12-28',
            priority: 'high'
          },
          {
            id: 'ACT-002',
            description: 'Review updated project timeline',
            assignedTo: 'Owner',
            dueDate: '2024-12-30',
            priority: 'medium'
          }
        ],
        summary: {
          totalPending: 7,
          highPriority: 3,
          overdue: 1,
          thisWeek: 5
        }
      };

      return mockData;
    } catch (error) {
      throw new Error(`Failed to retrieve team communications: ${error.message}`);
    }
  }

  private async getWeatherConditions(params: { projectId: string; days?: number }) {
    try {
      const mockData = {
        projectId: params.projectId,
        forecastDays: params.days || 7,
        current: {
          temperature: 42,
          conditions: 'Partly Cloudy',
          humidity: 65,
          windSpeed: 8,
          precipitation: 0,
          visibility: 10
        },
        forecast: [
          {
            date: '2024-12-26',
            high: 45,
            low: 32,
            conditions: 'Cloudy',
            precipitation: 20,
            wind: 12,
            workableHours: 8,
            alerts: []
          },
          {
            date: '2024-12-27',
            high: 38,
            low: 28,
            conditions: 'Light Snow',
            precipitation: 70,
            wind: 15,
            workableHours: 4,
            alerts: ['Cold weather precautions recommended']
          },
          {
            date: '2024-12-28',
            high: 35,
            low: 25,
            conditions: 'Snow',
            precipitation: 85,
            wind: 18,
            workableHours: 2,
            alerts: ['Outdoor work not recommended', 'Equipment winterization required']
          }
        ],
        impacts: {
          concreteWork: 'Restricted - temperatures below 40°F',
          exteriorWork: 'Caution advised - wind and precipitation',
          materialDeliveries: 'Monitor road conditions',
          safetyConsiderations: 'Ice and slip hazards likely'
        },
        recommendations: [
          'Schedule interior work for Thursday-Friday',
          'Ensure heating equipment operational',
          'Review winter safety protocols with crew',
          'Protect exposed materials from moisture'
        ]
      };

      return mockData;
    } catch (error) {
      throw new Error(`Failed to retrieve weather conditions: ${error.message}`);
    }
  }

  // Action Tool Implementations
  private async sendTeamNotification(params: { 
    projectId: string; 
    message: string; 
    recipients: string[]; 
    priority?: string 
  }) {
    try {
      // Simulate sending notification
      const notificationId = `NOTIF-${Date.now()}`;
      
      return {
        notificationId,
        status: 'sent',
        recipients: params.recipients,
        timestamp: new Date().toISOString(),
        deliveryMethod: 'teams_and_email',
        estimatedDelivery: '2-5 minutes'
      };
    } catch (error) {
      throw new Error(`Failed to send team notification: ${error.message}`);
    }
  }

  private async createMaintenanceRequest(params: {
    projectId: string;
    description: string;
    priority: string;
    location?: string;
  }) {
    try {
      const requestId = `MNT-REQ-${Date.now()}`;
      
      return {
        requestId,
        status: 'created',
        estimatedResponse: params.priority === 'emergency' ? '1 hour' : '24 hours',
        assignedTo: 'Facilities Team',
        trackingNumber: requestId
      };
    } catch (error) {
      throw new Error(`Failed to create maintenance request: ${error.message}`);
    }
  }

  private async updateProjectStatus(params: {
    projectId: string;
    milestone: string;
    status: string;
    notes?: string;
  }) {
    try {
      return {
        success: true,
        milestone: params.milestone,
        previousStatus: 'in_progress',
        newStatus: params.status,
        updatedBy: 'AI Assistant',
        timestamp: new Date().toISOString(),
        notifications: ['Project team notified', 'Timeline updated']
      };
    } catch (error) {
      throw new Error(`Failed to update project status: ${error.message}`);
    }
  }

  private async generateProgressReport(params: {
    projectId: string;
    format?: string;
    includeFinancials?: boolean;
  }) {
    try {
      const reportId = `RPT-${Date.now()}`;
      
      return {
        reportId,
        format: params.format || 'summary',
        generatedAt: new Date().toISOString(),
        sections: [
          'Executive Summary',
          'Progress Overview',
          'Milestone Status',
          'Schedule Analysis',
          ...(params.includeFinancials ? ['Financial Summary'] : []),
          'Recommendations'
        ],
        downloadUrl: `/reports/${reportId}.pdf`,
        estimatedGeneration: '2-3 minutes'
      };
    } catch (error) {
      throw new Error(`Failed to generate progress report: ${error.message}`);
    }
  }

  private async generateSafetyReport(params: {
    projectId: string;
    period: string;
  }) {
    try {
      const reportId = `SAFETY-RPT-${Date.now()}`;
      
      return {
        reportId,
        period: params.period,
        generatedAt: new Date().toISOString(),
        sections: [
          'Safety Summary',
          'Incident Analysis',
          'Training Status',
          'Compliance Metrics',
          'Recommendations'
        ],
        downloadUrl: `/reports/${reportId}.pdf`,
        estimatedGeneration: '3-5 minutes'
      };
    } catch (error) {
      throw new Error(`Failed to generate safety report: ${error.message}`);
    }
  }

  clearCache(): void {
    this.cache.clear();
    console.log('🗑️ Tool registry cache cleared');
  }
}

export const toolRegistry = new ToolRegistryService();
export default toolRegistry;
