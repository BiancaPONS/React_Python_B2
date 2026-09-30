import type { Entry } from "../types/api";

export interface CollectionStats {
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

export function calculateCollectionStats(
  collection: Entry[],
): CollectionStats {
  const total = collection.length;

  const countCategory = (category: string): number =>
    collection.filter(
      (entry) => entry.item.categorie.toLowerCase() === category,
    ).length;

  const notes = collection
    .map((entry) => entry.note)
    .filter((note): note is number => note !== null);

  const noteMoyenne =
    notes.length === 0
      ? null
      : notes.reduce((sum, note) => sum + note, 0) / notes.length;

  const tempsMoyen =
    total === 0
      ? null
      : collection.reduce(
          (sum, entry) => sum + entry.item.temps_preparation,
          0,
        ) / total;

  return {
    total,
    plats: countCategory("plat"),
    entrees: countCategory("entrée"),
    desserts: countCategory("dessert"),
    boissons: countCategory("boissons"),
    aperitifs: countCategory("apéro"),
    noteMoyenne,
    aDecouvrir: collection.filter(
      (entry) => entry.statut === "a_decouvrir",
    ).length,
    enCours: collection.filter(
      (entry) => entry.statut === "en_cours",
    ).length,
    terminees: collection.filter(
      (entry) => entry.statut === "termine",
    ).length,
    tempsMoyen,
  };
}