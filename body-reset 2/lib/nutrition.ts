import { UserProfile } from "@/types";

// Mifflin-St Jeor equation — a standard, widely-used BMR estimate.
// This is deliberately an approximate RANGE to stay within, not a precise
// daily prescription, and it never converts food logged into "kg you still
// need to lose" — see the note in app/(main)/food/page.tsx for why.
const ACTIVITY_MULTIPLIER: Record<string, number> = {
  low: 1.2,
  light: 1.375,
  medium: 1.55,
  high: 1.725,
};

const SAFE_FLOOR_KCAL = 1200; // never suggest a target below this without professional guidance

export interface CalorieRange {
  min: number;
  max: number;
  maintenance: number;
  hasEnoughData: boolean;
}

export interface DailyTargets {
  calories: number; // single target point (midpoint of the safe range) — "Расчётная цель"
  proteinG: number;
  fatG: number;
  carbsG: number;
  range: CalorieRange;
  hasEnoughData: boolean;
}

export function estimateDailyCalorieRange(profile: UserProfile): CalorieRange {
  const { age, heightCm, currentWeightKg, activityLevel, goals, medicalFlag } = profile;

  if (!age || !heightCm || !currentWeightKg || !activityLevel) {
    return { min: 0, max: 0, maintenance: 0, hasEnoughData: false };
  }

  // Mifflin-St Jeor for women (the app's primary audience).
  const bmr = 10 * currentWeightKg + 6.25 * heightCm - 5 * age - 161;
  const maintenance = Math.round(bmr * (ACTIVITY_MULTIPLIER[activityLevel] ?? 1.375));

  const wantsWeightLoss = goals.includes("lose_weight") && !medicalFlag;

  if (!wantsWeightLoss) {
    // Maintenance range — no deficit framing at all.
    return {
      min: Math.max(SAFE_FLOOR_KCAL, Math.round(maintenance * 0.95)),
      max: Math.round(maintenance * 1.05),
      maintenance,
      hasEnoughData: true,
    };
  }

  // Moderate deficit (roughly 300–500 kcal/day) — never below the safe floor.
  const min = Math.max(SAFE_FLOOR_KCAL, maintenance - 500);
  const max = Math.max(min + 100, maintenance - 300);

  return { min, max, maintenance, hasEnoughData: true };
}

// Full macro targets ("Расчётная цель" — spec explicitly requires this is
// shown as an editable estimate, never as a medical prescription).
// Protein: evidence-based 1.6–2.2 g/kg range for a moderate-deficit goal,
// 1.4 g/kg for maintenance/other goals. Fat: ~27% of calories. Carbs: the
// remainder. `manualOverride` (from profile.customTargets) always wins —
// the user can edit any of these in Profile.
export function estimateDailyTargets(profile: UserProfile): DailyTargets {
  const range = estimateDailyCalorieRange(profile);
  if (!range.hasEnoughData || !profile.currentWeightKg) {
    return { calories: 0, proteinG: 0, fatG: 0, carbsG: 0, range, hasEnoughData: false };
  }

  const override = profile.customTargets;
  const calories = override?.calories ?? Math.round((range.min + range.max) / 2);

  const wantsWeightLoss = profile.goals.includes("lose_weight") && !profile.medicalFlag;
  const proteinPerKg = wantsWeightLoss ? 1.8 : 1.4;
  const proteinG = override?.proteinG ?? Math.round(profile.currentWeightKg * proteinPerKg);

  const fatG = override?.fatG ?? Math.round((calories * 0.27) / 9);

  const remainingKcal = Math.max(0, calories - proteinG * 4 - fatG * 9);
  const carbsG = override?.carbsG ?? Math.round(remainingKcal / 4);

  return { calories, proteinG, fatG, carbsG, range, hasEnoughData: true };
}
