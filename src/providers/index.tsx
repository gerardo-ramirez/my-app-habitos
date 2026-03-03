'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { ToastProvider } from './toast-provider';
import ErrorBoundary from '@/components/ErrorBoundary';
import { DatabaseErrorHandler } from '@/components/DatabaseErrorHandler';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minuto
        retry: 1,
        refetchOnWindowFocus: false,
        // Manejar errores globalmente
        onError: (error: any) => {
          console.error('React Query error:', error);
          // No mostrar toast aquí ya que cada hook maneja sus propios errores
        },
      },
      mutations: {
        // Manejar errores globalmente
        onError: (error: any) => {
          console.error('React Query mutation error:', error);
          // No mostrar toast aquí ya que cada hook maneja sus propios errores
        },
      },
    },
  }));

  return (
    <ErrorBoundary>
      <DatabaseErrorHandler>
        <QueryClientProvider client={queryClient}>
          {children}
          <ToastProvider />
        </QueryClientProvider>
      </DatabaseErrorHandler>
    </ErrorBoundary>
  );
}