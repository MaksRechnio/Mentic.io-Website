/**
 * Build the "What is Mentic" Instagram highlight cover.
 * Output: 1080×1920 PNG (story size) with the brand-mark centered in the
 * highlight-circle safe area, on the ceramic + coral/mint gradient backdrop.
 */
import sharp from "sharp";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const W = 1080;
const H = 1920;

// Brand palette
const CERAMIC = "#f2f2f0";
const TEAL = "#003c46";
const CORAL = "#ff6b5c";
const MINT = "#8bf2d3";

// SVG backdrop: ceramic field with a coral blob top-left and a mint blob
// bottom-right (soft, blurred), a faint center vignette for depth, and a
// small wordmark + label below the safe-circle for context when the cover
// is viewed at full-story size (the wordmark falls outside the highlight
// crop but reads when used as a story slide too).
const backdropSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="coral" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${CORAL}" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="${CORAL}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="${CORAL}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="mint" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${MINT}" stop-opacity="0.7"/>
      <stop offset="55%" stop-color="${MINT}" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="${MINT}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="48%" r="55%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="40"/>
    </filter>
  </defs>

  <!-- Ceramic field -->
  <rect width="${W}" height="${H}" fill="${CERAMIC}"/>

  <!-- Soft corner blobs -->
  <g filter="url(#soft)">
    <circle cx="160" cy="220" r="520" fill="url(#coral)"/>
    <circle cx="${W - 120}" cy="${H - 260}" r="600" fill="url(#mint)"/>
  </g>

  <!-- Center vignette to lift the icon -->
  <circle cx="${W / 2}" cy="${H / 2 - 80}" r="540" fill="url(#vignette)"/>

  <!-- Subtle safe-circle guide ring (very faint; helps composition read as
       intentional when viewed full-story). -->
  <circle cx="${W / 2}" cy="${H / 2 - 80}" r="380"
          fill="none" stroke="${TEAL}" stroke-opacity="0.06" stroke-width="2"/>

  <!-- Label group BELOW the highlight-circle crop area (only visible when
       the file is used at full-story size, never appears in the round cover) -->
  <g font-family="'Nunito Sans', system-ui, -apple-system, sans-serif"
     text-anchor="middle" fill="${TEAL}">
    <text x="${W / 2}" y="${H - 320}"
          font-size="56" font-weight="800" letter-spacing="14">
      WHAT IS MENTIC?
    </text>
    <text x="${W / 2}" y="${H - 240}"
          font-size="28" font-weight="300" letter-spacing="6"
          fill="${TEAL}" fill-opacity="0.55">
      THE AUTONOMOUS AI ADVERTISER
    </text>
  </g>
</svg>
`;

async function build() {
  const outDir = path.join(ROOT, "public", "social");
  await mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, "ig-highlight-what-is-mentic.png");

  // Center the icon at (540, 880) — sits just above the visual midline so
  // the highlight-circle crop (centered at the story midpoint) frames it.
  const ICON_SIZE = 520;
  const iconPng = await readFile(path.join(ROOT, "public", "images", "mentic-icon-orange.png"));
  const iconResized = await sharp(iconPng)
    .resize(ICON_SIZE, ICON_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const iconLeft = Math.round((W - ICON_SIZE) / 2);
  const iconTop = Math.round(H / 2 - ICON_SIZE / 2 - 80);

  const out = await sharp(Buffer.from(backdropSvg))
    .composite([{ input: iconResized, left: iconLeft, top: iconTop }])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(outPath, out);
  console.log(`Wrote ${outPath} (${out.length.toLocaleString()} bytes)`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
