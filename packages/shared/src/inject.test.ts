import { describe, expect, it } from "vitest";
import {
  injectOpenPixel,
  isTrackableHref,
  rewriteLinksInHtml,
} from "./inject.js";

describe("isTrackableHref", () => {
  it("allows http(s) links", () => {
    expect(isTrackableHref("https://example.com")).toBe(true);
    expect(isTrackableHref("http://example.com/x")).toBe(true);
  });

  it("skips mailto, already tracked, javascript", () => {
    expect(isTrackableHref("mailto:a@b.com")).toBe(false);
    expect(isTrackableHref("https://track.example/t/c/abc")).toBe(false);
    expect(isTrackableHref("javascript:void(0)")).toBe(false);
  });
});

describe("rewriteLinksInHtml", () => {
  it("rewrites matching anchors only", () => {
    const map = new Map([
      ["https://example.com/a", "https://track.test/t/c/tok1"],
    ]);
    const html = `<p><a href="https://example.com/a">A</a> <a href="mailto:x@y.z">m</a></p>`;
    const out = rewriteLinksInHtml(html, map);
    expect(out).toContain("https://track.test/t/c/tok1");
    expect(out).toContain("mailto:x@y.z");
  });
});

describe("injectOpenPixel", () => {
  it("appends a single pixel", () => {
    const out = injectOpenPixel("<p>Hi</p>", "https://track.test/t/o/tok");
    expect(out).toContain('src="https://track.test/t/o/tok"');
    const twice = injectOpenPixel(out, "https://track.test/t/o/tok");
    expect(twice.match(/t\/o\/tok/g)?.length).toBe(1);
  });
});
