
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
import ActionItemsPage from '@/pages/ActionItemsPage';
import SettingsAccessPage from '@/pages/SettingsAccessPage';
import SettingsAuditPage from '@/pages/SettingsAuditPage';
import OAuthCallback from '@/pages/auth/OAuthCallback';
import NotFound from '@/pages/NotFound';
import CrmKanban from '@/components/crm/CrmKanban';
import BidAnalysisDashboard from '@/pages/BidAnalysisDashboard';
import PrequalificationDashboard from '@/pages/PrequalificationDashboard';
import ProcurementDashboard from '@/components/dashboards/ProcurementDashboard';
import { RFPCreationWizard } from '@/components/procurement/RFPCreationWizard';
import { RFPLayout } from '@/components/procurement/RFPLayout';
import { AwardCenter } from '@/components/procurement/AwardCenter';
import { VendorManagement } from '@/components/procurement/VendorManagement';
import PrequalDashboard from '@/components/procurement/PrequalDashboard';
import { RiskAnalysis } from '@/components/procurement/RiskAnalysis';

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
                  <Route path="/action-items" element={<ActionItemsPage />} />
                  <Route path="/settings/access" element={<SettingsAccessPage />} />
                  <Route path="/settings/audit" element={<SettingsAuditPage />} />
                <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
                  <Route path="/procurement" element={<ProcurementDashboard />} />
                  <Route path="/procurement/crm" element={<CrmKanban />} />
                  <Route path="/procurement/rfp/create" element={<RFPCreationWizard />} />
                  <Route path="/procurement/rfp/:id" element={<RFPLayout />} />
                  <Route path="/procurement/awards" element={<AwardCenter />} />
                  <Route path="/procurement/vendors" element={<VendorManagement />} />
                  <Route path="/procurement/prequalification" element={<PrequalDashboard />} />
                  <Route path="/procurement/risk-analysis/:bidId" element={<RiskAnalysis />} />
                  <Route path="/bid-analysis" element={<BidAnalysisDashboard />} />
                  <Route path="/prequalification" element={<PrequalificationDashboard />} />
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
