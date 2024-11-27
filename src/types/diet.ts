export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Macros {
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
}

export interface Meal {
  id?: string;
  mealType: MealType;
  foodItems: string[];
  calories: number;
  macros: Macros;
  timestamp: number;  // Unix timestamp in milliseconds
  notes?: string;
  userId: string;
}

export interface SavedMeal {
  id?: string;
  name: string;
  foodItems: string[];
  calories: number;
  macros: Macros;
  notes?: string;
  userId: string;
}

export interface WeightEntry {
  id?: string;
  weight: number;    // in pounds or kg
  timestamp: number; // Unix timestamp in milliseconds
  notes?: string;
  userId: string;
}

export interface MealFormData {
  mealType: MealType;
  foodItems: string[];
  calories: number;
  macros: Macros;
  notes?: string;
}

export interface SavedMealFormData {
  name: string;
  foodItems: string[];
  calories: number;
  macros: Macros;
  notes?: string;
}

export interface WeightFormData {
  weight: number;
  notes?: string;
} 