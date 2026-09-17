import { z } from "zod";

export const goalEnum = z.enum([
  "lose_weight",
  "improve_shape",
  "be_active",
  "fix_nutrition",
  "build_habits",
]);

export const activityLevelEnum = z.enum(["low", "light", "medium", "high"]);
export const trainingLocationEnum = z.enum(["home", "gym", "mixed"]);

export const onboardingSchema = z.object({
  goals: z.array(goalEnum).min(1, "Выбери хотя бы одну цель"),
  age: z.coerce.number().int().min(14, "Похоже, возраст указан некорректно").max(90),
  heightCm: z.coerce.number().int().min(120).max(220),
  weightKg: z.coerce.number().min(35).max(250),
  // Optional — used only to personalize copy/targets, never to compute an
  // aggressive pace of loss. Left blank is fine.
  goalWeightKg: z.coerce.number().min(35).max(250).optional().nullable(),
  activityLevel: activityLevelEnum,
  trainingLocation: trainingLocationEnum,
  trainingFrequency: z.coerce.number().int().min(2).max(6),
  obstacles: z.array(z.string()).default([]),
  // If true, the UI shows the "talk to a doctor first" notice (spec section 9)
  // and the AI Coach avoids numeric nutrition/training recommendations.
  medicalFlag: z.boolean().default(false),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const OBSTACLE_OPTIONS = [
  "сладкое",
  "вечерний голод",
  "отсутствие времени",
  "отсутствие мотивации",
  "хаотичное питание",
  "пропуски тренировок",
  "переедание",
  "другое",
];

export const GOAL_LABELS: Record<string, string> = {
  lose_weight: "Снизить вес",
  improve_shape: "Улучшить форму",
  be_active: "Стать активнее",
  fix_nutrition: "Выстроить питание",
  build_habits: "Улучшить привычки",
};
