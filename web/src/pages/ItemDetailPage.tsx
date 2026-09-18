import { Link, useParams } from "react-router-dom";
import { recettesMock } from "../data/mockItems";

function ItemDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const recette = recettesMock.find((item) => item.id === Number(itemId));

  if (!recette) {
    return (
      <main className="page">
        <h1>Recette introuvable</h1>
        <Link to="/">Retour au catalogue</Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link to="/">← Retour au catalogue</Link>

      <article className="detail-card">
        <img
          className="detail-image"
          src={recette.image_url}
          alt={recette.titre}
        />

        <div className="detail-content">
          <p className="eyebrow">{recette.categorie}</p>
          <h1>{recette.titre}</h1>
          <p>{recette.description}</p>

          <div className="recipe-details">
            <span>{recette.temps_preparation} min</span>
            <span>{recette.difficulte}</span>
            <span>{recette.type_plat}</span>
          </div>

          <button type="button">Ajouter à ma collection</button>
        </div>
      </article>
    </main>
  );
}

export default ItemDetailPage;