
import React from 'react';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';

const RoleContextBanner: React.FC = () => {
  const { getRoleContextualMessage } = useRoleBasedAccess();

  return (
    <div className="bg-muted/50 border-b border-border/40 px-6 py-2">
      <p className="text-sm text-muted-foreground">
        {getRoleContextualMessage}
      </p>
    </div>
  );
};

export default RoleContextBanner;
