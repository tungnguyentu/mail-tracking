import { describe, expect, it } from "vitest";
import { extractLinks, prepareTrackedBody } from "./prepare-body";

/** Invariant: free tracking must never inject product branding footers. */
const BRANDING_PATTERNS = [
  /sent with\s+trackpixl/i,
  /sent with\s+mailtrack/i,
  /powered by\s+trackpixl/i,
  /trackpixl\.click\/brand/i,
];

describe("prepareTrackedBody", () => {
  it("rewrites links and injects pixel", () => {
    const html = `<div>Hi <a href="https://example.com/x">x</a></div>`;
    const out = prepareTrackedBody(html, {
      sendId: "s1",
      openPixelUrl: "https://api.test/t/o/op",
      links: [
        {
          originalUrl: "https://example.com/x",
          trackUrl: "https://api.test/t/c/ck",
          token: "ck",
        },
      ],
    });
    expect(out).toContain("https://api.test/t/c/ck");
    expect(out).toContain("https://api.test/t/o/op");
    expect(out).not.toContain('href="https://example.com/x"');
  });

  it("does not inject product branding footer (no-branding invariant)", () => {
    const html = `<div>Hello <a href="https://example.com">link</a></div>`;
    const out = prepareTrackedBody(html, {
      sendId: "s1",
      openPixelUrl: "https://api.test/t/o/tok1",
      links: [
        {
          originalUrl: "https://example.com",
          trackUrl: "https://api.test/t/c/tok2",
          token: "tok2",
        },
      ],
    });
    for (const re of BRANDING_PATTERNS) {
      expect(out).not.toMatch(re);
    }
    // Pixel + rewrite only — body should not grow a visible marketing line
    expect(out.toLowerCase()).not.toContain("sent with");
  });

  it("empty-ish body still has no branding", () => {
    const out = prepareTrackedBody("<div></div>", {
      sendId: "s1",
      openPixelUrl: "https://api.test/t/o/op",
      links: [],
    });
    expect(out.toLowerCase()).not.toContain("sent with");
    for (const re of BRANDING_PATTERNS) {
      expect(out).not.toMatch(re);
    }
  });

  it("extractLinks skips mailto and tracked", () => {
    const html = `<a href="https://a.com">a</a><a href="mailto:x@y.z">m</a><a href="https://t/t/c/z">z</a>`;
    expect(extractLinks(html)).toEqual(["https://a.com"]);
  });
});
