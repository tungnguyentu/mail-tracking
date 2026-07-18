import { describe, expect, it } from "vitest";
import { extractLinks, prepareTrackedBody } from "./prepare-body";

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

  it("extractLinks skips mailto and tracked", () => {
    const html = `<a href="https://a.com">a</a><a href="mailto:x@y.z">m</a><a href="https://t/t/c/z">z</a>`;
    expect(extractLinks(html)).toEqual(["https://a.com"]);
  });
});
