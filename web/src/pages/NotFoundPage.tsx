import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="page not-found-page">
      <section className="not-found-card">
        <p className="eyebrow">Erreur 404</p>

        <h1>Cette page n’existe pas</h1>

        <p>
          Désolée, la page que vous recherchez n’existe pas ou
          l’adresse saisie est incorrecte.
        </p>

        <Link className="primary-action" to="/">
          Retourner au catalogue
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
