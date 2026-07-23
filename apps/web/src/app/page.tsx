import Link from "next/link";
import { SiteNav } from "@/components/site-nav";

export default function MarketingPage() {
  return (
    <>
      <SiteNav
        end={
          <Link
            className="btn"
            href="/login"
            style={{
              minHeight: "2.1rem",
              padding: "0.35rem 0.9rem",
              fontSize: "0.85rem",
            }}
          >
            Sign in
          </Link>
        }
      />

      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Gmail · 1:1 email · engagement-first</p>
          <h1>
            They clicked.
            <br />
            They replied.
            <br />
            <em style={{ fontStyle: "italic", color: "var(--ink-soft)" }}>
              The open count can wait.
            </em>
          </h1>
          <p className="lede">
            Know if they engaged — not every proxy pixel fire. TrackPixl is
            engagement-first tracking for anyone who sends important mail from
            Gmail: no forced branding footer, quiet compose chrome, desktop
            alerts for clicks and replies.
          </p>
          <p className="muted" style={{ marginTop: "0.75rem", marginBottom: 0 }}>
            Proposals · client follow-ups · job applications · intros — not
            blast campaigns.
          </p>
          <div className="btn-row">
            <Link className="btn" href="/login">
              Continue with Google
            </Link>
            <Link className="btn secondary" href="/install">
              Install the extension
            </Link>
          </div>
        </div>

        <aside className="signal-card" aria-label="Example engagement signal">
          <div className="signal-card-header">
            <strong>Quiet signal</strong>
            <span
              className="muted"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem" }}
            >
              sample thread
            </span>
          </div>

          <div className="signal-thread">
            <div className="signal-subject">Following up on our conversation</div>
            <div className="signal-meta">to: jordan@example.com · sent 10:14</div>

            <div className="signal-strip" aria-hidden>
              <div className="signal-strip-line" />
              <span className="signal-dot open" style={{ left: "18%" }} />
              <span className="signal-label" style={{ left: "18%" }}>
                open?
              </span>
              <span className="signal-dot open" style={{ left: "34%" }} />
              <span className="signal-dot open" style={{ left: "42%" }} />
              <span className="signal-dot click" style={{ left: "62%" }} />
              <span
                className="signal-label"
                style={{ left: "62%", color: "var(--signal)" }}
              >
                click
              </span>
              <span className="signal-dot reply" style={{ left: "84%" }} />
              <span
                className="signal-label"
                style={{ left: "84%", color: "var(--reply)" }}
              >
                reply
              </span>
            </div>

            <div className="signal-legend">
              <span className="legend-item">
                <span className="legend-swatch reply" /> Reply
              </span>
              <span className="legend-item">
                <span className="legend-swatch click" /> Link click
              </span>
              <span className="legend-item">
                <span className="legend-swatch open" /> Possible open
              </span>
            </div>
          </div>

          <div className="noise-callout">
            <strong>3 “opens”</strong> may be Apple Mail prefetch or a corporate
            proxy, not three reads. We keep them, dimmed. Your next step should
            follow the click and the reply.
          </div>
        </aside>
      </section>

      <section className="feature-grid" aria-label="Product traits">
        <article className="feature">
          <div className="feature-kicker">Professional</div>
          <h3>No forced branding</h3>
          <p>
            Free trackers often stamp “Sent with …” on every mail. We don’t force
            a footer into your signature to track a send.
          </p>
        </article>
        <article className="feature">
          <div className="feature-kicker">Honest signals</div>
          <h3>Clicks & replies first</h3>
          <p>
            Opens are noisy. Desktop notifications default to clicks and replies.
            Possible opens stay secondary — never the hero metric.
          </p>
        </article>
        <article className="feature">
          <div className="feature-kicker">Gmail</div>
          <h3>One quiet toggle</h3>
          <p>
            Sticky track on/off in compose. No dense side panels. Alerts when it
            matters; history lives in your Activity dashboard.
          </p>
        </article>
      </section>

      <section className="band">
        <div>
          <h2>Built for important 1:1 mail, not sequences</h2>
          <p>
            Anyone on Gmail web who needs to know if the other side engaged —
            freelancers, job seekers, founders, recruiters, sales solo, and
            everyone in between. If free trackers felt noisy or unprofessional,
            this is the quieter path.
          </p>
        </div>
        <div className="btn-row">
          <Link className="btn" href="/login">
            Start free
          </Link>
          <Link className="btn secondary" href="/privacy">
            How tracking works
          </Link>
        </div>
      </section>

      <footer className="footer">
        <Link href="/privacy">Privacy</Link>
        <Link href="/install">Install</Link>
        <Link href="/dashboard">Activity</Link>
        <span className="footer-tag">Not an open-rate factory</span>
      </footer>
    </>
  );
}
