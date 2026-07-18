import { NextResponse } from "next/server";
import { ConfirmSendRequestSchema } from "@mail-tracking/shared";
import { getUserFromRequest } from "@/lib/auth";
import { confirmSend } from "@/lib/tracking";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const json = await req.json().catch(() => null);
  const parsed = ConfirmSendRequestSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const updated = await confirmSend(id, user.id, parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, id: updated.id });
}
