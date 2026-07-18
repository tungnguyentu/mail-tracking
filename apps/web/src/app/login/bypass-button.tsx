"use client";

export function BypassLoginButton() {
  return (
    <button
      className="btn secondary"
      type="button"
      style={{ width: "100%" }}
      onClick={async () => {
        const res = await fetch("/api/auth/bypass", { method: "POST" });
        if (res.ok) {
          window.location.href = "/dashboard";
        } else {
          alert("Demo sign-in failed. Is AUTH_BYPASS enabled?");
        }
      }}
    >
      Demo sign-in
    </button>
  );
}
