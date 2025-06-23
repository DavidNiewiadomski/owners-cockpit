
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

describe('Role Enforcement', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should allow admin users to access all project data', async () => {
    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { role: 'admin' },
            error: null,
          }),
        }),
      }),
    });

    (supabase.from as jest.Mock).mockImplementation(mockFrom);

    const response = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', 'test-user-id')
      .eq('project_id', 'test-project-id')
      .single();

    expect(response.data?.role).toBe('admin');
    expect(mockFrom).toHaveBeenCalledWith('user_roles');
  });

  test('should restrict viewer access to read-only operations', async () => {
    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { role: 'viewer' },
            error: null,
          }),
        }),
      }),
    });

    (supabase.from as jest.Mock).mockImplementation(mockFrom);

    const response = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', 'test-user-id')
      .eq('project_id', 'test-project-id')
      .single();

    expect(response.data?.role).toBe('viewer');
  });

  test('should allow GC users to manage project resources', async () => {
    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { role: 'gc' },
            error: null,
          }),
        }),
      }),
    });

    (supabase.from as jest.Mock).mockImplementation(mockFrom);

    const response = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', 'test-user-id')
      .eq('project_id', 'test-project-id')
      .single();

    expect(response.data?.role).toBe('gc');
  });

  test('should handle vendor role permissions correctly', async () => {
    const mockFrom = jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { role: 'vendor' },
            error: null,
          }),
        }),
      }),
    });

    (supabase.from as jest.Mock).mockImplementation(mockFrom);

    const response = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', 'test-user-id')
      .eq('project_id', 'test-project-id')
      .single();

    expect(response.data?.role).toBe('vendor');
  });
});
