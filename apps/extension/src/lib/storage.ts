export type StickyPrefs = {
  trackingEnabled: boolean;
  apiToken?: string;
  apiBase?: string;
  eventCursor?: string;
  notifiedEventIds?: string[];
};

const DEFAULTS: StickyPrefs = {
  trackingEnabled: true,
};

export async function getPrefs(): Promise<StickyPrefs> {
  if (typeof chrome === "undefined" || !chrome.storage?.sync) {
    return { ...DEFAULTS };
  }
  const data = await chrome.storage.sync.get(DEFAULTS);
  return { ...DEFAULTS, ...data } as StickyPrefs;
}

export async function setPrefs(partial: Partial<StickyPrefs>): Promise<void> {
  if (typeof chrome === "undefined" || !chrome.storage?.sync) return;
  await chrome.storage.sync.set(partial);
}
