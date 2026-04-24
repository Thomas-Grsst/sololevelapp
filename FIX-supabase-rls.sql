-- ============================================================
-- SOLO LEVELING — FIX RLS (à exécuter dans SQL Editor)
-- Ce fichier règle le bug de sauvegarde des stats/points
-- ============================================================

-- Supprimer toutes les policies existantes sur players
DROP POLICY IF EXISTS "players_own" ON public.players;
DROP POLICY IF EXISTS "players_select_own" ON public.players;
DROP POLICY IF EXISTS "players_update_own" ON public.players;
DROP POLICY IF EXISTS "players_insert_own" ON public.players;
DROP POLICY IF EXISTS "players_read_all" ON public.players;

-- Recréer avec WITH CHECK (requis pour que les UPDATEs passent)

-- Lecture de son propre profil (écriture, chargement)
CREATE POLICY "players_select_own" ON public.players
  FOR SELECT USING (auth.uid() = id);

-- Lecture publique (recherche d'amis, profils des autres joueurs)
-- IMPORTANT : sans cette policy, la recherche d'amis ne fonctionne pas
CREATE POLICY "players_read_all" ON public.players
  FOR SELECT USING (true);

CREATE POLICY "players_update_own" ON public.players
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "players_insert_own" ON public.players
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Ajouter la colonne completed_trials si elle n'existe pas
ALTER TABLE public.players
  ADD COLUMN IF NOT EXISTS completed_trials text[] NOT NULL DEFAULT '{}';
