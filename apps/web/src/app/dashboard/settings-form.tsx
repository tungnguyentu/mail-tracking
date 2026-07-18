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
  const [saved, setSaved] = useState(false);

  async function save(next: Settings) {
    setSettings(next);
    setSaved(false);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (res.ok) setSaved(true);
  }

  return (
    <div className="card">
      <h2>Settings</h2>
      <label style={{ display: "block", marginBottom: "0.5rem" }}>
        <input
          type="checkbox"
          checked={settings.notificationsEnabled}
          onChange={(e) =>
            save({ ...settings, notificationsEnabled: e.target.checked })
          }
        />{" "}
        Desktop notifications enabled
      </label>
      <p className="muted">
        Default: notify on clicks &amp; replies only (not opens).
      </p>
      {saved && <p className="muted">Saved.</p>}
    </div>
  );
}
