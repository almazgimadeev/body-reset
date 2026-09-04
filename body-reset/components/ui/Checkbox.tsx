"use client";

import { Check } from "lucide-react";
import clsx from "clsx";

export function Checkbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full min-h-[52px] items-center gap-3 rounded-xl px-1 text-left active:opacity-70"
      aria-pressed={checked}
    >
      <span
        className={clsx(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          checked ? "border-primary bg-primary" : "border-border bg-transparent"
        )}
      >
        {checked && <Check size={14} className="text-white" strokeWidth={3} />}
      </span>
      <span className={clsx("text-[15px]", checked ? "text-secondary line-through" : "text-primary")}>{label}</span>
    </button>
  );
}
