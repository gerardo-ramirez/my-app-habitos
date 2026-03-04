// Re-exportamos SOLO el cliente del navegador para evitar importaciones incorrectas

// Re-exportamos el cliente del navegador
export {
  supabase,
  createClient as createBrowserClient,
  getCurrentUser,
  getCurrentUserId,
  handleSupabaseError
} from './client';