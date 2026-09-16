"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useBodyResetStore } from "@/lib/store";
import { searchFoodDb, FoodDbItem } from "@/content/foodDatabase";
import { estimateDailyCalorieRange } from "@/lib/nutrition";
import { Trash2, ChevronDown } from "lucide-react";
import clsx from "clsx";

function round(n: number) {
  return Math.round(n * 10) / 10;
}

export function FoodDiary({ dayNumber }: { dayNumber: number }) {
  const profile = useBodyResetStore((s) => s.profile);
  const entries = useBodyResetStore((s) => s.foodLog[dayNumber] ?? []);
  const addFoodLogEntry = useBodyResetStore((s) => s.addFoodLogEntry);
  const removeFoodLogEntry = useBodyResetStore((s) => s.removeFoodLogEntry);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [grams, setGrams] = useState("100");
  const [selected, setSelected] = useState<FoodDbItem | null>(null);

  const suggestions = useMemo(() => (selected ? [] : searchFoodDb(query)), [query, selected]);
  const range = useMemo(() => estimateDailyCalorieRange(profile), [profile]);

  const totals = entries.reduce(
    (acc, e) => ({
      kcal: acc.kcal + e.kcal,
      protein: acc.protein + e.protein,
      fat: acc.fat + e.fat,
      carbs: acc.carbs + e.carbs,
    }),
    { kcal: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const handleAdd = () => {
    const gramsNum = Number(grams);
    if (!selected || !gramsNum || gramsNum <= 0) return;
    const factor = gramsNum / 100;
    addFoodLogEntry({
      dayNumber,
      foodId: selected.id,
      name: selected.name,
      grams: gramsNum,
      kcal: round(selected.kcal * factor),
      protein: round(selected.protein * factor),
      fat: round(selected.fat * factor),
      carbs: round(selected.carbs * factor),
    });
    setSelected(null);
    setQuery("");
    setGrams("100");
  };

  const pct = range.hasEnoughData ? Math.min(100, Math.round((totals.kcal / range.max) * 100)) : 0;

  return (
    <Card className="mb-4">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between">
        <div className="text-left">
          <p className="text-[15px] font-medium text-primary">Дневник питания</p>
          <p className="text-[12px] text-secondary">Точный подсчёт по граммам — необязательно, по желанию</p>
        </div>
        <ChevronDown size={18} className={clsx("text-secondary transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="mt-4 flex flex-col gap-4">
          {range.hasEnoughData ? (
            <div>
              <div className="mb-1.5 flex items-baseline justify-between text-[13px]">
                <span className="text-primary">{Math.round(totals.kcal)} ккал сегодня</span>
                <span className="text-secondary">
                  ориентир {range.min}–{range.max} ккал
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-bg">
                <div
                  className={clsx("h-full rounded-full transition-all", totals.kcal > range.max ? "bg-danger" : "bg-accent")}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-secondary">
                Это приблизительный ориентир по формуле Миффлина-Сан Жеора, а не точная медицинская норма — у каждого
                тела свои особенности. Один день вне диапазона ничего не решает.
              </p>
            </div>
          ) : (
            <p className="text-[12px] text-secondary">
              Заполни возраст, рост, вес и уровень активности в профиле — тогда покажем примерный ориентир по калориям.
            </p>
          )}

          {entries.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {entries.map((e) => (
                <div key={e.id} className="flex items-center justify-between rounded-xl bg-bg px-3 py-2">
                  <div>
                    <p className="text-[13px] text-primary">{e.name}</p>
                    <p className="text-[11px] text-secondary">
                      {e.grams} г · {Math.round(e.kcal)} ккал · Б{round(e.protein)} Ж{round(e.fat)} У{round(e.carbs)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFoodLogEntry(dayNumber, e.id)}
                    className="p-1.5 text-secondary active:text-danger"
                    aria-label="Удалить"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div>
            <label className="mb-1 block text-[12px] text-secondary">Что съела</label>
            <div className="relative">
              <Input
                value={selected ? selected.name : query}
                onChange={(e) => {
                  setSelected(null);
                  setQuery(e.target.value);
                }}
                placeholder="Например, гречка"
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
                  {suggestions.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        setSelected(f);
                        setQuery(f.name);
                      }}
                      className="block w-full px-4 py-2.5 text-left text-[13px] text-primary active:bg-bg"
                    >
                      {f.name} <span className="text-secondary">· {f.kcal} ккал/100г</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-[12px] text-secondary">Граммы</label>
              <Input type="number" inputMode="numeric" value={grams} onChange={(e) => setGrams(e.target.value)} />
            </div>
            <Button onClick={handleAdd} disabled={!selected} className="mb-0">
              Добавить
            </Button>
          </div>

          {!selected && query && suggestions.length === 0 && (
            <p className="text-[12px] text-secondary">Такого продукта пока нет в базе — попробуй другое название.</p>
          )}
        </div>
      )}
    </Card>
  );
}
