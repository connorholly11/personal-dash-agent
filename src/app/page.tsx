'use client';

import { useState, useEffect } from 'react';
import { Habit } from '@/types/habit';
import { Bookmark } from '@/types/bookmark';
import { Note } from '@/types/note';
import { Workout } from '@/types/workout';
import { Task, Reminder, FocusSessionStats } from '@/types/work';
import { getHabits } from '@/lib/habit-storage';
import { getBookmarks } from '@/lib/bookmark-storage';
import { getNotes } from '@/lib/note-storage';
import { getWorkoutsByDate } from '@/lib/workout-storage';
import { getDailySummary } from '@/lib/diet-storage';
import { getTasks, getReminders, getFocusSessionStats } from '@/lib/work-storage';

export default function DashboardPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [calories, setCalories] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [focusStats, setFocusStats] = useState<FocusSessionStats>({ daily: 0, weekly: 0, monthly: 0 });

  useEffect(() => {
    const loadData = async () => {
      const [habitsList, bookmarksList, notesList, workoutsList, dietSummary, tasksList, remindersList, focusSessionStats] = await Promise.all([
        getHabits(),
        getBookmarks(),
        getNotes(),
        getWorkoutsByDate(new Date()),
        getDailySummary(new Date()),
        getTasks(),
        getReminders(),
        getFocusSessionStats()
      ]);

      setHabits(habitsList);
      setBookmarks(bookmarksList);
      setNotes(notesList);
      setWorkouts(workoutsList);
      setCalories(dietSummary.calories);
      setTasks(tasksList);
      setReminders(remindersList);
      setFocusStats(focusSessionStats);
    };

    loadData();
  }, []);

  const activeHabits = habits.filter(habit => habit.isActive).length;
  const totalHabits = habits.length;
  const recentBookmarks = bookmarks.slice(0, 3);
  const recentNotes = notes.slice(0, 3);
  const todayWorkouts = workouts.length;
  const activeTasks = tasks.filter(task => !task.completed);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Dashboard Overview</h1>

      <div className="grid gap-4 sm:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Habits</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">{activeHabits}</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">of {totalHabits}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Today&apos;s Workouts</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-semibold text-green-600 dark:text-green-400">{todayWorkouts}</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Today&apos;s Calories</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-semibold text-yellow-600 dark:text-yellow-400">{calories}</span>
            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">kcal</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Notes</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-semibold text-blue-600 dark:text-blue-400">{notes.length}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* Recent Bookmarks */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Bookmarks</h2>
          <div className="space-y-4">
            {recentBookmarks.map(bookmark => (
              <div key={bookmark.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  {bookmark.title}
                </a>
                {bookmark.description && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {bookmark.description && bookmark.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Notes */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Notes</h2>
          <div className="space-y-4">
            {recentNotes.map(note => (
              <div key={note.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <h3 className="font-medium text-gray-900 dark:text-white">{note.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Habits */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Habits</h2>
          <div className="space-y-4">
            {habits
              .filter(habit => habit.isActive)
              .map(habit => (
                <div key={habit.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                  <h3 className="font-medium text-gray-900 dark:text-white">{habit.name}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Current Streak: {habit.currentStreak}
                    </span>
                    <span className="text-sm font-mono text-indigo-600 dark:text-indigo-400">
                      {Math.floor(habit.totalSeconds / 60)}m {habit.totalSeconds % 60}s
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Work Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Work</h2>
        
        {/* Focus Session Stats */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Today&apos;s Sessions</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">{focusStats.daily}</span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Week</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">{focusStats.weekly}</span>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</h3>
            <div className="mt-2 flex items-baseline">
              <span className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400">{focusStats.monthly}</span>
            </div>
          </div>
        </div>

        {/* Active Tasks */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Active Tasks</h3>
          <div className="space-y-2">
            {activeTasks.slice(0, 3).map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div>
                  <span className="text-sm text-gray-900 dark:text-white">{task.title}</span>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded ${
                    task.label === 'high-leverage' 
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : task.label === 'low-leverage-important'
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}>
                    {task.label === 'high-leverage' 
                      ? 'High Leverage'
                      : task.label === 'low-leverage-important'
                      ? 'Low Leverage + Important'
                      : 'Nice to Have'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminders */}
        <div>
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Reminders</h3>
          <div className="space-y-2">
            {reminders.slice(0, 3).map(reminder => (
              <div
                key={reminder.id}
                className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <span className="text-sm text-gray-900 dark:text-white">{reminder.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
