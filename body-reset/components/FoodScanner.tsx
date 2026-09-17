"use client";

import { useRef, useState } from "react";
import { Camera, Check, Loader2, RotateCcw, Upload, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useBodyResetStore } from "@/lib/store";
import { DetectedFoodItem } from "@/types";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";
const MEALS: { value: MealType; label: string }[] = [
  { value: "breakfast", label: "Завтрак" },
  { value: "lunch", label: "Обед" },
  { value: "dinner", label: "Ужин" },
  { value: "snack", label: "Перекус" },
];

const CONFIDENCE_LABEL: Record<DetectedFoodItem["confidence"], string> = {
  high: "высокая уверенность",
  medium: "средняя уверенность",
  low: "низкая уверенность — проверь порцию",
};

function round(n: number) {
  return Math.round(n * 10) / 10;
}

function itemTotals(item: DetectedFoodItem) {
  const factor = item.estimatedGrams / 100;
  return {
    kcal: Math.round(item.kcalPer100g * factor),
    protein: round(item.proteinPer100g * factor),
    fat: round(item.fatPer100g * factor),
    carbs: round(item.carbsPer100g * factor),
  };
}

async function fileToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("bad_type");
  if (file.size > 8 * 1024 * 1024) throw new Error("too_large");
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("read_failed"));
    reader.readAsDataURL(file);
  });
}

export function FoodScanner({ dayNumber }: { dayNumber: number }) {
  const addFoodLogEntry = useBodyResetStore((s) => s.addFoodLogEntry);
  const inputRef = useRef<HTMLInputElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [items, setItems] = useState<DetectedFoodItem[] | null>(null);
  const [mealType, setMealType] = useState<MealType>("lunch");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState<"live" | "mock" | "mock_fallback" | null>(null);

  const reset = () => {
    setImagePreview(null);
    setItems(null);
    setError(null);
    setSaved(false);
  };

  const analyze = async (file: File) => {
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const dataUrl = await fileToDataUrl(file);
      setImagePreview(dataUrl);

      const res = await fetch("/api/food-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "scan_failed");

      setItems(data.items as DetectedFoodItem[]);
      setMode(data.mode);
    } catch (e) {
      setError(e instanceof Error ? e.message : "scan_failed");
    } finally {
      setLoading(false);
    }
  };

  const updateGrams = (index: number, grams: number) => {
    if (!items) return;
    const next = [...items];
    next[index] = { ...next[index], estimatedGrams: Math.max(1, grams || 1) };
    setItems(next);
  };

  const removeItem = (index: number) => {
    if (!items) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const total = (items ?? []).reduce(
    (acc, item) => {
      const t = itemTotals(item);
      return { kcal: acc.kcal + t.kcal, protein: acc.protein + t.protein, fat: acc.fat + t.fat, carbs: acc.carbs + t.carbs };
    },
    { kcal: 0, protein: 0, fat: 0, carbs: 0 }
  );

  const saveAll = () => {
    if (!items) return;
    items.forEach((item) => {
      const t = itemTotals(item);
      addFoodLogEntry({
        dayNumber,
        mealType,
        foodId: item.matchedFoodId ?? "custom",
        name: item.name,
        grams: item.estimatedGrams,
        kcal: t.kcal,
        protein: t.protein,
        fat: t.fat,
        carbs: t.carbs,
        source: "photo_scan",
        confidence: item.confidence,
      });
    });
    setSaved(true);
  };

  const pickFile = () => inputRef.current?.click();

  const hiddenInput = (
    <input
      ref={inputRef}
      hidden
      type="file"
      accept="image/*"
      capture="environment"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) void analyze(file);
        e.currentTarget.value = "";
      }}
    />
  );

  if (!imagePreview && !items) {
    return (
      <Card className="mb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-bg text-primary">
            <Camera size={20} />
          </div>
          <div className="flex-1">
            <p className="text-[15px] font-medium text-primary">AI-анализ еды по фото</p>
            <p className="mt-1 text-[12px] leading-relaxed text-secondary">
              Сфотографируй тарелку — приложение попробует распознать продукты и посчитать КБЖУ. Оценка приблизительная,
              граммы можно поправить перед сохранением.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button fullWidth onClick={pickFile} className="gap-2">
            <Camera size={16} />
            Сфотографировать
          </Button>
          <Button fullWidth variant="secondary" onClick={pickFile} className="gap-2">
            <Upload size={16} />
            Из галереи
          </Button>
        </div>
        {hiddenInput}
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-medium text-primary">AI-анализ еды</p>
        <button onClick={reset} aria-label="Закрыть" className="rounded-xl p-1.5 text-secondary active:bg-bg">
          <X size={18} />
        </button>
      </div>

      {imagePreview && (
        <div className="relative mt-3 overflow-hidden rounded-2xl bg-bg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagePreview} alt="Загруженное фото еды" className="max-h-56 w-full object-cover" />
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/45 text-white">
              <Loader2 size={26} className="animate-spin" />
              <span className="text-[13px]">Анализируем еду…</span>
            </div>
          )}
        </div>
      )}

      {error && !loading && (
        <div className="mt-3 rounded-2xl bg-bg p-3 text-[13px] text-primary">
          <p>
            {error === "food_not_detected"
              ? "Не удалось уверенно распознать еду на фото — попробуй снять поближе и при хорошем освещении."
              : "Не получилось проанализировать фото."}
          </p>
          <button onClick={pickFile} className="mt-2 text-[13px] underline underline-offset-4">
            Попробовать другое фото
          </button>
        </div>
      )}

      {items && !loading && (
        <>
          {mode !== "live" && (
            <p className="mt-3 rounded-xl bg-bg px-3 py-2 text-[11px] text-secondary">
              Демо-режим: реальный ИИ ещё не подключён (нужен AI_API_KEY), поэтому это пример результата, не настоящий
              анализ этого фото.
            </p>
          )}

          <div className="mt-3 flex flex-col gap-2">
            {items.map((item, index) => {
              const t = itemTotals(item);
              return (
                <div key={`${item.name}-${index}`} className="rounded-2xl border border-border bg-bg p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium text-primary">{item.name}</p>
                      <p className="mt-0.5 text-[11px] text-secondary">{CONFIDENCE_LABEL[item.confidence]}</p>
                    </div>
                    <button onClick={() => removeItem(index)} className="p-1 text-secondary active:text-danger" aria-label="Удалить">
                      <X size={15} />
                    </button>
                  </div>
                  <div className="mt-2.5 grid grid-cols-[1fr_auto] items-end gap-2">
                    <div>
                      <label className="mb-1 block text-[11px] text-secondary">Порция, г</label>
                      <Input
                        type="number"
                        inputMode="numeric"
                        value={item.estimatedGrams}
                        onChange={(e) => updateGrams(index, Number(e.target.value))}
                      />
                    </div>
                    <div className="pb-2 text-right text-[11px] text-secondary">
                      <div className="text-[14px] font-medium text-primary">{t.kcal} ккал</div>
                      Б{t.protein} Ж{t.fat} У{t.carbs}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 rounded-2xl bg-primary p-4 text-white">
            <div className="flex items-baseline justify-between">
              <span className="text-[12px] opacity-75">Итого</span>
              <span className="text-xl font-semibold">{Math.round(total.kcal)} ккал</span>
            </div>
            <div className="mt-2 text-[12px] opacity-85">
              Б {round(total.protein)} г · Ж {round(total.fat)} г · У {round(total.carbs)} г
            </div>
          </div>

          <div className="mt-3">
            <p className="mb-1.5 text-[12px] text-secondary">Куда добавить?</p>
            <div className="grid grid-cols-4 gap-1.5">
              {MEALS.map((m) => (
                <button
                  key={m.value}
                  onClick={() => setMealType(m.value)}
                  className={`rounded-xl border px-2 py-2 text-[11px] font-medium transition-colors ${
                    mealType === m.value ? "border-primary bg-primary text-white" : "border-border bg-card text-primary"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <Button fullWidth className="mt-3 gap-2" onClick={saveAll} disabled={saved || items.length === 0}>
            <Check size={16} />
            {saved ? "Добавлено в дневник" : "Добавить в дневник"}
          </Button>

          <div className="mt-2.5 flex items-center justify-between gap-3">
            <button onClick={pickFile} className="inline-flex shrink-0 items-center gap-1 text-[12px] text-secondary underline underline-offset-4">
              <RotateCcw size={13} />
              Другое фото
            </button>
            <p className="text-right text-[10.5px] leading-relaxed text-secondary">
              Оценка по фото приблизительная — проверь продукты и граммы перед сохранением.
            </p>
          </div>
        </>
      )}

      {hiddenInput}
    </Card>
  );
}
