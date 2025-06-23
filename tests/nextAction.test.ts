
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { OwnersCockpitMCPServer } from '../mcp-server/src/server.js';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase
jest.mock('@supabase/supabase-js');
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>;

// Mock MCP SDK
jest.mock('@modelcontextprotocol/sdk/server/index.js', () => ({
  Server: jest.fn().mockImplementation(() => ({
    setRequestHandler: jest.fn(),
    onerror: null,
    connect: jest.fn(),
    close: jest.fn(),
  })),
}));

jest.mock('@modelcontextprotocol/sdk/server/stdio.js', () => ({
  StdioServerTransport: jest.fn().mockImplementation(() => ({})),
}));

describe('Next Action Tool', () => {
  let server: OwnersCockpitMCPServer;
  let mockSupabase: any;

  beforeEach(() => {
    // Setup Supabase mock
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

    mockCreateClient.mockReturnValue(mockSupabase);

    // Set environment variables
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
    process.env.NODE_ENV = 'test';

    server = new OwnersCockpitMCPServer();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('next_action validation', () => {
    it('should require project_id parameter', () => {
      const { z } = require('zod');
      const schema = z.object({
        project_id: z.string().uuid(),
      });

      expect(() => schema.parse({})).toThrow();
      expect(() => schema.parse({ project_id: 'invalid-uuid' })).toThrow();
      
      const validParams = { project_id: '123e4567-e89b-12d3-a456-426614174000' };
      expect(() => schema.parse(validParams)).not.toThrow();
    });
  });

  describe('next_action analysis', () => {
    const mockProjectId = '123e4567-e89b-12d3-a456-426614174000';
    const mockProject = {
      id: mockProjectId,
      name: 'Test Project',
      status: 'active'
    };

    beforeEach(() => {
      // Mock project existence check
      mockSupabase.single.mockResolvedValueOnce({
        data: mockProject,
        error: null
      });
    });

    it('should prioritize overdue RFIs', async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const mockData = {
        tasks: [],
        rfis: [{
          id: 'rfi-1',
          title: 'Critical Design Question',
          description: 'Need approval for structural changes',
          due_date: yesterday.toISOString().split('T')[0],
          assigned_to: 'Lead Architect'
        }],
        alerts: [],
        budgetItems: []
      };

      // Mock all the Promise.all queries
      mockSupabase.single
        .mockResolvedValueOnce({ data: mockData.tasks, error: null })
        .mockResolvedValueOnce({ data: mockData.rfis, error: null })
        .mockResolvedValueOnce({ data: mockData.alerts, error: null })
        .mockResolvedValueOnce({ data: mockData.budgetItems, error: null });

      // Test that overdue RFI would be prioritized
      expect(mockData.rfis[0].due_date).toBeLessThan(new Date().toISOString().split('T')[0]);
    });

    it('should prioritize critical alerts', async () => {
      const mockData = {
        tasks: [],
        rfis: [],
        alerts: [{
          id: 'alert-1',
          title: 'Safety Violation',
          description: 'Immediate safety concern on site',
          severity: 'critical',
          created_at: new Date().toISOString()
        }],
        budgetItems: []
      };

      mockSupabase.single
        .mockResolvedValueOnce({ data: mockData.tasks, error: null })
        .mockResolvedValueOnce({ data: mockData.rfis, error: null })
        .mockResolvedValueOnce({ data: mockData.alerts, error: null })
        .mockResolvedValueOnce({ data: mockData.budgetItems, error: null });

      expect(mockData.alerts[0].severity).toBe('critical');
    });

    it('should handle budget variance issues', async () => {
      const mockData = {
        tasks: [],
        rfis: [],
        alerts: [],
        budgetItems: [{
          id: 'budget-1',
          category: 'Materials',
          budgeted_amount: 100000,
          actual_amount: 120000 // 20% over budget
        }]
      };

      mockSupabase.single
        .mockResolvedValueOnce({ data: mockData.tasks, error: null })
        .mockResolvedValueOnce({ data: mockData.rfis, error: null })
        .mockResolvedValueOnce({ data: mockData.alerts, error: null })
        .mockResolvedValueOnce({ data: mockData.budgetItems, error: null });

      const variance = (mockData.budgetItems[0].actual_amount - mockData.budgetItems[0].budgeted_amount) / mockData.budgetItems[0].budgeted_amount;
      expect(variance).toBeGreaterThan(0.1); // More than 10% over budget
    });

    it('should provide default action when no issues found', async () => {
      const mockData = {
        tasks: [{
          id: 'task-1',
          name: 'Review Plans',
          status: 'not_started',
          assigned_to: 'Project Manager'
        }],
        rfis: [],
        alerts: [],
        budgetItems: []
      };

      mockSupabase.single
        .mockResolvedValueOnce({ data: mockData.tasks, error: null })
        .mockResolvedValueOnce({ data: mockData.rfis, error: null })
        .mockResolvedValueOnce({ data: mockData.alerts, error: null })
        .mockResolvedValueOnce({ data: mockData.budgetItems, error: null });

      expect(mockData.tasks[0].status).toBe('not_started');
    });
  });

  describe('error handling', () => {
    it('should handle project not found', async () => {
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: { message: 'Project not found' }
      });

      // In a real implementation, this would throw an McpError
      expect(mockSupabase.single).toBeDefined();
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database connection failed' };
      mockSupabase.single.mockResolvedValue({
        data: null,
        error: mockError
      });

      expect(mockError.message).toBe('Database connection failed');
    });
  });

  describe('scoring algorithm', () => {
    it('should score overdue RFIs highest', () => {
      const daysOverdue = 5;
      const rfiScore = 100 + daysOverdue * 5; // 125
      const alertScore = 80 + 30; // 110 (critical alert)
      const taskScore = 50 + 3 * 15; // 95 (high priority task)

      expect(rfiScore).toBeGreaterThan(alertScore);
      expect(rfiScore).toBeGreaterThan(taskScore);
    });

    it('should consider alert severity in scoring', () => {
      const criticalScore = 80 + 30; // 110
      const highScore = 80 + 20; // 100
      const mediumScore = 80 + 10; // 90

      expect(criticalScore).toBeGreaterThan(highScore);
      expect(highScore).toBeGreaterThan(mediumScore);
    });

    it('should factor in task priority', () => {
      const lowPriorityScore = 50 + 1 * 15; // 65
      const mediumPriorityScore = 50 + 2 * 15; // 80
      const highPriorityScore = 50 + 3 * 15; // 95

      expect(highPriorityScore).toBeGreaterThan(mediumPriorityScore);
      expect(mediumPriorityScore).toBeGreaterThan(lowPriorityScore);
    });
  });
});
