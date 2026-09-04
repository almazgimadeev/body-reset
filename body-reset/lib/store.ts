"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  UserProfile,
  DailyCheckin,
  Measurement,
  AIChatMessage,
  Subscription,
  WeeklyReview,
} from "@/types";
import { OnboardingInput } from "./validation/onboarding";

// Client-side app state for demo / local-first mode. This is what the app
// runs on by default (NEXT_PUBLIC_DEMO_MODE=true or no Supabase configured).
// In production, the same shape is mirrored into Supabase — see the API
// route stubs in app/api/* and database/schema.sql. Persisting here to
// localStorage is safe: this is a real app running in the user's own
// browser/Telegram client, not an in-chat artifact sandbox.

const emptyProfile: UserProfile = {
  telegramId: null,
  firstName: "",
  age: null,
  heightCm: null,
  initialWeightKg: null,
  currentWeightKg: null,
  goals: [],
  activityLevel: null,
  trainingLocation: null,
  trainingFrequency: 3,
  obstacles: [],
  medicalFlag: false,
  onboardingCompleted: false,
  programStartedAt: null,
  notificationsEnabled: true,
};

const emptySubscription: Subscription = {
  status: "inactive",
  plan: "full_56",
  startedAt: null,
  expiresAt: null,
};

const emptyCheckin = (dayNumber: number): DailyCheckin => ({
  dayNumber,
  nutrition: false,
  water: false,
  workout: false,
  activity: false,
  sleep: false,
  habit: false,
  completedAt: null,
});

interface BodyResetState {
  profile: UserProfile;
  subscription: Subscription;
  checkins: Record<number, DailyCheckin>;
  measurements: Measurement[];
  aiMessages: AIChatMessage[];
  weeklyReviews: Record<number, WeeklyReview>;
  mealSwaps: Record<string, string>; // "dayNumber:mealType" -> replacement meal code
  eatenMeals: Record<string, boolean>; // "dayNumber:mealType" -> eaten
  progressPhotos: Record<number, { front?: string; side?: string; back?: string }>; // keyed by milestone day
  completedDayNumber: number; // Day 56 completion celebration already shown

  setFirstName: (name: string) => void;
  setTelegramId: (id: string | null) => void;
  completeOnboarding: (data: OnboardingInput) => void;
  currentDayNumber: () => number;
  getCheckin: (dayNumber: number) => DailyCheckin;
  toggleCheckinItem: (dayNumber: number, key: keyof Omit<DailyCheckin, "dayNumber" | "completedAt">) => void;
  isDayFullyComplete: (dayNumber: number) => boolean;
  streak: () => number;
  addMeasurement: (m: Measurement) => void;
  addAiMessage: (msg: AIChatMessage) => void;
  submitWeeklyReview: (review: WeeklyReview) => void;
  setMealSwap: (dayNumber: number, mealType: string, newCode: string) => void;
  toggleMealEaten: (dayNumber: number, mealType: string) => void;
  setProgressPhoto: (milestoneDay: number, type: "front" | "side" | "back", dataUrl: string) => void;
  activateSubscriptionMock: () => void;
  resetAll: () => void;
}

export const useBodyResetStore = create<BodyResetState>()(
  persist(
    (set, get) => ({
      profile: emptyProfile,
      subscription: emptySubscription,
      checkins: {},
      measurements: [],
      aiMessages: [],
      weeklyReviews: {},
      mealSwaps: {},
      eatenMeals: {},
      progressPhotos: {},
      completedDayNumber: 0,

      setFirstName: (name) => set((s) => ({ profile: { ...s.profile, firstName: name } })),
      setTelegramId: (id) => set((s) => ({ profile: { ...s.profile, telegramId: id } })),

      completeOnboarding: (data) =>
        set((s) => ({
          profile: {
            ...s.profile,
            age: data.age,
            heightCm: data.heightCm,
            initialWeightKg: data.weightKg,
            currentWeightKg: data.weightKg,
            goals: data.goals,
            activityLevel: data.activityLevel,
            trainingLocation: data.trainingLocation,
            trainingFrequency: data.trainingFrequency,
            obstacles: data.obstacles,
            medicalFlag: data.medicalFlag,
            onboardingCompleted: true,
            programStartedAt: s.profile.programStartedAt ?? new Date().toISOString(),
          },
          measurements:
            s.measurements.length === 0
              ? [{ date: new Date().toISOString(), weightKg: data.weightKg }]
              : s.measurements,
        })),

      currentDayNumber: () => {
        const started = get().profile.programStartedAt;
        if (!started) return 1;
        const diffMs = Date.now() - new Date(started).getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return Math.min(56, Math.max(1, diffDays + 1));
      },

      getCheckin: (dayNumber) => get().checkins[dayNumber] ?? emptyCheckin(dayNumber),

      toggleCheckinItem: (dayNumber, key) =>
        set((s) => {
          const current = s.checkins[dayNumber] ?? emptyCheckin(dayNumber);
          const updated: DailyCheckin = { ...current, [key]: !current[key] };
          const allDone =
            updated.nutrition && updated.water && updated.workout && updated.activity && updated.sleep && updated.habit;
          updated.completedAt = allDone ? updated.completedAt ?? new Date().toISOString() : null;
          return { checkins: { ...s.checkins, [dayNumber]: updated } };
        }),

      isDayFullyComplete: (dayNumber) => !!get().checkins[dayNumber]?.completedAt,

      streak: () => {
        const { checkins } = get();
        const today = get().currentDayNumber();
        let streak = 0;
        for (let d = today; d >= 1; d--) {
          if (checkins[d]?.completedAt) streak++;
          else break;
        }
        return streak;
      },

      addMeasurement: (m) =>
        set((s) => ({
          measurements: [...s.measurements, m],
          profile: m.weightKg ? { ...s.profile, currentWeightKg: m.weightKg } : s.profile,
        })),

      addAiMessage: (msg) => set((s) => ({ aiMessages: [...s.aiMessages, msg] })),

      submitWeeklyReview: (review) =>
        set((s) => ({ weeklyReviews: { ...s.weeklyReviews, [review.weekNumber]: review } })),

      setMealSwap: (dayNumber, mealType, newCode) =>
        set((s) => ({ mealSwaps: { ...s.mealSwaps, [`${dayNumber}:${mealType}`]: newCode } })),

      setProgressPhoto: (milestoneDay, type, dataUrl) =>
        set((s) => ({
          progressPhotos: {
            ...s.progressPhotos,
            [milestoneDay]: { ...s.progressPhotos[milestoneDay], [type]: dataUrl },
          },
        })),

      toggleMealEaten: (dayNumber, mealType) =>
        set((s) => {
          const key = `${dayNumber}:${mealType}`;
          const eatenMeals = { ...s.eatenMeals, [key]: !s.eatenMeals[key] };
          const mealTypes = ["breakfast", "lunch", "snack", "dinner"];
          const allEaten = mealTypes.every((t) => eatenMeals[`${dayNumber}:${t}`]);
          const currentCheckin = s.checkins[dayNumber] ?? emptyCheckin(dayNumber);
          const updatedCheckin: DailyCheckin = { ...currentCheckin, nutrition: allEaten };
          const stillAllDone =
            updatedCheckin.nutrition &&
            updatedCheckin.water &&
            updatedCheckin.workout &&
            updatedCheckin.activity &&
            updatedCheckin.sleep &&
            updatedCheckin.habit;
          updatedCheckin.completedAt = stillAllDone ? updatedCheckin.completedAt ?? new Date().toISOString() : null;
          return { eatenMeals, checkins: { ...s.checkins, [dayNumber]: updatedCheckin } };
        }),

      activateSubscriptionMock: () =>
        set(() => ({
          subscription: {
            status: "active",
            plan: "full_56",
            startedAt: new Date().toISOString(),
            expiresAt: null,
          },
        })),

      resetAll: () =>
        set(() => ({
          profile: emptyProfile,
          subscription: emptySubscription,
          checkins: {},
          measurements: [],
          aiMessages: [],
          weeklyReviews: {},
          mealSwaps: {},
          eatenMeals: {},
          progressPhotos: {},
          completedDayNumber: 0,
        })),
    }),
    { name: "body-reset-storage" }
  )
);
