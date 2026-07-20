import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
 title: "TrackPixl: engagement-first email tracking",
 description:
 "For freelancers on Gmail: know when clients click and reply, without noisy open-rate chrome.",
 icons: {
 icon: [
 { url: "/favicon.svg", type: "image/svg+xml" },
 { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
 { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
 { url: "/favicon.ico", sizes: "48x48" },
 ],
 apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
 },
 manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
 return (
 // suppressHydrationWarning: browser extensions often inject attributes
 // onto <html>/<body> (e.g. data-yd-*) before React hydrates.
 <html lang="en" suppressHydrationWarning>
 <head>
 <link rel="preconnect" href="https://fonts.googleapis.com" />
 <link
 rel="preconnect"
 href="https://fonts.gstatic.com"
 crossOrigin="anonymous"
 />
 <link
 href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Sora:wght@400;500;600&display=swap"
 rel="stylesheet"
 />
 </head>
 <body suppressHydrationWarning>
 <div className="shell">{children}</div>
 </body>
 </html>
 );
}
