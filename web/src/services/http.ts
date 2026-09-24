const API_URL = "http://localhost:8000";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

interface ApiErrorResponse {
  erreur?: {
    code?: number;
    message?: string;
  };
  detail?: string | Array<{
    msg?: string;
  }>;
  message?: string;
}

function getApiErrorMessage(
  data: unknown,
  status: number,
): string {
  if (typeof data === "object" && data !== null) {
    const errorData = data as ApiErrorResponse;

    if (
      errorData.erreur !== undefined &&
      typeof errorData.erreur.message === "string"
    ) {
      return errorData.erreur.message;
    }

    if (typeof errorData.message === "string") {
      return errorData.message;
    }

    if (typeof errorData.detail === "string") {
      return errorData.detail;
    }

    if (Array.isArray(errorData.detail)) {
      const messages = errorData.detail
        .map((item) => item.msg)
        .filter(
          (message): message is string =>
            typeof message === "string",
        );

      if (messages.length > 0) {
        return messages.join(", ");
      }
    }
  }

  if (status === 400 || status === 401) {
    return "Email ou mot de passe incorrect.";
  }

  if (status === 403) {
    return "Vous n’êtes pas autorisée à effectuer cette action.";
  }

  if (status === 404) {
    return "Ressource introuvable.";
  }

  if (status === 422) {
    return "Les données envoyées sont invalides.";
  }

  if (status >= 500) {
    return "Le serveur rencontre un problème. Réessayez plus tard.";
  }

  return `Erreur HTTP ${status}`;
}

async function parseError(response: Response): Promise<string> {
  const text = await response.text();

  if (text === "") {
    return getApiErrorMessage(null, response.status);
  }

  try {
    const data: unknown = JSON.parse(text);
    return getApiErrorMessage(data, response.status);
  } catch {
    return text;
  }
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = localStorage.getItem("access_token");
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (token !== null) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const message = await parseError(response);
    throw new HttpError(response.status, message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const contentType = response.headers.get("content-type");

  if (
    contentType !== null &&
    contentType.includes("application/json")
  ) {
    return (await response.json()) as T;
  }

  return undefined as T;
}
