export interface Streak {
  startDate: number;  // Unix timestamp in milliseconds
  endDate: number;    // Unix timestamp in milliseconds
  count: number;
}

export interface Habit {
  id?: string;
  name: string;
  description?: string;
  isActive: boolean;
  currentStreak: number;
  lastActive?: number;  // Unix timestamp in milliseconds
  streakHistory: Streak[];
  totalSeconds: number;
  lastUpdated: number;  // Unix timestamp in milliseconds
  userId: string;
}

export interface HabitFormData {
  name: string;
  description?: string;
} 