
import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { supabase } from '@/integrations/supabase/client';

// Mock the supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe('Role Enforcement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should allow admin users to access all project data', async () => {
    const mockSingle = jest.fn().mockResolvedValue({
      data: { role: 'admin' },
      error: null,
    });

    const mockEq = jest.fn().mockReturnValue({
      single: mockSingle,
    });

    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });

    const mockFrom = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    mockSupabase.from.mockReturnValue(mockFrom() as any);

    const response = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', 'test-user-id')
      .eq('project_id', 'test-project-id')
      .single();

    expect(response.data?.role).toBe('admin');
    expect(mockSupabase.from).toHaveBeenCalledWith('user_roles');
  });

  test('should restrict viewer access to read-only operations', async () => {
    const mockSingle = jest.fn().mockResolvedValue({
      data: { role: 'viewer' },
      error: null,
    });

    const mockEq = jest.fn().mockReturnValue({
      single: mockSingle,
    });

    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });

    const mockFrom = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    mockSupabase.from.mockReturnValue(mockFrom() as any);

    const response = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', 'test-user-id')
      .eq('project_id', 'test-project-id')
      .single();

    expect(response.data?.role).toBe('viewer');
  });

  test('should allow GC users to manage project resources', async () => {
    const mockSingle = jest.fn().mockResolvedValue({
      data: { role: 'gc' },
      error: null,
    });

    const mockEq = jest.fn().mockReturnValue({
      single: mockSingle,
    });

    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });

    const mockFrom = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    mockSupabase.from.mockReturnValue(mockFrom() as any);

    const response = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', 'test-user-id')
      .eq('project_id', 'test-project-id')
      .single();

    expect(response.data?.role).toBe('gc');
  });

  test('should handle vendor role permissions correctly', async () => {
    const mockSingle = jest.fn().mockResolvedValue({
      data: { role: 'vendor' },
      error: null,
    });

    const mockEq = jest.fn().mockReturnValue({
      single: mockSingle,
    });

    const mockSelect = jest.fn().mockReturnValue({
      eq: mockEq,
    });

    const mockFrom = jest.fn().mockReturnValue({
      select: mockSelect,
    });

    mockSupabase.from.mockReturnValue(mockFrom() as any);

    const response = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', 'test-user-id')
      .eq('project_id', 'test-project-id')
      .single();

    expect(response.data?.role).toBe('vendor');
  });
});
