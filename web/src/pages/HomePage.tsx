import { useEffect, useState } from "react";

import EmptyMessage from "../components/EmptyMessage";
import ErrorMessage from "../components/ErrorMessage";
import Header from "../components/Header";
import ItemCard from "../components/ItemCard";
import LoadingMessage from "../components/LoadingMessage";
import { HttpError } from "../services/http";
import { getItems } from "../services/itemService";
import type { Item } from "../types/api";


const ITEMS_PER_PAGE = 12;

const CATEGORIES = [
  "Apéro",
  "Boissons",
  "Entrée",
  "Plat",
  "Dessert",
];


function HomePage() {
  const [recherche, setRecherche] = useState("");
  const [rechercheDebounced, setRechercheDebounced] = useState("");
  const [categorie, setCategorie] = useState("");
  const [page, setPage] = useState(1);

  const [recettes, setRecettes] = useState<Item[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setRechercheDebounced(recherche.trim());
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [recherche]);

  useEffect(() => {
    setPage(1);
  }, [rechercheDebounced, categorie]);

  useEffect(() => {
    let cancelled = false;

    async function loadItems(): Promise<void> {
      setLoading(true);
      setError("");

      try {
        const response = await getItems({
          q: rechercheDebounced || undefined,
          categorie: categorie || undefined,
          page,
          limit: ITEMS_PER_PAGE,
        });

        if (!cancelled) {
          setRecettes(response.results);
          setTotal(response.total);
        }
      } catch (caughtError: unknown) {
        if (cancelled) {
          return;
        }

        if (caughtError instanceof HttpError) {
          setError(caughtError.message);
        } else if (caughtError instanceof Error) {
          setError(caughtError.message);
        } else {
          setError("Impossible de charger les recettes.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadItems();

    return () => {
      cancelled = true;
    };
  }, [rechercheDebounced, categorie, page]);

  const totalPages = Math.max(
    1,
    Math.ceil(total / ITEMS_PER_PAGE),
  );

  function handleRechercheChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    setRecherche(event.target.value);
  }

  function handleCategorieChange(
    event: React.ChangeEvent<HTMLSelectElement>,
  ): void {
    setCategorie(event.target.value);
  }

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

              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className="catalogue">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Catalogue</p>
              <h2>Recettes à découvrir</h2>
            </div>

            {!loading && error === "" && (
              <span>
                {total} recette
                {total !== 1 ? "s" : ""}
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

              {totalPages > 1 && (
                <nav
                  className="pagination"
                  aria-label="Pagination du catalogue"
                >
                  <button
                    type="button"
                    className="pagination-arrow"
                    disabled={page === 1}
                    onClick={() => {
                      setPage((currentPage) => currentPage - 1);
                    }}
                    aria-label="Page précédente"
                  >
                    ←
                  </button>

                  <div className="pagination-pages">
                    {Array.from(
                      { length: totalPages },
                      (_, index) => index + 1,
                    ).map((pageNumber) => (
                      <button
                        key={pageNumber}
                        type="button"
                        className={
                          pageNumber === page
                            ? "pagination-page pagination-page-active"
                            : "pagination-page"
                        }
                        onClick={() => {
                          setPage(pageNumber);
                        }}
                        aria-label={`Aller à la page ${pageNumber}`}
                        aria-current={
                          pageNumber === page ? "page" : undefined
                        }
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="pagination-arrow"
                    disabled={page === totalPages}
                    onClick={() => {
                      setPage((currentPage) => currentPage + 1);
                    }}
                    aria-label="Page suivante"
                  >
                    →
                  </button>
                </nav>
              )}
            </>
          )}
        </section>
      </main>
    </>
  );
}


export default HomePage;