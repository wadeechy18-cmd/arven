/**
 * Builds IMAGES.md (the photo checklist for the client) and creates a grey,
 * labelled placeholder JPG for every image that doesn't exist yet.
 *
 *   npm run images
 *
 * It never overwrites an existing file, so real photos are safe. To get a
 * placeholder back, delete the photo and run the command again.
 */
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { images } from "../data/images.ts";
import { PRODUCT_IMAGE_SIZE, products, productImages } from "../data/products.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");

interface Entry {
  src: string;
  width: number;
  height: number;
  usage: string;
  section: string;
}

function ratio(w: number, h: number) {
  const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
  const g = gcd(w, h);
  return `${w / g}:${h / g}`;
}

const entries: Entry[] = [];

for (const img of Object.values(images)) {
  const section = img.src.includes("/about/") ? "About page" : img.src.includes("/promos/") ? "Menu promo tiles" : img.src.includes("/og/") ? "Social sharing" : "Banners";
  entries.push({ ...img, section });
}

const categoryNames: Record<string, string> = { clothing: "Clothing", makeup: "Makeup", "jute-bags": "Jute Bags" };
const photoRole = ["Main photo (shown on product cards and first in the gallery)", "Second photo (shown when hovering a product card)", "Detail / lifestyle photo"];

for (const p of products) {
  productImages(p).forEach((src, i) => {
    entries.push({
      src,
      ...PRODUCT_IMAGE_SIZE,
      usage: `${p.name}: ${photoRole[i] ?? `Extra gallery photo ${i + 1}`}`,
      section: `Products: ${categoryNames[p.category]}`,
    });
  });
}

// ── Placeholders ──
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function placeholderSvg(e: Entry) {
  const { width: w, height: h } = e;
  const base = Math.min(w, h);
  const big = Math.round(base * 0.05);
  const small = Math.round(base * 0.032);
  const file = e.src.split("/").pop()!;
  const folder = e.src.slice(0, e.src.length - file.length);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <rect width="100%" height="100%" fill="#dcd8d1"/>
  <rect x="${base * 0.03}" y="${base * 0.03}" width="${w - base * 0.06}" height="${h - base * 0.06}" fill="none" stroke="#b9b3a9" stroke-width="${Math.max(2, base * 0.004)}" stroke-dasharray="${base * 0.02} ${base * 0.015}"/>
  <g font-family="DejaVu Sans, Helvetica, Arial, sans-serif" text-anchor="middle" fill="#5f5a52">
    <text x="50%" y="${h / 2 - big * 1.6}" font-size="${small}" letter-spacing="${small * 0.2}">PLACEHOLDER</text>
    <text x="50%" y="${h / 2}" font-size="${big}" font-weight="bold" fill="#3d3a35">${esc(file)}</text>
    <text x="50%" y="${h / 2 + big * 1.3}" font-size="${small}">${esc(folder)}</text>
    <text x="50%" y="${h / 2 + big * 2.6}" font-size="${small}">${w} × ${h} px · ${ratio(w, h)}</text>
  </g>
</svg>`;
}

let created = 0;
for (const e of entries) {
  const out = join(publicDir, e.src);
  if (existsSync(out)) continue;
  mkdirSync(dirname(out), { recursive: true });
  await sharp(Buffer.from(placeholderSvg(e))).jpeg({ quality: 70 }).toFile(out);
  created++;
}

// ── IMAGES.md ──
const sections = [...new Set(entries.map((e) => e.section))];
const lines: string[] = [
  "# Daymark image checklist",
  "",
  "Every photo the website needs. Each one is currently a grey placeholder showing its file name and size.",
  "",
  "**To add a real photo:** save it as a `.jpg` with *exactly* the file name below, in the folder shown",
  "(inside `public/`), replacing the placeholder. That's it: no code changes needed.",
  "",
  "**Tips for the photographer / client**",
  "",
  "- Send photos at the recommended size or larger, in the same shape (aspect ratio). They are cropped to fill the space, so keep the subject centred.",
  "- Product photos: portrait 4:5, plain light background for photo 1, on-model or in-use for photo 2.",
  "- Banners: keep the left half (desktop) and the bottom third (mobile) calm, as headline text sits there.",
  "- JPG, under ~1 MB each if possible. The site automatically creates smaller, faster versions for phones.",
  "- If a product has more or fewer photos, change `images:` for that product in `data/products.ts`, then run `npm run images` to update this list.",
  "",
  `**Total: ${entries.length} images.**`,
  "",
];
for (const s of sections) {
  const rows = entries.filter((e) => e.section === s);
  lines.push(`## ${s} (${rows.length})`, "", "| ✓ | File | Where it appears | Recommended size | Ratio |", "|---|---|---|---|---|");
  for (const r of rows) lines.push(`| ☐ | \`public${r.src}\` | ${r.usage} | ${r.width} × ${r.height} px | ${ratio(r.width, r.height)} |`);
  lines.push("");
}
lines.push("_This file is generated by `npm run images` from `data/images.ts` and `data/products.ts`._", "");
writeFileSync(join(root, "IMAGES.md"), lines.join("\n"));

console.log(`IMAGES.md updated (${entries.length} images). Created ${created} new placeholder(s).`);
