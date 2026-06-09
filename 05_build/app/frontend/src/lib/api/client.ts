/**
 * Base API client for making requests to the backend.
 *
 * Convention:
 * - All API call functions live in `src/lib/api/`
 * - Each domain gets its own file (e.g., `users.ts`, `health.ts`)
 * - Functions return typed responses and throw on error
 * - Use these functions inside TanStack Query hooks in `src/hooks/`
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public body?: unknown,
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

/**
 * Token provider function. Set by AuthTokenProvider component
 * which has access to Clerk's useAuth().getToken().
 */
let _getToken: (() => Promise<string | null>) | null = null;

export function setTokenProvider(provider: () => Promise<string | null>) {
  _getToken = provider;
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  // If Clerk token provider is available, attach the session token
  if (_getToken) {
    const token = await _getToken();
    if (token) {
      (headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const body = await response.json().catch(() => undefined);
    throw new ApiError(response.status, response.statusText, body);
  }

  return response.json() as Promise<T>;
}
