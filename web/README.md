# Frontend — Catalogue de recettes

Application React avec TypeScript et Vite pour consulter et gérer une collection de recettes.

Ce guide permet de lancer uniquement le frontend. PostgreSQL et l'API FastAPI doivent être démarrés séparément.

> Toutes les commandes ci-dessous sont prévues pour un terminal Linux ou WSL et partent de la **racine du dépôt**, sauf indication contraire.

## Prérequis

- Node.js et npm ;
- PostgreSQL démarré avec Docker Compose ;
- API FastAPI démarrée sur `http://localhost:8000`.

Vérifier les installations :

```bash
node --version
npm --version
```

## Installation

### 1. Se placer à la racine

```bash
cd ~/React_Python_B2
```

Si le dépôt se trouve ailleurs, remplacer ce chemin par le sien.

### 2. Démarrer PostgreSQL

Depuis la racine du projet :

```bash
docker compose up -d
docker compose ps
```

### 3. Démarrer l'API

Dans un terminal :

```bash
cd api
source .venv/bin/activate
uvicorn main:app --reload --host localhost --port 8000
```

L'API doit être accessible ici :

```text
http://localhost:8000/docs
```

### 4. Installer les dépendances frontend

Dans un autre terminal :

```bash
cd web
npm install
```

## Configuration

### Créer le fichier `.env`

Depuis le dossier `web`, exécuter :

```bash
cp .env.example .env
```

Le fichier `web/.env` doit contenir :

```env
VITE_API_URL=http://localhost:8000
```

Cette variable est utilisée par le frontend pour appeler l'API backend.

Vite expose uniquement les variables commençant par `VITE_` au code frontend. Elles sont incluses dans le bundle client et ne doivent donc jamais contenir de secret. [1161]

## Démarrer le frontend

Depuis le dossier `web` :

```bash
npm run dev
```

Le frontend est disponible à l'adresse :

```text
http://localhost:5173
```

Le backend doit rester démarré dans un autre terminal.

Pour arrêter le frontend : `Ctrl+C`.

## Démarrage les jours suivants

Terminal 1, pour PostgreSQL :

```bash
cd ~/React_Python_B2
docker compose up -d
```


Terminal 2, pour le frontend :

```bash
cd ~/React_Python_B2/web
npm run dev 
```

## Authentification

La connexion fonctionne en deux étapes :

1. L'utilisateur saisit son email et son mot de passe.
2. Un code à six chiffres est envoyé par email.
3. L'utilisateur saisit le code sur `/verify-code`.
4. Un token JWT est enregistré dans `localStorage`.

Le token est ensuite envoyé automatiquement dans l'en-tête :

```http
Authorization: Bearer <token>
```

## Structure du frontend

```text
web/
├── src/
│   ├── components/
│   │   ├── InvalidResetRequest.tsx
│   │   ├── PasswordStrength.tsx
│   │   ├── ResetPasswordFields.tsx
│   │   ├── ResetPasswordForm.tsx
│   │   └── ...
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── pages/
│   │   ├── CollectionPage.tsx
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── ItemDetailPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── StatsPage.tsx
│   │   └── VerifyLoginCodePage.tsx
│   ├── services/
│   │   ├── authService.ts
│   │   ├── collectionService.ts
│   │   ├── http.ts
│   │   └── itemService.ts
│   ├── types/
│   │   └── api.ts
│   ├── App.tsx
│   └── main.tsx
├── .env
├── .env.example
├── package.json
└── vite.config.ts
```

## Fichiers importants

```text
web/src/services/http.ts                  # Appels HTTP vers l'API
web/src/services/authService.ts           # Inscription, connexion, réinitialisation
web/src/contexts/AuthContext.tsx          # État de connexion et token JWT
web/src/pages/LoginPage.tsx               # Connexion et lien mot de passe oublié
web/src/pages/ForgotPasswordPage.tsx      # Demande de réinitialisation
web/src/pages/ResetPasswordPage.tsx       # Saisie du code et nouveau mot de passe
web/src/components/PasswordStrength.tsx   # Indicateur de robustesse du mot de passe
```

## Résolution des problèmes

### `Failed to fetch`

Vérifier que :

1. PostgreSQL est démarré : `docker compose ps` ;
2. l'API est démarrée : `http://localhost:8000/docs` fonctionne ;
3. le frontend est ouvert sur `http://localhost:5173` ;
4. `web/.env` contient bien `VITE_API_URL=http://localhost:8000` ;
5. le backend autorise l'origine `http://localhost:5173` dans sa configuration CORS.

Après modification de `web/.env`, redémarrer le frontend.

## Pour améliorer le projet

Ne pas versionner :

- `web/.env` ;
- `web/node_modules/` ;
- les fichiers générés par Vite.

## Technologies

- React ;
- TypeScript ;
- Vite ;
- React Router ;
- Fetch API ;
- localStorage.