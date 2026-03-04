'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type Database } from '../database.types';
import { shouldBeHttpOnly, authCookieOptions } from './cookie-config';

// Creamos una instancia del cliente de Supabase para acciones del servidor (lectura y escritura)
export async function createActionSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: async (name) => {
        const cookieStore = await cookies();
        const cookie = cookieStore.get(name);
        return cookie?.value;
      },
      set: async (name, value, options) => {
        const cookieStore = await cookies();
        
        // Aplicar opciones de seguridad para cookies de autenticación
        if (shouldBeHttpOnly(name)) {
          cookieStore.set({
            name,
            value,
            ...authCookieOptions,
            ...options
          });
        } else {
          cookieStore.set({ name, value, ...options });
        }
      },
      remove: async (name, options) => {
        const cookieStore = await cookies();
        cookieStore.delete(name, options);
      },
    },
  });
}

// Función para iniciar sesión desde una acción del servidor
export async function signInWithEmailPassword(email: string, password: string) {
  const supabase = await createActionSupabaseClient();
  
  // La configuración de cookies seguras se maneja en el método set() del cliente
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

// Función para registrar un nuevo usuario desde una acción del servidor
export async function signUpWithEmailPassword(email: string, password: string) {
  const supabase = await createActionSupabaseClient();
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/auth`,
      data: {
        name: email.split('@')[0], // Nombre de usuario basado en el email
      }
    }
  });
}

// Función para cerrar sesión desde una acción del servidor
export async function signOut() {
  const supabase = await createActionSupabaseClient();
  return supabase.auth.signOut();
}