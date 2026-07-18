import Link from "next/link";

export default function PrivacyPage() {
  return (
    <>
      <nav className="nav">
        <Link href="/" className="brand">
          MailTrack Quiet
        </Link>
      </nav>
      <div className="card">
        <h1>Privacy</h1>
        <p>
          When you enable tracking on a send, we process engagement signals for{" "}
          <strong>your</strong> outbound Gmail messages:
        </p>
        <ul>
          <li>
            <strong>Opens</strong> — a 1×1 image request (noisy; may fire via
            privacy proxies without a real human open)
          </li>
          <li>
            <strong>Clicks</strong> — when a recipient follows a rewritten link
          </li>
          <li>
            <strong>Replies</strong> — when Gmail reports a reply in a tracked
            thread (with your authorization)
          </li>
        </ul>
        <p>
          Recipients never install software. We do not sell recipient profiles.
          Full legal review of this notice is deferred.
        </p>
      </div>
    </>
  );
}
