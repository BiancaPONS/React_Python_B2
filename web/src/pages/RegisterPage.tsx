import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../services/authService";
import { HttpError } from "../services/http";

function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const user = await register({
        email,
        password,
      });

      setMessage(
        `Compte créé pour ${user.email}. Redirection vers la connexion...`,
      );

      setEmail("");
      setPassword("");

      window.setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (caughtError: unknown) {
      if (caughtError instanceof HttpError) {
        setError(caughtError.message);
      } else if (caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError("Impossible de créer le compte.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="form-page">
      <section className="form-card">
        <Link className="back-link" to="/">
          <span aria-hidden="true">←</span>
          <span>Retour à l’accueil</span>
        </Link>

        <p className="eyebrow">
          La première page de votre carnet
        </p>

        <h1>Créez votre compte</h1>

        <p>
          Enregistrez vos recettes préférées et retrouvez-les
          facilement au même endroit.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Adresse email</label>

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Mot de passe</label>

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <small>
            Le mot de passe doit contenir au moins 8 caractères.
          </small>

          <button type="submit" disabled={loading}>
            {loading ? "Préparation du carnet..." : "Créer mon compte"}
          </button>
        </form>

        {message !== "" && (
          <p className="form-message" role="status">
            {message}
          </p>
        )}

        {error !== "" && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <p className="form-link">
          Vous avez déjà un compte ?{" "}
          <Link to="/login">Connectez-vous</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;