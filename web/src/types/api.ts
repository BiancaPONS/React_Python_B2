export type Statut = "a_decouvrir" | "en_cours" | "termine";

export interface User {
  id: number;
  email: string;
}

export interface RegisterBody {
  email: string;
  password: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

export interface Item {
  id: number;
  titre: string;
  categorie: string;
  description: string;
  image_url: string | null;
  annee: number | null;
  temps_preparation: number;
  difficulte: string;
  type_plat: string;
}

export interface Entry {
  id: number;
  statut: Statut;
  note: number | null;
  commentaire: string | null;
  date_ajout: string;
  item: Item;
}

export interface ItemsResponse {
  total: number;
  page: number;
  limit: number;
  results: Item[];
}

export interface StatsResponse {
  total: number;
  par_statut: Record<Statut, number>;
  note_moyenne: number | null;
}

export interface ApiError {
  code: number;
  message: string;
}