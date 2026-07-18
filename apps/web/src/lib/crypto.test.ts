import { describe, expect, it } from "vitest";
import { decryptSecret, encryptSecret } from "./crypto";

describe("token encryption", () => {
  const secret = "test-secret-key-for-unit-tests!!";

  it("round-trips plaintext", () => {
    const enc = encryptSecret("refresh-token-abc", secret);
    expect(enc).not.toContain("refresh-token-abc");
    expect(decryptSecret(enc, secret)).toBe("refresh-token-abc");
  });
});
