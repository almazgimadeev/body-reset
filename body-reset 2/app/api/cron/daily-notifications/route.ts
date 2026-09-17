import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

// Daily notification job (spec section 44). Intended to be triggered once a
// day by an external scheduler — see vercel.json for a Vercel Cron example,
// or trigger it from any other scheduler that can hit an HTTPS endpoint.
//
// Protect it with CRON_SECRET so randos on the internet can't spam your
// users: call it as GET /api/cron/daily-notifications?secret=... or with
// header "Authorization: Bearer <CRON_SECRET>".

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.TELEGRAM_WEBAPP_URL || "https://example.com";

async function sendReminder(chatId: number, firstName: string, dayNumber: number) {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: `Доброе утро, ${firstName} ☀️\n\nСегодня День ${dayNumber}.\n\nТвоя задача — не сделать всё идеально. Просто открыть BODY RESET и пройти сегодняшний день.`,
      reply_markup: { inline_keyboard: [[{ text: `ОТКРЫТЬ ДЕНЬ ${dayNumber}`, web_app: { url: WEBAPP_URL } }]] },
    }),
  });
}

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const provided = req.nextUrl.searchParams.get("secret") || req.headers.get("authorization")?.replace("Bearer ", "");
  if (secret && provided !== secret) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ ok: true, note: "Supabase not configured — nothing to send in demo mode." });
  }

  // Expects a `users` table with telegram_id, first_name, program_started_at,
  // notifications_enabled — see database/schema.sql.
  const { data: users, error } = await supabase
    .from("users")
    .select("telegram_id, first_name, program_started_at")
    .eq("notifications_enabled", true)
    .not("program_started_at", "is", null);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let sent = 0;
  for (const user of users ?? []) {
    const started = new Date(user.program_started_at).getTime();
    const dayNumber = Math.min(56, Math.max(1, Math.floor((Date.now() - started) / 86400000) + 1));
    await sendReminder(Number(user.telegram_id), user.first_name || "", dayNumber);
    sent++;
  }

  return NextResponse.json({ ok: true, sent });
}
