import { Workout } from "@/types";

export const WORKOUTS: Record<string, Workout> = {
  HOME_A: {
    code: "HOME_A",
    title: "Дом · Тренировка A",
    location: "home",
    variant: "A",
    durationMin: 35,
    difficulty: "beginner",
    exercises: [
      { name: "Приседания", sets: "3", reps: "10–15", rest: "60 сек" },
      { name: "Ягодичный мостик", sets: "3", reps: "12–15", rest: "45 сек" },
      { name: "Выпады назад", sets: "3", reps: "8–12 на каждую ногу", rest: "60 сек" },
      { name: "Румынская тяга с рюкзаком", sets: "3", reps: "10–15", rest: "60 сек" },
      { name: "Отведение ноги назад (ягодичные)", sets: "3", reps: "12–15 на каждую ногу", rest: "45 сек" },
      { name: "Планка", sets: "3", reps: "20–40 сек", rest: "30 сек" },
    ],
  },
  HOME_B: {
    code: "HOME_B",
    title: "Дом · Тренировка B",
    location: "home",
    variant: "B",
    durationMin: 35,
    difficulty: "beginner",
    exercises: [
      { name: "Отжимания с колен или от опоры", sets: "3", reps: "8–12", rest: "60 сек" },
      { name: "Тяга рюкзака в наклоне", sets: "3", reps: "10–15", rest: "60 сек" },
      { name: "Жим над головой (с бутылками/гантелями)", sets: "3", reps: "10–15", rest: "60 сек" },
      { name: "Разведение рук в стороны", sets: "3", reps: "12–15", rest: "45 сек" },
      { name: "Dead bug (мёртвый жук)", sets: "3", reps: "8–12 на сторону", rest: "30 сек" },
      { name: "Планка", sets: "3", reps: "20–40 сек", rest: "30 сек" },
    ],
  },
  HOME_C: {
    code: "HOME_C",
    title: "Дом · Тренировка C",
    location: "home",
    variant: "C",
    durationMin: 35,
    difficulty: "beginner",
    exercises: [
      { name: "Приседания", sets: "3", reps: "10–15", rest: "60 сек" },
      { name: "Румынская тяга", sets: "3", reps: "10–15", rest: "60 сек" },
      { name: "Отжимания", sets: "3", reps: "8–12", rest: "60 сек" },
      { name: "Тяга рюкзака в наклоне", sets: "3", reps: "10–15", rest: "60 сек" },
      { name: "Ягодичный мостик", sets: "3", reps: "12–15", rest: "45 сек" },
      { name: "Dead bug (мёртвый жук)", sets: "3", reps: "8–12 на сторону", rest: "30 сек" },
    ],
  },
  GYM_A: {
    code: "GYM_A",
    title: "Зал · Тренировка A",
    location: "gym",
    variant: "A",
    durationMin: 45,
    difficulty: "intermediate",
    exercises: [
      { name: "Приседания / жим ногами", sets: "3", reps: "8–12", rest: "90 сек" },
      { name: "Румынская тяга", sets: "3", reps: "8–12", rest: "90 сек" },
      { name: "Хип-траст (ягодичный мост со штангой)", sets: "3", reps: "8–12", rest: "90 сек" },
      { name: "Сгибание ног в тренажёре", sets: "3", reps: "10–15", rest: "60 сек" },
      { name: "Отведение бедра в тренажёре", sets: "3", reps: "12–15", rest: "45 сек" },
      { name: "Планка", sets: "3", reps: "—", rest: "30 сек" },
    ],
  },
  GYM_B: {
    code: "GYM_B",
    title: "Зал · Тренировка B",
    location: "gym",
    variant: "B",
    durationMin: 45,
    difficulty: "intermediate",
    exercises: [
      { name: "Тяга верхнего блока", sets: "3", reps: "8–12", rest: "90 сек" },
      { name: "Тяга блока сидя", sets: "3", reps: "8–12", rest: "90 сек" },
      { name: "Жим гантелей", sets: "3", reps: "8–12", rest: "90 сек" },
      { name: "Разведение гантелей в стороны", sets: "3", reps: "12–15", rest: "45 сек" },
      { name: "Подъём на бицепс", sets: "2", reps: "10–15", rest: "45 сек" },
      { name: "Разгибание на трицепс", sets: "2", reps: "10–15", rest: "45 сек" },
      { name: "Dead bug (мёртвый жук)", sets: "3", reps: "—", rest: "30 сек" },
    ],
  },
  GYM_C: {
    code: "GYM_C",
    title: "Зал · Тренировка C",
    location: "gym",
    variant: "C",
    durationMin: 45,
    difficulty: "intermediate",
    exercises: [
      { name: "Жим ногами", sets: "3", reps: "8–12", rest: "90 сек" },
      { name: "Хип-траст", sets: "3", reps: "8–12", rest: "90 сек" },
      { name: "Выпады", sets: "3", reps: "8–12 на каждую ногу", rest: "60 сек" },
      { name: "Тяга блока сидя", sets: "3", reps: "8–12", rest: "90 сек" },
      { name: "Жим гантелей", sets: "3", reps: "8–12", rest: "90 сек" },
      { name: "Пресс (по выбору)", sets: "3", reps: "—", rest: "30 сек" },
    ],
  },
};

export function getWorkout(code: string): Workout {
  const w = WORKOUTS[code];
  if (!w) throw new Error(`Unknown workout code: ${code}`);
  return w;
}

// Section 27 — progression principle shown in the Workout tab.
export const PROGRESSION_NOTE =
  "Если ты уверенно выполняешь верхнюю границу повторений с хорошей техникой — в следующий раз можно немного увеличить нагрузку (вес, повторения или темп). Не обязательно расти каждую неделю. Главный принцип: постоянство важнее идеальности.";
