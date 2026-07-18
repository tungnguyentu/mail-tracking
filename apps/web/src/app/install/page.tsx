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
 Four steps. Keep Gmail clean; let the extension do the quiet work.
 </p>
 </header>

 <div className="card">
 <ol className="steps">
 <li>
 <h3>Sign in</h3>
 <p className="muted" style={{ margin: 0 }}>
 <Link href="/login">Sign in with Google</Link>
 {process.env.AUTH_BYPASS === "1"
 ? " (or use demo sign-in in local dev)."
 : "."}
 </p>
 </li>
 <li>
 <h3>Load the extension</h3>
 <p className="muted" style={{ margin: 0 }}>
 Build with{" "}
 <code>pnpm --filter @mail-tracking/extension build</code>, then
 Chrome → Developer mode → Load unpacked →{" "}
 <code>apps/extension/dist</code>.
 </p>
 </li>
 <li>
 <h3>Connect the popup</h3>
 <p className="muted" style={{ margin: 0 }}>
 API base <code>http://localhost:3000</code>. Exchange a session for
 a token via <code>POST /api/auth/extension-token</code> and paste it
 into the extension popup.
 </p>
 </li>
 <li>
 <h3>Send with Track on</h3>
 <p className="muted" style={{ margin: 0 }}>
 Compose in Gmail, leave the minimal Track control on, send a test
 with a link. Click it elsewhere, watch the notification and{" "}
 <Link href="/dashboard">Activity</Link>.
 </p>
 </li>
 </ol>
 </div>

 <p className="muted" style={{ marginTop: "1.25rem" }}>
 Chrome Web Store packaging comes later. Sideload is the path for now.
 </p>
 </>
 );
}
