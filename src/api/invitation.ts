import { createClient } from "@supabase/supabase-js";
import { BRAND_API_BASE_URL, postJson } from "./brand";

export interface InvitationField {
  key: string;
  label: string;
  kind: string;
  required: boolean;
  max?: number;
}

export interface InvitationTemplate {
  id: string;
  name: string;
  needs_photo?: boolean;
}

export interface InvitationSiteResponse {
  site: string;
  brand_id?: string;
  name?: string;
  state?: string;
  captcha?: boolean;
  captcha_site_key?: string;
  fields?: InvitationField[];
  templates?: InvitationTemplate[];
  registration?: any;
  social?: any;
  me?: any;
}

export async function readSite(token: string): Promise<InvitationSiteResponse> {
  // console.log("[readSite] token:", token);

  const response = await fetch(`${BRAND_API_BASE_URL}/invitation/read_site`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
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

  return data as InvitationSiteResponse;
}

export async function getRealtimeSessionToken(token: string): Promise<string> {
  const response = await fetch(`${BRAND_API_BASE_URL}/invitation/session_token`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
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

  return data?.access_token || data?.token || data?.realtime_token;
}

export async function subscribeInvitationServiceRealtime({
  token,
  serviceId,
  onRow,
  onState,
  schema = "public",
  table = "services",
}: {
  token: string;
  serviceId: string;
  onRow?: (row: any) => void;
  onState?: (state: string) => void;
  schema?: string;
  table?: string;
}) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Thiếu VITE_SUPABASE_URL hoặc VITE_SUPABASE_ANON_KEY để mở realtime");
  }

  const realtimeToken = await getRealtimeSessionToken(token);
  const sb = createClient(supabaseUrl, supabaseAnonKey, {
    accessToken: async () => realtimeToken,
  });

  const channel = sb
    .channel(`thiep-${serviceId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema,
        table,
        filter: `id=eq.${serviceId}`,
      },
      ({ new: row }) => {
        console.log("[realtime] row updated:", row);
        onRow?.(row as any);
      },
    )
    .subscribe((state, err) => {
      console.log("[realtime] state:", state, err ?? "");
      if (state === "CHANNEL_ERROR" || state === "TIMED_OUT") {
        console.error("Realtime error:", state, err);
      }
      onState?.(state);
    });

  return {
    channel,
    stop: () => {
      sb.removeChannel(channel);
    },
  };
}

// export async function createUploadUrl(
//   token: string,
//   site: string,
//   contentType: string = "image/jpeg",
// ): Promise<any> {
//   return postJson(
//     BRAND_API_BASE_URL,
//     "/invitation/create_upload_url",
//     { site, content_type: contentType },
//     token,
//   );
// }

// export async function uploadPhotoToUrl(uploadUrl: string, file: File): Promise<void> {
//   const response = await fetch(uploadUrl, {
//     method: "PUT",
//     headers: {
//       "Content-Type": file.type || "image/jpeg",
//     },
//     body: file,
//   });
//
//   if (!response.ok) {
//     throw new Error(`Upload ảnh thất bại: ${response.status}`);
//   }
// }

export async function createInvitationService(
  token: string,
  site: string,
  template: string,
  guest: Record<string, any>,
  photo?: string,
  captcha?: string,
): Promise<{ id: string }> {
  const payload: Record<string, any> = { site, template, guest };
  if (photo) payload.photo = photo;
  if (captcha) payload.captcha = captcha;

  const result = await postJson<{ id: string }>(
    BRAND_API_BASE_URL,
    "/invitation/create_service",
    payload,
    token,
  );

  console.log("create_service result:", result);
  return result;
}

export async function readServiceStatus(token: string, serviceId: string): Promise<any> {
  const response = await fetch(`${BRAND_API_BASE_URL}/invitation/read_service?id=${serviceId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
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

  return data;
}

export async function waitForServiceResult(
  token: string,
  serviceId: string,
  intervalMs = 4000,
  onProgress?: (row: any) => void,
): Promise<any> {
  let realtimeSubscription: { stop: () => void } | null = null;

  try {
    realtimeSubscription = await subscribeInvitationServiceRealtime({
      token,
      serviceId,
      onRow: (row) => {
        console.log("[realtime row]", row);
        onProgress?.(row);
      },
      onState: (state) => {
        console.log("[realtime state]", state);
      },
    });
  } catch (error) {
    console.warn("Realtime unavailable, fallback to polling:", error);
  }

  try {
    while (true) {
      const result = await readServiceStatus(token, serviceId);
      const status = result?.status;
      onProgress?.(result);
      console.log("service status:", status);

      if (status === "done" || status === "error") {
        return result;
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  } finally {
    realtimeSubscription?.stop();
  }
}
