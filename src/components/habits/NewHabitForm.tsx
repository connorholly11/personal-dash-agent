'use client';

import { useState } from 'react';
import { HabitFormData } from '@/types/habit';
import { saveHabit } from '@/lib/habit-storage';

interface NewHabitFormProps {
  onSave: () => void;
}

export default function NewHabitForm({ onSave }: NewHabitFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<HabitFormData>({
    name: '',
    description: '',
    backtrackDays: 0
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      await saveHabit(formData.name, formData.description, formData.backtrackDays);
      setFormData({ name: '', description: '', backtrackDays: 0 });
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
        Add New Habit
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Habit Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          required
        />
      </div>

      <div>
        <label htmlFor="backtrackDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Days to Backtrack
        </label>
        <input
          type="number"
          id="backtrackDays"
          value={formData.backtrackDays}
          min="0"
          max="365"
          onChange={(e) => setFormData(prev => ({ ...prev, backtrackDays: Math.max(0, parseInt(e.target.value) || 0) }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <p className="mt-1 text-sm text-gray-500">Enter how many days back this habit started (0 for today)</p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description (optional)
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
          Save Habit
        </button>
      </div>
    </form>
  );
} 