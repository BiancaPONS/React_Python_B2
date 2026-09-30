import type { Item, Statut } from "../../types/api";

interface RecipeControlsProps {
  recette: Item;
  isInCollection: boolean;
  statut: Statut;
  note: string;
  adding: boolean;
  updating: boolean;
  removing: boolean;
  onStatusChange: (value: Statut) => void;
  onNoteChange: (value: string) => void;
  onAdd: () => void;
  onUpdate: () => void;
  onDelete: () => void;
}

function RecipeControls({
  recette,
  isInCollection,
  statut,
  note,
  adding,
  updating,
  removing,
  onStatusChange,
  onNoteChange,
  onAdd,
  onUpdate,
  onDelete,
}: RecipeControlsProps) {
  return (
    <>
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
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}/5
                  </option>
                ))}
              </select>
            </label>

            <label className="status-control">
              <span>Statut</span>
              <select
                value={statut}
                onChange={(event) =>
                  onStatusChange(event.target.value as Statut)
                }
              >
                <option value="a_decouvrir">À découvrir</option>
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
              </select>
            </label>
          </>
        )}
      </div>

      {!isInCollection ? (
        <button type="button" onClick={onAdd} disabled={adding}>
          {adding ? "Ajout en cours..." : "Ajouter à ma collection"}
        </button>
      ) : (
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
      )}
    </>
  );
}

export default RecipeControls;