import type { Entry, Statut } from "../types/api";
import { request } from "./http";

export interface StatsResponse {
  total: number;
  a_decouvrir: number;
  en_cours: number;
  termine: number;
}

export function getCollection(): Promise<Entry[]> {
  return request<Entry[]>("/me/collection");
}

export function addToCollection(
  itemId: number,
  statut: Statut = "a_decouvrir",
): Promise<Entry> {
  return request<Entry>("/me/collection", {
    method: "POST",
    body: JSON.stringify({
      item_id: itemId,
      statut,
    }),
  });
}

export function updateCollectionEntry(
  entryId: number,
  data: {
    statut?: Statut;
    note?: number | null;
    commentaire?: string | null;
  },
): Promise<Entry> {
  return request<Entry>(`/me/collection/${entryId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCollectionEntry(
  entryId: number,
): Promise<void> {
  return request<void>(`/me/collection/${entryId}`, {
    method: "DELETE",
  });
}

export function getStats(): Promise<StatsResponse> {
  return request<StatsResponse>("/me/stats");
}