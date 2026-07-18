import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({
    id: user.id,
    email: user.email,
    name: user.name,
    settings: {
      notificationsEnabled: user.notificationsEnabled,
      notifyOnOpen: user.notifyOnOpen,
      notifyOnClick: user.notifyOnClick,
      notifyOnReply: user.notifyOnReply,
    },
  });
}
