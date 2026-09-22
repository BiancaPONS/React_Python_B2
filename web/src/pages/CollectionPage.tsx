import { Link } from "react-router-dom";

function CollectionPage() {
  return (
    <main className="page personal-page">
      <Link className="back-link" to="/">
        <span aria-hidden="true">←</span>
        Retour au catalogue
      </Link>

      <section className="personal-header">
        <p className="eyebrow">Espace personnel</p>

        <h1>Ma collection</h1>

        <p>
          Retrouvez ici les recettes que vous souhaitez garder
          précieusement dans votre carnet.
        </p>
      </section>

      <section className="empty-personal-card" aria-live="polite">
        <div className="empty-personal-icon" aria-hidden="true">
          ♨
        </div>

        <p className="eyebrow">Carnet encore vide</p>

        <h2>Votre collection vous attend</h2>

        <p>
          Parcourez le catalogue et ajoutez vos recettes préférées
          pour les retrouver facilement ici.
        </p>

        <Link className="primary-action" to="/">
          Découvrir les recettes
        </Link>
      </section>
    </main>
  );
}

export default CollectionPage;