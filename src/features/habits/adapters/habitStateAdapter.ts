'use client';

import { Habit } from '../types';

export enum HabitState {
  TODO = 'todo',
  COMPLETED = 'completed',
  WARNING = 'warning',
  RED_ALERT = 'red_alert'
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
  if (habit.is_completed) {
    // Si está completado, verificamos si hay alguna condición de advertencia
    // Por ahora, simplemente retornamos COMPLETED, pero podríamos agregar lógica para WARNING
    return HabitState.COMPLETED;
  }
  
  // Si no está completado, verificamos si estamos en alerta roja
  if (isRedAlertTime()) {
    return HabitState.RED_ALERT;
  }
  
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