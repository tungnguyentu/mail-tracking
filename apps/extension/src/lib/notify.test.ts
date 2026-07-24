import { describe, expect, it } from "vitest";
import { buildNotification, buildSilenceNotification } from "./notify";
import { DEFAULT_NOTIFICATION_PREFS } from "@trackpixl/shared";

describe("buildNotification", () => {
  it("uses coach click template", () => {
    const n = buildNotification("click", "Proposal", DEFAULT_NOTIFICATION_PREFS);
    expect(n?.title).toMatch(/clicked/i);
    expect(n?.message).toContain("Proposal");
  });

  it("uses coach reply template", () => {
    const n = buildNotification("reply", "Intro", DEFAULT_NOTIFICATION_PREFS);
    expect(n?.title).toMatch(/replied/i);
    expect(n?.message).toContain("Intro");
  });

  it("skips open by default", () => {
    expect(
      buildNotification("open", "Proposal", DEFAULT_NOTIFICATION_PREFS),
    ).toBeNull();
  });

  it("skips when notifications disabled", () => {
    expect(
      buildNotification("click", "X", {
        ...DEFAULT_NOTIFICATION_PREFS,
        notificationsEnabled: false,
      }),
    ).toBeNull();
  });
});

describe("buildSilenceNotification", () => {
  it("suggests bump without claiming auto-send", () => {
    const n = buildSilenceNotification("Q2 deck");
    expect(n.title).toMatch(/quiet|bump/i);
    expect(n.message).toContain("Q2 deck");
  });
});
