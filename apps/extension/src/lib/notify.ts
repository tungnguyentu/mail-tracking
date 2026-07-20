import {
  shouldNotifyForEvent,
  type EventType,
  type NotificationPrefs,
} from "@trackpixl/shared";

export function buildNotification(
  type: EventType,
  subject: string,
  prefs: NotificationPrefs,
): { title: string; message: string } | null {
  if (!shouldNotifyForEvent(type, prefs)) return null;
  if (type === "click") {
    return {
      title: "Link clicked",
      message: subject || "Someone clicked a link in your email",
    };
  }
  if (type === "reply") {
    return {
      title: "Reply received",
      message: subject || "Someone replied to your tracked email",
    };
  }
  return {
    title: "Possible open",
    message: subject || "A possible open was recorded (noisy)",
  };
}
