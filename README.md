# Catalogue de recettes – React + FastAPI

Projet réalisé par **Clément HAYOT**  et **Bianca PONS**, étudiants en **B2 Cybersécurité**.

Projet fullstack : un catalogue de recettes avec authentification, collection personnelle et annotations.

- Backend : FastAPI + SQLModel + SQLite
- Frontend : React + Vite + TypeScript
- Authentification : JWT + bcrypt

## Prérequis

Il faut avoir sur sa machine :

- Python 3.12+
- Node.js 18+
- npm
- Un terminal (bash, zsh, PowerShell, etc.)

## Structure du projet

```text
React_Python_B2/
├── api/          # Backend FastAPI
├── web/          # Frontend React
└── start.sh      # Script pour lancer api + web
```

## 1. Installer et lancer le backend

*Après avoir cloné le lien Git*

```bash
cd api
python -m venv .venv
source .venv/bin/activate        # Linux / macOS
# .venv\Scripts\activate         # Windows (PowerShell)

pip install -r requirements.txt
```

Crée un fichier `.env` dans `api/` avec au moins :

```text
SECRET_KEY=une_cle_secrete_aleatoire
DATABASE_URL=sqlite+aiosqlite:///./collection.db
```

Génère une clé secrète si besoin (exemple) :

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

Initialise la base et ajoute les recettes :

```bash
python seed.py
```

Lance le serveur :

```bash
python -m uvicorn main:app --reload --port 8000
```

Le backend est accessible sur :

```text
http://127.0.0.1:8000
http://127.0.0.1:8000/docs
```

## 2. Installer et lancer le frontend

Dans un autre terminal :

```bash
cd web
npm install
```

Lance le serveur de développement :

```bash
npm run dev
```

Le frontend est accessible sur :

```text
http://localhost:5173
```

## 3. Lancer tout le projet d’un coup

Depuis la racine du projet :

```bash
cd ..
chmod +x start.sh
./start.sh
```

Ce script lance :

- le backend sur `http://127.0.0.1:8000`
- le frontend sur `http://localhost:5173`

## 4. Créer un compte et se connecter

Depuis le frontend :

1. Va sur la page d’inscription.
2. Crée un compte avec un email et un mot de passe.
3. Connecte-toi avec ces identifiants.

Le frontend appelle :

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

Le token JWT est ensuite envoyé automatiquement dans les requêtes protégées.

## 5. Utiliser l’API directement (optionnel)

Ouvre :

```text
http://127.0.0.1:8000/docs
```

Quelques routes utiles :

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET /items`
- `GET /items/{id}`
- `POST /me/collection`
- `GET /me/collection`
- `PATCH /me/collection/item/{item_id}`
- `DELETE /me/collection/item/{item_id}`
- `GET /me/stats`

Pour les routes protégées, clique sur `Authorize` et colle le token obtenu avec `POST /auth/login`.

## 6. Recréer la base de données

Si tu veux repartir de zéro (comptes + collections + recettes) :

```bash
cd api
rm collection.db
python seed.py
```

Attention : cela supprime tous les comptes utilisateurs existants.

---

Merci d’avoir testé notre projet, et surtout bon appétit !