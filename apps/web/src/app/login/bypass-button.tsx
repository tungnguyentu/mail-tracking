"use client";

export function BypassLoginButton() {
  return (
    <button
      className="btn secondary"
      type="button"
      onClick={async () => {
        const res = await fetch("/api/auth/bypass", { method: "POST" });
        if (res.ok) {
          window.location.href = "/dashboard";
        } else {
          alert("Bypass login failed");
        }
      }}
    >
      Demo sign-in
    </button>
  );
}
