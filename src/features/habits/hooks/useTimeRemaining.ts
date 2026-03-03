'use client';

import { useState, useEffect } from 'react';
import { getTimeRemainingUntilMidnight, TimeRemaining } from '../adapters/habitStateAdapter';

export const useTimeRemaining = (): TimeRemaining => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(getTimeRemainingUntilMidnight());
  
  useEffect(() => {
    // Actualizamos el tiempo cada segundo
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemainingUntilMidnight());
    }, 1000);
    
    // Limpiamos el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, []);
  
  return timeRemaining;
};