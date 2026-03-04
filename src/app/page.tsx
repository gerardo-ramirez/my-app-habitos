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
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-zinc-950 to-zinc-950">
      <div className="w-full max-w-md space-y-8 text-center glassmorphism p-8 rounded-xl border border-zinc-800/50">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-50">
            App de Hábitos
          </h1>
          <p className="mt-4 text-lg text-zinc-400">
            Una aplicación para hacer seguimiento de tus hábitos diarios y mejorar tu productividad.
          </p>
        </div>
        
        <div className="mt-8 space-y-4">
          <p className="text-zinc-400">
            Inicia sesión o regístrate para comenzar a hacer seguimiento de tus hábitos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth" passHref>
              <Button size="lg" className="w-full sm:w-auto bg-indigo-500 text-zinc-950 hover:bg-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500">
                Comenzar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}