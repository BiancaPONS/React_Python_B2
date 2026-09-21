import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { register } from "../services/authService";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const user = await register({ email, password });

      setMessage(`Compte créé pour ${user.email}. Vous pouvez vous connecter.`);
      setEmail("");
      setPassword("");
    } catch (caughtError: unknown) {
      if (caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError("Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="form-page">
      <section className="form-card">
        <p className="eyebrow">Nouveau compte</p>
        <h1>Créer un compte</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Adresse email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            minLength={8}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Création..." : "S’inscrire"}
          </button>
        </form>

        {message !== "" && <p className="form-message">{message}</p>}

        {error !== "" && <p className="form-error">{error}</p>}

        <p className="form-link">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;