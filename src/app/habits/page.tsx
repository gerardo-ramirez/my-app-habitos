import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getHabits } from '@/features/habits/services';
import { HabitList, HabitForm } from '@/features/habits/components';
import { getServerSession } from '@/utils/supabase/server';
import { HabitsPageClient } from './HabitsPageClient';

export default async function HabitsPage() {
  // Verificar si hay una sesión activa en el servidor
  const { data: { session } } = await getServerSession();
  
  // Si no hay sesión, redirigir a la página de inicio de sesión
  if (!session) {
    redirect('/auth');
  }

  const userId = session.user.id;
  
  try {
    // Pre-fetch de datos en el servidor usando el ID real del usuario
    const initialHabits = await getHabits({ userId });

    return (
      <div className="max-w-3xl mx-auto py-8 px-4 text-zinc-50">
        <HabitsPageClient 
          userId={userId} 
          initialHabits={initialHabits} 
        />
      </div>
    );
  } catch (error) {
    console.error('Error al obtener hábitos:', error);
    
    // Incluso si hay un error, mostrar la página con el userId correcto
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 text-zinc-50">
        <HabitsPageClient 
          userId={userId} 
          initialHabits={[]} 
        />
      </div>
    );
  }
}