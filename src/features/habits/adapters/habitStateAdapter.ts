'use client';

import { Habit } from '../types';

export enum HabitState {
  TODO = 'todo',
  COMPLETED = 'completed',
  WARNING = 'warning',
  RED_ALERT = 'red_alert',
  CANCELLED = 'cancelled',
  INCOMPLETE = 'incomplete'
}

export interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  isRedAlert: boolean;
  isWarning: boolean;
}

/**
 * Determina el estado visual de un hábito basado en su estado de completitud y tiempo restante
 */
export const getHabitState = (habit: Habit): HabitState => {
  // Manejar los estados explícitos primero
  if (habit.status === 'completed') {
    return HabitState.COMPLETED;
  }
  
  if (habit.status === 'cancelled') {
    return HabitState.CANCELLED;
  }
  
  if (habit.status === 'incomplete') {
    return HabitState.INCOMPLETE;
  }
  
  // Si está pendiente, verificamos si estamos en alerta roja
  if (habit.status === 'pending' && isRedAlertTime()) {
    return HabitState.RED_ALERT;
  }
  
  // Por defecto, si está pendiente y no es alerta roja
  return HabitState.TODO;
};

/**
 * Determina si estamos en las últimas 4 horas del día (Alerta Roja)
 */
export const isRedAlertTime = (): boolean => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 20; // 8pm o posterior
};

/**
 * Calcula el tiempo restante hasta la medianoche
 * Útil para mostrar un contador en tiempo real
 */
export const getTimeRemainingUntilMidnight = (): TimeRemaining => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  
  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return {
    hours,
    minutes,
    seconds,
    isRedAlert: hours < 4,
    isWarning: hours >= 4 && hours < 8
  };
};