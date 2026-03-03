'use client';

import { useState, useEffect } from 'react';
import { Habit } from '../types';
import { useToggleHabitCompletion, useDeleteHabit } from '../hooks';
import { useTimeRemaining } from '../hooks/useTimeRemaining';
import { getHabitState, HabitState } from '../adapters/habitStateAdapter';
import { CheckCircle, Clock, ChevronDown, ChevronUp, Trash2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  habit: Habit;
}

export const HabitCard = ({ habit }: HabitCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [habitState, setHabitState] = useState<HabitState>(getHabitState(habit));
  const toggleCompletion = useToggleHabitCompletion();
  const deleteHabit = useDeleteHabit();
  const timeRemaining = useTimeRemaining();

  // Actualizar el estado del hábito cuando cambie el tiempo o el estado de completitud
  useEffect(() => {
    setHabitState(getHabitState(habit));
  }, [habit, timeRemaining.isRedAlert]);

  const handleToggle = () => {
    toggleCompletion.mutate(habit);
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que quieres eliminar este hábito?')) {
      deleteHabit.mutate(habit.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleToggle();
    }
  };

  // Clases para la tarjeta según el estado
  const cardClasses = cn(
    "p-4 rounded-lg shadow-md mb-4 transition-all duration-300 state-transition glassmorphism",
    {
      // Estado completado: verde celeste
      "bg-zinc-900/50 border border-cyan-400/30 text-opacity-60": habitState === HabitState.COMPLETED,
      
      // Estado alerta roja: borde rojo pulsante
      "bg-zinc-900/50 border-2 border-red-600 border-pulse": habitState === HabitState.RED_ALERT,
      
      // Estado advertencia: amarillo
      "bg-zinc-900/50 border border-yellow-400/30": habitState === HabitState.WARNING,
      
      // Estado por hacer: borde verde esmeralda
      "bg-zinc-900/50 border border-emerald-500/30 hover-emerald-glow": habitState === HabitState.TODO,
    }
  );

  // Clases para el checkbox según el estado
  const checkboxClasses = cn(
    "w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer",
    {
      "bg-cyan-400 border-cyan-400 text-zinc-900": habitState === HabitState.COMPLETED,
      "border-red-600 pulse-red": habitState === HabitState.RED_ALERT,
      "border-yellow-400": habitState === HabitState.WARNING,
      "border-emerald-500": habitState === HabitState.TODO,
    }
  );

  // Clases para el título según el estado
  const titleClasses = cn(
    "text-lg font-medium",
    {
      "line-through opacity-60 text-cyan-400": habitState === HabitState.COMPLETED,
      "text-white": habitState !== HabitState.COMPLETED,
    }
  );

  // Formatear el tiempo restante
  const formatTimeRemaining = () => {
    return `${timeRemaining.hours.toString().padStart(2, '0')}:${timeRemaining.minutes.toString().padStart(2, '0')}:${timeRemaining.seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cardClasses}>
      <div className="flex items-center">
        <div 
          className={checkboxClasses}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="checkbox"
          aria-checked={habit.is_completed}
          aria-label={`Marcar ${habit.title} como ${habit.is_completed ? 'incompleto' : 'completo'}`}
        >
          {habit.is_completed && <CheckCircle className="w-4 h-4" />}
        </div>
        <div className="ml-3 flex-grow">
          <h3 className={titleClasses}>
            {habit.title}
          </h3>
          {habitState === HabitState.RED_ALERT && (
            <div className="flex items-center text-xs text-red-500 font-bold mt-1 animate-pulse">
              <AlertTriangle className="w-3 h-3 mr-1" />
              <span>¡Alerta Roja! Tiempo restante: {formatTimeRemaining()}</span>
            </div>
          )}
          {habit.last_completed_at && (
            <p className="text-xs text-zinc-400 mt-1">
              Última vez completado: {new Date(habit.last_completed_at).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-zinc-400 hover:text-white p-1 transition-colors"
            aria-label={isExpanded ? 'Contraer detalles' : 'Expandir detalles'}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          <button 
            onClick={handleDelete}
            className="text-zinc-400 hover:text-red-500 p-1 transition-colors"
            aria-label="Eliminar hábito"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div className="mt-3 pl-9 text-zinc-300 text-sm">
          {habit.description || "Sin descripción"}
          {timeRemaining.isRedAlert && !habit.is_completed && (
            <div className="mt-2 flex items-center text-red-500 text-xs">
              <Clock className="w-4 h-4 mr-1" />
              <span>Tiempo restante: {formatTimeRemaining()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};