import { ensureGuestSession, readGuestSession, refreshGuestTokenTest } from "./guest";
import { createInvitationService, readSite, waitForServiceResult } from "./invitation";

export interface InvitationFormData {
  fullName: string;
  phone: string;
  email: string;
  university: string;
  studentId: string;
  gender?: string;
}

const RESULT_CACHE_PREFIX = "sacombank.invitation.result.";

function getResultCacheKey(token: string) {
  return `${RESULT_CACHE_PREFIX}${token}`;
}

function readCachedResult(token: string): any | null {
  if (!token) return null;

  try {
    const raw = localStorage.getItem(getResultCacheKey(token));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveCachedResult(token: string, result: any) {
  if (!token || !result) return;

  try {
    localStorage.setItem(getResultCacheKey(token), JSON.stringify(result));
  } catch {
    // ignore cache write failure
  }
}

async function getValidToken(): Promise<string> {
  const session = readGuestSession();
  const currentToken = session?.access_token;

  if (currentToken) {
    return currentToken;
  }

  const freshSession = await ensureGuestSession();
  return freshSession?.access_token;
}

export async function submitInvitationFromForm(formData: InvitationFormData) {
  const initialSession = readGuestSession();
  let token = await getValidToken();

  if (!token) {
    throw new Error("Chưa có guest token. Hãy gọi /auth/guest trước.");
  }

  const cachedResult = readCachedResult(token);
  if (cachedResult) {
    console.log("[cached result] reuse result for current token:", cachedResult);
    return cachedResult;
  }

  let siteInfo;

  try {
    siteInfo = await readSite(token);
  } catch (error: any) {
    const refreshToken = initialSession?.refresh_token || readGuestSession()?.refresh_token;
    if (refreshToken && /401|Phiên đăng nhập không hợp lệ|hết hạn/i.test(String(error?.message ?? ""))) {
      console.warn("Guest token expired, refreshing session...");
      const refreshed = await refreshGuestTokenTest(refreshToken);
      token = refreshed?.access_token;
      if (!token) {
        throw new Error("Không thể refresh guest token từ backend.");
      }
      siteInfo = await readSite(token);
    } else {
      throw error;
    }
  }

  const site = siteInfo?.site;
  const template = siteInfo?.templates?.[0]?.id;

  if (!site) {
    throw new Error("Không lấy được site từ backend.");
  }

  if (!template) {
    throw new Error("Không có template nào khả dụng cho brand này.");
  }

  const guest = {
    full_name: String(formData.fullName ?? "").trim(),
    phone: String(formData.phone ?? "").trim(),
    email: String(formData.email ?? "").trim().toLowerCase(),
    university: String(formData.university ?? "").trim(),
    code: String(formData.studentId ?? "").trim(),
    gender: String(formData.gender ?? "").trim() || undefined,
  };

  const created = await createInvitationService(token, site, template, guest);
  console.log("Created service:", created);

  const result = await waitForServiceResult(token, created.id, 4000, (row) => {
    console.log("[progress row]", row);
  });

  console.log("Final invitation result:", result);
  saveCachedResult(token, result);

  return result;
}