"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Salad, Dumbbell, LineChart, MessageCircle } from "lucide-react";
import clsx from "clsx";

const TABS = [
  { href: "/home", label: "Главная", icon: Home },
  { href: "/food", label: "Питание", icon: Salad },
  { href: "/workout", label: "Тренировка", icon: Dumbbell },
  { href: "/progress", label: "Прогресс", icon: LineChart },
  { href: "/coach", label: "AI Coach", icon: MessageCircle },
];

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-40 mx-auto max-w-md border-t border-border bg-card/95 backdrop-blur">
      <div className="flex items-stretch justify-between px-1">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex min-h-[56px] flex-1 flex-col items-center justify-center gap-0.5 py-1.5"
            >
              <Icon size={22} strokeWidth={active ? 2.4 : 1.8} className={active ? "text-primary" : "text-secondary"} />
              <span className={clsx("text-[10px]", active ? "font-medium text-primary" : "text-secondary")}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
