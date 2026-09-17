"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useBodyResetStore } from "@/lib/store";

const INCLUDES = [
  "56 дней программы",
  "готовое питание на каждый день",
  "тренировки дома и в зале",
  "ежедневные конкретные задания",
  "трекер прогресса и веса",
  "AI Coach на связи",
  "визуализация прогресса",
];

export default function PaywallPage() {
  const router = useRouter();
  const activateSubscriptionMock = useBodyResetStore((s) => s.activateSubscriptionMock);
  const firstName = useBodyResetStore((s) => s.profile.firstName);
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: firstName || "demo-user" }),
      });
      const data = await res.json();
      if (data.status === "paid") {
        activateSubscriptionMock();
        router.replace("/home");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col px-5 pb-8 pt-10">
      <div className="flex-1">
        <div className="text-center">
          <div className="text-3xl font-semibold tracking-tight">BODY RESET</div>
          <p className="mt-2 text-[15px] text-secondary">56 дней</p>
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-card p-5">
          <p className="mb-4 text-[15px] font-medium text-primary">Что входит:</p>
          <ul className="flex flex-col gap-3">
            {INCLUDES.map((item) => (
              <li key={item} className="flex items-center gap-3 text-[14px] text-primary">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/25">
                  <Check size={13} className="text-primary" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 text-center">
          <div className="text-4xl font-semibold">5 000 ₽</div>
          <p className="mt-1 text-[13px] text-secondary">Разовая оплата за полный доступ к программе</p>
        </div>
      </div>

      <div className="mt-8">
        <Button fullWidth onClick={handleStart} disabled={loading}>
          {loading ? "Обрабатываем оплату…" : "НАЧАТЬ ПРОГРАММУ"}
        </Button>
      </div>
    </div>
  );
}
