"use client";

export function SignOutButton() {
  return (
    <button
      className="btn secondary"
      type="button"
      style={{
        minHeight: "2.1rem",
        padding: "0.35rem 0.9rem",
        fontSize: "0.85rem",
      }}
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
      }}
    >
      Sign out
    </button>
  );
}
