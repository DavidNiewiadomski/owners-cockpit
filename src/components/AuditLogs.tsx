
import React, { useState } from 'react';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import AuditLogFilters from '@/components/AuditLogFilters';
import AuditLogTable from '@/components/AuditLogTable';

interface AuditLogsProps {
  projectId: string;
}

const AuditLogs: React.FC<AuditLogsProps> = ({ projectId }) => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: auditLogs, isLoading, error } = useAuditLogs({
    projectId,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined
  });

  console.log('AuditLogs render:', { projectId, isLoading, error, auditLogs });

  function clearFilters() {
    setDateFrom('');
    setDateTo('');
  }

  if (error) {
    console.error('AuditLogs error:', error);
    return (
      <div className="space-y-6">
        <div className="p-4 text-red-600 bg-red-50 rounded-lg">
          Error loading audit logs: {error.message}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-gray-200 rounded-lg"></div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AuditLogFilters
        dateFrom={dateFrom}
        dateTo={dateTo}
        showFilters={showFilters}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onToggleFilters={() => setShowFilters(!showFilters)}
        onClearFilters={clearFilters}
      />

      <AuditLogTable auditLogs={auditLogs} projectId={projectId} />
    </div>
  );
};

export default AuditLogs;
