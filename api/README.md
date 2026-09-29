# API — Catalogue de recettes

Backend FastAPI du catalogue de recettes. Ce guide permet de lancer **uniquement PostgreSQL et l'API**, sans démarrer le frontend React, puis de tester les routes dans Swagger UI à l'adresse [http://localhost:8000/docs](http://localhost:8000/docs).

> Toutes les commandes ci-dessous sont prévues pour un terminal Linux ou WSL et partent de la **racine du dépôt**, sauf indication contraire.

## Prérequis

- Python 3.12 (ou la version compatible avec `api/requirements.txt`) et `python3-venv`.
- Docker Desktop démarré, avec Docker Compose accessible depuis le terminal utilisé.
- Le fichier `docker-compose.yml` à la racine du dépôt.

Vérifier l'environnement :

```bash
python3 --version
docker --version
docker compose version
```

Sous WSL, si `docker` est introuvable, activer la distribution dans **Docker Desktop → Settings → Resources → WSL Integration**, puis rouvrir le terminal WSL.

## Installation autonome

### 1. Se placer à la racine

```bash
cd ~/React_Python_B2
```

Si le dépôt se trouve ailleurs, remplacer ce chemin par le sien.

### 2. Démarrer PostgreSQL

```bash
docker compose up -d
docker compose ps
```

### 3. Installer les dépendances Python

```bash
cd api
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
```

Le pilote `asyncpg` doit figurer dans `api/requirements.txt`, puisque l'URL de connexion ci-dessous utilise `postgresql+asyncpg`.

### 4. Créer le fichier `.env`

Depuis le dossier `api`, exécuter :

```bash
cat > .env <<'EOF'
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/collection_db
JWT_SECRET=remplacer_par_un_secret_long_et_aleatoire
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
EOF
```

Remplacer `remplacer_par_un_secret_long_et_aleatoire` par un secret personnel avant de démarrer l’API. 

Ne pas commiter `api/.env`.

### 5. Créer les tables et charger les recettes

Toujours depuis `api`, avec `.venv` activé :

```bash
python seed.py
```

Le script appelle la création des tables manquantes, ajoute ou met à jour les recettes de départ et peut effectuer des requêtes réseau pour récupérer des images. Ne le relancez pas en supposant qu'il restaurera les comptes ou les collections : il initialise les recettes, pas les données personnelles.

### 6. Démarrer l'API seule

```bash
uvicorn main:app --reload
```

Laisser ce terminal ouvert, puis aller sur [http://localhost:8000/docs](http://localhost:8000/docs). Swagger UI permet d'ouvrir une route, de cliquer sur **Try it out**, de renseigner les paramètres et de cliquer sur **Execute**.

Pour arrêter l'API : `Ctrl+C`.

## Tester les routes dans Swagger

1. Ouvrir [http://localhost:8000/docs](http://localhost:8000/docs).
2. Tester d'abord une route publique de consultation des recettes. Son chemin exact figure dans la documentation générée.
3. Pour tester les routes protégées, créer un compte ou se connecter via les routes d'authentification affichées dans Swagger.
4. Cliquer sur **Authorize** et fournir le jeton Bearer renvoyé par la connexion si Swagger propose ce bouton, puis exécuter la route protégée. Selon le formulaire affiché, saisir le jeton seul ou avec le préfixe `Bearer `.
5. Vérifier le code HTTP et la réponse dans Swagger ; consulter le terminal Uvicorn si une erreur apparaît.

La protection reste côté API : une route de collection doit refuser une requête sans authentification même lorsque React n'est pas lancé.

## Vérifications utiles

Si le nom du service ou de la base est différent dans votre Compose, adaptez ces commandes.

## Démarrage les jours suivants

Terminal 1, à la racine du dépôt :

```bash
cd ~/React_Python_B2
docker compose up -d
```

Terminal 2, pour l'API seule :

```bash
cd ~/React_Python_B2/api
source .venv/bin/activate
uvicorn main:app --reload
```

Ouvrir ensuite [http://localhost:8000/docs](http://localhost:8000/docs). Il n'est pas nécessaire de relancer `python seed.py` à chaque démarrage si les recettes sont déjà en base.

Pour arrêter PostgreSQL après les tests, depuis la racine :

```bash
docker compose down
```

## Organisation du backend

```text
api/
├── core/           # Configuration et sécurité
├── db/             # Moteur et sessions SQLAlchemy
├── dependencies/   # Dépendances FastAPI (session, authentification)
├── models/         # Tables SQLModel
├── routers/        # Routes HTTP
├── schemas/        # Schémas d'entrée et de sortie
├── main.py         # Application FastAPI
├── seed.py         # Recettes initiales
└── requirements.txt
```