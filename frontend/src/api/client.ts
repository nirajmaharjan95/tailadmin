const BASE_URL = "http://localhost:4000/api";

const headers: Record<string, string> = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

export async function get<T>(
  endpoint: string,
  params?: Record<string, unknown>
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  const response = await fetch(url.toString(), {
    method: "GET",
    headers,
  });
  if (response.status !== 200) {
    throw new Error(`Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export async function post<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (response.status !== 200 && response.status !== 201) {
    throw new Error(`POST failed: ${response.status}`);
  }

  return response.json();
}

export async function put<T>(endpoint: string, body: unknown): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  if (response.status !== 200) {
    throw new Error(`PUT failed: ${response.status}`);
  }

  return response.json();
}

export async function del<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers,
  });

  if (response.status !== 200) {
    throw new Error(`DELETE failed: ${response.status}`);
  }

  return response.json();
}
