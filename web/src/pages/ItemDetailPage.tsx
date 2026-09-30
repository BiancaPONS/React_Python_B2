import {
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import EmptyMessage from "../components/EmptyMessage";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import RecipeContent from "../components/detail/RecipeContent";
import { useItemDetail } from "../hooks/useItemDetail";

function ItemDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const detail = useItemDetail(itemId);

  const backLabel =
    searchParams.get("from") === "collection"
      ? "Retour à ma collection"
      : "Retour au catalogue";

  const backButton = (
    <button
      className="back-link"
      type="button"
      onClick={() => navigate(-1)}
    >
      <span aria-hidden="true">←</span>
      <span>{backLabel}</span>
    </button>
  );

  if (detail.loading) {
    return (
      <main className="page">
        <LoadingMessage message="Chargement de la recette..." />
      </main>
    );
  }

  if (detail.error !== "") {
    return (
      <main className="page">
        {backButton}
        <h1>Recette introuvable</h1>
        <ErrorMessage message={detail.error} />
      </main>
    );
  }

  if (detail.recette === null) {
    return (
      <main className="page">
        {backButton}
        <h1>Recette introuvable</h1>
        <EmptyMessage message="Aucune recette ne correspond à cet identifiant." />
      </main>
    );
  }

  return (
    <main className="page">
      {backButton}
      <RecipeContent
        recette={detail.recette}
        isInCollection={detail.collectionEntry !== null}
        commentaire={detail.commentaire}
        statut={detail.statut}
        note={detail.note}
        adding={detail.adding}
        updating={detail.updating}
        removing={detail.removing}
        message={detail.message}
        onCommentChange={detail.setCommentaire}
        onStatusChange={detail.setStatut}
        onNoteChange={detail.setNote}
        onAdd={() => void detail.add()}
        onUpdate={() => void detail.update()}
        onDelete={() => void detail.remove()}
      />
    </main>
  );
}

export default ItemDetailPage;