import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { processInboundMessages } from "@/lib/gmail-replies";

const MessageSchema = z.object({
  gmailMessageId: z.string(),
  threadId: z.string(),
  from: z.string(),
  inReplyTo: z.string().optional().nullable(),
  references: z.string().optional().nullable(),
  isFromOwner: z.boolean(),
});

const BodySchema = z.object({
  messages: z.array(MessageSchema),
});

/**
 * Internal/testable entry for reply detection.
 * Production would call this from Pub/Sub push or a poller with history.list results.
 */
export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const created = await processInboundMessages(
    user.id,
    user.email,
    parsed.data.messages,
  );
  return NextResponse.json({ createdEventIds: created });
}
