import { matchReplyToTrackedSends, type InboundMessage } from "@mail-tracking/shared";
import { prisma } from "./db";
import { recordReplyIdempotent } from "./tracking";

/**
 * Process inbound Gmail history messages for a user and record reply events.
 * Pure orchestration over shared matcher + DB — Gmail API client is injected.
 */
export async function processInboundMessages(
  userId: string,
  ownerEmail: string,
  messages: InboundMessage[],
) {
  const tracked = await prisma.trackedSend.findMany({
    where: { userId, gmailThreadId: { not: null } },
    select: {
      id: true,
      gmailThreadId: true,
      rfc822MessageId: true,
    },
  });
  const refs = tracked.map((t) => ({
    id: t.id,
    gmailThreadId: t.gmailThreadId,
    rfc822MessageId: t.rfc822MessageId,
    ownerEmail,
  }));

  const created: string[] = [];
  for (const msg of messages) {
    const match = matchReplyToTrackedSends(msg, refs);
    if (!match) continue;
    const event = await recordReplyIdempotent({
      sendId: match.id,
      gmailMessageId: msg.gmailMessageId,
    });
    if (event) created.push(event.id);
  }
  return created;
}

export async function advanceHistoryCursor(userId: string, historyId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { gmailHistoryId: historyId },
  });
}
