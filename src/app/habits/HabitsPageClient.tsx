'use client';

import { Suspense } from 'react';
import { HabitList, HabitForm, HabitSkeletonList, HabitFormSkeleton } from '@/features/habits/components';
import { Habit } from '@/features/habits/types';
import { useSessionCheck } from '@/features/auth/hooks/useSessionCheck';

interface HabitsPageClientProps {
  userId: string;
  initialHabits: Habit[];
}

export function HabitsPageClient({ userId, initialHabits }: HabitsPageClientProps) {
  // Verificar la sesión y redirigir a /auth si no hay sesión
  useSessionCheck('/auth', true);
  
  return (
    <div className="bg-zinc-950 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-zinc-950 to-zinc-950 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-zinc-50">Mis Hábitos</h1>
        </div>
        
        <div className="glassmorphism p-6 rounded-xl border border-zinc-800/50">
          <HabitForm />
        </div>
        
        <div className="mb-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-zinc-50">Hábitos actuales</h2>
          <div className="glassmorphism p-6 rounded-xl border border-zinc-800/50">
            <Suspense fallback={<HabitSkeletonList />}>
              <HabitList 
                initialData={initialHabits} 
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}