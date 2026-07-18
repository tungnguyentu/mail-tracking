"use client";

import { useState } from "react";

type Settings = {
  notificationsEnabled: boolean;
  notifyOnOpen: boolean;
  notifyOnClick: boolean;
  notifyOnReply: boolean;
};

export function SettingsForm({ initial }: { initial: Settings }) {
  const [settings, setSettings] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  async function save(next: Settings) {
    setSettings(next);
    setStatus("idle");
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    setStatus(res.ok ? "saved" : "error");
  }

  return (
    <div className="card">
      <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>
        Notifications
      </p>
      <h2 style={{ fontSize: "1.25rem", marginBottom: "0.85rem" }}>
        When to interrupt you
      </h2>
      <label className="field">
        <input
          type="checkbox"
          checked={settings.notificationsEnabled}
          onChange={(e) =>
            save({ ...settings, notificationsEnabled: e.target.checked })
          }
        />
        <span>
          Desktop notifications on
          <br />
          <span className="muted">
            Defaults still favor clicks and replies over opens.
          </span>
        </span>
      </label>
      {status === "saved" && (
        <p className="muted" style={{ margin: "0.75rem 0 0" }}>
          Saved.
        </p>
      )}
      {status === "error" && (
        <p className="muted" style={{ margin: "0.75rem 0 0", color: "var(--danger)" }}>
          Couldn’t save. Try again.
        </p>
      )}
    </div>
  );
}
