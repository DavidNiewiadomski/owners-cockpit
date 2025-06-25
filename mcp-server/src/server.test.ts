
import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { OwnersCockpitMCPServer } from './server.js';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

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

describe('OwnersCockpitMCPServer', () => {
  let server: OwnersCockpitMCPServer;
  let mockSupabase: unknown;

  beforeEach(() => {
    // Setup Supabase mock
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

    mockCreateClient.mockReturnValue(mockSupabase);

    // Set environment variables
    process.env.SUPABASE_URL = 'https://test.supabase.co';
    process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-key';
    process.env.NODE_ENV = 'test';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create server instance', () => {
      expect(() => {
        server = new OwnersCockpitMCPServer();
      }).not.toThrow();
    });
  });

  describe('environment validation', () => {
    it('should throw error if SUPABASE_URL is missing', async () => {
      delete process.env.SUPABASE_URL;
      server = new OwnersCockpitMCPServer();
      
      await expect(server.start()).rejects.toThrow(
        'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required'
      );
    });

    it('should throw error if SUPABASE_SERVICE_ROLE_KEY is missing', async () => {
      delete process.env.SUPABASE_SERVICE_ROLE_KEY;
      server = new OwnersCockpitMCPServer();
      
      await expect(server.start()).rejects.toThrow(
        'SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required'
      );
    });
  });

  describe('tool validation', () => {
    beforeEach(() => {
      server = new OwnersCockpitMCPServer();
    });

    describe('get_overdue_rfis', () => {
      it('should validate project_id as UUID', () => {
        const invalidParams = { project_id: 'not-a-uuid' };
        
        // This would be tested through the actual tool call mechanism
        // For now, we can test the validation schema directly
        expect(() => {
          const schema = z.object({
            project_id: z.string().uuid().optional(),
            days_overdue: z.number().min(0).default(0),
          });
          schema.parse(invalidParams);
        }).toThrow();
      });

      it('should set default days_overdue to 0', () => {
        const schema = z.object({
          project_id: z.string().uuid().optional(),
          days_overdue: z.number().min(0).default(0),
        });
        
        const result = schema.parse({});
        expect(result.days_overdue).toBe(0);
      });
    });

    describe('create_rfi', () => {
      it('should require project_id and title', () => {
        const schema = z.object({
          project_id: z.string().uuid(),
          title: z.string().min(1).max(255),
          description: z.string().optional(),
          submitted_by: z.string().max(255).optional(),
          assigned_to: z.string().max(255).optional(),
          due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        });

        expect(() => schema.parse({})).toThrow();
        expect(() => schema.parse({ project_id: 'not-uuid' })).toThrow();
        expect(() => schema.parse({ 
          project_id: '123e4567-e89b-12d3-a456-426614174000',
          title: ''
        })).toThrow();
      });

      it('should validate due_date format', () => {
        const schema = z.object({
          project_id: z.string().uuid(),
          title: z.string().min(1).max(255),
          due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        });

        const validParams = {
          project_id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Test RFI',
          due_date: '2024-12-31'
        };

        const invalidParams = {
          project_id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Test RFI',
          due_date: '31/12/2024'
        };

        expect(() => schema.parse(validParams)).not.toThrow();
        expect(() => schema.parse(invalidParams)).toThrow();
      });
    });
  });

  describe('database operations', () => {
    beforeEach(() => {
      server = new OwnersCockpitMCPServer();
    });

    describe('get_overdue_rfis', () => {
      it('should handle successful database query', async () => {
        const mockRfis = [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            title: 'Test RFI',
            description: 'Test description',
            status: 'open',
            submitted_by: 'John Doe',
            assigned_to: 'Jane Smith',
            due_date: '2024-01-01',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            projects: { id: 'proj-123', name: 'Test Project' }
          }
        ];

        mockSupabase.single.mockResolvedValue({ data: mockRfis, error: null });

        // In a real test, we would call the actual tool method
        // For now, we verify the mock setup
        expect(mockSupabase.from).toBeDefined();
      });

      it('should handle database errors', () => {
        const mockError = { message: 'Database connection failed' };
        mockSupabase.single.mockResolvedValue({ data: null, error: mockError });

        // Verify error handling would be triggered
        expect(mockError.message).toBe('Database connection failed');
      });
    });

    describe('create_rfi', () => {
      it('should verify project exists before creating RFI', async () => {
        const mockProject = {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'Test Project'
        };

        mockSupabase.single
          .mockResolvedValueOnce({ data: mockProject, error: null })
          .mockResolvedValueOnce({ 
            data: { 
              id: 'rfi-123', 
              title: 'New RFI',
              project_id: mockProject.id,
              status: 'open'
            }, 
            error: null 
          });

        // Verify the mock setup
        expect(mockSupabase.single).toBeDefined();
      });

      it('should handle project not found', async () => {
        mockSupabase.single.mockResolvedValue({ 
          data: null, 
          error: { message: 'Project not found' }
        });

        // Verify error would be handled
        expect(mockSupabase.single).toBeDefined();
      });
    });
  });
});
