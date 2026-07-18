import { NextResponse } from "next/server";

/** Start Google OAuth (authorization code). */
export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  if (!clientId) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID not configured" },
      { status: 503 },
    );
  }
  const redirectUri = `${appUrl.replace(/\/$/, "")}/api/auth/google/callback`;
  const scope = [
    "openid",
    "email",
    "profile",
    "https://www.googleapis.com/auth/gmail.readonly",
  ].join(" ");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", scope);
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", "mt1");
  return NextResponse.redirect(url.toString());
}
