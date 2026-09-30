import CatalogueFilters from "../components/CatalogueFilters";
import CataloguePagination from "../components/CataloguePagination";
import EmptyMessage from "../components/EmptyMessage";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";
import ItemCard from "../components/ItemCard";
import LoadingMessage from "../components/LoadingMessage";
import { useCatalogue } from "../hooks/useCatalogue";


function HomePage() {
  const {
    recherche,
    setRecherche,
    categorie,
    setCategorie,
    page,
    setPage,
    recettes,
    total,
    totalPages,
    loading,
    error,
  } = useCatalogue();

  return (
    <>
      <Header />

      <main className="page">
        <section className="hero">
          <p className="eyebrow">Votre carnet culinaire</p>
          <h1>Ma collection de recettes</h1>

          <p className="hero-text">
            Découvrez, enregistrez et notez vos recettes préférées.
          </p>

          <CatalogueFilters
            recherche={recherche}
            categorie={categorie}
            onRechercheChange={setRecherche}
            onCategorieChange={setCategorie}
          />
        </section>

        <section className="catalogue">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Catalogue</p>
              <h2>Recettes à découvrir</h2>
            </div>

            {!loading && error === "" && (
              <span>
                {total} recette{total !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {loading && (
            <LoadingMessage message="Chargement des recettes..." />
          )}

          {!loading && error !== "" && (
            <ErrorMessage message={error} />
          )}

          {!loading && error === "" && recettes.length === 0 && (
            <EmptyMessage
              message={
                recherche.trim() === "" && categorie === ""
                  ? "Aucune recette disponible pour le moment."
                  : "Aucune recette ne correspond à votre recherche."
              }
            />
          )}

          {!loading && error === "" && recettes.length > 0 && (
            <>
              <div className="recipe-grid">
                {recettes.map((recette) => (
                  <ItemCard
                    key={recette.id}
                    item={recette}
                  />
                ))}
              </div>

              <CataloguePagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </section>
      </main>
    </>
  );
}


export default HomePage;