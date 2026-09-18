import Header from "../components/Header";
import ItemCard from "../components/ItemCard";
import { recettesMock } from "../data/mockItems";

function HomePage() {
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
          />
        </section>

        <section className="catalogue">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Catalogue</p>
              <h2>Recettes à découvrir</h2>
            </div>

            <span>{recettesMock.length} recettes</span>
          </div>

          <div className="recipe-grid">
            {recettesMock.map((recette) => (
              <ItemCard key={recette.id} item={recette} />
            ))}
          </div>
        </section>
      </main>
    </>
  );
}

export default HomePage;