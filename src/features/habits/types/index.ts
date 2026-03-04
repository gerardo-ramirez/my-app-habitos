export interface Habit {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  user_id: string;
  status: 'pending' | 'completed';
}

export interface HabitCreate {
  title: string;
  description?: string | null;
  user_id: string;
}

export interface HabitUpdate {
  title?: string;
  description?: string | null;
  status?: 'pending' | 'completed';
  last_completed_at?: string | null;
}

export interface HabitFilters {
  userId?: string;
  status?: 'pending' | 'completed';
}