"use client";

import { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useBodyResetStore } from "@/lib/store";
import { getDay, DAYS } from "@/content/days";
import { getMeal, buildShoppingList } from "@/content/meals";
import { MealCard } from "@/components/MealCard";
import { FoodDiary } from "@/components/FoodDiary";

function PlateMethod() {
  return (
    <Card className="mb-4">
      <p className="mb-3 text-[15px] font-medium text-primary">Метод тарелки</p>
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 100 100" className="h-20 w-20 shrink-0">
          <circle cx="50" cy="50" r="48" fill="var(--color-border)" />
          <path d="M50 50 L50 2 A48 48 0 0 1 93.5 74 Z" fill="var(--color-accent)" opacity="0.9" />
          <path d="M50 50 L93.5 74 A48 48 0 0 1 6.5 74 Z" fill="var(--color-primary)" opacity="0.85" />
          <path d="M50 50 L6.5 74 A48 48 0 0 1 50 2 Z" fill="var(--color-secondary)" opacity="0.35" />
        </svg>
        <ul className="flex flex-col gap-1.5 text-[13px] text-primary">
          <li><span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: "var(--color-secondary)", opacity: 0.5 }} />½ овощи / фрукты</li>
          <li><span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: "var(--color-primary)" }} />¼ белок</li>
          <li><span className="mr-1.5 inline-block h-2 w-2 rounded-full" style={{ background: "var(--color-accent)" }} />¼ углеводы + немного жиров</li>
        </ul>
      </div>
      <p className="mt-3 text-[12px] text-secondary">
        Это визуальный ориентир, а не медицинская норма — не нужно взвешивать каждый грамм.
      </p>
    </Card>
  );
}

export default function FoodPage() {
  const currentDayNumber = useBodyResetStore((s) => s.currentDayNumber());
  const day = getDay(currentDayNumber);
  const mealSwaps = useBodyResetStore((s) => s.mealSwaps);
  const eatenMeals = useBodyResetStore((s) => s.eatenMeals);
  const setMealSwap = useBodyResetStore((s) => s.setMealSwap);
  const toggleMealEaten = useBodyResetStore((s) => s.toggleMealEaten);
  const [shoppingOpen, setShoppingOpen] = useState(false);

  const effectiveCode = (mealType: string, base: string) => mealSwaps[`${currentDayNumber}:${mealType}`] ?? base;

  const meals = [
    { type: "breakfast", code: effectiveCode("breakfast", day.meals.breakfast) },
    { type: "lunch", code: effectiveCode("lunch", day.meals.lunch) },
    { type: "snack", code: effectiveCode("snack", day.meals.snack) },
    { type: "dinner", code: effectiveCode("dinner", day.meals.dinner) },
  ];

  const weekCodes = useMemo(() => {
    const weekDays = DAYS.filter((d) => d.weekNumber === day.weekNumber);
    return weekDays.flatMap((d) => [d.meals.breakfast, d.meals.lunch, d.meals.snack, d.meals.dinner]);
  }, [day.weekNumber]);

  const shoppingList = useMemo(() => buildShoppingList(weekCodes), [weekCodes]);

  return (
    <div>
      <Header title="Питание" subtitle={`Сегодня — День ${currentDayNumber}`} />
      <div className="px-5">
        <PlateMethod />

        {meals.map(({ type, code }) => (
          <MealCard
            key={type}
            meal={getMeal(code)}
            eaten={!!eatenMeals[`${currentDayNumber}:${type}`]}
            onToggleEaten={() => toggleMealEaten(currentDayNumber, type)}
            onSwap={(newCode) => setMealSwap(currentDayNumber, type, newCode)}
          />
        ))}

        <FoodDiary dayNumber={currentDayNumber} />

        <Button fullWidth variant="secondary" className="mb-24 gap-2" onClick={() => setShoppingOpen(true)}>
          <ShoppingCart size={17} />
          СОЗДАТЬ СПИСОК ПОКУПОК
        </Button>
      </div>

      <Modal open={shoppingOpen} onClose={() => setShoppingOpen(false)}>
        <h3 className="mb-1 text-lg font-semibold">Список покупок</h3>
        <p className="mb-4 text-[13px] text-secondary">На основе меню недели {day.weekNumber}</p>
        <div className="max-h-[50vh] overflow-y-auto pr-1">
          {Object.entries(shoppingList).map(([category, items]) => (
            <div key={category} className="mb-4">
              <p className="mb-1.5 text-[13px] font-medium uppercase tracking-wide text-secondary">{category}</p>
              <ul className="flex flex-col gap-1">
                {items.map((item) => (
                  <li key={item} className="text-[14px] text-primary">
                    · {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Button fullWidth className="mt-2" onClick={() => setShoppingOpen(false)}>
          Готово
        </Button>
      </Modal>
    </div>
  );
}
