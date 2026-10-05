import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { forgotPassword } from "../services/authService";
import { HttpError } from "../services/http";


function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await forgotPassword({ email });

      if (
        response.challenge_id === undefined
        || response.challenge_id === null
      ) {
        setError(
          "Si cette adresse existe, un code a été envoyé. "
          + "Vérifiez votre boîte mail.",
        );
        return;
      }

      navigate(
        `/reset-password?challenge_id=${response.challenge_id}`,
      );
    } catch (caughtError: unknown) {
      if (caughtError instanceof HttpError) {
        setError(caughtError.message);
      } else if (caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError(
          "Impossible de demander la réinitialisation.",
        );
      }
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="form-page">
      <section className="form-card">
        <Link className="back-link" to="/login">
          <span aria-hidden="true">←</span>
          <span>Retour à la connexion</span>
        </Link>

        <p className="eyebrow">Accès à votre carnet</p>

        <h1>Mot de passe oublié ?</h1>

        <p>
          Saisissez votre adresse email. Si elle correspond à un
          compte, vous recevrez un code de réinitialisation.
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

          <button type="submit" disabled={loading}>
            {loading ? "Envoi du code..." : "Recevoir un code"}
          </button>
        </form>

        {error !== "" && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <p className="form-link">
          Vous vous souvenez de votre mot de passe ?{" "}
          <Link to="/login">Se connecter</Link>
        </p>
      </section>
    </main>
  );
}


export default ForgotPasswordPage;