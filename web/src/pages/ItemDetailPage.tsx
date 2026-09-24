import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import EmptyMessage from "../components/EmptyMessage";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import {
  addToCollection,
  deleteCollectionEntry,
  getCollection,
  updateCollectionEntry,
} from "../services/collectionService";
import { HttpError } from "../services/http";
import { getItem } from "../services/itemService";
import type { Entry, Item, Statut } from "../types/api";

function ItemDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fromCollection = searchParams.get("from") === "collection";
  const backLabel = fromCollection
    ? "Retour à ma collection"
    : "Retour au catalogue";

  const [recette, setRecette] = useState<Item | null>(null);
  const [collectionEntry, setCollectionEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [statut, setStatut] = useState<Statut>("a_decouvrir");
  const [note, setNote] = useState("");
  const [commentaire, setCommentaire] = useState("");

  function goBack(): void {
    navigate(-1);
  }

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
      setCollectionEntry(null);

      try {
        const response = await getItem(numericItemId);

        if (cancelled) {
          return;
        }

        setRecette(response);

        try {
          const entries = await getCollection();
          const currentEntry = entries.find(
            (entry) => entry.item.id === numericItemId,
          );

          if (currentEntry !== undefined) {
            setCollectionEntry(currentEntry);
            setStatut(currentEntry.statut);
            setNote(
              currentEntry.note === null
                ? ""
                : String(currentEntry.note),
            );
            setCommentaire(currentEntry.commentaire ?? "");
          } else {
            setStatut("a_decouvrir");
            setNote("");
            setCommentaire("");
          }
        } catch {
          setCollectionEntry(null);
        }
      } catch (caughtError: unknown) {
        if (cancelled) {
          return;
        }

        setError(getErrorMessage(caughtError));
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
    if (recette === null || adding || collectionEntry !== null) {
      return;
    }

    setAdding(true);
    setMessage("");

    try {
      const entry = await addToCollection(recette.id, statut);
      setCollectionEntry(entry);
      setMessage("Recette ajoutée à votre collection.");
    } catch (caughtError: unknown) {
      setMessage(getErrorMessage(caughtError));
    } finally {
      setAdding(false);
    }
  }

  async function handleUpdateCollection(): Promise<void> {
    if (recette === null || updating || collectionEntry === null) {
      return;
    }

    setUpdating(true);
    setMessage("");

    try {
      const updatedEntry = await updateCollectionEntry(recette.id, {
        statut,
        note: note === "" ? null : Number(note),
        commentaire:
          commentaire.trim() === "" ? null : commentaire.trim(),
      });

      setCollectionEntry(updatedEntry);
      setMessage("Votre recette a été mise à jour.");
    } catch (caughtError: unknown) {
      setMessage(getErrorMessage(caughtError));
    } finally {
      setUpdating(false);
    }
  }

  async function handleDeleteFromCollection(): Promise<void> {
    if (recette === null || removing || collectionEntry === null) {
      return;
    }

    if (!window.confirm("Voulez-vous vraiment supprimer cette recette de votre collection ?")) {
      return;
    }

    setRemoving(true);
    setMessage("");

    try {
      await deleteCollectionEntry(recette.id);
      setCollectionEntry(null);
      setStatut("a_decouvrir");
      setNote("");
      setCommentaire("");
      setMessage("Recette supprimée de votre collection.");
    } catch (caughtError: unknown) {
      setMessage(getErrorMessage(caughtError));
    } finally {
      setRemoving(false);
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
        <BackButton label={backLabel} onClick={goBack} />
        <h1>Recette introuvable</h1>
        <ErrorMessage message={error} />
      </main>
    );
  }

  if (recette === null) {
    return (
      <main className="page">
        <BackButton label={backLabel} onClick={goBack} />
        <h1>Recette introuvable</h1>
        <EmptyMessage message="Aucune recette ne correspond à cet identifiant." />
      </main>
    );
  }

  const isInCollection = collectionEntry !== null;

  return (
    <main className="page">
      <BackButton label={backLabel} onClick={goBack} />

      <article className="detail-card">
        <div className="detail-media-column">
          <RecipeImage recette={recette} />

          {isInCollection && (
            <section className="comment-section">
              <h2>Votre commentaire</h2>
              <textarea
                className="comment-input"
                value={commentaire}
                onChange={(event) => setCommentaire(event.target.value)}
                placeholder="Écrivez un commentaire sur cette recette..."
                rows={5}
              />
            </section>
          )}
        </div>

        <div className="detail-content">
          <p className="eyebrow">{recette.categorie}</p>
          <h1>{recette.titre}</h1>

          <section className="recipe-description">
            <h2>Description</h2>
            <p>{recette.description}</p>
          </section>

          <section className="recipe-ingredients">
            <h2>Ingrédients</h2>
            <p className="recipe-text">{recette.ingredients}</p>
          </section>

          <section className="recipe-preparation">
            <h2>Préparation</h2>
            <p className="recipe-text">{recette.preparation}</p>
          </section>

          <RecipeDetails
            recette={recette}
            isInCollection={isInCollection}
            note={note}
            statut={statut}
            onNoteChange={setNote}
            onStatusChange={setStatut}
          />

          {!isInCollection ? (
            <button
              type="button"
              onClick={() => void handleAddToCollection()}
              disabled={adding}
            >
              {adding ? "Ajout en cours..." : "Ajouter à ma collection"}
            </button>
          ) : (
            <CollectionActions
              onUpdate={() => void handleUpdateCollection()}
              onDelete={() => void handleDeleteFromCollection()}
              updating={updating}
              removing={removing}
            />
          )}

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

interface BackButtonProps {
  label: string;
  onClick: () => void;
}

function BackButton({ label, onClick }: BackButtonProps) {
  return (
    <button className="back-link" type="button" onClick={onClick}>
      <span aria-hidden="true">←</span>
      <span>{label}</span>
    </button>
  );
}

function RecipeImage({ recette }: { recette: Item }) {
  if (recette.image_url === null) {
    return (
      <div
        className="detail-image recipe-image-placeholder"
        role="img"
        aria-label={`Image de ${recette.titre} à venir`}
      >
        Image à venir
      </div>
    );
  }

  return (
    <img
      className="detail-image"
      src={recette.image_url}
      alt={recette.titre}
    />
  );
}

interface RecipeDetailsProps {
  recette: Item;
  isInCollection: boolean;
  note: string;
  statut: Statut;
  onNoteChange: (value: string) => void;
  onStatusChange: (value: Statut) => void;
}

function RecipeDetails({
  recette,
  isInCollection,
  note,
  statut,
  onNoteChange,
  onStatusChange,
}: RecipeDetailsProps) {
  return (
    <div className="recipe-details">
      <span>{recette.temps_preparation} min</span>
      <span>{recette.difficulte}</span>

      {isInCollection && (
        <>
          <label className="rating-control">
            <span>Note</span>
            <select
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              aria-label="Note de la recette sur 5"
            >
              <option value="">—</option>
              <option value="1">1/5</option>
              <option value="2">2/5</option>
              <option value="3">3/5</option>
              <option value="4">4/5</option>
              <option value="5">5/5</option>
            </select>
          </label>

          <label className="status-control">
            <span>Statut</span>
            <select
              value={statut}
              onChange={(event) => {
                onStatusChange(event.target.value as Statut);
              }}
            >
              <option value="a_decouvrir">À découvrir</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </label>
        </>
      )}
    </div>
  );
}

interface CollectionActionsProps {
  onUpdate: () => void;
  onDelete: () => void;
  updating: boolean;
  removing: boolean;
}

function CollectionActions({
  onUpdate,
  onDelete,
  updating,
  removing,
}: CollectionActionsProps) {
  return (
    <div className="collection-actions">
      <button
        type="button"
        onClick={onUpdate}
        disabled={updating || removing}
      >
        {updating ? "Enregistrement..." : "Enregistrer"}
      </button>

      <button
        className="danger-action"
        type="button"
        onClick={onDelete}
        disabled={updating || removing}
      >
        {removing ? "Suppression..." : "Supprimer de ma collection"}
      </button>
    </div>
  );
}

function getErrorMessage(caughtError: unknown): string {
  if (caughtError instanceof HttpError) {
    return caughtError.message;
  }

  if (caughtError instanceof Error) {
    return caughtError.message;
  }

  return "Une erreur est survenue.";
}

export default ItemDetailPage;
