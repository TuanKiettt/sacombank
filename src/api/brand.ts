export const BRAND_API_BASE_URL = import.meta.env.VITE_API_BRAND_URL;

export async function postJson<T>(
  baseUrl: string,
  path: string,
  body: Record<string, unknown>,
  token?: string,
): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    credentials: "include",
  });

  const text = await response.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text ? { message: text } : null;
  }

  if (!response.ok) {
    const message = data?.error || data?.message || `Request failed: ${response.status}`;
    throw new Error(`${message} (status ${response.status})`);
  }

  return data as T;
}
