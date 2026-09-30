import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import StatsContent from "../components/stats/StatsContent";
import { getCollection } from "../services/collectionService";
import { HttpError } from "../services/http";
import type { Entry } from "../types/api";
import { calculateCollectionStats } from "../utils/collectionStats";

function StatsPage() {
  const [collection, setCollection] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCollection(): Promise<void> {
      setLoading(true);
      setError("");

      try {
        const response = await getCollection();
        if (!cancelled) setCollection(response);
      } catch (caughtError: unknown) {
        if (cancelled) return;

        if (caughtError instanceof HttpError || caughtError instanceof Error) {
          setError(caughtError.message);
        } else {
          setError("Impossible de charger vos statistiques.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadCollection();
    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo(
    () => calculateCollectionStats(collection),
    [collection],
  );

  return (
    <main className="page personal-page">
      <Link className="back-link" to="/">
        <span aria-hidden="true">←</span>
        <span>Retour au catalogue</span>
      </Link>

      {loading || error !== "" ? (
        <>
          <p className="eyebrow">Espace personnel</p>
          <h1>Mes statistiques</h1>
        </>
      ) : (
        <header className="personal-header">
          <p className="eyebrow">Espace personnel</p>
          <h1>Mes statistiques</h1>
          <p>
            Suivez votre activité et l’évolution de votre collection
            de recettes.
          </p>
        </header>
      )}

      {loading && (
        <LoadingMessage message="Chargement de vos statistiques..." />
      )}

      {!loading && error !== "" && (
        <ErrorMessage message={error} />
      )}

      {!loading && error === "" && collection.length === 0 && (
        <section className="empty-personal-card">
          <div className="empty-personal-icon" aria-hidden="true">
            ✦
          </div>
          <p className="eyebrow">Pas encore de statistiques</p>
          <h2>Votre carnet prend vie petit à petit</h2>
          <p>
            Ajoutez des recettes à votre collection pour découvrir
            vos statistiques personnelles.
          </p>
          <Link className="primary-action" to="/">
            Retourner au catalogue
          </Link>
        </section>
      )}

      {!loading && error === "" && collection.length > 0 && (
        <StatsContent stats={stats} />
      )}
    </main>
  );
}

export default StatsPage;