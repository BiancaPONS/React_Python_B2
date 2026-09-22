import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { HttpError } from "../services/http";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({
        email,
        password,
      });

      navigate("/");
    } catch (caughtError: unknown) {
      if (caughtError instanceof HttpError) {
        setError(caughtError.message);
      } else if (caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError("Impossible de se connecter.");
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

        <p className="eyebrow">Votre carnet vous attend</p>

        <h1>Retrouvez vos recettes</h1>

        <p>
          Connectez-vous pour retrouver votre collection personnelle
          et vos notes.
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
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Ouverture du carnet..." : "Se connecter"}
          </button>
        </form>

        {error !== "" && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <p className="form-link">
          Pas encore de compte ?{" "}
          <Link to="/register">Créez votre carnet</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;