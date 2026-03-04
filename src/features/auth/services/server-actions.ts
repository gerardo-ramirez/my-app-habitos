'use server';

import { signInWithEmailPassword, signUpWithEmailPassword, signOut } from '@/utils/supabase/server';
import { handleSupabaseError } from '@/utils/supabase';
import { LoginCredentials, RegisterCredentials } from '../types';

/**
 * Servicio para iniciar sesión usando acciones del servidor
 */
export async function serverLoginUser({ email, password }: LoginCredentials) {
  try {
    const { data, error } = await signInWithEmailPassword(email, password);
    
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
}

/**
 * Servicio para registrar un nuevo usuario usando acciones del servidor
 */
export async function serverRegisterUser({ email, password }: RegisterCredentials) {
  try {
    const { data, error } = await signUpWithEmailPassword(email, password);
    
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
    return { error: handleSupabaseError(error) };
  }
}

/**
 * Servicio para cerrar sesión usando acciones del servidor
 */
export async function serverLogoutUser() {
  try {
    const { error } = await signOut();
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    return { error: handleSupabaseError(error) };
  }
}