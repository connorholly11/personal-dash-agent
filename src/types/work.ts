export interface FocusSession {
  id?: string;
  startTime: number;
  endTime: number;
  duration: number; // in minutes
  notes?: string;
  userId: string;
}

export interface Task {
  id?: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: number;
  completedAt?: number;
  userId: string;
  label: 'high-leverage' | 'low-leverage-important' | 'nice-to-have';
}

export interface FocusSessionStats {
  daily: number;
  weekly: number;
  monthly: number;
}

export interface Reminder {
  id?: string;
  text: string;
  userId: string;
  createdAt: number;
} 