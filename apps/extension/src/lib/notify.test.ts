import { describe, expect, it } from "vitest";
import { buildNotification } from "./notify";
import { DEFAULT_NOTIFICATION_PREFS } from "@mail-tracking/shared";

describe("buildNotification", () => {
  it("creates click notification by default", () => {
    const n = buildNotification("click", "Proposal", DEFAULT_NOTIFICATION_PREFS);
    expect(n?.title).toBe("Link clicked");
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
