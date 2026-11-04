import { BRAND_API_BASE_URL, postJson } from "./brand";

export const GUEST_SESSION_STORAGE_KEY = "guest_session";

export function readGuestSession(): any | null {
  const legacyKey = "sacombank.guest.session";

  for (const key of [GUEST_SESSION_STORAGE_KEY, legacyKey]) {
    const value = localStorage.getItem(key);
    if (!value) continue;

    try {
      const parsed = JSON.parse(value);
      if (parsed?.access_token || parsed?.refresh_token) {
        return parsed;
      }
    } catch {
      // Ignore invalid cached session payloads.
    }
  }

  return null;
}

export function saveGuestSession(session: any): any {
  const nextSession = session ?? {};
  localStorage.setItem("sacombank.guest.session", JSON.stringify(nextSession));
  return nextSession;
}

export async function getGuestTokenTest(): Promise<any> {
  try {
    const result = await postJson(BRAND_API_BASE_URL, "/auth/guest", {});
    const session = saveGuestSession(result);
    console.log("Guest Login Result:", session);
    return session;
  } catch (error) {
    console.error("Guest Login Error:", error);
    throw error;
  }
}

export async function ensureGuestSession(): Promise<any> {
  const existingSession = readGuestSession();
  if (existingSession?.access_token) {
    return existingSession;
  }

  const result = await getGuestTokenTest();
  if (!result?.access_token) {
    throw new Error("Backend chưa trả về access_token cho guest session.");
  }

  return result;
}

export async function refreshGuestTokenTest(refreshToken: string): Promise<any> {
  try {
    const result = await postJson(BRAND_API_BASE_URL, "/auth/device/refresh", {
      refresh_token: refreshToken,
    });

    const session = saveGuestSession(result);
    console.log("Guest Refresh Result:", session);
    return session;
  } catch (error) {
    console.error("Guest Refresh Error:", error);
    throw error;
  }
}
