"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useBodyResetStore } from "@/lib/store";
import { GOAL_LABELS } from "@/lib/validation/onboarding";
import { ChevronDown, ShieldCheck, HelpCircle, Bell } from "lucide-react";
import clsx from "clsx";

function Accordion({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <Card className="mb-3">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between">
        <span className="flex items-center gap-2 text-[14px] font-medium text-primary">
          {icon}
          {title}
        </span>
        <ChevronDown size={16} className={clsx("text-secondary transition-transform", open && "rotate-180")} />
      </button>
      {open && <div className="mt-3 text-[13px] leading-relaxed text-secondary">{children}</div>}
    </Card>
  );
}

export default function ProfilePage() {
  const profile = useBodyResetStore((s) => s.profile);
  const resetAll = useBodyResetStore((s) => s.resetAll);
  const [confirmingReset, setConfirmingReset] = useState(false);

  const initials = (profile.firstName || "Б").slice(0, 1).toUpperCase();

  return (
    <div>
      <Header title="Профиль" />
      <div className="px-5">
        <Card className="mb-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-medium text-white">
            {initials}
          </div>
          <div>
            <p className="text-[16px] font-medium text-primary">{profile.firstName || "Демо-пользователь"}</p>
            <p className="text-[13px] text-secondary">
              {profile.age ? `${profile.age} лет` : "—"} · {profile.heightCm ? `${profile.heightCm} см` : "—"}
            </p>
          </div>
        </Card>

        <Card className="mb-4">
          <p className="mb-3 text-[15px] font-medium text-primary">Настройки программы</p>
          <div className="flex flex-col divide-y divide-border">
            <div className="flex items-center justify-between py-2.5 text-[14px]">
              <span className="text-secondary">Цели</span>
              <span className="max-w-[60%] text-right text-primary">
                {profile.goals.map((g) => GOAL_LABELS[g]).join(", ") || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5 text-[14px]">
              <span className="text-secondary">Формат тренировок</span>
              <span className="text-primary">
                {profile.trainingLocation === "home" && "HOME"}
                {profile.trainingLocation === "gym" && "GYM"}
                {profile.trainingLocation === "mixed" && "MIXED"}
                {!profile.trainingLocation && "—"}
              </span>
            </div>
            <div className="flex items-center justify-between py-2.5 text-[14px]">
              <span className="text-secondary">Тренировок в неделю</span>
              <span className="text-primary">{profile.trainingFrequency}</span>
            </div>
            <div className="flex items-center justify-between py-2.5 text-[14px]">
              <span className="flex items-center gap-1.5 text-secondary">
                <Bell size={14} />
                Уведомления
              </span>
              <span className="text-primary">{profile.notificationsEnabled ? "Включены" : "Выключены"}</span>
            </div>
          </div>
        </Card>

        <Accordion title="Помощь" icon={<HelpCircle size={16} className="text-secondary" />}>
          <p className="mb-2">
            <b>Как отметить день выполненным?</b> Отметь все пункты чек-листа на вкладке дня — питание, воду,
            тренировку, активность, сон и задание дня.
          </p>
          <p className="mb-2">
            <b>Можно ли поменять блюдо?</b> Да, на вкладке «Питание» нажми «Мне это не подходит» под любым блюдом
            и выбери замену.
          </p>
          <p>
            <b>Что если пропустила день?</b> Ничего страшного — открой программу сегодня и продолжай. Подробнее об
            этом расскажет AI Coach.
          </p>
        </Accordion>

        <Accordion title="Правила безопасности" icon={<ShieldCheck size={16} className="text-secondary" />}>
          <p>
            BODY RESET — это wellness-программа, а не медицинский сервис. Она не заменяет консультацию врача.
            Если у тебя беременность, серьёзное заболевание, история расстройства пищевого поведения или
            противопоказания к физической активности — пожалуйста, обсуди питание и тренировки с врачом или
            квалифицированным специалистом перед началом и в течение программы.
          </p>
        </Accordion>

        <Button
          fullWidth
          variant="ghost"
          className="mb-24 mt-4 text-danger"
          onClick={() => {
            if (confirmingReset) {
              resetAll();
              setConfirmingReset(false);
            } else {
              setConfirmingReset(true);
            }
          }}
        >
          {confirmingReset ? "Точно сбросить? Нажми ещё раз" : "Сбросить демо-данные"}
        </Button>
      </div>
    </div>
  );
}
