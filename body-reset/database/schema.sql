-- BODY RESET — Supabase / PostgreSQL schema
-- Run once against a fresh Supabase project (SQL editor, or `supabase db push`
-- if you use the CLI). Safe to re-run — every statement is idempotent.

create extension if not exists "pgcrypto"; -- gen_random_uuid()

-- ======================================================================
-- CONTENT TABLES — same for every user, populated by database/seed.sql
-- (which is generated from the TypeScript content in /content via
-- `npx tsx scripts/generate-seed-sql.ts`, so app and DB never drift apart)
-- ======================================================================

create table if not exists meals (
  id serial primary key,
  code text unique not null,
  type text not null check (type in ('breakfast','lunch','dinner','snack')),
  title text not null,
  ingredients text[] not null default '{}',
  portion_hint text,
  instructions text
);

create table if not exists workouts (
  id serial primary key,
  code text unique not null,
  title text not null,
  location text not null check (location in ('home','gym')),
  duration_min int,
  difficulty text check (difficulty in ('beginner','intermediate'))
);

create table if not exists workout_exercises (
  id serial primary key,
  workout_code text not null references workouts(code) on delete cascade,
  position int not null,
  exercise_name text not null,
  sets text,
  reps text,
  rest text,
  instructions text
);

create table if not exists program_weeks (
  week_number int primary key,
  code text not null,
  title text not null,
  goal text
);

create table if not exists lessons (
  id text primary key,
  title text not null,
  body text not null
);

-- Generic per-day content library (spec section 45). `task_type` lets this
-- grow beyond a single daily habit task later (e.g. 'reflection') without a
-- schema migration.
create table if not exists daily_tasks (
  id serial primary key,
  day_number int not null,
  task_type text not null default 'habit',
  title text not null,
  description text
);

-- The resolved 56-day schedule: which meals / workout variant / lesson
-- belong to each day (spec section 12 "day content structure").
create table if not exists program_days (
  day_number int primary key check (day_number between 1 and 56),
  week_number int not null references program_weeks(week_number),
  breakfast_code text not null references meals(code),
  lunch_code text not null references meals(code),
  snack_code text not null references meals(code),
  dinner_code text not null references meals(code),
  workout_variant text check (workout_variant in ('A','B','C')),
  lesson_id text not null references lessons(id)
);

-- ======================================================================
-- USER TABLES — per-user, RLS-protected (spec section 45-46)
-- ======================================================================

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  telegram_id text unique not null,
  username text,
  first_name text,
  last_name text,
  language_code text,
  age int,
  height_cm int,
  initial_weight_kg numeric,
  current_weight_kg numeric,
  goals text[] default '{}',
  activity_level text,
  training_location text,
  training_frequency int default 3,
  obstacles text[] default '{}',
  medical_flag boolean default false,
  notifications_enabled boolean default true,
  program_started_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists program_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  day_number int not null,
  completed boolean not null default false,
  completed_at timestamptz,
  unique (user_id, day_number)
);

create table if not exists daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  day_number int not null,
  nutrition boolean default false,
  water boolean default false,
  workout boolean default false,
  activity boolean default false,
  sleep boolean default false,
  habit boolean default false,
  completed_at timestamptz,
  unique (user_id, day_number)
);

create table if not exists measurements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  date timestamptz not null default now(),
  weight_kg numeric,
  waist_cm numeric,
  hips_cm numeric,
  chest_cm numeric,
  thigh_cm numeric
);

create table if not exists progress_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  date timestamptz not null default now(),
  type text not null check (type in ('front','side','back')),
  storage_path text not null
);

create table if not exists weekly_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  week_number int not null,
  weight_kg numeric,
  waist_cm numeric,
  energy int,
  mood int,
  workouts_completed int,
  went_well text,
  was_hard text,
  unique (user_id, week_number)
);

create table if not exists ai_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  role text not null check (role in ('user','assistant')),
  message text not null,
  created_at timestamptz default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  status text not null default 'inactive' check (status in ('inactive','active','expired')),
  plan text not null default 'full_56',
  started_at timestamptz,
  expires_at timestamptz
);

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  event text not null,
  payload jsonb default '{}',
  created_at timestamptz default now()
);

-- updated_at trigger for users
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated_at on users;
create trigger trg_users_updated_at before update on users
  for each row execute function set_updated_at();

-- ======================================================================
-- ROW LEVEL SECURITY (spec section 46)
--
-- Content tables are public-read (identical for every user). User tables
-- have RLS enabled with NO public policies: this app authenticates via
-- Telegram `initData` (validated server-side, see
-- lib/telegram/validateInitData.ts), not Supabase Auth, so all reads/writes
-- to user tables go through API routes using the SERVICE ROLE key (which
-- bypasses RLS by design — the authorization check already happened in the
-- API route). RLS here is a defense-in-depth backstop against any future
-- direct client access, not the primary access-control mechanism.
--
-- If you later migrate to Supabase Auth for direct client reads, add
-- policies such as:
--   create policy "own row" on measurements for select using (auth.uid() = user_id);
-- ======================================================================

alter table meals enable row level security;
alter table workouts enable row level security;
alter table workout_exercises enable row level security;
alter table program_weeks enable row level security;
alter table lessons enable row level security;
alter table daily_tasks enable row level security;
alter table program_days enable row level security;

drop policy if exists "content is publicly readable" on meals;
create policy "content is publicly readable" on meals for select using (true);
drop policy if exists "content is publicly readable" on workouts;
create policy "content is publicly readable" on workouts for select using (true);
drop policy if exists "content is publicly readable" on workout_exercises;
create policy "content is publicly readable" on workout_exercises for select using (true);
drop policy if exists "content is publicly readable" on program_weeks;
create policy "content is publicly readable" on program_weeks for select using (true);
drop policy if exists "content is publicly readable" on lessons;
create policy "content is publicly readable" on lessons for select using (true);
drop policy if exists "content is publicly readable" on daily_tasks;
create policy "content is publicly readable" on daily_tasks for select using (true);
drop policy if exists "content is publicly readable" on program_days;
create policy "content is publicly readable" on program_days for select using (true);

alter table users enable row level security;
alter table program_progress enable row level security;
alter table daily_checkins enable row level security;
alter table measurements enable row level security;
alter table progress_photos enable row level security;
alter table weekly_reviews enable row level security;
alter table ai_messages enable row level security;
alter table subscriptions enable row level security;
alter table analytics_events enable row level security;
-- (intentionally no public policies on the tables above)
