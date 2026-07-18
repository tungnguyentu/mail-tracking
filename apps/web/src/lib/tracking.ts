import {
  buildClickPath,
  buildOpenPixelPath,
  generateOpaqueToken,
  rankEngagementSignals,
} from "@mail-tracking/shared";
import { prisma } from "./db";

function appUrl() {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export async function createTrackedSend(input: {
  userId: string;
  subject: string;
  to: string[];
  links: string[];
}) {
  const openToken = generateOpaqueToken();
  const linkRows = input.links.map((originalUrl) => ({
    originalUrl,
    token: generateOpaqueToken(),
  }));

  const send = await prisma.trackedSend.create({
    data: {
      userId: input.userId,
      subject: input.subject,
      toJson: JSON.stringify(input.to),
      openToken,
      links: {
        create: linkRows,
      },
    },
    include: { links: true },
  });

  const base = appUrl();
  return {
    sendId: send.id,
    openPixelUrl: `${base}${buildOpenPixelPath(openToken)}`,
    links: send.links.map((l) => ({
      originalUrl: l.originalUrl,
      token: l.token,
      trackUrl: `${base}${buildClickPath(l.token)}`,
    })),
  };
}

export async function recordOpen(token: string, userAgent?: string | null) {
  const send = await prisma.trackedSend.findUnique({ where: { openToken: token } });
  if (!send) return null;
  const event = await prisma.event.create({
    data: {
      sendId: send.id,
      type: "open",
      userAgent: userAgent ?? null,
    },
  });
  return event;
}

export async function recordClick(token: string) {
  const link = await prisma.trackedLink.findUnique({
    where: { token },
    include: { send: true },
  });
  if (!link) return null;
  // Only allow http(s) redirects
  let target: URL;
  try {
    target = new URL(link.originalUrl);
  } catch {
    return null;
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return null;
  }
  const event = await prisma.event.create({
    data: {
      sendId: link.sendId,
      type: "click",
      linkId: link.id,
    },
  });
  return { event, originalUrl: link.originalUrl };
}

export async function confirmSend(
  sendId: string,
  userId: string,
  data: {
    gmailThreadId?: string;
    gmailMessageId?: string;
    rfc822MessageId?: string;
  },
) {
  const existing = await prisma.trackedSend.findFirst({
    where: { id: sendId, userId },
  });
  if (!existing) return null;
  return prisma.trackedSend.update({
    where: { id: sendId },
    data: {
      gmailThreadId: data.gmailThreadId ?? existing.gmailThreadId,
      gmailMessageId: data.gmailMessageId ?? existing.gmailMessageId,
      rfc822MessageId: data.rfc822MessageId ?? existing.rfc822MessageId,
    },
  });
}

export async function listSendsForUser(userId: string) {
  const sends = await prisma.trackedSend.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { events: true },
  });
  return sends.map((s) => {
    const clickCount = s.events.filter((e) => e.type === "click").length;
    const replyCount = s.events.filter((e) => e.type === "reply").length;
    const openCount = s.events.filter((e) => e.type === "open").length;
    return {
      id: s.id,
      subject: s.subject,
      to: JSON.parse(s.toJson) as string[],
      createdAt: s.createdAt.toISOString(),
      clickCount,
      replyCount,
      openCount,
      primarySignal: rankEngagementSignals({ clickCount, replyCount, openCount }),
      events: s.events
        .slice()
        .sort((a, b) => b.occurredAt.getTime() - a.occurredAt.getTime())
        .map((e) => ({
          id: e.id,
          type: e.type,
          occurredAt: e.occurredAt.toISOString(),
          noisy: e.type === "open",
        })),
    };
  });
}

export async function eventsSince(userId: string, cursor?: string | null) {
  const since = cursor ? new Date(cursor) : new Date(0);
  const events = await prisma.event.findMany({
    where: {
      occurredAt: { gt: since },
      send: { userId },
    },
    orderBy: { occurredAt: "asc" },
    include: { send: true },
  });
  return events.map((e) => ({
    id: e.id,
    sendId: e.sendId,
    type: e.type as "open" | "click" | "reply",
    occurredAt: e.occurredAt.toISOString(),
    subject: e.send.subject,
  }));
}

export async function recordReplyIdempotent(input: {
  sendId: string;
  gmailMessageId: string;
}) {
  const dedupeKey = `reply:${input.gmailMessageId}`;
  try {
    return await prisma.event.create({
      data: {
        sendId: input.sendId,
        type: "reply",
        gmailMessageId: input.gmailMessageId,
        dedupeKey,
      },
    });
  } catch {
    return prisma.event.findUnique({ where: { dedupeKey } });
  }
}

/** 1x1 transparent GIF */
export const PIXEL_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64",
);
