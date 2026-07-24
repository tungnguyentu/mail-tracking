import {
  coachClickTemplate,
  coachReplyTemplate,
  coachSilenceTemplate,
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
    return coachClickTemplate(subject);
  }
  if (type === "reply") {
    return coachReplyTemplate(subject);
  }
  // open — rare (default off); keep humble wording
  return {
    title: "Possible open",
    message: subject.trim()
      ? `A possible open on ${subject.trim()} (noisy — prefer click/reply)`
      : "A possible open was recorded (noisy — prefer click/reply)",
  };
}

export function buildSilenceNotification(subject: string): {
  title: string;
  message: string;
} {
  return coachSilenceTemplate(subject);
}
