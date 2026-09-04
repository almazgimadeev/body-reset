"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { useBodyResetStore } from "@/lib/store";
import { getDay } from "@/content/days";
import { getWeek } from "@/content/weeks";
import { getLesson } from "@/content/lessons";
import { getMeal } from "@/content/meals";
import { getWorkout } from "@/content/workouts";
import { resolveWorkoutCode } from "@/content/days";

const CHECKLIST: { key: "nutrition" | "workout" | "activity" | "water" | "sleep" | "habit"; label: string }[] = [
  { key: "nutrition", label: "Питание" },
  { key: "water", label: "Вода" },
  { key: "workout", label: "Тренировка / активность" },
  { key: "activity", label: "Шаги / движение" },
  { key: "sleep", label: "Сон" },
  { key: "habit", label: "Задание дня" },
];

export default function DayPage({ params }: { params: { dayNumber: string } }) {
  const dayNumber = Number(params.dayNumber);
  const day = getDay(dayNumber);
  const week = getWeek(day.weekNumber);
  const lesson = getLesson(day.lessonId);
  const trainingLocation = useBodyResetStore((s) => s.profile.trainingLocation);
  const checkin = useBodyResetStore((s) => s.getCheckin(dayNumber));
  const toggle = useBodyResetStore((s) => s.toggleCheckinItem);
  const [celebrate, setCelebrate] = useState(false);

  const workoutCode = resolveWorkoutCode(day.dayNumber, day.weekNumber, day.workoutVariant, trainingLocation);
  const workout = workoutCode ? getWorkout(workoutCode) : null;

  const handleToggle = (key: (typeof CHECKLIST)[number]["key"]) => {
    toggle(dayNumber, key);
    const willAllBeDone = CHECKLIST.every((c) => (c.key === key ? !checkin[key] : checkin[c.key]));
    if (willAllBeDone) setTimeout(() => setCelebrate(true), 150);
  };

  return (
    <div>
      <Header title={`День ${dayNumber} из 56`} subtitle={`Неделя ${day.weekNumber} · ${week.title}`} />

      <div className="px-5">
        <Card className="mb-4 bg-primary text-white">
          <p className="text-[13px] uppercase tracking-wide text-white/60">Задание дня</p>
          <p className="mt-1.5 text-[16px] leading-snug">{day.task}</p>
        </Card>

        <Card className="mb-4">
          <p className="mb-1 text-[13px] font-medium uppercase tracking-wide text-secondary">{lesson.title}</p>
          <p className="text-[14px] leading-relaxed text-primary">{lesson.body}</p>
        </Card>

        <Link href="/food">
          <Card className="mb-4 active:opacity-80">
            <p className="mb-2 text-[15px] font-medium text-primary">Питание сегодня</p>
            <div className="flex flex-col gap-1 text-[13px] text-secondary">
              <span>Завтрак — {getMeal(day.meals.breakfast).title}</span>
              <span>Обед — {getMeal(day.meals.lunch).title}</span>
              <span>Перекус — {getMeal(day.meals.snack).title}</span>
              <span>Ужин — {getMeal(day.meals.dinner).title}</span>
            </div>
          </Card>
        </Link>

        <Link href="/workout">
          <Card className="mb-4 active:opacity-80">
            <p className="mb-1 text-[15px] font-medium text-primary">
              {workout ? workout.title : "Сегодня — день восстановления"}
            </p>
            <p className="text-[13px] text-secondary">
              {workout
                ? `${workout.durationMin} мин · ${workout.difficulty === "beginner" ? "Beginner" : "Intermediate"}`
                : "Лёгкая активность / прогулка — по желанию"}
            </p>
          </Card>
        </Link>

        <Card className="mb-24">
          <p className="mb-3 text-[15px] font-medium text-primary">Чек-лист дня</p>
          <div className="flex flex-col gap-1">
            {CHECKLIST.map((c) => (
              <Checkbox key={c.key} checked={checkin[c.key]} onChange={() => handleToggle(c.key)} label={c.label} />
            ))}
          </div>
        </Card>
      </div>

      <Modal open={celebrate} onClose={() => setCelebrate(false)}>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-4xl">✓</div>
          <div className="text-xl font-semibold">DAY {dayNumber} COMPLETE</div>
          <p className="text-[14px] text-secondary">Ты завершила День {dayNumber}.</p>
          <Button fullWidth className="mt-2" onClick={() => setCelebrate(false)}>
            ЗАКРЫТЬ
          </Button>
        </div>
      </Modal>
    </div>
  );
}
