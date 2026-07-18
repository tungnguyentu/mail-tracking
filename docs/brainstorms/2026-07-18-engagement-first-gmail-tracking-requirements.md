---
date: 2026-07-18
topic: engagement-first-gmail-tracking
---

# Requirements: Engagement-First Gmail Email Tracking

## Summary

Build a sellable **engagement-first** email tracking product for solo freelancers and consultants on **Gmail web**: a Chrome extension that injects tracking on send, a simple web dashboard, and a public marketing site. Product narrative and default UI lead with **link clicks** and **reply detection**; **opens** are included but treated as a secondary, noisy signal. Differentiation vs free Mailtrack-class tools is **minimal Gmail UI chrome**, with **desktop notifications default-on** as the primary alert channel.

## Problem Frame

Freelancers and consultants already reach for free open-tracking extensions (Mailtrack and peers) to know whether a proposal, invoice follow-up, or sales thread got attention. Those tools work well enough to create habit, but the Gmail surface becomes noisy—extra chrome, badges, and UI that compete with the inbox. Demand for a *new* commercial product is still a bet (limited hard evidence), so the wedge is displacement: same core job (know if they engaged), cleaner in-Gmail experience, and a more honest metric hierarchy as open pixels degrade (image blocking, client privacy features, corporate proxies).

## Key Decisions

- **Engagement-first positioning** — Clicks and replies are primary; opens remain available but are not the product’s lead claim. Reflects declining open reliability while still shipping the familiar tracking set users expect.
- **Beachhead: solo freelancers / consultants on Gmail web** — Not SDRs, not teams, not multi-client mail. One person, Gmail in Chrome, professional outbound (proposals, follow-ups).
- **Quiet Gmail UI; notifications as signal** — “Less clutter than Mailtrack” means *in-Gmail* chrome stays minimal. Desktop notifications default on; they are intentional, not treated as clutter.
- **Full product shell in v1** — Extension + web dashboard + public marketing site, despite thin demand proof. Goal is a sellable shape, not a private personal script.
- **Tracking preference is sticky** — Remember last on/off (or last mode) across composes. Smart per-recipient or domain rules deferred.
- **Pricing deferred** — Product behavior is designed without locking free/paid packaging; commercial intent is assumed but plan/pricing is not a v1 requirement.

## Actors

- A1. **Sender** — Solo freelancer/consultant using Gmail web in Chrome; installs the extension, optionally uses the dashboard, receives engagement alerts.
- A2. **Recipient** — External person who receives the email; does not install anything; may open, click links, and/or reply. Not a product user.
- A3. **Visitor / prospect** — Person who hits the marketing site; may sign up or install. Distinct from day-to-day sender workflow.

## Key Flows

- F1. Tracked send from Gmail
  - **Trigger:** Sender composes and sends an email in Gmail web with tracking enabled (per sticky preference, overridable for that send).
  - **Actors:** A1, A2
  - **Steps:** Sender composes; extension shows a minimal tracked-state control (not a cluttered panel); on send, open pixel and link-wrapping are applied as needed; message is marked tracked in the thread with a quiet badge/state; no forced branding footer as a core product requirement.
  - **Outcome:** Outbound message is trackable; sender can later see engagement without leaving the engagement-first UX model.
  - **Covered by:** R1, R2, R3, R4, R7, R8

- F2. Engagement events and alerts
  - **Trigger:** Recipient opens (if unblocked), clicks a tracked link, or replies.
  - **Actors:** A1, A2
  - **Steps:** Events are recorded against the sent message; sender gets desktop notification by default for meaningful engagement; in-Gmail history remains available but quiet; opens are shown with appropriate humility (secondary / noisy).
  - **Outcome:** Sender learns about engagement primarily via notifications and a clean history surface; Gmail UI does not become a second product UI.
  - **Covered by:** R3, R4, R5, R6, R9

- F3. Dashboard review
  - **Trigger:** Sender opens the web dashboard (login required).
  - **Actors:** A1
  - **Steps:** Views recent activity (sends, clicks, replies, opens as secondary), basic settings (e.g. notification preference), and account identity.
  - **Outcome:** Multi-session history and settings live outside the Gmail chrome.
  - **Covered by:** R10, R11

- F4. Marketing → install
  - **Trigger:** Prospect visits the public marketing site.
  - **Actors:** A3, A1
  - **Steps:** Understands value prop (engagement-first, quiet Gmail, freelancers); signs up / installs extension; lands in a working send-track loop.
  - **Outcome:** Product is discoverable and installable as a commercial shell, not only sideloaded.
  - **Covered by:** R12

## Requirements

**Tracking on send (Gmail web)**

- R1. The product ships as a **Chrome extension** that works on **Gmail web** (gmail.com / Google Workspace in the browser) for compose and send. Non-Gmail clients are out of scope for v1.
- R2. On send with tracking enabled, the product injects **open tracking** for that message.
- R3. On send with tracking enabled, the product applies **link click tracking** to links in the message body so clicks can be attributed to that send.
- R4. The product detects **replies** to tracked sends and surfaces them as first-class engagement events alongside clicks.
- R5. Product narrative, default ordering of signals, and primary empty/zero states **lead with clicks and replies**; opens are visible but clearly secondary and not presented as a precise or exclusive success metric.

**Send-time controls and Gmail surface**

- R6. Tracking enablement uses a **sticky last choice** across composes (user’s previous on/off or equivalent preference). Per-recipient automation and domain rules are not required in v1.
- R7. Compose/send UI in Gmail exposes a **minimal** control for tracked state and a **quiet** post-send tracked indicator on the thread/message—no dense side panels, heavy badges everywhere, or Mailtrack-style Gmail chrome as the default experience.
- R8. Forced “tracked with X” branding footers are **not** required for core tracking to work (anti-pattern of free competitors). Optional disclosure copy is a product/legal choice later, not a v1 UX dependency.

**Alerts and history**

- R9. **Desktop notifications default on** for engagement events the product treats as meaningful (at minimum clicks and replies; opens may notify but must not dominate if that conflicts with engagement-first presentation). Sender can turn notifications off in settings.
- R10. Sender can review engagement history for their tracked sends in a **web dashboard** (activity feed + basic settings), not only ephemerally in notifications.
- R11. Sender has an **account** so history and settings persist across devices/sessions (extension alone is not the sole long-term store of product identity).

**Commercial shell**

- R12. v1 includes a **public marketing site** that states the engagement-first value prop for freelancers/consultants and supports signup/install discovery.
- R13. Pricing tiers, free forever limits, and billing are **not** locked by these requirements; the product must remain shippable and usable without a finalized monetization package.

**Quality / honesty**

- R14. Open events must be presented in a way that acknowledges **noise and false positives/negatives** (privacy proxies, image blocking); UI must not imply open counts are ground truth.
- R15. Tracking applies to the **sender’s outbound Gmail workflow** only; recipients are never required to install software.

## Acceptance Examples

- AE1. Sticky tracking preference
  - **Covers:** R6
  - **Given:** Sender last sent with tracking off
  - **When:** They open a new compose
  - **Then:** Tracking defaults to off until they turn it on; the new choice sticks for the next compose

- AE2. Engagement-first presentation
  - **Covers:** R5, R14
  - **Given:** A tracked send has 3 open events (possibly proxy noise) and 1 link click
  - **When:** Sender views history for that send (notification, Gmail quiet state, or dashboard)
  - **Then:** Click is the emphasized signal; opens are shown without implying three genuine human opens

- AE3. Quiet Gmail vs notifications
  - **Covers:** R7, R9
  - **Given:** Notifications are at default (on) and a recipient clicks a tracked link
  - **When:** The click is recorded
  - **Then:** Sender receives a desktop notification, and Gmail does not grow a large new panel or multi-widget chrome for that event

- AE4. Reply as first-class
  - **Covers:** R4, R5
  - **Given:** Recipient replies to a tracked send
  - **When:** Reply is detected
  - **Then:** Reply appears as a primary engagement event (dashboard and notification path), not only as a Gmail thread update the product ignores

- AE5. Marketing path
  - **Covers:** R12
  - **Given:** A prospect has never used the product
  - **When:** They visit the marketing site and complete signup/install
  - **Then:** They can send a tracked email from Gmail web without a separate undocumented setup path

## Success Criteria

- A freelancer who already uses free Mailtrack can complete **install → tracked send → see a click or reply** without training, and describe Gmail as **less visually noisy** than their previous tracker.
- Product copy and default UI never lead with “open rates” as the hero metric; clicks/replies are the story.
- v1 is **demoable end-to-end** from marketing site → extension → Gmail send → notification/dashboard event.
- Scope remains Gmail-web + solo sender; no team features required to call v1 done.

## Scope Boundaries

### Deferred for later

- Outlook web and other mail clients
- Team / shared inbox, multi-seat admin, CRM sync, sequences/campaigns
- Smart rules (by recipient, domain, label, or “money emails only”)
- Digests, digests-only modes, advanced notification routing
- Locked pricing, billing, free-tier limit games, affiliate programs
- Mobile mail clients / non-Chrome browsers as first-class
- Deep analytics (funnels, A/B subject lines, heatmaps)

### Outside this product's identity

- Full ESP / bulk marketing email platform
- “Surveillance-grade” identity resolution on recipients
- Competing as a sales engagement suite (Outreach/Salesloft class)
- Winning primarily by being free forever with aggressive branding

## Dependencies / Assumptions

- **Assumption:** Enough freelancers will switch from free Mailtrack for quieter Gmail + engagement-first honesty to justify a commercial shell (evidence is currently thin).
- **Assumption:** Reply detection is feasible enough for Gmail web workflows to be a primary signal; exact mechanism is a planning concern.
- **Assumption:** Chrome extension policies and Gmail DOM stability allow reliable inject-on-send; breakage risk is accepted as product risk.
- **Dependency:** Account identity and event storage (somewhere off-device) for dashboard, multi-session history, and notifications—without prescribing vendor or stack.
- **Dependency:** Link tracking implies redirect or equivalent attribution host; treated as product capability, not a specific architecture.

## Outstanding Questions

### Deferred to Planning

- How reply detection is implemented against Gmail (thread APIs vs. heuristics vs. other)—choose during technical planning.
- Exact event schema, retention windows, and privacy policy wording.
- Auth provider and extension↔backend session model.
- Which engagement events fire notifications by default (clicks/replies only vs. opens too) at implementation detail level while respecting R5/R9.
- Minimal marketing site content and signup funnel structure.
- Localization (default: English-first unless planning discovers otherwise).
- Open-source vs proprietary packaging relative to the existing GPL-3.0 `LICENSE` in the repo—legal product decision for planning/owners.
