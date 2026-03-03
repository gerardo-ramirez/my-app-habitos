import { redirect } from 'next/navigation';
import { getServerSession } from '../actions';
import { AuthForm, SupabaseDiagnostic } from '@/features/auth/components';

export default async function AuthPage() {
  // Verificar si ya hay una sesión activa
  const { data: { session } } = await getServerSession();
  
  // Si ya hay una sesión, redirigir a la página de hábitos
  if (session) {
    redirect('/habits');
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            App de Hábitos
          </h1>
          <p className="mt-2 text-sm text-gray-600">
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