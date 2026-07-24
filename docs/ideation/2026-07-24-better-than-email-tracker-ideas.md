---
date: 2026-07-24
topic: better-product-ideas-vs-email-tracker
status: open
focus: Stronger product bets than pure Gmail open-tracking, given TrackPixl stack + market evidence
---

# Ideation: Better products than “another Gmail tracker”?

**Inferred mode:** Topic in this codebase — TrackPixl (Gmail MV3 + Next.js + track/click/reply) and whether a **better product shape** exists than pure email tracking.

**Grounding (short):**

- **Codebase:** Monorepo already ships inject-on-send, open pixel, link redirects, reply detection (Gmail API), desktop notify, dashboard, marketing. Strength = **Gmail extension + event pipeline**, not “open checkmarks.”
- **Market (prior eval + web):** Free unlimited open tracking is table stakes; people pay mostly to drop branding; opens are noisy; freelancers/job seekers care about **ghosting after send**; proposal tools and follow-up tools are adjacent crowded markets.
- **Strategy gap:** No STRATEGY.md; packaging still hypothesis; CWS not shipped.
- **Topic axes:** (1) Core tracking job (2) Follow-up / ghosting (3) Document/proposal engagement (4) Monetization (5) Adjacent Gmail jobs on same stack.

**Volume:** Default survivors ~6. Ambition: step-function (not polish).

---

## Survivors (ranked)

### 1. Follow-up coach for high-stakes 1:1 (not “tracker”)

**Summary:** Product is *what to do after send*, not *when they opened*. After a tracked send: suggest next action (“opened 2× but no click → different angle”; “clicked pricing link → reply template”; “no signal 5 days → one-line bump”). Surfaces as Gmail compose assist + notification deep-link, not open badges.

**Axis:** Follow-up / ghosting  
**Basis:** `direct:` Public freelancers: “opened but no reply”; product-eval pain ranking. `reasoned:` Free trackers already own “opened?”; willingness-to-pay clusters around **reducing ghosting anxiety**, not another checkmark.  
**Why it matters:** Repositions the same pipeline (events + notify) into a paid job free tools don’t productize.  
**Meeting test:** Changes homepage, default UX, and monetization story — team discussion required.

---

### 2. Link-engagement as the product (drop open as hero entirely)

**Summary:** Market “know which link they hit on your email” for proposals/portfolios/calendars. Opens demoted to debug. Product name/copy never says “open tracking.” Dashboard = link heat + last click path. Free = limited links; paid = full history + notify on click.

**Axis:** Core tracking job  
**Basis:** `direct:` TrackPixl already rewrites links; marketing already engagement-first. `external:` Open unreliability widely admitted by vendors/community.  
**Why it matters:** Aligns with technical truth and differentiates vs Mailtrack free (opens-first).  
**Meeting test:** Killing open-as-identity is a positioning bet with packaging impact.

---

### 3. “Proposal sent” workspace (email + PDF/link lifecycle)

**Summary:** One object: Proposal. Attach send → track link opens on proposal URL/PDF → reply → status (sent / viewed / engaged / replied / dead). Not a full proposal builder (FluidDocs etc.) — the **lifecycle after you already sent**. Inbox of proposals, not inbox of raw events.

**Axis:** Document/proposal engagement  
**Basis:** `external:` Ghosting-after-proposal is a loud freelancer problem; interactive proposal SaaS exists but is heavy. `direct:` Send + click + reply events already model this.  
**Why it matters:** Object model users understand (“my proposals”) > event feed (“sends”). Higher perceived value than open counts.  
**Meeting test:** Requires domain model + UX reframe; not a copy tweak.

---

### 4. Anti-branding free wedge → paid reliability (keep tracker, change GTM)

**Summary:** Stay in category but win the **only** public WTP pattern: free forever **without** “Sent with…”; paid for history + reply certainty + multi-device. Aggressive CWS SEO against Mailtrack alternatives. Product is boring; GTM is the product.

**Axis:** Monetization  
**Basis:** `external:` Repeated Reddit/SideProject: free branding is the switch trigger; paid ~$3–10.  
**Why it matters:** Highest probability of *some* revenue if execution is ruthless — still micro-SaaS ceiling.  
**Meeting test:** Honest “we’re a better free tracker” strategy vs ambition.

---

### 5. Job-seeker “application radar” (vertical slice)

**Summary:** Same Gmail inject stack, vertical for applications: tag send as Application, track open/click on portfolio/resume links, remind follow-up day N, quiet mode for volume. Language from job-seeker discourse (Mailtrack for applications is common on X).

**Axis:** Adjacent Gmail jobs  
**Basis:** `external:` Viral/high-engagement talk of tracking job application opens. Narrower ICP → clearer ads.  
**Why it matters:** “Anyone” dilutes ads; vertical can convert free→paid faster even if TAM smaller.  
**Meeting test:** Picks a beachhead that contradicts current “anyone” messaging — needs deliberate choice.

---

### 6. Soft-pivot: Gmail “sent mail CRM-lite” for solopreneurs

**Summary:** Tracked threads become pipeline cards: Contact · last signal · next action · notes. Not Salesforce; 50–200 relationship memory for people who live in Gmail. Tracking is one input among reply/stale detection.

**Axis:** Follow-up / ghosting  
**Basis:** `reasoned:` Value of CRM for freelancers is relationship memory, not open pixels. `direct:` Reply detection + sends already exist as graph seeds.  
**Why it matters:** Competes with Streak/HubSpot free on a thinner slice; higher ARPU potential than pure tracker.  
**Meeting test:** Scope risk of becoming “mini CRM”; needs hard non-goals.

---

### 7. Kill the product, productize the skill/stack differently *(challenger)*

**Summary:** If WTP for tracking stays near zero after CWS+no-branding, stop forcing a consumer SaaS. Reuse monorepo as: (a) white-label tracking for agencies, or (b) open-core “honest engagement” module, or (c) founder’s internal tool + content. Idea is strategic optionality, not v1.

**Axis:** Monetization  
**Basis:** `reasoned:` Product-eval Confidence Low; free incumbents; GPL packaging friction for CWS.  
**Why it matters:** Avoids years of zero-revenue feature polish.  
**Meeting test:** Existential — only after a defined kill test fails.

---

## Explicitly rejected (with reasons)

| Idea | Why dead |
|------|----------|
| Another open-tracker with prettier UI only | Free Mailtrack wins; no WTP basis |
| Full sales engagement suite (sequences, warm-up, multi-inbox) | Outside identity; capital-intensive; crowded |
| “AI writes all your cold email” | Commodity GPT wrappers; not stack leverage |
| Bulk ESP / newsletter platform | Contradicts 1:1 thesis; different product |
| Team CRM for SDRs | Wrong ICP; Yesware/Outreach own budget |
| Privacy-first “block all trackers” extension | Opposite job; different users |
| Attachment download tracking as hero | Niche; privacy/legal; weak primary demand |
| Marketplace of freelancers | No relation to Gmail event pipeline |
| Just clone FluidDocs interactive proposals | Heavy editor; different company |
| Crypto/wallet gimmick trackers | No grounding |
| Open-source free forever as sole plan | GPL + no revenue; CWS proprietary issues remain |
| Price at $29+/mo without enterprise features | No evidence of that ARPU in category |
| “AI summarizes every open” | Opens are noise; AI on noise is theater |
| Mobile mail apps first | Stack is Gmail web; out of identity for now |

**Cross-cuts kept as synthesis:** (1)+(2)+(3) = “engagement lifecycle after send”; (4) = GTM path if staying tracker; (5)/(6) = vertical vs CRM-lite expansion; (7) = kill criteria.

---

## Recommendation (orchestrator judgment)

| If you want… | Choose |
|--------------|--------|
| **Highest chance of some paid users soon** | **#4** (anti-branding free + CWS) while building **#2** (link-first identity) |
| **Best product if tracker alone is weak** | **#1** Follow-up coach, with **#3** Proposal workspace as the object model |
| **Clearest beachhead ads** | **#5** Job-seeker radar *or* keep freelancers *only for learning*, not homepage |
| **Biggest upside / biggest build** | **#6** CRM-lite — only after #1 proves people act on suggestions |
| **Honesty if nothing converts** | Pre-commit **#7** kill test: CWS + free no-brand + 90 days → &lt;N paid → stop consumer SaaS |

**Single strongest combo for this repo:**  
**Position as link/reply engagement + follow-up coach (#2 + #1), free no-branding (#4 GTM), optional Proposal object (#3) as v1.5** — not “open tracker for anyone.”

---

## Grounding context

- **Codebase:** `apps/extension` Gmail inject; `apps/web` track routes + dashboard + OAuth; `packages/shared` schemas/notify.  
- **Docs:** `docs/product/packaging.md`, prior product-eval (Confidence Low).  
- **External:** Mailtrack free branding pain; open noise; ghosting discourse; proposal SaaS adjacent.  
- **Topic axes:** Core tracking · Follow-up/ghosting · Proposal lifecycle · Monetization · Adjacent Gmail jobs.  

---

## Status

Open — no idea promoted to requirements yet. Next step: pick 1 survivor → `/ce-brainstorm`.
