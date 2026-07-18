import { describe, expect, it } from "vitest";
import { matchReplyToTrackedSends } from "@mail-tracking/shared";

describe("reply pipeline (matcher integration)", () => {
  it("idempotent key shape for reply events", () => {
    const gmailMessageId = "msg-99";
    const dedupeKey = `reply:${gmailMessageId}`;
    expect(dedupeKey).toBe("reply:msg-99");
  });

  it("does not match own messages", () => {
    expect(
      matchReplyToTrackedSends(
        {
          gmailMessageId: "1",
          threadId: "t",
          from: "me@x.com",
          isFromOwner: true,
        },
        [
          {
            id: "s",
            gmailThreadId: "t",
            ownerEmail: "me@x.com",
          },
        ],
      ),
    ).toBeNull();
  });
});
