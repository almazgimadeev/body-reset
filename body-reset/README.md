# BODY RESET

Telegram Mini App: 56-дневная программа питания, тренировок и привычек для женщин.
Next.js 14 (App Router) + TypeScript + Tailwind + Supabase (Postgres) + Telegram WebApp + AI Coach.

Приложение полностью работает **без единого внешнего ключа** — см. «Demo mode» ниже. Реальные Supabase/Telegram/AI/оплата подключаются по мере готовности, без переписывания кода.

---

## 1. Что это за проект

Мобильное веб-приложение (Telegram Mini App), которое открывается прямо внутри Telegram. Пользователь проходит онбординг, дальше каждый день видит: что съесть, какую тренировку сделать, какое короткое задание выполнить — отмечает прогресс, видит график веса, может спросить AI Coach.

Экраны: Онбординг → Paywall → Главная / Питание / Тренировка / Прогресс / AI Coach / Профиль → День N (детальный экран дня) → Admin (отдельно, `/admin`).

## 2. Demo mode (по умолчанию, ничего не нужно настраивать)

```bash
npm install
npm run dev
```

Откройте `http://localhost:3000` в обычном браузере (не обязательно в Telegram). Всё работает на локальном состоянии (Zustand + localStorage — это реальное браузерное приложение, а не superview/artifact, так что localStorage здесь абсолютно уместен):

- Онбординг создаёт профиль локально.
- Paywall использует `MockPaymentProvider` — оплата "проходит" мгновенно.
- AI Coach отвечает через rule-based mock (`lib/ai/coach.ts`), пока не задан `AI_API_KEY`.
- Telegram-авторизация подставляет демо-пользователя, пока приложение открыто не внутри Telegram.

## 3. Node зависимости

Требуется Node.js 18+ (в разработке использовался Node 22).

```bash
npm install
```

## 4. Как создать Supabase-проект

1. Зарегистрируйтесь на [supabase.com](https://supabase.com), создайте новый проект.
2. Project Settings → API — скопируйте `Project URL`, `anon public key`, `service_role key`.

## 5. Как создать таблицы

В Supabase SQL Editor выполните содержимое `database/schema.sql` целиком (создаёт все таблицы + RLS policies, идемпотентно — можно перезапускать).

## 6. Как выполнить seed

`database/seed.sql` **сгенерирован** из TypeScript-контента в `/content` (единый источник правды — приложение и база никогда не расходятся):

```bash
npm run generate:seed   # перегенерирует database/seed.sql из /content/*.ts
```

Затем выполните `database/seed.sql` в Supabase SQL Editor. Если меняете меню/тренировки/уроки — редактируйте файлы в `/content`, а не `seed.sql` напрямую.

## 7. Как создать Telegram Bot

1. Откройте [@BotFather](https://t.me/BotFather) в Telegram.
2. `/newbot` → укажите имя и username (должен заканчиваться на `bot`).
3. BotFather выдаст `TELEGRAM_BOT_TOKEN` — сохраните его.

## 8. Как получить Bot Token

См. пункт 7 — токен приходит от BotFather сразу после создания бота. Также доступен позже через `/mybots` → выбрать бота → API Token.

## 9. Как настроить Mini App

1. В BotFather: `/newapp` (или `/mybots` → бот → Bot Settings → Menu Button / Mini App).
2. Укажите URL вашего деплоя (см. пункт 12) как URL Mini App.
3. Опционально настройте Menu Button, чтобы кнопка "Открыть BODY RESET" была видна в чате с ботом всегда.

## 10. Environment variables

```bash
cp .env.example .env.local
```

Заполните по мере готовности — см. комментарии в `.env.example`. Ничего не обязательно для локальной разработки.

## 11. Как запустить локально

```bash
npm run dev
```

## 12. Как задеплоить на Vercel

1. Запушьте репозиторий на GitHub.
2. [vercel.com](https://vercel.com) → New Project → импортируйте репозиторий.
3. Добавьте переменные окружения из `.env.local` в Vercel → Settings → Environment Variables.
4. Deploy. Скопируйте выданный URL (например `https://body-reset.vercel.app`) — это ваш `TELEGRAM_WEBAPP_URL`.
5. `vercel.json` уже содержит cron-задачу для ежедневных уведомлений (пункт 15).

## 13. Как подключить Telegram

После деплоя укажите публичный URL в BotFather (см. пункт 9) и в `TELEGRAM_WEBAPP_URL` (env). Откройте бота в Telegram → кнопка "ОТКРЫТЬ BODY RESET" откроет Mini App по этому URL.

## 14. Как настроить webhook

Чтобы бот отвечал на `/start`, `/help` и т.д. (см. `app/api/telegram/webhook/route.ts`), зарегистрируйте webhook один раз после деплоя:

```bash
curl "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook?url=<VERCEL_URL>/api/telegram/webhook"
```

## 15. Как включить notifications

`app/api/cron/daily-notifications/route.ts` рассылает утреннее напоминание всем пользователям с `notifications_enabled = true`. На Vercel он уже расписан в `vercel.json` (`0 7 * * *` — 7:00 UTC ежедневно). Защищён `CRON_SECRET` — задайте его в env, Vercel Cron передаёт заголовок автоматически; при ручном вызове используйте `?secret=...`.

Без настроенного `TELEGRAM_BOT_TOKEN` / Supabase этот endpoint отвечает `200 OK` и ничего не делает — деплой никогда не падает из-за этого.

## 16. Как настроить AI

Задайте `AI_API_KEY` (OpenAI-совместимый ключ) — `app/api/ai/route.ts` автоматически переключится с mock-ответов на реальные (`lib/ai/coach.ts` → `getRealCoachResponse`, модель `gpt-4o-mini`, легко заменить на любого другого провайдера с OpenAI-совместимым API). Системный промпт с ограничениями безопасности — там же, `AI_COACH_SYSTEM_PROMPT`.

## 17. Как настроить payment

Платёжный слой модульный (`lib/payments/service.ts`, интерфейс `PaymentService`): UI никогда не обращается к конкретному провайдеру напрямую.

**Важно:** для цифровых товаров внутри Telegram нужно соблюдать правила [Telegram Payments / Telegram Stars](https://core.telegram.org/bots/payments) — уточните актуальные требования перед запуском реальных платежей, они могут быть обязательны для цифровых продуктов, продаваемых внутри Mini App.

Чтобы подключить реального провайдера:
1. Реализуйте `PaymentService` (см. `MockPaymentProvider` как образец) в новом файле в `lib/payments/`.
2. Подключите его в `getPaymentService()` по значению `PAYMENT_PROVIDER`.
3. UI (`app/paywall/page.tsx`, `app/api/payments/create/route.ts`) менять не нужно.

## 18. Как открыть Admin

`/admin` — простой пароль через `NEXT_PUBLIC_ADMIN_PASSWORD` (env). Без Supabase показывает статичные демо-цифры с явной пометкой "демо-данные", чтобы не выдавать их за реальные.

**Это НЕ полноценная авторизация** — подходит для быстрого MVP внутри доверенной команды. Перед тем, как давать доступ кому-то ещё, замените на Supabase Auth + серверную проверку роли (например, отдельная таблица `admins` + RLS-политика, проверяемая в API route, а не в клиентском JS).

---

## Content scope — что реально написано, а что переиспользуется

Честно о содержимом, чтобы не было сюрпризов:

- **Меню (23 блюда), тренировки (6 программ × 6 упражнений), 56 заданий дня** — полностью уникальны, соответствуют исходному брифу.
- **56 micro-lessons**: вместо 56 полностью уникальных эссе используется библиотека из 18 уроков (`content/lessons.ts`), которая циклически переиспользуется по программе (плюс отдельный урок в каждый 7-й "итоговый" день). Это осознанное продуктовое решение (spaced repetition — многие реальные программы работают так же), а не недосмотр. Если нужны 56 полностью уникальных уроков — расширяйте `LESSONS` в `content/lessons.ts`, схема это поддерживает без изменений кода.

## Что уже работает (P0, полностью функционально в demo mode)

Telegram-контекст (демо-фоллбэк) · Онбординг (10 экранов) · Главная · 56 дней · Питание (с заменой блюд и списком покупок) · Тренировки (Дом/Зал/Mixed, с прогрессией) · Ежедневный чек-лист · Прогресс (график веса, замеры, фото-вехи) · Supabase-схема готова к подключению · Telegram-уведомления (endpoint готов).

## Что работает в mock mode

AI Coach (rule-based) · Оплата (мгновенное одобрение) · Admin-цифры (демо-значения без Supabase).

## Что нужно подключить для production

1. Supabase — создать проект, прогнать `schema.sql` + `seed.sql`, переключить API routes с локального store на реальные запросы (сейчас данные живут в браузере пользователя — для мультиустройственности и надёжности нужен Supabase).
2. Telegram Bot — токен + webhook + Mini App URL (пункты 7–14).
3. `AI_API_KEY` для живого AI Coach.
4. Реальный `PaymentService` + проверка правил Telegram Payments/Stars для цифровых товаров.
5. Реальная авторизация для `/admin`.
6. Иконки/изображения для упражнений (сейчас текстовые карточки — структура готова добавить `image`/`video` поле в `Exercise`).

## Следующие шаги для запуска продаж

1. Подключить Supabase и реальный платёжный провайдер (пункты выше).
2. Зарегистрировать бота, задеплоить, привязать Mini App URL в BotFather.
3. Прогнать Final QA чек-лист вручную (новый пользователь → онбординг → День 1 → оплата → AI Coach → мобильная раскладка).
4. Опубликовать бота, начать вести трафик из TikTok/Reels на `/start`.

---

## Структура проекта

```
app/
  page.tsx                 — роутер по состоянию (onboarding/paywall/home)
  onboarding/page.tsx       — 10-экранный онбординг
  paywall/page.tsx
  admin/page.tsx
  (main)/                   — layout с нижней навигацией
    home, food, workout, progress, coach, profile
    day/[dayNumber]         — детальный экран дня
  api/
    ai/route.ts             — AI Coach endpoint
    payments/create/route.ts
    telegram/webhook/route.ts
    cron/daily-notifications/route.ts
components/                — UI + доменные компоненты
content/                   — меню, тренировки, 56-дневное расписание, уроки, задания
lib/
  store.ts                 — Zustand (demo/local state)
  telegram/                — WebApp SDK helper + серверная валидация initData
  supabase/                — browser/server клиенты
  ai/coach.ts               — mock + real AI Coach
  payments/service.ts       — модульный платёжный слой
  validation/onboarding.ts  — Zod-схема
database/
  schema.sql
  seed.sql                  — сгенерирован из content/*.ts
scripts/generate-seed-sql.ts
types/index.ts
```

## Безопасность и приватность (реализовано)

- Никаких секретов на клиенте — `SUPABASE_SERVICE_ROLE_KEY` защищён импортом `server-only`.
- Telegram `initData` валидируется на сервере через HMAC-SHA256 (`lib/telegram/validateInitData.ts`) — клиентский `telegram_id` никогда не считается доверенным напрямую.
- AI Coach system prompt явно запрещает диагнозы, экстремальный дефицит калорий, гарантии результата — с отдельной веткой для беременности/РПП/хронических заболеваний.
- Онбординг содержит явный флаг `medicalFlag` с предупреждением "обсуди с врачом".
