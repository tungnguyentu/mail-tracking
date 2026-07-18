## Residual Review Findings

- **P2** `apps/web/src/lib/gmail-replies.ts` — Reply pipeline exposes matcher + `POST /api/gmail/process-inbound`, but live Gmail `users.watch` + Pub/Sub poller is not wired (requires GCP setup).
- **P2** `apps/extension/src/content.ts` — Gmail inject uses best-effort DOM hooks, not InboxSDK; fragile against Gmail UI changes.
- **P3** `apps/web` — No end-to-end Playwright suite; unit tests cover shared/crypto/notify paths only.
- **P3** `LICENSE` — GPL-3.0 vs commercial packaging still an owner decision before Chrome Web Store public listing.
