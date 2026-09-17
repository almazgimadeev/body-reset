export function QuickAction({ emoji, label, onClick }: { emoji: string; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card px-3.5 py-2 text-[13px] text-primary active:bg-bg"
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
