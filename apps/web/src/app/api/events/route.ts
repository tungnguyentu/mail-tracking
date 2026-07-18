import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { eventsSince } from "@/lib/tracking";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const cursor = url.searchParams.get("cursor");
  const events = await eventsSince(user.id, cursor);
  const nextCursor =
    events.length > 0 ? events[events.length - 1].occurredAt : cursor;
  return NextResponse.json({ events, cursor: nextCursor });
}
