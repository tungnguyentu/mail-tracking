import { API_BASE } from "./config";

const tracking = document.getElementById("tracking") as HTMLInputElement;
const authPill = document.getElementById("auth-pill") as HTMLElement;
const userEmail = document.getElementById("user-email") as HTMLElement;
const signIn = document.getElementById("sign-in") as HTMLButtonElement;
const signOut = document.getElementById("sign-out") as HTMLButtonElement;
const refresh = document.getElementById("refresh") as HTMLButtonElement;
const authHint = document.getElementById("auth-hint") as HTMLElement;
const apiBaseEl = document.getElementById("api-base") as HTMLElement;

apiBaseEl.textContent = `Tracking host: ${API_BASE}`;

function bg<T>(message: unknown): Promise<T> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => resolve(response as T));
  });
}

async function refreshAuth() {
  authPill.textContent = "Checking…";
  authPill.className = "pill off";
  const auth = await bg<{ signedIn?: boolean; email?: string; error?: string }>({
    type: "SYNC_AUTH",
  });
  const state = await bg<{ signedIn?: boolean; email?: string }>({
    type: "GET_AUTH",
  });
  const signedIn = Boolean(state?.signedIn || auth?.signedIn);
  const email = state?.email || auth?.email;

  if (signedIn && email) {
    authPill.textContent = "Connected";
    authPill.className = "pill on";
    userEmail.textContent = email;
    signIn.hidden = true;
    signOut.hidden = false;
    authHint.textContent =
      "Ready. In Gmail, leave Track on and send. We inject open and click tracking on our domain.";
  } else {
    authPill.textContent = "Not signed in";
    authPill.className = "pill off";
    userEmail.textContent = "";
    signIn.hidden = false;
    signOut.hidden = true;
    authHint.textContent =
      "Sign in on our site once in this browser. We pick up the session automatically.";
  }
}

chrome.runtime.sendMessage({ type: "GET_PREFS" }, (prefs) => {
  tracking.checked = prefs?.trackingEnabled !== false;
});

tracking.addEventListener("change", () => {
  chrome.runtime.sendMessage({
    type: "SET_TRACKING",
    enabled: tracking.checked,
  });
});

signIn.addEventListener("click", () => {
  chrome.runtime.sendMessage({ type: "SIGN_IN" });
});

signOut.addEventListener("click", async () => {
  await bg({ type: "SIGN_OUT" });
  await refreshAuth();
});

refresh.addEventListener("click", () => {
  void refreshAuth();
});

void refreshAuth();

// When user returns from login tab, refresh state
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") void refreshAuth();
});
