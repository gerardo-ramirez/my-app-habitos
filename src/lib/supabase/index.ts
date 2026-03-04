// Re-exportamos las funciones de los diferentes clientes
export { createServerSupabaseClient, getServerSession, getServerUser } from './server';
export { createActionSupabaseClient, signInWithEmailPassword, signUpWithEmailPassword, signOut } from './action';

// Re-exportamos el cliente del navegador
export { supabase, getCurrentUser, getCurrentUserId, handleSupabaseError } from '../supabase';