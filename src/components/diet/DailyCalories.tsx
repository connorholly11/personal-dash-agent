'use client';

import { useState, useEffect } from 'react';
import { getDailyCalories } from '@/lib/diet-storage';

interface DailyCaloriesProps {
  date: Date;
}

export default function DailyCalories({ date }: DailyCaloriesProps) {
  const [calories, setCalories] = useState(0);

  useEffect(() => {
    const loadCalories = async () => {
      const total = await getDailyCalories(date);
      setCalories(total);
    };
    loadCalories();
  }, [date]);
  
  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Daily Summary
      </h2>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          {calories}
        </span>
        <span className="text-gray-500 dark:text-gray-400">calories today</span>
      </div>
    </div>
  );
} 