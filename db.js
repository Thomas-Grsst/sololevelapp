// ============================================================
// SOLO LEVELING v3 — DB Layer
// ============================================================
let _sb = null;
function sb() {
  if (!_sb) _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _sb;
}

// ── Auth ──────────────────────────────────────────────────────
async function authSignUp(email, password, username) {
  return sb().auth.signUp({ email, password, options: { data: { username } } });
}
async function authSignIn(email, password) {
  return sb().auth.signInWithPassword({ email, password });
}
async function authSignOut() {
  return sb().auth.signOut();
}

// async function authSession() {
//   const {
//     data: { session },
//   } = await sb().auth.getSession();
//   return session;
// }

// ── Player ────────────────────────────────────────────────────
async function dbLoadPlayer(uid) {
  return sb().from("players").select("*").eq("id", uid).maybeSingle();
}

// Atomic upsert — saves everything in one call to prevent data loss
async function dbSavePlayer(uid, fields) {
  const { data, error } = await sb()
    .from("players")
    .update({ ...fields, updated_at: new Date().toISOString() })
    .eq("id", uid)
    .select("*")
    .single();
  if (error) console.error("dbSavePlayer error", error);
  return { data, error };
}

// ── Quest completions ─────────────────────────────────────────
async function dbLoadQuestCompletions(uid, dayKey) {
  return sb()
    .from("quest_completions")
    .select("quest_id")
    .eq("player_id", uid)
    .eq("day_key", dayKey);
}
async function dbMarkQuestDone(uid, questId, dayKey) {
  return sb()
    .from("quest_completions")
    .upsert(
      { player_id: uid, quest_id: questId, day_key: dayKey },
      { onConflict: "player_id,quest_id,day_key" },
    );
}

// ── Task progress ─────────────────────────────────────────────
async function dbLoadTasks(uid, dayKey) {
  return sb()
    .from("task_progress")
    .select("*")
    .eq("player_id", uid)
    .eq("day_key", dayKey);
}
async function dbSaveTask(uid, questId, taskId, dayKey, value, completed) {
  return sb().from("task_progress").upsert(
    {
      player_id: uid,
      quest_id: questId,
      task_id: taskId,
      day_key: dayKey,
      value,
      completed,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "player_id,quest_id,task_id,day_key" },
  );
}

// ── Urgent quests ─────────────────────────────────────────────
async function dbLoadTodayUrgent(uid, dayKey) {
  return sb()
    .from("urgent_quests")
    .select("*")
    .eq("player_id", uid)
    .eq("day_key", dayKey)
    .maybeSingle();
}
async function dbCreateUrgent(uid, inst, dayKey) {
  return sb()
    .from("urgent_quests")
    .insert({
      player_id: uid,
      instance_id: inst.instanceId,
      quest_id: inst.questId,
      day_key: dayKey,
      started_at: new Date(inst.startedAt).toISOString(),
      expires_at: new Date(inst.startedAt + inst.timeLimitMs).toISOString(),
    });
}
async function dbCompleteUrgent(uid, dayKey) {
  return sb()
    .from("urgent_quests")
    .update({ completed: true })
    .eq("player_id", uid)
    .eq("day_key", dayKey);
}
async function dbFailUrgent(uid, dayKey) {
  return sb()
    .from("urgent_quests")
    .update({ failed: true })
    .eq("player_id", uid)
    .eq("day_key", dayKey);
}

// ── Friends ───────────────────────────────────────────────────
async function dbSearchPlayers(query) {
  return sb()
    .from("players")
    .select("id,username,level,active_title,unlocked_titles,stats")
    .ilike("username", `%${query}%`)
    .limit(10);
}
async function dbGetFriends(uid) {
  const { data, error } = await sb()
    .from("friendships")
    .select(
      `
      id, status, requester_id, addressee_id,
      requester:players!friendships_requester_id_fkey(id,username,level,active_title,streak,stats),
      addressee:players!friendships_addressee_id_fkey(id,username,level,active_title,streak,stats)
    `,
    )
    .or(`requester_id.eq.${uid},addressee_id.eq.${uid}`);
  return { data, error };
}
async function dbSendFriendRequest(requesterId, addresseeId) {
  return sb()
    .from("friendships")
    .insert({ requester_id: requesterId, addressee_id: addresseeId });
}
async function dbAcceptFriend(uid, friendshipId) {
  return sb()
    .from("friendships")
    .update({ status: "accepted" })
    .eq("id", friendshipId);
}
async function dbRemoveFriend(friendshipId) {
  return sb().from("friendships").delete().eq("id", friendshipId);
}

// ── Current user ──────────────────────────────────────────────
async function authUser() {
  const {
    data: { user },
  } = await sb().auth.getUser();
  return user;
}

// ── Player helpers ────────────────────────────────────────────
async function getPlayer() {
  const user = await authUser();
  if (!user) return null;

  const { data, error } = await dbLoadPlayer(user.id);

  if (error) {
    console.error("getPlayer error:", error);
    return null;
  }

  return data;
}

async function createPlayer() {
  const user = await authUser();
  if (!user) return null;

  const { error } = await sb()
    .from("players")
    .insert({
      id: user.id,
      username: user.user_metadata?.username || "Joueur",
    });

  if (error) {
    console.error("createPlayer error:", error);
  }
}
