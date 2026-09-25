# Catalogue de recettes

Application web de consultation et de gestion d'une collection de recettes.

Le projet est composé de :

- un frontend React avec Vite ;
- une API backend FastAPI ;
- une base de données PostgreSQL lancée avec Docker Compose.

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

<sup> *Si vous utilisez pas WSL, passez cette étape.*

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
│   │   └── security.py
│   ├── db/
│   │   └── database.py
│   ├── dependencies/
│   │   ├── auth.py
│   │   └── database.py
│   ├── models/
│   │   ├── collection.py
│   │   ├── item.py
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
Base       : collection_db
Utilisateur: postgres
Mot de passe: postgres
Hôte       : localhost
Port       : 5432
```

Le fichier `api/.env` doit contenir :

```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/collection_db
JWT_SECRET=change_this_secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

Ne commitez pas un fichier `.env` contenant des secrets réels. Utilisez `api/.env.example` comme modèle.

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

```bash
uvicorn main:app --reload
```

L'API est disponible à l'adresse :

- [http://localhost:8000](http://localhost:8000)
- [http://localhost:8000/docs](http://localhost:8000/docs) pour Swagger UI.

### 6. Installer les dépendances frontend

Dans un autre terminal :

```bash
cd web
npm install
npm run dev
```

Le frontend est disponible à l'adresse :

- [http://localhost:5173](http://localhost:5173)

## Démarrage avec `start.sh`

Le projet peut être lancé via le script `start.sh`. On autorise son éxécution : 

```bash
chmod +x start.sh
```

Avant de lancer le script, PostgreSQL doit être démarré :

```bash
docker compose up -d
./start.sh
```

### Si vous souhaitez éxecuter indépendamment le frontend du backend : 

### Terminal backend

```bash
cd api
source .venv/bin/activate
uvicorn main:app --reload
```

### Terminal frontend

```bash
cd web
npm run dev
```

## Fonctionnalités

- consultation du catalogue de recettes ;
- recherche et filtrage des recettes ;
- affichage du détail d'une recette ;
- création de compte ;
- connexion avec authentification JWT ;
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
- `api/.venv/` ;
- `api/collection.db` si elle est uniquement utilisée comme ancienne base locale ;
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
- HTTPX.

### Base de données

- PostgreSQL ;
- Docker ;
- Docker Compose.

## Licence

Projet réalisé dans le cadre d'un projet pédagogique par Bianca PONS et Clément HAYOT.