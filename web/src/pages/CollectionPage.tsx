import { Link } from "react-router-dom";

import CollectionEntryCard from "../components/CollectionEntryCard";
import EmptyMessage from "../components/EmptyMessage";
import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import { useCollectionEntries } from "../hooks/useCollectionEntries";


function CollectionPage() {
  const { collection, loading, error } = useCollectionEntries();

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
        <section className="recipe-grid">
          {collection.map((entry) => (
            <CollectionEntryCard key={entry.id} entry={entry} />
          ))}
        </section>
      )}
    </main>
  );
}


export default CollectionPage;