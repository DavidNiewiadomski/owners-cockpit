import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { testAllConnections } from '@/lib/services/test-connections';

interface HealthWidgetProps {
  compact?: boolean;
}

export const ServiceHealthWidget: React.FC<HealthWidgetProps> = ({ compact = false }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<'healthy' | 'degraded' | 'unhealthy' | 'loading'>('loading');
  const [serviceCount, setServiceCount] = useState({ healthy: 0, total: 0 });
  const [isChecking, setIsChecking] = useState(false);

  // Quick health check
  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const health = await testAllConnections();
      
      const healthy = health.services.filter(s => s.status === 'success').length;
      const total = health.services.length;
      
      setServiceCount({ healthy, total });
      setStatus(health.overall);
    } catch (error) {
      console.error('Health check failed:', error);
      setStatus('unhealthy');
    } finally {
      setIsChecking(false);
    }
  };

  // Initial check
  useEffect(() => {
    checkHealth();
    
    // Check every 60 seconds
    const interval = setInterval(checkHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get status icon
  const getStatusIcon = () => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 animate-pulse" />;
    }
  };

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'healthy':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'degraded':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'unhealthy':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  if (compact) {
    // Compact version for header/navbar
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`gap-2 ${getStatusColor()}`}
          >
            {getStatusIcon()}
            <span className="hidden sm:inline">
              {status === 'loading' ? 'Checking...' : `${serviceCount.healthy}/${serviceCount.total}`}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>System Health</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <div className="px-2 py-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Status</span>
              <Badge variant={
                status === 'healthy' ? 'default' :
                status === 'degraded' ? 'secondary' :
                'destructive'
              }>
                {status}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              {serviceCount.healthy} of {serviceCount.total} services operational
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => navigate('/system-status')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            View Details
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={checkHealth} disabled={isChecking}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Refresh Status
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Full widget version
  return (
    <div className="p-4 border rounded-lg space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">System Health</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={checkHealth}
          disabled={isChecking}
        >
          <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        {getStatusIcon()}
        <div className="flex-1">
          <div className="font-medium capitalize">{status}</div>
          <div className="text-sm text-muted-foreground">
            {serviceCount.healthy} of {serviceCount.total} services operational
          </div>
        </div>
      </div>
      
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => navigate('/system-status')}
      >
        View Details
      </Button>
    </div>
  );
};

export default ServiceHealthWidget;