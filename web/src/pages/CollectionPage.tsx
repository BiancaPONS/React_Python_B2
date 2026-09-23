import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import EmptyMessage from "../components/EmptyMessage";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import { getCollection } from "../services/collectionService";
import { HttpError } from "../services/http";
import type { Entry } from "../types/api";

function CollectionPage() {
  const [collection, setCollection] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCollection(): Promise<void> {
      setLoading(true);
      setError("");

      try {
        const response = await getCollection();

        if (!cancelled) {
          setCollection(response);
        }
      } catch (caughtError: unknown) {
        if (cancelled) {
          return;
        }

        if (caughtError instanceof HttpError) {
          setError(caughtError.message);
        } else if (caughtError instanceof Error) {
          setError(caughtError.message);
        } else {
          setError("Impossible de charger votre collection.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCollection();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <main className="page">
        <p className="eyebrow">Espace personnel</p>
        <h1>Ma collection</h1>
        <LoadingMessage message="Chargement de votre collection..." />
      </main>
    );
  }

  if (error !== "") {
    return (
      <main className="page">
        <p className="eyebrow">Espace personnel</p>
        <h1>Ma collection</h1>
        <ErrorMessage message={error} />
      </main>
    );
  }

  return (
    <main className="page">
      <p className="eyebrow">Espace personnel</p>

      <h1>Ma collection</h1>

      <p className="hero-text">
        Retrouvez ici les recettes que vous souhaitez garder
        précieusement dans votre carnet.
      </p>

      {collection.length === 0 ? (
        <section className="empty-collection">
          <EmptyMessage message="Votre collection est encore vide." />

          <Link className="primary-action" to="/">
            Découvrir les recettes
          </Link>
        </section>
      ) : (
        <section className="recipe-grid">
          {collection.map((entry) => (
            <article
              className="recipe-card"
              key={entry.id}
            >
              <Link to={`/items/${entry.item.id}`}>
                {entry.item.image_url !== null ? (
                  <img
                    className="recipe-image"
                    src={entry.item.image_url}
                    alt={entry.item.titre}
                  />
                ) : (
                  <div className="recipe-image recipe-image-placeholder">
                    Aucune image disponible
                  </div>
                )}
              </Link>

              <div className="recipe-content">
                <span className="recipe-category">
                  {entry.item.categorie}
                </span>

                <h2>{entry.item.titre}</h2>

                <div className="recipe-details">
                  <span>{entry.item.temps_preparation} min</span>
                  <span>{entry.item.difficulte}</span>
                  <span>{entry.statut}</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default CollectionPage;