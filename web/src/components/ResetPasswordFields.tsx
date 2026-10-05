import PasswordStrength from "./register/PasswordStrength";


export interface PasswordChecks {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}


interface ResetPasswordFieldsProps {
  code: string;
  newPassword: string;
  passwordConfirmation: string;
  loading: boolean;
  onCodeChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onPasswordConfirmationChange: (value: string) => void;
}


export function getPasswordChecks(
  password: string,
): PasswordChecks {
  return {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
}


export function isPasswordStrong(
  password: string,
): boolean {
  const checks = getPasswordChecks(password);

  return (
    checks.length
    && checks.lowercase
    && checks.uppercase
    && checks.number
    && checks.special
  );
}


function getPasswordScore(
  checks: PasswordChecks,
): number {
  return Object.values(checks).filter(Boolean).length;
}
function getPasswordStrength(
  score: number,
): "weak" | "medium" | "strong" {
  if (score <= 2) {
    return "weak";
  }

  if (score <= 4) {
    return "medium";
  }

  return "strong";
}
function ResetPasswordFields({
  code,
  newPassword,
  passwordConfirmation,
  loading,
  onCodeChange,
  onNewPasswordChange,
  onPasswordConfirmationChange,
}: ResetPasswordFieldsProps) {
  const checks = getPasswordChecks(newPassword);
  const score = getPasswordScore(checks);
  const strength = getPasswordStrength(score);
  return (
    <>
      <label htmlFor="code">
        Code de réinitialisation
      </label>

      <input
        id="code"
        name="code"
        type="text"
        inputMode="numeric"
        pattern="[0-9]{6}"
        maxLength={6}
        autoComplete="one-time-code"
        value={code}
        onChange={(event) => onCodeChange(event.target.value)}
        required
      />

      <label htmlFor="new-password">
        Nouveau mot de passe
      </label>

      <input
        id="new-password"
        name="new-password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
        value={newPassword}
        onChange={(event) =>
          onNewPasswordChange(event.target.value)
        }
        required
      />
      {newPassword !== "" && (
        <PasswordStrength
          checks={checks}
          score={score}
          strength={strength}
        />
      )}
      <label htmlFor="password-confirmation">
        Confirmer le nouveau mot de passe
      </label>
      <input
        id="password-confirmation"
        name="password-confirmation"
        type="password"
        autoComplete="new-password"
        minLength={8}
        maxLength={72}
        value={passwordConfirmation}
        onChange={(event) =>
          onPasswordConfirmationChange(event.target.value)
        }
        required
      />
      <button type="submit" disabled={loading}>
        {loading
          ? "Réinitialisation..."
          : "Changer le mot de passe"}
      </button>
    </>
  );
}
export default ResetPasswordFields;