"use client";

export function BypassLoginButton({ next = "/dashboard" }: { next?: string }) {
  return (
    <button
      className="btn secondary"
      type="button"
      style={{ width: "100%" }}
      onClick={async () => {
        const res = await fetch("/api/auth/bypass", { method: "POST" });
        if (res.ok) {
          window.location.href = next.startsWith("/") ? next : "/dashboard";
        } else {
          alert("Demo sign-in failed. Is AUTH_BYPASS enabled?");
        }
      }}
    >
      Demo sign-in
    </button>
  );
}
