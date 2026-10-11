# API — Catalogue de recettes

Backend FastAPI du catalogue de recettes. Ce guide permet de lancer **uniquement PostgreSQL et l'API**, sans démarrer le frontend React, puis de tester les routes dans Swagger UI à l'adresse [http://localhost:8000/docs](http://localhost:8000/docs).

> Toutes les commandes ci-dessous sont prévues pour un terminal Linux ou WSL et partent de la **racine du dépôt**, sauf indication contraire.

## Prérequis

- Python 3.12 (ou la version compatible avec `api/requirements.txt`) et `python3-venv`.
- Docker Desktop démarré, avec Docker Compose accessible depuis le terminal utilisé.
- Le fichier `docker-compose.yml` à la racine du dépôt.
- Une adresse email SMTP pour l'envoi des codes de connexion et de réinitialisation.

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

L'option `-d` démarre PostgreSQL en arrière-plan.

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
EOF
```

Remplacer les valeurs suivantes avant de démarrer l'API :

- `JWT_SECRET` : secret long et aléatoire ;
- `SMTP_USERNAME` : adresse Gmail utilisée pour envoyer les emails ;
- `SMTP_PASSWORD` : mot de passe d'application Gmail ;
- `MAIL_FROM` : adresse d'expédition des emails.

Ne pas commiter `api/.env`.

### 5. Créer les tables et charger les recettes

Toujours depuis `api`, avec `.venv` activé :

```bash
python seed.py
```

Le script crée les tables manquantes, ajoute ou met à jour les recettes de départ et peut effectuer des requêtes réseau pour récupérer des images.

Il initialise uniquement les recettes. Il ne restaure pas les comptes utilisateurs ni les collections personnelles.

### 6. Démarrer l'API seule

```bash
uvicorn main:app --reload --host localhost --port 8000
```

Laisser ce terminal ouvert, puis aller sur [http://localhost:8000/docs](http://localhost:8000/docs).

Swagger UI permet d'ouvrir une route, de cliquer sur **Try it out**, de renseigner les paramètres et de cliquer sur **Execute**.

Pour arrêter l'API : `Ctrl+C`.

## Tester les routes dans Swagger

1. Ouvrir [http://localhost:8000/docs](http://localhost:8000/docs).
2. Tester d'abord une route publique de consultation des recettes.
3. Pour tester les routes protégées, créer un compte ou se connecter via les routes d'authentification affichées dans Swagger.
4. Cliquer sur **Authorize** et fournir le jeton Bearer renvoyé par la connexion si Swagger propose ce bouton.
5. Vérifier le code HTTP et la réponse dans Swagger ; consulter le terminal Uvicorn si une erreur apparaît.

La protection reste côté API : une route de collection doit refuser une requête sans authentification même lorsque React n'est pas lancé.

Les routes protégées attendent un en-tête HTTP :

```http
Authorization: Bearer <token>
```

## Configuration SMTP

Le projet utilise `smtplib` pour envoyer les codes par email.

Pour Gmail, la configuration recommandée est :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=votre-adresse@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-dapplication
MAIL_FROM=votre-adresse@gmail.com
SMTP_FROM_NAME=Catalogue de recettes
```

Le port `587` utilise STARTTLS. Gmail exige un mot de passe d'application, et non le mot de passe habituel du compte Google. 

## Vérifications utiles

Vérifier que PostgreSQL fonctionne :

```bash
docker compose ps
```

Vérifier que l'API répond :

```bash
curl http://localhost:8000/docs
```

Vérifier les tables PostgreSQL :

```bash
docker compose exec postgres psql -U postgres -d collection_db -c "\dt"
```

Si le nom du service PostgreSQL ou de la base est différent dans votre `docker-compose.yml`, adapter ces commandes.

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
uvicorn main:app --reload --host localhost --port 8000
```

Ouvrir ensuite [http://localhost:8000/docs](http://localhost:8000/docs).

Il n'est pas nécessaire de relancer `python seed.py` à chaque démarrage si les recettes sont déjà en base.

Pour arrêter PostgreSQL après les tests, depuis la racine :

```bash
docker compose down
```

## Organisation du backend

```text
api/
├── core/           # Configuration, sécurité et envoi d'emails
├── db/             # Moteur et sessions SQLAlchemy
├── dependencies/   # Dépendances FastAPI (session, authentification)
├── models/         # Tables SQLModel
├── routers/        # Routes HTTP
├── schemas/        # Schémas d'entrée et de sortie
├── main.py         # Application FastAPI
├── seed.py         # Recettes initiales
└── requirements.txt
```

## Fichiers importants

```text
api/core/config.py                       # Variables d'environnement
api/core/email.py                        # Envoi des codes par email
api/core/security.py                     # Hash bcrypt et JWT
api/models/login_challenge.py            # Codes de connexion
api/models/password_reset_challenge.py   # Codes de réinitialisation
api/routers/auth.py                      # Routes d'authentification
api/routers/items.py                     # Routes des recettes
api/routers/collection.py                # Routes de la collection
```

## Sécurité

- Les mots de passe sont stockés avec un hash bcrypt.
- Les codes de connexion et de réinitialisation sont stockés sous forme de hash.
- Les codes sont à usage unique et ont une durée de vie limitée.
- Les tentatives incorrectes sont limitées.
- `JWT_SECRET` sert uniquement à signer les jetons JWT.
- Ne jamais commiter `api/.env` ni y conserver de secrets réels.