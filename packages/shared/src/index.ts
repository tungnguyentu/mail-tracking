export {
  EventTypeSchema,
  EVENT_TYPES,
  CreateSendRequestSchema,
  CreateSendResponseSchema,
  ConfirmSendRequestSchema,
  EventSchema,
  TrackedSendSummarySchema,
  UserSettingsSchema,
  ExtensionTokenExchangeSchema,
  type EventType,
  type CreateSendRequest,
  type CreateSendResponse,
  type ConfirmSendRequest,
  type Event,
  type TrackedSendSummary,
  type UserSettings,
} from "./schemas.js";

export {
  generateOpaqueToken,
  isOpaqueToken,
  buildOpenPixelPath,
  buildClickPath,
  TRACK_TOKEN_LENGTH,
} from "./tokens.js";

export {
  rewriteLinksInHtml,
  injectOpenPixel,
  isTrackableHref,
} from "./inject.js";

export {
  matchReplyToTrackedSends,
  type TrackedSendRef,
  type InboundMessage,
} from "./reply-matcher.js";

export {
  shouldNotifyForEvent,
  DEFAULT_NOTIFICATION_PREFS,
  type NotificationPrefs,
} from "./notifications.js";

export {
  rankEngagementSignals,
  type EngagementCounts,
} from "./engagement.js";
