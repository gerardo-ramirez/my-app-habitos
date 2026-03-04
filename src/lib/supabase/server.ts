import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { type Database } from '../database.types';

// Creamos una instancia del cliente de Supabase para el servidor (solo lectura)
// Este cliente solo implementa el método get() para que Next.js sepa que es una ruta de solo lectura
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name) {
        // En Next.js 16, cookies() es asíncrono, pero aquí necesitamos una función síncrona
        // Por lo tanto, usamos un enfoque alternativo
        try {
          // @ts-ignore - Accedemos a document.cookie directamente si estamos en el cliente
          if (typeof document !== 'undefined') {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) {
              return parts.pop()?.split(';').shift();
            }
          }
          return undefined;
        } catch (e) {
          console.error('Error accessing cookies:', e);
          return undefined;
        }
      },
      // Explícitamente no implementamos set() ni remove() aquí
    },
  });
}

// Función para obtener la sesión actual desde el servidor
export async function getServerSession() {
  try {
    // Creamos un cliente de servidor específicamente para esta función
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const cookieStore = await cookies();
    
    const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    });
    
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