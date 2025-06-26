
import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from '@/components/ui/toaster';
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';

// Lazy load main components
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Landing = React.lazy(() => import('@/pages/Landing'));

// Simple query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ThemeProvider defaultTheme="system" storageKey="owners-cockpit-theme">
            <TooltipProvider>
              <div className="min-h-screen bg-background text-foreground">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/landing" element={<Landing />} />
                    <Route path="*" element={<Dashboard />} />
                  </Routes>
                </Suspense>
                <Toaster />
              </div>
            </TooltipProvider>
          </ThemeProvider>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
