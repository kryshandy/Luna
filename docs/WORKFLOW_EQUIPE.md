# Guide de travail — Équipe Luna

## 1. Règles Git (tout le monde)

**1.1. Ne jamais push directement sur `main`**
- `main` est protégée : impossible de push, impossible de merge si la CI est rouge

**1.2. Créer une branche par fonctionnalité**
```bash
git checkout main
git pull origin main
git checkout -b feature/ce-que-tu-fais
```
Exemples : `feature/api-cycle`, `feature/ecran-journal`, `feature/predictions`

**1.3. Ouvrir une Pull Request (PR) pour chaque fin de tâche**
- Titre clair : `feat(scope): description` (ex: `feat(api): add cycle routes`)
- Dans la description, référence le numéro de la tâche (ex: `Closes #T031`)
- Assigner un reviewer (un autre membre)

**1.4. Ne pas merge soi-même**
- C'est le reviewer qui merge après validation

**1.5. Synchronisation quotidienne**
```bash
git checkout main
git pull origin main
git checkout feature/ta-branche
git merge main
```

---

## 2. Ce que chaque rôle doit faire AVANT le prochain sprint

### Azra — Frontend
- [ ] Installer Jest et react-native-reanimated : `npx expo install jest @types/jest react-native-reanimated`
- [ ] Ajouter le script `"test": "jest"` dans `apps/mobile/package.json`
- [ ] Ajouter `jest.config.js` à la racine de `apps/mobile/`
- [ ] Importer Sentry : `npx expo install @sentry/react-native`
- [ ] Dans `App.tsx`, ajouter en haut : `import './src/services/sentry'`
- [ ] Configurer la navigation (React Navigation) pour tous les écrans

### Josiane — Backend
- [ ] Initialiser le dossier `apps/backend/` avec Express
- [ ] Créer `src/index.js` avec le serveur de base
- [ ] Installer les packages : `npm install express cors dotenv @supabase/supabase-js zod swagger-jsdoc swagger-ui-express @sentry/node`
- [ ] Copier le fichier `.env.example` en `.env` et remplir les valeurs Supabase
- [ ] Créer les dossiers : `routes/`, `controllers/`, `services/`, `middlewares/`, `validators/`, `config/`
- [ ] Ajouter le script `"dev": "nodemon src/index.js"` dans `package.json`

### Florent — IA
- [ ] **Corriger `requirements.txt`** : remplacer `numpy==2.5.1` par `numpy~=2.4.0` (Python 3.11)
- [ ] Créer les dossiers : `rag/`, `model/`, `training/`, `evaluation/`
- [ ] Créer `inference/server.py` (FastAPI) basique
- [ ] Tester que `pip install -r requirements.txt` passe sans erreur

### Riassa — Designer
- [ ] Finaliser les maquettes Figma pour les écrans Splash, Connexion, Inscription
- [ ] Documenter les états (loading/empty/error) pour chaque écran
- [ ] Exporter les assets dans `docs/design/`

### Michel — Backend (support)
- [ ] Aider Josiane sur la doc Swagger
- [ ] Préparer les schémas de validation Zod pour les routes cycle

---

## 3. Workflow pour Krys (DevOps + QA)

**Tâches restantes pour le Sprint 1 (classées par priorité) :**

| Priorité | Tâche | Comment |
|:--------:|-------|---------|
| 🔴 | **T016** Configurer Jest | Faire après qu'Azra ait installé Jest |
| 🔴 | **T017** Tests auth | Faire après que Josiane ait créé les routes auth |
| 🟠 | **T020** Terminer Sentry | Installer les packages et importer les init files |
| 🟠 | **T021** docker-compose.yml | Faire après avoir le backend + IA fonctionnels |
| 🟡 | T022 Définir DoD | Organiser une réunion de 30min |
| 🟡 | T023 Product Backlog | Créer les issues GitHub |

---

## 4. Règles CI

- Chaque PR déclenche la CI automatiquement
- Les vérifications : `npm install` + `npm test` (Backend, Mobile) + vérification Python (AI)
- **La CI doit être verte pour merger** (sauf pour les problèmes connus comme les versions Python de Florent)
- Pour voir les logs : GitHub → Actions → cliquer sur le run

---

## 5. Communication

- **Daily standup** : lundi/mercredi/vendredi sur Discord, 15min, 3 questions :
  - Qu'est-ce que j'ai fait hier ?
  - Qu'est-ce que je fais aujourd'hui ?
  - Qu'est-ce qui me bloque ?
- **Blocage immédiat** : si un blocage critique, ne pas attendre le daily — prévenir sur Discord
- **PR Review** : maximum 24h pour reviewer

---

## 6. Rappel des sprints

| Sprint | Semaines | Objectif |
|:------:|:--------:|----------|
| 1 | 1-3 | Fondations (setup) |
| 2 | 4-6 | Cycle & Auth |
| 3 | 7-9 | Lulu & Journal |
| 4 | 10-12 | Score, Réglages, Thèmes |
| 5 | 13-15 | Sécurité & RGPD |
| 6 | 16-18 | Publication |

---

_Ce document est la référence pour l'organisation de l'équipe. Toute question → Krys (DevOps/QA)._
