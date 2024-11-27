'use client';

import { useState, useEffect } from 'react';
import { Meal, SavedMeal } from '@/types/diet';
import { getMealsByDate, getSavedMeals } from '@/lib/diet-storage';
import MealCard from '@/components/diet/MealCard';
import NewMealForm from '@/components/diet/NewMealForm';
import SavedMealCard from '@/components/diet/SavedMealCard';
import WeightTracker from '@/components/diet/WeightTracker';
import MacroSummary from '@/components/diet/MacroSummary';
import WeeklyChart from '@/components/diet/WeeklyChart';

export default function DietPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSavedMeals, setShowSavedMeals] = useState(false);

  const loadData = async () => {
    const mealsList = await getMealsByDate(selectedDate);
    const savedMealsList = await getSavedMeals();
    setMeals(mealsList.sort((a, b) => b.timestamp - a.timestamp));
    setSavedMeals(savedMealsList);
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDateChange = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + offset);
    setSelectedDate(newDate);
  };

  const getStartOfWeek = (date: Date) => {
    const newDate = new Date(date);
    const day = newDate.getDay();
    newDate.setDate(newDate.getDate() - day);
    return newDate;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Diet Tracker</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleDateChange(-1)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Previous Day
            </button>
            <span className="text-gray-700 dark:text-gray-300">
              {formatDate(selectedDate)}
            </span>
            <button
              onClick={() => handleDateChange(1)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Next Day
            </button>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <NewMealForm onSave={loadData} />
          </div>
          <button
            onClick={() => setShowSavedMeals(!showSavedMeals)}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md text-sm font-medium"
          >
            {showSavedMeals ? 'Hide Saved Meals' : 'Show Saved Meals'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        {/* Left Column - Weight and Macros */}
        <div className="space-y-6">
          <WeightTracker date={selectedDate} onUpdate={loadData} />
          <MacroSummary date={selectedDate} />
        </div>

        {/* Middle Column - Meals */}
        <div className="lg:col-span-2 space-y-6">
          {meals.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No meals logged for this day. Add your first meal to get started!
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onUpdate={loadData}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Weekly Overview */}
      <WeeklyChart startDate={getStartOfWeek(selectedDate)} />

      {/* Saved Meals Section */}
      {showSavedMeals && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Saved Meals</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {savedMeals.map((meal) => (
              <SavedMealCard
                key={meal.id}
                meal={meal}
                onUse={(savedMeal) => {
                  // Handle using a saved meal
                  const mealData = {
                    mealType: 'snack',
                    foodItems: savedMeal.foodItems,
                    calories: savedMeal.calories,
                    macros: savedMeal.macros,
                    notes: savedMeal.notes
                  };
                  // saveMeal(mealData);
                  loadData();
                }}
                onUpdate={loadData}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 