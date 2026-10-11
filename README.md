# Catalogue de recettes

Application web de consultation et de gestion d'une collection de recettes.

Le projet est composé de :

- un frontend React avec Vite ;
- une API backend FastAPI ;
- une base de données PostgreSQL lancée avec Docker Compose ;
- une authentification avec JWT et code de connexion à deux facteurs ;
- une réinitialisation de mot de passe par code envoyé par email.

## Architecture

```text
Navigateur
    │
    ▼
Frontend React / Vite
    │ http://localhost:5173
    ▼
API FastAPI
    │ http://localhost:8000
    ▼
PostgreSQL dans Docker
    │ localhost:5432
    ▼
Base collection_db
```

## Prérequis

Installer les outils suivants :

- Git ;
- Docker Desktop avec l'intégration WSL 2 si le projet est utilisé dans WSL ;
- Python 3.12 ou une version compatible ;
- Node.js et npm.

Vérifier les installations :

```bash
docker --version
docker compose version
python3 --version
node --version
npm --version
```

### Utilisation avec WSL

*Si vous n'utilisez pas WSL, passez cette étape.*

Si le projet est lancé dans WSL, Docker Desktop doit être ouvert côté Windows.

Dans Docker Desktop, vérifier :

1. `Settings` → `General` → `Use the WSL 2 based engine` est activé ;
2. `Settings` → `Resources` → `WSL Integration` ;
3. la distribution utilisée, par exemple Ubuntu, est activée.

Dans WSL, vérifier ensuite :

```bash
docker --version
docker compose version
```

## Structure du projet

```text
React_Python_B2/
├── api/
│   ├── core/
│   │   ├── config.py
│   │   ├── email.py
│   │   └── security.py
│   ├── db/
│   │   └── database.py
│   ├── dependencies/
│   │   ├── auth.py
│   │   └── database.py
│   ├── models/
│   │   ├── collection.py
│   │   ├── item.py
│   │   ├── login_challenge.py
│   │   ├── password_reset_challenge.py
│   │   └── user.py
│   ├── routers/
│   │   ├── auth.py
│   │   ├── collection.py
│   │   └── items.py
│   ├── schemas/
│   ├── .env
│   ├── .env.example
│   ├── requirements.txt
│   ├── seed.py
│   └── main.py
├── web/
│   ├── src/
│   ├── package.json
│   └── ...
├── docker-compose.yml
├── start.sh
└── README.md
```

## Configuration PostgreSQL

La base PostgreSQL est lancée par le fichier :

```text
docker-compose.yml
```

La configuration utilisée par l'application est :

```text
Base        : collection_db
Utilisateur : postgres
Mot de passe: postgres
Hôte        : localhost
Port        : 5432
```

## Variables d'environnement

### Backend : `api/.env`

Créer le fichier depuis le modèle fourni :

```bash
cd api
cp .env.example .env
```

Le fichier `api/.env` doit contenir :

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/collection_db

JWT_SECRET=remplacer_par_un_secret_long_et_aleatoire
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

LOGIN_CODE_EXPIRE_MINUTES=5
LOGIN_CODE_MAX_ATTEMPTS=3
LOGIN_CODE_LOCK_MINUTES=5

PASSWORD_RESET_CODE_EXPIRE_MINUTES=10
PASSWORD_RESET_CODE_MAX_ATTEMPTS=3
PASSWORD_RESET_CODE_LOCK_MINUTES=5

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=votre-adresse@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-dapplication
MAIL_FROM=votre-adresse@gmail.com
SMTP_FROM_NAME=Catalogue de recettes
```

### Frontend : `web/.env`

Créer le fichier depuis le modèle fourni :

```bash
cd web
cp .env.example .env
```

Le fichier `web/.env` doit contenir :

```env
VITE_API_URL=http://localhost:8000
```

## Sécurité

`JWT_SECRET` est utilisé pour signer les jetons JWT. Il ne sert pas à hasher les mots de passe.

Les mots de passe sont stockés avec un hash bcrypt. Les codes de connexion et les codes de réinitialisation sont également stockés sous forme de hash.

Ne commitez jamais un fichier `.env` contenant des secrets réels.

## Démarrage rapide

### 1. Cloner le projet

```bash
git clone <URL_DU_DEPOT>
cd React_Python_B2
```

### 2. Démarrer PostgreSQL

Depuis la racine du projet :

```bash
docker compose up -d
```

L'option `-d` démarre les conteneurs en arrière-plan. 

Vérifier l'état du conteneur :

```bash
docker compose ps
```

### 3. Installer les dépendances backend

```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### 4. Initialiser les recettes

Depuis le dossier `api` et avec l'environnement virtuel activé :

```bash
python seed.py
```

Cette commande :

- crée les tables manquantes ;
- ajoute les recettes initiales ;
- met à jour les recettes déjà présentes ;
- récupère certaines images via TheMealDB lorsque nécessaire.

### 5. Démarrer l'API

Depuis le dossier `api` et avec l'environnement virtuel activé :

```bash
uvicorn main:app --reload --host localhost --port 8000
```

L'API est disponible à l'adresse :

- [http://localhost:8000](http://localhost:8000)
- [http://localhost:8000/docs](http://localhost:8000/docs) pour Swagger UI.

L'option `--reload` est utile en développement car Uvicorn redémarre automatiquement le serveur après une modification de fichier. 

### 6. Installer les dépendances frontend

Dans un autre terminal :

```bash
cd web
npm install
npm run dev -- --host localhost --port 5173
```

Le frontend est disponible à l'adresse :

- [http://localhost:5173](http://localhost:5173)

## Démarrage avec `start.sh`

Le projet peut être lancé via le script `start.sh`.

Autoriser son exécution :

```bash
chmod +x start.sh
```

Avant de lancer le script, PostgreSQL doit être démarré :

```bash
docker compose up -d
./start.sh
```

## Lancer le backend et le frontend séparément

### Terminal backend

```bash
cd api
source .venv/bin/activate
uvicorn main:app --reload --host localhost --port 8000
```

### Terminal frontend

```bash
cd web
npm run dev -- --host localhost --port 5173
```

## Authentification

La connexion fonctionne en deux étapes :

1. L'utilisateur envoie son email et son mot de passe.
2. Un code à six chiffres est envoyé par email.
3. L'utilisateur saisit ce code pour obtenir un token JWT.

Les routes principales sont :

```text
POST /auth/register
POST /auth/login
POST /auth/verify-code
GET  /auth/me
```

## Réinitialisation du mot de passe

La réinitialisation fonctionne en deux étapes :

1. L'utilisateur saisit son adresse email.
2. Un code de réinitialisation est envoyé par email.
3. L'utilisateur saisit le code et choisit un nouveau mot de passe.

Les routes principales sont :

```text
POST /auth/forgot-password
POST /auth/reset-password
```

Le code de réinitialisation est :

- à six chiffres ;
- valable pendant 10 minutes ;
- utilisable une seule fois ;
- limité à trois tentatives.

## Fonctionnalités

- consultation du catalogue de recettes ;
- recherche et filtrage des recettes ;
- affichage du détail d'une recette ;
- création de compte ;
- connexion avec authentification JWT et code à deux facteurs ;
- réinitialisation du mot de passe par code email ;
- ajout d'une recette à sa collection ;
- modification du statut d'une recette ;
- ajout d'une note et d'un commentaire ;
- suppression d'une recette de la collection ;
- persistance des données dans PostgreSQL.

## API principale

Les routes exactes peuvent être consultées dans Swagger :

```text
http://localhost:8000/docs
```

Les principaux groupes de routes sont :

- authentification ;
- recettes ;
- collection personnelle.

Les requêtes nécessitant une authentification utilisent un token JWT transmis avec l'en-tête :

```http
Authorization: Bearer <token>
```

## Développement en équipe

Avant de commencer :

```bash
git pull
docker compose up -d
```

Installer ou mettre à jour les dépendances si nécessaire :

```bash
cd api
source .venv/bin/activate
pip install -r requirements.txt

cd ../web
npm install
```

Ne pas versionner :

- `api/.env` ;
- `web/.env` ;
- `api/.venv/` ;
- `web/node_modules/` ;
- les caches et fichiers générés.

Avant un commit :

```bash
git status
git diff
```

## Technologies

### Frontend

- React ;
- TypeScript ;
- Vite ;
- React Router.

### Backend

- Python ;
- FastAPI ;
- Uvicorn ;
- SQLModel ;
- SQLAlchemy ;
- asyncpg ;
- JWT ;
- smtplib.

### Base de données

- PostgreSQL ;
- Docker ;
- Docker Compose.

## Licence

Projet réalisé dans le cadre d'un projet pédagogique par Bianca PONS et Clément HAYOT.