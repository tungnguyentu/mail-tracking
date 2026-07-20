import { DEFAULT_NOTIFICATION_PREFS } from "@trackpixl/shared";
import { SESSION_COOKIE } from "./config";
import {
  ensureAuth,
  openSignInTab,
  signOutExtension,
  syncAuthFromDomain,
} from "./lib/auth";
import {
  confirmSend,
  createSend,
  fetchEventsSince,
  fetchMe,
} from "./lib/api";
import { buildNotification } from "./lib/notify";
import { getPrefs, setPrefs } from "./lib/storage";

const ALARM = "tp-poll-events";
const AUTH_ALARM = "tp-sync-auth";

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM, { periodInMinutes: 0.5 });
  chrome.alarms.create(AUTH_ALARM, { periodInMinutes: 5 });
  void syncAuthFromDomain();
});

chrome.runtime.onStartup?.addListener(() => {
  void syncAuthFromDomain();
});

// When user finishes login on our domain, cookie appears — resync soon
chrome.cookies?.onChanged?.addListener((change) => {
  if (change.cookie.name === SESSION_COOKIE && !change.removed) {
    void syncAuthFromDomain();
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === AUTH_ALARM) {
    await syncAuthFromDomain();
    return;
  }
  if (alarm.name === ALARM) {
    await pollEvents();
  }
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  const handle = async () => {
    switch (message?.type) {
      case "GET_PREFS":
        return getPrefs();
      case "GET_AUTH":
        return ensureAuth();
      case "SYNC_AUTH":
        return syncAuthFromDomain();
      case "SIGN_IN":
        openSignInTab();
        return { ok: true };
      case "SIGN_OUT":
        await signOutExtension();
        return { ok: true };
      case "SET_TRACKING":
        await setPrefs({ trackingEnabled: Boolean(message.enabled) });
        return { ok: true };
      case "CREATE_SEND":
        return createSend(message.body);
      case "CONFIRM_SEND":
        await confirmSend(message.sendId, message.data ?? {});
        return { ok: true };
      case "POLL_NOW":
        await pollEvents();
        return { ok: true };
      default:
        return { error: "unknown" };
    }
  };

  handle()
    .then(sendResponse)
    .catch((err: Error) => {
      sendResponse({
        error: err?.message || "failed",
      });
    });
  return true;
});

async function pollEvents() {
  const auth = await ensureAuth();
  if (!auth.signedIn) return;

  const prefs = await getPrefs();
  let meSettings = DEFAULT_NOTIFICATION_PREFS;
  try {
    const me = await fetchMe();
    if (me?.settings) {
      meSettings = {
        notificationsEnabled: me.settings.notificationsEnabled,
        notifyOnOpen: me.settings.notifyOnOpen,
        notifyOnClick: me.settings.notifyOnClick,
        notifyOnReply: me.settings.notifyOnReply,
      };
    }
  } catch {
    /* keep defaults */
  }

  try {
    const { events, cursor } = await fetchEventsSince(prefs.eventCursor);
    const seen = new Set(prefs.notifiedEventIds ?? []);
    for (const ev of events) {
      if (seen.has(ev.id)) continue;
      const payload = buildNotification(ev.type, ev.subject, meSettings);
      if (payload && chrome.notifications?.create) {
        chrome.notifications.create(ev.id, {
          type: "basic",
          iconUrl: chrome.runtime.getURL("icon-128.png"),
          title: payload.title,
          message: payload.message,
        });
      }
      seen.add(ev.id);
    }
    await setPrefs({
      eventCursor: cursor ?? prefs.eventCursor,
      notifiedEventIds: [...seen].slice(-200),
    });
  } catch (e) {
    console.warn("pollEvents", e);
  }
}
