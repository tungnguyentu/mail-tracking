import { describe, expect, it } from "vitest";
import {
  CreateSendRequestSchema,
  rankEngagementSignals,
  shouldNotifyForEvent,
  DEFAULT_NOTIFICATION_PREFS,
} from "@mail-tracking/shared";

describe("tracking contracts", () => {
  it("create-send requires recipients", () => {
    expect(() => CreateSendRequestSchema.parse({ to: [] })).toThrow();
  });

  it("engagement ranking prefers click over opens", () => {
    expect(
      rankEngagementSignals({ clickCount: 1, replyCount: 0, openCount: 3 }),
    ).toBe("click");
  });

  it("default notification prefs skip opens", () => {
    expect(shouldNotifyForEvent("open", DEFAULT_NOTIFICATION_PREFS)).toBe(
      false,
    );
    expect(shouldNotifyForEvent("click", DEFAULT_NOTIFICATION_PREFS)).toBe(
      true,
    );
  });
});
