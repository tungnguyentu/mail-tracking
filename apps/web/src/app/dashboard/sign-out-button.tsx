"use client";

export function SignOutButton() {
  return (
    <button
      className="btn secondary"
      type="button"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/";
      }}
    >
      Sign out
    </button>
  );
}
