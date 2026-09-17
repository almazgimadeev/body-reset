"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useBodyResetStore } from "@/lib/store";
import { estimateDailyTargets } from "@/lib/nutrition";
import {
  onboardingSchema,
  OnboardingInput,
  OBSTACLE_OPTIONS,
  GOAL_LABELS,
} from "@/lib/validation/onboarding";

const TOTAL_STEPS = 10;

const ACTIVITY_OPTIONS: { value: OnboardingInput["activityLevel"]; label: string }[] = [
  { value: "low", label: "Почти не двигаюсь" },
  { value: "light", label: "Немного активна" },
  { value: "medium", label: "Средняя активность" },
  { value: "high", label: "Высокая активность" },
];

const LOCATION_OPTIONS: { value: OnboardingInput["trainingLocation"]; label: string; hint: string }[] = [
  { value: "home", label: "HOME", hint: "Тренировки дома, минимум инвентаря" },
  { value: "gym", label: "GYM", hint: "Тренировки в зале" },
  { value: "mixed", label: "MIXED", hint: "Чередуем дом и зал" },
];

function Pill({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        "min-h-[52px] w-full rounded-2xl border px-4 text-left text-[15px] transition-colors",
        selected ? "border-primary bg-primary text-white" : "border-border bg-card text-primary"
      )}
    >
      {children}
    </button>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const completeOnboarding = useBodyResetStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);
  const [medicalFlag, setMedicalFlag] = useState(false);

  const {
    watch,
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      goals: [],
      trainingFrequency: 3,
      obstacles: [],
      medicalFlag: false,
    },
  });

  const values = watch();

  const previewTargets = estimateDailyTargets({
    age: values.age ?? null,
    heightCm: values.heightCm ?? null,
    currentWeightKg: values.weightKg ?? null,
    activityLevel: values.activityLevel ?? null,
    goals: values.goals ?? [],
    medicalFlag,
    customTargets: null,
  } as any);

  const toggleGoal = (g: string) => {
    const current = values.goals ?? [];
    setValue("goals", current.includes(g as any) ? current.filter((x) => x !== g) : [...current, g as any], {
      shouldValidate: false,
    });
  };

  const toggleObstacle = (o: string) => {
    const current = values.obstacles ?? [];
    setValue("obstacles", current.includes(o) ? current.filter((x) => x !== o) : [...current, o]);
  };

  const onSubmit = (data: OnboardingInput) => {
    completeOnboarding({ ...data, medicalFlag });
    router.replace("/paywall");
  };

  const next = () => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const canProceedFromStep = (s: number) => {
    switch (s) {
      case 1:
        return (values.goals?.length ?? 0) > 0;
      case 2:
        return !!values.age && values.age >= 14 && values.age <= 90;
      case 3:
        return !!values.heightCm && values.heightCm >= 120 && values.heightCm <= 220;
      case 4:
        return !!values.weightKg && values.weightKg >= 35;
      case 5:
        return !!values.activityLevel;
      case 6:
        return !!values.trainingLocation;
      case 7:
        return !!values.trainingFrequency;
      default:
        return true;
    }
  };

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-8 pt-6">
      {step > 0 && (
        <div className="mb-6">
          <ProgressBar value={(step / (TOTAL_STEPS - 1)) * 100} />
        </div>
      )}

      <div className="flex-1 animate-fade-in">
        {/* Screen 1 */}
        {step === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="text-4xl font-semibold tracking-tight">BODY RESET</div>
            <p className="max-w-xs text-[15px] text-secondary">
              56 дней, чтобы превратить хаос в систему.
            </p>
          </div>
        )}

        {/* Screen 2 — goals */}
        {step === 1 && (
          <div className="flex flex-col gap-3">
            <h2 className="mb-1 text-xl font-semibold">Что ты хочешь изменить?</h2>
            <p className="mb-2 text-[13px] text-secondary">Можно выбрать несколько</p>
            {Object.entries(GOAL_LABELS).map(([key, label]) => (
              <Pill key={key} selected={(values.goals ?? []).includes(key as any)} onClick={() => toggleGoal(key)}>
                {label}
              </Pill>
            ))}
          </div>
        )}

        {/* Screen 3 — age */}
        {step === 2 && (
          <div className="flex flex-col gap-3">
            <h2 className="mb-1 text-xl font-semibold">Твой возраст</h2>
            <Input type="number" inputMode="numeric" placeholder="Например, 28" {...register("age")} />
            {errors.age && <p className="text-[13px] text-danger">{errors.age.message}</p>}
          </div>
        )}

        {/* Screen 4 — height */}
        {step === 3 && (
          <div className="flex flex-col gap-3">
            <h2 className="mb-1 text-xl font-semibold">Рост</h2>
            <p className="mb-1 text-[13px] text-secondary">В сантиметрах</p>
            <Input type="number" inputMode="numeric" placeholder="Например, 165" {...register("heightCm")} />
          </div>
        )}

        {/* Screen 5 — weight */}
        {step === 4 && (
          <div className="flex flex-col gap-3">
            <h2 className="mb-1 text-xl font-semibold">Вес</h2>
            <p className="mb-1 text-[13px] text-secondary">В килограммах — это начальная точка, а не оценка</p>
            <Input type="number" inputMode="decimal" placeholder="Например, 68" {...register("weightKg")} />
            <label className="mt-3 block text-[13px] text-secondary">Желаемый вес (необязательно)</label>
            <Input type="number" inputMode="decimal" placeholder="Например, 62" {...register("goalWeightKg")} />
          </div>
        )}

        {/* Screen 6 — activity */}
        {step === 5 && (
          <div className="flex flex-col gap-3">
            <h2 className="mb-1 text-xl font-semibold">Насколько ты активна сейчас?</h2>
            {ACTIVITY_OPTIONS.map((opt) => (
              <Pill key={opt.value} selected={values.activityLevel === opt.value} onClick={() => setValue("activityLevel", opt.value)}>
                {opt.label}
              </Pill>
            ))}
          </div>
        )}

        {/* Screen 7 — location */}
        {step === 6 && (
          <div className="flex flex-col gap-3">
            <h2 className="mb-1 text-xl font-semibold">Где ты будешь тренироваться?</h2>
            {LOCATION_OPTIONS.map((opt) => (
              <Pill key={opt.value} selected={values.trainingLocation === opt.value} onClick={() => setValue("trainingLocation", opt.value)}>
                <div className="font-medium">{opt.label}</div>
                <div className={clsx("text-[13px]", values.trainingLocation === opt.value ? "text-white/80" : "text-secondary")}>
                  {opt.hint}
                </div>
              </Pill>
            ))}
          </div>
        )}

        {/* Screen 8 — frequency */}
        {step === 7 && (
          <div className="flex flex-col gap-3">
            <h2 className="mb-1 text-xl font-semibold">Сколько тренировок в неделю тебе комфортно?</h2>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setValue("trainingFrequency", n)}
                  className={clsx(
                    "min-h-[52px] rounded-2xl border text-[17px] font-medium",
                    values.trainingFrequency === n ? "border-primary bg-primary text-white" : "border-border bg-card text-primary"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>
            <p className="text-[13px] text-secondary">Рекомендуем начать с 3 — можно изменить позже в профиле.</p>
          </div>
        )}

        {/* Screen 9 — obstacles + safety */}
        {step === 8 && (
          <div className="flex flex-col gap-3">
            <h2 className="mb-1 text-xl font-semibold">Что обычно мешает тебе придерживаться программы?</h2>
            <div className="flex flex-col gap-2">
              {OBSTACLE_OPTIONS.map((o) => (
                <Pill key={o} selected={(values.obstacles ?? []).includes(o)} onClick={() => toggleObstacle(o)}>
                  {o.charAt(0).toUpperCase() + o.slice(1)}
                </Pill>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-border bg-card p-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={medicalFlag}
                  onChange={(e) => setMedicalFlag(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 accent-[#1F1F1F]"
                />
                <span className="text-[13px] text-secondary">
                  Отметь, если применимо: беременность или кормление грудью, хроническое заболевание,
                  история расстройства пищевого поведения, или другие противопоказания к физической активности.
                </span>
              </label>
              {medicalFlag && (
                <p className="mt-3 rounded-xl bg-bg p-3 text-[13px] text-primary">
                  Перед началом программы обсуди питание и физическую активность с врачом или
                  квалифицированным специалистом. Мы адаптируем советы AI Coach с учётом этого.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Screen 10 — summary */}
        {step === 9 && (
          <div className="flex flex-col gap-4">
            <h2 className="mb-1 text-xl font-semibold">Готова начать?</h2>
            <div className="flex flex-col divide-y divide-border rounded-2xl border border-border bg-card">
              {[
                ["Возраст", `${values.age ?? "—"}`],
                ["Рост", `${values.heightCm ?? "—"} см`],
                ["Вес", `${values.weightKg ?? "—"} кг`],
                ["Активность", ACTIVITY_OPTIONS.find((a) => a.value === values.activityLevel)?.label ?? "—"],
                ["Формат тренировок", LOCATION_OPTIONS.find((l) => l.value === values.trainingLocation)?.label ?? "—"],
                ["Тренировки / неделю", `${values.trainingFrequency ?? 3}`],
              ].map(([label, val]) => (
                <div key={label} className="flex items-center justify-between px-4 py-3 text-[14px]">
                  <span className="text-secondary">{label}</span>
                  <span className="font-medium text-primary">{val}</span>
                </div>
              ))}
            </div>

            {previewTargets.hasEnoughData && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="mb-1 text-[14px] font-medium text-primary">Расчётная цель на день</p>
                <p className="mb-3 text-[12px] text-secondary">
                  Ориентировочно, по стандартной формуле — не медицинская норма. Всегда можно изменить вручную в
                  профиле.
                </p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-[15px] font-semibold text-primary">{previewTargets.calories}</p>
                    <p className="text-[10px] text-secondary">ккал</p>
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-primary">{previewTargets.proteinG}</p>
                    <p className="text-[10px] text-secondary">белок, г</p>
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-primary">{previewTargets.fatG}</p>
                    <p className="text-[10px] text-secondary">жиры, г</p>
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-primary">{previewTargets.carbsG}</p>
                    <p className="text-[10px] text-secondary">углеводы, г</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3">
        {step === 0 && (
          <Button fullWidth onClick={next}>
            НАЧАТЬ
          </Button>
        )}
        {step > 0 && step < TOTAL_STEPS - 1 && (
          <>
            <Button fullWidth onClick={next} disabled={!canProceedFromStep(step)}>
              Далее
            </Button>
            <Button fullWidth variant="ghost" onClick={back}>
              Назад
            </Button>
          </>
        )}
        {step === TOTAL_STEPS - 1 && (
          <>
            <Button fullWidth onClick={handleSubmit(onSubmit)}>
              НАЧАТЬ BODY RESET
            </Button>
            <Button fullWidth variant="ghost" onClick={back}>
              Назад
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
