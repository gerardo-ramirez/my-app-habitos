import { redirect } from 'next/navigation';
import { getServerSession } from '@/utils/supabase/server';
import { AuthForm, SupabaseDiagnostic } from '@/features/auth/components';

export default async function AuthPage() {
  // Verificar si ya hay una sesión activa
  const { data: { session } } = await getServerSession();
  
  // Si ya hay una sesión, redirigir a la página de hábitos
  if (session) {
    redirect('/habits');
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-zinc-950 to-zinc-950">
      <div className="w-full max-w-md space-y-8 glassmorphism p-8 rounded-xl border border-zinc-800/50">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-50">
            App de Hábitos
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Inicia sesión o regístrate para comenzar a hacer seguimiento de tus hábitos
          </p>
        </div>
        
        <AuthForm />
        
        {/* Componente de diagnóstico para ayudar a solucionar problemas de Supabase */}
        <SupabaseDiagnostic />
      </div>
    </div>
  );
}