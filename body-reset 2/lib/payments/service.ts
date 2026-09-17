// Modular payment layer. The app talks only to this interface, never to a
// specific provider's SDK directly — so a real provider (Telegram
// Payments/Stars, YooKassa, CloudPayments, ...) can be plugged in later
// without touching UI code. See README "Payments" section for notes on
// Telegram's rules for digital goods.

export interface CreatePaymentInput {
  userId: string;
  amountRub: number;
  plan: "full_56";
}

export interface CreatePaymentResult {
  paymentId: string;
  redirectUrl?: string; // where to send the user to complete payment, if applicable
}

export interface PaymentStatus {
  paymentId: string;
  status: "pending" | "paid" | "failed" | "canceled";
}

export interface PaymentService {
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>;
  checkPayment(paymentId: string): Promise<PaymentStatus>;
  activateSubscription(userId: string, paymentId: string): Promise<void>;
}

// --- Mock provider -----------------------------------------------------
// Auto-approves after a short delay so the paywall → unlock flow can be
// demoed end-to-end without a real payment provider configured.

const mockPayments = new Map<string, PaymentStatus>();

export class MockPaymentProvider implements PaymentService {
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult> {
    const paymentId = `mock_${input.userId}_${Date.now()}`;
    mockPayments.set(paymentId, { paymentId, status: "pending" });
    // Simulate instant success in demo mode.
    mockPayments.set(paymentId, { paymentId, status: "paid" });
    return { paymentId };
  }

  async checkPayment(paymentId: string): Promise<PaymentStatus> {
    return mockPayments.get(paymentId) ?? { paymentId, status: "failed" };
  }

  async activateSubscription(): Promise<void> {
    // In demo mode this is a no-op — the client-side store flips
    // subscription.status to "active" directly. In production this would
    // write to the `subscriptions` table via the Supabase server client.
    return;
  }
}

export function getPaymentService(): PaymentService {
  const provider = process.env.PAYMENT_PROVIDER;
  // Real providers (e.g. "telegram_stars", "yookassa") would be switched in
  // here once implemented. Falling back to mock keeps the app fully
  // functional before a provider is wired up.
  if (!provider || provider === "mock") return new MockPaymentProvider();
  throw new Error(
    `PAYMENT_PROVIDER="${provider}" is not implemented yet. Implement a PaymentService for it in lib/payments/, or unset the env var to use the mock provider.`
  );
}
