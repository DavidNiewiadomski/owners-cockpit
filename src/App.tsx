
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from "@/components/ThemeProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from '@/components/ui/toaster';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { RoleProvider } from '@/contexts/RoleContext';
// import { SecurityProvider } from '@/components/security/SecurityProvider';
// import { SecurityProvider } from '@/components/security/MockSecurityProvider';
// import { SecurityProvider } from '@/components/security/LocalSecurityProvider';
import { SecurityProvider } from '@/components/security/NoAuthProvider';
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
import AIDemo from '@/pages/AIDemo';
import SystemStatus from '@/pages/SystemStatus';
import AICommandCenter from '@/pages/AICommandCenter';
import Dashboard from '@/pages/Dashboard';
import ProjectDashboard from '@/pages/ProjectDashboard';

// Construction pages
import CrewManagement from '@/pages/construction/CrewManagement';
import MaterialDelivery from '@/pages/construction/MaterialDelivery';
import SafetyInspection from '@/pages/construction/SafetyInspection';
import ConstructionSchedule from '@/pages/construction/ConstructionSchedule';
import QualityAssurance from '@/pages/construction/QualityAssurance';

// Planning pages
import ProjectBrief from '@/pages/planning/ProjectBrief';
import SiteSelection from '@/pages/planning/SiteSelection';
import BusinessCase from '@/pages/planning/BusinessCase';
import RiskManagementPlanning from '@/pages/planning/RiskManagement';
import PlanningSchedule from '@/pages/planning/PlanningSchedule';

// Finance pages
import InvoicesReview from '@/pages/finance/InvoicesReview';
import CashFlowAnalysis from '@/pages/finance/CashFlowAnalysis';
import InvestmentReturns from '@/pages/finance/InvestmentReturns';

// Other pages
import LegalDashboard from '@/pages/LegalDashboard';
import ActivityHistory from '@/pages/ActivityHistory';
import ProjectAnalytics from '@/pages/ProjectAnalytics';
import PropertyModel3D from '@/pages/PropertyModel3D';
import RiskManagement from '@/pages/RiskManagement';
import Facilities from '@/pages/Facilities';
import Sustainability from '@/pages/Sustainability';
import Planning from '@/pages/Planning';
import Finance from '@/pages/Finance';

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
            <SecurityProvider>
              <RoleProvider>
                <SettingsProvider>
                  <Toaster />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/projects/:projectId" element={<ProjectDashboard />} />
                  <Route path="/projects/:projectId/model" element={<Navigate to="/" replace />} />
                  <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
                  <Route path="/action-items" element={<ActionItemsPage />} />
                  <Route path="/settings/access" element={<SettingsAccessPage />} />
                  <Route path="/settings/audit" element={<SettingsAuditPage />} />
                <Route path="/auth/callback/:provider" element={<OAuthCallback />} />
                  <Route path="/dashboard" element={<Dashboard />} />
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
                  <Route path="/demo/ai" element={<AIDemo />} />
                  <Route path="/demo/bid-analysis" element={<BidAnalysisDashboard />} />
                  <Route path="/system-status" element={<SystemStatus />} />
                  <Route path="/ai-command" element={<AICommandCenter />} />
                  
                  {/* Construction Routes */}
                  <Route path="/construction/crew" element={<CrewManagement />} />
                  <Route path="/construction/materials" element={<MaterialDelivery />} />
                  <Route path="/construction/safety" element={<SafetyInspection />} />
                  <Route path="/construction/schedule" element={<ConstructionSchedule />} />
                  <Route path="/construction/quality" element={<QualityAssurance />} />
                  
                  {/* Planning Routes */}
                  <Route path="/planning/brief" element={<ProjectBrief />} />
                  <Route path="/planning/site-selection" element={<SiteSelection />} />
                  <Route path="/planning/business-case" element={<BusinessCase />} />
                  <Route path="/planning/risk" element={<RiskManagementPlanning />} />
                  <Route path="/planning/schedule" element={<PlanningSchedule />} />
                  
                  {/* Finance Routes */}
                  <Route path="/finance/invoices" element={<InvoicesReview />} />
                  <Route path="/finance/cash-flow" element={<CashFlowAnalysis />} />
                  <Route path="/finance/returns" element={<InvestmentReturns />} />
                  
                  {/* Other Routes */}
                  <Route path="/legal" element={<LegalDashboard />} />
                  <Route path="/activity" element={<ActivityHistory />} />
                  <Route path="/analytics" element={<ProjectAnalytics />} />
                  <Route path="/3d-model" element={<PropertyModel3D />} />
                  <Route path="/risk-management" element={<RiskManagement />} />
                  <Route path="/facilities" element={<Facilities />} />
                  <Route path="/sustainability" element={<Sustainability />} />
                  <Route path="/planning" element={<Planning />} />
                  <Route path="/finance" element={<Finance />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
                </SettingsProvider>
              </RoleProvider>
            </SecurityProvider>
          </ThemeProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </EnhancedErrorBoundary>
  );
}

export default App;
