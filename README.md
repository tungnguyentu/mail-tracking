# TrackPixl

Engagement-first email tracking for freelancers on **Gmail web**: Chrome MV3 extension + Next.js API/dashboard/marketing.

**Product domain:** [trackpixl.click](https://trackpixl.click)

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
pnpm --filter @trackpixl/shared build
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
pnpm --filter @trackpixl/extension build
```

### Demo path (no token paste)

1. Run web: `pnpm dev:web` (APP_URL / tracking host, default `http://localhost:3000`)
2. Build extension: `TRACKPIXL_API_BASE=http://localhost:3000 pnpm --filter @trackpixl/extension build`
3. Load unpacked `apps/extension/dist` in Chrome
4. Extension popup → **Sign in with TrackPixl** → Demo sign-in (or Google)
5. Popup should show **Connected** (session cookie → silent extension token)
6. Gmail → Track on → send with a link. Open pixel + click URLs use our domain (`APP_URL`)
7. Click link / open mail → Activity dashboard + optional notifications

Production: set `APP_URL=https://trackpixl.click` on the web app and build the extension with the same `TRACKPIXL_API_BASE`.

## Test

```bash
pnpm test
```

## License

Repository currently includes GPL-3.0. Review packaging before a proprietary Chrome Web Store listing (see plan KTD11).

## Plan

See `docs/plans/2026-07-18-001-feat-engagement-first-gmail-tracking-plan.md`.
