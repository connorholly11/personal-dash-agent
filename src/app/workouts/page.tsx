'use client';

import { useState, useEffect, useCallback } from 'react';
import { Workout, WorkoutCategory } from '@/types/workout';
import { getWorkoutsByDate } from '@/lib/workout-storage';
import WorkoutCard from '@/components/workouts/WorkoutCard';
import NewWorkoutForm from '@/components/workouts/NewWorkoutForm';
import Calendar from '@/components/shared/Calendar';

const WORKOUT_CATEGORIES: WorkoutCategory[] = ['upper body', 'lower body', 'full body', 'cardio', 'other'];

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState<WorkoutCategory | 'all'>('all');
  const [showCalendar, setShowCalendar] = useState(false);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);

  const loadWorkouts = useCallback(async () => {
    const workoutsList = await getWorkoutsByDate(selectedDate);
    setWorkouts(workoutsList);
  }, [selectedDate]);

  useEffect(() => {
    loadWorkouts();
  }, [loadWorkouts]);

  const filteredWorkouts = selectedCategory === 'all'
    ? workouts
    : workouts.filter(workout => workout.category === selectedCategory);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Workouts Tracker</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="text-indigo-500 hover:text-indigo-600 text-sm font-medium"
            >
              {showCalendar ? 'Hide Calendar' : 'Show Calendar'}
            </button>
            <button
              onClick={() => handleDateChange(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Previous Day
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <button
              onClick={() => handleDateChange(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Next Day
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            {isAddingWorkout ? (
              <NewWorkoutForm
                categories={WORKOUT_CATEGORIES}
                selectedDate={selectedDate}
                onSave={() => {
                  setIsAddingWorkout(false);
                  loadWorkouts();
                }}
                onCancel={() => setIsAddingWorkout(false)}
              />
            ) : (
              <button
                onClick={() => setIsAddingWorkout(true)}
                className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium"
              >
                Add New Workout
              </button>
            )}
          </div>
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as WorkoutCategory | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">All Categories</option>
              {WORKOUT_CATEGORIES.map(category => (
                <option key={category} value={category} className="capitalize">
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showCalendar && (
        <Calendar
          selectedDate={selectedDate}
          onDateSelect={handleDateChange}
        />
      )}

      {filteredWorkouts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No workouts logged for this day. Add your first workout to get started!
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
          {filteredWorkouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onUpdate={loadWorkouts}
            />
          ))}
        </div>
      )}
    </div>
  );
} 