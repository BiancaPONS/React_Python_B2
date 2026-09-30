import { useEffect, useState } from "react";

import { getCollection } from "../services/collectionService";
import { HttpError } from "../services/http";
import type { Entry } from "../types/api";


interface CollectionEntriesState {
  collection: Entry[];
  loading: boolean;
  error: string;
}


export function useCollectionEntries(): CollectionEntriesState {
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
          setError("Impossible de charger votre collection.");
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

  return { collection, loading, error };
}