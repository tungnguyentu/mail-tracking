import {
  injectOpenPixel,
  rewriteLinksInHtml,
  type CreateSendResponse,
} from "@mail-tracking/shared";

/** Pure: apply tracking to compose HTML using create-send response. */
export function prepareTrackedBody(
  html: string,
  response: CreateSendResponse,
): string {
  const map = new Map(
    response.links.map((l) => [l.originalUrl, l.trackUrl] as const),
  );
  const rewritten = rewriteLinksInHtml(html, map);
  return injectOpenPixel(rewritten, response.openPixelUrl);
}

/** Extract http(s) hrefs from HTML for create-send. */
export function extractLinks(html: string): string[] {
  const links = new Set<string>();
  const re = /href\s*=\s*["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const href = m[1];
    if (/^https?:\/\//i.test(href) && !/\/t\/[oc]\//i.test(href)) {
      links.add(href);
    }
  }
  return [...links];
}
