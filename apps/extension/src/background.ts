import { DEFAULT_NOTIFICATION_PREFS } from "@mail-tracking/shared";
import { fetchEventsSince, fetchMe } from "./lib/api";
import { buildNotification } from "./lib/notify";
import { getPrefs, setPrefs } from "./lib/storage";

const ALARM = "mt-poll-events";

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create(ALARM, { periodInMinutes: 0.5 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM) return;
  await pollEvents();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "GET_PREFS") {
    getPrefs().then(sendResponse);
    return true;
  }
  if (message?.type === "SET_TRACKING") {
    setPrefs({ trackingEnabled: Boolean(message.enabled) }).then(() =>
      sendResponse({ ok: true }),
    );
    return true;
  }
  if (message?.type === "SET_API_TOKEN") {
    setPrefs({ apiToken: String(message.token || "") }).then(() =>
      sendResponse({ ok: true }),
    );
    return true;
  }
  if (message?.type === "POLL_NOW") {
    pollEvents().then(() => sendResponse({ ok: true }));
    return true;
  }
  return false;
});

async function pollEvents() {
  const prefs = await getPrefs();
  if (!prefs.apiToken) return;

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
          iconUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
          title: payload.title,
          message: payload.message,
        });
      }
      seen.add(ev.id);
    }
    const notifiedEventIds = [...seen].slice(-200);
    await setPrefs({
      eventCursor: cursor ?? prefs.eventCursor,
      notifiedEventIds,
    });
  } catch (e) {
    console.warn("pollEvents", e);
  }
}
