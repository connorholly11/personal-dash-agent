'use client';

import { useState, useEffect } from 'react';
import { Habit } from '@/types/habit';
import { getHabits } from '@/lib/storage';
import HabitCard from '@/components/habits/HabitCard';
import NewHabitForm from '@/components/habits/NewHabitForm';

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);

  const loadHabits = async () => {
    const habitsList = await getHabits();
    setHabits(habitsList);
  };

  useEffect(() => {
    loadHabits();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Habits Tracker</h1>
        <NewHabitForm onSave={loadHabits} />
      </div>

      {habits.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No habits tracked yet. Add your first habit to get started!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onUpdate={loadHabits}
            />
          ))}
        </div>
      )}
    </div>
  );
} 