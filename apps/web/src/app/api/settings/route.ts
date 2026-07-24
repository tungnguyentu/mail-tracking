import { NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/db";

const Body = z.object({
  notificationsEnabled: z.boolean().optional(),
  notifyOnOpen: z.boolean().optional(),
  notifyOnClick: z.boolean().optional(),
  notifyOnReply: z.boolean().optional(),
  notifyOnSilence: z.boolean().optional(),
});

export async function PATCH(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: parsed.data,
  });
  return NextResponse.json({
    notificationsEnabled: updated.notificationsEnabled,
    notifyOnOpen: updated.notifyOnOpen,
    notifyOnClick: updated.notifyOnClick,
    notifyOnReply: updated.notifyOnReply,
    notifyOnSilence: updated.notifyOnSilence,
  });
}
