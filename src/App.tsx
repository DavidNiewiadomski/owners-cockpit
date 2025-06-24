import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from '@/components/ui/toaster';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { RoleProvider } from '@/contexts/RoleContext';
import Index from '@/pages/Index';
import LandingPage from '@/pages/LandingPage';
import ExecutiveDashboard from '@/pages/ExecutiveDashboard';
import CommunicationsPage from '@/pages/CommunicationsPage';
import ActionItemsPage from '@/pages/ActionItemsPage';
import SettingsAccessPage from '@/pages/SettingsAccessPage';
import SettingsAuditPage from '@/pages/SettingsAuditPage';
import NotFound from '@/pages/NotFound';
import BIMModelPage from '@/pages/BIMModelPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RoleProvider>
            <SettingsProvider>
              <Toaster />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/landing" element={<LandingPage />} />
                <Route path="/projects/:projectId/model" element={<BIMModelPage />} />
                <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
                <Route path="/communications" element={<CommunicationsPage />} />
                <Route path="/action-items" element={<ActionItemsPage />} />
                <Route path="/settings/access" element={<SettingsAccessPage />} />
                <Route path="/settings/audit" element={<SettingsAuditPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SettingsProvider>
          </RoleProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
