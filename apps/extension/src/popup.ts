import { DEFAULT_API_BASE } from "./config";

const tracking = document.getElementById("tracking") as HTMLInputElement;
const token = document.getElementById("token") as HTMLInputElement;
const base = document.getElementById("base") as HTMLInputElement;
const status = document.getElementById("status") as HTMLElement;
const save = document.getElementById("save") as HTMLButtonElement;
const dashLink = document.getElementById("open-dashboard") as HTMLAnchorElement;

function setStatus(message: string, kind: "ok" | "error" | "" = "") {
 status.textContent = message;
 status.classList.remove("is-ok", "is-error");
 if (kind === "ok") status.classList.add("is-ok");
 if (kind === "error") status.classList.add("is-error");
}

function syncDashboardHref(apiBase: string) {
 const root = (apiBase || DEFAULT_API_BASE).replace(/\/$/, "");
 dashLink.href = `${root}/dashboard`;
}

chrome.storage.sync.get(
 {
 trackingEnabled: true,
 apiToken: "",
 apiBase: DEFAULT_API_BASE,
 },
 (data) => {
 tracking.checked = data.trackingEnabled !== false;
 token.value = data.apiToken || "";
 base.value = data.apiBase || DEFAULT_API_BASE;
 syncDashboardHref(base.value);
 },
);

base.addEventListener("change", () => {
 syncDashboardHref(base.value.trim() || DEFAULT_API_BASE);
});

save.addEventListener("click", () => {
 const apiBase = base.value.trim() || DEFAULT_API_BASE;
 const apiToken = token.value.trim();

 if (!apiBase.startsWith("http://") && !apiBase.startsWith("https://")) {
 setStatus("API base must start with http:// or https://", "error");
 return;
 }

 chrome.storage.sync.set(
 {
 trackingEnabled: tracking.checked,
 apiToken,
 apiBase,
 },
 () => {
 syncDashboardHref(apiBase);
 if (!apiToken) {
 setStatus("Saved. Add an API token to track sends.", "error");
 return;
 }
 setStatus("Saved.", "ok");
 },
 );
});
