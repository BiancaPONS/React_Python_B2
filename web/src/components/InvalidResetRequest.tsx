import { Link } from "react-router-dom";


function InvalidResetRequest() {
  return (
    <main className="form-page">
      <section className="form-card">
        <Link className="back-link" to="/login">
          <span aria-hidden="true">←</span>
          <span>Retour à la connexion</span>
        </Link>

        <h1>Demande invalide</h1>

        <p>
          Cette demande de réinitialisation est invalide ou
          incomplète.
        </p>

        <p className="form-link">
          <Link to="/forgot-password">
            Demander un nouveau code
          </Link>
        </p>
      </section>
    </main>
  );
}


export default InvalidResetRequest;