import type { CreateSendRequest, CreateSendResponse } from "@trackpixl/shared";
import { API_BASE } from "../config";
import { ensureAuth } from "./auth";
import { getPrefs } from "./storage";

async function authHeaders(): Promise<HeadersInit> {
  const auth = await ensureAuth();
  if (!auth.signedIn) {
    throw new Error("NOT_SIGNED_IN");
  }
  const prefs = await getPrefs();
  if (!prefs.apiToken) {
    throw new Error("NOT_SIGNED_IN");
  }
  return {
    Authorization: `Bearer ${prefs.apiToken}`,
    "Content-Type": "application/json",
  };
}

export async function createSend(
  body: CreateSendRequest,
): Promise<CreateSendResponse> {
  const res = await fetch(`${API_BASE}/api/sends`, {
    method: "POST",
    headers: await authHeaders(),
    body: JSON.stringify(body),
  });
  if (res.status === 401) {
    throw new Error("NOT_SIGNED_IN");
  }
  if (!res.ok) {
    throw new Error(`createSend failed: ${res.status}`);
  }
  return res.json() as Promise<CreateSendResponse>;
}

export async function confirmSend(
  sendId: string,
  data: {
    gmailThreadId?: string;
    gmailMessageId?: string;
    rfc822MessageId?: string;
  },
) {
  const res = await fetch(`${API_BASE}/api/sends/${sendId}/confirm`, {
    method: "PATCH",
    headers: await authHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`confirmSend failed: ${res.status}`);
}

export async function fetchEventsSince(cursor?: string) {
  const q = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
  const res = await fetch(`${API_BASE}/api/events${q}`, {
    headers: await authHeaders(),
  });
  if (!res.ok) throw new Error(`events failed: ${res.status}`);
  return res.json() as Promise<{
    events: Array<{
      id: string;
      type: "open" | "click" | "reply";
      subject: string;
      occurredAt: string;
    }>;
    cursor?: string;
  }>;
}

export async function fetchMe() {
  try {
    const headers = await authHeaders();
    const res = await fetch(`${API_BASE}/api/me`, { headers });
    if (!res.ok) return null;
    return res.json() as Promise<{
      email: string;
      settings: {
        notificationsEnabled: boolean;
        notifyOnOpen: boolean;
        notifyOnClick: boolean;
        notifyOnReply: boolean;
      };
    }>;
  } catch {
    return null;
  }
}

export { API_BASE };
