import { WeekInfo } from "@/types";

export const WEEKS: WeekInfo[] = [
  { weekNumber: 1, code: "START", title: "Старт", goal: "Войти в систему." },
  { weekNumber: 2, code: "ROUTINE", title: "Ритм", goal: "Создать ритм." },
  { weekNumber: 3, code: "CONSISTENCY", title: "Постоянство", goal: "Не зависеть от мотивации." },
  { weekNumber: 4, code: "BODY_SHAPE", title: "Форма тела", goal: "Больше движения и силовых тренировок." },
  { weekNumber: 5, code: "NO_RESTARTS", title: "Без перезапусков", goal: "Научиться возвращаться после ошибок." },
  { weekNumber: 6, code: "PROGRESS", title: "Прогресс", goal: "Отслеживать реальные изменения." },
  { weekNumber: 7, code: "VISUAL_CHANGE", title: "Заметные изменения", goal: "Закрепить систему." },
  { weekNumber: 8, code: "NEW_NORMAL", title: "Новая норма", goal: "Превратить программу в образ жизни." },
];

export function getWeek(weekNumber: number): WeekInfo {
  const w = WEEKS.find((w) => w.weekNumber === weekNumber);
  if (!w) throw new Error(`Unknown week: ${weekNumber}`);
  return w;
}
