import type { Item } from "../types/api";

interface ItemCardProps {
  item: Item;
}

function ItemCard({ item }: ItemCardProps) {
  return (
    <article className="recipe-card">
      <img
        className="recipe-image"
        src={item.image_url}
        alt={item.titre}
      />

      <div className="recipe-content">
        <span className="recipe-category">{item.categorie}</span>

        <h2>{item.titre}</h2>

        <p>{item.description}</p>

        <div className="recipe-details">
          <span>⏱ {item.temps_preparation} min</span>
          <span>● {item.difficulte}</span>
          <span>🍽 {item.type_plat}</span>
        </div>
      </div>
    </article>
  );
}

export default ItemCard;