"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

// Minimal read-only admin dashboard (spec section 47-49). Password check
// here is a convenience gate for an internal MVP tool, NOT real
// authentication — see README "Admin" for how to harden this (Supabase
// Auth + RLS-based role check) before giving anyone outside your team the
// URL.

const FUNNEL_STEPS = [
  { key: "started", label: "Начали программу" },
  { key: "day1", label: "Завершили День 1" },
  { key: "day7", label: "Завершили День 7" },
  { key: "day14", label: "Завершили День 14" },
  { key: "day28", label: "Завершили День 28" },
  { key: "day56", label: "Завершили День 56" },
];

const DEMO_FUNNEL: Record<string, number> = {
  started: 100,
  day1: 91,
  day7: 68,
  day14: 54,
  day28: 39,
  day56: 22,
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [aiMessageCount, setAiMessageCount] = useState<number | null>(null);

  useEffect(() => {
    if (!authed) return;
    const supabase = getSupabaseBrowserClient();
    setSupabaseConfigured(!!supabase);
    if (!supabase) return;

    supabase
      .from("users")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setUserCount(count ?? 0));

    supabase
      .from("ai_messages")
      .select("*", { count: "exact", head: true })
      .then(({ count }) => setAiMessageCount(count ?? 0));
  }, [authed]);

  if (!authed) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg px-6">
        <div className="text-xl font-semibold">BODY RESET · Admin</div>
        <input
          type="password"
          placeholder="Пароль администратора"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) setAuthed(true);
          }}
          className="min-h-[48px] w-full max-w-xs rounded-2xl border border-border bg-card px-4 text-center outline-none"
        />
        <button
          onClick={() => password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD && setAuthed(true)}
          className="min-h-[48px] w-full max-w-xs rounded-2xl bg-primary text-white"
        >
          Войти
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-2xl bg-bg px-6 py-10">
      <h1 className="mb-1 text-2xl font-semibold">Admin — BODY RESET</h1>
      <p className="mb-6 text-[13px] text-secondary">
        {supabaseConfigured ? "Данные из Supabase." : "Supabase не подключён — показаны демо-данные для примера."}
      </p>

      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[13px] text-secondary">Пользователей</p>
          <p className="mt-1 text-2xl font-semibold">{supabaseConfigured ? userCount ?? "…" : "128"}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[13px] text-secondary">Сообщений AI Coach</p>
          <p className="mt-1 text-2xl font-semibold">{supabaseConfigured ? aiMessageCount ?? "…" : "742"}</p>
        </div>
      </div>

      <p className="mb-3 text-[15px] font-medium">Retention-воронка</p>
      <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4">
        {FUNNEL_STEPS.map((step) => {
          const value = DEMO_FUNNEL[step.key];
          return (
            <div key={step.key} className="flex items-center gap-3">
              <span className="w-36 shrink-0 text-[13px] text-secondary">{step.label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-bg">
                <div className="h-full rounded-full bg-accent" style={{ width: `${value}%` }} />
              </div>
              <span className="w-10 text-right text-[13px]">{value}%</span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] text-secondary">
        {supabaseConfigured
          ? "Воронка пока считается по демо-значениям — реальный SQL-запрос по program_progress см. в README."
          : "Демо-значения — подключи Supabase, чтобы увидеть реальные цифры."}
      </p>
    </div>
  );
}
