import { describe, expect, it } from "vitest";
import { rankEngagementSignals } from "./engagement.js";

describe("rankEngagementSignals", () => {
  it("emphasizes click over noisy opens", () => {
    expect(
      rankEngagementSignals({ clickCount: 1, replyCount: 0, openCount: 3 }),
    ).toBe("click");
  });

  it("ranks reply highest", () => {
    expect(
      rankEngagementSignals({ clickCount: 2, replyCount: 1, openCount: 5 }),
    ).toBe("reply");
  });
});
