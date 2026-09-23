import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import EmptyMessage from "../components/EmptyMessage";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import { addToCollection } from "../services/collectionService";
import { HttpError } from "../services/http";
import { getItem } from "../services/itemService";
import type { Item } from "../types/api";

function ItemDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();

  const [recette, setRecette] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
      setMessage("");
      setRecette(null);

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

  async function handleAddToCollection(): Promise<void> {
    if (recette === null || adding) {
      return;
    }

    setAdding(true);
    setMessage("");

    try {
      await addToCollection(recette.id);
      setMessage("Recette ajoutée à votre collection.");
    } catch (caughtError: unknown) {
      if (caughtError instanceof HttpError) {
        setMessage(caughtError.message);
      } else if (caughtError instanceof Error) {
        setMessage(caughtError.message);
      } else {
        setMessage(
          "Impossible d'ajouter la recette à votre collection.",
        );
      }
    } finally {
      setAdding(false);
    }
  }

  if (loading) {
    return (
      <main className="page">
        <LoadingMessage message="Chargement de la recette..." />
      </main>
    );
  }

  if (error !== "") {
    return (
      <main className="page">
        <Link className="back-link" to="/">
          <span aria-hidden="true">←</span>
          <span>Retour au catalogue</span>
        </Link>

        <h1>Recette introuvable</h1>
        <ErrorMessage message={error} />
      </main>
    );
  }

  if (recette === null) {
    return (
      <main className="page">
        <Link className="back-link" to="/">
          <span aria-hidden="true">←</span>
          <span>Retour au catalogue</span>
        </Link>

        <h1>Recette introuvable</h1>
        <EmptyMessage message="Aucune recette ne correspond à cet identifiant." />
      </main>
    );
  }

  return (
    <main className="page">
      <Link className="back-link" to="/">
        <span aria-hidden="true">←</span>
        <span>Retour au catalogue</span>
      </Link>

      <article className="detail-card">
        {recette.image_url !== null ? (
          <img
            className="detail-image"
            src={recette.image_url}
            alt={recette.titre}
          />
        ) : (
          <div
            className="detail-image recipe-image-placeholder"
            role="img"
            aria-label={`Image de ${recette.titre} à venir`}
          >
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

            {recette.type_plat && (
              <span>{recette.type_plat}</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              void handleAddToCollection();
            }}
            disabled={adding}
          >
            {adding
              ? "Ajout en cours..."
              : "Ajouter à ma collection"}
          </button>

          {message !== "" && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}
        </div>
      </article>
    </main>
  );
}

export default ItemDetailPage;