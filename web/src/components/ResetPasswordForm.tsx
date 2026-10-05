import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import ResetPasswordFields, {
  isPasswordStrong,
} from "./ResetPasswordFields";
import { resetPassword } from "../services/authService";
import { HttpError } from "../services/http";


interface ResetPasswordFormProps {
  challengeId: number;
}


function ResetPasswordForm({
  challengeId,
}: ResetPasswordFormProps) {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] =
    useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    setError("");

    if (!isPasswordStrong(newPassword)) {
      setError(
        "Le mot de passe doit respecter toutes les règles.",
      );
      return;
    }

    if (newPassword !== passwordConfirmation) {
      setError("Les deux mots de passe sont différents.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword({
        challenge_id: challengeId,
        code,
        new_password: newPassword,
      });

      navigate("/login", {
        replace: true,
        state: {
          message:
            "Mot de passe réinitialisé. Vous pouvez vous connecter.",
        },
      });
    } catch (caughtError: unknown) {
      setError(getErrorMessage(caughtError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="form-page">
      <section className="form-card">
        <Link className="back-link" to="/forgot-password">
          <span aria-hidden="true">←</span>
          <span>Redemander un code</span>
        </Link>

        <p className="eyebrow">Dernière étape</p>

        <h1>Réinitialisez votre mot de passe</h1>

        <p>
          Saisissez le code reçu par email, puis choisissez un
          nouveau mot de passe.
        </p>

        <form onSubmit={handleSubmit}>
          <ResetPasswordFields
            code={code}
            newPassword={newPassword}
            passwordConfirmation={passwordConfirmation}
            loading={loading}
            onCodeChange={setCode}
            onNewPasswordChange={setNewPassword}
            onPasswordConfirmationChange={
              setPasswordConfirmation
            }
          />
        </form>

        {error !== "" && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}

        <p className="form-link">
          <Link to="/login">Retour à la connexion</Link>
        </p>
      </section>
    </main>
  );
}


function getErrorMessage(caughtError: unknown): string {
  if (caughtError instanceof HttpError) {
    return caughtError.message;
  }

  if (caughtError instanceof Error) {
    return caughtError.message;
  }

  return "Impossible de réinitialiser le mot de passe.";
}


export default ResetPasswordForm;