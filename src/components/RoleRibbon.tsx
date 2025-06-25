import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/types/roles';
import { 
  Crown, 
  ClipboardList, 
  HardHat, 
  Building, 
  Leaf, 
  Scale, 
  DollarSign,
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
  Executive: 'bg-purple-500/20 text-purple-300 border-purple-400/50 hover:bg-purple-500/30',
  Preconstruction: 'bg-blue-500/20 text-blue-300 border-blue-400/50 hover:bg-blue-500/30',
  Construction: 'bg-orange-500/20 text-orange-300 border-orange-400/50 hover:bg-orange-500/30',
  Facilities: 'bg-green-500/20 text-green-300 border-green-400/50 hover:bg-green-500/30',
  Sustainability: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 hover:bg-emerald-500/30',
  Legal: 'bg-slate-500/20 text-slate-300 border-slate-400/50 hover:bg-slate-500/30',
  Finance: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/50 hover:bg-yellow-500/30',
};

const activeRoleColors = {
  Executive: 'bg-purple-500/40 text-purple-100 border-purple-300 shadow-purple-500/30',
  Preconstruction: 'bg-blue-500/40 text-blue-100 border-blue-300 shadow-blue-500/30',
  Construction: 'bg-orange-500/40 text-orange-100 border-orange-300 shadow-orange-500/30',
  Facilities: 'bg-green-500/40 text-green-100 border-green-300 shadow-green-500/30',
  Sustainability: 'bg-emerald-500/40 text-emerald-100 border-emerald-300 shadow-emerald-500/30',
  Legal: 'bg-slate-500/40 text-slate-100 border-slate-300 shadow-slate-500/30',
  Finance: 'bg-yellow-500/40 text-yellow-100 border-yellow-300 shadow-yellow-500/30',
};

const RoleRibbon: React.FC = () => {
  const { currentRole, switchRole, getRoleConfig } = useRole();

  const handleRoleSwitch = (newRole: UserRole) => {
    console.log('RoleRibbon: Switching to role:', newRole);
    switchRole(newRole);
  };

  const roles = Object.keys(roleIcons) as UserRole[];

  return (
    <div className="border-b border-border/30 bg-background/95 backdrop-blur-sm">
      <div className="flex items-center justify-center px-6 py-2">
        <div className="flex items-center gap-1 rounded-full bg-muted/30 p-1 backdrop-blur-sm border border-border/20">
          {roles.map((role) => {
            const config = getRoleConfig(role);
            const Icon = roleIcons[role];
            const isActive = currentRole === role;
            
            return (
              <Button
                key={role}
                variant="ghost"
                size="sm"
                onClick={() => handleRoleSwitch(role)}
                className={`
                  relative gap-2 px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105
                  ${isActive 
                    ? `${activeRoleColors[role]} shadow-lg shadow-current/20` 
                    : `${roleColors[role]} hover:shadow-md`
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium hidden sm:inline">
                  {config.displayName}
                </span>
                {isActive && (
                  <Badge 
                    variant="secondary" 
                    className="ml-1 text-xs bg-white/20 text-current border-current/30"
                  >
                    Active
                  </Badge>
                )}
                
                {/* Glow effect for active role */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-current opacity-10 animate-pulse" />
                )}
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* Current role description */}
      <div className="px-6 pb-2">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{getRoleConfig(currentRole).displayName}:</span>{' '}
            {getRoleConfig(currentRole).description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleRibbon;
