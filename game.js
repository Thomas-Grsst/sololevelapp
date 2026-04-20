// ============================================================
// SOLO LEVELING — Game Logic =
// ============================================================

const RANKS = [
  {
    name: "E",
    minLvl: 1,
    color: "#9B9A94",
    glow: "rgba(155,154,148,0.4)",
    bg: "rgba(155,154,148,0.08)",
  },
  {
    name: "D",
    minLvl: 5,
    color: "#6BBF25",
    glow: "rgba(107,191,37,0.4)",
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
    bg: "rgba(255,215,0,0.1)",
  },
];

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
];

function expRequired(level) {
  return Math.floor(100 * Math.pow(1.25, level - 1));
}

function getRankForLevel(level) {
  let rank = RANKS[0];
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (level >= RANKS[i].minLvl) {
      rank = RANKS[i];
      break;
    }
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
  if (task.type === "check") return 1;
  if (task.type === "timer") {
    const bonus = Math.floor(Math.max(0, stats[task.scaleKey] - 5) * 0.6);
    return Math.max(task.baseMin, task.baseMin + bonus);
  }
  const bonus = Math.floor(Math.max(0, stats[task.scaleKey] - 5) * 1.5);
  return Math.max(task.baseReps, task.baseReps + bonus);
}

function buildQuests(stats) {
  return [
    {
      id: "physique",
      title: "Quête physique",
      subtitle: "Forge ton corps",
      expReward: 40,
      statKey: "force",
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
      statKey: "endurance",
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
      statKey: "intelligence",
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
      statKey: "charisme",
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
      statKey: "agilite",
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
      statKey: "perception",
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
  ];
}

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}
