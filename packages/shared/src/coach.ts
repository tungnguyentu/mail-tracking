/** Fixed V1 coach notification copy — no LLM. */

export type CoachPayload = { title: string; message: string };

function subjectLabel(subject: string): string {
  const s = subject.trim();
  return s || "your email";
}

/** Click: recipient engaged a link. */
export function coachClickTemplate(subject: string): CoachPayload {
  return {
    title: "They clicked a link",
    message: `Someone engaged a link on ${subjectLabel(subject)}. Good moment to follow up if you were waiting.`,
  };
}

/** Reply: thread got a reply. */
export function coachReplyTemplate(subject: string): CoachPayload {
  return {
    title: "They replied",
    message: `Reply on ${subjectLabel(subject)}. Check the thread when you can.`,
  };
}

/** Silence: no click/reply after N days — suggestion only, does not send mail. */
export function coachSilenceTemplate(subject: string): CoachPayload {
  return {
    title: "Still quiet — consider a bump",
    message: `No click or reply yet on ${subjectLabel(subject)}. A short one-line follow-up can help.`,
  };
}

/** Default silence window (calendar days). Opens alone do not cancel silence. */
export const SILENCE_DAYS_DEFAULT = 5;

export type SilenceSendSnapshot = {
  id: string;
  createdAt: string | Date;
  clickCount: number;
  replyCount: number;
};

/**
 * Pure: eligible for a one-time silence bump notification.
 * - age >= N days
 * - no clicks and no replies (opens ignored)
 */
export function isSilenceEligible(
  send: SilenceSendSnapshot,
  now: Date = new Date(),
  silenceDays: number = SILENCE_DAYS_DEFAULT,
): boolean {
  if (send.clickCount > 0 || send.replyCount > 0) return false;
  const created =
    typeof send.createdAt === "string"
      ? new Date(send.createdAt)
      : send.createdAt;
  if (Number.isNaN(created.getTime())) return false;
  const ms = silenceDays * 24 * 60 * 60 * 1000;
  return now.getTime() - created.getTime() >= ms;
}
