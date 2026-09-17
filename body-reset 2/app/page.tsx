"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBodyResetStore } from "@/lib/store";

export default function RootPage() {
  const router = useRouter();
  const onboardingCompleted = useBodyResetStore((s) => s.profile.onboardingCompleted);
  const subscriptionStatus = useBodyResetStore((s) => s.subscription.status);

  useEffect(() => {
    if (!onboardingCompleted) {
      router.replace("/onboarding");
    } else if (subscriptionStatus !== "active") {
      router.replace("/paywall");
    } else {
      router.replace("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboardingCompleted, subscriptionStatus]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-3">
      <div className="text-2xl font-semibold tracking-tight text-primary">BODY RESET</div>
      <div className="text-[13px] text-secondary">Загрузка...</div>
    </div>
  );
}
