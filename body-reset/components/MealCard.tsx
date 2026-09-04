"use client";

import { useState } from "react";
import { MealItem } from "@/types";
import { Card } from "@/components/ui/Card";
import { Check, RefreshCw } from "lucide-react";
import { MEALS } from "@/content/meals";
import clsx from "clsx";

const TYPE_LABELS: Record<MealItem["type"], string> = {
  breakfast: "Завтрак",
  lunch: "Обед",
  snack: "Перекус",
  dinner: "Ужин",
};

export function MealCard({
  meal,
  eaten,
  onToggleEaten,
  onSwap,
}: {
  meal: MealItem;
  eaten: boolean;
  onToggleEaten: () => void;
  onSwap: (newCode: string) => void;
}) {
  const [showAlternatives, setShowAlternatives] = useState(false);

  const alternatives = Object.values(MEALS).filter((m) => m.type === meal.type && m.code !== meal.code);

  return (
    <Card className={clsx("mb-3 transition-opacity", eaten && "opacity-70")}>
      <div className="mb-1 flex items-center justify-between">
        <span className="text-[12px] font-medium uppercase tracking-wide text-accent">{TYPE_LABELS[meal.type]}</span>
        <button
          onClick={() => setShowAlternatives((v) => !v)}
          className="flex items-center gap-1 text-[12px] text-secondary active:opacity-60"
        >
          <RefreshCw size={12} />
          Мне это не подходит
        </button>
      </div>

      <p className={clsx("text-[16px] font-medium text-primary", eaten && "line-through")}>{meal.title}</p>
      <p className="mt-1.5 text-[13px] text-secondary">{meal.ingredients.join(", ")}</p>
      <p className="mt-1 text-[12px] text-secondary">Порция: {meal.portionHint}</p>
      <p className="mt-2 text-[13px] leading-relaxed text-primary">{meal.instructions}</p>

      {showAlternatives && (
        <div className="mt-3 flex flex-col gap-1.5 rounded-xl bg-bg p-2.5">
          <p className="px-1 text-[11px] font-medium uppercase tracking-wide text-secondary">Заменить на</p>
          {alternatives.map((alt) => (
            <button
              key={alt.code}
              onClick={() => {
                onSwap(alt.code);
                setShowAlternatives(false);
              }}
              className="min-h-[44px] rounded-xl border border-border bg-card px-3 py-2 text-left text-[13px] text-primary active:bg-border/30"
            >
              {alt.title}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={onToggleEaten}
        className={clsx(
          "mt-3 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border text-[14px] font-medium transition-colors",
          eaten ? "border-success bg-success/10 text-success" : "border-border bg-bg text-primary"
        )}
      >
        <Check size={16} strokeWidth={eaten ? 3 : 2} />
        {eaten ? "Съедено" : "✓ СЪЕДЕНО"}
      </button>
    </Card>
  );
}
