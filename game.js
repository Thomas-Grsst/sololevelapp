// ============================================================
// SOLO LEVELING — Game Logic
// ============================================================

const RANKS = [
  { name: 'E',        minLvl: 1,   color: '#9B9A94', glow: 'rgba(155,154,148,0.4)',  bg: 'rgba(155,154,148,0.08)' },
  { name: 'D',        minLvl: 5,   color: '#6BBF25', glow: 'rgba(107,191,37,0.4)',   bg: 'rgba(107,191,37,0.08)' },
  { name: 'C',        minLvl: 10,  color: '#3E99E8', glow: 'rgba(62,153,232,0.4)',   bg: 'rgba(62,153,232,0.08)' },
  { name: 'B',        minLvl: 20,  color: '#D4891A', glow: 'rgba(212,137,26,0.4)',   bg: 'rgba(212,137,26,0.08)' },
  { name: 'A',        minLvl: 35,  color: '#E0623C', glow: 'rgba(224,98,60,0.4)',    bg: 'rgba(224,98,60,0.08)' },
  { name: 'S',        minLvl: 50,  color: '#D94C7A', glow: 'rgba(217,76,122,0.4)',   bg: 'rgba(217,76,122,0.08)' },
  { name: 'SS',       minLvl: 70,  color: '#8B82E8', glow: 'rgba(139,130,232,0.5)',  bg: 'rgba(139,130,232,0.1)' },
  { name: 'SSS',      minLvl: 90,  color: '#5A50C8', glow: 'rgba(90,80,200,0.55)',   bg: 'rgba(90,80,200,0.12)' },
  { name: 'SSS+',     minLvl: 110, color: '#BDB5FF', glow: 'rgba(189,181,255,0.55)', bg: 'rgba(189,181,255,0.12)' },
  { name: 'National', minLvl: 140, color: '#E8DEFF', glow: 'rgba(232,222,255,0.6)',  bg: 'rgba(232,222,255,0.1)' },
  { name: 'Monarque', minLvl: 200, color: '#FFD700', glow: 'rgba(255,215,0,0.7)',    bg: 'rgba(255,215,0,0.1)' },
];

const STATS_META = [
  { key: 'force',        label: 'Force',        color: '#E0623C', icon: '⚔️', desc: 'Puissance physique brute' },
  { key: 'intelligence', label: 'Intelligence', color: '#8B82E8', icon: '🧠', desc: 'Agilité mentale et apprentissage' },
  { key: 'agilite',      label: 'Agilité',      color: '#2EC4A0', icon: '💨', desc: 'Vitesse et coordination' },
  { key: 'endurance',    label: 'Endurance',    color: '#D4891A', icon: '🛡️', desc: 'Résistance et stamina' },
  { key: 'perception',   label: 'Perception',   color: '#3E99E8', icon: '👁️', desc: 'Conscience et intuition' },
  { key: 'charisme',     label: 'Charisme',     color: '#D94C7A', icon: '✨', desc: 'Présence et apparence' },
];

function expRequired(level) {
  return Math.floor(100 * Math.pow(1.25, level - 1));
}

function getRankForLevel(level) {
  let rank = RANKS[0];
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLvl) { rank = RANKS[i]; break; }
  }
  return rank;
}

function getNextRank(level) {
  for (let i = 0; i < RANKS.length; i++) {
    if (RANKS[i].minLvl > level) return RANKS[i];
  }
  return null;
}

function getTaskRequired(task, stats) {
  if (task.type === 'check') return 1;
  if (task.type === 'timer') {
    const bonus = Math.floor(Math.max(0, (stats[task.scaleKey] - 5)) * 0.6);
    return Math.max(task.baseMin, task.baseMin + bonus);
  }
  const bonus = Math.floor(Math.max(0, (stats[task.scaleKey] - 5)) * 1.5);
  return Math.max(task.baseReps, task.baseReps + bonus);
}

function buildQuests(stats) {
  return [
    {
      id: 'physique', title: 'Quête physique', subtitle: 'Forge ton corps',
      expReward: 40, statKey: 'force', color: '#E0623C', icon: '⚔️',
      tasks: [
        { id: 'pushup', name: 'Pompes',    type: 'reps', baseReps: 10, scaleKey: 'force',     unit: 'rép.' },
        { id: 'squat',  name: 'Squats',    type: 'reps', baseReps: 10, scaleKey: 'force',     unit: 'rép.' },
        { id: 'dip',    name: 'Dips',      type: 'reps', baseReps: 8,  scaleKey: 'force',     unit: 'rép.' },
        { id: 'pullup', name: 'Tractions', type: 'reps', baseReps: 5,  scaleKey: 'force',     unit: 'rép.' },
      ],
    },
    {
      id: 'endurance', title: 'Quête endurance', subtitle: 'Repousse tes limites',
      expReward: 30, statKey: 'endurance', color: '#D4891A', icon: '🛡️',
      tasks: [
        { id: 'plank',  name: 'Planche',  type: 'reps', baseReps: 30, scaleKey: 'endurance', unit: 'sec' },
        { id: 'crunch', name: 'Abdos',    type: 'reps', baseReps: 15, scaleKey: 'endurance', unit: 'rép.' },
        { id: 'burpee', name: 'Burpees',  type: 'reps', baseReps: 8,  scaleKey: 'agilite',   unit: 'rép.' },
      ],
    },
    {
      id: 'intelligence', title: 'Quête mentale', subtitle: 'Aiguise ton esprit',
      expReward: 35, statKey: 'intelligence', color: '#8B82E8', icon: '🧠',
      tasks: [
        { id: 'focus', name: 'Concentration', type: 'timer', baseMin: 10, scaleKey: 'intelligence', desc: 'Focus total, sans distraction' },
        { id: 'read',  name: 'Lecture',       type: 'timer', baseMin: 15, scaleKey: 'intelligence', desc: 'Livre ou article sérieux' },
        { id: 'learn', name: 'Apprentissage', type: 'timer', baseMin: 10, scaleKey: 'intelligence', desc: 'Cours, tutoriel, pratique' },
      ],
    },
    {
      id: 'charisme', title: 'Quête charisme', subtitle: 'Prends soin de toi',
      expReward: 25, statKey: 'charisme', color: '#D94C7A', icon: '✨',
      tasks: [
        { id: 'douche',  name: 'Douche',              type: 'check', desc: 'Corps propre' },
        { id: 'rasage',  name: 'Rasage / épilation',  type: 'check', desc: 'Visage soigné' },
        { id: 'dents',   name: 'Brossage des dents',  type: 'check', desc: '2× minimum' },
        { id: 'soin',    name: 'Soin du visage',      type: 'check', desc: 'Hydratation, nettoyage' },
        { id: 'tenue',   name: 'Tenue soignée',       type: 'check', desc: 'Habillé proprement' },
      ],
    },
    {
      id: 'agilite', title: 'Quête agilité', subtitle: 'Vitesse & coordination',
      expReward: 28, statKey: 'agilite', color: '#2EC4A0', icon: '💨',
      tasks: [
        { id: 'jump',   name: 'Sauts',          type: 'reps', baseReps: 20, scaleKey: 'agilite', unit: 'rép.' },
        { id: 'skip',   name: 'Corde à sauter', type: 'reps', baseReps: 50, scaleKey: 'agilite', unit: 'rép.' },
        { id: 'sprint', name: 'Sprints',        type: 'reps', baseReps: 5,  scaleKey: 'agilite', unit: 'séries' },
      ],
    },
    {
      id: 'perception', title: 'Quête perception', subtitle: 'Sens aiguisés',
      expReward: 20, statKey: 'perception', color: '#3E99E8', icon: '👁️',
      tasks: [
        { id: 'medite',  name: 'Méditation', type: 'timer', baseMin: 10, scaleKey: 'perception', desc: 'Pleine conscience, respiration' },
        { id: 'journal', name: 'Journal',    type: 'timer', baseMin: 5,  scaleKey: 'perception', desc: 'Écrire ses pensées du jour' },
      ],
    },
  ];
}

// ============================================================
// TITRES DÉBLOQUABLES
// ============================================================
// condition: { type, ... }
//   type: 'level'       → atteindre un certain niveau
//   type: 'rank'        → atteindre un certain rang
//   type: 'stat'        → une stat >= valeur
//   type: 'quests'      → total quêtes complétées >= valeur
//   type: 'urgent'      → quêtes urgentes complétées >= valeur
//   type: 'allstats'    → toutes les stats >= valeur
// ============================================================

const TITLES = [
  // Départ
  { id: 'newbie',      label: 'Éveillé',            rarity: 'common',    color: '#9B9A94', condition: { type: 'level',    value: 1  }, desc: 'Bienvenue dans le système.' },
  { id: 'determined',  label: 'Déterminé',          rarity: 'common',    color: '#9B9A94', condition: { type: 'quests',   value: 5  }, desc: 'Compléter 5 quêtes.' },
  { id: 'consistent',  label: 'Constant',            rarity: 'common',    color: '#6BBF25', condition: { type: 'quests',   value: 20 }, desc: 'Compléter 20 quêtes.' },

  // Niveaux
  { id: 'lvl5',        label: 'Rang D atteint',      rarity: 'uncommon',  color: '#6BBF25', condition: { type: 'level',    value: 5  }, desc: 'Atteindre le niveau 5.' },
  { id: 'lvl10',       label: 'Rang C atteint',      rarity: 'uncommon',  color: '#3E99E8', condition: { type: 'level',    value: 10 }, desc: 'Atteindre le niveau 10.' },
  { id: 'lvl20',       label: 'Rang B atteint',      rarity: 'rare',      color: '#D4891A', condition: { type: 'level',    value: 20 }, desc: 'Atteindre le niveau 20.' },
  { id: 'lvl35',       label: 'Rang A atteint',      rarity: 'rare',      color: '#E0623C', condition: { type: 'level',    value: 35 }, desc: 'Atteindre le niveau 35.' },
  { id: 'lvl50',       label: 'Rang S atteint',      rarity: 'epic',      color: '#D94C7A', condition: { type: 'level',    value: 50 }, desc: 'Atteindre le niveau 50.' },
  { id: 'lvl70',       label: 'Rang SS atteint',     rarity: 'epic',      color: '#8B82E8', condition: { type: 'level',    value: 70 }, desc: 'Atteindre le niveau 70.' },
  { id: 'lvl90',       label: 'Rang SSS atteint',    rarity: 'legendary', color: '#5A50C8', condition: { type: 'level',    value: 90 }, desc: 'Atteindre le niveau 90.' },
  { id: 'lvl110',      label: 'Rang SSS+ atteint',   rarity: 'legendary', color: '#BDB5FF', condition: { type: 'level',    value: 110}, desc: 'Atteindre le niveau 110.' },
  { id: 'lvl140',      label: 'Chasseur National',   rarity: 'mythic',    color: '#E8DEFF', condition: { type: 'level',    value: 140}, desc: 'Atteindre le niveau 140.' },
  { id: 'lvl200',      label: 'Monarque des Ombres', rarity: 'mythic',    color: '#FFD700', condition: { type: 'level',    value: 200}, desc: 'Atteindre le niveau 200.' },

  // Stats spécifiques
  { id: 'force25',     label: 'Guerrier',            rarity: 'uncommon',  color: '#E0623C', condition: { type: 'stat', stat: 'force',        value: 25 }, desc: 'Force ≥ 25.' },
  { id: 'force50',     label: 'Berserker',           rarity: 'rare',      color: '#E0623C', condition: { type: 'stat', stat: 'force',        value: 50 }, desc: 'Force ≥ 50.' },
  { id: 'force100',    label: 'Titan',               rarity: 'legendary', color: '#E0623C', condition: { type: 'stat', stat: 'force',        value: 100}, desc: 'Force ≥ 100.' },
  { id: 'intel25',     label: 'Érudit',              rarity: 'uncommon',  color: '#8B82E8', condition: { type: 'stat', stat: 'intelligence', value: 25 }, desc: 'Intelligence ≥ 25.' },
  { id: 'intel50',     label: 'Sage',                rarity: 'rare',      color: '#8B82E8', condition: { type: 'stat', stat: 'intelligence', value: 50 }, desc: 'Intelligence ≥ 50.' },
  { id: 'intel100',    label: 'Oracle',              rarity: 'legendary', color: '#8B82E8', condition: { type: 'stat', stat: 'intelligence', value: 100}, desc: 'Intelligence ≥ 100.' },
  { id: 'agilite25',   label: 'Ombre',               rarity: 'uncommon',  color: '#2EC4A0', condition: { type: 'stat', stat: 'agilite',      value: 25 }, desc: 'Agilité ≥ 25.' },
  { id: 'agilite50',   label: 'Fantôme',             rarity: 'rare',      color: '#2EC4A0', condition: { type: 'stat', stat: 'agilite',      value: 50 }, desc: 'Agilité ≥ 50.' },
  { id: 'endur25',     label: 'Blindé',              rarity: 'uncommon',  color: '#D4891A', condition: { type: 'stat', stat: 'endurance',    value: 25 }, desc: 'Endurance ≥ 25.' },
  { id: 'endur50',     label: 'Indestructible',      rarity: 'rare',      color: '#D4891A', condition: { type: 'stat', stat: 'endurance',    value: 50 }, desc: 'Endurance ≥ 50.' },
  { id: 'charm25',     label: 'Élégant',             rarity: 'uncommon',  color: '#D94C7A', condition: { type: 'stat', stat: 'charisme',     value: 25 }, desc: 'Charisme ≥ 25.' },
  { id: 'charm50',     label: 'Souverain',           rarity: 'rare',      color: '#D94C7A', condition: { type: 'stat', stat: 'charisme',     value: 50 }, desc: 'Charisme ≥ 50.' },
  { id: 'percep25',    label: 'Clairvoyant',         rarity: 'uncommon',  color: '#3E99E8', condition: { type: 'stat', stat: 'perception',   value: 25 }, desc: 'Perception ≥ 25.' },

  // Polyvalence
  { id: 'balanced20',  label: 'Polyvalent',          rarity: 'rare',      color: '#8B82E8', condition: { type: 'allstats', value: 20 }, desc: 'Toutes les stats ≥ 20.' },
  { id: 'balanced50',  label: 'Transcendant',        rarity: 'legendary', color: '#BDB5FF', condition: { type: 'allstats', value: 50 }, desc: 'Toutes les stats ≥ 50.' },

  // Quêtes urgentes
  { id: 'urgent1',     label: 'Réactif',             rarity: 'uncommon',  color: '#E0623C', condition: { type: 'urgent', value: 1  }, desc: 'Compléter 1 quête urgente.' },
  { id: 'urgent5',     label: 'Toujours prêt',       rarity: 'rare',      color: '#E0623C', condition: { type: 'urgent', value: 5  }, desc: 'Compléter 5 quêtes urgentes.' },
  { id: 'urgent20',    label: 'Soldat de l\'ombre',  rarity: 'epic',      color: '#D94C7A', condition: { type: 'urgent', value: 20 }, desc: 'Compléter 20 quêtes urgentes.' },

  // Quêtes totales
  { id: 'quests50',    label: 'Assidu',              rarity: 'rare',      color: '#6BBF25', condition: { type: 'quests', value: 50  }, desc: 'Compléter 50 quêtes.' },
  { id: 'quests100',   label: 'Vétéran',             rarity: 'epic',      color: '#D4891A', condition: { type: 'quests', value: 100 }, desc: 'Compléter 100 quêtes.' },
  { id: 'quests300',   label: 'Légende Vivante',     rarity: 'mythic',    color: '#FFD700', condition: { type: 'quests', value: 300 }, desc: 'Compléter 300 quêtes.' },
];

const TITLE_RARITY_ORDER = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'];
const TITLE_RARITY_LABELS = { common: 'Commun', uncommon: 'Peu commun', rare: 'Rare', epic: 'Épique', legendary: 'Légendaire', mythic: 'Mythique' };
const TITLE_RARITY_COLORS = { common: '#9B9A94', uncommon: '#6BBF25', rare: '#3E99E8', epic: '#8B82E8', legendary: '#D4891A', mythic: '#FFD700' };

function checkUnlockedTitles(player) {
  const unlocked = new Set(player.unlocked_titles || []);
  const newUnlocks = [];
  for (const t of TITLES) {
    if (unlocked.has(t.id)) continue;
    const c = t.condition;
    let met = false;
    if (c.type === 'level')    met = player.level >= c.value;
    if (c.type === 'stat')     met = (player.stats[c.stat] || 0) >= c.value;
    if (c.type === 'quests')   met = (player.total_quests_completed || 0) >= c.value;
    if (c.type === 'urgent')   met = (player.urgent_quests_completed || 0) >= c.value;
    if (c.type === 'allstats') met = Object.values(player.stats).every(v => v >= c.value);
    if (met) newUnlocks.push(t.id);
  }
  return newUnlocks;
}

// ============================================================
// QUÊTES URGENTES
// ============================================================
// Chaque quête urgente est générée aléatoirement parmi un pool.
// Elle a une durée limite (ex: 30 min) et un bonus EXP élevé.
// Le système déclenche une quête urgente toutes les ~2h (aléatoire).
// ============================================================

const URGENT_POOL = [
  {
    id: 'u_sprint',    title: '100 Sprints de l\'Ombre',   icon: '⚡',
    desc: 'Le système a détecté une menace. Complétez 100 sauts maintenant.',
    expReward: 80, timeLimitMin: 30, color: '#E0623C',
    tasks: [{ id: 't1', name: 'Sauts explosifs', type: 'reps', baseReps: 100, scaleKey: 'force', unit: 'rép.' }],
  },
  {
    id: 'u_plank',     title: 'Épreuve du Titan',           icon: '🔥',
    desc: 'Tenez la position. Le système vous observe.',
    expReward: 70, timeLimitMin: 20, color: '#D4891A',
    tasks: [{ id: 't1', name: 'Planche totale', type: 'reps', baseReps: 120, scaleKey: 'endurance', unit: 'sec' }],
  },
  {
    id: 'u_pushup',    title: 'Serment du Guerrier',        icon: '⚔️',
    desc: 'Prouvez votre force au système.',
    expReward: 75, timeLimitMin: 25, color: '#E0623C',
    tasks: [
      { id: 't1', name: 'Pompes',    type: 'reps', baseReps: 30, scaleKey: 'force', unit: 'rép.' },
      { id: 't2', name: 'Squats',    type: 'reps', baseReps: 30, scaleKey: 'force', unit: 'rép.' },
    ],
  },
  {
    id: 'u_focus',     title: 'Rituel de Concentration',    icon: '🧠',
    desc: 'Votre esprit est mis à l\'épreuve. Concentrez-vous sans interruption.',
    expReward: 65, timeLimitMin: 15, color: '#8B82E8',
    tasks: [{ id: 't1', name: 'Concentration absolue', type: 'timer', baseMin: 15, scaleKey: 'intelligence', desc: 'Aucune distraction autorisée' }],
  },
  {
    id: 'u_burpee',    title: 'Purge du Corps',             icon: '💥',
    desc: 'Le système exige une dépense physique immédiate.',
    expReward: 90, timeLimitMin: 20, color: '#D94C7A',
    tasks: [{ id: 't1', name: 'Burpees', type: 'reps', baseReps: 20, scaleKey: 'endurance', unit: 'rép.' }],
  },
  {
    id: 'u_medite',    title: 'Éveil de la Perception',     icon: '👁️',
    desc: 'Fermez les yeux. Le système vous attend dans le silence.',
    expReward: 60, timeLimitMin: 10, color: '#3E99E8',
    tasks: [{ id: 't1', name: 'Méditation d\'urgence', type: 'timer', baseMin: 10, scaleKey: 'perception', desc: 'Pleine conscience totale' }],
  },
  {
    id: 'u_grooming',  title: 'Rite du Chasseur',           icon: '✨',
    desc: 'Un chasseur se doit d\'être présentable en toutes circonstances.',
    expReward: 55, timeLimitMin: 30, color: '#D94C7A',
    tasks: [
      { id: 't1', name: 'Douche froide',  type: 'check', desc: 'Corps propre' },
      { id: 't2', name: 'Tenue de combat', type: 'check', desc: 'Tenue soignée et propre' },
    ],
  },
  {
    id: 'u_combo',     title: 'Assaut Combiné',             icon: '🌀',
    desc: 'Force et agilité simultanément. Le système n\'attend pas.',
    expReward: 100, timeLimitMin: 35, color: '#8B82E8',
    tasks: [
      { id: 't1', name: 'Tractions', type: 'reps', baseReps: 10, scaleKey: 'force',   unit: 'rép.' },
      { id: 't2', name: 'Sprints',   type: 'reps', baseReps: 8,  scaleKey: 'agilite', unit: 'séries' },
      { id: 't3', name: 'Dips',      type: 'reps', baseReps: 15, scaleKey: 'force',   unit: 'rép.' },
    ],
  },
];

function pickRandomUrgentQuest() {
  return URGENT_POOL[Math.floor(Math.random() * URGENT_POOL.length)];
}

// Retourne une instance de quête urgente active avec horodatage
function createUrgentInstance(quest) {
  return {
    instanceId: Date.now().toString(),
    questId: quest.id,
    startedAt: Date.now(),
    timeLimitMs: quest.timeLimitMin * 60 * 1000,
    completed: false,
    failed: false,
  };
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}
