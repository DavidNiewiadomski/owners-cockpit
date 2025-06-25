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
    <div className="bg-white border-b border-gray-200">
      <div className="flex overflow-x-auto scrollbar-hide">
        {roles.map((role) => {
          const config = getRoleConfig(role);
          const Icon = roleIcons[role];
          const isActive = currentRole === role;
          
          return (
            <button
              key={role}
              onClick={() => handleRoleSwitch(role)}
              className={`
                flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap border-b-2
                ${isActive 
                  ? 'text-blue-600 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span>{config.displayName}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleRibbon;
