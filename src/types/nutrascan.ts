export interface User {
  id: string;
  username: string;
}

export interface ProfileForm {
  name: string;
  birthDate: string;
  height: string;
  weight: string;
  gender: string;
  goal: string;
  activity: string;
  abdomen: string;
  loveHandles: string;
  upperBody: string;
  lowerBody: string;
  faceNeck: string;
  avatar?: string;
}

export interface WeightEntry {
  weight: number;
  date: string;
  timestamp: number;
}

export interface ProfileData {
  inputs: ProfileForm & { estimatedBF?: number; tdee?: number };
  targets: Targets;
  weightHistory: WeightEntry[];
  strategyRedoDate?: number;
}

export interface Targets {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem {
  name: string;
  weight: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealTotals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AnalysisResult {
  items: FoodItem[];
  totals: MealTotals;
  mealType?: MealType;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export const mealTypeLabels: Record<MealType, string> = {
  breakfast: "Café da manhã",
  lunch: "Almoço",
  dinner: "Janta",
  snack: "Lanche",
};

export const mealTypeEmojis: Record<MealType, string> = {
  breakfast: "☕",
  lunch: "🍽️",
  dinner: "🌙",
  snack: "🍎",
};

export interface DiaryEntry {
  id: number;
  time: string;
  date: string;
  totals: MealTotals;
  items: FoodItem[];
  timestamp: number;
  mealType?: MealType;
}

export type TabId = "home" | "scanner" | "nutra_ia" | "diary" | "profile";
