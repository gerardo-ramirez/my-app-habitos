import { Habit } from '../types';

// Exportamos el adaptador de estado de hábitos
export * from './habitStateAdapter';

export const adaptHabit = (data: any): Habit => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    created_at: data.created_at,
    user_id: data.user_id,
    is_completed: data.is_completed,
    last_completed_at: data.last_completed_at,
  };
};

export const adaptHabits = (data: any[]): Habit[] => {
  return data.map(adaptHabit);
};