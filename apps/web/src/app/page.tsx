import Link from "next/link";

export default function MarketingPage() {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="brand">
          MailTrack Quiet
        </Link>
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/install">Install</Link>
        <Link href="/privacy">Privacy</Link>
      </nav>

      <section className="hero card">
        <h1>Know if they engaged — not just if a pixel fired</h1>
        <p>
          Engagement-first email tracking for freelancers and consultants on
          Gmail. Lead with <strong>link clicks</strong> and{" "}
          <strong>replies</strong>. Opens stay secondary — because modern mail
          clients make open counts noisy.
        </p>
        <p className="muted">
          Quiet Gmail chrome. Desktop notifications when it matters. No forced
          “tracked with…” footer.
        </p>
        <p style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Link className="btn" href="/login">
            Continue with Google
          </Link>
          <Link className="btn secondary" href="/install">
            Install Chrome extension
          </Link>
        </p>
      </section>

      <section className="card">
        <h2>Built for solo freelancers</h2>
        <ul>
          <li>Sticky track on/off — remembers your last choice</li>
          <li>Minimal compose toggle, quiet thread indicator</li>
          <li>Notifications default on for clicks &amp; replies only</li>
          <li>Dashboard activity without open-rate vanity metrics</li>
        </ul>
      </section>

      <footer className="footer">
        <Link href="/privacy">Privacy</Link> · Not an open-rate factory
      </footer>
    </>
  );
}
