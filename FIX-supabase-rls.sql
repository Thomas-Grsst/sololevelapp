-- ============================================================
-- SOLO LEVELING — FIX RLS (exécuter dans SQL Editor Supabase)
-- SAFE : ne supprime aucune donnée, only policies
-- ============================================================

-- 1. Supprimer les policies existantes sur players
DROP POLICY IF EXISTS "players_own" ON public.players;
DROP POLICY IF EXISTS "players_select_own" ON public.players;
DROP POLICY IF EXISTS "players_update_own" ON public.players;
DROP POLICY IF EXISTS "players_insert_own" ON public.players;
DROP POLICY IF EXISTS "players_read_all" ON public.players;

-- 2. Recréer proprement
-- Lecture publique (recherche d'amis, profils des autres joueurs)
CREATE POLICY "players_read_all" ON public.players
  FOR SELECT USING (true);

-- Mise à jour uniquement de son propre profil
CREATE POLICY "players_update_own" ON public.players
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insertion uniquement de son propre profil
CREATE POLICY "players_insert_own" ON public.players
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Colonnes trial (SAFE)
ALTER TABLE public.players
  ADD COLUMN IF NOT EXISTS trial_started_at timestamptz DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS trial_progress jsonb DEFAULT NULL;
