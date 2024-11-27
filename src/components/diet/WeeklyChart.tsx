'use client';

import { getWeekSummary } from '@/lib/diet-storage';
import { useState, useEffect } from 'react';

interface WeeklyChartProps {
  startDate: Date;
}

export default function WeeklyChart({ startDate }: WeeklyChartProps) {
  const [weekData, setWeekData] = useState<Array<{
    weight: number;
    calories: number;
    macros: { protein: number; carbs: number; fat: number };
    date: Date;
  }>>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getWeekSummary(startDate);
      setWeekData(data);
    };
    loadData();
  }, [startDate]);

  const maxCalories = Math.max(...weekData.map(day => day.calories), 1);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Weekly Overview
      </h2>
      
      <div className="space-y-4">
        {weekData.map((day, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{formatDate(day.date)}</span>
              <span>{day.calories} cal</span>
            </div>
            
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full flex">
                <div 
                  className="bg-blue-600 dark:bg-blue-400" 
                  style={{ 
                    width: `${(day.macros.protein * 4 / (day.calories || 1)) * 100}%`,
                    opacity: Math.max(0.3, day.calories / maxCalories)
                  }}
                />
                <div 
                  className="bg-green-600 dark:bg-green-400" 
                  style={{ 
                    width: `${(day.macros.carbs * 4 / (day.calories || 1)) * 100}%`,
                    opacity: Math.max(0.3, day.calories / maxCalories)
                  }}
                />
                <div 
                  className="bg-yellow-600 dark:bg-yellow-400" 
                  style={{ 
                    width: `${(day.macros.fat * 9 / (day.calories || 1)) * 100}%`,
                    opacity: Math.max(0.3, day.calories / maxCalories)
                  }}
                />
              </div>
            </div>

            {day.weight && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Weight: {day.weight} lbs
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
          <span>Protein</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-600 dark:bg-green-400 rounded-full"></div>
          <span>Carbs</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-600 dark:bg-yellow-400 rounded-full"></div>
          <span>Fat</span>
        </div>
      </div>
    </div>
  );
} 