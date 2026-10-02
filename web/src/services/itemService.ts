import type { Item, ItemsResponse } from "../types/api";
import { request } from "./http";


export interface GetItemsParams {
  q?: string;
  categorie?: string;
  sans_gluten?: boolean;
  vegetarien?: boolean;
  page?: number;
  limit?: number;
}


export function getItems(
  params: GetItemsParams = {},
): Promise<ItemsResponse> {
  const searchParams = new URLSearchParams();


  if (params.q !== undefined && params.q.trim() !== "") {
    searchParams.set("q", params.q.trim());
  }


  if (
    params.categorie !== undefined &&
    params.categorie.trim() !== ""
  ) {
    searchParams.set(
      "categorie",
      params.categorie.trim(),
    );
  }


  if (params.sans_gluten === true) {
    searchParams.set("sans_gluten", "true");
  }


  if (params.vegetarien === true) {
    searchParams.set("vegetarien", "true");
  }


  if (params.page !== undefined) {
    searchParams.set("page", String(params.page));
  }


  if (params.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }


  const queryString = searchParams.toString();

  const path =
    queryString === ""
      ? "/items"
      : `/items?${queryString}`;


  return request<ItemsResponse>(path);
}


export function getItem(itemId: number): Promise<Item> {
  return request<Item>(`/items/${itemId}`);
}