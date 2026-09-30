import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import RegisterForm from "../components/register/RegisterForm";
import { register } from "../services/authService";
import { HttpError } from "../services/http";

interface PasswordChecks {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

function RegisterPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const passwordChecks = useMemo<PasswordChecks>(
    () => ({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    }),
    [password],
  );

  const passwordScore = Object.values(passwordChecks).filter(Boolean).length;
  const passwordStrength =
    passwordScore <= 2
      ? "weak"
      : passwordScore <= 4
        ? "medium"
        : "strong";

  const passwordsMatch =
    passwordConfirmation.length > 0 &&
    password === passwordConfirmation;
  const passwordIsValid = passwordScore === 5;
  const canSubmit =
    email.trim() !== "" && passwordIsValid && passwordsMatch && !loading;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!passwordIsValid) {
      setError(
        "Votre mot de passe ne respecte pas encore tous les critères.",
      );
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      await register({ email: email.trim(), password });
      setSuccess(
        "Votre compte a été créé. Vous pouvez maintenant vous connecter.",
      );
      setPassword("");
      setPasswordConfirmation("");
      window.setTimeout(() => navigate("/login"), 1200);
    } catch (caughtError: unknown) {
      if (caughtError instanceof HttpError || caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError("Impossible de créer votre compte.");
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

        <p className="eyebrow">Créer un compte</p>
        <h1>Rejoignez votre carnet</h1>
        <p>
          Créez votre compte pour conserver vos recettes préférées.
        </p>

        <RegisterForm
          email={email}
          password={password}
          passwordConfirmation={passwordConfirmation}
          passwordChecks={passwordChecks}
          passwordScore={passwordScore}
          passwordStrength={passwordStrength}
          passwordsMatch={passwordsMatch}
          loading={loading}
          canSubmit={canSubmit}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onPasswordConfirmationChange={setPasswordConfirmation}
          onSubmit={handleSubmit}
        />

        {error !== "" && (
          <p className="form-error" role="alert">{error}</p>
        )}
        {success !== "" && (
          <p className="form-message" role="status">{success}</p>
        )}

        <p className="form-link">
          Vous avez déjà un compte ?{" "}
          <Link to="/login">Se connecter</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;