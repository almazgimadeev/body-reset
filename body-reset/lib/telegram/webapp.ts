"use client";

// Thin wrapper around window.Telegram.WebApp. In demo mode (no Telegram
// context — e.g. developing in a regular browser) it degrades gracefully so
// the rest of the app never has to check "am I in Telegram?" everywhere.

export interface TelegramWebAppLike {
  initData: string;
  initDataUnsafe: { user?: { id: number; first_name: string; username?: string } };
  colorScheme: "light" | "dark";
  themeParams: Record<string, string>;
  ready: () => void;
  expand: () => void;
  BackButton: { show: () => void; hide: () => void; onClick: (cb: () => void) => void };
  MainButton: {
    text: string;
    show: () => void;
    hide: () => void;
    setText: (t: string) => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  HapticFeedback?: { impactOccurred: (style: string) => void; notificationOccurred: (type: string) => void };
}

declare global {
  interface Window {
    Telegram?: { WebApp: TelegramWebAppLike };
  }
}

export function getTelegramWebApp(): TelegramWebAppLike | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function isRunningInTelegram(): boolean {
  return !!getTelegramWebApp()?.initData;
}

export function initTelegramWebApp(): void {
  const tg = getTelegramWebApp();
  if (!tg) return;
  tg.ready();
  tg.expand();
}

export function hapticTap(): void {
  getTelegramWebApp()?.HapticFeedback?.impactOccurred("light");
}

export function hapticSuccess(): void {
  getTelegramWebApp()?.HapticFeedback?.notificationOccurred("success");
}

// Demo-mode user used whenever the app is opened outside Telegram
// (NEXT_PUBLIC_DEMO_MODE=true, or simply no Telegram context detected).
export const DEMO_TELEGRAM_USER = {
  id: 0,
  first_name: "Демо",
  username: "demo_user",
};
