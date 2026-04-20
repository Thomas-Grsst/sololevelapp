-- ============================================================
-- SOLO LEVELING — Supabase Schema
-- Copiez-collez ce SQL dans l'éditeur SQL de Supabase
-- =============================================================

-- Table des joueurs
create table if not exists public.players (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null default 'Joueur',
  level integer not null default 1,
  exp integer not null default 0,
  points integer not null default 0,
  total_quests_completed integer not null default 0,
  stats jsonb not null default '{
    "force": 5,
    "intelligence": 5,
    "agilite": 5,
    "endurance": 5,
    "perception": 5,
    "charisme": 5
  }'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table des quêtes complétées (par jour)
create table if not exists public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  quest_id text not null,
  day_key text not null,   -- format: YYYY-M-D
  completed_at timestamptz default now(),
  unique(player_id, quest_id, day_key)
);

-- Table des tâches (valeurs entrées)
create table if not exists public.task_progress (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  quest_id text not null,
  task_id text not null,
  day_key text not null,
  value integer not null default 0,
  completed boolean not null default false,
  updated_at timestamptz default now(),
  unique(player_id, quest_id, task_id, day_key)
);

-- RLS (Row Level Security)
alter table public.players enable row level security;
alter table public.quest_completions enable row level security;
alter table public.task_progress enable row level security;

-- Policies : chaque utilisateur ne voit et ne modifie que ses propres données
create policy "players_own" on public.players
  for all using (auth.uid() = id);

create policy "quest_completions_own" on public.quest_completions
  for all using (auth.uid() = player_id);

create policy "task_progress_own" on public.task_progress
  for all using (auth.uid() = player_id);

-- Trigger pour créer automatiquement un joueur à l'inscription
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.players (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', 'Joueur'));
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
