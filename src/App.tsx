import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SettingsProvider } from "@/contexts/SettingsContext";
import EnhancedErrorBoundary from "@/components/EnhancedErrorBoundary";
import { RoleProvider } from "@/contexts/RoleContext";
import "@/lib/i18n";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import SettingsAccessPage from "./pages/SettingsAccessPage";
import SettingsAuditPage from "./pages/SettingsAuditPage";
import IntegrationsPage from "./pages/IntegrationsPage";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Global error handler for the app
const handleGlobalError = (error: Error, errorInfo: React.ErrorInfo, errorId: string) => {
  console.error('Global error caught:', { error, errorInfo, errorId });
  
  // Optional: Send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: errorTrackingService.captureException(error, { errorId, errorInfo });
  }
};

function App() {
  console.log('App rendering, current path:', window.location.pathname);
  
  return (
    <EnhancedErrorBoundary onError={handleGlobalError}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
          <SettingsProvider>
            <RoleProvider>
              <TooltipProvider>
                <Toaster />
                <BrowserRouter>
                  <EnhancedErrorBoundary>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/dashboard" element={<Index />} />
                      <Route path="/projects" element={<Index />} />
                      <Route path="/executive-dashboard" element={<ExecutiveDashboard />} />
                      <Route path="/projects/:projectId/integrations" element={<IntegrationsPage />} />
                      <Route path="/settings/access/:projectId" element={<SettingsAccessPage />} />
                      <Route path="/settings/audit/:projectId" element={<SettingsAuditPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </EnhancedErrorBoundary>
                </BrowserRouter>
              </TooltipProvider>
            </RoleProvider>
          </SettingsProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </EnhancedErrorBoundary>
  );
}

export default App;
