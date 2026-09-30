import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import CollectionEntryCard from "../components/CollectionEntryCard";
import CollectionFilters, {
  type CollectionSort,
  type MinRating,
  type StatusFilter,
} from "../components/CollectionFilters";
import EmptyMessage from "../components/EmptyMessage";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import { useCollectionEntries } from "../hooks/useCollectionEntries";
import type { Entry } from "../types/api";


function sortEntries(
  entries: Entry[],
  sort: CollectionSort,
): Entry[] {
  return [...entries].sort((a, b) => {
    if (sort === "date_desc") {
      return (
        Date.parse(b.date_ajout) -
        Date.parse(a.date_ajout)
      );
    }

    if (sort === "date_asc") {
      return (
        Date.parse(a.date_ajout) -
        Date.parse(b.date_ajout)
      );
    }

    // Les recettes sans note restent toujours en dernier.
    if (a.note === null) return 1;
    if (b.note === null) return -1;

    return sort === "note_desc"
      ? b.note - a.note
      : a.note - b.note;
  });
}


function CollectionPage() {
  const { collection, loading, error } = useCollectionEntries();
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [minRating, setMinRating] = useState<MinRating>("");
  const [sort, setSort] = useState<CollectionSort>("date_desc");

  const categories = useMemo(
    () =>
      [...new Set(collection.map((entry) => entry.item.categorie))]
        .sort((a, b) => a.localeCompare(b, "fr")),
    [collection],
  );

  const visibleEntries = useMemo(() => {
    const filtered = collection.filter((entry) => {
      const matchesCategory =
        category === "" || entry.item.categorie === category;
      const matchesStatus =
        status === "" || entry.statut === status;
      const matchesRating =
        minRating === "" ||
        (entry.note !== null &&
          entry.note >= Number(minRating));

      return matchesCategory && matchesStatus && matchesRating;
    });

    return sortEntries(filtered, sort);
  }, [collection, category, status, minRating, sort]);

  return (
    <main className="page collection-page">
      <Link className="back-link" to="/">
        <span aria-hidden="true">←</span>
        <span>Retour au catalogue</span>
      </Link>

      <p className="eyebrow">Espace personnel</p>
      <h1>Ma collection</h1>

      {!loading && error === "" && (
        <p className="collection-intro">
          Retrouvez ici les recettes que vous souhaitez garder
          précieusement dans votre carnet.
        </p>
      )}

      {loading && (
        <LoadingMessage message="Chargement de votre collection..." />
      )}

      {!loading && error !== "" && (
        <ErrorMessage message={error} />
      )}

      {!loading && error === "" && collection.length === 0 && (
        <section className="empty-collection">
          <EmptyMessage message="Votre collection est encore vide." />
          <Link className="primary-action" to="/">
            Découvrir les recettes
          </Link>
        </section>
      )}

      {!loading && error === "" && collection.length > 0 && (
        <>
          <CollectionFilters
            categories={categories}
            category={category}
            status={status}
            minRating={minRating}
            sort={sort}
            onCategoryChange={setCategory}
            onStatusChange={setStatus}
            onMinRatingChange={setMinRating}
            onSortChange={setSort}
          />

          <p className="collection-results" role="status">
            {visibleEntries.length} recette
            {visibleEntries.length !== 1 ? "s" : ""} affichée
            {visibleEntries.length !== 1 ? "s" : ""}
          </p>

          {visibleEntries.length === 0 ? (
            <EmptyMessage message="Aucune recette ne correspond à ces filtres." />
          ) : (
            <section className="recipe-grid">
              {visibleEntries.map((entry) => (
                <CollectionEntryCard
                  key={entry.id}
                  entry={entry}
                />
              ))}
            </section>
          )}
        </>
      )}
    </main>
  );
}

export default CollectionPage;