import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { 
  getHabits, 
  getHabitById, 
  createHabit, 
  updateHabit, 
  deleteHabit, 
  toggleHabitCompletion 
} from '../services';
import { Habit, HabitCreate, HabitFilters, HabitUpdate } from '../types';

// Exportamos el hook de tiempo restante
export * from './useTimeRemaining';

// Query keys
export const habitKeys = {
  all: ['habits'] as const,
  lists: () => [...habitKeys.all, 'list'] as const,
  list: (filters: HabitFilters) => [...habitKeys.lists(), filters] as const,
  details: () => [...habitKeys.all, 'detail'] as const,
  detail: (id: string) => [...habitKeys.details(), id] as const,
};

// Hooks
export const useHabits = (filters?: HabitFilters) => {
  return useQuery({
    queryKey: habitKeys.list(filters || {}),
    queryFn: () => getHabits(filters),
  });
};

export const useHabit = (id: string) => {
  return useQuery({
    queryKey: habitKeys.detail(id),
    queryFn: () => getHabitById(id),
    enabled: !!id,
  });
};

export const useCreateHabit = () => {
  const queryClient = useQueryClient();
  const { handleDatabaseError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (habit: Omit<HabitCreate, 'user_id'>) => createHabit(habit),
    onMutate: async (newHabit) => {
      // Cancelar consultas en curso
      await queryClient.cancelQueries({ queryKey: habitKeys.lists() });
      
      // Guardar el estado anterior
      const previousHabits = queryClient.getQueryData(habitKeys.list({}));
      
      // Optimisticamente actualizar la UI
      queryClient.setQueryData(habitKeys.list({}), (old: Habit[] = []) => {
        const optimisticHabit: Habit = {
          id: `temp-${Date.now()}`,
          title: newHabit.title,
          description: newHabit.description || null,
          created_at: new Date().toISOString(),
          user_id: 'temp-user-id', // Se actualizará con el real
          is_completed: false,
          last_completed_at: null,
        };
        
        return [optimisticHabit, ...old];
      });
      
      // Devolver el contexto con el estado anterior
      return { previousHabits };
    },
    onError: (error, _variables, context) => {
      // Si hay un error, revertir a los datos anteriores
      if (context?.previousHabits) {
        queryClient.setQueryData(habitKeys.list({}), context.previousHabits);
      }
      
      // Manejar el error de base de datos
      handleDatabaseError(error, 'Error al crear el hábito');
    },
    onSuccess: (createdHabit) => {
      if (createdHabit) {
        // Notificar éxito
        toast({
          title: 'Hábito creado',
          description: 'El hábito se ha creado correctamente',
        });
      }
      
      // Actualizar la caché con los datos reales
      queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
    },
  });
};

export const useUpdateHabit = () => {
  const queryClient = useQueryClient();
  const { handleDatabaseError } = useErrorHandler();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: HabitUpdate }) => 
      updateHabit(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancelar consultas en curso
      await queryClient.cancelQueries({ queryKey: habitKeys.detail(id) });
      await queryClient.cancelQueries({ queryKey: habitKeys.lists() });
      
      // Guardar el estado anterior
      const previousHabit = queryClient.getQueryData(habitKeys.detail(id));
      const previousHabits = queryClient.getQueryData(habitKeys.list({}));
      
      // Optimisticamente actualizar la UI para el detalle
      queryClient.setQueryData(habitKeys.detail(id), (old: Habit | null) => {
        if (!old) return null;
        return { ...old, ...updates };
      });
      
      // Optimisticamente actualizar la UI para la lista
      queryClient.setQueryData(habitKeys.list({}), (old: Habit[] = []) => {
        return old.map(habit => 
          habit.id === id ? { ...habit, ...updates } : habit
        );
      });
      
      // Devolver el contexto con el estado anterior
      return { previousHabit, previousHabits };
    },
    onError: (error, { id }, context) => {
      // Si hay un error, revertir a los datos anteriores
      if (context?.previousHabit) {
        queryClient.setQueryData(habitKeys.detail(id), context.previousHabit);
      }
      
      if (context?.previousHabits) {
        queryClient.setQueryData(habitKeys.list({}), context.previousHabits);
      }
      
      // Manejar el error de base de datos
      handleDatabaseError(error, 'Error al actualizar el hábito');
    },
    onSuccess: (updatedHabit) => {
      if (updatedHabit) {
        // Notificar éxito
        toast({
          title: 'Hábito actualizado',
          description: 'El hábito se ha actualizado correctamente',
        });
        
        // Actualizar la caché con los datos reales
        queryClient.invalidateQueries({ queryKey: habitKeys.detail(updatedHabit.id) });
        queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
      }
    },
  });
};

export const useDeleteHabit = () => {
  const queryClient = useQueryClient();
  const { handleDatabaseError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (id: string) => deleteHabit(id),
    onMutate: async (id) => {
      // Cancelar consultas en curso
      await queryClient.cancelQueries({ queryKey: habitKeys.lists() });
      await queryClient.cancelQueries({ queryKey: habitKeys.detail(id) });
      
      // Guardar el estado anterior
      const previousHabits = queryClient.getQueryData(habitKeys.list({}));
      
      // Optimisticamente actualizar la UI eliminando el hábito
      queryClient.setQueryData(habitKeys.list({}), (old: Habit[] = []) => {
        return old.filter(habit => habit.id !== id);
      });
      
      // Eliminar el detalle del hábito de la caché
      queryClient.removeQueries({ queryKey: habitKeys.detail(id) });
      
      // Devolver el contexto con el estado anterior
      return { previousHabits };
    },
    onError: (error, id, context) => {
      // Si hay un error, revertir a los datos anteriores
      if (context?.previousHabits) {
        queryClient.setQueryData(habitKeys.list({}), context.previousHabits);
      }
      
      // Manejar el error de base de datos
      handleDatabaseError(error, 'Error al eliminar el hábito');
    },
    onSuccess: (success, id) => {
      if (success) {
        // Notificar éxito
        toast({
          title: 'Hábito eliminado',
          description: 'El hábito se ha eliminado correctamente',
        });
      }
      
      // Asegurar que los datos están actualizados
      queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
      queryClient.removeQueries({ queryKey: habitKeys.detail(id) });
    },
  });
};

export const useToggleHabitCompletion = () => {
  const queryClient = useQueryClient();
  const { handleDatabaseError } = useErrorHandler();
  
  return useMutation({
    mutationFn: (habit: Habit) => toggleHabitCompletion(habit),
    onMutate: async (habit) => {
      // Cancelar consultas en curso
      await queryClient.cancelQueries({ queryKey: habitKeys.detail(habit.id) });
      await queryClient.cancelQueries({ queryKey: habitKeys.lists() });
      
      // Guardar el estado anterior
      const previousHabit = queryClient.getQueryData(habitKeys.detail(habit.id));
      const previousHabits = queryClient.getQueryData(habitKeys.list({}));
      
      // Crear el estado optimista
      const isCompleted = !habit.is_completed;
      const optimisticUpdates = {
        is_completed: isCompleted,
        last_completed_at: isCompleted ? new Date().toISOString() : null,
      };
      
      // Optimisticamente actualizar la UI para el detalle
      queryClient.setQueryData(habitKeys.detail(habit.id), (old: Habit | null) => {
        if (!old) return null;
        return { ...old, ...optimisticUpdates };
      });
      
      // Optimisticamente actualizar la UI para la lista
      queryClient.setQueryData(habitKeys.list({}), (old: Habit[] = []) => {
        return old.map(h => 
          h.id === habit.id ? { ...h, ...optimisticUpdates } : h
        );
      });
      
      // Devolver el contexto con el estado anterior
      return { previousHabit, previousHabits };
    },
    onError: (error, habit, context) => {
      // Si hay un error, revertir a los datos anteriores
      if (context?.previousHabit) {
        queryClient.setQueryData(habitKeys.detail(habit.id), context.previousHabit);
      }
      
      if (context?.previousHabits) {
        queryClient.setQueryData(habitKeys.list({}), context.previousHabits);
      }
      
      // Manejar el error de base de datos
      handleDatabaseError(error, 'Error al cambiar el estado del hábito');
    },
    onSuccess: (updatedHabit, habit) => {
      if (updatedHabit) {
        const action = updatedHabit.is_completed ? 'completado' : 'marcado como pendiente';
        
        // Notificar éxito
        toast({
          title: `Hábito ${action}`,
          description: `El hábito se ha ${action} correctamente`,
        });
        
        // Actualizar la caché con los datos reales
        queryClient.invalidateQueries({ queryKey: habitKeys.detail(habit.id) });
        queryClient.invalidateQueries({ queryKey: habitKeys.lists() });
      }
    },
  });
};