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
    // Inspect the full payload: validation details may be nested under error/errors.
    const details = JSON.stringify(data ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .toLowerCase();
    const isDuplicatePhone =
      /phone|mobile|so dien thoai|sdt/.test(details) &&
      /duplicat|already|exists|in use|used|taken|unique|23505|trung|da.*(?:dung|su dung|ton tai|dang ky)/.test(details);

    if (path === "/invitation/create_service" && isDuplicatePhone) {
      throw new Error("Số điện thoại này đã được dùng để tạo thiệp");
    }

    const message = data?.error || data?.message || `Request failed: ${response.status}`;
    throw new Error(`${message} (status ${response.status})`);
  }

  return data as T;
}
