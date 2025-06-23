
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar, Filter } from 'lucide-react';

interface AuditLogFiltersProps {
  dateFrom: string;
  dateTo: string;
  showFilters: boolean;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onToggleFilters: () => void;
  onClearFilters: () => void;
}

const AuditLogFilters: React.FC<AuditLogFiltersProps> = ({
  dateFrom,
  dateTo,
  showFilters,
  onDateFromChange,
  onDateToChange,
  onToggleFilters,
  onClearFilters
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Audit Log Filters
            </CardTitle>
            <CardDescription>
              Filter audit logs by date range
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={onToggleFilters}
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
      </CardHeader>
      {showFilters && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date-from">From Date</Label>
              <Input
                id="date-from"
                type="date"
                value={dateFrom}
                onChange={(e) => onDateFromChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-to">To Date</Label>
              <Input
                id="date-to"
                type="date"
                value={dateTo}
                onChange={(e) => onDateToChange(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={onClearFilters} className="w-full">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AuditLogFilters;
