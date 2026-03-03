import { redirect } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function HomePage() {
  // Verificar si hay una sesión activa
  const { data: { session } } = await supabase.auth.getSession();
  
  // Si hay una sesión, redirigir a la página de hábitos
  if (session) {
    redirect('/habits');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            App de Hábitos
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Una aplicación para hacer seguimiento de tus hábitos diarios y mejorar tu productividad.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <p className="text-gray-600">
            Inicia sesión o regístrate para comenzar a hacer seguimiento de tus hábitos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth" passHref>
              <Button size="lg" className="w-full sm:w-auto">
                Comenzar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}