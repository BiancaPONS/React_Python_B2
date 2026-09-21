import type { ApiError } from "../types/api";

const apiUrl = import.meta.env.VITE_API_URL;

export class HttpError extends Error {
  code: number;

  constructor(error: ApiError) {
    super(error.message);
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

  return "erreur" in value;
}

export async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  const data: unknown = await response.json();

  if (!response.ok) {
    if (isErrorResponse(data)) {
      throw new HttpError(data.erreur);
    }

    throw new HttpError({
      code: response.status,
      message: "Une erreur est survenue."
    });
  }

  return data as T;
}