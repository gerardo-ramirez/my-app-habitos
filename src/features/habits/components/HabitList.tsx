'use client';

import { useHabits } from '../hooks';
import { HabitCard } from './HabitCard';
import { HabitSkeletonList } from './HabitSkeleton';
import { HabitFilters } from '../types';
import { AlertTriangle, Clock } from 'lucide-react';
import { useTimeRemaining } from '../hooks/useTimeRemaining';

interface HabitListProps {
  filters?: Omit<HabitFilters, 'userId'>;
  initialData?: any;
}

export const HabitList = ({ filters, initialData }: HabitListProps) => {
  const { data: habits, isLoading, isError, error } = useHabits(filters);
  const timeRemaining = useTimeRemaining();

  // Formatear el tiempo restante
  const formatTimeRemaining = () => {
    return `${timeRemaining.hours.toString().padStart(2, '0')}:${timeRemaining.minutes.toString().padStart(2, '0')}:${timeRemaining.seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return <HabitSkeletonList />;
  }

  if (isError) {
    return (
      <div className="bg-red-900/50 border border-red-500/30 glassmorphism-dark text-red-400 px-4 py-3 rounded-md mb-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <p>Error al cargar los hábitos: {(error as Error).message}</p>
        </div>
      </div>
    );
  }

  if (!habits?.length) {
    return (
      <div className="bg-zinc-900/50 border border-zinc-700/30 glassmorphism rounded-lg p-8 text-center">
        <h3 className="text-lg font-medium text-zinc-300 mb-2">No hay hábitos</h3>
        <p className="text-zinc-400">Crea tu primer hábito para comenzar a hacer seguimiento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {timeRemaining.isRedAlert && (
        <div className="bg-zinc-900/70 glassmorphism-dark border border-red-600/30 rounded-md p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center text-red-500">
            <Clock className="w-5 h-5 mr-2 animate-pulse" />
            <span>Tiempo restante hoy: {formatTimeRemaining()}</span>
          </div>
          <div className="text-xs text-zinc-400">
            Completa tus hábitos antes de que termine el día
          </div>
        </div>
      )}
      
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
};