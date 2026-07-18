import { z } from "zod";

export const EVENT_TYPES = ["open", "click", "reply"] as const;
export const EventTypeSchema = z.enum(EVENT_TYPES);
export type EventType = z.infer<typeof EventTypeSchema>;

export const CreateSendRequestSchema = z.object({
  subject: z.string().min(0).max(998).default(""),
  to: z.array(z.string().min(1)).min(1),
  links: z.array(z.string().url()).default([]),
});
export type CreateSendRequest = z.infer<typeof CreateSendRequestSchema>;

export const CreateSendResponseSchema = z.object({
  sendId: z.string().min(1),
  openPixelUrl: z.string().url(),
  links: z.array(
    z.object({
      originalUrl: z.string().url(),
      trackUrl: z.string().url(),
      token: z.string().min(1),
    }),
  ),
});
export type CreateSendResponse = z.infer<typeof CreateSendResponseSchema>;

export const ConfirmSendRequestSchema = z.object({
  gmailThreadId: z.string().min(1).optional(),
  gmailMessageId: z.string().min(1).optional(),
  rfc822MessageId: z.string().min(1).optional(),
});
export type ConfirmSendRequest = z.infer<typeof ConfirmSendRequestSchema>;

export const EventSchema = z.object({
  id: z.string(),
  sendId: z.string(),
  type: EventTypeSchema,
  occurredAt: z.string().datetime(),
  linkId: z.string().optional().nullable(),
});
export type Event = z.infer<typeof EventSchema>;

export const TrackedSendSummarySchema = z.object({
  id: z.string(),
  subject: z.string(),
  to: z.array(z.string()),
  createdAt: z.string().datetime(),
  clickCount: z.number().int().nonnegative(),
  replyCount: z.number().int().nonnegative(),
  openCount: z.number().int().nonnegative(),
  primarySignal: z.enum(["reply", "click", "open", "none"]),
});
export type TrackedSendSummary = z.infer<typeof TrackedSendSummarySchema>;

export const UserSettingsSchema = z.object({
  notificationsEnabled: z.boolean().default(true),
  notifyOnOpen: z.boolean().default(false),
  notifyOnClick: z.boolean().default(true),
  notifyOnReply: z.boolean().default(true),
});
export type UserSettings = z.infer<typeof UserSettingsSchema>;

export const ExtensionTokenExchangeSchema = z.object({
  sessionToken: z.string().min(1),
});
