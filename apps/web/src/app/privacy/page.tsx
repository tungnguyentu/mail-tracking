import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function PrivacyPage() {
 return (
 <>
 <SiteNav
 links={[
 { href: "/", label: "Home" },
 { href: "/login", label: "Sign in" },
 ]}
 />

 <header className="page-head">
 <p className="eyebrow">Privacy</p>
 <h1>What we process, and what we don’t</h1>
 <p className="lede">
 Tracking only applies when you turn it on for a send. Recipients never
 install anything.
 </p>
 </header>

 <div className="card stack-gap" style={{ gap: "1.25rem" }}>
 <div>
 <h3>Replies</h3>
 <p className="muted" style={{ margin: 0 }}>
 Primary signal. Detected from your Gmail thread (with your
 authorization) when someone answers a tracked send.
 </p>
 </div>
 <div>
 <h3>Link clicks</h3>
 <p className="muted" style={{ margin: 0 }}>
 Primary signal. Links are rewritten through our redirect so we can
 attribute the click to that send.
 </p>
 </div>
 <div>
 <h3>Possible opens</h3>
 <p className="muted" style={{ margin: 0 }}>
 Secondary and noisy. A 1×1 image request may fire from privacy
 proxies or prefetches without a real human reading the mail. We show
 them without treating them as ground truth.
 </p>
 </div>
 <div>
 <h3>What we don’t do</h3>
 <p className="muted" style={{ margin: 0 }}>
 We don’t sell recipient profiles or require software on the other
 side of the thread. Full legal review of this notice is still
 deferred.
 </p>
 </div>
 </div>

 <p style={{ marginTop: "1.5rem" }}>
 <Link className="btn secondary" href="/">
 Back home
 </Link>
 </p>
 </>
 );
}
