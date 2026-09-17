"use client";

import { useEffect } from "react";
import { initTelegramWebApp, isRunningInTelegram, getTelegramWebApp } from "@/lib/telegram/webapp";
import { useBodyResetStore } from "@/lib/store";

// Mounted once in the root layout. Boots the Telegram WebApp SDK (ready +
// expand) and, if running inside Telegram, syncs the first name / id into
// the local store so the rest of the app can personalize immediately.
// Outside Telegram it's a no-op — the app runs in demo mode.
export function TelegramBoot() {
  const setFirstName = useBodyResetStore((s) => s.setFirstName);
  const setTelegramId = useBodyResetStore((s) => s.setTelegramId);
  const firstName = useBodyResetStore((s) => s.profile.firstName);

  useEffect(() => {
    initTelegramWebApp();
    if (isRunningInTelegram()) {
      const tgUser = getTelegramWebApp()?.initDataUnsafe.user;
      if (tgUser) {
        setTelegramId(String(tgUser.id));
        if (!firstName) setFirstName(tgUser.first_name || "");
      }
    } else if (!firstName) {
      setFirstName("Демо");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
