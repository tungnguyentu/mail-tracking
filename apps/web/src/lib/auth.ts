import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "./db";
import { encryptSecret } from "./crypto";

const SESSION_COOKIE = "mt_session";
const SESSION_DAYS = 30;
const EXT_TOKEN_DAYS = 30;

export function sessionCookieName() {
  return SESSION_COOKIE;
}

export async function createSession(userId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 864e5);
  await prisma.session.create({ data: { token, userId, expiresAt } });
  return token;
}

export async function createExtensionToken(userId: string): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + EXT_TOKEN_DAYS * 864e5);
  await prisma.extensionToken.create({ data: { token, userId, expiresAt } });
  return token;
}

export async function getUserFromSessionToken(token: string | undefined | null) {
  if (!token) return null;
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

export async function getUserFromExtensionToken(token: string | undefined | null) {
  if (!token) return null;
  const row = await prisma.extensionToken.findUnique({
    where: { token },
    include: { user: true },
  });
  if (!row || row.expiresAt < new Date()) return null;
  return row.user;
}

export async function getUserFromRequest(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) {
    return getUserFromExtensionToken(auth.slice(7));
  }
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`));
  return getUserFromSessionToken(match?.[1]);
}

export async function getSessionUserFromCookies() {
  const jar = await cookies();
  return getUserFromSessionToken(jar.get(SESSION_COOKIE)?.value);
}

/** Dev/demo login without Google when AUTH_BYPASS=1. */
export async function ensureBypassUser() {
  const email = "demo@mail-tracking.local";
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      googleSub: "bypass-demo",
      email,
      name: "Demo User",
      refreshTokenEnc: encryptSecret("bypass-refresh"),
    },
    update: {},
  });
  return user;
}

export async function upsertGoogleUser(input: {
  googleSub: string;
  email: string;
  name?: string | null;
  refreshToken?: string | null;
}) {
  const data = {
    email: input.email,
    name: input.name ?? null,
    ...(input.refreshToken
      ? { refreshTokenEnc: encryptSecret(input.refreshToken) }
      : {}),
  };
  return prisma.user.upsert({
    where: { googleSub: input.googleSub },
    create: { googleSub: input.googleSub, ...data },
    update: data,
  });
}

export async function revokeSession(token: string) {
  await prisma.session.deleteMany({ where: { token } });
}
