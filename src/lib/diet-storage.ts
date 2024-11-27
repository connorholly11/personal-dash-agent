import { db } from './db';
import type { Meal, MealFormData, SavedMeal, SavedMealFormData, WeightEntry, WeightFormData } from '@/types/diet';

// Temporary user ID until auth is implemented
const TEMP_USER_ID = 'temp-user';

export async function getMealsByDate(date: Date): Promise<Meal[]> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await db.meals
    .where('userId')
    .equals(TEMP_USER_ID)
    .filter(meal => 
      meal.timestamp >= startOfDay.getTime() && 
      meal.timestamp <= endOfDay.getTime()
    )
    .sortBy('timestamp');
}

export async function saveMeal(mealData: MealFormData): Promise<Meal> {
  const meal: Omit<Meal, 'id'> = {
    ...mealData,
    userId: TEMP_USER_ID,
    timestamp: Date.now()
  };

  const id = await db.meals.add(meal);
  return await db.meals.get(id) as Meal;
}

export async function deleteMeal(mealId: string): Promise<void> {
  await db.meals.delete(mealId);
}

export async function getSavedMeals(): Promise<SavedMeal[]> {
  return await db.savedMeals
    .where('userId')
    .equals(TEMP_USER_ID)
    .toArray();
}

export async function saveSavedMeal(mealData: SavedMealFormData): Promise<SavedMeal> {
  const meal: Omit<SavedMeal, 'id'> = {
    ...mealData,
    userId: TEMP_USER_ID
  };

  const id = await db.savedMeals.add(meal);
  return await db.savedMeals.get(id) as SavedMeal;
}

export async function deleteSavedMeal(mealId: string): Promise<void> {
  await db.savedMeals.delete(mealId);
}

export async function getWeightEntries(): Promise<WeightEntry[]> {
  return await db.weightEntries
    .where('userId')
    .equals(TEMP_USER_ID)
    .reverse()
    .sortBy('timestamp');
}

export async function saveWeight(weightData: WeightFormData): Promise<WeightEntry> {
  const entry: Omit<WeightEntry, 'id'> = {
    ...weightData,
    userId: TEMP_USER_ID,
    timestamp: Date.now()
  };

  const id = await db.weightEntries.add(entry);
  return await db.weightEntries.get(id) as WeightEntry;
}

export async function deleteWeight(entryId: string): Promise<void> {
  await db.weightEntries.delete(entryId);
}

export async function getDailyCalories(date: Date): Promise<number> {
  const meals = await getMealsByDate(date);
  return meals.reduce((total, meal) => total + meal.calories, 0);
}

export async function getDailySummary(date: Date) {
  const meals = await getMealsByDate(date);
  return meals.reduce((summary, meal) => ({
    calories: summary.calories + meal.calories,
    macros: {
      protein: summary.macros.protein + meal.macros.protein,
      carbs: summary.macros.carbs + meal.macros.carbs,
      fat: summary.macros.fat + meal.macros.fat
    }
  }), {
    calories: 0,
    macros: { protein: 0, carbs: 0, fat: 0 }
  });
}

export async function getWeekSummary(startDate: Date) {
  const summary = [];
  const currentDate = new Date(startDate);
  
  for (let i = 0; i < 7; i++) {
    const dailySummary = await getDailySummary(currentDate);
    const weightEntries = await db.weightEntries
      .where('userId')
      .equals(TEMP_USER_ID)
      .filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.toDateString() === currentDate.toDateString();
      })
      .toArray();

    summary.push({
      date: new Date(currentDate),
      ...dailySummary,
      weight: weightEntries[0]?.weight
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return summary;
}

export async function getWeightByDate(date: Date): Promise<WeightEntry | undefined> {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const entries = await db.weightEntries
    .where('userId')
    .equals(TEMP_USER_ID)
    .filter(entry => 
      entry.timestamp >= startOfDay.getTime() && 
      entry.timestamp <= endOfDay.getTime()
    )
    .toArray();

  return entries[0];
} 