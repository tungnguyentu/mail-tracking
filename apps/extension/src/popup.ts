import { DEFAULT_API_BASE } from "./config";

const tracking = document.getElementById("tracking") as HTMLInputElement;
const token = document.getElementById("token") as HTMLInputElement;
const base = document.getElementById("base") as HTMLInputElement;
const status = document.getElementById("status") as HTMLElement;
const save = document.getElementById("save") as HTMLButtonElement;

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
  },
);

save.addEventListener("click", () => {
  chrome.storage.sync.set(
    {
      trackingEnabled: tracking.checked,
      apiToken: token.value.trim(),
      apiBase: base.value.trim() || DEFAULT_API_BASE,
    },
    () => {
      status.textContent = "Saved.";
    },
  );
});
