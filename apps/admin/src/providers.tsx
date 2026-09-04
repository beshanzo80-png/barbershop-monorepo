'use client';

import * as React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastProvider, ToastViewport } from '@barbershop/ui';
import { Toaster } from 'react-hot-toast';

export function AdminProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: true,
            retry: 1,
          },
          mutations: { retry: 0 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        {children}
        <ToastViewport />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { background: '#1A1A1A', color: '#FFFFFF', border: '1px solid rgba(212, 168, 67, 0.3)' },
          }}
        />
      </ToastProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}