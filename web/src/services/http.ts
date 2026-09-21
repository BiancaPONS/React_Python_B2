import type { ApiError } from "../types/api";

const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
  throw new Error(
    "VITE_API_URL est introuvable. Vérifie le fichier web/.env.",
  );
}

export class HttpError extends Error {
  code: number;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "HttpError";
    this.code = error.code;
  }
}

interface ErrorResponse {
  erreur: ApiError;
}

function isErrorResponse(value: unknown): value is ErrorResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (!("erreur" in value)) {
    return false;
  }

  const possibleError = value.erreur;

  if (
    typeof possibleError !== "object" ||
    possibleError === null
  ) {
    return false;
  }

  if (!("code" in possibleError) || !("message" in possibleError)) {
    return false;
  }

  return (
    typeof possibleError.code === "number" &&
    typeof possibleError.message === "string"
  );
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("access_token");

  const headers = new Headers(options.headers);

  headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json");

  if (token !== null) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json") ?? false;

  const data: unknown = isJson ? await response.json() : null;

  if (!response.ok) {
    if (isErrorResponse(data)) {
      throw new HttpError(data.erreur);
    }

    throw new HttpError({
      code: response.status,
      message: "Une erreur est survenue.",
    });
  }

  return data as T;
}