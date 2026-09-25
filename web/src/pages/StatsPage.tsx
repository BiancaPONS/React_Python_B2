import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import ErrorMessage from "../components/ErrorMessage";
import LoadingMessage from "../components/LoadingMessage";
import { getCollection } from "../services/collectionService";
import { HttpError } from "../services/http";
import type { Entry } from "../types/api";

interface Stats {
  total: number;
  plats: number;
  entrees: number;
  desserts: number;
  boissons: number;
  aperitifs: number;
  noteMoyenne: number | null;
  aDecouvrir: number;
  enCours: number;
  terminees: number;
  tempsMoyen: number | null;
}

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

        if (!cancelled) {
          setCollection(response);
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
          setError("Impossible de charger vos statistiques.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCollection();

    return () => {
      cancelled = true;
    };
  }, []);

  const stats = useMemo<Stats>(() => {
    const total = collection.length;

    const plats = collection.filter(
      (entry) => entry.item.categorie.toLowerCase() === "plat",
    ).length;

    const entrees = collection.filter(
      (entry) => entry.item.categorie.toLowerCase() === "entrée",
    ).length;

    const desserts = collection.filter(
      (entry) => entry.item.categorie.toLowerCase() === "dessert",
    ).length;

    const boissons = collection.filter(
      (entry) => entry.item.categorie.toLowerCase() === "boissons",
    ).length;

    const aperitifs = collection.filter(
      (entry) => entry.item.categorie.toLowerCase() === "apéro",
    ).length;

    const notes = collection
      .map((entry) => entry.note)
      .filter((note): note is number => note !== null);

    const noteMoyenne =
      notes.length === 0
        ? null
        : notes.reduce((totalNote, note) => totalNote + note, 0) /
          notes.length;

    const aDecouvrir = collection.filter(
      (entry) => entry.statut === "a_decouvrir",
    ).length;

    const enCours = collection.filter(
      (entry) => entry.statut === "en_cours",
    ).length;

    const terminees = collection.filter(
      (entry) => entry.statut === "termine",
    ).length;

    const tempsMoyen =
      total === 0
        ? null
        : collection.reduce(
            (totalTemps, entry) =>
              totalTemps + entry.item.temps_preparation,
            0,
          ) / total;

    return {
      total,
      plats,
      entrees,
      desserts,
      boissons,
      aperitifs,
      noteMoyenne,
      aDecouvrir,
      enCours,
      terminees,
      tempsMoyen,
    };
  }, [collection]);

  if (loading) {
    return (
      <main className="page personal-page">
        <Link className="back-link" to="/">
          <span aria-hidden="true">←</span>
          <span>Retour au catalogue</span>
        </Link>

        <p className="eyebrow">Espace personnel</p>
        <h1>Mes statistiques</h1>

        <LoadingMessage message="Chargement de vos statistiques..." />
      </main>
    );
  }

  if (error !== "") {
    return (
      <main className="page personal-page">
        <Link className="back-link" to="/">
          <span aria-hidden="true">←</span>
          <span>Retour au catalogue</span>
        </Link>

        <p className="eyebrow">Espace personnel</p>
        <h1>Mes statistiques</h1>

        <ErrorMessage message={error} />
      </main>
    );
  }

  if (collection.length === 0) {
    return (
      <main className="page personal-page">
        <Link className="back-link" to="/">
          <span aria-hidden="true">←</span>
          <span>Retour au catalogue</span>
        </Link>

        <header className="personal-header">
          <p className="eyebrow">Espace personnel</p>
          <h1>Mes statistiques</h1>
          <p>
            Suivez votre activité et l’évolution de votre collection
            de recettes.
          </p>
        </header>

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
      </main>
    );
  }

  return (
    <main className="page personal-page">
      <Link className="back-link" to="/">
        <span aria-hidden="true">←</span>
        <span>Retour au catalogue</span>
      </Link>

      <header className="personal-header">
        <p className="eyebrow">Espace personnel</p>

        <h1>Mes statistiques</h1>

        <p>
          Suivez votre activité et l’évolution de votre collection
          de recettes.
        </p>
      </header>

      <section className="stats-grid" aria-label="Statistiques principales">
        <article className="stat-card stat-card-featured">
          <p className="stat-label">Recettes sauvegardées</p>
          <p className="stat-value">{stats.total}</p>
          <p className="stat-description">
            recette{stats.total > 1 ? "s" : ""} dans votre collection
          </p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Note moyenne</p>
          <p className="stat-value">
            {stats.noteMoyenne === null
              ? "—"
              : `${stats.noteMoyenne.toFixed(1)}/5`}
          </p>
          <p className="stat-description">
            basée sur vos recettes notées
          </p>
        </article>

        <article className="stat-card">
          <p className="stat-label">Temps moyen</p>
          <p className="stat-value">
            {stats.tempsMoyen === null
              ? "—"
              : `${Math.round(stats.tempsMoyen)} min`}
          </p>
          <p className="stat-description">
            durée moyenne de préparation
          </p>
        </article>
      </section>

      <section className="stats-section">
        <div className="stats-section-heading">
          <p className="eyebrow">Répartition</p>
          <h2>Vos catégories préférées</h2>
        </div>

        <div className="category-stats-grid">
          <CategoryStat label="Plats" value={stats.plats} />
          <CategoryStat label="Entrées" value={stats.entrees} />
          <CategoryStat label="Desserts" value={stats.desserts} />
          <CategoryStat label="Boissons" value={stats.boissons} />
          <CategoryStat label="Apéro" value={stats.aperitifs} />
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-section-heading">
          <p className="eyebrow">Progression</p>
          <h2>État de votre collection</h2>
        </div>

        <div className="status-stats">
          <StatusStat
            label="À découvrir"
            value={stats.aDecouvrir}
          />

          <StatusStat
            label="En cours"
            value={stats.enCours}
          />

          <StatusStat
            label="Terminées"
            value={stats.terminees}
          />
        </div>
      </section>
    </main>
  );
}

interface CategoryStatProps {
  label: string;
  value: number;
}

function CategoryStat({
  label,
  value,
}: CategoryStatProps) {
  return (
    <article className="category-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

interface StatusStatProps {
  label: string;
  value: number;
}

function StatusStat({
  label,
  value,
}: StatusStatProps) {
  return (
    <article className="status-stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export default StatsPage;