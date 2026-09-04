"use client";

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Browser-side Supabase client. Only ever uses the public anon key — never
// the service role key (see spec section 58 — no secrets in the frontend).
let browserClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    // Demo mode: no Supabase project configured yet. Callers should fall
    // back to the local Zustand store (see lib/store.ts).
    return null;
  }

  if (!browserClient) {
    browserClient = createClient(url, anonKey);
  }
  return browserClient;
}
