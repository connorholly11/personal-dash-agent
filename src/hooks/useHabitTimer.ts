'use client';

import { useState, useEffect } from 'react';
import { Habit } from '@/types/habit';

export function useHabitTimer(habit: Habit) {
  const [elapsedTime, setElapsedTime] = useState(habit.totalSeconds);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (habit.isActive) {
      // Update immediately
      const now = Date.now();
      const additionalSeconds = Math.floor((now - habit.lastUpdated) / 1000);
      setElapsedTime(habit.totalSeconds + additionalSeconds);

      // Then update every second
      intervalId = setInterval(() => {
        const now = Date.now();
        const additionalSeconds = Math.floor((now - habit.lastUpdated) / 1000);
        setElapsedTime(habit.totalSeconds + additionalSeconds);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [habit.isActive, habit.lastUpdated, habit.totalSeconds]);

  const formatTime = () => {
    const seconds = elapsedTime % 60;
    const minutes = Math.floor(elapsedTime / 60) % 60;
    const hours = Math.floor(elapsedTime / 3600) % 24;
    const days = Math.floor(elapsedTime / 86400);

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return {
      formatted: parts.join(' '),
      days,
      hours,
      minutes,
      seconds,
      totalSeconds: elapsedTime
    };
  };

  return {
    formattedTime: formatTime()
  };
} 