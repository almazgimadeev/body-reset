export function ProgressBar({ value, className = "" }: { value: number; className?: string }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-border ${className}`}>
      <div
        className="h-full rounded-full bg-accent transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
