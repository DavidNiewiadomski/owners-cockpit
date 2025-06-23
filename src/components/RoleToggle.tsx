
import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@/types/roles';
import { 
  Crown, 
  ClipboardList, 
  HardHat, 
  Building, 
  Leaf, 
  Scale, 
  DollarSign, 
  ChevronDown,
  User
} from 'lucide-react';

const roleIcons = {
  Executive: Crown,
  Preconstruction: ClipboardList,
  Construction: HardHat,
  Facilities: Building,
  Sustainability: Leaf,
  Legal: Scale,
  Finance: DollarSign,
};

const roleColors = {
  Executive: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  Preconstruction: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Construction: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  Facilities: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Sustainability: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  Legal: 'bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200',
  Finance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

interface RoleToggleProps {
  variant?: 'compact' | 'expanded';
}

const RoleToggle: React.FC<RoleToggleProps> = ({ variant = 'compact' }) => {
  const { currentRole, switchRole, getRoleConfig } = useRole();
  const currentConfig = getRoleConfig(currentRole);
  const CurrentIcon = roleIcons[currentRole];

  console.log('RoleToggle rendering with currentRole:', currentRole);

  const handleRoleSwitch = (newRole: UserRole) => {
    console.log('RoleToggle: Switching to role:', newRole);
    switchRole(newRole);
  };

  if (variant === 'expanded') {
    return (
      <div className="w-full space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Current Role</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-between h-auto p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${roleColors[currentRole]}`}>
                  <CurrentIcon className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{currentConfig.displayName}</div>
                  <div className="text-sm text-muted-foreground">
                    {currentConfig.description}
                  </div>
                </div>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="start">
            {(Object.keys(roleIcons) as UserRole[]).map((role) => {
              const config = getRoleConfig(role);
              const Icon = roleIcons[role];
              
              return (
                <DropdownMenuItem
                  key={role}
                  onClick={() => handleRoleSwitch(role)}
                  className={`p-3 ${currentRole === role ? 'bg-accent' : ''}`}
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className={`p-2 rounded-lg ${roleColors[role]}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{config.displayName}</div>
                      <div className="text-sm text-muted-foreground">
                        {config.description}
                      </div>
                    </div>
                    {currentRole === role && (
                      <Badge variant="secondary" className="ml-auto">Current</Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <CurrentIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{currentConfig.displayName}</span>
          <Badge className={roleColors[currentRole]} variant="secondary">
            <User className="h-3 w-3 mr-1" />
            Role
          </Badge>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Switch Role</p>
          <p className="text-xs text-muted-foreground">
            Change your view and permissions
          </p>
        </div>
        <DropdownMenuSeparator />
        {(Object.keys(roleIcons) as UserRole[]).map((role) => {
          const config = getRoleConfig(role);
          const Icon = roleIcons[role];
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => handleRoleSwitch(role)}
              className={`gap-2 ${currentRole === role ? 'bg-accent' : ''}`}
            >
              <Icon className="h-4 w-4" />
              <span>{config.displayName}</span>
              {currentRole === role && (
                <Badge variant="secondary" className="ml-auto">Current</Badge>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleToggle;
