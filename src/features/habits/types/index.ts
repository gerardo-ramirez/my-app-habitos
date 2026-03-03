export interface Habit {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  user_id: string;
  is_completed: boolean;
  last_completed_at: string | null;
}

export interface HabitCreate {
  title: string;
  description?: string | null;
  user_id: string;
}

export interface HabitUpdate {
  title?: string;
  description?: string | null;
  is_completed?: boolean;
  last_completed_at?: string | null;
}

export interface HabitFilters {
  userId?: string;
  isCompleted?: boolean;
}