'use client';

import { useState } from 'react';
import { ExerciseFormData, ExerciseType, Set } from '@/types/workout';

interface ExerciseFormProps {
  onSave: (exercise: ExerciseFormData) => void;
  onCancel: () => void;
}

export default function ExerciseForm({ onSave, onCancel }: ExerciseFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<ExerciseType>('strength');
  const [sets, setSets] = useState<Omit<Set, 'id'>[]>([]);
  const [duration, setDuration] = useState('');
  const [distance, setDistance] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddSet = () => {
    setSets(prev => [...prev, { reps: 0, weight: 0 }]);
  };

  const handleUpdateSet = (index: number, field: keyof Set, value: number) => {
    setSets(prev => {
      const newSets = [...prev];
      newSets[index] = { ...newSets[index], [field]: value };
      return newSets;
    });
  };

  const handleRemoveSet = (index: number) => {
    setSets(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const exerciseData: ExerciseFormData = {
      name,
      type,
      notes
    };

    if (type === 'strength') {
      exerciseData.sets = sets;
    } else if (type === 'cardio') {
      if (duration) exerciseData.duration = parseInt(duration);
      if (distance) exerciseData.distance = parseFloat(distance);
    }

    onSave(exerciseData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Exercise Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Type
        </label>
        <select
          id="type"
          value={type}
          onChange={(e) => setType(e.target.value as ExerciseType)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="strength">Strength</option>
          <option value="cardio">Cardio</option>
          <option value="flexibility">Flexibility</option>
          <option value="other">Other</option>
        </select>
      </div>

      {type === 'strength' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Sets</h4>
            <button
              type="button"
              onClick={handleAddSet}
              className="text-indigo-500 hover:text-indigo-600 text-sm font-medium"
            >
              + Add Set
            </button>
          </div>
          {sets.map((set, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Reps
                </label>
                <input
                  type="number"
                  value={set.reps}
                  onChange={(e) => handleUpdateSet(index, 'reps', parseInt(e.target.value))}
                  min="0"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-500 dark:text-gray-400">
                  Weight (lbs)
                </label>
                <input
                  type="number"
                  value={set.weight}
                  onChange={(e) => handleUpdateSet(index, 'weight', parseInt(e.target.value))}
                  min="0"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSet(index)}
                className="mt-6 text-red-500 hover:text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {type === 'cardio' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="distance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Distance (miles)
            </label>
            <input
              type="number"
              id="distance"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              min="0"
              step="0.1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      )}

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700"
        >
          Save
        </button>
      </div>
    </form>
  );
} 