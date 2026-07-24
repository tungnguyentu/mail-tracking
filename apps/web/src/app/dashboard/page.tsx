import Link from "next/link";
import { redirect } from "next/navigation";
import { SiteNav } from "@/components/site-nav";
import { getSessionUserFromCookies } from "@/lib/auth";
import { listSendsForUser } from "@/lib/tracking";
import { SettingsForm } from "./settings-form";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
 const user = await getSessionUserFromCookies();
 if (!user) redirect("/login");

 const sends = await listSendsForUser(user.id);

 return (
 <>
 <SiteNav
 links={[
 { href: "/install", label: "Install" },
 { href: "/", label: "Home" },
 ]}
 end={<SignOutButton />}
 />

 <header className="page-head">
 <p className="eyebrow">Activity</p>
 <h1>What they did</h1>
 <p className="muted">
 Signed in as {user.email}. Clicks and replies lead; possible opens stay
 secondary.
 </p>
 </header>

 <div className="stack-gap">
 <SettingsForm
 initial={{
 notificationsEnabled: user.notificationsEnabled,
 notifyOnOpen: user.notifyOnOpen,
 notifyOnClick: user.notifyOnClick,
 notifyOnReply: user.notifyOnReply,
 notifyOnSilence: user.notifyOnSilence,
 }}
 />

 {sends.length === 0 ? (
 <div className="card empty">
 <h2>No tracked sends yet</h2>
 <p>
 Install the extension, open Gmail, leave Track on, and send
 important 1:1 mail. Engagement will land here, and as desktop
 notifications when it matters.
 </p>
 <Link className="btn" href="/install">
 Open install checklist
 </Link>
 </div>
 ) : (
 <ul className="list card">
 {sends.map((s) => (
 <li key={s.id}>
 <article className="send-row">
 <h3 className="send-subject">
 {s.subject || "(no subject)"}
 </h3>
 <p className="send-meta">
 {s.to.join(", ")}
 <span aria-hidden> · </span>
 <time dateTime={s.createdAt}>
 {new Date(s.createdAt).toLocaleString()}
 </time>
 </p>
 <div className="send-badges">
 {s.replyCount > 0 && (
 <span className="badge primary">
 {s.replyCount} replied
 </span>
 )}
 {s.clickCount > 0 && (
 <span className="badge click">
 {s.clickCount} clicked
 </span>
 )}
 {s.openCount > 0 && (
 <span className="badge noise">
 {s.openCount} possible open
 {s.openCount === 1 ? "" : "s"}
 </span>
 )}
 {s.primarySignal === "none" && (
 <span className="muted">Waiting for a click or reply</span>
 )}
 </div>
 </article>
 </li>
 ))}
 </ul>
 )}
 </div>
 </>
 );
}
