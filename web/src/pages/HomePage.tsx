import { useState } from "react";
import Header from "../components/Header";
import ItemCard from "../components/ItemCard";
import { recettesMock } from "../data/mockItems";

function HomePage() {
  const [recherche, setRecherche] = useState("");

  const recettesFiltrees = recettesMock.filter((recette) => {
    const texte = recherche.toLowerCase();

    return (
      recette.titre.toLowerCase().includes(texte) ||
      recette.categorie.toLowerCase().includes(texte) ||
      recette.type_plat.toLowerCase().includes(texte)
    );
  });

  return (
    <>
      <Header />

      <main className="page">
        <section className="hero">
          <p className="eyebrow">Votre carnet culinaire</p>

          <h1>Ma Collection de recettes</h1>

          <p className="hero-text">
            Découvrez, enregistrez et notez vos recettes préférées.
          </p>

          <input
            className="search-input"
            type="search"
            placeholder="Rechercher une recette..."
            value={recherche}
            onChange={(event) => setRecherche(event.target.value)}
          />
        </section>

        <section className="catalogue">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Catalogue</p>
              <h2>Recettes à découvrir</h2>
            </div>

            <span>{recettesFiltrees.length} recettes</span>
          </div>

          {recettesFiltrees.length === 0 ? (
            <p className="empty-message">
              Aucune recette ne correspond à votre recherche.
            </p>
          ) : (
            <div className="recipe-grid">
              {recettesFiltrees.map((recette) => (
                <ItemCard key={recette.id} item={recette} />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default HomePage;