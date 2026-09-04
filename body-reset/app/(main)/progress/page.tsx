"use client";

import { useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { MetricCard } from "@/components/ui/MetricCard";
import { StreakBadge } from "@/components/ui/StreakBadge";
import { WeightChart } from "@/components/WeightChart";
import { useBodyResetStore } from "@/lib/store";
import { Camera, Plus } from "lucide-react";

const MILESTONE_DAYS = [1, 14, 28, 42, 56];
const PHOTO_TYPES: { key: "front" | "side" | "back"; label: string }[] = [
  { key: "front", label: "Спереди" },
  { key: "side", label: "Сбоку" },
  { key: "back", label: "Сзади" },
];

export default function ProgressPage() {
  const measurements = useBodyResetStore((s) => s.measurements);
  const addMeasurement = useBodyResetStore((s) => s.addMeasurement);
  const currentDayNumber = useBodyResetStore((s) => s.currentDayNumber());
  const streak = useBodyResetStore((s) => s.streak());
  const progressPhotos = useBodyResetStore((s) => s.progressPhotos);
  const setProgressPhoto = useBodyResetStore((s) => s.setProgressPhoto);

  const [modalOpen, setModalOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [hips, setHips] = useState("");

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const last = measurements[measurements.length - 1];
  const initial = measurements[0];
  const weightDelta = last?.weightKg && initial?.weightKg ? last.weightKg - initial.weightKg : null;

  const handleSave = () => {
    addMeasurement({
      date: new Date().toISOString(),
      weightKg: weight ? Number(weight) : undefined,
      waistCm: waist ? Number(waist) : undefined,
      hipsCm: hips ? Number(hips) : undefined,
    });
    setWeight("");
    setWaist("");
    setHips("");
    setModalOpen(false);
  };

  const handlePhotoChange = (milestoneDay: number, type: "front" | "side" | "back", file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProgressPhoto(milestoneDay, type, reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Header title="Прогресс" />

      <div className="px-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-[13px] text-secondary">День {currentDayNumber} из 56</span>
          <StreakBadge days={streak} />
        </div>

        <Card className="mb-4">
          <p className="mb-2 text-[15px] font-medium text-primary">Вес</p>
          <WeightChart measurements={measurements} />
        </Card>

        <div className="mb-4 flex gap-3">
          <MetricCard
            label="Вес"
            value={last?.weightKg ? `${last.weightKg} кг` : "—"}
            delta={weightDelta !== null && weightDelta !== 0 ? `${weightDelta > 0 ? "+" : ""}${weightDelta.toFixed(1)} кг` : undefined}
          />
          <MetricCard label="Талия" value={last?.waistCm ? `${last.waistCm} см` : "—"} />
          <MetricCard label="Бёдра" value={last?.hipsCm ? `${last.hipsCm} см` : "—"} />
        </div>

        <Button fullWidth variant="secondary" className="mb-6 gap-2" onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Добавить замеры
        </Button>

        <p className="mb-3 text-[15px] font-medium text-primary">Фото прогресса</p>
        <div className="mb-24 flex flex-col gap-3">
          {MILESTONE_DAYS.map((milestoneDay) => {
            const unlocked = currentDayNumber >= milestoneDay;
            const photos = progressPhotos[milestoneDay] ?? {};
            return (
              <Card key={milestoneDay} className={!unlocked ? "opacity-50" : ""}>
                <p className="mb-2 text-[13px] font-medium text-primary">День {milestoneDay}</p>
                <div className="grid grid-cols-3 gap-2">
                  {PHOTO_TYPES.map(({ key, label }) => {
                    const src = photos[key];
                    const inputKey = `${milestoneDay}-${key}`;
                    return (
                      <div key={key}>
                        <input
                          ref={(el) => {
                            fileInputRefs.current[inputKey] = el;
                          }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={!unlocked}
                          onChange={(e) => handlePhotoChange(milestoneDay, key, e.target.files?.[0] ?? null)}
                        />
                        <button
                          disabled={!unlocked}
                          onClick={() => fileInputRefs.current[inputKey]?.click()}
                          className="flex aspect-square w-full flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border border-dashed border-border bg-bg text-secondary disabled:cursor-not-allowed"
                        >
                          {src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={src} alt={label} className="h-full w-full object-cover" />
                          ) : (
                            <>
                              <Camera size={16} />
                              <span className="text-[10px]">{label}</span>
                            </>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <p className="mb-4 text-[17px] font-semibold text-primary">Новые замеры</p>
        <div className="flex flex-col gap-3">
          <div>
            <label className="mb-1 block text-[12px] text-secondary">Вес, кг</label>
            <Input type="number" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[12px] text-secondary">Талия, см (необязательно)</label>
            <Input type="number" inputMode="decimal" value={waist} onChange={(e) => setWaist(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-[12px] text-secondary">Бёдра, см (необязательно)</label>
            <Input type="number" inputMode="decimal" value={hips} onChange={(e) => setHips(e.target.value)} />
          </div>
        </div>
        <Button fullWidth className="mt-5" onClick={handleSave} disabled={!weight}>
          Сохранить
        </Button>
      </Modal>
    </div>
  );
}
