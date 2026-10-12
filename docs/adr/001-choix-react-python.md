# ADR-001 — Authentification par JWT et code email

- **Statut :** Accepté
- **Date :** 12 octobre 2026
- **Décideurs :** Bianca PONS et Clément HAYOT
- **Contexte :** Projet Catalogue de recettes

## Contexte

L'application Catalogue de recettes permet aux utilisateurs de créer un compte, de se connecter, de gérer une collection personnelle de recettes et d'ajouter des informations personnelles telles qu'un statut, une note ou un commentaire.

Une authentification simple avec uniquement un email et un mot de passe ne protège pas suffisamment le compte si le mot de passe est compromis.

Le projet doit donc sécuriser l'accès aux routes personnelles, notamment :

```text
GET    /auth/me
GET    /collection
POST   /collection
PATCH  /collection/{id}
DELETE /collection/{id}
GET    /stats
```

Nous devons également proposer une solution de récupération de compte lorsqu'un utilisateur oublie son mot de passe.

## Décision

Nous utilisons les mécanismes suivants :

1. Les mots de passe sont hashés avec bcrypt avant leur enregistrement en base de données.
2. La connexion est réalisée en deux étapes :
   - vérification de l'email et du mot de passe ;
   - vérification d'un code à six chiffres envoyé par email.
3. Après validation du code, l'API crée un token JWT signé.
4. Le frontend envoie ensuite ce token dans l'en-tête HTTP `Authorization` pour accéder aux routes protégées.
5. Les codes de connexion et de réinitialisation sont stockés sous forme de hash, ont une durée limitée et ne peuvent être utilisés qu'une fois.
6. Une fonctionnalité de réinitialisation de mot de passe par code email est mise à disposition.

## Détails techniques

### Stockage du mot de passe

La table `user` contient uniquement :

```text
id
email
password_hash
```

Le mot de passe n'est jamais stocké en clair.

Avant l'enregistrement, il est transformé avec bcrypt :

```python
password_hash = hash_password(data.password)
```

Lors de la connexion, le mot de passe saisi est vérifié par comparaison avec le hash stocké :

```python
verify_password(data.password, user.password_hash)
```

### Authentification à deux facteurs

Après validation de l'email et du mot de passe, l'API :

1. génère un code à six chiffres avec le module Python `secrets` ;
2. hash ce code ;
3. crée un enregistrement `LoginChallenge` en base ;
4. associe le code à l'utilisateur ;
5. définit une date d'expiration ;
6. envoie le code par email ;
7. attend la validation du code par l'utilisateur.

Le modèle `LoginChallenge` contient notamment :

```text
user_id
code_hash
expires_at
failed_attempts
locked_until
used_at
```

Le code est limité à trois tentatives. Après trop de tentatives incorrectes, le challenge est temporairement bloqué.

### JWT

Après validation du code, l'API génère un JWT contenant :

```json
{
  "sub": "identifiant_utilisateur",
  "exp": "date_expiration"
}
```

Le token est signé avec `JWT_SECRET`.

Le frontend conserve le token dans `localStorage` puis l'envoie dans chaque requête protégée :

```http
Authorization: Bearer <token>
```

Le backend vérifie la signature et l'expiration du token avant de fournir l'utilisateur connecté à la route demandée.

### Réinitialisation du mot de passe

La réinitialisation utilise une table distincte : `PasswordResetChallenge`.

Le flux est le suivant :

```text
Email utilisateur
      ↓
Demande de réinitialisation
      ↓
Création d'un code à six chiffres hashé
      ↓
Envoi du code par email
      ↓
Vérification du code, de l'expiration et du nombre d'essais
      ↓
Hash et enregistrement du nouveau mot de passe
      ↓
Marquage du code comme utilisé
```

Les codes de connexion et de réinitialisation sont séparés afin qu'un code de connexion ne puisse jamais être utilisé pour modifier un mot de passe.

## Alternatives envisagées

### Alternative 1 — Email et mot de passe uniquement

Cette solution est plus simple à développer, mais un mot de passe compromis suffit pour accéder au compte.

Elle a été refusée car l'objectif du projet est d'ajouter une seconde vérification par code envoyé par email.

### Alternative 2 — Lien de réinitialisation dans un email

Cette solution est fréquente dans les applications web. Elle aurait nécessité un token long dans une URL et une gestion plus complète de la sécurité des liens.

Elle n'a pas été retenue afin de réutiliser le fonctionnement déjà mis en place pour les codes à six chiffres envoyés par email.

### Alternative 3 — Code stocké en clair dans PostgreSQL

Cette solution aurait été facile à développer, mais dangereuse : une personne ayant accès à la base de données pourrait utiliser les codes encore valides.

Elle a été refusée. Les codes sont hashés avant leur stockage.

### Alternative 4 — Stocker une session côté serveur

Cette solution nécessiterait une gestion serveur des sessions ou un stockage supplémentaire, par exemple Redis.

Elle n'a pas été retenue pour garder une architecture adaptée à un projet pédagogique : le JWT signé est plus simple à mettre en œuvre dans cette application.

## Conséquences positives

- Les mots de passe ne sont jamais visibles en base de données.
- La connexion demande une seconde preuve : l'accès à la boîte email.
- Les routes personnelles sont protégées par JWT.
- Les codes sont expirables, limités en essais et utilisables une seule fois.
- Un utilisateur peut récupérer son compte sans intervention manuelle.
- Les responsabilités sont séparées entre les modèles, les routes, la sécurité et l'envoi d'emails.

## Conséquences négatives et limites

- L'utilisateur doit avoir accès à sa boîte email pour se connecter.
- Le serveur dépend de la configuration SMTP.
- Le JWT est stocké dans `localStorage`, ce qui est acceptable pour le cadre pédagogique mais nécessiterait une réflexion complémentaire en production.
- La 2FA par email est moins robuste qu'une application d'authentification dédiée.
- Le système ne vérifie pas encore si un mot de passe est connu comme compromis dans une fuite de données.

## Éléments de sécurité

Les valeurs suivantes ne doivent jamais être versionnées :

```text
JWT_SECRET
SMTP_USERNAME
SMTP_PASSWORD
MAIL_FROM
DATABASE_URL contenant un mot de passe réel
```

Elles sont stockées dans `api/.env`, qui doit être listé dans `.gitignore`.

## Références internes

```text
api/core/security.py
api/core/email.py
api/models/user.py
api/models/login_challenge.py
api/models/password_reset_challenge.py
api/routers/auth.py
api/dependencies/auth.py
```