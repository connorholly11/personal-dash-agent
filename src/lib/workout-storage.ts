import { db } from './db';
import type { Workout, WorkoutFormData, Exercise } from '@/types/workout';

// Temporary user ID until auth is implemented
const TEMP_USER_ID = 'temp-user';

export async function getWorkouts(): Promise<Workout[]> {
  const workouts = await db.workouts
    .where('userId')
    .equals(TEMP_USER_ID)
    .reverse()
    .sortBy('timestamp');
  
  // Ensure exercises are loaded for each workout
  return await Promise.all(workouts.map(async (workout) => {
    const exercises = await db.exercises
      .where('workoutId')
      .equals(workout.id!)
      .toArray();
    return { ...workout, exercises };
  }));
}

export async function getWorkoutsByDate(date: Date): Promise<Workout[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const workouts = await db.workouts
    .where('userId')
    .equals(TEMP_USER_ID)
    .filter(workout => 
      workout.timestamp >= startOfDay.getTime() && 
      workout.timestamp <= endOfDay.getTime()
    )
    .sortBy('timestamp');

  // Ensure exercises are loaded for each workout
  return await Promise.all(workouts.map(async (workout) => {
    const exercises = await db.exercises
      .where('workoutId')
      .equals(workout.id!)
      .toArray();
    return { ...workout, exercises };
  }));
}

export async function saveWorkout(workoutData: WorkoutFormData): Promise<Workout> {
  // Set the timestamp to the start of the selected date
  const timestamp = new Date(workoutData.date);
  timestamp.setHours(12, 0, 0, 0);  // Set to noon of the selected date

  const workout: Omit<Workout, 'id'> = {
    name: workoutData.name,
    category: workoutData.category,
    timestamp: timestamp.getTime(),  // Use the selected date's timestamp
    exercises: [],
    userId: TEMP_USER_ID,
    notes: workoutData.notes,
    isInProgress: false
  };

  // First save the workout to get its ID
  const workoutId = await db.workouts.add(workout);
  const savedWorkout = await db.workouts.get(workoutId) as Workout;

  // Then create and save each exercise
  const exercises = await Promise.all(workoutData.exercises.map(async (exercise) => {
    const exerciseData: Omit<Exercise, 'id'> = {
      name: exercise.name,
      type: exercise.type,
      sets: exercise.sets,
      duration: exercise.duration,
      distance: exercise.distance,
      notes: exercise.notes,
      workoutId: savedWorkout.id!,
      userId: TEMP_USER_ID
    };
    const exerciseId = await db.exercises.add(exerciseData);
    const savedExercise = await db.exercises.get(exerciseId);
    return savedExercise!;
  }));

  // Update the workout with the exercises
  savedWorkout.exercises = exercises;
  await db.workouts.put(savedWorkout);

  return savedWorkout;
}

export async function updateWorkout(workout: Workout): Promise<void> {
  // Update exercises
  await Promise.all(workout.exercises.map(exercise => 
    db.exercises.put(exercise)
  ));

  // Update workout
  await db.workouts.put(workout);
}

export async function deleteWorkout(workoutId: string): Promise<void> {
  // Delete associated exercises first
  await db.exercises
    .where('workoutId')
    .equals(workoutId)
    .delete();

  // Then delete the workout
  await db.workouts.delete(workoutId);
}

export async function getWorkoutSummary(date: Date) {
  const workouts = await getWorkoutsByDate(date);
  
  return {
    totalWorkouts: workouts.length,
    totalDuration: workouts.reduce((total, workout) => {
      return total + workout.exercises.reduce((exerciseTotal, exercise) => {
        return exerciseTotal + (exercise.duration || 0);
      }, 0);
    }, 0),
    exerciseTypes: workouts.reduce((types, workout) => {
      workout.exercises.forEach(exercise => {
        types[exercise.type] = (types[exercise.type] || 0) + 1;
      });
      return types;
    }, {} as Record<string, number>)
  };
}

export async function getWeekSummary(startDate: Date) {
  const summary = [];
  const currentDate = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    summary.push({
      date: new Date(currentDate),
      ...await getWorkoutSummary(currentDate)
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return summary;
} 