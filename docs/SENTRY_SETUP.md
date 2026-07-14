# Sentry Setup — Luna

## 1. Créer un compte Sentry
- Va sur https://sentry.io/signup
- Compte gratuit (5 000 events/mois)
- Crée 3 projets :

  | Projet | Platforme | DSN .env key |
  |--------|-----------|-------------|
  | `luna-backend` | Node.js | `SENTRY_DSN_BACKEND` |
  | `luna-mobile` | React Native | `EXPO_PUBLIC_SENTRY_DSN` |
  | `luna-ai` | Python (FastAPI) | `SENTRY_DSN_AI` |

  Copie les 3 DSN (format: `https://...@...ingest.sentry.io/...`).

## 2. Backend — apps/backend
```bash
npm install @sentry/node @sentry/profiling-node
```

Dans `src/index.js` (tout en haut) :
```js
const Sentry = require('@sentry/node');
Sentry.init({
  dsn: process.env.SENTRY_DSN_BACKEND,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV || 'development',
});

// Middleware error handler (après toutes les routes)
app.use(Sentry.Handlers.errorHandler());
```

## 3. Mobile — apps/mobile
```bash
npx expo install @sentry/react-native
```

Dans `App.tsx` (ou `index.ts`) :
```ts
import * as Sentry from '@sentry/react-native';
Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN!,
  tracesSampleRate: 1.0,
});
```

Ajoute `EXPO_PUBLIC_SENTRY_DSN=...` dans `apps/mobile/.env`.

## 4. IA — ai/
```bash
pip install sentry-sdk
```

Dans `inference/server.py` :
```python
import sentry_sdk
import os

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN_AI"),
    traces_sample_rate=1.0,
    environment=os.getenv("ENV", "development"),
)
```

## 5. Vérification
Crash volontaire pour vérifier :
```js
throw new Error("Sentry test — can be deleted");
```

Si l'event apparaît dans le dashboard Sentry → tout fonctionne.
