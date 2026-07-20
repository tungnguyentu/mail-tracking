import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function ExtensionConnectedPage() {
  return (
    <>
      <SiteNav
        links={[
          { href: "/dashboard", label: "Activity" },
          { href: "/install", label: "Install" },
        ]}
      />
      <div className="auth-panel card">
        <p className="eyebrow">Extension</p>
        <h1>You are connected</h1>
        <p className="muted" style={{ marginBottom: "1.25rem" }}>
          Close this tab and return to Gmail. Open the TrackPixl popup and click
          Refresh connection if needed. When Track is on, we inject open and
          click tracking from our domain on send.
        </p>
        <div className="btn-row">
          <Link className="btn" href="/dashboard">
            Open activity
          </Link>
          <Link className="btn secondary" href="https://mail.google.com" target="_blank">
            Open Gmail
          </Link>
        </div>
      </div>
    </>
  );
}
