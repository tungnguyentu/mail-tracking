import { NextResponse } from "next/server";
import {
  createExtensionToken,
  getUserFromSessionToken,
  sessionCookieName,
} from "@/lib/auth";

/**
 * Exchange a web session cookie (or sessionToken body) for an extension API token.
 * Refresh tokens never leave the server.
 */
export async function POST(req: Request) {
  let sessionToken: string | undefined;
  try {
    const body = (await req.json()) as { sessionToken?: string };
    sessionToken = body.sessionToken;
  } catch {
    /* cookie path */
  }
  if (!sessionToken) {
    const cookie = req.headers.get("cookie") ?? "";
    sessionToken = cookie.match(new RegExp(`${sessionCookieName()}=([^;]+)`))?.[1];
  }
  const user = await getUserFromSessionToken(sessionToken);
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const token = await createExtensionToken(user.id);
  return NextResponse.json({ token, email: user.email });
}
