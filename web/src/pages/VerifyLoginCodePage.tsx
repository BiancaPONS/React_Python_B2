import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import { HttpError } from "../services/http";


function VerifyLoginCodePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { verifyLoginCode } = useAuth();


  const challengeIdFromUrl = searchParams.get("challenge_id");
  const challengeId =
    challengeIdFromUrl !== null ? Number(challengeIdFromUrl) : NaN;


  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  if (Number.isNaN(challengeId)) {
    return (
      <main className="form-page">
        <section className="form-card">
          <Link className="back-link" to="/">
            <span aria-hidden="true">←</span>
            <span>Retour à l’accueil</span>
          </Link>


          <h1>Lien de vérification invalide</h1>


          <p>
            Veuillez vous connecter à nouveau pour recevoir un code.
          </p>


          <p className="form-link">
            <Link to="/login">Se connecter</Link>
          </p>
        </section>
      </main>
    );
  }


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();


    setError("");
    setLoading(true);


    try {
      await verifyLoginCode({
        challenge_id: challengeId,
        code,
      });


      navigate("/");
    } catch (caughtError: unknown) {
      if (caughtError instanceof HttpError) {
        setError(caughtError.message);
      } else if (caughtError instanceof Error) {
        setError(caughtError.message);
      } else {
        setError("Impossible de vérifier le code.");
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


        <p className="eyebrow">Vérifiez votre boîte mail</p>


        <h1>Saisissez le code reçu</h1>


        <p>
          Un code à 6 chiffres a été envoyé à l’adresse associée à
          votre compte.
        </p>


        <form onSubmit={handleSubmit}>
          <label htmlFor="code">Code de vérification</label>


          <input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            value={code}
            onChange={(event) => setCode(event.target.value)}
            required
          />


          <button type="submit" disabled={loading}>
            {loading ? "Vérification..." : "Vérifier"}
          </button>
        </form>


        {error !== "" && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}


        <p className="form-link">
          Vous n’avez pas reçu de code ?{" "}
          <Link to="/login">Recommencer la connexion</Link>
        </p>
      </section>
    </main>
  );
}


export default VerifyLoginCodePage;