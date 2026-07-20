import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { BypassLoginButton } from "./bypass-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const bypass = process.env.AUTH_BYPASS === "1";
  const hasGoogle =
    Boolean(process.env.GOOGLE_CLIENT_ID) &&
    Boolean(process.env.GOOGLE_CLIENT_SECRET);
  const fromExtension = params.from === "extension";
  const next =
    params.next && params.next.startsWith("/") ? params.next : "/dashboard";

  return (
    <>
      <SiteNav
        links={[
          { href: "/", label: "Home" },
          { href: "/privacy", label: "Privacy" },
        ]}
      />

      <div className="auth-panel card">
        <p className="eyebrow">{fromExtension ? "Extension" : "Account"}</p>
        <h1>{fromExtension ? "Sign in for Gmail tracking" : "Sign in to TrackPixl"}</h1>
        <p className="muted" style={{ marginBottom: "1.25rem" }}>
          {fromExtension
            ? "Sign in once in this browser. The extension picks up your session automatically. No API token to paste."
            : "Connect Google so we can attribute engagement on your outbound Gmail and detect replies in tracked threads."}
        </p>

        {params.error && (
          <p className="muted" style={{ color: "var(--danger)", marginBottom: "1rem" }}>
            Sign-in failed ({params.error}). Try again.
          </p>
        )}

        {hasGoogle ? (
          <a
            className="btn"
            href={`/api/auth/google?next=${encodeURIComponent(next)}`}
            style={{ width: "100%" }}
          >
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
            <BypassLoginButton next={next} />
          </>
        )}

        {!fromExtension && (
          <p className="muted" style={{ marginTop: "1.35rem", marginBottom: 0 }}>
            <Link href="/install">Install checklist</Link> after you sign in.
          </p>
        )}
      </div>
    </>
  );
}
