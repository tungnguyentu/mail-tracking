import Link from "next/link";

export default function InstallPage() {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="brand">
          MailTrack Quiet
        </Link>
        <Link href="/dashboard">Dashboard</Link>
      </nav>
      <div className="card">
        <h1>Install checklist</h1>
        <ol>
          <li>
            <Link href="/login">Sign in</Link> with Google (or demo bypass in
            dev).
          </li>
          <li>
            Load the Chrome extension from{" "}
            <code>apps/extension/dist</code> (developer mode → Load unpacked)
            after running <code>pnpm --filter @mail-tracking/extension build</code>
            .
          </li>
          <li>
            Open Gmail in Chrome. Use the minimal Track toggle on compose —
            sticky last choice.
          </li>
          <li>
            Send a test email. Click a link from another client; check desktop
            notification and this dashboard.
          </li>
        </ol>
        <p className="muted">
          Chrome Web Store listing is deferred until OAuth verification and
          packaging are ready.
        </p>
      </div>
    </>
  );
}
