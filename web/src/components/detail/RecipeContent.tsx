import type { Item, Statut } from "../../types/api";

import RecipeControls from "./RecipeControls";

interface RecipeContentProps {
  recette: Item;
  isInCollection: boolean;
  commentaire: string;
  statut: Statut;
  note: string;
  adding: boolean;
  updating: boolean;
  removing: boolean;
  message: string;
  onCommentChange: (value: string) => void;
  onStatusChange: (value: Statut) => void;
  onNoteChange: (value: string) => void;
  onAdd: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

function RecipeContent({
  recette,
  isInCollection,
  commentaire,
  statut,
  note,
  adding,
  updating,
  removing,
  message,
  onCommentChange,
  onStatusChange,
  onNoteChange,
  onAdd,
  onUpdate,
  onDelete,
}: RecipeContentProps) {
  return (
    <article className="detail-card">
      <div className="detail-media-column">
        {recette.image_url === null ? (
          <div
            className="detail-image recipe-image-placeholder"
            role="img"
            aria-label={`Image de ${recette.titre} à venir`}
          >
            Image à venir
          </div>
        ) : (
          <img
            className="detail-image"
            src={recette.image_url}
            alt={recette.titre}
          />
        )}

        {isInCollection && (
          <section className="comment-section">
            <h2>Votre commentaire</h2>
            <textarea
              className="comment-input"
              value={commentaire}
              onChange={(event) => onCommentChange(event.target.value)}
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

        <RecipeControls
          recette={recette}
          isInCollection={isInCollection}
          statut={statut}
          note={note}
          adding={adding}
          updating={updating}
          removing={removing}
          onStatusChange={onStatusChange}
          onNoteChange={onNoteChange}
          onAdd={onAdd}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />

        {message !== "" && (
          <p className="form-message" role="status">
            {message}
          </p>
        )}
      </div>
    </article>
  );
}

export default RecipeContent;