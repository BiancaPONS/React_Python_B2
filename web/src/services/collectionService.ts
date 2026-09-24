import type {
  Entry,
  Statut,
  StatsResponse,
} from "../types/api";

import { request } from "./http";


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
  itemId: number,
  data: {
    statut?: Statut;
    note?: number | null;
    commentaire?: string | null;
  },
): Promise<Entry> {
  return request<Entry>(`/me/collection/item/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteCollectionEntry(
  itemId: number,
): Promise<void> {
  return request<void>(`/me/collection/item/${itemId}`, {
    method: "DELETE",
  });
}


export function getStats(): Promise<StatsResponse> {
  return request<StatsResponse>("/me/stats");
}