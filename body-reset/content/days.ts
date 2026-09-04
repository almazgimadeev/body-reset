import { DayContent, TrainingLocation } from "@/types";
import { DAILY_TASKS } from "./tasks";
import { LESSONS } from "./lessons";

// Raw schedule transcribed from the program spec (section 66):
// [day, week, breakfastCode, lunchCode, snackCode, dinnerCode, workoutVariant]
type RawDay = [number, number, string, string, string, string, "A" | "B" | "C" | null];

const RAW_SCHEDULE: RawDay[] = [
  // Week 1 — START
  [1, 1, "B1", "L1", "S1", "D1", "A"],
  [2, 1, "B2", "L2", "S2", "D2", null],
  [3, 1, "B3", "L3", "S3", "D3", "B"],
  [4, 1, "B4", "L4", "S1", "D4", null],
  [5, 1, "B5", "L5", "S2", "D1", "C"],
  [6, 1, "B1", "L6", "S3", "D5", null],
  [7, 1, "B2", "L7", "S4", "D2", null],
  // Week 2 — ROUTINE
  [8, 2, "B3", "L1", "S1", "D3", "A"],
  [9, 2, "B4", "L2", "S2", "D1", null],
  [10, 2, "B5", "L3", "S3", "D2", "B"],
  [11, 2, "B1", "L4", "S1", "D4", null],
  [12, 2, "B2", "L5", "S2", "D1", "C"],
  [13, 2, "B3", "L6", "S4", "D5", null],
  [14, 2, "B4", "L7", "S3", "D2", null],
  // Week 3 — CONSISTENCY
  [15, 3, "B5", "L1", "S1", "D1", "A"],
  [16, 3, "B1", "L2", "S2", "D2", null],
  [17, 3, "B2", "L3", "S3", "D3", "B"],
  [18, 3, "B3", "L4", "S4", "D4", null],
  [19, 3, "B4", "L5", "S1", "D1", "C"],
  [20, 3, "B5", "L6", "S2", "D5", null],
  [21, 3, "B1", "L7", "S3", "D2", null],
  // Week 4 — BODY SHAPE
  [22, 4, "B2", "L1", "S1", "D3", "A"],
  [23, 4, "B3", "L2", "S2", "D1", null],
  [24, 4, "B4", "L3", "S3", "D2", "B"],
  [25, 4, "B5", "L4", "S4", "D4", null],
  [26, 4, "B1", "L5", "S1", "D1", "C"],
  [27, 4, "B2", "L6", "S2", "D5", null],
  [28, 4, "B3", "L7", "S3", "D2", null],
  // Week 5 — NO MORE RESTARTS
  [29, 5, "B4", "L1", "S1", "D1", "A"],
  [30, 5, "B5", "L2", "S2", "D2", null],
  [31, 5, "B1", "L3", "S3", "D3", "B"],
  [32, 5, "B2", "L4", "S4", "D4", null],
  [33, 5, "B3", "L5", "S1", "D1", "C"],
  [34, 5, "B4", "L6", "S2", "D5", null],
  [35, 5, "B5", "L7", "S3", "D2", null],
  // Week 6 — PROGRESS
  [36, 6, "B1", "L1", "S1", "D3", "A"],
  [37, 6, "B2", "L2", "S2", "D1", null],
  [38, 6, "B3", "L3", "S3", "D2", "B"],
  [39, 6, "B4", "L4", "S4", "D4", null],
  [40, 6, "B5", "L5", "S1", "D1", "C"],
  [41, 6, "B1", "L6", "S2", "D5", null],
  [42, 6, "B2", "L7", "S3", "D2", null],
  // Week 7 — VISUAL CHANGE
  [43, 7, "B3", "L1", "S1", "D1", "A"],
  [44, 7, "B4", "L2", "S2", "D2", null],
  [45, 7, "B5", "L3", "S3", "D3", "B"],
  [46, 7, "B1", "L4", "S4", "D4", null],
  [47, 7, "B2", "L5", "S1", "D1", "C"],
  [48, 7, "B3", "L6", "S2", "D5", null],
  [49, 7, "B4", "L7", "S3", "D2", null],
  // Week 8 — NEW NORMAL
  [50, 8, "B5", "L1", "S1", "D3", "A"],
  [51, 8, "B1", "L2", "S2", "D1", null],
  [52, 8, "B2", "L3", "S3", "D2", "B"],
  [53, 8, "B3", "L4", "S4", "D4", null],
  [54, 8, "B4", "L5", "S1", "D1", "C"],
  [55, 8, "B5", "L6", "S2", "D5", null],
  [56, 8, "B1", "L7", "S3", "D2", null],
];

const REVIEW_LESSON_ID = "weekly_review_meaning";
const ROTATING_LESSON_IDS = LESSONS.map((l) => l.id).filter((id) => id !== REVIEW_LESSON_ID);

function lessonForDay(dayNumber: number): string {
  if (dayNumber % 7 === 0) return REVIEW_LESSON_ID;
  const idx = (dayNumber - 1) % ROTATING_LESSON_IDS.length;
  return ROTATING_LESSON_IDS[idx];
}

export const DAYS: DayContent[] = RAW_SCHEDULE.map(([day, week, b, l, s, d, variant]) => ({
  dayNumber: day,
  weekNumber: week,
  meals: { breakfast: b, lunch: l, snack: s, dinner: d },
  workoutVariant: variant,
  task: DAILY_TASKS[day],
  lessonId: lessonForDay(day),
}));

export function getDay(dayNumber: number): DayContent {
  const day = DAYS.find((d) => d.dayNumber === dayNumber);
  if (!day) throw new Error(`Unknown day: ${dayNumber}`);
  return day;
}

// Resolves a day's workout variant (A/B/C) into an actual workout code
// (HOME_A, GYM_B, ...) based on the user's chosen training location.
// "mixed" alternates by week parity: odd weeks at home, even weeks in the gym.
export function resolveWorkoutCode(
  dayNumber: number,
  weekNumber: number,
  variant: "A" | "B" | "C" | null,
  location: TrainingLocation | null
): string | null {
  if (!variant) return null;
  if (location === "gym") return `GYM_${variant}`;
  if (location === "mixed") {
    const isOddWeek = weekNumber % 2 === 1;
    return isOddWeek ? `HOME_${variant}` : `GYM_${variant}`;
  }
  // default / "home" / not yet chosen
  return `HOME_${variant}`;
}
