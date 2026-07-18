const ALREADY_TRACKED = /\/t\/[oc]\//i;

export function isTrackableHref(href: string): boolean {
  if (!href || href.startsWith("mailto:") || href.startsWith("#")) return false;
  if (href.startsWith("javascript:")) return false;
  if (ALREADY_TRACKED.test(href)) return false;
  try {
    const u = new URL(href, "https://example.invalid");
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Rewrite http(s) anchors to tracked URLs using a map of original → track URL.
 * Only rewrites exact attribute matches for known originals.
 */
export function rewriteLinksInHtml(
  html: string,
  linkMap: Map<string, string>,
): string {
  if (linkMap.size === 0) return html;
  return html.replace(
    /(<a\b[^>]*\bhref\s*=\s*)(["'])([^"']+)\2/gi,
    (full, prefix: string, quote: string, href: string) => {
      if (!isTrackableHref(href)) return full;
      const tracked = linkMap.get(href) ?? linkMap.get(normalizeUrl(href));
      if (!tracked) return full;
      return `${prefix}${quote}${tracked}${quote}`;
    },
  );
}

function normalizeUrl(href: string): string {
  try {
    return new URL(href).toString();
  } catch {
    return href;
  }
}

/** Append a single hidden open-tracking pixel if not already present. */
export function injectOpenPixel(html: string, openPixelUrl: string): string {
  if (html.includes(openPixelUrl)) return html;
  const pixel = `<img src="${openPixelUrl}" width="1" height="1" alt="" style="display:none!important;width:1px;height:1px;border:0;" />`;
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${pixel}</body>`);
  }
  return `${html}${pixel}`;
}
