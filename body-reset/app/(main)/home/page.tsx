"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Scale, Ruler } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Button } from "@/components/ui/Button";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { Modal } from "@/components/ui/Modal";
import { useBodyResetStore } from "@/lib/store";
import { getDay } from "@/content/days";
import { getWeek } from "@/content/weeks";
import { estimateDailyTargets } from "@/lib/nutrition";

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Доброй ночи";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
}

const CHECKLIST_LABELS: { key: "nutrition" | "workout" | "activity" | "water" | "sleep" | "habit"; label: string }[] = [
  { key: "nutrition", label: "Питание" },
  { key: "workout", label: "Тренировка" },
  { key: "activity", label: "Активность" },
  { key: "water", label: "Вода" },
  { key: "sleep", label: "Сон" },
  { key: "habit", label: "Задание дня" },
];

export default function HomePage() {
  const router = useRouter();
  const firstName = useBodyResetStore((s) => s.profile.firstName) || "Богиня";
  const currentDayNumber = useBodyResetStore((s) => s.currentDayNumber());
  const checkin = useBodyResetStore((s) => s.getCheckin(currentDayNumber));
  const streak = useBodyResetStore((s) => s.streak());
  const measurements = useBodyResetStore((s) => s.measurements);
  const initialWeight = useBodyResetStore((s) => s.profile.initialWeightKg);
  const currentWeight = useBodyResetStore((s) => s.profile.currentWeightKg);
  const profile = useBodyResetStore((s) => s.profile);
  const foodLogToday = useBodyResetStore((s) => s.foodLog[currentDayNumber] ?? []);
  const [celebrate, setCelebrate] = useState(false);

  const targets = estimateDailyTargets(profile);
  const consumed = foodLogToday.reduce(
    (acc, e) => ({
      kcal: acc.kcal + e.kcal,
      protein: acc.protein + e.protein,
      fat: acc.fat + e.fat,
      carbs: acc.carbs + e.carbs,
    }),
    { kcal: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const day = getDay(currentDayNumber);
  const week = getWeek(day.weekNumber);
  const pct = Math.round((currentDayNumber / 56) * 100);

  const lastWaist = useMemo(() => {
    const withWaist = [...measurements].reverse().find((m) => m.waistCm !== undefined);
    return withWaist?.waistCm;
  }, [measurements]);

  const weightDelta = initialWeight && currentWeight ? currentWeight - initialWeight : null;

  const doneCount = CHECKLIST_LABELS.filter((c) => checkin[c.key]).length;
  const allDone = doneCount === CHECKLIST_LABELS.length;

  return (
    <div className="px-5 pt-6">
      <div className="flex items-baseline justify-between">
        <span className="text-[13px] font-medium uppercase tracking-wide text-accent">BODY RESET</span>
        {streak > 0 && <StreakBadge days={streak} />}
      </div>
      <h1 className="mt-1 text-[22px] font-semibold text-primary">
        {greeting()}, {firstName}
      </h1>

      <div className="mt-4 flex items-center justify-between text-[13px] text-secondary">
        <span>
          День {currentDayNumber} / 56 · {week.title}
        </span>
        <span>{pct}%</span>
      </div>
      <ProgressBar value={pct} className="mt-2" />

      <Card className="mt-5">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-[15px] font-medium text-primary">Сегодня</p>
          <span className="text-[13px] text-secondary">
            {doneCount}/{CHECKLIST_LABELS.length}
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          {CHECKLIST_LABELS.map((c) => (
            <div key={c.key} className="flex items-center gap-2.5 text-[14px]">
              <span>{checkin[c.key] ? "✓" : "○"}</span>
              <span className={checkin[c.key] ? "text-secondary line-through" : "text-primary"}>{c.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {targets.hasEnoughData && (
        <Card className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[15px] font-medium text-primary">Питание сегодня</p>
            <span className="text-[12px] text-secondary">
              {Math.round(consumed.kcal)} / {targets.calories} ккал
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            {[
              { label: "Калории", value: consumed.kcal, target: targets.calories, unit: "ккал" },
              { label: "Белок", value: consumed.protein, target: targets.proteinG, unit: "г" },
              { label: "Жиры", value: consumed.fat, target: targets.fatG, unit: "г" },
              { label: "Углеводы", value: consumed.carbs, target: targets.carbsG, unit: "г" },
            ].map((m) => (
              <div key={m.label}>
                <div className="mb-1 flex items-center justify-between text-[11px] text-secondary">
                  <span>{m.label}</span>
                  <span>
                    {Math.round(m.value)} / {m.target} {m.unit}
                  </span>
                </div>
                <ProgressBar value={m.target ? (m.value / m.target) * 100 : 0} />
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-secondary">
            Ориентир, не строгая норма — подробнее и с возможностью изменить в «Питании» и «Профиле».
          </p>
        </Card>
      )}

      <Button
        fullWidth
        className="mt-4"
        onClick={() => {
          if (allDone) setCelebrate(true);
          router.push(`/day/${currentDayNumber}`);
        }}
      >
        {allDone ? "ДЕНЬ ЗАВЕРШЁН · ПОСМОТРЕТЬ" : "ПРОДОЛЖИТЬ ДЕНЬ"}
      </Button>

      <p className="mt-5 mb-2 text-[15px] font-medium text-primary">Твой прогресс</p>
      <div className="flex gap-3">
        <Card className="flex-1">
          <div className="flex items-center gap-1.5 text-secondary">
            <Scale size={14} />
            <span className="text-[13px]">Вес</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-semibold text-primary">{currentWeight ? `${currentWeight} кг` : "—"}</span>
            {weightDelta !== null && weightDelta !== 0 && (
              <span className={weightDelta < 0 ? "text-[13px] text-success" : "text-[13px] text-secondary"}>
                {weightDelta > 0 ? "+" : ""}
                {weightDelta.toFixed(1)} кг
              </span>
            )}
          </div>
        </Card>
        <Card className="flex-1">
          <div className="flex items-center gap-1.5 text-secondary">
            <Ruler size={14} />
            <span className="text-[13px]">Талия</span>
          </div>
          <div className="mt-1 text-xl font-semibold text-primary">{lastWaist ? `${lastWaist} см` : "—"}</div>
        </Card>
      </div>

      <Modal open={celebrate} onClose={() => setCelebrate(false)}>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="text-4xl">✓</div>
          <div className="text-xl font-semibold">DAY {currentDayNumber} COMPLETE</div>
          <p className="text-[14px] text-secondary">Один день. Ещё один шаг.</p>
          <Button fullWidth className="mt-2" onClick={() => setCelebrate(false)}>
            ЗАКРЫТЬ
          </Button>
        </div>
      </Modal>
    </div>
  );
}
