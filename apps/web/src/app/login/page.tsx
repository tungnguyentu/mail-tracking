import Link from "next/link";
import { BypassLoginButton } from "./bypass-button";

export default function LoginPage() {
  const bypass = process.env.AUTH_BYPASS === "1";
  const hasGoogle =
    Boolean(process.env.GOOGLE_CLIENT_ID) &&
    Boolean(process.env.GOOGLE_CLIENT_SECRET);

  return (
    <>
      <nav className="nav">
        <Link href="/" className="brand">
          MailTrack Quiet
        </Link>
      </nav>
      <div className="card" style={{ maxWidth: 420 }}>
        <h1>Sign in</h1>
        <p className="muted">
          Use Google to connect your Gmail account for tracking and reply
          detection.
        </p>
        {hasGoogle ? (
          <a className="btn" href="/api/auth/google">
            Continue with Google
          </a>
        ) : (
          <p className="muted">
            Google OAuth is not configured yet. Set{" "}
            <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code>.
          </p>
        )}
        {bypass && (
          <div style={{ marginTop: "1rem" }}>
            <p className="muted">Dev bypass enabled (AUTH_BYPASS=1)</p>
            <BypassLoginButton />
          </div>
        )}
      </div>
    </>
  );
}
