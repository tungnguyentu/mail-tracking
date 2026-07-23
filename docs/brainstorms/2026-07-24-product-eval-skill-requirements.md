---
date: 2026-07-24
topic: product-eval-skill
---

# Requirements: Product Evaluation Skill (Evidence-first Gatekeeper)

## Summary

Build an agent skill (`product-eval`) that audits the **product represented by the open repo** against Hiếu Nguyễn’s product-management lenses, **evidence-first**: collect facts (or mark UNKNOWN), then score, then prioritize gaps. The skill exists to interrupt **HiPPO / gut-feel** decisions by making assumptions visible and capping confidence when critical axes lack data.

---

## Problem Frame

Product decisions often lean on authority or intuition rather than market, user, and viability evidence. Notes from Hiếu Nguyễn frame a disciplined path: market sizing and segmentation → persona and primary research → needs prioritization and under-served pain → UX/UI quality → continuous user testing → balance of **User Utility** and **Business Viability** on data and facts.

The operator needs a repeatable audit when a codebase (or its product docs) is already open—not a full PM workshop, not an idea-gate for unbuilt products. Without a structured gate, scorecards can still “look rigorous” while inventing evidence. The failure mode to block is shipping or prioritizing from top-down preference while under-specified pain, research, or viability.

---

## Key Decisions

- **Job = audit existing product, not facilitate full PM flow.** The skill scores and prioritizes gaps; it does not run market workshops or end-to-end discovery facilitation.
- **Primary input = open repo / product in context.** Agent scans codebase, README, docs, and observable UX flows in the working project. Pasted PRDs/links may supplement but are not the default primary path.
- **Approach = Evidence-first Gatekeeper.** Facts and UNKNOWN first; scores only after; assumptions cannot masquerade as facts; overall confidence/grade can be capped when critical axes are assumption-heavy.
- **Output = scorecard + prioritized gaps in chat.** Default is no auto-written history file under `docs/`. Saving a report is a future opt-in, not v1.
- **All eight Hiếu-aligned axes are required.** Org-fit may resolve to **N/A** when the repo has no team-structure signal—do not invent org design.
- **Portable skill (user-level default).** Intended for use across repos (e.g. `~/.grok/skills/product-eval`), not bound only to mail-tracking. Project install is allowed if the operator prefers repo-local sharing.
- **Anti-HiPPO is a first-class outcome.** Explicit assumptions log and evidence flags are mandatory, not optional polish.
- **Language:** Skill instructions default English; user-facing scorecard follows the user’s language when clear (VN or EN).

---

## Actors

- A1. **Operator** — Person who invokes the skill (founder, PM, eng lead). Wants a hard look at the product, not validation theater.
- A2. **Eval agent** — Runs the skill: gathers evidence, scores axes, produces scorecard and gaps.
- A3. **Product under audit** — The product embodied by the open repo (code, docs, UX). Not a third-party competitor as primary subject in v1.

---

## Key Flows

- F1. Invoke and scope
  - **Trigger:** Operator runs `/product-eval` (or equivalent trigger phrases).
  - **Actors:** A1, A2, A3
  - **Steps:** Confirm product identity from repo context; note any operator-supplied focus (whole product vs one surface); refuse to invent a product if context is empty—ask for minimal pointer.
  - **Outcome:** Clear audit subject and optional focus area.

- F2. Evidence collection
  - **Trigger:** Subject is clear.
  - **Actors:** A2, A3
  - **Steps:** Scan for market claims, personas, research notes, need/pain articulation, critical UX paths, UI patterns, testing/feedback signals, utility vs monetization/retention signals, org/ownership signals. Tag each finding as **Fact** (with source) or leave **UNKNOWN**.
  - **Outcome:** Evidence table (or equivalent) before any scores.

- F3. Score and gate
  - **Trigger:** Evidence pass complete (including explicit UNKNOWNs).
  - **Actors:** A2
  - **Steps:** Score each required axis; attach evidence or mark assumption-driven; apply confidence cap when critical axes lack facts; flag HiPPO risk when decisions in repo/docs rest on unstated preference.
  - **Outcome:** Per-axis scores + confidence posture.

- F4. Prioritize gaps
  - **Trigger:** Scoring complete.
  - **Actors:** A2, A1
  - **Steps:** Rank 3–7 gaps by severity × under-served opportunity × evidence strength; recommend next actions that increase evidence or utility/viability, not feature laundry lists.
  - **Outcome:** Actionable prioritized gap list in chat.

---

## Requirements

**Packaging & invocation**

- R1. The skill is installable as a Grok skill named `product-eval` (slash `/product-eval`), with a description that triggers on product audit, product evaluation, scorecard, HiPPO check, and related phrases.
- R2. Default install target is **user scope** so the skill works across projects; project scope is supported when the operator chooses it.
- R3. The skill body is actionable agent instructions (not long-form essay documentation). Supporting rubric detail may live in `references/` if it keeps `SKILL.md` lean.

**Input & subject**

- R4. Default audit subject is the **product in the open workspace** (code, product docs, README, observable UX flows).
- R5. Operator may narrow focus (e.g. one funnel, one persona, one surface); the scorecard must state the scope audited.
- R6. If product identity cannot be inferred, the agent asks one clarifying question before scoring—never fabricates a product thesis to fill the blank.

**Evidence-first discipline**

- R7. The agent collects evidence **before** assigning axis scores.
- R8. Every material claim is labeled **Fact** (with source: file path, doc section, metric, or observed flow) or **Assumption**.
- R9. Missing information is marked **UNKNOWN**, not filled with confident prose.
- R10. An **assumptions log** is always present in the output, even if empty (“none recorded”).
- R11. Critical axes—user understanding, needs/under-served pain, utility × viability—when scored primarily on assumptions trigger a **confidence cap** (overall grade or confidence band cannot be “high” / equivalent top tier).

**Rubric axes (all required)**

- R12. Score each of the following axes (consistent scale, e.g. 1–5, defined in the skill):
  1. **Market** — sizing adequacy and segmentation clarity for the product’s claims
  2. **User understanding** — persona quality and primary-research evidence (interview, shadow, etc.) vs pure hypothesis
  3. **Needs & under-served pain** — needs listed and prioritized; attack on under-served needs vs me-too features
  4. **UX flow efficiency** — critical jobs solvable with minimal steps / friction
  5. **UI clarity & behavioral fit** — clarity, mental-model fit, not aesthetics alone
  6. **Feedback loop / user testing** — real-user testing during build vs ship-then-discover
  7. **Utility × viability** — user usefulness balanced with business sustainability; decisions framed on data/facts
  8. **Org fit (FE/product alignment)** — whether shipping structure keeps UX ownership close to product outcomes; **N/A** when no evidence exists
- R13. For axis 8, when org structure is not observable in-repo, score is **N/A** with a one-line reason—do not invent team topology.
- R14. Each scored axis includes: score (or N/A), 1–3 evidence bullets or UNKNOWN, and a short “what would raise the score” note.

**Anti-HiPPO behavior**

- R15. When product decisions appear preference- or authority-driven without evidence, the output includes explicit **HiPPO / gut-feel risk** flags tied to those decisions.
- R16. Recommendations prefer “get evidence” or “validate under-served need” over “build feature X” when evidence is weak.

**Output shape**

- R17. Default output is **in chat**, structured as:
  - Product under audit + scope
  - Evidence summary (facts vs UNKNOWN)
  - Scorecard (all axes)
  - Assumptions log
  - HiPPO / confidence flags
  - Prioritized gaps (3–7) with suggested next actions
- R18. Output is concise: scorecard and gaps, not a long PRD-style essay by default.
- R19. v1 does **not** auto-write evaluation history files under `docs/` (or similar). Optional “save report” is out of v1 unless added later.
- R20. User-facing narrative follows the operator’s language when clearly Vietnamese or English; skill instruction language remains English.

**Non-behavior**

- R21. The skill does not implement application product features, refactor app code, or open PRs as part of a normal eval run.
- R22. Competitor deep-dives are not the primary mode; competitors may appear only as brief context when evidence in-repo already references them.

---

## Acceptance Examples

- AE1. Assumption cannot pass as fact
  - **Covers:** R8, R9, R10
  - **Given:** Repo has no user interview notes or research docs
  - **When:** Agent scores User understanding
  - **Then:** Score is low or mid with UNKNOWN/assumption labels; assumptions log lists the persona/research gap; no invented “users clearly want X” stated as fact

- AE2. Confidence cap on critical axes
  - **Covers:** R11, R12
  - **Given:** Needs/pain and utility×viability scores rest only on assumptions
  - **When:** Agent produces overall confidence/grade
  - **Then:** Overall confidence is not top-tier; output states that critical axes lack evidence

- AE3. Org-fit N/A without inventing structure
  - **Covers:** R13
  - **Given:** No CODEOWNERS, team docs, or ownership signals about FE vs product
  - **When:** Agent evaluates Org fit
  - **Then:** Axis is N/A with reason; no fictional org chart

- AE4. HiPPO flag when decisions lack evidence
  - **Covers:** R15, R16
  - **Given:** Docs or commits assert priority (“we must build X”) with no linked user/market evidence
  - **When:** Agent finishes scoring
  - **Then:** HiPPO/gut-feel flag references that claim; next actions include evidence-gathering, not only “implement X”

- AE5. Default chat scorecard, no silent file write
  - **Covers:** R17, R18, R19
  - **Given:** Normal `/product-eval` run
  - **When:** Eval completes
  - **Then:** Scorecard + prioritized gaps appear in chat; no new eval markdown is written unless a later opt-in feature is added and requested

- AE6. Empty product context
  - **Covers:** R6
  - **Given:** Workspace has no identifiable product signals
  - **When:** Skill is invoked
  - **Then:** Agent asks one clarifying question before scoring; does not invent a product narrative

---

## Success Criteria

- An operator can run the skill on an open product repo and receive a complete eight-axis (or N/A org) scorecard in one pass.
- A reviewer can tell which scores are fact-backed vs assumption-backed without re-reading the whole repo.
- Weak-evidence products cannot receive an uncritical “healthy” overall posture on critical axes.
- Skill packaging matches create-skill conventions (frontmatter `name` + `description`, actionable body) and is invocable via `/product-eval`.

---

## Scope Boundaries

**In scope (v1)**

- Evidence-first audit skill for open-repo products
- Eight-axis rubric, assumptions log, HiPPO flags, prioritized gaps
- User-level (portable) skill packaging; project-level optional

**Deferred for later**

- Auto-save eval reports and trend comparison across dates
- Idea-gate mode for unbuilt products
- Full PM workshop facilitator (market → research → design → test)
- Competitor-primary research mode
- Optional “save report” flag

**Outside this skill’s identity**

- Application feature development for the audited product
- Replacing human user research (skill evaluates presence/quality of research evidence; it does not invent users)

---

## Dependencies / Assumptions

- Operator has a product-bearing workspace (or can identify one when asked).
- Rubric scale and exact scoring anchors are defined in the skill implementation (planning/build), consistent across runs.
- Hiếu Nguyễn notes are the methodological source for axis definitions; they are not claimed as exclusive product-theory authority beyond this skill’s framing.
- Grok skill layout follows existing create-skill conventions (`SKILL.md`, optional `references/`).

---

## Outstanding Questions

**Deferred to Planning**

- Exact 1–5 (or other) score anchors per axis
- Confidence-cap formula (which axes, what threshold)
- Whether a short `references/rubric.md` is preferred over an all-in-one `SKILL.md`
- Final trigger phrase list in frontmatter `description`

**Resolve Before Planning**

- None.

---

## Sources / Research

- Operator-provided notes from Hiếu Nguyễn on: market sizing & segmentation; persona & user research; needs prioritization & under-served pain; UX/UI; FE alignment with product; continuous user testing; User Utility × Business Viability; data/facts over top-down preference.
- Existing brainstorm in this repo is unrelated product work (`docs/brainstorms/2026-07-18-engagement-first-gmail-tracking-requirements.md`); this skill is methodology tooling, not a mail-tracking feature.
- Skill authoring conventions: Grok `create-skill` workflow (`SKILL.md` frontmatter + body).
