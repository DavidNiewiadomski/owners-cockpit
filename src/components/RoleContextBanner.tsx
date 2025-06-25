
import type React from 'react';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

const RoleContextBanner: React.FC = () => {
  const { getRoleContextualMessage: _getRoleContextualMessage } = useRoleBasedAccess();

  return null;
};

export default RoleContextBanner;
