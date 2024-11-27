'use client';

import { SavedMeal } from '@/types/diet';
import { deleteSavedMeal } from '@/lib/diet-storage';

interface SavedMealCardProps {
  meal: SavedMeal;
  onUse: (meal: SavedMeal) => void;
  onUpdate: () => void;
}

export default function SavedMealCard({ meal, onUse, onUpdate }: SavedMealCardProps) {
  const handleDelete = () => {
    if (!meal.id) return;
    if (confirm('Are you sure you want to delete this saved meal?')) {
      deleteSavedMeal(meal.id);
      onUpdate();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {meal.name}
          </h3>
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

      <div className="mt-4">
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {meal.calories}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">calories</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {meal.macros.protein}g
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">protein</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {meal.macros.carbs}g
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">carbs</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {meal.macros.fat}g
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">fat</div>
          </div>
        </div>

        <button
          onClick={() => onUse(meal)}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium"
        >
          Use This Meal
        </button>
      </div>
    </div>
  );
} 