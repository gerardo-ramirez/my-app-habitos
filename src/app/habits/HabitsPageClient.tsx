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
    <div className="bg-zinc-950 text-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-400">Mis Hábitos</h1>
        </div>
        
        <HabitForm />
        
        <div className="mb-6 mt-8">
          <h2 className="text-xl font-semibold mb-4 text-emerald-400">Hábitos actuales</h2>
          <Suspense fallback={<HabitSkeletonList />}>
            <HabitList 
              initialData={initialHabits} 
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}