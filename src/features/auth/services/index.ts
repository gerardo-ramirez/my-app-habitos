import { supabase, handleSupabaseError } from '@/utils/supabase';
import { LoginCredentials, RegisterCredentials, AuthError } from '../types';
import { serverLoginUser, serverRegisterUser, serverLogoutUser } from './server-actions';

/**
 * Servicio para registrar un nuevo usuario
 * Usa la acción del servidor para manejar las cookies correctamente
 */
export const registerUser = async ({ email, password }: RegisterCredentials) => {
  return serverRegisterUser({ email, password });
};

/**
 * Servicio para iniciar sesión
 * Usa la acción del servidor para manejar las cookies correctamente
 */
export const loginUser = async ({ email, password }: LoginCredentials) => {
  return serverLoginUser({ email, password });
};

/**
 * Servicio para cerrar sesión
 * Usa la acción del servidor para manejar las cookies correctamente
 */
export const logoutUser = async () => {
  return serverLogoutUser();
};

/**
 * Servicio para obtener la sesión actual
 */
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    return {
      session: data.session,
    };
  } catch (error) {
    return { error: handleSupabaseError(error) };
  }
};

/**
 * Servicio para obtener el usuario actual
 */
export const getCurrentUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      throw error;
    }

    return {
      user: data.user,
    };
  } catch (error) {
    return { error: handleSupabaseError(error) };
  }
};

/**
 * Servicio para restablecer la contraseña
 */
export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    return { error: handleSupabaseError(error) };
  }
};