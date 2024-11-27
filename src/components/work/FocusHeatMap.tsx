'use client';

import { useEffect, useState } from 'react';
import { getFocusSessionsByDateRange } from '@/lib/work-storage';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function FocusHeatMap() {
  const [sessionData, setSessionData] = useState<{ [date: string]: number }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 364); // 365 days including today
      startDate.setHours(0, 0, 0, 0);
      
      const data = await getFocusSessionsByDateRange(startDate, endDate);
      setSessionData(data);
      setLoading(false);
    };

    loadData();
  }, []);

  const getColorForCount = (count: number): string => {
    if (count === 0) return 'bg-gray-100 dark:bg-gray-700';
    if (count === 1) return 'bg-yellow-200 dark:bg-yellow-900';
    if (count <= 3) return 'bg-green-300 dark:bg-green-700';
    return 'bg-purple-500 dark:bg-purple-600';
  };

  const generateCalendarData = () => {
    const calendar: Date[][] = [];
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 364); // 365 days including today
    startDate.setHours(0, 0, 0, 0);

    let currentDate = new Date(startDate);
    let currentWeek: Date[] = [];

    // Start with empty days until we reach the first day of our range
    const firstDayOfWeek = currentDate.getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyDate = new Date(currentDate);
      emptyDate.setDate(emptyDate.getDate() - (firstDayOfWeek - i));
      currentWeek.push(emptyDate);
    }

    while (currentDate <= endDate) {
      if (currentWeek.length === 7) {
        calendar.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Fill the remaining days of the last week
    while (currentWeek.length < 7) {
      const nextDate = new Date(currentDate);
      currentWeek.push(nextDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    calendar.push(currentWeek);

    return calendar;
  };

  const formatDateKey = (date: Date) => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .split('T')[0];
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>;
  }

  const calendar = generateCalendarData();

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-2">
            {DAYS.map((day) => (
              <div key={day} className="h-3 text-xs text-gray-500 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex gap-1">
            {calendar.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((date) => {
                  const dateStr = formatDateKey(date);
                  const count = sessionData[dateStr] || 0;
                  return (
                    <div
                      key={dateStr}
                      className={`w-3 h-3 rounded-sm ${getColorForCount(count)} hover:ring-1 hover:ring-gray-400 transition-all`}
                      title={`${date.toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}: ${count} sessions`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Focus Sessions Guide:</div>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-700" />
              <span>0 sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-yellow-200 dark:bg-yellow-900" />
              <span>1 session</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-700" />
              <span>2-3 sessions</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-purple-500 dark:bg-purple-600" />
              <span>4+ sessions</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 