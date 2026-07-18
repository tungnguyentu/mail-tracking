import Link from "next/link";
import { redirect } from "next/navigation";
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
      <nav className="nav">
        <Link href="/" className="brand">
          MailTrack Quiet
        </Link>
        <Link href="/install">Install extension</Link>
        <SignOutButton />
      </nav>

      <h1>Activity</h1>
      <p className="muted">
        Signed in as {user.email}. Clicks and replies are primary; opens are
        labeled as noisy.
      </p>

      <SettingsForm
        initial={{
          notificationsEnabled: user.notificationsEnabled,
          notifyOnOpen: user.notifyOnOpen,
          notifyOnClick: user.notifyOnClick,
          notifyOnReply: user.notifyOnReply,
        }}
      />

      {sends.length === 0 ? (
        <div className="card">
          <p>
            No tracked sends yet. Install the extension, open Gmail, and send
            with tracking on.
          </p>
          <Link className="btn" href="/install">
            Install checklist
          </Link>
        </div>
      ) : (
        <ul className="list card">
          {sends.map((s) => (
            <li key={s.id}>
              <div>
                <strong>{s.subject || "(no subject)"}</strong>
                <div className="muted">
                  To: {s.to.join(", ")} ·{" "}
                  {new Date(s.createdAt).toLocaleString()}
                </div>
                <div style={{ marginTop: "0.35rem" }}>
                  {s.replyCount > 0 && (
                    <span className="badge primary">{s.replyCount} replied</span>
                  )}
                  {s.clickCount > 0 && (
                    <span className="badge primary">{s.clickCount} clicked</span>
                  )}
                  {s.openCount > 0 && (
                    <span className="badge secondary">
                      {s.openCount} possible open{s.openCount === 1 ? "" : "s"}{" "}
                      (noisy)
                    </span>
                  )}
                  {s.primarySignal === "none" && (
                    <span className="muted">No engagement yet</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
