import { supabase, handleSupabaseError } from '@/lib/supabase';
import { LoginCredentials, RegisterCredentials, AuthError } from '../types';

/**
 * Servicio para registrar un nuevo usuario
 */
export const registerUser = async ({ email, password }: RegisterCredentials) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth`,
        data: {
          name: email.split('@')[0], // Nombre de usuario basado en el email
        }
      }
    });

    if (error) {
      throw error;
    }
    
    // Verificar si el usuario se creó correctamente
    if (!data.user) {
      throw new Error('No se pudo crear el usuario. Por favor, intenta de nuevo más tarde.');
    }
    
    // Verificar si es necesario confirmar el email (no hay sesión activa)
    if (!data.session) {
      // Este no es un error real, sino parte del flujo normal cuando se requiere confirmación de email
      return {
        user: data.user,
        session: null,
        emailConfirmationRequired: true
      };
    }
    
    return {
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    // Usar el helper para formatear el error de manera amigable
    return { error: handleSupabaseError(error) };
  }
};

/**
 * Servicio para iniciar sesión
 */
export const loginUser = async ({ email, password }: LoginCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return {
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    return { error: handleSupabaseError(error) };
  }
};

/**
 * Servicio para cerrar sesión
 */
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    return { error: handleSupabaseError(error) };
  }
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