'use client';

import { useState } from 'react';
import { WorkoutCategory, ExerciseType, ExerciseFormData, SetFormData, WorkoutFormData } from '@/types/workout';
import { saveWorkout } from '@/lib/workout-storage';

interface NewWorkoutFormProps {
  onSave: () => void;
  onCancel: () => void;
  categories: WorkoutCategory[];
  selectedDate: Date;
}

export default function NewWorkoutForm({ onSave, onCancel, categories, selectedDate }: NewWorkoutFormProps) {
  const defaultCategory = categories && categories.length > 0 ? categories[0] : 'other' as WorkoutCategory;
  const [name, setName] = useState('');
  const [category, setCategory] = useState<WorkoutCategory>(defaultCategory);
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState<ExerciseFormData[]>([]);
  const [currentExercise, setCurrentExercise] = useState<ExerciseFormData>({
    name: '',
    type: 'strength',
    sets: [],
    notes: ''
  });

  const handleAddSet = () => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: [...prev.sets, { reps: 0, weight: 0 }]
    }));
  };

  const handleUpdateSet = (index: number, field: keyof SetFormData, value: number) => {
    setCurrentExercise(prev => {
      const newSets = [...prev.sets];
      newSets[index] = { ...newSets[index], [field]: value };
      return { ...prev, sets: newSets };
    });
  };

  const handleRemoveSet = (index: number) => {
    setCurrentExercise(prev => ({
      ...prev,
      sets: prev.sets.filter((_, i) => i !== index)
    }));
  };

  const handleAddExercise = () => {
    if (currentExercise.name && 
        ((currentExercise.type === 'strength' && currentExercise.sets.length > 0) ||
         (currentExercise.type === 'cardio' && currentExercise.duration))) {
      setExercises(prev => [...prev, currentExercise]);
      setCurrentExercise({
        name: '',
        type: 'strength',
        sets: [],
        notes: ''
      });
    }
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add current exercise if it's valid
    if (currentExercise.name && 
        ((currentExercise.type === 'strength' && currentExercise.sets.length > 0) ||
         (currentExercise.type === 'cardio' && currentExercise.duration))) {
      handleAddExercise();
    }

    const workoutData: WorkoutFormData = {
      name,
      category,
      exercises: exercises,
      notes,
      date: selectedDate
    };

    await saveWorkout(workoutData);
    onSave();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Workout Name
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
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as WorkoutCategory)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Exercise List */}
      {exercises.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Exercises</h3>
          {exercises.map((exercise, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{exercise.name}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{exercise.type}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveExercise(index)}
                  className="text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
              {exercise.type === 'strength' && (
                <div className="mt-2 space-y-2">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="text-sm text-gray-600 dark:text-gray-300">
                      Set {setIndex + 1}: {set.reps} reps @ {set.weight} lbs
                    </div>
                  ))}
                </div>
              )}
              {exercise.type === 'cardio' && (
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Duration: {exercise.duration} minutes
                  {exercise.distance && ` • Distance: ${exercise.distance} miles`}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Exercise Form */}
      <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Exercise</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Exercise Name
            </label>
            <input
              type="text"
              value={currentExercise.name}
              onChange={(e) => setCurrentExercise(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Exercise Type
            </label>
            <select
              value={currentExercise.type}
              onChange={(e) => setCurrentExercise(prev => ({ 
                ...prev, 
                type: e.target.value as ExerciseType,
                sets: [],
                duration: undefined,
                distance: undefined
              }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="strength">Strength</option>
              <option value="cardio">Cardio</option>
              <option value="flexibility">Flexibility</option>
              <option value="other">Other</option>
            </select>
          </div>

          {currentExercise.type === 'strength' && (
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
              {currentExercise.sets.map((set, index) => (
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

          {currentExercise.type === 'cardio' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  value={currentExercise.duration || ''}
                  onChange={(e) => setCurrentExercise(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Distance (miles)
                </label>
                <input
                  type="number"
                  value={currentExercise.distance || ''}
                  onChange={(e) => setCurrentExercise(prev => ({ ...prev, distance: parseFloat(e.target.value) }))}
                  min="0"
                  step="0.1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Notes
            </label>
            <textarea
              value={currentExercise.notes}
              onChange={(e) => setCurrentExercise(prev => ({ ...prev, notes: e.target.value }))}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleAddExercise}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium"
          >
            Add Exercise
          </button>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Workout Notes
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
          Save Workout
        </button>
      </div>
    </form>
  );
} 