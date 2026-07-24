import {
  DEFAULT_NOTIFICATION_PREFS,
  isSilenceEligible,
  shouldNotifySilence,
  type NotificationPrefs,
} from "@trackpixl/shared";
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
  fetchSends,
} from "./lib/api";
import { buildNotification, buildSilenceNotification } from "./lib/notify";
import { getPrefs, setPrefs } from "./lib/storage";

const ALARM = "tp-poll-events";
const AUTH_ALARM = "tp-sync-auth";
const SILENCE_ALARM = "tp-silence-scan";

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM, { periodInMinutes: 0.5 });
  chrome.alarms.create(AUTH_ALARM, { periodInMinutes: 5 });
  chrome.alarms.create(SILENCE_ALARM, { periodInMinutes: 60 * 12 });
  void syncAuthFromDomain();
});

chrome.runtime.onStartup?.addListener(() => {
  void syncAuthFromDomain();
  // Ensure silence alarm exists after browser restart
  chrome.alarms.create(SILENCE_ALARM, { periodInMinutes: 60 * 12 });
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
    return;
  }
  if (alarm.name === SILENCE_ALARM) {
    await scanSilence();
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
      case "SILENCE_SCAN_NOW":
        await scanSilence();
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

async function loadNotifyPrefs(): Promise<NotificationPrefs> {
  let meSettings: NotificationPrefs = { ...DEFAULT_NOTIFICATION_PREFS };
  try {
    const me = await fetchMe();
    if (me?.settings) {
      meSettings = {
        notificationsEnabled: me.settings.notificationsEnabled,
        notifyOnOpen: me.settings.notifyOnOpen,
        notifyOnClick: me.settings.notifyOnClick,
        notifyOnReply: me.settings.notifyOnReply,
        notifyOnSilence:
          me.settings.notifyOnSilence ??
          DEFAULT_NOTIFICATION_PREFS.notifyOnSilence,
      };
    }
  } catch {
    /* keep defaults */
  }
  return meSettings;
}

async function pollEvents() {
  const auth = await ensureAuth();
  if (!auth.signedIn) return;

  const prefs = await getPrefs();
  const meSettings = await loadNotifyPrefs();

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

/** One silence bump per send after N quiet days (no click/reply). */
async function scanSilence() {
  const auth = await ensureAuth();
  if (!auth.signedIn) return;

  const meSettings = await loadNotifyPrefs();
  if (!shouldNotifySilence(meSettings)) return;

  const prefs = await getPrefs();
  const already = new Set(prefs.silenceNotifiedSendIds ?? []);

  try {
    const { sends } = await fetchSends();
    const now = new Date();
    for (const s of sends) {
      if (already.has(s.id)) continue;
      if (
        !isSilenceEligible(
          {
            id: s.id,
            createdAt: s.createdAt,
            clickCount: s.clickCount,
            replyCount: s.replyCount,
          },
          now,
        )
      ) {
        continue;
      }
      const payload = buildSilenceNotification(s.subject);
      if (chrome.notifications?.create) {
        chrome.notifications.create(`silence-${s.id}`, {
          type: "basic",
          iconUrl: chrome.runtime.getURL("icon-128.png"),
          title: payload.title,
          message: payload.message,
        });
      }
      already.add(s.id);
    }
    await setPrefs({
      silenceNotifiedSendIds: [...already].slice(-300),
    });
  } catch (e) {
    console.warn("scanSilence", e);
  }
}
