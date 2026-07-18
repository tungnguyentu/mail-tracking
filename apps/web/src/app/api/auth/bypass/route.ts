import { NextResponse } from "next/server";
import {
  createSession,
  ensureBypassUser,
  sessionCookieName,
} from "@/lib/auth";

/** Dev/demo sign-in without Google OAuth when AUTH_BYPASS=1. */
export async function POST() {
  if (process.env.AUTH_BYPASS !== "1") {
    return NextResponse.json({ error: "bypass disabled" }, { status: 403 });
  }
  const user = await ensureBypassUser();
  const token = await createSession(user.id);
  const res = NextResponse.json({ ok: true, email: user.email });
  res.cookies.set(sessionCookieName(), token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 86400,
  });
  return res;
}
