import { describe, expect, it } from "vitest";
import {
  SILENCE_DAYS_DEFAULT,
  coachClickTemplate,
  coachReplyTemplate,
  coachSilenceTemplate,
  isSilenceEligible,
} from "./coach.js";

describe("coach templates", () => {
  it("click template includes subject", () => {
    const t = coachClickTemplate("Q2 proposal");
    expect(t.title).toMatch(/clicked/i);
    expect(t.message).toContain("Q2 proposal");
  });

  it("reply template falls back without subject", () => {
    const t = coachReplyTemplate("  ");
    expect(t.message).toContain("your email");
  });

  it("silence template suggests bump without sending", () => {
    const t = coachSilenceTemplate("Intro");
    expect(t.title).toMatch(/quiet|bump/i);
    expect(t.message).toMatch(/follow-up|bump/i);
  });
});

describe("isSilenceEligible", () => {
  const base = {
    id: "s1",
    createdAt: "2026-07-01T00:00:00.000Z",
    clickCount: 0,
    replyCount: 0,
  };

  it("true when older than N days and no click/reply", () => {
    const now = new Date("2026-07-10T00:00:00.000Z");
    expect(isSilenceEligible(base, now, SILENCE_DAYS_DEFAULT)).toBe(true);
  });

  it("false when has click", () => {
    const now = new Date("2026-07-10T00:00:00.000Z");
    expect(
      isSilenceEligible({ ...base, clickCount: 1 }, now, SILENCE_DAYS_DEFAULT),
    ).toBe(false);
  });

  it("false when has reply", () => {
    const now = new Date("2026-07-10T00:00:00.000Z");
    expect(
      isSilenceEligible({ ...base, replyCount: 1 }, now, SILENCE_DAYS_DEFAULT),
    ).toBe(false);
  });

  it("false when too young", () => {
    const now = new Date("2026-07-03T00:00:00.000Z");
    expect(isSilenceEligible(base, now, SILENCE_DAYS_DEFAULT)).toBe(false);
  });

  it("opens do not cancel silence (click/reply still zero)", () => {
    const now = new Date("2026-07-10T00:00:00.000Z");
    // openCount is not on snapshot — eligibility ignores opens by design
    expect(isSilenceEligible(base, now, SILENCE_DAYS_DEFAULT)).toBe(true);
  });
});
