import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { HttpError } from "../services/http";
import { register } from "../services/authService";

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

  const passwordChecks = useMemo<PasswordChecks>(() => {
    return {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  const passwordScore = Object.values(passwordChecks).filter(
    Boolean,
  ).length;

  const passwordStrength =
    password.length === 0
      ? "empty"
      : passwordScore <= 2
        ? "weak"
        : passwordScore <= 4
          ? "medium"
          : "strong";

  const passwordsMatch =
    passwordConfirmation.length > 0 &&
    password === passwordConfirmation;

  const passwordIsValid = passwordScore === 5;
  const canSubmit =
    email.trim() !== "" &&
    passwordIsValid &&
    passwordsMatch &&
    !loading;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
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
      await register({
        email: email.trim(),
        password,
      });

      setSuccess(
        "Votre compte a été créé. Vous pouvez maintenant vous connecter.",
      );

      setPassword("");
      setPasswordConfirmation("");

      window.setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (caughtError: unknown) {
      if (caughtError instanceof HttpError) {
        setError(caughtError.message);
      } else if (caughtError instanceof Error) {
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
        <p className="eyebrow">Créer un compte</p>

        <h1>Rejoignez votre carnet</h1>

        <p>
          Créez votre compte pour conserver vos recettes préférées.
        </p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="register-email">
            Adresse e-mail
          </label>

          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="register-password">
            Mot de passe
          </label>

          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={8}
            maxLength={128}
            required
          />

          {password.length > 0 && (
            <div
              className={`password-strength password-strength-${passwordStrength}`}
              aria-live="polite"
            >
              <div className="password-strength-header">
                <span>Force du mot de passe</span>
                <strong>
                  {passwordStrength === "weak"
                    ? "Faible"
                    : passwordStrength === "medium"
                      ? "Moyenne"
                      : "Forte"}
                </strong>
              </div>

              <div
                className="password-strength-bar"
                aria-hidden="true"
              >
                <span
                  style={{
                    width: `${(passwordScore / 5) * 100}%`,
                  }}
                />
              </div>

              <ul className="password-rules">
                <PasswordRule
                  valid={passwordChecks.length}
                  text="8 caractères minimum"
                />

                <PasswordRule
                  valid={passwordChecks.lowercase}
                  text="Une lettre minuscule"
                />

                <PasswordRule
                  valid={passwordChecks.uppercase}
                  text="Une lettre majuscule"
                />

                <PasswordRule
                  valid={passwordChecks.number}
                  text="Un chiffre"
                />

                <PasswordRule
                  valid={passwordChecks.special}
                  text="Un caractère spécial"
                />
              </ul>
            </div>
          )}

          <label htmlFor="register-password-confirmation">
            Confirmer le mot de passe
          </label>

          <input
            id="register-password-confirmation"
            type="password"
            value={passwordConfirmation}
            onChange={(event) =>
              setPasswordConfirmation(event.target.value)
            }
            autoComplete="new-password"
            required
          />

          {passwordConfirmation.length > 0 && (
            <p
              className={
                passwordsMatch
                  ? "password-match password-match-valid"
                  : "password-match password-match-invalid"
              }
              role="status"
            >
              {passwordsMatch
                ? "Les mots de passe correspondent."
                : "Les mots de passe ne correspondent pas."}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
          >
            {loading ? "Création en cours..." : "Créer mon compte"}
          </button>
        </form>

        {error !== "" && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        {success !== "" && (
          <p className="form-message" role="status">
            {success}
          </p>
        )}

        <p className="form-link">
          Vous avez déjà un compte ?{" "}
          <Link to="/login">Se connecter</Link>
        </p>
      </section>
    </main>
  );
}

interface PasswordRuleProps {
  valid: boolean;
  text: string;
}

function PasswordRule({
  valid,
  text,
}: PasswordRuleProps) {
  return (
    <li className={valid ? "password-rule-valid" : ""}>
      <span aria-hidden="true">
        {valid ? "✓" : "○"}
      </span>
      {text}
    </li>
  );
}

export default RegisterPage;