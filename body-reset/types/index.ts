// Core domain types for BODY RESET

export type TrainingLocation = "home" | "gym" | "mixed";
export type ActivityLevel = "low" | "light" | "medium" | "high";
export type Goal =
  | "lose_weight"
  | "improve_shape"
  | "be_active"
  | "fix_nutrition"
  | "build_habits";

export interface UserProfile {
  telegramId: string | null;
  firstName: string;
  age: number | null;
  heightCm: number | null;
  initialWeightKg: number | null;
  currentWeightKg: number | null;
  goals: Goal[];
  activityLevel: ActivityLevel | null;
  trainingLocation: TrainingLocation | null;
  trainingFrequency: number; // workouts per week
  obstacles: string[];
  medicalFlag: boolean; // true if pregnancy / ED history / condition disclosed
  onboardingCompleted: boolean;
  programStartedAt: string | null; // ISO date, day 1 anchor
  notificationsEnabled: boolean;
}

export interface MealItem {
  code: string; // B1, L2, D3, S1...
  type: "breakfast" | "lunch" | "dinner" | "snack";
  title: string;
  ingredients: string[];
  portionHint: string;
  instructions: string;
}

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  notes?: string;
}

export interface Workout {
  code: string; // HOME_A, GYM_B...
  title: string;
  location: "home" | "gym";
  variant: "A" | "B" | "C";
  durationMin: number;
  difficulty: "beginner" | "intermediate";
  exercises: Exercise[];
}

export interface DayContent {
  dayNumber: number; // 1-56
  weekNumber: number; // 1-8
  meals: { breakfast: string; lunch: string; snack: string; dinner: string }; // meal codes
  workoutVariant: "A" | "B" | "C" | null; // resolved to HOME_x / GYM_x by trainingLocation
  task: string; // daily concrete task
  lessonId: string; // reference into lesson library
}

export interface WeekInfo {
  weekNumber: number;
  code: string;
  title: string;
  goal: string;
}

export interface Lesson {
  id: string;
  title: string;
  body: string; // 100-300 words
}

export interface Measurement {
  date: string; // ISO date
  weightKg?: number;
  waistCm?: number;
  hipsCm?: number;
  chestCm?: number;
  thighCm?: number;
}

export interface DailyCheckin {
  dayNumber: number;
  nutrition: boolean;
  water: boolean;
  workout: boolean;
  activity: boolean;
  sleep: boolean;
  habit: boolean;
  completedAt: string | null;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface FoodLogEntry {
  id: string;
  dayNumber: number;
  foodId: string; // FoodDbItem id, or "custom"
  name: string;
  grams: number;
  kcal: number; // computed total for this entry (grams-adjusted)
  protein: number;
  fat: number;
  carbs: number;
  createdAt: string;
}

export interface WeeklyReview {
  weekNumber: number;
  weightKg?: number;
  waistCm?: number;
  energy?: number; // 1-5
  mood?: number; // 1-5
  workoutsCompleted?: number;
  wentWell?: string;
  wasHard?: string;
}

export type SubscriptionStatus = "inactive" | "active" | "expired";

export interface Subscription {
  status: SubscriptionStatus;
  plan: "full_56";
  startedAt: string | null;
  expiresAt: string | null;
}
