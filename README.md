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

Commande à exécuter dans supabase si un joueur passe Roi
UPDATE public.players
SET unlocked_titles = array_append(unlocked_titles, 'roi')
WHERE username = 'NOM_DU_JOUEUR';

- le site est deja en production, donc il faut eviter les refresh complet car il y a deja des données en BDD. quand je lance le code sql que tu mas donné pour supabase jai cet erreur : Error: Failed to run sql query: ERROR: 42710: policy "players_own" for table "players" already exists
