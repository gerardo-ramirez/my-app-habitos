'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type Database } from '@/lib/database.types';
import { shouldBeHttpOnly, authCookieOptions } from './cookie-config';

// Creamos una instancia del cliente de Supabase para el servidor (solo lectura)
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  try {
    const cookieStore = await cookies();
    
    return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            // Si estamos en un Server Component, esto fallará
            // Si estamos en un Server Action, funcionará correctamente
            cookieStore.set({
              name,
              value,
              ...(shouldBeHttpOnly(name) ? authCookieOptions : {}),
              ...options
            });
          } catch (e) {
            // Ignorar el error si estamos en un Server Component
            console.log('Ignorando error de cookies en Server Component:', e);
          }
        },
        remove(name, options) {
          try {
            // Si estamos en un Server Component, esto fallará
            // Si estamos en un Server Action, funcionará correctamente
            cookieStore.delete(name, options);
          } catch (e) {
            // Ignorar el error si estamos en un Server Component
            console.log('Ignorando error de cookies en Server Component:', e);
          }
        },
      },
    });
  } catch (error) {
    console.error('Error al crear el cliente de Supabase:', error);
    
    // Fallback para Server Components que no pueden acceder a cookies()
    return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          // Implementación de fallback para get
          return undefined;
        },
        set(name, value, options) {
          // No hacer nada en Server Components
        },
        remove(name, options) {
          // No hacer nada en Server Components
        },
      },
    });
  }
}

// Función para obtener la sesión actual desde el servidor
export async function getServerSession() {
  try {
    const supabase = await createClient();
    return await supabase.auth.getSession();
  } catch (error) {
    console.error("Error en getServerSession:", error);
    return { data: { session: null } };
  }
}

// Función para obtener el usuario actual desde el servidor
export async function getServerUser() {
  try {
    const { data: { session } } = await getServerSession();
    return session?.user;
  } catch (error) {
    console.error("Error en getServerUser:", error);
    return null;
  }
}

// Función para iniciar sesión desde una acción del servidor
export async function signInWithEmailPassword(email: string, password: string) {
  const supabase = await createClient();
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

// Función para registrar un nuevo usuario desde una acción del servidor
export async function signUpWithEmailPassword(email: string, password: string) {
  const supabase = await createClient();
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
  const supabase = await createClient();
  return supabase.auth.signOut();
}