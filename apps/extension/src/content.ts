/**
 * Minimal Gmail compose tracking UI.
 * Gmail DOM is fragile — pure inject lives in shared; this layer is best-effort.
 */
import { createSend } from "./lib/api";
import { extractLinks, prepareTrackedBody } from "./lib/prepare-body";

const TOGGLE_ID = "mtq-track-toggle";

function ensureToggle(composeRoot: HTMLElement) {
  if (composeRoot.querySelector(`#${TOGGLE_ID}`)) return;

  const wrap = document.createElement("div");
  wrap.id = TOGGLE_ID;
  wrap.style.cssText =
    "display:inline-flex;align-items:center;gap:6px;margin:4px 8px;font:12px system-ui;color:#5f6368;";

  const label = document.createElement("label");
  label.style.cssText = "display:inline-flex;align-items:center;gap:4px;cursor:pointer;";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.title = "Track engagement (sticky)";

  chrome.runtime.sendMessage({ type: "GET_PREFS" }, (prefs) => {
    input.checked = prefs?.trackingEnabled !== false;
  });

  input.addEventListener("change", () => {
    chrome.runtime.sendMessage({
      type: "SET_TRACKING",
      enabled: input.checked,
    });
  });

  label.append(input, document.createTextNode("Track"));
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

async function onSendClick(ev: Event) {
  const prefs = await new Promise<{ trackingEnabled?: boolean; apiToken?: string }>(
    (resolve) => {
      chrome.runtime.sendMessage({ type: "GET_PREFS" }, resolve);
    },
  );
  if (prefs?.trackingEnabled === false) return;
  if (!prefs?.apiToken) {
    console.info("[MailTrack Quiet] Sign in / set API token to track sends.");
    return;
  }

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

  try {
    const subjectEl = document.querySelector<HTMLInputElement>(
      'input[name="subjectbox"]',
    );
    const response = await createSend({
      subject: subjectEl?.value ?? "",
      to,
      links,
    });
    bodyEl.innerHTML = prepareTrackedBody(html, response);
    // Best-effort: confirm without Gmail thread id (reply matching improves when confirmed later)
    // leave sendId on body for potential future hooks
    bodyEl.dataset.mtqSendId = response.sendId;
  } catch (e) {
    // Fail open: allow untracked send (plan: prefer untracked over blocking mail)
    console.warn("[MailTrack Quiet] tracking failed; sending untracked", e);
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
