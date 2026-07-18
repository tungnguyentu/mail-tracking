import { describe, expect, it } from "vitest";
import { matchReplyToTrackedSends } from "./reply-matcher.js";

const tracked = [
  {
    id: "s1",
    gmailThreadId: "thread-1",
    rfc822MessageId: "<orig@mail.gmail.com>",
    ownerEmail: "me@example.com",
  },
];

describe("matchReplyToTrackedSends", () => {
  it("matches inbound reply on tracked thread", () => {
    const match = matchReplyToTrackedSends(
      {
        gmailMessageId: "m2",
        threadId: "thread-1",
        from: "client@example.com",
        isFromOwner: false,
      },
      tracked,
    );
    expect(match?.id).toBe("s1");
  });

  it("ignores owner own messages", () => {
    const match = matchReplyToTrackedSends(
      {
        gmailMessageId: "m3",
        threadId: "thread-1",
        from: "me@example.com",
        isFromOwner: true,
      },
      tracked,
    );
    expect(match).toBeNull();
  });

  it("matches via In-Reply-To header", () => {
    const match = matchReplyToTrackedSends(
      {
        gmailMessageId: "m4",
        threadId: "other",
        from: "client@example.com",
        inReplyTo: "<orig@mail.gmail.com>",
        isFromOwner: false,
      },
      tracked,
    );
    expect(match?.id).toBe("s1");
  });

  it("returns null for unmatched threads", () => {
    const match = matchReplyToTrackedSends(
      {
        gmailMessageId: "m5",
        threadId: "nope",
        from: "x@y.z",
        isFromOwner: false,
      },
      tracked,
    );
    expect(match).toBeNull();
  });
});
