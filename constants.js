// ============================================================
// SOLO LEVELING v3 — Game Constants
// ============================================================

const RANKS = [
  {
    name: "E",
    minLvl: 1,
    color: "#9B9A94",
    glow: "rgba(155,154,148,0.35)",
    bg: "rgba(155,154,148,0.08)",
  },
  {
    name: "D",
    minLvl: 5,
    color: "#6BBF25",
    glow: "rgba(107,191,37,0.35)",
    bg: "rgba(107,191,37,0.08)",
  },
  {
    name: "C",
    minLvl: 10,
    color: "#3E99E8",
    glow: "rgba(62,153,232,0.4)",
    bg: "rgba(62,153,232,0.08)",
  },
  {
    name: "B",
    minLvl: 20,
    color: "#D4891A",
    glow: "rgba(212,137,26,0.4)",
    bg: "rgba(212,137,26,0.08)",
  },
  {
    name: "A",
    minLvl: 35,
    color: "#E0623C",
    glow: "rgba(224,98,60,0.4)",
    bg: "rgba(224,98,60,0.08)",
  },
  {
    name: "S",
    minLvl: 50,
    color: "#D94C7A",
    glow: "rgba(217,76,122,0.4)",
    bg: "rgba(217,76,122,0.08)",
  },
  {
    name: "SS",
    minLvl: 70,
    color: "#8B82E8",
    glow: "rgba(139,130,232,0.5)",
    bg: "rgba(139,130,232,0.1)",
  },
  {
    name: "SSS",
    minLvl: 90,
    color: "#5A50C8",
    glow: "rgba(90,80,200,0.55)",
    bg: "rgba(90,80,200,0.12)",
  },
  {
    name: "SSS+",
    minLvl: 110,
    color: "#BDB5FF",
    glow: "rgba(189,181,255,0.55)",
    bg: "rgba(189,181,255,0.12)",
  },
  {
    name: "National",
    minLvl: 140,
    color: "#E8DEFF",
    glow: "rgba(232,222,255,0.6)",
    bg: "rgba(232,222,255,0.1)",
  },
  {
    name: "Monarque",
    minLvl: 200,
    color: "#FFD700",
    glow: "rgba(255,215,0,0.7)",
    bg: "rgba(255,215,0,0.12)",
  },
];

// Rank for any stat value (used in spider chart labels)
function statRankLabel(val) {
  if (val >= 400) return "Monarche";
  if (val >= 285) return "National";
  if (val >= 210) return "SSS";
  if (val >= 150) return "SS";
  if (val >= 100) return "S";
  if (val >= 70) return "A";
  if (val >= 45) return "B";
  if (val >= 25) return "C";
  if (val >= 12) return "D";
  return "E";
}
function statRankColor(val) {
  if (val >= 400) return "#FFD700";
  if (val >= 285) return "#E8DEFF";
  if (val >= 210) return "#5A50C8";
  if (val >= 150) return "#8B82E8";
  if (val >= 100) return "#D94C7A";
  if (val >= 70) return "#E0623C";
  if (val >= 45) return "#D4891A";
  if (val >= 25) return "#3E99E8";
  if (val >= 12) return "#6BBF25";
  return "#9B9A94";
}

const STATS_META = [
  {
    key: "force",
    label: "Force",
    color: "#E0623C",
    icon: "⚔️",
    desc: "Puissance physique brute",
  },
  {
    key: "intelligence",
    label: "Intelligence",
    color: "#8B82E8",
    icon: "🧠",
    desc: "Agilité mentale et apprentissage",
  },
  {
    key: "agilite",
    label: "Agilité",
    color: "#2EC4A0",
    icon: "💨",
    desc: "Vitesse et coordination",
  },
  {
    key: "endurance",
    label: "Endurance",
    color: "#D4891A",
    icon: "🛡️",
    desc: "Résistance et stamina",
  },
  {
    key: "perception",
    label: "Perception",
    color: "#3E99E8",
    icon: "👁️",
    desc: "Conscience et intuition",
  },
  {
    key: "charisme",
    label: "Charisme",
    color: "#D94C7A",
    icon: "✨",
    desc: "Présence et apparence",
  },
  {
    key: "richesse",
    label: "Richesse",
    color: "#FFD700",
    icon: "💰",
    desc: "Revenus et business",
  },
];

// ── EXP formula (no cap) ──────────────────────────────────────
function expRequired(level) {
  return Math.floor(100 * Math.pow(1.22, level - 1));
}

function getRankForLevel(level) {
  let r = RANKS[0];
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLvl) {
      r = RANKS[i];
      break;
    }
  }
  return r;
}
function getNextRank(level) {
  for (const r of RANKS) {
    if (r.minLvl > level) return r;
  }
  return null; // beyond Monarque → no next rank shown
}

// ── Task scaling ──────────────────────────────────────────────
function getTaskRequired(task, stats) {
  if (task.type === "check") return 1;
  const sv = stats[task.scaleKey] || 5;
  const bonus = Math.max(0, sv - 5);
  if (task.type === "timer")
    return Math.max(task.baseMin, task.baseMin + Math.floor(bonus * 0.5));
  return Math.max(task.baseReps, task.baseReps + Math.floor(bonus * 1.0)); // 1 stat pt = 1 rep
}

// ── Daily quests ──────────────────────────────────────────────
function buildQuests(stats) {
  return [
    {
      id: "physique",
      title: "Quête physique",
      subtitle: "Forge ton corps",
      expReward: 40,
      goldReward: 15,
      color: "#E0623C",
      icon: "⚔️",
      tasks: [
        {
          id: "pushup",
          name: "Pompes",
          type: "reps",
          baseReps: 10,
          scaleKey: "force",
          unit: "rép.",
        },
        {
          id: "squat",
          name: "Squats",
          type: "reps",
          baseReps: 10,
          scaleKey: "force",
          unit: "rép.",
        },
        {
          id: "dip",
          name: "Dips",
          type: "reps",
          baseReps: 8,
          scaleKey: "force",
          unit: "rép.",
        },
        {
          id: "pullup",
          name: "Tractions",
          type: "reps",
          baseReps: 5,
          scaleKey: "force",
          unit: "rép.",
        },
      ],
    },
    {
      id: "endurance",
      title: "Quête endurance",
      subtitle: "Repousse tes limites",
      expReward: 30,
      goldReward: 12,
      color: "#D4891A",
      icon: "🛡️",
      tasks: [
        {
          id: "plank",
          name: "Planche",
          type: "reps",
          baseReps: 30,
          scaleKey: "endurance",
          unit: "sec",
        },
        {
          id: "crunch",
          name: "Abdos",
          type: "reps",
          baseReps: 15,
          scaleKey: "endurance",
          unit: "rép.",
        },
        {
          id: "burpee",
          name: "Burpees",
          type: "reps",
          baseReps: 8,
          scaleKey: "agilite",
          unit: "rép.",
        },
      ],
    },
    {
      id: "intelligence",
      title: "Quête mentale",
      subtitle: "Aiguise ton esprit",
      expReward: 35,
      goldReward: 12,
      color: "#8B82E8",
      icon: "🧠",
      tasks: [
        {
          id: "focus",
          name: "Concentration",
          type: "timer",
          baseMin: 10,
          scaleKey: "intelligence",
          desc: "Focus total, sans distraction",
        },
        {
          id: "read",
          name: "Lecture",
          type: "timer",
          baseMin: 15,
          scaleKey: "intelligence",
          desc: "Livre ou article sérieux",
        },
        {
          id: "learn",
          name: "Apprentissage",
          type: "timer",
          baseMin: 10,
          scaleKey: "intelligence",
          desc: "Cours, tutoriel, pratique",
        },
      ],
    },
    {
      id: "charisme",
      title: "Quête charisme",
      subtitle: "Prends soin de toi",
      expReward: 25,
      goldReward: 10,
      color: "#D94C7A",
      icon: "✨",
      tasks: [
        { id: "douche", name: "Douche", type: "check", desc: "Corps propre" },
        {
          id: "rasage",
          name: "Rasage / épilation",
          type: "check",
          desc: "Visage soigné",
        },
        {
          id: "dents",
          name: "Brossage des dents",
          type: "check",
          desc: "2× minimum",
        },
        {
          id: "soin",
          name: "Soin du visage",
          type: "check",
          desc: "Hydratation, nettoyage",
        },
        {
          id: "tenue",
          name: "Tenue soignée",
          type: "check",
          desc: "Habillé proprement",
        },
      ],
    },
    {
      id: "agilite",
      title: "Quête agilité",
      subtitle: "Vitesse & coordination",
      expReward: 28,
      goldReward: 10,
      color: "#2EC4A0",
      icon: "💨",
      tasks: [
        {
          id: "jump",
          name: "Sauts",
          type: "reps",
          baseReps: 20,
          scaleKey: "agilite",
          unit: "rép.",
        },
        {
          id: "skip",
          name: "Corde à sauter",
          type: "reps",
          baseReps: 50,
          scaleKey: "agilite",
          unit: "rép.",
        },
        {
          id: "sprint",
          name: "Sprints",
          type: "reps",
          baseReps: 5,
          scaleKey: "agilite",
          unit: "séries",
        },
      ],
    },
    {
      id: "perception",
      title: "Quête perception",
      subtitle: "Sens aiguisés",
      expReward: 20,
      goldReward: 8,
      color: "#3E99E8",
      icon: "👁️",
      tasks: [
        {
          id: "medite",
          name: "Méditation",
          type: "timer",
          baseMin: 10,
          scaleKey: "perception",
          desc: "Pleine conscience, respiration",
        },
        {
          id: "journal",
          name: "Journal",
          type: "timer",
          baseMin: 5,
          scaleKey: "perception",
          desc: "Écrire ses pensées du jour",
        },
      ],
    },
    {
      id: "richesse",
      title: "Quête business",
      subtitle: "Développe ta richesse",
      expReward: 30,
      goldReward: 25,
      color: "#FFD700",
      icon: "💰",
      tasks: [
        {
          id: "business",
          name: "Travail business",
          type: "timer",
          baseMin: 10,
          scaleKey: "richesse",
          desc: "Travail sur ton projet/side hustle",
        },
        {
          id: "finance",
          name: "Revue finances",
          type: "timer",
          baseMin: 5,
          scaleKey: "richesse",
          desc: "Budget, investissements, objectifs",
        },
        {
          id: "network",
          name: "Networking",
          type: "check",
          desc: "Contact pro ou opportunité",
        },
      ],
    },
  ];
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}
function formatTime(s) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ── Urgent quest pool ─────────────────────────────────────────
const URGENT_POOL = [
  {
    id: "u_sprint",
    title: "100 Sprints de l'Ombre",
    icon: "⚡",
    desc: "Le système a détecté une menace. Complétez 100 sauts maintenant.",
    expReward: 80,
    goldReward: 30,
    timeLimitMin: 30,
    color: "#E0623C",
    tasks: [
      {
        id: "t1",
        name: "Sauts explosifs",
        type: "reps",
        baseReps: 100,
        scaleKey: "force",
        unit: "rép.",
      },
    ],
  },
  {
    id: "u_plank",
    title: "Épreuve du Titan",
    icon: "🔥",
    desc: "Tenez la position. Le système vous observe.",
    expReward: 70,
    goldReward: 25,
    timeLimitMin: 20,
    color: "#D4891A",
    tasks: [
      {
        id: "t1",
        name: "Planche totale",
        type: "reps",
        baseReps: 120,
        scaleKey: "endurance",
        unit: "sec",
      },
    ],
  },
  {
    id: "u_pushup",
    title: "Serment du Guerrier",
    icon: "⚔️",
    desc: "Prouvez votre force au système.",
    expReward: 75,
    goldReward: 28,
    timeLimitMin: 25,
    color: "#E0623C",
    tasks: [
      {
        id: "t1",
        name: "Pompes",
        type: "reps",
        baseReps: 30,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t2",
        name: "Squats",
        type: "reps",
        baseReps: 30,
        scaleKey: "force",
        unit: "rép.",
      },
    ],
  },
  {
    id: "u_focus",
    title: "Rituel de Concentration",
    icon: "🧠",
    desc: "Votre esprit est mis à l'épreuve. Concentrez-vous sans interruption.",
    expReward: 65,
    goldReward: 22,
    timeLimitMin: 15,
    color: "#8B82E8",
    tasks: [
      {
        id: "t1",
        name: "Concentration absolue",
        type: "timer",
        baseMin: 15,
        scaleKey: "intelligence",
        desc: "Aucune distraction autorisée",
      },
    ],
  },
  {
    id: "u_burpee",
    title: "Purge du Corps",
    icon: "💥",
    desc: "Le système exige une dépense physique immédiate.",
    expReward: 90,
    goldReward: 35,
    timeLimitMin: 20,
    color: "#D94C7A",
    tasks: [
      {
        id: "t1",
        name: "Burpees",
        type: "reps",
        baseReps: 20,
        scaleKey: "endurance",
        unit: "rép.",
      },
    ],
  },
  {
    id: "u_medite",
    title: "Éveil de la Perception",
    icon: "👁️",
    desc: "Fermez les yeux. Le système vous attend dans le silence.",
    expReward: 60,
    goldReward: 20,
    timeLimitMin: 10,
    color: "#3E99E8",
    tasks: [
      {
        id: "t1",
        name: "Méditation d'urgence",
        type: "timer",
        baseMin: 10,
        scaleKey: "perception",
        desc: "Pleine conscience totale",
      },
    ],
  },
  {
    id: "u_business",
    title: "Opportunité Éphémère",
    icon: "💰",
    desc: "Une fenêtre d'opportunité vient de s'ouvrir. Agissez maintenant.",
    expReward: 70,
    goldReward: 50,
    timeLimitMin: 30,
    color: "#FFD700",
    tasks: [
      {
        id: "t1",
        name: "Sprint business",
        type: "timer",
        baseMin: 20,
        scaleKey: "richesse",
        desc: "Focus total sur ton projet",
      },
    ],
  },
  {
    id: "u_combo",
    title: "Assaut Combiné",
    icon: "🌀",
    desc: "Force et agilité simultanément. Le système n'attend pas.",
    expReward: 100,
    goldReward: 40,
    timeLimitMin: 35,
    color: "#8B82E8",
    tasks: [
      {
        id: "t1",
        name: "Tractions",
        type: "reps",
        baseReps: 10,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t2",
        name: "Sprints",
        type: "reps",
        baseReps: 8,
        scaleKey: "agilite",
        unit: "séries",
      },
      {
        id: "t3",
        name: "Dips",
        type: "reps",
        baseReps: 15,
        scaleKey: "force",
        unit: "rép.",
      },
    ],
  },
];

function pickRandomUrgentQuest() {
  return URGENT_POOL[Math.floor(Math.random() * URGENT_POOL.length)];
}

// ── Titles (50+) ──────────────────────────────────────────────
const RARITY_ORDER = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "creator",
];
const RARITY_LABELS = {
  common: "Commun",
  uncommon: "Peu commun",
  rare: "Rare",
  epic: "Épique",
  legendary: "Légendaire",
  mythic: "Mythique",
  creator: "Créateur",
};
const RARITY_COLORS = {
  common: "#9B9A94",
  uncommon: "#6BBF25",
  rare: "#3E99E8",
  epic: "#A96BE8",
  legendary: "#E8A730",
  mythic: "#FFD700",
  creator: "#FF2D55",
};

const TITLES = [
  // Common
  {
    id: "newbie",
    label: "Éveillé",
    rarity: "common",
    color: "#9B9A94",
    condition: { type: "level", value: 1 },
    desc: "Bienvenue dans le système.",
  },
  {
    id: "early",
    label: "Apprenti Chasseur",
    rarity: "common",
    color: "#9B9A94",
    condition: { type: "quests", value: 5 },
    desc: "Compléter 5 quêtes.",
  },
  {
    id: "walker",
    label: "Marcheur",
    rarity: "common",
    color: "#9B9A94",
    condition: { type: "streak", value: 3 },
    desc: "Streak de 3 jours.",
  },
  {
    id: "cleaner",
    label: "Impeccable",
    rarity: "common",
    color: "#D94C7A",
    condition: { type: "stat", stat: "charisme", value: 10 },
    desc: "Charisme ≥ 10.",
  },
  // Uncommon
  {
    id: "determined",
    label: "Déterminé",
    rarity: "uncommon",
    color: "#6BBF25",
    condition: { type: "quests", value: 20 },
    desc: "Compléter 20 quêtes.",
  },
  {
    id: "streak7",
    label: "Une semaine",
    rarity: "uncommon",
    color: "#6BBF25",
    condition: { type: "streak", value: 7 },
    desc: "Streak de 7 jours.",
  },
  {
    id: "rankD",
    label: "Rang D atteint",
    rarity: "uncommon",
    color: "#6BBF25",
    condition: { type: "level", value: 5 },
    desc: "Niveau 5.",
  },
  {
    id: "rankC",
    label: "Rang C atteint",
    rarity: "uncommon",
    color: "#3E99E8",
    condition: { type: "level", value: 10 },
    desc: "Niveau 10.",
  },
  {
    id: "warrior",
    label: "Guerrier",
    rarity: "uncommon",
    color: "#E0623C",
    condition: { type: "stat", stat: "force", value: 20 },
    desc: "Force ≥ 20.",
  },
  {
    id: "scholar",
    label: "Érudit",
    rarity: "uncommon",
    color: "#8B82E8",
    condition: { type: "stat", stat: "intelligence", value: 20 },
    desc: "Intelligence ≥ 20.",
  },
  {
    id: "shadow",
    label: "Ombre",
    rarity: "uncommon",
    color: "#2EC4A0",
    condition: { type: "stat", stat: "agilite", value: 20 },
    desc: "Agilité ≥ 20.",
  },
  {
    id: "businessmn",
    label: "Entrepreneur",
    rarity: "uncommon",
    color: "#FFD700",
    condition: { type: "stat", stat: "richesse", value: 15 },
    desc: "Richesse ≥ 15.",
  },
  {
    id: "reactive",
    label: "Réactif",
    rarity: "uncommon",
    color: "#E0623C",
    condition: { type: "urgent", value: 1 },
    desc: "Compléter 1 quête urgente.",
  },
  // Rare
  {
    id: "consistent",
    label: "Constant",
    rarity: "rare",
    color: "#3E99E8",
    condition: { type: "quests", value: 50 },
    desc: "Compléter 50 quêtes.",
  },
  {
    id: "streak14",
    label: "Deux semaines",
    rarity: "rare",
    color: "#3E99E8",
    condition: { type: "streak", value: 14 },
    desc: "Streak de 14 jours.",
  },
  {
    id: "streak30",
    label: "Mois de feu",
    rarity: "rare",
    color: "#3E99E8",
    condition: { type: "streak", value: 30 },
    desc: "Streak de 30 jours.",
  },
  {
    id: "rankB",
    label: "Rang B atteint",
    rarity: "rare",
    color: "#D4891A",
    condition: { type: "level", value: 20 },
    desc: "Niveau 20.",
  },
  {
    id: "rankA",
    label: "Rang A atteint",
    rarity: "rare",
    color: "#E0623C",
    condition: { type: "level", value: 35 },
    desc: "Niveau 35.",
  },
  {
    id: "berserker",
    label: "Berserker",
    rarity: "rare",
    color: "#E0623C",
    condition: { type: "stat", stat: "force", value: 40 },
    desc: "Force ≥ 40.",
  },
  {
    id: "sage",
    label: "Sage",
    rarity: "rare",
    color: "#8B82E8",
    condition: { type: "stat", stat: "intelligence", value: 40 },
    desc: "Intelligence ≥ 40.",
  },
  {
    id: "ghost",
    label: "Fantôme",
    rarity: "rare",
    color: "#2EC4A0",
    condition: { type: "stat", stat: "agilite", value: 40 },
    desc: "Agilité ≥ 40.",
  },
  {
    id: "ironwall",
    label: "Mur de Fer",
    rarity: "rare",
    color: "#D4891A",
    condition: { type: "stat", stat: "endurance", value: 40 },
    desc: "Endurance ≥ 40.",
  },
  {
    id: "elegant",
    label: "Élégant",
    rarity: "rare",
    color: "#D94C7A",
    condition: { type: "stat", stat: "charisme", value: 40 },
    desc: "Charisme ≥ 40.",
  },
  {
    id: "clairvoy",
    label: "Clairvoyant",
    rarity: "rare",
    color: "#3E99E8",
    condition: { type: "stat", stat: "perception", value: 40 },
    desc: "Perception ≥ 40.",
  },
  {
    id: "tycoon",
    label: "Tycoon",
    rarity: "rare",
    color: "#FFD700",
    condition: { type: "stat", stat: "richesse", value: 40 },
    desc: "Richesse ≥ 40.",
  },
  {
    id: "urgent5",
    label: "Toujours Prêt",
    rarity: "rare",
    color: "#E0623C",
    condition: { type: "urgent", value: 5 },
    desc: "Compléter 5 quêtes urgentes.",
  },
  // Epic
  {
    id: "veteran",
    label: "Vétéran",
    rarity: "epic",
    color: "#A96BE8",
    condition: { type: "quests", value: 100 },
    desc: "Compléter 100 quêtes.",
  },
  {
    id: "streak60",
    label: "Deux mois",
    rarity: "epic",
    color: "#A96BE8",
    condition: { type: "streak", value: 60 },
    desc: "Streak de 60 jours.",
  },
  {
    id: "rankS",
    label: "Rang S atteint",
    rarity: "epic",
    color: "#D94C7A",
    condition: { type: "level", value: 50 },
    desc: "Niveau 50.",
  },
  {
    id: "rankSS",
    label: "Rang SS atteint",
    rarity: "epic",
    color: "#8B82E8",
    condition: { type: "level", value: 70 },
    desc: "Niveau 70.",
  },
  {
    id: "titan",
    label: "Titan",
    rarity: "epic",
    color: "#E0623C",
    condition: { type: "stat", stat: "force", value: 75 },
    desc: "Force ≥ 75.",
  },
  {
    id: "oracle",
    label: "Oracle",
    rarity: "epic",
    color: "#8B82E8",
    condition: { type: "stat", stat: "intelligence", value: 75 },
    desc: "Intelligence ≥ 75.",
  },
  {
    id: "spectre",
    label: "Spectre",
    rarity: "epic",
    color: "#2EC4A0",
    condition: { type: "stat", stat: "agilite", value: 75 },
    desc: "Agilité ≥ 75.",
  },
  {
    id: "sovereign",
    label: "Souverain",
    rarity: "epic",
    color: "#D94C7A",
    condition: { type: "stat", stat: "charisme", value: 75 },
    desc: "Charisme ≥ 75.",
  },
  {
    id: "magnate",
    label: "Magnat",
    rarity: "epic",
    color: "#FFD700",
    condition: { type: "stat", stat: "richesse", value: 75 },
    desc: "Richesse ≥ 75.",
  },
  {
    id: "balanced",
    label: "Polyvalent",
    rarity: "epic",
    color: "#A96BE8",
    condition: { type: "allstats", value: 20 },
    desc: "Toutes les stats ≥ 20.",
  },
  {
    id: "urgent15",
    label: "Soldat de l'Ombre",
    rarity: "epic",
    color: "#D94C7A",
    condition: { type: "urgent", value: 15 },
    desc: "Compléter 15 quêtes urgentes.",
  },
  // Legendary
  {
    id: "legend",
    label: "Légende Vivante",
    rarity: "legendary",
    color: "#E8A730",
    condition: { type: "quests", value: 200 },
    desc: "Compléter 200 quêtes.",
  },
  {
    id: "streak100",
    label: "Cent jours",
    rarity: "legendary",
    color: "#E8A730",
    condition: { type: "streak", value: 100 },
    desc: "Streak de 100 jours.",
  },
  {
    id: "rankSSS",
    label: "Rang SSS atteint",
    rarity: "legendary",
    color: "#5A50C8",
    condition: { type: "level", value: 90 },
    desc: "Niveau 90.",
  },
  {
    id: "rankSSSP",
    label: "Rang SSS+ atteint",
    rarity: "legendary",
    color: "#BDB5FF",
    condition: { type: "level", value: 110 },
    desc: "Niveau 110.",
  },
  {
    id: "demigod",
    label: "Demi-Dieu",
    rarity: "legendary",
    color: "#E8A730",
    condition: { type: "stat", stat: "force", value: 100 },
    desc: "Force ≥ 100.",
  },
  {
    id: "omniscient",
    label: "Omniscient",
    rarity: "legendary",
    color: "#8B82E8",
    condition: { type: "stat", stat: "intelligence", value: 100 },
    desc: "Intelligence ≥ 100.",
  },
  {
    id: "transcend",
    label: "Transcendant",
    rarity: "legendary",
    color: "#BDB5FF",
    condition: { type: "allstats", value: 50 },
    desc: "Toutes les stats ≥ 50.",
  },
  {
    id: "urgent30",
    label: "Chasseur de l'Ombre",
    rarity: "legendary",
    color: "#E8A730",
    condition: { type: "urgent", value: 30 },
    desc: "Compléter 30 quêtes urgentes.",
  },
  {
    id: "national",
    label: "Chasseur National",
    rarity: "legendary",
    color: "#E8DEFF",
    condition: { type: "level", value: 140 },
    desc: "Niveau 140.",
  },
  // Mythic
  {
    id: "quests500",
    label: "Immortel",
    rarity: "mythic",
    color: "#FFD700",
    condition: { type: "quests", value: 500 },
    desc: "Compléter 500 quêtes.",
  },
  {
    id: "streak365",
    label: "Un an de discipline",
    rarity: "mythic",
    color: "#FFD700",
    condition: { type: "streak", value: 365 },
    desc: "Streak de 365 jours.",
  },
  {
    id: "monarch",
    label: "Monarque des Ombres",
    rarity: "mythic",
    color: "#FFD700",
    condition: { type: "level", value: 200 },
    desc: "Niveau 200.",
  },
  {
    id: "absolute",
    label: "Absolu",
    rarity: "mythic",
    color: "#FFD700",
    condition: { type: "allstats", value: 100 },
    desc: "Toutes les stats ≥ 100.",
  },
  // Titre unique — attribué manuellement par le créateur du site
  {
    id: "roi",
    label: "Roi",
    rarity: "creator",
    color: "#FF2D55",
    condition: { type: "manual" },
    desc: "Niv. 500 + épreuve en direct avec le Créateur.",
  },
];

function checkNewTitles(player) {
  const have = new Set(player.unlocked_titles || []);
  return TITLES.filter((t) => {
    if (have.has(t.id)) return false;
    const c = t.condition;
    if (c.type === "level") return player.level >= c.value;
    if (c.type === "stat") return (player.stats[c.stat] || 0) >= c.value;
    if (c.type === "quests")
      return (player.total_quests_completed || 0) >= c.value;
    if (c.type === "urgent")
      return (player.urgent_quests_completed || 0) >= c.value;
    if (c.type === "streak") return (player.streak || 0) >= c.value;
    if (c.type === "allstats")
      return Object.values(player.stats).every((v) => v >= c.value);
    if (c.type === "manual") return false; // attribué uniquement par le créateur
    return false;
  });
}

// ── Rank Trials ───────────────────────────────────────────────
// Each rank has a trial that must be completed BEFORE unlocking the rank.
// Trials are one-shot challenges with multiple tasks.
// completed_trials: string[] stored on player (trial IDs passed)
// ─────────────────────────────────────────────────────────────
const RANK_TRIALS = [
  {
    id: "trial_D",
    forRank: "D",
    title: "Épreuve du Rang D",
    subtitle: "Prouvez que vous méritez de progresser",
    color: "#6BBF25",
    icon: "🌿",
    requiredLevel: 5,
    expReward: 60,
    lore: '"Le Système vous évalue. Seuls les Joueurs qui peuvent maintenir leur corps et leur esprit méritent d\'avancer."',
    tasks: [
      {
        id: "t1",
        name: "Pompes",
        type: "reps",
        baseReps: 20,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t2",
        name: "Squats",
        type: "reps",
        baseReps: 20,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t3",
        name: "Concentration",
        type: "timer",
        baseMin: 5,
        scaleKey: "intelligence",
        desc: "5 min de focus total",
      },
    ],
  },
  {
    id: "trial_C",
    forRank: "C",
    title: "Épreuve du Rang C",
    subtitle: "Le Système exige plus de vous",
    color: "#3E99E8",
    icon: "💧",
    requiredLevel: 10,
    expReward: 100,
    lore: '"Vous commencez à comprendre la discipline. Mais le chemin est encore long."',
    tasks: [
      {
        id: "t1",
        name: "Pompes",
        type: "reps",
        baseReps: 30,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t2",
        name: "Tractions",
        type: "reps",
        baseReps: 8,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t3",
        name: "Planche",
        type: "reps",
        baseReps: 60,
        scaleKey: "endurance",
        unit: "sec",
      },
      {
        id: "t4",
        name: "Lecture",
        type: "timer",
        baseMin: 10,
        scaleKey: "intelligence",
        desc: "10 min de lecture sérieuse",
      },
      {
        id: "t5",
        name: "Soin personnel",
        type: "check",
        desc: "Douche + tenue soignée",
      },
    ],
  },
  {
    id: "trial_B",
    forRank: "B",
    title: "Épreuve du Rang B",
    subtitle: "La discipline devient un mode de vie",
    color: "#D4891A",
    icon: "🔥",
    requiredLevel: 20,
    expReward: 180,
    lore: '"Un chasseur de rang B ne connaît pas l\'excuse. Chaque jour est une bataille contre soi-même."',
    tasks: [
      {
        id: "t1",
        name: "Pompes",
        type: "reps",
        baseReps: 50,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t2",
        name: "Squats",
        type: "reps",
        baseReps: 50,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t3",
        name: "Burpees",
        type: "reps",
        baseReps: 15,
        scaleKey: "endurance",
        unit: "rép.",
      },
      {
        id: "t4",
        name: "Tractions",
        type: "reps",
        baseReps: 12,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t5",
        name: "Concentration",
        type: "timer",
        baseMin: 15,
        scaleKey: "intelligence",
        desc: "15 min de focus absolu",
      },
      {
        id: "t6",
        name: "Méditation",
        type: "timer",
        baseMin: 10,
        scaleKey: "perception",
        desc: "Pleine conscience",
      },
      {
        id: "t7",
        name: "Rituel complet",
        type: "check",
        desc: "Douche + soin du visage + tenue",
      },
    ],
  },
  {
    id: "trial_A",
    forRank: "A",
    title: "Épreuve du Rang A",
    subtitle: "Vous approchez l'élite",
    color: "#E0623C",
    icon: "⚡",
    requiredLevel: 35,
    expReward: 300,
    lore: '"Le rang A n\'est pas accordé. Il est arraché au prix de la sueur et de la volonté."',
    tasks: [
      {
        id: "t1",
        name: "Pompes",
        type: "reps",
        baseReps: 75,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t2",
        name: "Tractions",
        type: "reps",
        baseReps: 20,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t3",
        name: "Dips",
        type: "reps",
        baseReps: 30,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t4",
        name: "Burpees",
        type: "reps",
        baseReps: 25,
        scaleKey: "endurance",
        unit: "rép.",
      },
      {
        id: "t5",
        name: "Planche",
        type: "reps",
        baseReps: 120,
        scaleKey: "endurance",
        unit: "sec",
      },
      {
        id: "t6",
        name: "Sprint",
        type: "reps",
        baseReps: 10,
        scaleKey: "agilite",
        unit: "séries",
      },
      {
        id: "t7",
        name: "Apprentissage",
        type: "timer",
        baseMin: 20,
        scaleKey: "intelligence",
        desc: "Cours / tutoriel intensif",
      },
      {
        id: "t8",
        name: "Méditation",
        type: "timer",
        baseMin: 15,
        scaleKey: "perception",
        desc: "Pleine conscience",
      },
      {
        id: "t9",
        name: "Business",
        type: "timer",
        baseMin: 15,
        scaleKey: "richesse",
        desc: "Travail sur ton projet",
      },
      {
        id: "t10",
        name: "Rituel complet",
        type: "check",
        desc: "Douche + rasage + soin + tenue",
      },
    ],
  },
  {
    id: "trial_S",
    forRank: "S",
    title: "Épreuve du Rang S",
    subtitle: "La frontière entre humain et chasseur",
    color: "#D94C7A",
    icon: "💎",
    requiredLevel: 50,
    expReward: 500,
    lore: "\"Très peu atteignent ce rang. Ce n'est pas qu'une épreuve physique — c'est une transformation.\"",
    tasks: [
      {
        id: "t1",
        name: "Pompes",
        type: "reps",
        baseReps: 100,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t2",
        name: "Tractions",
        type: "reps",
        baseReps: 30,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t3",
        name: "Squats",
        type: "reps",
        baseReps: 100,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t4",
        name: "Burpees",
        type: "reps",
        baseReps: 40,
        scaleKey: "endurance",
        unit: "rép.",
      },
      {
        id: "t5",
        name: "Planche",
        type: "reps",
        baseReps: 180,
        scaleKey: "endurance",
        unit: "sec",
      },
      {
        id: "t6",
        name: "Dips",
        type: "reps",
        baseReps: 50,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t7",
        name: "Focus total",
        type: "timer",
        baseMin: 30,
        scaleKey: "intelligence",
        desc: "Session de travail profond",
      },
      {
        id: "t8",
        name: "Méditation",
        type: "timer",
        baseMin: 20,
        scaleKey: "perception",
        desc: "Pleine conscience avancée",
      },
      {
        id: "t9",
        name: "Business",
        type: "timer",
        baseMin: 30,
        scaleKey: "richesse",
        desc: "Sprint de productivité",
      },
      {
        id: "t10",
        name: "Rituel royal",
        type: "check",
        desc: "Douche froide + rasage + soin + tenue impeccable",
      },
    ],
  },
  {
    id: "trial_SS",
    forRank: "SS",
    title: "Épreuve du Rang SS",
    subtitle: "Au-delà des limites humaines",
    color: "#8B82E8",
    icon: "🌌",
    requiredLevel: 70,
    expReward: 800,
    lore: '"Le Système vous a observé depuis le début. Il sait maintenant que vous êtes différent."',
    tasks: [
      {
        id: "t1",
        name: "Pompes",
        type: "reps",
        baseReps: 150,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t2",
        name: "Tractions",
        type: "reps",
        baseReps: 40,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t3",
        name: "Burpees",
        type: "reps",
        baseReps: 60,
        scaleKey: "endurance",
        unit: "rép.",
      },
      {
        id: "t4",
        name: "Planche",
        type: "reps",
        baseReps: 240,
        scaleKey: "endurance",
        unit: "sec",
      },
      {
        id: "t5",
        name: "Focus total",
        type: "timer",
        baseMin: 45,
        scaleKey: "intelligence",
        desc: "Concentration absolue",
      },
      {
        id: "t6",
        name: "Méditation profonde",
        type: "timer",
        baseMin: 30,
        scaleKey: "perception",
        desc: "Conscience totale",
      },
      {
        id: "t7",
        name: "Sprint business",
        type: "timer",
        baseMin: 45,
        scaleKey: "richesse",
        desc: "Deep work session",
      },
      {
        id: "t8",
        name: "Rituel du chasseur",
        type: "check",
        desc: "Protocole complet de soin",
      },
    ],
  },
  {
    id: "trial_SSS",
    forRank: "SSS",
    title: "Épreuve du Rang SSS",
    subtitle: "Le sommet de l'humanité",
    color: "#5A50C8",
    icon: "👁️",
    requiredLevel: 90,
    expReward: 1200,
    lore: '"Vous n\'êtes plus un simple joueur. Vous êtes une force de la nature."',
    tasks: [
      {
        id: "t1",
        name: "Pompes",
        type: "reps",
        baseReps: 200,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t2",
        name: "Tractions",
        type: "reps",
        baseReps: 50,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t3",
        name: "Dips",
        type: "reps",
        baseReps: 80,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t4",
        name: "Burpees",
        type: "reps",
        baseReps: 80,
        scaleKey: "endurance",
        unit: "rép.",
      },
      {
        id: "t5",
        name: "Planche",
        type: "reps",
        baseReps: 300,
        scaleKey: "endurance",
        unit: "sec",
      },
      {
        id: "t6",
        name: "Focus total",
        type: "timer",
        baseMin: 60,
        scaleKey: "intelligence",
        desc: "Une heure de concentration pure",
      },
      {
        id: "t7",
        name: "Méditation",
        type: "timer",
        baseMin: 45,
        scaleKey: "perception",
        desc: "Éveil profond",
      },
      {
        id: "t8",
        name: "Business intensif",
        type: "timer",
        baseMin: 60,
        scaleKey: "richesse",
        desc: "Session de création de valeur",
      },
      {
        id: "t9",
        name: "Rituel du seigneur",
        type: "check",
        desc: "Protocole complet impeccable",
      },
    ],
  },
  {
    id: "trial_SSSP",
    forRank: "SSS+",
    title: "Épreuve du Rang SSS+",
    subtitle: "Transcender l'humanité",
    color: "#BDB5FF",
    icon: "✨",
    requiredLevel: 110,
    expReward: 1800,
    lore: '"Peu de mots peuvent décrire ce que vous êtes devenu."',
    tasks: [
      {
        id: "t1",
        name: "Pompes",
        type: "reps",
        baseReps: 250,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t2",
        name: "Tractions",
        type: "reps",
        baseReps: 60,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t3",
        name: "Squats",
        type: "reps",
        baseReps: 200,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t4",
        name: "Burpees",
        type: "reps",
        baseReps: 100,
        scaleKey: "endurance",
        unit: "rép.",
      },
      {
        id: "t5",
        name: "Planche",
        type: "reps",
        baseReps: 360,
        scaleKey: "endurance",
        unit: "sec",
      },
      {
        id: "t6",
        name: "Focus absolu",
        type: "timer",
        baseMin: 90,
        scaleKey: "intelligence",
        desc: "Une heure et demie de deep work",
      },
      {
        id: "t7",
        name: "Méditation",
        type: "timer",
        baseMin: 60,
        scaleKey: "perception",
        desc: "Conscience totale",
      },
      {
        id: "t8",
        name: "Business",
        type: "timer",
        baseMin: 90,
        scaleKey: "richesse",
        desc: "Création de valeur intensive",
      },
      {
        id: "t9",
        name: "Rituel",
        type: "check",
        desc: "Protocole de soin complet",
      },
    ],
  },
  {
    id: "trial_National",
    forRank: "National",
    title: "Épreuve Nationale",
    subtitle: "L'épreuve des légendes",
    color: "#E8DEFF",
    icon: "🏛️",
    requiredLevel: 140,
    expReward: 3000,
    lore: '"Un chasseur National est connu de tous. Son seul nom inspire la crainte et le respect."',
    tasks: [
      {
        id: "t1",
        name: "Pompes",
        type: "reps",
        baseReps: 300,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t2",
        name: "Tractions",
        type: "reps",
        baseReps: 80,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t3",
        name: "Dips",
        type: "reps",
        baseReps: 100,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t4",
        name: "Burpees",
        type: "reps",
        baseReps: 120,
        scaleKey: "endurance",
        unit: "rép.",
      },
      {
        id: "t5",
        name: "Planche",
        type: "reps",
        baseReps: 480,
        scaleKey: "endurance",
        unit: "sec",
      },
      {
        id: "t6",
        name: "Deep work",
        type: "timer",
        baseMin: 120,
        scaleKey: "intelligence",
        desc: "2 heures de concentration",
      },
      {
        id: "t7",
        name: "Méditation",
        type: "timer",
        baseMin: 60,
        scaleKey: "perception",
        desc: "Maîtrise intérieure",
      },
      {
        id: "t8",
        name: "Business",
        type: "timer",
        baseMin: 120,
        scaleKey: "richesse",
        desc: "Travail de maître",
      },
      {
        id: "t9",
        name: "Rituel national",
        type: "check",
        desc: "Protocole de soin complet parfait",
      },
    ],
  },
  {
    id: "trial_Monarque",
    forRank: "Monarque",
    title: "Épreuve du Monarque",
    subtitle: "L'ultime épreuve",
    color: "#FFD700",
    icon: "👑",
    requiredLevel: 200,
    expReward: 5000,
    lore: "\"Vous regardez en arrière et vous voyez un chemin que personne d'autre n'aurait pu parcourir. Vous êtes le Monarque.\"",
    tasks: [
      {
        id: "t1",
        name: "Pompes",
        type: "reps",
        baseReps: 500,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t2",
        name: "Tractions",
        type: "reps",
        baseReps: 100,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t3",
        name: "Squats",
        type: "reps",
        baseReps: 300,
        scaleKey: "force",
        unit: "rép.",
      },
      {
        id: "t4",
        name: "Burpees",
        type: "reps",
        baseReps: 150,
        scaleKey: "endurance",
        unit: "rép.",
      },
      {
        id: "t5",
        name: "Planche",
        type: "reps",
        baseReps: 600,
        scaleKey: "endurance",
        unit: "sec",
      },
      {
        id: "t6",
        name: "Deep work",
        type: "timer",
        baseMin: 180,
        scaleKey: "intelligence",
        desc: "3 heures de travail profond",
      },
      {
        id: "t7",
        name: "Méditation",
        type: "timer",
        baseMin: 90,
        scaleKey: "perception",
        desc: "Éveil total",
      },
      {
        id: "t8",
        name: "Business",
        type: "timer",
        baseMin: 180,
        scaleKey: "richesse",
        desc: "Création de valeur maximale",
      },
      {
        id: "t9",
        name: "Rituel du Monarque",
        type: "check",
        desc: "Cérémonie de préparation complète",
      },
    ],
  },
];

// Get the trial the player needs to unlock their next rank
function getAvailableTrial(player) {
  const currentRank = getRankForLevel(player.level);
  // Cherche le trial correspondant au rang actuel du joueur
  const trial = RANK_TRIALS.find((t) => t.forRank === currentRank.name);
  if (!trial) return null;
  // Seulement si le joueur a atteint le niveau requis
  if (player.level < trial.requiredLevel) return null;
  // Déjà passé ?
  if ((player.completed_trials || []).includes(trial.id)) return null;
  return trial;
}

// Check if player needs to complete a trial before ranking up
function needsTrialForRankUp(player) {
  return getAvailableTrial(player) !== null;
}
