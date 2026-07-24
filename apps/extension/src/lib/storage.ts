export type StickyPrefs = {
  trackingEnabled: boolean;
  /** Cached API bearer after silent cookie exchange. Never shown in UI. */
  apiToken?: string;
  userEmail?: string;
  eventCursor?: string;
  notifiedEventIds?: string[];
  /** Send IDs already notified for silence bump (one-shot). */
  silenceNotifiedSendIds?: string[];
};

const DEFAULTS: StickyPrefs = {
  trackingEnabled: true,
};

export async function getPrefs(): Promise<StickyPrefs> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) {
    return { ...DEFAULTS };
  }
  // Prefer local for secrets; migrate from sync if present
  const local = await chrome.storage.local.get(DEFAULTS);
  if (local.apiToken || local.userEmail) {
    return { ...DEFAULTS, ...local } as StickyPrefs;
  }
  if (chrome.storage.sync) {
    const sync = await chrome.storage.sync.get(DEFAULTS);
    if (sync.apiToken) {
      await chrome.storage.local.set(sync);
      return { ...DEFAULTS, ...sync } as StickyPrefs;
    }
  }
  return { ...DEFAULTS, ...local } as StickyPrefs;
}

export async function setPrefs(partial: Partial<StickyPrefs>): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.storage?.local) return;
  await chrome.storage.local.set(partial);
}

export async function clearAuth(): Promise<void> {
  await setPrefs({ apiToken: "", userEmail: "" });
}
