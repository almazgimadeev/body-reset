"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Measurement } from "@/types";

// Section 33: plot weight over time, no editorial commentary on the trend —
// "просто показывать данные".
export function WeightChart({ measurements }: { measurements: Measurement[] }) {
  const data = measurements
    .filter((m) => m.weightKg !== undefined)
    .map((m) => ({
      date: new Date(m.date).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" }),
      weight: m.weightKg,
    }));

  if (data.length < 2) {
    return (
      <div className="flex h-40 items-center justify-center text-center text-[13px] text-secondary">
        Твои изменения появятся здесь после нескольких замеров.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -24 }}>
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "var(--color-secondary)" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "var(--color-secondary)" }} axisLine={false} tickLine={false} domain={["auto", "auto"]} />
        <Tooltip
          contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", fontSize: 12 }}
          labelStyle={{ color: "var(--color-secondary)" }}
        />
        <Line type="monotone" dataKey="weight" stroke="var(--color-accent)" strokeWidth={2.5} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
