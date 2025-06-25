
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  PlugZap, 
  HelpCircle, 
  Settings as SettingsIcon,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Import settings page components
import GeneralSettings from '@/components/settings/GeneralSettings';
import AccountSettings from '@/components/settings/AccountSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import SecuritySettings from '@/components/settings/SecuritySettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import IntegrationSettings from '@/components/settings/IntegrationSettings';
import SupportSettings from '@/components/settings/SupportSettings';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SettingsSection = 
  | 'general' 
  | 'account' 
  | 'notifications' 
  | 'security' 
  | 'appearance' 
  | 'integrations' 
  | 'support';

const settingsMenuItems = [
  {
    id: 'general' as SettingsSection,
    label: 'General',
    icon: SettingsIcon,
    description: 'Language, timezone, and basic preferences'
  },
  {
    id: 'account' as SettingsSection,
    label: 'Account',
    icon: User,
    description: 'Profile information and account details'
  },
  {
    id: 'notifications' as SettingsSection,
    label: 'Notifications',
    icon: Bell,
    description: 'Email and push notification preferences'
  },
  {
    id: 'security' as SettingsSection,
    label: 'Security & Privacy',
    icon: Shield,
    description: 'Password, two-factor auth, and privacy settings'
  },
  {
    id: 'appearance' as SettingsSection,
    label: 'Appearance',
    icon: Palette,
    description: 'Theme, layout, and display preferences'
  },
  {
    id: 'integrations' as SettingsSection,
    label: 'Integrations',
    icon: PlugZap,
    description: 'Connect external services and apps'
  },
  {
    id: 'support' as SettingsSection,
    label: 'Support & Help',
    icon: HelpCircle,
    description: 'Documentation, contact support, and feedback'
  }
];

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');

  const renderSettingsContent = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettings />;
      case 'account':
        return <AccountSettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'security':
        return <SecuritySettings />;
      case 'appearance':
        return <AppearanceSettings />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'support':
        return <SupportSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  const activeItem = settingsMenuItems.find(item => item.id === activeSection);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <div className="flex h-[600px]">
          {/* Settings Navigation Sidebar */}
          <div className="w-64 border-r bg-muted/20 p-4">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-lg font-semibold">Settings</DialogTitle>
            </DialogHeader>
            
            <nav className="space-y-1">
              {settingsMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-left rounded-md transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      activeSection === item.id 
                        ? "bg-primary text-primary-foreground" 
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{item.label}</div>
                      <div className="text-xs opacity-75 truncate">{item.description}</div>
                    </div>
                    <ChevronRight className="h-3 w-3" />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Settings Content Area */}
          <div className="flex-1 flex flex-col">
            <div className="border-b p-4">
              <h2 className="text-xl font-semibold">{activeItem?.label}</h2>
              <p className="text-sm text-muted-foreground mt-1">{activeItem?.description}</p>
            </div>
            
            <div className="flex-1 overflow-auto p-6">
              {renderSettingsContent()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
