import { NextRequest, NextResponse } from "next/server";
import { getPaymentService } from "@/lib/payments/service";

// POST /api/payments/create — starts a payment for the 56-day program.
// In demo mode (default) this resolves instantly via MockPaymentProvider so
// the paywall → unlock flow can be tried end-to-end without a real payment
// provider. See lib/payments/service.ts and README "Payments" for how to
// wire up a real provider (Telegram Stars/Payments, YooKassa, ...).
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const userId = body?.userId ?? "demo-user";

  const service = getPaymentService();
  const result = await service.createPayment({ userId, amountRub: 5000, plan: "full_56" });
  const status = await service.checkPayment(result.paymentId);

  return NextResponse.json({ ...result, status: status.status });
}
