import type { ChangeEvent } from "react";


interface CatalogueFiltersProps {
  recherche: string;
  categorie: string;
  onRechercheChange: (value: string) => void;
  onCategorieChange: (value: string) => void;
}


const categories = [
  "Apéro",
  "Boissons",
  "Entrée",
  "Plat",
  "Dessert",
];


function CatalogueFilters({
  recherche,
  categorie,
  onRechercheChange,
  onCategorieChange,
}: CatalogueFiltersProps) {
  function handleRechercheChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    onRechercheChange(event.target.value);
  }

  function handleCategorieChange(
    event: ChangeEvent<HTMLSelectElement>,
  ): void {
    onCategorieChange(event.target.value);
  }

  return (
    <div className="catalogue-filters">
      <input
        id="recipe-search"
        className="search-input"
        type="search"
        placeholder="Rechercher une recette..."
        aria-label="Rechercher une recette"
        value={recherche}
        onChange={handleRechercheChange}
      />

      <select
        className="category-select"
        value={categorie}
        onChange={handleCategorieChange}
        aria-label="Filtrer les recettes par catégorie"
      >
        <option value="">Toutes les catégories</option>

        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
}


export default CatalogueFilters;