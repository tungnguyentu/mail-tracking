# MailTrack Quiet

Engagement-first email tracking for freelancers on **Gmail web**: Chrome MV3 extension + Next.js API/dashboard/marketing.

Clicks and replies are primary signals. Opens are secondary (noisy). Gmail UI stays minimal; desktop notifications carry the alert.

## Monorepo

```text
apps/web         Next.js (marketing, dashboard, API, open/click trackers)
apps/extension   Chrome MV3 extension
packages/shared  Shared Zod schemas + inject/reply/notification helpers
docs/            Brainstorm + plan
```

## Prerequisites

- Node 20+
- pnpm 10+

## Setup

```bash
pnpm install
pnpm --filter @mail-tracking/shared build
cd apps/web && pnpm exec prisma db push && cd ../..
```

Copy env (already seeded for local demo):

- `apps/web/.env` — `DATABASE_URL`, `AUTH_BYPASS=1` for demo login without Google
- Set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` for real OAuth + Gmail reply scopes

## Develop

```bash
# API + dashboard + marketing
pnpm dev:web

# Extension → apps/extension/dist (Load unpacked in chrome://extensions)
pnpm --filter @mail-tracking/extension build
```

### Demo path

1. Open http://localhost:3000 → **Continue with Google** → **Demo sign-in**
2. Dashboard → install checklist
3. `POST /api/auth/extension-token` while logged in (or use browser session cookie exchange from DevTools)
4. Paste API token into extension popup
5. Gmail compose → Track toggle → send; open/click via `/t/o/:token` and `/t/c/:token`

## Test

```bash
pnpm test
```

## License

Repository currently includes GPL-3.0. Review packaging before a proprietary Chrome Web Store listing (see plan KTD11).

## Plan

See `docs/plans/2026-07-18-001-feat-engagement-first-gmail-tracking-plan.md`.
