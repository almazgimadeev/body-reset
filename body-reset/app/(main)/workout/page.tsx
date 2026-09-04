"use client";

import { Header } from "@/components/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ExerciseCard } from "@/components/ExerciseCard";
import { useBodyResetStore } from "@/lib/store";
import { getDay, resolveWorkoutCode, DAYS } from "@/content/days";
import { getWorkout, PROGRESSION_NOTE } from "@/content/workouts";

export default function WorkoutPage() {
  const currentDayNumber = useBodyResetStore((s) => s.currentDayNumber());
  const trainingLocation = useBodyResetStore((s) => s.profile.trainingLocation);
  const checkin = useBodyResetStore((s) => s.getCheckin(currentDayNumber));
  const toggle = useBodyResetStore((s) => s.toggleCheckinItem);

  const day = getDay(currentDayNumber);
  const workoutCode = resolveWorkoutCode(day.dayNumber, day.weekNumber, day.workoutVariant, trainingLocation);
  const workout = workoutCode ? getWorkout(workoutCode) : null;

  const weekWorkoutDays = DAYS.filter((d) => d.weekNumber === day.weekNumber && d.workoutVariant);

  return (
    <div>
      <Header title="Тренировка" subtitle={workout ? workout.title : "Сегодня — день восстановления"} />
      <div className="px-5">
        {workout ? (
          <>
            <div className="mb-4 flex gap-3 text-[13px] text-secondary">
              <span>{workout.durationMin} мин</span>
              <span>·</span>
              <span>{workout.difficulty === "beginner" ? "Beginner" : "Intermediate"}</span>
              <span>·</span>
              <span>{workout.location === "home" ? "Дом" : "Зал"}</span>
            </div>

            {workout.exercises.map((ex, i) => (
              <ExerciseCard key={ex.name} exercise={ex} index={i + 1} />
            ))}

            <Card className="my-4 bg-bg">
              <p className="text-[13px] leading-relaxed text-secondary">{PROGRESSION_NOTE}</p>
            </Card>

            <Button fullWidth onClick={() => toggle(currentDayNumber, "workout")}>
              {checkin.workout ? "✓ ТРЕНИРОВКА ВЫПОЛНЕНА" : "ОТМЕТИТЬ ВЫПОЛНЕННОЙ"}
            </Button>
          </>
        ) : (
          <Card className="mb-4">
            <p className="text-[14px] leading-relaxed text-primary">
              Сегодня в расписании нет силовой тренировки — это нормальная часть программы, а не пропуск.
              Если хочется двигаться — короткая прогулка или лёгкая растяжка отлично впишутся в день.
            </p>
          </Card>
        )}

        <p className="mb-2 mt-6 text-[15px] font-medium text-primary">Тренировки на этой неделе</p>
        <div className="mb-24 flex flex-col gap-2">
          {weekWorkoutDays.map((d) => {
            const code = resolveWorkoutCode(d.dayNumber, d.weekNumber, d.workoutVariant, trainingLocation);
            const w = code ? getWorkout(code) : null;
            if (!w) return null;
            return (
              <Card key={d.dayNumber} className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-medium text-primary">День {d.dayNumber}</p>
                  <p className="text-[12.5px] text-secondary">{w.title}</p>
                </div>
                {d.dayNumber === currentDayNumber && (
                  <span className="rounded-full bg-accent/25 px-2.5 py-1 text-[11px] font-medium text-primary">
                    сегодня
                  </span>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
