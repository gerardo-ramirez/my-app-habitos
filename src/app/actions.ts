'use server';

// Re-exportamos las funciones desde los nuevos archivos
export { 
  getServerSession, 
  getServerUser,
  signInWithEmailPassword, 
  signUpWithEmailPassword, 
  signOut 
} from '@/utils/supabase/server';