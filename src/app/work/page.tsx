'use client';

import { useState, useEffect } from 'react';
import { FocusSession, Task, FocusSessionStats, Reminder } from '@/types/work';
import { saveFocusSession, getFocusSessionStats, saveTask, getTasks, toggleTask, deleteTask, saveReminder, getReminders, deleteReminder } from '@/lib/work-storage';
import FocusHeatMap from '@/components/work/FocusHeatMap';

export default function WorkPage() {
  const [stats, setStats] = useState<FocusSessionStats>({ daily: 0, weekly: 0, monthly: 0 });
  const [activeTasks, setActiveTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newReminder, setNewReminder] = useState('');
  const [newTask, setNewTask] = useState<{
    title: string;
    description: string;
    label: Task['label'];
  }>({ 
    title: '', 
    description: '', 
    label: 'nice-to-have'
  });
  const [isAddingSession, setIsAddingSession] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(90);
  const [sessionNotes, setSessionNotes] = useState('');

  const labelColors = {
    'high-leverage': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'low-leverage-important': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'nice-to-have': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
  };

  const labelDisplayNames = {
    'high-leverage': 'High Leverage',
    'low-leverage-important': 'Low Leverage + Important',
    'nice-to-have': 'Nice to Have'
  };

  const formatDate = (date: number | Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTaskDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const handleAddSession = async () => {
    if (sessionDuration > 0) {
      await saveFocusSession(sessionDuration, sessionNotes, selectedDate);
      setIsAddingSession(false);
      setSessionDuration(90);
      setSessionNotes('');
      loadData(); // Refresh the stats
    }
  };

  const loadData = async () => {
    const [latestStats, tasksList, remindersList] = await Promise.all([
      getFocusSessionStats(),
      getTasks(),
      getReminders()
    ]);
    setStats(latestStats);
    setActiveTasks(tasksList.filter(task => !task.completed));
    setCompletedTasks(tasksList.filter(task => task.completed));
    setReminders(remindersList);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title.trim()) {
      await saveTask(newTask.title, newTask.description, newTask.label);
      setNewTask({ title: '', description: '', label: 'nice-to-have' });
      loadData();
    }
  };

  const handleToggleTask = async (taskId: string) => {
    await toggleTask(taskId);
    loadData();
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTask(taskId);
      loadData();
    }
  };

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReminder.trim()) {
      await saveReminder(newReminder);
      setNewReminder('');
      loadData();
    }
  };

  const handleDeleteReminder = async (reminderId: string) => {
    if (confirm('Are you sure you want to delete this reminder?')) {
      await deleteReminder(reminderId);
      loadData();
    }
  };

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const TaskItem = ({ task, showDate = false }: { task: Task; showDate?: boolean }) => (
    <div className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex items-start space-x-3 flex-grow">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => task.id && handleToggleTask(task.id)}
          className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        />
        <div className="flex-grow">
          <div className="flex items-center space-x-2">
            <h3 className={`text-sm font-medium ${
              task.completed
                ? 'text-gray-400 line-through'
                : 'text-gray-900 dark:text-white'
            }`}>
              {task.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded ${labelColors[task.label]}`}>
              {labelDisplayNames[task.label]}
            </span>
          </div>
          {task.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {task.description}
            </p>
          )}
          {showDate && task.completedAt && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Completed on {formatTaskDate(task.completedAt)}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={() => task.id && handleDeleteTask(task.id)}
        className="text-red-500 hover:text-red-700 ml-4"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Date Navigation */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousDay}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Previous Day
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatDate(selectedDate)}
          </h1>
          <button
            onClick={handleNextDay}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Next Day
          </button>
        </div>
      </div>

      {/* Focus Session Stats */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Today&apos;s Sessions</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">{stats.daily}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Week</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">{stats.weekly}</span>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">This Month</h3>
          <div className="mt-2 flex items-baseline">
            <span className="text-3xl font-semibold text-indigo-600 dark:text-indigo-400">{stats.monthly}</span>
          </div>
        </div>
      </div>

      {/* Focus Session History */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Focus Session History</h2>
        <FocusHeatMap weeks={26} />
      </div>

      {/* Add Focus Session */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Focus Session</h2>
        {!isAddingSession ? (
          <button
            onClick={() => setIsAddingSession(true)}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium"
          >
            Add New Session
          </button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={sessionDuration}
                onChange={(e) => setSessionDuration(parseInt(e.target.value))}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsAddingSession(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSession}
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium"
              >
                Save Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reminders Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reminders</h2>
        
        <form onSubmit={handleAddReminder} className="mb-6">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newReminder}
              onChange={(e) => setNewReminder(e.target.value)}
              placeholder="Add a reminder..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium"
            >
              Add
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {reminders.map(reminder => (
            <div
              key={reminder.id}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <span className="text-sm text-gray-900 dark:text-white">{reminder.text}</span>
              <button
                onClick={() => reminder.id && handleDeleteReminder(reminder.id)}
                className="text-red-500 hover:text-red-700 ml-4"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tasks</h2>
        
        <form onSubmit={handleAddTask} className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Label
            </label>
            <select
              value={newTask.label}
              onChange={(e) => setNewTask(prev => ({ 
                ...prev, 
                label: e.target.value as Task['label']
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="high-leverage">High Leverage</option>
              <option value="low-leverage-important">Low Leverage + Important</option>
              <option value="nice-to-have">Nice to Have</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (optional)
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              rows={2}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium"
          >
            Add Task
          </button>
        </form>

        <div className="space-y-4">
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Active Tasks</h3>
          {activeTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>

        {completedTasks.length > 0 && (
          <div className="space-y-4 mt-8">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Completed Tasks</h3>
            {completedTasks.map(task => (
              <TaskItem key={task.id} task={task} showDate={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 