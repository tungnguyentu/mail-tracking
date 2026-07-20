/**
 * Product API / tracking origin.
 * Tracking pixels and click redirects are served from this domain.
 * Override at build time with TRACKPIXL_API_BASE (see scripts/build.mjs).
 */
declare const __TRACKPIXL_API_BASE__: string | undefined;

export const API_BASE = (
  typeof __TRACKPIXL_API_BASE__ !== "undefined" && __TRACKPIXL_API_BASE__
    ? __TRACKPIXL_API_BASE__
    : "http://localhost:3000"
).replace(/\/$/, "");

export const SESSION_COOKIE = "tp_session";
