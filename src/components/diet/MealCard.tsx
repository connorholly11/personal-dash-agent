'use client';

import { Meal } from '@/types/diet';
import { deleteMeal } from '@/lib/diet-storage';

interface MealCardProps {
  meal: Meal;
  onUpdate: () => void;
}

export default function MealCard({ meal, onUpdate }: MealCardProps) {
  const handleDelete = () => {
    if (!meal.id) return;
    if (confirm('Are you sure you want to delete this meal?')) {
      deleteMeal(meal.id);
      onUpdate();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {meal.mealType}
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatTime(meal.timestamp)}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {meal.foodItems.join(', ')}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-lg font-semibold text-gray-900 dark:text-white">
          {meal.calories} calories
        </div>
        {meal.notes && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {meal.notes}
          </p>
        )}
      </div>
    </div>
  );
} 