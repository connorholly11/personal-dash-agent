'use client';

import { useState } from 'react';
import { Habit } from '@/types/habit';
import { toggleHabit, deleteHabit, resetHabitStreak } from '@/lib/habit-storage';
import { useHabitTimer } from '@/hooks/useHabitTimer';

interface HabitCardProps {
  habit: Habit;
  onUpdate: () => void;
}

export default function HabitCard({ habit, onUpdate }: HabitCardProps) {
  const { formattedTime } = useHabitTimer(habit);
  const [localHabit, setLocalHabit] = useState(habit);

  // Update local state when prop changes
  if (habit.id !== localHabit.id || 
      habit.totalSeconds !== localHabit.totalSeconds || 
      habit.isActive !== localHabit.isActive) {
    setLocalHabit(habit);
  }

  const handleToggle = async () => {
    if (!localHabit.id) return;
    const updatedHabit = await toggleHabit(localHabit.id);
    setLocalHabit(updatedHabit);
    onUpdate();
  };

  const handleDelete = async () => {
    if (!localHabit.id) return;
    if (confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit(localHabit.id);
      onUpdate();
    }
  };

  const handleReset = async () => {
    if (!localHabit.id) return;
    if (confirm('Are you sure you want to reset this streak? The current streak will be saved to history.')) {
      const updatedHabit = await resetHabitStreak(localHabit.id);
      setLocalHabit(updatedHabit);
      onUpdate();
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatSeconds = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds}s`);

    return parts.join(' ');
  };

  const streakHistory = localHabit.streakHistory || [];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {localHabit.name}
          </h3>
          {localHabit.description && (
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {localHabit.description}
            </p>
          )}
        </div>
        <div className="flex space-x-2 self-end sm:self-auto">
          <button
            onClick={handleReset}
            className="text-yellow-500 hover:text-yellow-700 text-xs sm:text-sm"
          >
            Reset
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 text-xs sm:text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xl sm:text-2xl font-mono text-gray-900 dark:text-white">
          {formattedTime.formatted}
        </div>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Current Time
        </div>
      </div>

      <button
        onClick={handleToggle}
        className={`w-full py-2 px-4 rounded-md text-sm font-medium mb-4 ${
          localHabit.isActive
            ? 'bg-red-500 hover:bg-red-600 text-white'
            : 'bg-green-500 hover:bg-green-600 text-white'
        }`}
      >
        {localHabit.isActive ? 'Stop' : 'Start'}
      </button>

      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Time History
        </h4>
        {streakHistory.length > 0 ? (
          <div className="space-y-2">
            {streakHistory
              .sort((a, b) => b.endDate - a.endDate)
              .map((streak, index) => (
                <div
                  key={index}
                  className="text-sm text-gray-500 dark:text-gray-400 flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <span>
                    {formatDate(streak.startDate)}
                  </span>
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">
                    {formatSeconds(streak.count)}
                  </span>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            No previous times yet
          </p>
        )}
      </div>
    </div>
  );
} 