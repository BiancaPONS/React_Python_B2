interface PasswordChecks {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  number: boolean;
  special: boolean;
}

interface PasswordStrengthProps {
  checks: PasswordChecks;
  score: number;
  strength: "weak" | "medium" | "strong";
}

function PasswordRule({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <li className={valid ? "password-rule-valid" : ""}>
      <span aria-hidden="true">{valid ? "✓" : "○"}</span>
      {text}
    </li>
  );
}

function PasswordStrength({
  checks,
  score,
  strength,
}: PasswordStrengthProps) {
  const label =
    strength === "weak"
      ? "Faible"
      : strength === "medium"
        ? "Moyenne"
        : "Forte";

  return (
    <div
      className={`password-strength password-strength-${strength}`}
      aria-live="polite"
    >
      <div className="password-strength-header">
        <span>Force du mot de passe</span>
        <strong>{label}</strong>
      </div>

      <div className="password-strength-bar" aria-hidden="true">
        <span style={{ width: `${(score / 5) * 100}%` }} />
      </div>

      <ul className="password-rules">
        <PasswordRule
          valid={checks.length}
          text="8 caractères minimum"
        />
        <PasswordRule
          valid={checks.lowercase}
          text="Une lettre minuscule"
        />
        <PasswordRule
          valid={checks.uppercase}
          text="Une lettre majuscule"
        />
        <PasswordRule valid={checks.number} text="Un chiffre" />
        <PasswordRule
          valid={checks.special}
          text="Un caractère spécial"
        />
      </ul>
    </div>
  );
}

export default PasswordStrength;