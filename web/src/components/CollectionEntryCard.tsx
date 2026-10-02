import { Link } from "react-router-dom";

import DietaryBadges from "./DietaryBadges";
import type { Entry, Statut } from "../types/api";


interface CollectionEntryCardProps {
  entry: Entry;
}


const statusLabels: Record<Statut, string> = {
  a_decouvrir: "À découvrir",
  en_cours: "En cours",
  termine: "Terminé",
};


function CollectionEntryCard({
  entry,
}: CollectionEntryCardProps) {
  const { item } = entry;


  return (
    <article className="recipe-card">
      <Link
        to={`/items/${item.id}?from=collection`}
        className="recipe-image-link"
      >
        {item.image_url !== null ? (
          <img
            className="recipe-image"
            src={item.image_url}
            alt={item.titre}
          />
        ) : (
          <div className="recipe-image recipe-image-placeholder">
            Aucune image disponible
          </div>
        )}
      </Link>


      <div className="recipe-content">
        <span className="recipe-category">
          {item.categorie}
        </span>


        <h2>{item.titre}</h2>


        <DietaryBadges item={item} />


        <div className="recipe-details">
          <span>{item.temps_preparation} min</span>
          <span>{item.difficulte}</span>
          <span>{statusLabels[entry.statut]}</span>


          {entry.note !== null && (
            <span className="recipe-rating">
              Note {entry.note}/5
            </span>
          )}
        </div>
      </div>
    </article>
  );
}


export default CollectionEntryCard;