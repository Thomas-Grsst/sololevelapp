# ⚔ Solo Leveling — Web App

Application web de progression personnelle inspirée de Solo Leveling.
Stack : HTML + Tailwind CSS + JavaScript vanilla + Supabase + Netlify

---

## Structure des fichiers

```
solo-leveling-web/
├── index.html          # Page login / inscription
├── app.html            # Application principale
├── config.js           # Clés Supabase (à remplir)
├── db.js               # Toutes les requêtes Supabase
├── game.js             # Logique de jeu (rangs, quêtes, EXP)
├── netlify.toml        # Config Netlify (redirects SPA)
├── supabase-schema.sql # Schema SQL à exécuter dans Supabase
└── README.md
```

---

## Déploiement — Étape par étape

### 1. Créer le projet Supabase

1. Aller sur [supabase.com](https://supabase.com) → **New Project**
2. Donner un nom, choisir une région (ex: West EU), créer un mot de passe DB
3. Une fois le projet créé, aller dans **SQL Editor**
4. Coller le contenu de `supabase-schema.sql` et cliquer **Run**
5. Aller dans **Settings → API** et copier :
   - **Project URL** → `https://XXXX.supabase.co`
   - **anon / public key** → longue chaîne commençant par `eyJ...`

### 2. Remplir config.js

Ouvrir `config.js` et remplacer les valeurs :

```js
const SUPABASE_URL = "https://VOTRE_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "VOTRE_ANON_KEY";
```

### 3. Déployer sur Netlify

**Option A — Glisser-déposer (le plus simple)**

1. Aller sur [netlify.com](https://netlify.com) → Se connecter
2. Dans le dashboard, faire glisser le dossier `solo-leveling-web/` dans la zone de dépôt
3. Netlify déploie en 30 secondes → votre URL est prête !

**Option B — Via GitHub (recommandé pour les mises à jour)**

1. Créer un repository GitHub, y pousser le dossier
2. Sur Netlify → **Add new site → Import from Git**
3. Connecter GitHub, sélectionner le repo
4. Build command : _(laisser vide)_
5. Publish directory : `solo-leveling-web` (ou `.` si le dossier est à la racine)
6. **Deploy site**

### 4. Autoriser le domaine Netlify dans Supabase

1. Dans Supabase → **Authentication → URL Configuration**
2. **Site URL** : mettre l'URL Netlify (ex: `https://mon-app.netlify.app`)
3. **Redirect URLs** : ajouter `https://mon-app.netlify.app/**`
4. Sauvegarder

---

## Fonctionnalités

### Authentification

- Inscription avec nom de joueur, email, mot de passe
- Connexion / déconnexion
- Session persistante (Supabase gère les tokens)

### Profil

- Niveau, EXP, progression vers le prochain niveau
- 6 attributs : Force, Intelligence, Agilité, Endurance, Perception, Charisme
- Banner de points disponibles → clic pour allouer

### Quêtes quotidiennes

| Quête      | Stat         | Type de tâche                                       |
| ---------- | ------------ | --------------------------------------------------- |
| Physique   | Force        | Répétitions (pompes, squats, dips, tractions)       |
| Endurance  | Endurance    | Répétitions (planche, abdos, burpees)               |
| Mentale    | Intelligence | Timer (concentration, lecture, apprentissage)       |
| Charisme   | Charisme     | Cases à cocher (douche, rasage, dents, soin, tenue) |
| Agilité    | Agilité      | Répétitions (sauts, corde, sprints)                 |
| Perception | Perception   | Timer (méditation, journal)                         |

Les objectifs **augmentent automatiquement** avec le niveau de la stat liée.

### Système de rangs

E → D → C → B → A → S → SS → SSS → SSS+ → National → **Monarque**

### Level Up

- Animation de montée de niveau avec rang et couleur
- +3 points à allouer à chaque niveau
- Sauvegarde automatique dans Supabase

---

## Notes techniques

- Aucun framework JS — HTML/CSS/JS vanilla + Tailwind CDN
- Supabase Auth gère les sessions (JWT, refresh token auto)
- Row Level Security activé → chaque joueur ne voit que ses données
- `netlify.toml` configure les redirects pour la navigation entre pages

* il faut ajouter des titres
* une seule quete urgente par jour
* une boutique
* mettre la bar de navigation en bas
* Ajouter une stats de richesse : par exemple travailler 10 min sur un business
* Il faut qu'il soit possible d'aller au dessus du niveau 200
* Il faut ajouter un spider chart avec les stats de la personne. Par exemple la force peut etre de niveau A mais l'intelligence de niveau B, cela dépendra de l'amélioration des stats
* Ajout d'un streak/jour
* Pénalité si un jour n'est pas fait (minimum 15 tasks). Pénalité d'exp reset au niveau actuelle, ex : si je suis au niveau 44 avec 300 exp, les 300 exp sont supprimé, mais je reste au niveau 44
* Pour les points de stats faudrais juste reguler que 1 point allouer = 1 point de stats en plus et non 2

* faudrais qu'on puisse ami avec d'autre player
* il y a un petit probleme avec les taches qui quand on clique on est obligé d'aller sur un autre onglet avant de revenir pour qu'elle se valide, soit cocher
