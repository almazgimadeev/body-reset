"use client";

import { ReactNode } from "react";
import { X } from "lucide-react";

export function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-primary/40 animate-fade-in">
      <div className="mx-auto w-full max-w-md animate-slide-up rounded-t-3xl bg-card p-6 pb-10">
        <div className="mb-4 flex justify-end">
          <button onClick={onClose} aria-label="Закрыть" className="rounded-full p-2 active:bg-bg">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
