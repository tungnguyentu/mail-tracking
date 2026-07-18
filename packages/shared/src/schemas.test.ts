import { describe, expect, it } from "vitest";
import {
  CreateSendRequestSchema,
  EventTypeSchema,
  EVENT_TYPES,
} from "./schemas.js";

describe("EventTypeSchema", () => {
  it("accepts open, click, reply", () => {
    for (const t of EVENT_TYPES) {
      expect(EventTypeSchema.parse(t)).toBe(t);
    }
  });

  it("rejects invalid event types", () => {
    expect(() => EventTypeSchema.parse("bounce")).toThrow();
  });
});

describe("CreateSendRequestSchema", () => {
  it("requires at least one recipient", () => {
    expect(() =>
      CreateSendRequestSchema.parse({ to: [], links: [] }),
    ).toThrow();
  });

  it("accepts valid create-send payload", () => {
    const parsed = CreateSendRequestSchema.parse({
      subject: "Proposal",
      to: ["client@example.com"],
      links: ["https://example.com/deck"],
    });
    expect(parsed.to).toEqual(["client@example.com"]);
    expect(parsed.links).toHaveLength(1);
  });
});
