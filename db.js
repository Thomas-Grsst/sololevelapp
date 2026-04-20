// ============================================================
// SOLO LEVELING — Supabase DB Layer =
// ============================================================

let _supabase = null;

function getSupabase() {
  if (!_supabase) {
    _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return _supabase;
}

// ── Auth ─────────────────────────────────────────────────────

async function signUp(email, password, username) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });
  return { data, error };
}

async function signIn(email, password) {
  const sb = getSupabase();
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  return { data, error };
}

async function signOut() {
  const sb = getSupabase();
  await sb.auth.signOut();
}

async function getSession() {
  const sb = getSupabase();
  const {
    data: { session },
  } = await sb.auth.getSession();
  return session;
}

function onAuthChange(callback) {
  getSupabase().auth.onAuthStateChange(callback);
}

// ── Player ────────────────────────────────────────────────────

async function loadPlayer(userId) {
  const { data, error } = await getSupabase()
    .from("players")
    .select("*")
    .eq("id", userId)
    .single();
  return { data, error };
}

async function savePlayer(userId, fields) {
  const { data, error } = await getSupabase()
    .from("players")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single();
  return { data, error };
}

// ── Quest completions ─────────────────────────────────────────

async function loadQuestCompletions(userId, dayKey) {
  const { data, error } = await getSupabase()
    .from("quest_completions")
    .select("quest_id")
    .eq("player_id", userId)
    .eq("day_key", dayKey);
  return { data, error };
}

async function markQuestComplete(userId, questId, dayKey) {
  const { data, error } = await getSupabase()
    .from("quest_completions")
    .upsert(
      { player_id: userId, quest_id: questId, day_key: dayKey },
      { onConflict: "player_id,quest_id,day_key" },
    );
  return { data, error };
}

// ── Task progress ─────────────────────────────────────────────

async function loadTaskProgress(userId, dayKey) {
  const { data, error } = await getSupabase()
    .from("task_progress")
    .select("*")
    .eq("player_id", userId)
    .eq("day_key", dayKey);
  return { data, error };
}

async function saveTaskProgress(
  userId,
  questId,
  taskId,
  dayKey,
  value,
  completed,
) {
  const { data, error } = await getSupabase()
    .from("task_progress")
    .upsert(
      {
        player_id: userId,
        quest_id: questId,
        task_id: taskId,
        day_key: dayKey,
        value,
        completed,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "player_id,quest_id,task_id,day_key" },
    );
  return { data, error };
}
