import { useState, useEffect, useCallback } from 'react';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email?: string;
  permissions?: string[];
  lastActive?: string;
  assignedTasks?: Array<{
    id: string;
    title: string;
    status: string;
  }>;
}

interface UseTeamOptions {
  projectId: string;
  onMemberUpdate?: (member: TeamMember) => void;
  onMemberRemove?: (memberId: string) => void;
}

export function useTeam({ projectId, onMemberUpdate, onMemberRemove }: UseTeamOptions) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch team members
  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/projects/${projectId}/team`);
      if (!response.ok) throw new Error('Failed to fetch team members');
      const data = await response.json();
      setMembers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Add member
  const addMember = useCallback(
    async (member: Omit<TeamMember, 'id'>) => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch(`/api/projects/${projectId}/team`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(member),
        });
        if (!response.ok) throw new Error('Failed to add team member');
        const newMember = await response.json();
        setMembers(prev => [...prev, newMember]);
        return newMember;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      }
    },
    [projectId]
  );

  // Update member
  const updateMember = useCallback(
    async (memberId: string, updates: Partial<TeamMember>) => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch(
          `/api/projects/${projectId}/team/${memberId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
          }
        );
        if (!response.ok) throw new Error('Failed to update team member');
        const updatedMember = await response.json();
        setMembers(prev =>
          prev.map(m => (m.id === memberId ? { ...m, ...updatedMember } : m))
        );
        onMemberUpdate?.(updatedMember);
        return updatedMember;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      }
    },
    [projectId, onMemberUpdate]
  );

  // Remove member
  const removeMember = useCallback(
    async (memberId: string) => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch(
          `/api/projects/${projectId}/team/${memberId}`,
          {
            method: 'DELETE',
          }
        );
        if (!response.ok) throw new Error('Failed to remove team member');
        setMembers(prev => prev.filter(m => m.id !== memberId));
        onMemberRemove?.(memberId);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      }
    },
    [projectId, onMemberRemove]
  );

  // Assign task to member
  const assignTask = useCallback(
    async (memberId: string, taskId: string) => {
      try {
        // TODO: Replace with actual API call
        const response = await fetch(
          `/api/projects/${projectId}/team/${memberId}/tasks/${taskId}`,
          {
            method: 'POST',
          }
        );
        if (!response.ok) throw new Error('Failed to assign task');
        const updatedMember = await response.json();
        setMembers(prev =>
          prev.map(m => (m.id === memberId ? { ...m, ...updatedMember } : m))
        );
        return updatedMember;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      }
    },
    [projectId]
  );

  // Get member by ID
  const getMember = useCallback(
    (memberId: string) => members.find(m => m.id === memberId),
    [members]
  );

  // Get members by role
  const getMembersByRole = useCallback(
    (role: string) => members.filter(m => m.role === role),
    [members]
  );

  // Get member stats
  const getTeamStats = useCallback(() => {
    const totalMembers = members.length;
    const roleDistribution = members.reduce(
      (acc, member) => {
        acc[member.role] = (acc[member.role] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    const activeMembers = members.filter(
      m => m.lastActive && Date.now() - new Date(m.lastActive).getTime() < 86400000
    ).length;

    return {
      totalMembers,
      roleDistribution,
      activeMembers,
      avgTasksPerMember:
        members.reduce(
          (acc, m) => acc + (m.assignedTasks?.length || 0),
          0
        ) / totalMembers,
    };
  }, [members]);

  // Initial fetch
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    loading,
    error,
    addMember,
    updateMember,
    removeMember,
    assignTask,
    getMember,
    getMembersByRole,
    getTeamStats,
    refresh: fetchMembers,
  };
}
