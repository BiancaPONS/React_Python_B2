import { Link } from "react-router-dom";

import type { Item } from "../types/api";

interface ItemCardProps {
  item: Item;
}

function ItemCard({ item }: ItemCardProps) {
  return (
    <article className="recipe-card">
      <Link
        className="recipe-image-link"
        to={`/items/${item.id}`}
        data-discover="true"
      >
        {item.image_url !== null ? (
          <img
            className="recipe-image"
            src={item.image_url}
            alt={item.titre}
          />
        ) : (
          <div
            className="recipe-image recipe-image-placeholder"
            role="img"
            aria-label={`Image de ${item.titre} indisponible`}
          >
            Aucune image disponible
          </div>
        )}
      </Link>

      <div className="recipe-content">
        <span className="recipe-category">{item.categorie}</span>

        <h2>{item.titre}</h2>

        <div className="recipe-details">
          <span>{item.temps_preparation} min</span>
          <span>{item.difficulte}</span>

          {item.type_plat && (
            <span>{item.type_plat}</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ItemCard;