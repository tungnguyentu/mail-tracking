/**
 * Gmail compose: Track toggle + inject open pixel / click wrappers on send.
 * All API calls go through the background worker (auth + our domain).
 */
import type { CreateSendRequest, CreateSendResponse } from "@trackpixl/shared";
import { extractLinks, prepareTrackedBody } from "./lib/prepare-body";

const TOGGLE_ID = "mtq-track-toggle";
const STYLE_ID = "mtq-track-styles";

function ensureStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    #${TOGGLE_ID} {
      display: inline-flex;
      align-items: center;
      margin: 2px 8px;
      vertical-align: middle;
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    }
    #${TOGGLE_ID} label {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      cursor: pointer;
      user-select: none;
      padding: 4px 10px 4px 6px;
      border-radius: 999px;
      border: 1px solid #cfd6e2;
      background: #fafbfc;
      color: #3d4654;
      font-size: 12px;
      font-weight: 600;
      letter-spacing: -0.01em;
      line-height: 1;
      box-shadow: 0 1px 0 rgba(255,255,255,0.8) inset;
      transition: border-color 0.15s ease, background 0.15s ease, color 0.15s ease;
    }
    #${TOGGLE_ID} label:hover {
      border-color: #2f4fbf;
      color: #141820;
    }
    #${TOGGLE_ID} input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }
    #${TOGGLE_ID} .mtq-mark {
      width: 16px;
      height: 16px;
      border-radius: 4px;
      background: linear-gradient(145deg, #2f4fbf 0%, #1a6b5c 100%);
      position: relative;
      flex-shrink: 0;
      opacity: 0.35;
      transition: opacity 0.15s ease;
    }
    #${TOGGLE_ID} .mtq-mark::after {
      content: "";
      position: absolute;
      left: 28%;
      right: 28%;
      top: 48%;
      height: 1.5px;
      background: #fff;
      border-radius: 1px;
      box-shadow: 2px -2px 0 0 #fff;
    }
    #${TOGGLE_ID} input:checked + .mtq-mark {
      opacity: 1;
    }
    #${TOGGLE_ID} input:checked ~ .mtq-label-text {
      color: #141820;
    }
    #${TOGGLE_ID} input:focus-visible + .mtq-mark {
      outline: 2px solid #2f4fbf;
      outline-offset: 2px;
    }
    #${TOGGLE_ID} label.is-on {
      border-color: #c5d0f5;
      background: #f3f6fd;
    }
  `;
  document.documentElement.appendChild(style);
}

function bgMessage<T>(message: unknown): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }
      if (response?.error === "NOT_SIGNED_IN") {
        reject(new Error("NOT_SIGNED_IN"));
        return;
      }
      if (response?.error) {
        reject(new Error(String(response.error)));
        return;
      }
      resolve(response as T);
    });
  });
}

function ensureToggle(composeRoot: HTMLElement) {
  if (composeRoot.querySelector(`#${TOGGLE_ID}`)) return;
  ensureStyles();

  const wrap = document.createElement("div");
  wrap.id = TOGGLE_ID;

  const label = document.createElement("label");
  label.title = "Track open and click engagement on this send";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.setAttribute("aria-label", "Track engagement");

  const mark = document.createElement("span");
  mark.className = "mtq-mark";
  mark.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.className = "mtq-label-text";
  text.textContent = "Track";

  const syncOnClass = () => {
    label.classList.toggle("is-on", input.checked);
  };

  chrome.runtime.sendMessage({ type: "GET_PREFS" }, (prefs) => {
    input.checked = prefs?.trackingEnabled !== false;
    syncOnClass();
  });

  input.addEventListener("change", () => {
    syncOnClass();
    chrome.runtime.sendMessage({
      type: "SET_TRACKING",
      enabled: input.checked,
    });
  });

  label.append(input, mark, text);
  wrap.append(label);

  const toolbar =
    composeRoot.querySelector('[role="toolbar"]') ||
    composeRoot.querySelector(".btC") ||
    composeRoot;
  toolbar.appendChild(wrap);
}

function findComposeBodies(): HTMLElement[] {
  return [
    ...document.querySelectorAll<HTMLElement>(
      'div[aria-label="Message Body"][contenteditable="true"], div[g_editable="true"][contenteditable="true"]',
    ),
  ];
}

function findSendButtons(): HTMLElement[] {
  return [
    ...document.querySelectorAll<HTMLElement>(
      'div[role="button"][aria-label*="Send"], div[data-tooltip*="Send"]',
    ),
  ];
}

async function onSendClick(_ev: Event) {
  const prefs = await bgMessage<{ trackingEnabled?: boolean }>({
    type: "GET_PREFS",
  }).catch(() => ({ trackingEnabled: true }));

  if (prefs?.trackingEnabled === false) return;

  const bodyEl = findComposeBodies()[0];
  if (!bodyEl) return;

  const html = bodyEl.innerHTML;
  const links = extractLinks(html);
  const to: string[] = [];
  document
    .querySelectorAll('[name="to"] span[email], .vR span[email]')
    .forEach((el) => {
      const email = el.getAttribute("email");
      if (email) to.push(email);
    });
  if (to.length === 0) to.push("unknown@recipient.local");

  const subjectEl = document.querySelector<HTMLInputElement>(
    'input[name="subjectbox"]',
  );
  const body: CreateSendRequest = {
    subject: subjectEl?.value ?? "",
    to,
    links,
  };

  try {
    const response = await bgMessage<CreateSendResponse>({
      type: "CREATE_SEND",
      body,
    });
    // Inject open pixel + rewrite links to our domain trackers
    bodyEl.innerHTML = prepareTrackedBody(html, response);
    bodyEl.dataset.mtqSendId = response.sendId;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg === "NOT_SIGNED_IN") {
      console.info("[TrackPixl] Sign in via the extension popup to track sends.");
      chrome.runtime.sendMessage({ type: "SIGN_IN" });
      return;
    }
    console.warn("[TrackPixl] tracking failed; sending untracked", e);
  }
}

function wireSendButtons() {
  for (const btn of findSendButtons()) {
    if ((btn as HTMLElement).dataset.mtqWired) continue;
    (btn as HTMLElement).dataset.mtqWired = "1";
    btn.addEventListener("click", onSendClick, true);
  }
}

function scan() {
  for (const body of findComposeBodies()) {
    const root =
      body.closest('div[role="dialog"]') ||
      body.closest(".M9") ||
      body.parentElement ||
      body;
    ensureToggle(root as HTMLElement);
  }
  wireSendButtons();
}

const observer = new MutationObserver(() => scan());
observer.observe(document.documentElement, { childList: true, subtree: true });
scan();
