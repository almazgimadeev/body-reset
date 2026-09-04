"use client";

import { useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { AIMessage } from "@/components/AIMessage";
import { QuickAction } from "@/components/ui/QuickAction";
import { useBodyResetStore } from "@/lib/store";
import { getDay } from "@/content/days";
import { QUICK_ACTIONS } from "@/lib/ai/coach";
import { GOAL_LABELS } from "@/lib/validation/onboarding";
import { Send } from "lucide-react";

export default function CoachPage() {
  const profile = useBodyResetStore((s) => s.profile);
  const currentDayNumber = useBodyResetStore((s) => s.currentDayNumber());
  const checkin = useBodyResetStore((s) => s.getCheckin(currentDayNumber));
  const aiMessages = useBodyResetStore((s) => s.aiMessages);
  const addAiMessage = useBodyResetStore((s) => s.addAiMessage);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const day = getDay(currentDayNumber);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [aiMessages, sending]);

  const send = async (text: string) => {
    if (!text.trim() || sending) return;
    const userMsg = { id: crypto.randomUUID(), role: "user" as const, content: text, createdAt: new Date().toISOString() };
    addAiMessage(userMsg);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          firstName: profile.firstName,
          dayNumber: currentDayNumber,
          weekNumber: day.weekNumber,
          goal: profile.goals.map((g) => GOAL_LABELS[g]).join(", "),
          knownDifficulties: profile.obstacles,
          todayNutritionDone: checkin.nutrition,
          todayWorkoutDone: checkin.workout,
        }),
      });
      const data = await res.json();
      addAiMessage({
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply,
        createdAt: new Date().toISOString(),
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-dvh flex-col">
      <Header title="AI Coach" subtitle="Спроси меня о питании, тренировках и программе." />

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-5 pb-4">
        {aiMessages.length === 0 && (
          <div className="mt-8 text-center text-[13px] text-secondary">
            Спроси меня о сегодняшнем питании, тренировке или программе.
          </div>
        )}
        {aiMessages.map((m) => (
          <AIMessage key={m.id} message={m} />
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-border bg-card px-4 py-2.5 text-[13px] text-secondary">
              AI думает…
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border bg-bg px-5 py-2">
        <div className="scrollbar-none mb-2 flex gap-2 overflow-x-auto">
          {QUICK_ACTIONS.map((qa) => (
            <QuickAction key={qa.label} emoji={qa.emoji} label={qa.label} onClick={() => send(qa.message)} />
          ))}
        </div>
        <div className="mb-[calc(72px+env(safe-area-inset-bottom,0px))] flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Спроси что угодно о своей программе…"
            className="min-h-[48px] flex-1 rounded-2xl border border-border bg-card px-4 text-[14px] outline-none focus:border-accent"
          />
          <button
            onClick={() => send(input)}
            disabled={!input.trim() || sending}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white disabled:opacity-40"
            aria-label="Отправить"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
