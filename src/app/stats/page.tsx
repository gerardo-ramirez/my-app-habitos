'use server';

import { Suspense } from 'react';
import { getHabits } from '@/features/habits/services';
import { adaptHabitsToMonthlyStatsServer } from '@/features/habits/adapters/statsAdapterServer';
import StatsTable from './components/StatsTable';
import StatsSummary from './components/StatsSummary';

export default async function StatsPage() {
  // Obtener todos los hábitos del usuario actual
  const habits = await getHabits();
  
  // Adaptar los hábitos para obtener estadísticas (versión servidor)
  const stats = adaptHabitsToMonthlyStatsServer(habits);
  
  return (
    <div className="space-y-8 pt-4">
      <div>
        <h1 className="text-3xl font-bold text-zinc-50">Estadísticas</h1>
        <p className="text-zinc-400 mt-2">
          Visualiza tu progreso en los últimos 30 días
        </p>
      </div>
      
      <Suspense fallback={<div className="text-zinc-400">Cargando estadísticas...</div>}>
        <StatsSummary stats={stats.totals} />
        <StatsTable stats={stats.days} />
      </Suspense>
    </div>
  );
}