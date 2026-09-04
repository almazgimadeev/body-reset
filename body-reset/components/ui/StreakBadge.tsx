export function StreakBadge({ days }: { days: number }) {
  if (days <= 0) return null;
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[13px] font-medium text-white">
      <span>🔥</span>
      <span>{days} {days === 1 ? "день" : "дней"} подряд</span>
    </div>
  );
}
