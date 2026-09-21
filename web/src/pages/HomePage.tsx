import { useEffect, useState } from "react";

import Header from "../components/Header";
import ItemCard from "../components/ItemCard";
import { HttpError } from "../services/http";
import { getItems } from "../services/itemService";
import type { Item } from "../types/api";

function HomePage() {
  const [recherche, setRecherche] = useState("");
  const [recettes, setRecettes] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadItems(): Promise<void> {
      setLoading(true);
      setError("");

      try {
        const response = await getItems({
          limit: 100,
        });

        if (!cancelled) {
          setRecettes(response.results);
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
  }, []);

  const texteRecherche = recherche.trim().toLowerCase();

  const recettesFiltrees = recettes.filter((recette) => {
    if (texteRecherche === "") {
      return true;
    }

    return (
      recette.titre.toLowerCase().includes(texteRecherche) ||
      recette.categorie.toLowerCase().includes(texteRecherche) ||
      recette.type_plat.toLowerCase().includes(texteRecherche) ||
      recette.description.toLowerCase().includes(texteRecherche)
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

            {!loading && error === "" && (
              <span>{recettesFiltrees.length} recettes</span>
            )}
          </div>

          {loading && <p>Chargement des recettes...</p>}

          {!loading && error !== "" && (
            <p className="form-error">{error}</p>
          )}

          {!loading &&
            error === "" &&
            recettesFiltrees.length === 0 && (
              <p className="empty-message">
                Aucune recette ne correspond à votre recherche.
              </p>
            )}

          {!loading &&
            error === "" &&
            recettesFiltrees.length > 0 && (
              <div className="recipe-grid">
                {recettesFiltrees.map((recette) => (
                  <ItemCard
                    key={recette.id}
                    item={recette}
                  />
                ))}
              </div>
            )}
        </section>
      </main>
    </>
  );
}

export default HomePage;