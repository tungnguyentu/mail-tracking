import { NextResponse } from "next/server";
import {
  createSession,
  sessionCookieName,
  upsertGoogleUser,
} from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const appUrl = (process.env.APP_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );

  const cookieHeader = req.headers.get("cookie") ?? "";
  const expectedState = cookieHeader.match(/tp_oauth_state=([^;]+)/)?.[1];
  if (!code || !state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(`${appUrl}/login?error=invalid_state`);
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(`${appUrl}/login?error=not_configured`);
  }

  const redirectUri = `${appUrl}/api/auth/google/callback`;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) {
    return NextResponse.redirect(`${appUrl}/login?error=token_exchange`);
  }
  const tokens = (await tokenRes.json()) as {
    access_token: string;
    refresh_token?: string;
  };

  const profileRes = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    { headers: { Authorization: `Bearer ${tokens.access_token}` } },
  );
  if (!profileRes.ok) {
    return NextResponse.redirect(`${appUrl}/login?error=profile`);
  }
  const profile = (await profileRes.json()) as {
    sub: string;
    email: string;
    name?: string;
  };

  const user = await upsertGoogleUser({
    googleSub: profile.sub,
    email: profile.email,
    name: profile.name,
    refreshToken: tokens.refresh_token ?? null,
  });
  const session = await createSession(user.id);
  const nextRaw = cookieHeader.match(/tp_oauth_next=([^;]+)/)?.[1];
  const nextPath = nextRaw ? decodeURIComponent(nextRaw) : "/dashboard";
  const safeNext = nextPath.startsWith("/") ? nextPath : "/dashboard";
  const res = NextResponse.redirect(`${appUrl}${safeNext}`);
  res.cookies.set(sessionCookieName(), session, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 86400,
  });
  res.cookies.set("tp_oauth_next", "", { path: "/", maxAge: 0 });
  return res;
}
