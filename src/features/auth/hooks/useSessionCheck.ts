'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useSession, useUser } from '.';

/**
 * Hook para verificar el estado de la sesión y recargarla si es necesario
 * @param redirectTo Ruta a la que redirigir si no hay sesión
 * @param requireAuth Si es true, redirige si no hay sesión
 */
export const useSessionCheck = (redirectTo?: string, requireAuth: boolean = false) => {
  const router = useRouter();
  const { data: sessionData, isLoading: isSessionLoading } = useSession();
  const { data: userData, isLoading: isUserLoading } = useUser();
  
  const isLoading = isSessionLoading || isUserLoading;
  const user = userData?.user;

  useEffect(() => {
    // Verificar si hay una sesión en localStorage
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Si requireAuth es true y no hay sesión, redirigir
      if (requireAuth && !session && !isLoading) {
        if (redirectTo) {
          router.push(redirectTo);
        }
      }
      
      // Configurar listener para cambios en la autenticación
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'SIGNED_IN') {
            // Actualizar la UI si el usuario inicia sesión
            router.refresh();
          } else if (event === 'SIGNED_OUT') {
            // Redirigir si el usuario cierra sesión
            if (requireAuth && redirectTo) {
              router.push(redirectTo);
            }
          }
        }
      );
      
      // Limpiar el listener al desmontar
      return () => {
        subscription.unsubscribe();
      };
    };
    
    checkSession();
  }, [router, redirectTo, requireAuth, isLoading]);

  return { isLoading, user };
};