---
date: 2026-07-24
topic: followup-coach-link-first
origin_ideation: docs/ideation/2026-07-24-better-than-email-tracker-ideas.md
---

# Requirements: TrackPixl V1 — Link-first engagement + thin follow-up coach + free no-branding

## Summary

Reposition TrackPixl from “open tracker for freelancers” to **engagement-first Gmail tracking for anyone sending important 1:1 mail**, with **free full core** (no forced branding footer), **clicks and replies as primary signals**, and a **thin notify-only coach** (three fixed templates). No AI drafts, no proposal entity, no paid gate on core in V1.

---

## Problem Frame

Free Gmail trackers already own “did they open?” — often with branding stamps and noisy open metrics. Users still ghost-anxiety after send (“opened but no reply”). TrackPixl’s stack already captures opens, link clicks, and replies; the product has under-used that for a clearer job: **trustworthy engagement signals + what to do next**, without unprofessional free branding. Market evidence supports anti-branding and open skepticism more than “prettier open counts.”

---

## Key Decisions

- **Outcome (balanced V1):** After a week, users feel (1) free use is professional (no branding), (2) signals are honest (click/reply lead), (3) notifications help know when to follow up.
- **Free full core:** V1 free includes track, no forced footer, click/reply-first UI, basic coach notify rules. Paid (history length, advanced coach) deferred — not required to call V1 done.
- **Coach = notify-only templates:** Three rules, fixed copy templates — not AI-written emails, not dashboard-only playbooks as the primary coach surface.
- **Approach A:** Reposition + thin coach on existing stack — not Proposal object (B), not GTM-only without coach behavior (C).
- **ICP:** Anyone on Gmail web with important 1:1 mail (not freelancers-only; not bulk sequences).
- **Identity boundaries:** Not ESP, not sales engagement suite, not mini-CRM in V1.

---

## Actors

- A1. **Sender** — Gmail web user; tracks outbound 1:1 mail; receives desktop notifications; views Activity.
- A2. **Recipient** — External; never installs; may open, click, reply.
- A3. **Prospect** — Visits marketing / installs extension.

---

## Key Flows

- F1. Tracked send (unchanged capability, clarified product promise)
  - **Trigger:** Sender sends with Track on.
  - **Outcome:** Open pixel + link tracking applied; **no forced branding footer** in body.
  - **Covered by:** R1, R2

- F2. Engagement presentation
  - **Trigger:** Events recorded or viewed in Activity / notifications.
  - **Outcome:** Clicks and replies emphasized; opens labeled possible/secondary.
  - **Covered by:** R3, R4

- F3. Thin coach notifications
  - **Trigger:** Click, reply, or silence after N days on a tracked send.
  - **Outcome:** Desktop notification uses fixed template for that case (see R5–R7).
  - **Covered by:** R5, R6, R7, R8

- F4. Marketing / install promise
  - **Trigger:** Prospect hits site or CWS listing (when available).
  - **Outcome:** Message matches free no-brand + engagement-first + follow-up help — not open-rate hero.
  - **Covered by:** R9, R10

---

## Requirements

**No branding**

- R1. Tracked sends must not inject a product branding footer or “Sent with TrackPixl” (or similar) into the message body as a condition of free tracking.
- R2. Marketing and in-product copy must state no forced branding as a primary free benefit.

**Link-first / engagement-first honesty**

- R3. Product narrative, default notification emphasis, and Activity presentation **lead with link clicks and replies**; opens are visible as secondary/noisy (“possible open”), never as the sole success metric.
- R4. Empty and zero states coach engagement language (waiting for click/reply), not “no opens yet” as hero.

**Thin coach (notify-only templates)**

- R5. **On click:** Notification template communicates that the recipient engaged a link (include send subject or short context when available).
- R6. **On reply:** Notification template communicates that the thread received a reply.
- R7. **On silence:** After a configurable or fixed N days with no click and no reply (open-only does not cancel silence), optional template suggests a short follow-up bump (template text only — does not send mail or open compose automatically in V1).
- R8. Coach templates are **fixed product copy** (localizable later); V1 does **not** require LLM-generated drafts or per-user trained tone.
- R8b. Sender can disable coach-style notifications in settings without losing core tracking (at minimum: master notifications off already exists; silence bump may be separately toggleable if low cost — planning detail).

**Free full core**

- R9. V1 does not require payment to use: tracking, no forced branding, click/reply-first UI, and the three coach templates.
- R10. Paid packaging (longer history, advanced coach, multi-seat) is **out of V1 requirements**; docs may keep a hypothesis only.

**Audience & positioning**

- R11. Positioning addresses **important 1:1 Gmail** for anyone (proposals, follow-ups, applications, intros) — not freelancers-only and not blast campaigns.
- R12. Explicit non-goals in product identity: bulk ESP, sequence engines, full CRM.

**Distribution (product requirement, not full CWS build spec)**

- R13. Product success criteria assume a path to **normal Chrome install** (Web Store or equivalent); sideload-only is acceptable for development but not for “V1 done” external success claims.

---

## Acceptance Examples

- AE1. No free branding
  - **Given:** Free account, Track on  
  - **When:** Send tracked mail  
  - **Then:** Body has no TrackPixl forced footer

- AE2. Click over open noise
  - **Given:** Send with 3 opens and 1 click  
  - **When:** View Activity  
  - **Then:** Click is primary; opens secondary/possible

- AE3. Click coach notify
  - **Given:** Notifications on, recipient clicks tracked link  
  - **When:** Click recorded  
  - **Then:** Notification uses click template (not open-spam style)

- AE4. Silence bump
  - **Given:** Tracked send, N days, no click, no reply  
  - **When:** Silence rule fires  
  - **Then:** One bump-suggestion notification with fixed template; no auto-send

- AE5. Marketing match
  - **Given:** Landing page  
  - **When:** Prospect reads hero  
  - **Then:** No-brand + engagement-first + 1:1 use cases present; not freelancer-only open-rate story

---

## Success Criteria

- A new sender can install → track → receive a **click or reply** notification that feels more useful than “opened again.”
- Free path never forces branding.
- Opens never dominate default UI or default notify policy.
- Positioning docs (marketing, README) match R11–R12.
- Kill/continue: after public install path + 90 days, if near-zero retained free users, revisit ideation kill path — recorded as assumption, not hard metric in V1 code.

---

## Scope Boundaries

**In V1**

- Repositioning copy (site, extension, README already partially done — keep consistent)
- No forced branding enforcement as product rule
- Click/reply-first presentation
- Three notify templates (click, reply, silence)
- Free full core

**Deferred**

- AI follow-up drafts  
- Proposal entity / pipeline CRM  
- Paid billing  
- Advanced coach (multi-step playbooks, per-link advice)  
- Silence rule ML personalization  
- Non-Gmail clients  

**Outside identity**

- Bulk marketing / ESP  
- Salesloft-class sequences  
- Surveillance identity on recipients  

---

## Dependencies / Assumptions

- Existing inject, click redirect, reply detection, and notification prefs remain the substrate.
- N days for silence defaults in planning (e.g. 3 or 5) — product only requires the behavior exists.
- Assumption: notify templates alone prove follow-up coach value without compose integration.
- Assumption: free no-branding + honest signals is enough wedge vs free open trackers for acquisition once install is easy.

---

## Outstanding Questions

**Deferred to Planning**

- Exact silence interval N and whether opens suppress silence  
- Whether silence notify is default-on or opt-in  
- Template exact strings and localization  
- CWS listing checklist and packaging/legal vs GPL  

**Resolve Before Planning:** None.

---

## Sources

- Ideation: `docs/ideation/2026-07-24-better-than-email-tracker-ideas.md` (survivors #1, #2, #4)  
- Prior product-eval / packaging notes under `docs/product/`  
- Existing product shell: extension + web tracking + notifications  
