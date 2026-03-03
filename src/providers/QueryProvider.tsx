// src/providers/QueryProvider.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

export default function QueryProvider({ children }: { children: ReactNode }) {
  // Usamos useState para asegurar que el cliente solo se cree una vez
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minuto de cache (Optimización de Latencia)
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}