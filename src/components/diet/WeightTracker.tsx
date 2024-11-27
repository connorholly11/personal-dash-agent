'use client';

import { useState, useEffect } from 'react';
import { WeightEntry, WeightFormData } from '@/types/diet';
import { saveWeight, getWeightByDate } from '@/lib/diet-storage';

interface WeightTrackerProps {
  date: Date;
  onUpdate: () => void;
}

export default function WeightTracker({ date, onUpdate }: WeightTrackerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentWeight, setCurrentWeight] = useState<WeightEntry | undefined>();
  const [formData, setFormData] = useState<WeightFormData>({
    weight: 0,
    notes: ''
  });

  useEffect(() => {
    const loadWeight = async () => {
      const weight = await getWeightByDate(date);
      setCurrentWeight(weight);
      if (weight) {
        setFormData({
          weight: weight.weight,
          notes: weight.notes || ''
        });
      }
    };
    loadWeight();
  }, [date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.weight > 0) {
      const savedWeight = await saveWeight(formData);
      setCurrentWeight(savedWeight);
      setIsEditing(false);
      onUpdate();
    }
  };

  if (!isEditing && !currentWeight) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Morning Weight
        </h2>
        <button
          onClick={() => setIsEditing(true)}
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium"
        >
          Add Weight
        </button>
      </div>
    );
  }

  if (!isEditing && currentWeight) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Morning Weight
        </h2>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {currentWeight.weight}
          </span>
          <span className="text-gray-500 dark:text-gray-400">lbs</span>
        </div>
        {currentWeight.notes && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentWeight.notes}
          </p>
        )}
        <button
          onClick={() => {
            setFormData({
              weight: currentWeight.weight,
              notes: currentWeight.notes || ''
            });
            setIsEditing(true);
          }}
          className="mt-4 text-indigo-500 hover:text-indigo-600 text-sm font-medium"
        >
          Edit
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Morning Weight
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="weight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Weight (lbs)
          </label>
          <input
            type="number"
            id="weight"
            value={formData.weight}
            onChange={(e) => setFormData(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            step="0.1"
            min="0"
            required
          />
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
            rows={2}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
} 