import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function InstallPage() {
  return (
    <>
      <SiteNav
        links={[
          { href: "/dashboard", label: "Activity" },
          { href: "/login", label: "Sign in" },
        ]}
      />

      <header className="page-head">
        <p className="eyebrow">Setup</p>
        <h1>From zero to first signal</h1>
        <p className="lede" style={{ marginBottom: 0 }}>
          Four steps. Sign in on our domain, then track from Gmail. No API token
          to paste.
        </p>
      </header>

      <div className="card">
        <ol className="steps">
          <li>
            <h3>Load the extension</h3>
            <p className="muted" style={{ margin: 0 }}>
              Build with{" "}
              <code>pnpm --filter @trackpixl/extension build</code>, then
              Chrome → Developer mode → Load unpacked →{" "}
              <code>apps/extension/dist</code>.
            </p>
          </li>
          <li>
            <h3>Sign in from the extension</h3>
            <p className="muted" style={{ margin: 0 }}>
              Open the TrackPixl popup → <strong>Sign in with TrackPixl</strong>.
              Complete demo or Google sign-in on our site. The extension reads
              your session cookie and connects automatically.
            </p>
          </li>
          <li>
            <h3>Confirm Connected</h3>
            <p className="muted" style={{ margin: 0 }}>
              Popup shows Connected and your email. Use Refresh connection if you
              just signed in.
            </p>
          </li>
          <li>
            <h3>Send with Track on</h3>
            <p className="muted" style={{ margin: 0 }}>
              In Gmail compose, leave Track on and send a message with a link. We
              inject open pixel and click URLs on our domain. Then check{" "}
              <Link href="/dashboard">Activity</Link>.
            </p>
          </li>
        </ol>
      </div>

      <p className="muted" style={{ marginTop: "1.25rem" }}>
        Production: set the same host in web <code>APP_URL</code> and extension{" "}
        <code>TRACKPIXL_API_BASE</code>.
      </p>
    </>
  );
}
