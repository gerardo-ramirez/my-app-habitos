import { supabase, getCurrentUserId, handleSupabaseError } from '@/utils/supabase';
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
      const status = filters.isCompleted ? 'completed' : 'pending';
      query = query.eq('status', status);
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
    const newStatus = habit.status === 'completed' ? 'pending' : 'completed';
    const updates: HabitUpdate = {
      status: newStatus,
      // Eliminamos la referencia a last_completed_at según las directrices
    };

    return await updateHabit(habit.id, updates);
  } catch (error) {
    // El error ya se maneja en updateHabit
    return null;
  }
};

/**
 * Marca un hábito como cancelado
 */
export const cancelHabit = async (habit: Habit): Promise<Habit | null> => {
  try {
    const updates: HabitUpdate = {
      status: 'cancelled',
    };

    return await updateHabit(habit.id, updates);
  } catch (error) {
    // El error ya se maneja en updateHabit
    return null;
  }
};

/**
 * Marca todos los hábitos pendientes como incompletos
 * Esta función debe ejecutarse al final del día (medianoche)
 */
export const markPendingHabitsAsIncomplete = async (): Promise<boolean> => {
  try {
    // Obtener el ID del usuario actual
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No se ha encontrado un usuario autenticado');
    }

    // Actualizar todos los hábitos pendientes a incompletos
    const { error } = await supabase
      .from('habits')
      .update({ status: 'incomplete' })
      .eq('user_id', userId)
      .eq('status', 'pending');

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    const supabaseError = handleSupabaseError(error);
    toast({
      title: 'Error al actualizar hábitos pendientes',
      description: supabaseError.message,
      variant: 'destructive',
    });
    return false;
  }
};

/**
 * Obtiene títulos únicos de hábitos para sugerencias en el combobox
 */
export const getDistinctHabitTitles = async (): Promise<string[]> => {
  try {
    // Obtener el ID del usuario actual
    const userId = await getCurrentUserId();
    if (!userId) {
      throw new Error('No se ha encontrado un usuario autenticado');
    }

    // Consulta para obtener títulos distintos
    const { data, error } = await supabase
      .from('habits')
      .select('title')
      .eq('user_id', userId)
      .limit(100);

    if (error) {
      throw error;
    }

    // Extraer títulos únicos
    const titles = [...new Set(data.map(item => item.title))];
    return titles;
  } catch (error) {
    const supabaseError = handleSupabaseError(error);
    toast({
      title: 'Error al obtener títulos de hábitos',
      description: supabaseError.message,
      variant: 'destructive',
    });
    return [];
  }
};

/**
 * Convierte un texto a PascalCase
 */
export const toPascalCase = (text: string): string => {
  // Eliminar espacios al inicio y al final
  const trimmed = text.trim();
  
  // Si está vacío, devolver cadena vacía
  if (!trimmed) return '';
  
  // Convertir a PascalCase
  return trimmed
    // Dividir por espacios, guiones, guiones bajos
    .split(/[\s-_]+/)
    // Capitalizar cada palabra
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    // Unir todo sin espacios
    .join('');
};