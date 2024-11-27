import Dexie, { Table } from 'dexie';
import { Workout, Exercise } from '@/types/workout';
import { Habit } from '@/types/habit';
import { Note } from '@/types/note';
import { Meal, SavedMeal, WeightEntry } from '@/types/diet';
import { Bookmark } from '@/types/bookmark';

export class MyAppDatabase extends Dexie {
  workouts!: Table<Workout>;
  exercises!: Table<Exercise>;
  habits!: Table<Habit>;
  notes!: Table<Note>;
  meals!: Table<Meal>;
  savedMeals!: Table<SavedMeal>;
  bookmarks!: Table<Bookmark>;
  weightEntries!: Table<WeightEntry>;

  constructor() {
    super('myAppDatabase');
    this.version(1).stores({
      workouts: '++id, userId, timestamp, isInProgress',
      exercises: '++id, workoutId, userId',
      habits: '++id, userId, name',
      notes: '++id, userId, timestamp',
      meals: '++id, userId, timestamp',
      savedMeals: '++id, userId',
      bookmarks: '++id, userId, timestamp',
      weightEntries: '++id, userId, timestamp'
    });
  }
}

export const db = new MyAppDatabase(); 