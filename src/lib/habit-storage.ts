import { db } from './db';
import type { Habit, Streak } from '@/types/habit';

// Temporary user ID until auth is implemented
const TEMP_USER_ID = 'temp-user';

export async function getHabits(): Promise<Habit[]> {
  return await db.habits
    .where('userId')
    .equals(TEMP_USER_ID)
    .toArray();
}

export async function saveHabit(name: string, description?: string): Promise<Habit> {
  const habit: Omit<Habit, 'id'> = {
    name,
    description,
    isActive: true,
    currentStreak: 0,
    streakHistory: [],
    totalSeconds: 0,
    lastUpdated: Date.now(),
    userId: TEMP_USER_ID
  };

  const id = await db.habits.add(habit);
  return await db.habits.get(id) as Habit;
}

export async function toggleHabit(habitId: string): Promise<Habit> {
  const habit = await db.habits.get(habitId);
  if (!habit) throw new Error('Habit not found');

  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (!habit.isActive) {
    // Starting a new session
    await db.habits.update(habitId, {
      isActive: true,
      lastActive: now,
      lastUpdated: now
    });
  } else {
    // Ending a session
    const additionalSeconds = Math.floor((now - habit.lastUpdated) / 1000);
    const daysSinceLastActive = habit.lastActive 
      ? Math.floor((now - habit.lastActive) / oneDayMs)
      : 0;

    if (daysSinceLastActive <= 1) {
      // Maintain or increment streak
      await db.habits.update(habitId, {
        isActive: false,
        currentStreak: habit.currentStreak + 1,
        lastActive: now,
        totalSeconds: habit.totalSeconds + additionalSeconds,
        lastUpdated: now
      });
    } else {
      // Break streak and add to history
      if (habit.currentStreak > 0) {
        const newStreak: Streak = {
          startDate: habit.lastActive! - (habit.currentStreak * oneDayMs),
          endDate: habit.lastActive!,
          count: habit.currentStreak
        };
        await db.habits.update(habitId, {
          isActive: false,
          currentStreak: 1,
          lastActive: now,
          totalSeconds: habit.totalSeconds + additionalSeconds,
          lastUpdated: now,
          streakHistory: [...habit.streakHistory, newStreak]
        });
      }
    }
  }

  return await db.habits.get(habitId) as Habit;
}

export async function resetHabitStreak(habitId: string): Promise<Habit> {
  const habit = await db.habits.get(habitId);
  if (!habit) throw new Error('Habit not found');

  const now = Date.now();
  let totalTime = habit.totalSeconds;

  // If the habit is active, add the time from the current session
  if (habit.isActive) {
    const additionalSeconds = Math.floor((now - habit.lastUpdated) / 1000);
    totalTime += additionalSeconds;
  }

  // Only save to history if there's time to save
  if (totalTime > 0) {
    const newStreak: Streak = {
      startDate: now - totalTime * 1000,
      endDate: now,
      count: totalTime
    };

    // Get existing streak history or initialize empty array
    const streakHistory = habit.streakHistory || [];

    // Update the habit and automatically start it
    await db.habits.update(habitId, {
      isActive: true,
      currentStreak: 0,
      lastActive: now,
      totalSeconds: 0,
      lastUpdated: now,
      streakHistory: [...streakHistory, newStreak]
    });
  }

  return await db.habits.get(habitId) as Habit;
}

export async function deleteHabit(habitId: string): Promise<void> {
  await db.habits.delete(habitId);
} 