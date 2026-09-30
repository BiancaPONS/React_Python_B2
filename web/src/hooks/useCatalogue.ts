import { useEffect, useState } from "react";

import { HttpError } from "../services/http";
import { getItems } from "../services/itemService";
import type { Item } from "../types/api";


const ITEMS_PER_PAGE = 12;


interface CatalogueState {
  recherche: string;
  setRecherche: (value: string) => void;
  categorie: string;
  setCategorie: (value: string) => void;
  page: number;
  setPage: (value: number) => void;
  recettes: Item[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: string;
}


export function useCatalogue(): CatalogueState {
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

    return () => window.clearTimeout(timeoutId);
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

  return {
    recherche,
    setRecherche,
    categorie,
    setCategorie,
    page,
    setPage,
    recettes,
    total,
    totalPages: Math.max(1, Math.ceil(total / ITEMS_PER_PAGE)),
    loading,
    error,
  };
}