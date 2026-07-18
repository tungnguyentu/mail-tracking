import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revokeSession, sessionCookieName } from "@/lib/auth";

export async function POST() {
  const jar = await cookies();
  const token = jar.get(sessionCookieName())?.value;
  if (token) await revokeSession(token);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookieName(), "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
