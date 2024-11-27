import { db } from './db';
import type { Habit, HabitFormData } from '@/types/habit';

// Temporary user ID until auth is implemented
const TEMP_USER_ID = 'temp-user';

export async function getHabits(): Promise<Habit[]> {
  return await db.habits
    .where('userId')
    .equals(TEMP_USER_ID)
    .toArray();
}

export async function saveHabit(habitData: HabitFormData): Promise<Habit> {
  const habit: Omit<Habit, 'id'> = {
    ...habitData,
    userId: TEMP_USER_ID,
    startTime: Date.now(),
    isActive: true,
    totalSeconds: 0,
    lastUpdated: Date.now()
  };

  const id = await db.habits.add(habit);
  return await db.habits.get(id) as Habit;
}

export async function updateHabit(habit: Habit): Promise<void> {
  await db.habits.put(habit);
}

export async function deleteHabit(habitId: string): Promise<void> {
  await db.habits.delete(habitId);
}

export async function toggleHabit(habitId: string): Promise<Habit | undefined> {
  const habit = await db.habits.get(habitId);
  
  if (habit) {
    const now = Date.now();
    if (habit.isActive) {
      // Stopping the timer
      const additionalSeconds = Math.floor((now - habit.lastUpdated) / 1000);
      habit.totalSeconds += additionalSeconds;
    }
    habit.isActive = !habit.isActive;
    habit.lastUpdated = now;
    
    await updateHabit(habit);
    return habit;
  }
  
  return undefined;
} 