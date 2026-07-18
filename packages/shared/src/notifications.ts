import type { EventType } from "./schemas.js";

export type NotificationPrefs = {
  notificationsEnabled: boolean;
  notifyOnOpen: boolean;
  notifyOnClick: boolean;
  notifyOnReply: boolean;
};

/** Default product prefs: clicks + replies only (engagement-first). */
export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  notificationsEnabled: true,
  notifyOnOpen: false,
  notifyOnClick: true,
  notifyOnReply: true,
};

export function shouldNotifyForEvent(
  type: EventType,
  prefs: NotificationPrefs,
): boolean {
  if (!prefs.notificationsEnabled) return false;
  switch (type) {
    case "open":
      return prefs.notifyOnOpen;
    case "click":
      return prefs.notifyOnClick;
    case "reply":
      return prefs.notifyOnReply;
    default:
      return false;
  }
}
