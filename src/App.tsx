import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import Layout from '@/components/layout/Layout';
import { FullPageLoader } from '@/components/ui/LoadingSpinner';
import ErrorFallback from '@/components/ErrorFallback';
import { ROUTES } from '@/constants';
import '@/styles/globals.scss';

// Lazy load pages for better performance
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const Products = React.lazy(() => import('@/pages/Products'));
const Categories = React.lazy(() => import('@/pages/Categories'));
const Analytics = React.lazy(() => import('@/pages/Analytics'));
const Settings = React.lazy(() => import('@/pages/Settings'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Layout>
            <Suspense fallback={<FullPageLoader />}>
              <Routes>
                <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
                <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
                <Route path={`${ROUTES.PRODUCTS}/*`} element={<Products />} />
                <Route path={`${ROUTES.CATEGORIES}/*`} element={<Categories />} />
                <Route path={ROUTES.ANALYTICS} element={<Analytics />} />
                <Route path={ROUTES.SETTINGS} element={<Settings />} />
                
                {/* Catch all route */}
                <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;