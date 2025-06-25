
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import type { AuditLog } from '@/hooks/useAuditLogs';
import { format } from 'date-fns';
import { getActionColor, formatTableName, generateRecordLink } from '@/utils/auditLogUtils';

interface AuditLogTableProps {
  auditLogs: AuditLog[] | undefined;
  projectId: string;
}

const AuditLogTable: React.FC<AuditLogTableProps> = ({ auditLogs, projectId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Trail</CardTitle>
        <CardDescription>
          Complete history of all actions performed in this project
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Record</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs?.map((log) => {
              const recordLink = generateRecordLink(log.table_name, log.record_id, projectId);
              
              return (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-sm">
                    {format(new Date(log.created_at), 'MMM dd, yyyy HH:mm:ss')}
                  </TableCell>
                  <TableCell>
                    <Badge className={getActionColor(log.action)}>
                      {log.action.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {formatTableName(log.table_name)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.user_id ? log.user_id.substring(0, 8) + '...' : 'System'}
                  </TableCell>
                  <TableCell>
                    {log.record_id ? (
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">
                          {log.record_id.substring(0, 8)}...
                        </span>
                        {recordLink && (
                          <Button variant="ghost" size="sm" asChild>
                            <a href={recordLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {log.ip_address || 'Unknown'}
                  </TableCell>
                </TableRow>
              );
            })}
            {(!auditLogs || auditLogs.length === 0) && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-gray-500">
                  No audit logs found for the selected filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AuditLogTable;
