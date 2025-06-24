
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Settings, Users, Shield, PlugZap, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useRole } from '@/contexts/RoleContext';
import { useRoleBasedAccess } from '@/hooks/useRoleBasedAccess';
import IntegrationsPage from '@/pages/IntegrationsPage';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation();
  const { currentRole } = useRole();
  const { access } = useRoleBasedAccess();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const settingsItems = [
    {
      id: 'general',
      label: 'General Settings',
      icon: Settings,
      description: 'Application preferences and configuration',
      available: true,
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: PlugZap,
      description: 'Manage external system connections',
      available: true,
    },
    {
      id: 'access',
      label: 'Access Management',
      icon: Users,
      description: 'Manage user roles and permissions',
      available: access.canManageUsers,
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Security settings and audit logs',
      available: access.canViewAuditLogs,
    },
  ];

  const handleItemClick = (itemId: string) => {
    if (itemId === 'integrations') {
      setActiveSection('integrations');
    } else {
      // Handle other settings sections here
      console.log(`Opening ${itemId} settings`);
    }
  };

  const handleCloseSection = () => {
    setActiveSection(null);
  };

  const handleModalClose = () => {
    setActiveSection(null);
    onOpenChange(false);
  };

  // If integrations section is active, show it as a modal overlay
  if (activeSection === 'integrations') {
    return (
      <Dialog open={true} onOpenChange={handleCloseSection}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle>Integrations</DialogTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCloseSection}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="overflow-auto">
            <IntegrationsPage />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t('settings.title', 'Settings')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Current Role:</span>
            <Badge variant="outline">{currentRole}</Badge>
          </div>

          <Separator />

          <div className="grid gap-3">
            {settingsItems.map((item) => {
              if (!item.available) return null;

              const Icon = item.icon;
              
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="flex items-start gap-3 h-auto p-4 text-left justify-start"
                  onClick={() => handleItemClick(item.id)}
                >
                  <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </div>
                  </div>
                </Button>
              );
            })}
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            Settings available based on your current role permissions.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
