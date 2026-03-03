import { supabase, getCurrentUserId, handleSupabaseError } from '@/lib/supabase';
import { adaptHabit, adaptHabits } from '../adapters';
import { Habit, HabitCreate, HabitFilters, HabitUpdate } from '../types';
import { toast } from '@/components/ui/use-toast';

export const getHabits = async (filters?: HabitFilters): Promise<Habit[]> => {
  try {
    // Si no se proporciona un userId en los filtros, usar el usuario actual
    let userId = filters?.userId;
    if (!userId) {
      userId = await getCurrentUserId();
      if (!userId) {
        throw new Error('No se ha encontrado un usuario autenticado');
      }
    }

    let query = supabase.from('habits').select('*');

    // Siempre filtrar por el ID del usuario
    query = query.eq('user_id', userId);

    if (filters?.isCompleted !== undefined) {
      query = query.eq('is_completed', filters.isCompleted);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return adaptHabits(data || []);
  } catch (error) {
    const supabaseError = handleSupabaseError(error);
    toast({
      title: 'Error al obtener hábitos',
      description: supabaseError.message,
      variant: 'destructive',
    });
    return [];
  }
};

export const getHabitById = async (id: string): Promise<Habit | null> => {
  try {
    // Obtener el ID del usuario actual
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No se ha encontrado un usuario autenticado');
    }

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId) // Asegurar que el hábito pertenece al usuario
      .single();

    if (error) {
      throw error;
    }

    return adaptHabit(data);
  } catch (error) {
    const supabaseError = handleSupabaseError(error);
    toast({
      title: 'Error al obtener el hábito',
      description: supabaseError.message,
      variant: 'destructive',
    });
    return null;
  }
};

export const createHabit = async (habit: Omit<HabitCreate, 'user_id'>): Promise<Habit | null> => {
  try {
    // Obtener el ID del usuario actual
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No se ha encontrado un usuario autenticado');
    }

    // Añadir el user_id al hábito
    const habitWithUserId: HabitCreate = {
      ...habit,
      user_id: userId,
    };

    const { data, error } = await supabase
      .from('habits')
      .insert(habitWithUserId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return adaptHabit(data);
  } catch (error) {
    const supabaseError = handleSupabaseError(error);
    toast({
      title: 'Error al crear el hábito',
      description: supabaseError.message,
      variant: 'destructive',
    });
    return null;
  }
};

export const updateHabit = async (id: string, updates: HabitUpdate): Promise<Habit | null> => {
  try {
    // Obtener el ID del usuario actual
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No se ha encontrado un usuario autenticado');
    }

    // Verificar que el hábito pertenece al usuario antes de actualizarlo
    const { data, error } = await supabase
      .from('habits')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId) // Asegurar que el hábito pertenece al usuario
      .select()
      .single();

    if (error) {
      throw error;
    }

    return adaptHabit(data);
  } catch (error) {
    const supabaseError = handleSupabaseError(error);
    toast({
      title: 'Error al actualizar el hábito',
      description: supabaseError.message,
      variant: 'destructive',
    });
    return null;
  }
};

export const deleteHabit = async (id: string): Promise<boolean> => {
  try {
    // Obtener el ID del usuario actual
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No se ha encontrado un usuario autenticado');
    }

    // Verificar que el hábito pertenece al usuario antes de eliminarlo
    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', id)
      .eq('user_id', userId); // Asegurar que el hábito pertenece al usuario

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    const supabaseError = handleSupabaseError(error);
    toast({
      title: 'Error al eliminar el hábito',
      description: supabaseError.message,
      variant: 'destructive',
    });
    return false;
  }
};

export const toggleHabitCompletion = async (habit: Habit): Promise<Habit | null> => {
  try {
    const isCompleted = !habit.is_completed;
    const updates: HabitUpdate = {
      is_completed: isCompleted,
      last_completed_at: isCompleted ? new Date().toISOString() : null,
    };

    return await updateHabit(habit.id, updates);
  } catch (error) {
    // El error ya se maneja en updateHabit
    return null;
  }
};