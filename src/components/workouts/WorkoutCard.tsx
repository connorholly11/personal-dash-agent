'use client';

import { Workout, Exercise } from '@/types/workout';
import { deleteWorkout } from '@/lib/workout-storage';

interface WorkoutCardProps {
  workout: Workout;
  onUpdate: () => void;
}

export default function WorkoutCard({ workout, onUpdate }: WorkoutCardProps) {
  const handleDelete = async () => {
    if (!workout.id) return;
    if (confirm('Are you sure you want to delete this workout?')) {
      await deleteWorkout(workout.id);
      onUpdate();
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderExerciseDetails = (exercise: Exercise) => {
    if (exercise.type === 'strength' && exercise.sets) {
      return (
        <div className="space-y-1">
          {exercise.sets.map((set, index) => (
            <div key={index} className="text-sm text-gray-500 dark:text-gray-400">
              Set {index + 1}: {set.reps} reps @ {set.weight} lbs
            </div>
          ))}
        </div>
      );
    }

    if (exercise.type === 'cardio') {
      return (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {exercise.duration} minutes
          {exercise.distance && ` • ${exercise.distance} miles`}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 mb-4">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {workout.name}
            </h3>
            <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {formatTime(workout.timestamp)}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 capitalize">
            {workout.category}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 text-xs sm:text-sm self-end sm:self-auto"
        >
          Delete
        </button>
      </div>

      <div className="space-y-4">
        {workout.exercises?.map((exercise) => (
          <div key={exercise.id} className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-md font-medium text-gray-900 dark:text-white">
                  {exercise.name}
                </h4>
                <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {exercise.type}
                </div>
              </div>
            </div>
            {renderExerciseDetails(exercise)}
            {exercise.notes && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                {exercise.notes}
              </p>
            )}
          </div>
        ))}
      </div>

      {workout.notes && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {workout.notes}
          </p>
        </div>
      )}
    </div>
  );
} 