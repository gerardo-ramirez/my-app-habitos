'use client';

import { toast } from '@/components/ui/use-toast';
import { handleSupabaseError } from '@/lib/supabase';

/**
 * Hook para manejar errores de forma consistente en la aplicación
 */
export const useErrorHandler = () => {
  /**
   * Maneja un error y muestra un toast
   * @param error Error a manejar
   * @param title Título del toast (opcional)
   * @param defaultMessage Mensaje por defecto si no se puede extraer del error
   */
  const handleError = (
    error: any, 
    title = 'Error', 
    defaultMessage = 'Ha ocurrido un error inesperado'
  ) => {
    console.error('Error handled:', error);
    
    let errorMessage = defaultMessage;
    
    // Intentar extraer el mensaje del error
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    // Mostrar el toast
    toast({
      title,
      description: errorMessage,
      variant: 'destructive',
    });
    
    return errorMessage;
  };
  
  /**
   * Maneja un error de Supabase y muestra un toast
   * @param error Error de Supabase
   * @param title Título del toast (opcional)
   */
  const handleDatabaseError = (
    error: any,
    title = 'Error en la base de datos'
  ) => {
    const supabaseError = handleSupabaseError(error);
    
    // Mostrar el toast
    toast({
      title,
      description: supabaseError.message,
      variant: 'destructive',
    });
    
    return supabaseError;
  };
  
  return {
    handleError,
    handleDatabaseError,
  };
};