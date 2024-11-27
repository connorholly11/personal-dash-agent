'use client';

import { useState, useEffect } from 'react';
import { getDailySummary } from '@/lib/diet-storage';

interface MacroSummaryProps {
  date: Date;
}

export default function MacroSummary({ date }: MacroSummaryProps) {
  const [summary, setSummary] = useState<{
    calories: number;
    macros: { protein: number; carbs: number; fat: number };
  }>({
    calories: 0,
    macros: { protein: 0, carbs: 0, fat: 0 }
  });

  useEffect(() => {
    const loadSummary = async () => {
      const data = await getDailySummary(date);
      setSummary(data);
    };
    loadSummary();
  }, [date]);

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Macro Summary
      </h2>
      <div className="space-y-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {summary.calories}
          </span>
          <span className="text-gray-500 dark:text-gray-400">calories</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {summary.macros.protein}g
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">protein</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {summary.macros.carbs}g
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">carbs</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {summary.macros.fat}g
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">fat</div>
          </div>
        </div>
      </div>
    </div>
  );
} 