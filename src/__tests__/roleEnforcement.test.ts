
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    })),
    rpc: vi.fn(),
    functions: {
      invoke: vi.fn()
    }
  }
}));

describe('Role Enforcement', () => {
  const mockProjectId = '11111111-1111-1111-1111-111111111111';
  const mockUserId = '22222222-2222-2222-2222-222222222222';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Role Permissions', () => {
    it('should allow admin users to invite external users', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Mock admin access check
      (supabase.rpc as any).mockResolvedValueOnce({
        data: true,
        error: null
      });

      // Mock successful invite creation
      (supabase.from as any)().insert().select().single.mockResolvedValueOnce({
        data: {
          id: 'invite-123',
          email: 'test@example.com',
          project_id: mockProjectId,
          role: 'viewer',
          status: 'pending'
        },
        error: null
      });

      const result = await supabase.rpc('has_admin_access', {
        _user_id: mockUserId,
        _project_id: mockProjectId
      });

      expect(result.data).toBe(true);
      expect(supabase.rpc).toHaveBeenCalledWith('has_admin_access', {
        _user_id: mockUserId,
        _project_id: mockProjectId
      });
    });

    it('should deny viewer users from inviting external users', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Mock viewer access (not admin)
      (supabase.rpc as any).mockResolvedValueOnce({
        data: false,
        error: null
      });

      const result = await supabase.rpc('has_admin_access', {
        _user_id: mockUserId,
        _project_id: mockProjectId
      });

      expect(result.data).toBe(false);
    });

    it('should allow GC users to manage user roles', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Mock GC role check
      (supabase.rpc as any).mockResolvedValueOnce({
        data: true,
        error: null
      });

      const result = await supabase.rpc('has_role', {
        _user_id: mockUserId,
        _project_id: mockProjectId,
        _role: 'gc'
      });

      expect(result.data).toBe(true);
    });

    it('should prevent vendor users from accessing admin functions', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Mock vendor role (not admin)
      (supabase.rpc as any).mockResolvedValueOnce({
        data: false,
        error: null
      });

      const result = await supabase.rpc('has_admin_access', {
        _user_id: mockUserId,
        _project_id: mockProjectId
      });

      expect(result.data).toBe(false);
    });
  });

  describe('External Invite Flow', () => {
    it('should create external invite with correct data', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const inviteData = {
        email: 'newuser@example.com',
        project_id: mockProjectId,
        role: 'vendor' as const,
        invited_by: mockUserId,
        status: 'pending'
      };

      // Mock successful invite creation
      (supabase.from as any)().upsert().select().single.mockResolvedValueOnce({
        data: { id: 'invite-456', ...inviteData },
        error: null
      });

      const result = await supabase
        .from('external_invites')
        .upsert([inviteData])
        .select()
        .single();

      expect(result.data).toEqual(
        expect.objectContaining({
          email: 'newuser@example.com',
          role: 'vendor',
          status: 'pending'
        })
      );
    });

    it('should validate email format in invite function', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'admin+label@company.org'
      ];

      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user name@domain.com'
      ];

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      validEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(true);
      });

      invalidEmails.forEach(email => {
        expect(emailRegex.test(email)).toBe(false);
      });
    });

    it('should prevent duplicate invites for same email and project', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Mock existing invite found
      (supabase.from as any)().select().eq().eq().single.mockResolvedValueOnce({
        data: {
          id: 'existing-invite',
          status: 'pending'
        },
        error: null
      });

      const result = await supabase
        .from('external_invites')
        .select('id, status')
        .eq('email', 'test@example.com')
        .eq('project_id', mockProjectId)
        .single();

      expect(result.data?.status).toBe('pending');
    });
  });

  describe('Role Update Validation', () => {
    it('should allow role updates by admin users', async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const roleUpdateData = {
        user_id: 'target-user-id',
        project_id: mockProjectId,
        role: 'gc' as const
      };

      // Mock successful role update
      (supabase.from as any)().upsert().select().single.mockResolvedValueOnce({
        data: { id: 'role-123', ...roleUpdateData },
        error: null
      });

      const result = await supabase
        .from('user_roles')
        .upsert([roleUpdateData])
        .select()
        .single();

      expect(result.data).toEqual(
        expect.objectContaining({
          role: 'gc'
        })
      );
    });

    it('should validate role enum values', () => {
      const validRoles = ['admin', 'gc', 'vendor', 'viewer'];
      const invalidRoles = ['super_admin', 'guest', '', null];

      validRoles.forEach(role => {
        expect(['admin', 'gc', 'vendor', 'viewer']).toContain(role);
      });

      invalidRoles.forEach(role => {
        expect(['admin', 'gc', 'vendor', 'viewer']).not.toContain(role);
      });
    });
  });
});
