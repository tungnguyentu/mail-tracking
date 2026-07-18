/** High-entropy opaque tracking tokens (URL-safe base64url). */
export const TRACK_TOKEN_LENGTH = 32;

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]!);
  }
  if (typeof btoa === "function") {
    return btoa(binary)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/g, "");
  }
  // Node without btoa
  return Buffer.from(bytes).toString("base64url");
}

function randomBytes(byteLength: number): Uint8Array {
  const out = new Uint8Array(byteLength);
  const cryptoObj = globalThis.crypto;
  if (!cryptoObj?.getRandomValues) {
    throw new Error("Secure random unavailable (crypto.getRandomValues)");
  }
  cryptoObj.getRandomValues(out);
  return out;
}

export function generateOpaqueToken(byteLength = TRACK_TOKEN_LENGTH): string {
  return bytesToBase64Url(randomBytes(byteLength));
}

export function isOpaqueToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{20,}$/.test(token);
}

export function buildOpenPixelPath(token: string): string {
  return `/t/o/${token}`;
}

export function buildClickPath(token: string): string {
  return `/t/c/${token}`;
}
