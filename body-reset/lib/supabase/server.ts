import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only Supabase client using the service role key. Import this file
// exclusively from API routes / server actions / server components — the
// "server-only" import above makes it a build error to pull it into a
// client bundle by accident.
export function getSupabaseServerClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
