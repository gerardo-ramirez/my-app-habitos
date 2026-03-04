'use server';

// Re-exportamos las funciones desde los nuevos archivos
export { 
  getServerSession, 
  getServerUser 
} from '@/lib/supabase/server';

export { 
  signInWithEmailPassword, 
  signUpWithEmailPassword, 
  signOut 
} from '@/lib/supabase/action';