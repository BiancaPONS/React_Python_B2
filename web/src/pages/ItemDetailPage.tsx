import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { HttpError } from "../services/http";
import { getItem } from "../services/itemService";
import type { Item } from "../types/api";

function ItemDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();

  const [recette, setRecette] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadItem(): Promise<void> {
      if (itemId === undefined) {
        setError("Identifiant de recette invalide.");
        setLoading(false);
        return;
      }

      const numericItemId = Number(itemId);

      if (!Number.isInteger(numericItemId) || numericItemId <= 0) {
        setError("Identifiant de recette invalide.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await getItem(numericItemId);

        if (!cancelled) {
          setRecette(response);
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
          setError("Impossible de charger la recette.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadItem();

    return () => {
      cancelled = true;
    };
  }, [itemId]);

  if (loading) {
    return (
      <main className="page">
        <p>Chargement de la recette...</p>
      </main>
    );
  }

  if (error !== "") {
    return (
      <main className="page">
        <h1>Recette introuvable</h1>
        <p className="form-error">{error}</p>
        <Link to="/">Retour au catalogue</Link>
      </main>
    );
  }

  if (recette === null) {
    return (
      <main className="page">
        <h1>Recette introuvable</h1>
        <Link to="/">Retour au catalogue</Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link to="/">← Retour au catalogue</Link>

      <article className="detail-card">
        {recette.image_url !== null ? (
          <img
            className="detail-image"
            src={recette.image_url}
            alt={recette.titre}
          />
        ) : (
          <div className="detail-image recipe-image-placeholder">
            Image à venir
          </div>
        )}

        <div className="detail-content">
          <p className="eyebrow">{recette.categorie}</p>

          <h1>{recette.titre}</h1>

          <p>{recette.description}</p>

          <div className="recipe-details">
            <span>{recette.temps_preparation} min</span>
            <span>{recette.difficulte}</span>
            <span>{recette.type_plat}</span>
          </div>

          <button type="button">
            Ajouter à ma collection
          </button>
        </div>
      </article>
    </main>
  );
}

export default ItemDetailPage;