
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/ThemeProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from '@/components/ui/toaster';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { RoleProvider } from '@/contexts/RoleContext';
import EnhancedErrorBoundary from '@/components/EnhancedErrorBoundary';
import Index from '@/pages/Index';
import LandingPage from '@/pages/LandingPage';
import ExecutiveDashboard from '@/pages/ExecutiveDashboard';
import CommunicationsPage from '@/pages/CommunicationsPage';
import ActionItemsPage from '@/pages/ActionItemsPage';
import SettingsAccessPage from '@/pages/SettingsAccessPage';
import SettingsAuditPage from '@/pages/SettingsAuditPage';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <EnhancedErrorBoundary
      onError={(error, errorInfo, errorId) => {
        // Enterprise error logging - could integrate with Sentry, DataDog, etc.
        console.error('Application Error:', { error, errorInfo, errorId });
        // In production, send to error tracking service
        if (process.env.NODE_ENV === 'production') {
          // Example: sendToErrorService({ error, errorInfo, errorId });
        }
      }}
    >
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <RoleProvider>
              <SettingsProvider>
                <Toaster />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/projects/:projectId" element={<Navigate to="/" replace />} />
                  <Route path="/projects/:projectId/model" element={<Navigate to="/" replace />} />
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
    </EnhancedErrorBoundary>
  );
}

export default App;
