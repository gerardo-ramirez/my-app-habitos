import { Habit } from '../types';

export interface DailyStats {
  date: string;
  completed: number;
  incomplete: number;
  cancelled: number;
  total: number;
}

export interface MonthlyStats {
  days: DailyStats[];
  totals: {
    completed: number;
    incomplete: number;
    cancelled: number;
    total: number;
    completionRate: number;
  };
}

/**
 * Convierte una fecha ISO a formato YYYY-MM-DD
 */
export const formatDateToYYYYMMDD = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Genera un array con las fechas de los últimos 30 días
 */
export const getLast30Days = (): string[] => {
  const dates: string[] = [];
  const today = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    dates.push(formatDateToYYYYMMDD(date.toISOString()));
  }
  
  return dates;
};

/**
 * Adapta los hábitos para generar estadísticas de los últimos 30 días
 * Versión para servidor
 */
export const adaptHabitsToMonthlyStatsServer = (habits: Habit[]): MonthlyStats => {
  const last30Days = getLast30Days();
  
  // Agrupar hábitos por fecha de creación
  const habitsByDate: Record<string, Habit[]> = {};
  
  habits.forEach(habit => {
    const dateKey = formatDateToYYYYMMDD(habit.created_at);
    if (!habitsByDate[dateKey]) {
      habitsByDate[dateKey] = [];
    }
    habitsByDate[dateKey].push(habit);
  });
  
  // Generar estadísticas diarias
  const days: DailyStats[] = last30Days.map(date => {
    const dayHabits = habitsByDate[date] || [];
    const completed = dayHabits.filter(h => h.status === 'completed').length;
    const incomplete = dayHabits.filter(h => h.status === 'incomplete').length;
    const cancelled = dayHabits.filter(h => h.status === 'cancelled').length;
    const total = dayHabits.length;
    
    return {
      date,
      completed,
      incomplete,
      cancelled,
      total
    };
  });
  
  // Calcular totales
  const totals = days.reduce(
    (acc, day) => {
      acc.completed += day.completed;
      acc.incomplete += day.incomplete;
      acc.cancelled += day.cancelled;
      acc.total += day.total;
      return acc;
    },
    { completed: 0, incomplete: 0, cancelled: 0, total: 0, completionRate: 0 }
  );
  
  // Calcular tasa de completitud
  totals.completionRate = totals.total > 0 
    ? Math.round((totals.completed / totals.total) * 100) 
    : 0;
  
  return {
    days,
    totals
  };
};