import type { CollectionStats } from "../../utils/collectionStats";

interface StatsContentProps {
  stats: CollectionStats;
}

function StatCount({
  label,
  value,
  kind,
}: {
  label: string;
  value: number;
  kind: "category" | "status";
}) {
  return (
    <article className={`${kind}-stat-card`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function StatsContent({ stats }: StatsContentProps) {
  return (
    <>
      <section
        className="stats-grid"
        aria-label="Statistiques principales"
      >
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
          <StatCount label="Plats" value={stats.plats} kind="category" />
          <StatCount label="Entrées" value={stats.entrees} kind="category" />
          <StatCount label="Desserts" value={stats.desserts} kind="category" />
          <StatCount label="Boissons" value={stats.boissons} kind="category" />
          <StatCount label="Apéro" value={stats.aperitifs} kind="category" />
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-section-heading">
          <p className="eyebrow">Progression</p>
          <h2>État de votre collection</h2>
        </div>
        <div className="status-stats">
          <StatCount
            label="À découvrir"
            value={stats.aDecouvrir}
            kind="status"
          />
          <StatCount label="En cours" value={stats.enCours} kind="status" />
          <StatCount label="Terminées" value={stats.terminees} kind="status" />
        </div>
      </section>
    </>
  );
}

export default StatsContent;