'use client';

import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { 
  loginUser, 
  registerUser, 
  logoutUser, 
  getSession, 
  getCurrentUser 
} from '../services';
import { LoginCredentials, RegisterCredentials } from '../types';

// Claves para React Query
const authKeys = {
  session: ['auth', 'session'],
  user: ['auth', 'user'],
};

// Hook para obtener la sesión actual
export const useSession = () => {
  return useQuery({
    queryKey: authKeys.session,
    queryFn: getSession,
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Refrescar cada 5 minutos
  });
};

// Hook para obtener el usuario actual
export const useUser = () => {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: getCurrentUser,
    refetchOnWindowFocus: true,
  });
};

// Hook para iniciar sesión
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    onSuccess: (data) => {
      if (data.error) {
        toast({
          title: 'Error al iniciar sesión',
          description: data.error.message,
          variant: 'destructive',
        });
        return;
      }

      queryClient.invalidateQueries({ queryKey: authKeys.session });
      queryClient.invalidateQueries({ queryKey: authKeys.user });
      
      toast({
        title: 'Inicio de sesión exitoso',
        description: 'Has iniciado sesión correctamente',
      });
      
      router.push('/habits');
    },
    onError: (error: any) => {
      toast({
        title: 'Error al iniciar sesión',
        description: error.message || 'Ha ocurrido un error al iniciar sesión',
        variant: 'destructive',
      });
    },
  });
};

// Hook para registrarse
export const useRegister = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => registerUser(credentials),
    onSuccess: (data) => {
      if (data.error) {
        toast({
          title: 'Error al registrarse',
          description: data.error.message,
          variant: 'destructive',
        });
        return;
      }

      queryClient.invalidateQueries({ queryKey: authKeys.session });
      queryClient.invalidateQueries({ queryKey: authKeys.user });
      
      toast({
        title: 'Registro exitoso',
        description: 'Te has registrado correctamente',
      });
      
      router.push('/habits');
    },
    onError: (error: any) => {
      toast({
        title: 'Error al registrarse',
        description: error.message || 'Ha ocurrido un error al registrarse',
        variant: 'destructive',
      });
    },
  });
};

// Hook para cerrar sesión
export const useLogout = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: (data) => {
      if (data.error) {
        toast({
          title: 'Error al cerrar sesión',
          description: data.error.message,
          variant: 'destructive',
        });
        return;
      }

      queryClient.invalidateQueries({ queryKey: authKeys.session });
      queryClient.invalidateQueries({ queryKey: authKeys.user });
      queryClient.clear();
      
      toast({
        title: 'Sesión cerrada',
        description: 'Has cerrado sesión correctamente',
      });
      
      router.push('/');
    },
    onError: (error: any) => {
      toast({
        title: 'Error al cerrar sesión',
        description: error.message || 'Ha ocurrido un error al cerrar sesión',
        variant: 'destructive',
      });
    },
  });
};