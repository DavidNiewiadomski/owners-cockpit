
import { useState, useEffect } from 'react';

export interface UseAuthReturn {
  user: { id: string; email?: string } | null;
  session: { user: { id: string; email?: string } } | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState(false);

  // Return mock user data for demo mode with a proper UUID format
  const mockUser = {
    id: '12345678-1234-1234-1234-123456789012',
    email: 'demo@example.com'
  };

  const mockSession = {
    user: mockUser
  };

  useEffect(() => {
    // Set loading to false immediately since we're in demo mode
    setLoading(false);
  }, []);

  const signOut = async () => {
    console.log('Sign out called (demo mode)');
  };

  return {
    user: mockUser,
    session: mockSession,
    loading,
    signOut,
  };
}
