import { describe, expect, it } from "vitest";
import {
  DEFAULT_NOTIFICATION_PREFS,
  shouldNotifyForEvent,
  shouldNotifySilence,
} from "./notifications.js";

describe("shouldNotifyForEvent", () => {
  it("notifies click and reply by default, not open", () => {
    expect(shouldNotifyForEvent("click", DEFAULT_NOTIFICATION_PREFS)).toBe(
      true,
    );
    expect(shouldNotifyForEvent("reply", DEFAULT_NOTIFICATION_PREFS)).toBe(
      true,
    );
    expect(shouldNotifyForEvent("open", DEFAULT_NOTIFICATION_PREFS)).toBe(
      false,
    );
  });

  it("respects notificationsEnabled false", () => {
    expect(
      shouldNotifyForEvent("click", {
        ...DEFAULT_NOTIFICATION_PREFS,
        notificationsEnabled: false,
      }),
    ).toBe(false);
  });

  it("silence coach defaults on and respects master + silence pref", () => {
    expect(shouldNotifySilence(DEFAULT_NOTIFICATION_PREFS)).toBe(true);
    expect(
      shouldNotifySilence({
        ...DEFAULT_NOTIFICATION_PREFS,
        notifyOnSilence: false,
      }),
    ).toBe(false);
    expect(
      shouldNotifySilence({
        ...DEFAULT_NOTIFICATION_PREFS,
        notificationsEnabled: false,
      }),
    ).toBe(false);
  });
});
