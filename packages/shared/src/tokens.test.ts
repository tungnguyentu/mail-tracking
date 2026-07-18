import { describe, expect, it } from "vitest";
import {
  generateOpaqueToken,
  isOpaqueToken,
  TRACK_TOKEN_LENGTH,
  buildOpenPixelPath,
  buildClickPath,
} from "./tokens.js";

describe("generateOpaqueToken", () => {
  it("produces high-entropy non-sequential tokens", () => {
    const a = generateOpaqueToken();
    const b = generateOpaqueToken();
    expect(a).not.toBe(b);
    expect(isOpaqueToken(a)).toBe(true);
    expect(a.length).toBeGreaterThanOrEqual(TRACK_TOKEN_LENGTH);
  });
});

describe("path builders", () => {
  it("builds open and click paths", () => {
    expect(buildOpenPixelPath("abc")).toBe("/t/o/abc");
    expect(buildClickPath("xyz")).toBe("/t/c/xyz");
  });
});
