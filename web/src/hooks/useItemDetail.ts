import { useEffect, useState } from "react";

import {
  addToCollection,
  deleteCollectionEntry,
  getCollection,
  updateCollectionEntry,
} from "../services/collectionService";
import { HttpError } from "../services/http";
import { getItem } from "../services/itemService";
import type { Entry, Item, Statut } from "../types/api";

function getErrorMessage(caughtError: unknown): string {
  if (caughtError instanceof HttpError || caughtError instanceof Error) {
    return caughtError.message;
  }

  return "Une erreur est survenue.";
}

export function useItemDetail(itemId: string | undefined) {

  const [recette, setRecette] = useState<Item | null>(null);
  const [collectionEntry, setCollectionEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [statut, setStatut] = useState<Statut>("a_decouvrir");
  const [note, setNote] = useState("");
  const [commentaire, setCommentaire] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadItem(): Promise<void> {
      const numericItemId = Number(itemId);

      if (
        itemId === undefined ||
        !Number.isInteger(numericItemId) ||
        numericItemId <= 0
      ) {
        setError("Identifiant de recette invalide.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");
      setMessage("");
      setRecette(null);
      setCollectionEntry(null);

      try {
        const response = await getItem(numericItemId);
        if (cancelled) return;

        setRecette(response);

        try {
          const entries = await getCollection();
          if (cancelled) return;

          const currentEntry = entries.find(
            (entry) => entry.item.id === numericItemId,
          );

          setCollectionEntry(currentEntry ?? null);
          setStatut(currentEntry?.statut ?? "a_decouvrir");
          setNote(
            currentEntry?.note == null ? "" : String(currentEntry.note),
          );
          setCommentaire(currentEntry?.commentaire ?? "");
        } catch {
          if (!cancelled) setCollectionEntry(null);
        }
      } catch (caughtError: unknown) {
        if (!cancelled) setError(getErrorMessage(caughtError));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadItem();
    return () => {
      cancelled = true;
    };
  }, [itemId]);

  async function add(): Promise<void> {
    if (recette === null || adding || collectionEntry !== null) return;
    setAdding(true);
    setMessage("");

    try {
      const entry = await addToCollection(recette.id, statut);
      setCollectionEntry(entry);
      setMessage("Recette ajoutée à votre collection.");
    } catch (caughtError: unknown) {
      setMessage(getErrorMessage(caughtError));
    } finally {
      setAdding(false);
    }
  }

  async function update(): Promise<void> {
    if (recette === null || updating || collectionEntry === null) return;
    setUpdating(true);
    setMessage("");

    try {
      const updatedEntry = await updateCollectionEntry(recette.id, {
        statut,
        note: note === "" ? null : Number(note),
        commentaire: commentaire.trim() || null,
      });
      setCollectionEntry(updatedEntry);
      setMessage("Votre recette a été mise à jour.");
    } catch (caughtError: unknown) {
      setMessage(getErrorMessage(caughtError));
    } finally {
      setUpdating(false);
    }
  }

  async function remove(): Promise<void> {
    if (recette === null || removing || collectionEntry === null) return;

    if (
      !window.confirm(
        "Voulez-vous vraiment supprimer cette recette de votre collection ?",
      )
    ) {
      return;
    }

    setRemoving(true);
    setMessage("");

    try {
      await deleteCollectionEntry(recette.id);
      setCollectionEntry(null);
      setStatut("a_decouvrir");
      setNote("");
      setCommentaire("");
      setMessage("Recette supprimée de votre collection.");
    } catch (caughtError: unknown) {
      setMessage(getErrorMessage(caughtError));
    } finally {
      setRemoving(false);
    }
  }

  return {
    recette, collectionEntry, loading, adding, updating, removing,
    error, message, statut, note, commentaire,
    setStatut, setNote, setCommentaire, add, update, remove,
  };
}