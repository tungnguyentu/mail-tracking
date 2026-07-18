import type { CreateSendRequest, CreateSendResponse } from "@mail-tracking/shared";
import { DEFAULT_API_BASE } from "../config";
import { getPrefs } from "./storage";

async function baseUrl() {
  const prefs = await getPrefs();
  return (prefs.apiBase ?? DEFAULT_API_BASE).replace(/\/$/, "");
}

async function authHeaders(): Promise<HeadersInit> {
  const prefs = await getPrefs();
  if (!prefs.apiToken) return {};
  return { Authorization: `Bearer ${prefs.apiToken}` };
}

export async function createSend(
  body: CreateSendRequest,
): Promise<CreateSendResponse> {
  const res = await fetch(`${await baseUrl()}/api/sends`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(body),
  });
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
  const res = await fetch(`${await baseUrl()}/api/sends/${sendId}/confirm`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeaders()),
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`confirmSend failed: ${res.status}`);
}

export async function fetchEventsSince(cursor?: string) {
  const q = cursor ? `?cursor=${encodeURIComponent(cursor)}` : "";
  const res = await fetch(`${await baseUrl()}/api/events${q}`, {
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
  const res = await fetch(`${await baseUrl()}/api/me`, {
    headers: await authHeaders(),
  });
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
}
