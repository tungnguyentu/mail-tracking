import * as esbuild from "esbuild";
import {
 cpSync,
 existsSync,
 mkdirSync,
 writeFileSync,
 readFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const dist = join(root, "dist");
const iconsDir = join(root, "icons");

mkdirSync(dist, { recursive: true });

// Copy toolbar / store icons into dist
const iconSizes = [16, 32, 48, 128];
const icons = {};
for (const size of iconSizes) {
 const name = `icon-${size}.png`;
 const src = join(iconsDir, name);
 if (!existsSync(src)) {
 throw new Error(`Missing extension icon: icons/${name}`);
 }
 cpSync(src, join(dist, name));
 icons[String(size)] = name;
}

const manifest = {
 manifest_version: 3,
 name: "MailTrack",
 version: "0.1.0",
 description:
 "Engagement-first Gmail tracking: clicks and replies, quiet UI.",
 icons,
 permissions: ["storage", "alarms", "notifications", "identity"],
 host_permissions: [
 "https://mail.google.com/*",
 "http://localhost:3000/*",
 ],
 background: {
 service_worker: "background.js",
 type: "module",
 },
 content_scripts: [
 {
 matches: ["https://mail.google.com/*"],
 js: ["content.js"],
 run_at: "document_idle",
 },
 ],
 action: {
 default_title: "MailTrack",
 default_popup: "popup.html",
 default_icon: {
 16: "icon-16.png",
 32: "icon-32.png",
 48: "icon-48.png",
 },
 },
};

writeFileSync(join(dist, "manifest.json"), JSON.stringify(manifest, null, 2));
writeFileSync(
 join(dist, "popup.html"),
 readFileSync(join(root, "src/popup.html"), "utf8"),
);

const watch = process.argv.includes("--watch");
const ctx = await esbuild.context({
 entryPoints: {
 background: join(root, "src/background.ts"),
 content: join(root, "src/content.ts"),
 popup: join(root, "src/popup.ts"),
 },
 bundle: true,
 outdir: dist,
 format: "esm",
 platform: "browser",
 target: "chrome120",
 sourcemap: true,
});

if (watch) {
 await ctx.watch();
 console.log("watching extension…");
} else {
 await ctx.rebuild();
 await ctx.dispose();
 console.log("extension built → dist/");
}
