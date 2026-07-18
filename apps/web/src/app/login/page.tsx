import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { BypassLoginButton } from "./bypass-button";

export default function LoginPage() {
  const bypass = process.env.AUTH_BYPASS === "1";
  const hasGoogle =
    Boolean(process.env.GOOGLE_CLIENT_ID) &&
    Boolean(process.env.GOOGLE_CLIENT_SECRET);

  return (
    <>
      <SiteNav links={[{ href: "/", label: "Home" }, { href: "/privacy", label: "Privacy" }]} />

      <div className="auth-panel card">
        <p className="eyebrow">Account</p>
        <h1>Sign in to your desk</h1>
        <p className="muted" style={{ marginBottom: "1.25rem" }}>
          Connect Google so we can attribute engagement on your outbound Gmail
          and detect replies in tracked threads.
        </p>

        {hasGoogle ? (
          <a className="btn" href="/api/auth/google" style={{ width: "100%" }}>
            Continue with Google
          </a>
        ) : (
          <p className="muted">
            Google OAuth is not configured. Set{" "}
            <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code>{" "}
            to enable it.
          </p>
        )}

        {bypass && (
          <>
            <div className="auth-divider">local demo</div>
            <p className="muted" style={{ marginBottom: "0.75rem" }}>
              Development bypass is on. Use this only on your machine.
            </p>
            <BypassLoginButton />
          </>
        )}

        <p className="muted" style={{ marginTop: "1.35rem", marginBottom: 0 }}>
          <Link href="/install">Install checklist</Link> after you sign in.
        </p>
      </div>
    </>
  );
}
