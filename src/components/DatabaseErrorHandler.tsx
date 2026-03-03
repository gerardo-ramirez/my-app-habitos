'use client';

import { useEffect, useState } from 'react';
import { toast } from '@/components/ui/use-toast';

interface DatabaseErrorHandlerProps {
  children: React.ReactNode;
}

export const DatabaseErrorHandler = ({ children }: DatabaseErrorHandlerProps) => {
  const [isOnline, setIsOnline] = useState(true);

  // Monitorear el estado de la conexión
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: 'Sin conexión',
        description: 'Parece que no tienes conexión a Internet. Algunas funciones pueden no estar disponibles.',
        variant: 'destructive',
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar la conexión inicial
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Manejar errores no capturados
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      
      // Mostrar un toast con el error
      toast({
        title: 'Error en la aplicación',
        description: 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.',
        variant: 'destructive',
      });
      
      // Prevenir que el error rompa la aplicación
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
};