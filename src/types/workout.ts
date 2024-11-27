export type ExerciseType = 'strength' | 'cardio' | 'flexibility' | 'other';
export type WorkoutCategory = 'upper body' | 'lower body' | 'full body' | 'cardio' | 'other';

export interface Set {
  reps: number;
  weight: number;  // in pounds/kg
  notes?: string;
}

export interface Exercise {
  id?: string;
  name: string;
  type: ExerciseType;
  sets: Set[];          // for strength training
  duration?: number;     // in minutes, for cardio
  distance?: number;     // in miles/km, for cardio
  notes?: string;
  workoutId: string;
  userId: string;
}

export interface Workout {
  id?: string;
  name: string;
  category: WorkoutCategory;
  timestamp: number;     // Unix timestamp in milliseconds
  exercises: Exercise[];
  duration?: number;     // total duration in minutes
  notes?: string;
  userId: string;
  isInProgress?: boolean;
}

export interface SetFormData {
  reps: number;
  weight: number;
  notes?: string;
}

export interface ExerciseFormData {
  name: string;
  type: ExerciseType;
  sets: SetFormData[];
  duration?: number;
  distance?: number;
  notes?: string;
}

export interface WorkoutFormData {
  name: string;
  category: WorkoutCategory;
  exercises: ExerciseFormData[];
  notes?: string;
  date: Date;
} 