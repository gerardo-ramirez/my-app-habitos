import { createBrowserClient } from '@supabase/ssr';
import { type Database } from './database.types';

// Creamos una instancia del cliente de Supabase para el navegador
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
};