import { API_BASE, SESSION_COOKIE } from "../config";
import { clearAuth, getPrefs, setPrefs } from "./storage";

export type AuthState = {
  signedIn: boolean;
  email?: string;
};

/** Read web session cookie set after login on our domain. */
export async function readSessionCookie(): Promise<string | null> {
  if (!chrome.cookies?.get) return null;
  try {
    const cookie = await chrome.cookies.get({
      url: API_BASE,
      name: SESSION_COOKIE,
    });
    return cookie?.value ?? null;
  } catch {
    return null;
  }
}

/**
 * Exchange browser session cookie for an extension API token.
 * User never pastes tokens — they only sign in on our domain.
 */
export async function syncAuthFromDomain(): Promise<AuthState> {
  const sessionToken = await readSessionCookie();
  if (!sessionToken) {
    await clearAuth();
    return { signedIn: false };
  }

  const res = await fetch(`${API_BASE}/api/auth/extension-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionToken }),
  });

  if (!res.ok) {
    await clearAuth();
    return { signedIn: false };
  }

  const data = (await res.json()) as { token: string; email: string };
  await setPrefs({ apiToken: data.token, userEmail: data.email });
  return { signedIn: true, email: data.email };
}

/** Ensure we have a valid API token; re-sync from domain cookie if needed. */
export async function ensureAuth(): Promise<AuthState> {
  const prefs = await getPrefs();
  if (prefs.apiToken) {
    const me = await fetch(`${API_BASE}/api/me`, {
      headers: { Authorization: `Bearer ${prefs.apiToken}` },
    });
    if (me.ok) {
      const body = (await me.json()) as { email: string };
      await setPrefs({ userEmail: body.email });
      return { signedIn: true, email: body.email };
    }
  }
  return syncAuthFromDomain();
}

export function openSignInTab(): void {
  const url = `${API_BASE}/login?from=extension&next=${encodeURIComponent("/extension/connected")}`;
  chrome.tabs.create({ url });
}

export async function signOutExtension(): Promise<void> {
  await clearAuth();
}
