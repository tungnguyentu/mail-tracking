import { NextResponse } from "next/server";
import { CreateSendRequestSchema } from "@mail-tracking/shared";
import { getUserFromRequest } from "@/lib/auth";
import { createTrackedSend } from "@/lib/tracking";

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const json = await req.json().catch(() => null);
  const parsed = CreateSendRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid body", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const result = await createTrackedSend({
    userId: user.id,
    subject: parsed.data.subject,
    to: parsed.data.to,
    links: parsed.data.links,
  });
  return NextResponse.json(result);
}

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { listSendsForUser } = await import("@/lib/tracking");
  const sends = await listSendsForUser(user.id);
  return NextResponse.json({ sends });
}
