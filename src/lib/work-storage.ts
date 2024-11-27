import { db } from './db';
import type { FocusSession, Task, FocusSessionStats, Reminder } from '@/types/work';

// Temporary user ID until auth is implemented
const TEMP_USER_ID = 'temp-user';

export async function saveFocusSession(duration: number, notes?: string): Promise<FocusSession> {
  const now = Date.now();
  const session: Omit<FocusSession, 'id'> = {
    startTime: now - (duration * 60 * 1000),
    endTime: now,
    duration,
    notes,
    userId: TEMP_USER_ID
  };

  const id = await db.focusSessions.add(session);
  return await db.focusSessions.get(id) as FocusSession;
}

export async function getFocusSessionStats(): Promise<FocusSessionStats> {
  const now = Date.now();
  const oneDayAgo = now - (24 * 60 * 60 * 1000);
  const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);

  const sessions = await db.focusSessions
    .where('userId')
    .equals(TEMP_USER_ID)
    .toArray();

  return {
    daily: sessions.filter(s => s.endTime > oneDayAgo).length,
    weekly: sessions.filter(s => s.endTime > oneWeekAgo).length,
    monthly: sessions.filter(s => s.endTime > oneMonthAgo).length
  };
}

export async function saveTask(
  title: string,
  description?: string,
  label: 'high-leverage' | 'low-leverage-important' | 'nice-to-have' = 'nice-to-have'
): Promise<Task> {
  const task: Omit<Task, 'id'> = {
    title,
    description,
    completed: false,
    createdAt: Date.now(),
    userId: TEMP_USER_ID,
    label
  };

  const id = await db.tasks.add(task);
  return await db.tasks.get(id) as Task;
}

export async function getTasks(): Promise<Task[]> {
  return await db.tasks
    .where('userId')
    .equals(TEMP_USER_ID)
    .reverse()
    .sortBy('createdAt');
}

export async function getDailyTasks(date: Date): Promise<Task[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await db.tasks
    .where('userId')
    .equals(TEMP_USER_ID)
    .filter(task => {
      const taskDate = new Date(task.createdAt);
      return taskDate >= startOfDay && taskDate <= endOfDay;
    })
    .toArray();
}

export async function toggleTask(taskId: string): Promise<Task> {
  const task = await db.tasks.get(taskId);
  if (!task) throw new Error('Task not found');

  const now = Date.now();
  await db.tasks.update(taskId, {
    completed: !task.completed,
    completedAt: !task.completed ? now : undefined
  });

  return await db.tasks.get(taskId) as Task;
}

export async function deleteTask(taskId: string): Promise<void> {
  await db.tasks.delete(taskId);
}

export async function saveReminder(text: string): Promise<Reminder> {
  const reminder: Omit<Reminder, 'id'> = {
    text,
    createdAt: Date.now(),
    userId: TEMP_USER_ID
  };

  const id = await db.reminders.add(reminder);
  return await db.reminders.get(id) as Reminder;
}

export async function getReminders(): Promise<Reminder[]> {
  return await db.reminders
    .where('userId')
    .equals(TEMP_USER_ID)
    .reverse()
    .sortBy('createdAt');
}

export async function deleteReminder(reminderId: string): Promise<void> {
  await db.reminders.delete(reminderId);
} 