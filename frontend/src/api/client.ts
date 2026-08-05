import { getAuthToken, refreshSession } from "./auth";
import { API_BASE_URL } from "./config";

const baseHeaders: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const buildHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  return token
    ? { ...baseHeaders, Authorization: `Bearer ${token}` }
    : baseHeaders;
};

// Surfaces the backend error envelope ({ error: { code, message } }) when
// present so users see a meaningful message instead of a bare status code.
const toError = async (response: Response): Promise<Error> => {
  try {
    const body = await response.json();
    const message = body?.error?.message;
    if (typeof message === "string" && message) return new Error(message);
  } catch {
    // Non-JSON body — fall through to the generic message.
  }
  return new Error(`Error ${response.status}: ${response.statusText}`);
};

// Central request wrapper (spec §28): attaches the access token and, on a
// 401, refreshes the session once and retries the request. Redirecting to
// /signin is handled by the route guard when auth state clears.
const request = async <T>(
  url: string,
  init: Omit<RequestInit, "headers">,
  okStatuses: number[]
): Promise<T> => {
  const execute = () =>
    fetch(url, { ...init, headers: buildHeaders(), credentials: "include" });

  let response = await execute();

  if (response.status === 401) {
    const session = await refreshSession();
    if (session) {
      response = await execute();
    }
  }

  if (!okStatuses.includes(response.status)) {
    throw await toError(response);
  }

  return response.json();
};

export async function get<T>(
  endpoint: string,
  params?: Record<string, unknown>
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return request<T>(url.toString(), { method: "GET" }, [200]);
}

export async function post<T>(endpoint: string, body: unknown): Promise<T> {
  return request<T>(
    `${API_BASE_URL}${endpoint}`,
    { method: "POST", body: JSON.stringify(body) },
    [200, 201]
  );
}

export async function put<T>(endpoint: string, body: unknown): Promise<T> {
  return request<T>(
    `${API_BASE_URL}${endpoint}`,
    { method: "PUT", body: JSON.stringify(body) },
    [200]
  );
}

export async function del<T>(endpoint: string): Promise<T> {
  return request<T>(`${API_BASE_URL}${endpoint}`, { method: "DELETE" }, [200]);
}
