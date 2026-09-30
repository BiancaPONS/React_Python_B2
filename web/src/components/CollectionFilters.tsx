import type { Statut } from "../types/api";


export type CollectionSort = "date_desc" | "date_asc" | "note_desc" | "note_asc";
export type StatusFilter = Statut | "";
export type MinRating = "" | "1" | "2" | "3" | "4" | "5";


interface CollectionFiltersProps {
  categories: string[];
  category: string;
  status: StatusFilter;
  minRating: MinRating;
  sort: CollectionSort;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onMinRatingChange: (value: MinRating) => void;
  onSortChange: (value: CollectionSort) => void;
}


function CollectionFilters({
  categories,
  category,
  status,
  minRating,
  sort,
  onCategoryChange,
  onStatusChange,
  onMinRatingChange,
  onSortChange,
}: CollectionFiltersProps) {
  return (
    <div className="collection-filters">
      <label>
        Catégorie
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">Toutes les catégories</option>
          {categories.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      <label>
        Statut
        <select
          value={status}
          onChange={(event) =>
            onStatusChange(event.target.value as StatusFilter)
          }
        >
          <option value="">Tous les statuts</option>
          <option value="a_decouvrir">À découvrir</option>
          <option value="en_cours">En cours</option>
          <option value="termine">Terminé</option>
        </select>
      </label>

      <label>
        Note minimale
        <select
          value={minRating}
          onChange={(event) =>
            onMinRatingChange(event.target.value as MinRating)
          }
        >
          <option value="">Toutes les notes</option>
          <option value="1">1 étoile et plus</option>
          <option value="2">2 étoiles et plus</option>
          <option value="3">3 étoiles et plus</option>
          <option value="4">4 étoiles et plus</option>
          <option value="5">5 étoiles</option>
        </select>
      </label>

      <label>
        Trier par
        <select
          value={sort}
          onChange={(event) =>
            onSortChange(event.target.value as CollectionSort)
          }
        >
          <option value="date_desc">Ajout récent</option>
          <option value="date_asc">Ajout ancien</option>
          <option value="note_desc">Meilleures notes</option>
          <option value="note_asc">Notes croissantes</option>
        </select>
      </label>
    </div>
  );
}


export default CollectionFilters;