import React from 'react';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/types/roles';
import { 
  BarChart3, 
  Palette, 
  ClipboardList, 
  HardHat, 
  Leaf, 
  Shield,
  Scale, 
  DollarSign,
  Building,
} from 'lucide-react';

const categoryIcons = {
  Overview: BarChart3,
  Design: Palette,
  Preconstruction: ClipboardList,
  Construction: HardHat,
  Sustainability: Leaf,
  Safety: Shield,
  Legal: Scale,
  Finance: DollarSign,
  Facilities: Building,
};

// Removed role colors since we're using simple tab styling

const RoleRibbon: React.FC = () => {
  const { currentRole, switchRole, getRoleConfig } = useRole();

  const handleRoleSwitch = (newRole: UserRole) => {
    console.log('RoleRibbon: Switching to role:', newRole);
    switchRole(newRole);
  };

  const categories = Object.keys(categoryIcons) as (keyof typeof categoryIcons)[];

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="flex overflow-x-auto scrollbar-hide">
        {categories.map((category) => {
          const Icon = categoryIcons[category];
          const isActive = currentRole === category; // For now, using role state
          
          return (
            <button
              key={category}
              onClick={() => handleRoleSwitch(category as any)}
              className={`
                flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-all duration-200 whitespace-nowrap border-b-2
                ${isActive 
                  ? 'text-blue-600 border-blue-600 bg-blue-50' 
                  : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                }
              `}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span>{category === 'Legal' ? 'Legal & Insurance' : category}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleRibbon;
