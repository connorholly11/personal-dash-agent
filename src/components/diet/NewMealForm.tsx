'use client';

import { useState } from 'react';
import { MealFormData, MealType } from '@/types/diet';
import { saveMeal } from '@/lib/diet-storage';

interface NewMealFormProps {
  onSave: () => void;
}

const MEAL_TYPES: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function NewMealForm({ onSave }: NewMealFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<MealFormData>({
    mealType: 'breakfast',
    foodItems: [''],
    calories: 0,
    macros: {
      protein: 0,
      carbs: 0,
      fat: 0
    },
    notes: ''
  });

  const handleAddFoodItem = () => {
    setFormData(prev => ({
      ...prev,
      foodItems: [...prev.foodItems, '']
    }));
  };

  const handleFoodItemChange = (index: number, value: string) => {
    const newFoodItems = [...formData.foodItems];
    newFoodItems[index] = value;
    setFormData(prev => ({
      ...prev,
      foodItems: newFoodItems
    }));
  };

  const handleRemoveFoodItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      foodItems: prev.foodItems.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.foodItems.some(item => item.trim() !== '')) {
      saveMeal({
        ...formData,
        foodItems: formData.foodItems.filter(item => item.trim() !== '')
      });
      setFormData({
        mealType: 'breakfast',
        foodItems: [''],
        calories: 0,
        macros: {
          protein: 0,
          carbs: 0,
          fat: 0
        },
        notes: ''
      });
      setIsOpen(false);
      onSave();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium"
      >
        Add New Meal
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <div className="mb-4">
        <label htmlFor="mealType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Meal Type *
        </label>
        <select
          id="mealType"
          value={formData.mealType}
          onChange={(e) => setFormData(prev => ({ ...prev, mealType: e.target.value as MealType }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {MEAL_TYPES.map(type => (
            <option key={type} value={type} className="capitalize">
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Food Items *
        </label>
        {formData.foodItems.map((item, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleFoodItemChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter food item"
              required
            />
            {formData.foodItems.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveFoodItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddFoodItem}
          className="text-indigo-500 hover:text-indigo-600 text-sm font-medium"
        >
          + Add Another Item
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Calories *
          </label>
          <input
            type="number"
            id="calories"
            value={formData.calories}
            onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="protein" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Protein (g) *
          </label>
          <input
            type="number"
            id="protein"
            value={formData.macros.protein}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              macros: { ...prev.macros, protein: parseInt(e.target.value) || 0 }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Carbs (g) *
          </label>
          <input
            type="number"
            id="carbs"
            value={formData.macros.carbs}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              macros: { ...prev.macros, carbs: parseInt(e.target.value) || 0 }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            min="0"
            required
          />
        </div>

        <div>
          <label htmlFor="fat" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Fat (g) *
          </label>
          <input
            type="number"
            id="fat"
            value={formData.macros.fat}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              macros: { ...prev.macros, fat: parseInt(e.target.value) || 0 }
            }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            min="0"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium"
        >
          Save Meal
        </button>
      </div>
    </form>
  );
} 