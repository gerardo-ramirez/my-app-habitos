'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type Database } from '@/lib/database.types';

// Creamos una instancia del cliente de Supabase para el servidor
export async function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get: async (name) => {
        const cookieStore = await cookies();
        const cookie = await cookieStore.get(name);
        return cookie?.value;
      },
      set: async (name, value, options) => {
        const cookieStore = await cookies();
        await cookieStore.set({ name, value, ...options });
      },
      remove: async (name, options) => {
        const cookieStore = await cookies();
        await cookieStore.delete(name, options);
      },
    },
  });
}

// Función para obtener la sesión actual desde el servidor
export async function getServerSession() {
  const supabase = await createServerSupabaseClient();
  return supabase.auth.getSession();
}

// Función para obtener el usuario actual desde el servidor
export async function getServerUser() {
  const { data: { session } } = await getServerSession();
  return session?.user;
}