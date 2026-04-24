-- ============================================================
-- SOLO LEVELING v3 — Supabase Schema
-- Copier-coller dans SQL Editor → Run
-- ============================================================

-- Players
create table if not exists public.players (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null default 'Joueur',
  level integer not null default 1,
  exp integer not null default 0,
  points integer not null default 0,
  gold integer not null default 0,
  total_quests_completed integer not null default 0,
  urgent_quests_completed integer not null default 0,
  streak integer not null default 0,
  last_active_day text default null,      -- 'YYYY-M-D'
  penalty_applied_day text default null,
  completed_trials text[] not null default '{}',
  unlocked_titles text[] not null default '{}',
  active_title text default null,
  stats jsonb not null default '{
    "force":5,"intelligence":5,"agilite":5,
    "endurance":5,"perception":5,"charisme":5,"richesse":5
  }'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Quest completions (daily)
create table if not exists public.quest_completions (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  quest_id text not null,
  day_key text not null,
  completed_at timestamptz default now(),
  unique(player_id, quest_id, day_key)
);

-- Task progress (daily + urgent)
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

-- Urgent quests
create table if not exists public.urgent_quests (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  instance_id text not null,
  quest_id text not null,
  day_key text not null,
  started_at timestamptz not null,
  expires_at timestamptz not null,
  completed boolean not null default false,
  failed boolean not null default false,
  unique(player_id, day_key)              -- 1 per day
);

-- Shop purchases
create table if not exists public.shop_purchases (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references public.players(id) on delete cascade,
  item_id text not null,
  purchased_at timestamptz default now()
);

-- Friendships
create table if not exists public.friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.players(id) on delete cascade,
  addressee_id uuid not null references public.players(id) on delete cascade,
  status text not null default 'pending',  -- 'pending' | 'accepted'
  created_at timestamptz default now(),
  unique(requester_id, addressee_id)
);

-- RLS
alter table public.players enable row level security;
alter table public.quest_completions enable row level security;
alter table public.task_progress enable row level security;
alter table public.urgent_quests enable row level security;
alter table public.shop_purchases enable row level security;
alter table public.friendships enable row level security;

create policy "players_own" on public.players for all using (auth.uid() = id);
create policy "players_read_all" on public.players for select using (true);
create policy "quest_completions_own" on public.quest_completions for all using (auth.uid() = player_id);
create policy "task_progress_own" on public.task_progress for all using (auth.uid() = player_id);
create policy "urgent_own" on public.urgent_quests for all using (auth.uid() = player_id);
create policy "shop_own" on public.shop_purchases for all using (auth.uid() = player_id);
create policy "friendships_own" on public.friendships for all using (auth.uid() = requester_id or auth.uid() = addressee_id);

-- Auto-create player on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.players (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', 'Joueur'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- TITRE ROI — Attribution manuelle par le créateur
-- ============================================================
-- Pour attribuer le titre "Roi" à un joueur, exécuter dans SQL Editor :
--
-- UPDATE public.players
-- SET unlocked_titles = array_append(unlocked_titles, 'roi')
-- WHERE username = 'NOM_DU_JOUEUR';
--
-- Pour le retirer :
-- UPDATE public.players
-- SET unlocked_titles = array_remove(unlocked_titles, 'roi'),
--     active_title = CASE WHEN active_title = 'roi' THEN NULL ELSE active_title END
-- WHERE username = 'NOM_DU_JOUEUR';

-- ============================================================
-- FIX RLS — Exécuter ce bloc dans SQL Editor Supabase
-- Remplace la policy générique par des policies précises
-- avec WITH CHECK pour garantir que les UPDATEs fonctionnent
-- ============================================================

-- 1. Supprimer toutes les policies existantes sur players
DROP POLICY IF EXISTS "players_own" ON public.players;
DROP POLICY IF EXISTS "players_select_own" ON public.players;
DROP POLICY IF EXISTS "players_update_own" ON public.players;
DROP POLICY IF EXISTS "players_insert_own" ON public.players;
DROP POLICY IF EXISTS "players_read_all" ON public.players;

-- 2. Recréer proprement
CREATE POLICY "players_select_own" ON public.players
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "players_update_own" ON public.players
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "players_insert_own" ON public.players
  FOR INSERT WITH CHECK (auth.uid() = id);
