import { NextRequest, NextResponse } from "next/server";

// Telegram Bot webhook handler — section 41-44 of the spec.
// Point BotFather's webhook at POST /api/telegram/webhook (see README for
// the exact `setWebhook` call). Without TELEGRAM_BOT_TOKEN configured this
// route responds 200 but does nothing, so builds/deploys never fail just
// because the bot isn't wired up yet.

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const WEBAPP_URL = process.env.TELEGRAM_WEBAPP_URL || "https://example.com";

async function sendMessage(chatId: number, text: string, webAppButtonText?: string) {
  if (!BOT_TOKEN) return;
  const reply_markup = webAppButtonText
    ? {
        inline_keyboard: [[{ text: webAppButtonText, web_app: { url: WEBAPP_URL } }]],
      }
    : undefined;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, reply_markup, parse_mode: "HTML" }),
  });
}

export async function POST(req: NextRequest) {
  if (!BOT_TOKEN) {
    // No bot configured yet — accept the request so Telegram doesn't retry,
    // but there's nothing to do.
    return NextResponse.json({ ok: true, note: "TELEGRAM_BOT_TOKEN not set — webhook is a no-op" });
  }

  const update = await req.json().catch(() => null);
  const message = update?.message;
  if (!message?.text || !message?.chat?.id) {
    return NextResponse.json({ ok: true });
  }

  const chatId: number = message.chat.id;
  const firstName: string = message.from?.first_name || "";
  const text: string = message.text.trim();

  if (text.startsWith("/start")) {
    await sendMessage(
      chatId,
      `Привет, ${firstName} 👋\n\nЭто BODY RESET — программа на 56 дней.\n\nЗдесь тебе не нужно каждый день думать, что есть и какую тренировку делать. Мы будем проходить программу шаг за шагом.\n\nГотова начать?`,
      "ОТКРЫТЬ BODY RESET"
    );
  } else if (text.startsWith("/help")) {
    await sendMessage(
      chatId,
      "Команды:\n/today — что сделать сегодня\n/progress — твой прогресс\n/profile — профиль\n/reset — сбросить прогресс (демо)"
    );
  } else if (text.startsWith("/today") || text.startsWith("/progress") || text.startsWith("/profile")) {
    await sendMessage(chatId, "Открой Mini App, чтобы увидеть актуальные данные — они всегда свежие там.", "ОТКРЫТЬ BODY RESET");
  } else if (text.startsWith("/reset")) {
    await sendMessage(chatId, "Сбросить прогресс можно на вкладке «Профиль» внутри приложения.", "ОТКРЫТЬ BODY RESET");
  } else {
    await sendMessage(chatId, "Не совсем поняла 🙂 Напиши /help, чтобы увидеть список команд.");
  }

  return NextResponse.json({ ok: true });
}
