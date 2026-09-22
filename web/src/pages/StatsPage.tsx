import { Link } from "react-router-dom";

function StatsPage() {
  return (
    <main className="page personal-page">
      <Link className="back-link" to="/">
        <span aria-hidden="true">←</span>
        Retour au catalogue
      </Link>

      <section className="personal-header">
        <p className="eyebrow">Espace personnel</p>

        <h1>Mes statistiques</h1>

        <p>
          Suivez votre activité et l’évolution de votre collection
          de recettes.
        </p>
      </section>

      <section className="empty-personal-card" aria-live="polite">
        <div className="empty-personal-icon" aria-hidden="true">
          ✦
        </div>

        <p className="eyebrow">Pas encore de statistiques</p>

        <h2>Votre carnet prend vie petit à petit</h2>

        <p>
          Ajoutez et réalisez des recettes pour découvrir vos
          statistiques personnelles.
        </p>

        <Link className="primary-action" to="/">
          Retourner au catalogue
        </Link>
      </section>
    </main>
  );
}

export default StatsPage;