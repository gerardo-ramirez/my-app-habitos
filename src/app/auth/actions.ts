'use server';

import { signOut as supabaseSignOut } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function signOut() {
  await supabaseSignOut();
  redirect('/auth'); // Redirigir al usuario a la página de autenticación después de cerrar sesión
}