export type EngagementCounts = {
  clickCount: number;
  replyCount: number;
  openCount: number;
};

/** Engagement-first ranking: reply > click > open > none. */
export function rankEngagementSignals(
  counts: EngagementCounts,
): "reply" | "click" | "open" | "none" {
  if (counts.replyCount > 0) return "reply";
  if (counts.clickCount > 0) return "click";
  if (counts.openCount > 0) return "open";
  return "none";
}
