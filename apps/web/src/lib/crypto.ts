import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

function keyFromSecret(secret: string): Buffer {
  return createHash("sha256").update(secret).digest();
}

/** Encrypt refresh tokens at rest (AES-256-GCM). */
export function encryptSecret(plaintext: string, secret = process.env.TOKEN_ENCRYPTION_KEY ?? ""): string {
  if (!secret) throw new Error("TOKEN_ENCRYPTION_KEY missing");
  const key = keyFromSecret(secret);
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString("base64url");
}

export function decryptSecret(ciphertext: string, secret = process.env.TOKEN_ENCRYPTION_KEY ?? ""): string {
  if (!secret) throw new Error("TOKEN_ENCRYPTION_KEY missing");
  const key = keyFromSecret(secret);
  const buf = Buffer.from(ciphertext, "base64url");
  const iv = buf.subarray(0, 12);
  const tag = buf.subarray(12, 28);
  const data = buf.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
