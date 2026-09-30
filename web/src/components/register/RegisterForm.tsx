import type { FormEvent } from "react";

import PasswordStrength from "./PasswordStrength";

interface PasswordChecks {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

interface RegisterFormProps {
  email: string;
  password: string;
  passwordConfirmation: string;
  passwordChecks: PasswordChecks;
  passwordScore: number;
  passwordStrength: "weak" | "medium" | "strong";
  passwordsMatch: boolean;
  loading: boolean;
  canSubmit: boolean;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onPasswordConfirmationChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

function RegisterForm({
  email,
  password,
  passwordConfirmation,
  passwordChecks,
  passwordScore,
  passwordStrength,
  passwordsMatch,
  loading,
  canSubmit,
  onEmailChange,
  onPasswordChange,
  onPasswordConfirmationChange,
  onSubmit,
}: RegisterFormProps) {
  return (
    <form onSubmit={(event) => void onSubmit(event)}>
      <label htmlFor="register-email">Adresse e-mail</label>
      <input
        id="register-email"
        type="email"
        value={email}
        onChange={(event) => onEmailChange(event.target.value)}
        autoComplete="email"
        required
      />

      <label htmlFor="register-password">Mot de passe</label>
      <input
        id="register-password"
        type="password"
        value={password}
        onChange={(event) => onPasswordChange(event.target.value)}
        autoComplete="new-password"
        minLength={8}
        maxLength={128}
        required
      />

      {password.length > 0 && (
        <PasswordStrength
          checks={passwordChecks}
          score={passwordScore}
          strength={passwordStrength}
        />
      )}

      <label htmlFor="register-password-confirmation">
        Confirmer le mot de passe
      </label>
      <input
        id="register-password-confirmation"
        type="password"
        value={passwordConfirmation}
        onChange={(event) =>
          onPasswordConfirmationChange(event.target.value)
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

      <button type="submit" disabled={!canSubmit}>
        {loading ? "Création en cours..." : "Créer mon compte"}
      </button>
    </form>
  );
}

export default RegisterForm;