export type TrackedSendRef = {
  id: string;
  gmailThreadId?: string | null;
  rfc822MessageId?: string | null;
  ownerEmail: string;
};

export type InboundMessage = {
  gmailMessageId: string;
  threadId: string;
  from: string;
  inReplyTo?: string | null;
  references?: string | null;
  isFromOwner: boolean;
};

/**
 * Match inbound Gmail messages to tracked sends by threadId or In-Reply-To / References.
 * Own messages never create replies. Returns at most one match per message.
 */
export function matchReplyToTrackedSends(
  message: InboundMessage,
  tracked: TrackedSendRef[],
): TrackedSendRef | null {
  if (message.isFromOwner) return null;

  const byThread = tracked.find(
    (t) => t.gmailThreadId && t.gmailThreadId === message.threadId,
  );
  if (byThread) return byThread;

  const headers = [message.inReplyTo, message.references]
    .filter(Boolean)
    .join(" ");
  if (!headers) return null;

  for (const t of tracked) {
    if (!t.rfc822MessageId) continue;
    const id = t.rfc822MessageId.replace(/^<|>$/g, "");
    if (headers.includes(id) || headers.includes(`<${id}>`)) {
      return t;
    }
  }
  return null;
}
