# Mentic Email Signature Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate one ready-to-paste Gmail signature HTML file per Mentic team member from a committed roster, with headshots and logo hosted on mentic.io.

**Architecture:** A dependency-free Node script (`scripts/signatures/generate.mjs`) reads `roster.json` (people + global CTA) and writes one self-contained instruction page per person to `scripts/signatures/output/`. Headshots are square 288×288 JPEGs in `public/team/`, served by the deployed Next.js site. The signature block is a table with all styles inline (Gmail strips everything else).

**Tech Stack:** Node ≥18 (built-in `node:test`), macOS `sips` for photo processing. No npm dependencies.

## Global Constraints

- Repo: `/Users/maksrechnio/mentic.io-coding/Mentic.io-Website`, branch `main`.
- Target client is Gmail only: table layout, inline styles only, no `<style>` blocks/classes/web fonts inside the signature block.
- All signature image URLs absolute on `https://mentic.io` (`baseUrl` from roster).
- Brand colors (from `src/app/globals.css`): coral `#ff6b5c` (links), dark-teal `#003c46` (name, CTA background), off-white `#faf9f6` (CTA text).
- Font stack inside signature: `'Nunito Sans',Helvetica,Arial,sans-serif`.
- Logo URL: `https://mentic.io/images/logo.png` (already deployed, 913×264 transparent PNG), rendered at height 20.
- CTA: text `Book a demo →`, URL `https://calendly.com/maksymilian-mentic/mentic-io-demo-onboarding-meeting`.
- People: Maksymilian Rechnio / Co-Founder & CEO / maksymilian@mentic.io / slug `maksymilian`; Bo Bredenbruecher / Co-Founder & COO / bo@mentic.io / slug `bo`. No phone numbers.
- Source photos on Desktop are never modified in place; all processing writes to new files.
- Script must exit non-zero with a clear message on malformed/missing roster data or a missing headshot file.
- Commit messages end with the Claude Code trailer used in this session.

---

### Task 1: Headshots in `public/team/`

**Files:**
- Create: `public/team/maksymilian.jpg` (288×288 square)
- Create: `public/team/bo.jpg` (288×288 square)

**Interfaces:**
- Consumes: `~/Desktop/mentic.io/maksRechnio-picture.jpeg` (4032×3024, stored landscape — needs 90° CW rotation), `~/Desktop/mentic.io/boBredenbruecher-picture.JPG` (1536×2304 portrait).
- Produces: `public/team/maksymilian.jpg`, `public/team/bo.jpg` — referenced by roster `photo` fields in Task 2.

This task is visual-iterative: run the crop, **Read the output image**, adjust offsets until the face is centered with headroom, then downsize. Work in the scratchpad; only final 288×288 files land in `public/team/`.

- [ ] **Step 1: Prepare working copies**

```bash
SCRATCH=/private/tmp/claude-501/-Users-maksrechnio/a3d193f4-0b9d-40e7-9463-5e2235a0273c/scratchpad
mkdir -p "$SCRATCH/sig-photos" ~/mentic.io-coding/Mentic.io-Website/public/team
cp ~/Desktop/mentic.io/maksRechnio-picture.jpeg "$SCRATCH/sig-photos/maks-src.jpg"
cp ~/Desktop/mentic.io/boBredenbruecher-picture.JPG "$SCRATCH/sig-photos/bo-src.jpg"
sips -r 90 "$SCRATCH/sig-photos/maks-src.jpg"   # landscape → portrait 3024×4032
```

- [ ] **Step 2: Crop Maks square around the face (iterate)**

Starting guess — face ≈ (x 1500, y 1600) in the 3024×4032 portrait; crop 1800×1800 with face at ~40% height:

```bash
sips -c 1800 1800 --cropOffset 880 600 "$SCRATCH/sig-photos/maks-src.jpg" --out "$SCRATCH/sig-photos/maks-crop.jpg"
```

Read `maks-crop.jpg`. If the face is off-center or clipped, adjust `--cropOffset <y> <x>` (and crop size if too tight/loose) and rerun until the face sits centered horizontally, eyes around the upper 40% line. If `--cropOffset` is unsupported on this sips build, fall back to a one-liner with Python + PIL from the system python3 (`python3 -m pip install --user pillow` only if PIL missing).

- [ ] **Step 3: Crop Bo square around the face (iterate)**

Starting guess — face ≈ (x 720, y 970) in 1536×2304; crop 1000×1000:

```bash
sips -c 1000 1000 --cropOffset 570 220 "$SCRATCH/sig-photos/bo-src.jpg" --out "$SCRATCH/sig-photos/bo-crop.jpg"
```

Read and iterate as in Step 2.

- [ ] **Step 4: Resize both to 288×288 and place in public/team**

```bash
sips -z 288 288 "$SCRATCH/sig-photos/maks-crop.jpg" --out ~/mentic.io-coding/Mentic.io-Website/public/team/maksymilian.jpg
sips -z 288 288 "$SCRATCH/sig-photos/bo-crop.jpg" --out ~/mentic.io-coding/Mentic.io-Website/public/team/bo.jpg
```

Read both final files to confirm they look like clean headshots at small size.

- [ ] **Step 5: Commit**

```bash
cd ~/mentic.io-coding/Mentic.io-Website
git add public/team/maksymilian.jpg public/team/bo.jpg
git commit -m "feat: add team headshots for email signatures"
```

---

### Task 2: Roster + generator with tests

**Files:**
- Create: `scripts/signatures/roster.json`
- Create: `scripts/signatures/generate.mjs`
- Test: `scripts/signatures/generate.test.mjs`

**Interfaces:**
- Consumes: `public/team/<slug>.jpg` from Task 1.
- Produces: exports `validateRoster(roster)` (throws `Error` with descriptive message), `renderSignature(person, roster)` → signature-table HTML string, `renderPage(person, roster)` → full instruction-page HTML string; CLI entrypoint writes `scripts/signatures/output/<slug>.html`.

- [ ] **Step 1: Write roster.json**

```json
{
  "baseUrl": "https://mentic.io",
  "logoPath": "/images/logo.png",
  "cta": {
    "text": "Book a demo →",
    "url": "https://calendly.com/maksymilian-mentic/mentic-io-demo-onboarding-meeting"
  },
  "people": [
    {
      "slug": "maksymilian",
      "name": "Maksymilian Rechnio",
      "title": "Co-Founder & CEO",
      "email": "maksymilian@mentic.io",
      "photo": "/team/maksymilian.jpg"
    },
    {
      "slug": "bo",
      "name": "Bo Bredenbruecher",
      "title": "Co-Founder & COO",
      "email": "bo@mentic.io",
      "photo": "/team/bo.jpg"
    }
  ]
}
```

- [ ] **Step 2: Write the failing tests** (`scripts/signatures/generate.test.mjs`)

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateRoster, renderSignature, renderPage } from './generate.mjs';

const roster = {
  baseUrl: 'https://mentic.io',
  logoPath: '/images/logo.png',
  cta: { text: 'Book a demo →', url: 'https://example.com/cal' },
  people: [{
    slug: 'maksymilian',
    name: 'Maksymilian Rechnio',
    title: 'Co-Founder & CEO',
    email: 'maksymilian@mentic.io',
    photo: '/team/maksymilian.jpg',
  }],
};
const person = roster.people[0];

test('renderSignature contains headshot, name, escaped title, links, logo, CTA', () => {
  const html = renderSignature(person, roster);
  assert.match(html, /https:\/\/mentic\.io\/team\/maksymilian\.jpg/);
  assert.match(html, /Maksymilian Rechnio/);
  assert.match(html, /Co-Founder &amp; CEO/);
  assert.match(html, /mailto:maksymilian@mentic\.io/);
  assert.match(html, /https:\/\/mentic\.io\/images\/logo\.png/);
  assert.match(html, /https:\/\/example\.com\/cal/);
  assert.match(html, /Book a demo →/);
});

test('renderSignature uses only inline styles (no style/class attributes leakage)', () => {
  const html = renderSignature(person, roster);
  assert.doesNotMatch(html, /<style/i);
  assert.doesNotMatch(html, /class=/i);
});

test('renderSignature renders phone row only when phone present', () => {
  const noPhone = renderSignature(person, roster);
  assert.doesNotMatch(noPhone, /tel:/);
  const withPhone = renderSignature({ ...person, phone: '+1 415 555 0100' }, roster);
  assert.match(withPhone, /\+1 415 555 0100/);
});

test('renderPage wraps signature with paste instructions', () => {
  const html = renderPage(person, roster);
  assert.match(html, /Gmail/);
  assert.match(html, /Maksymilian Rechnio/);
});

test('validateRoster throws on missing fields', () => {
  assert.throws(() => validateRoster({ ...roster, people: [{ slug: 'x' }] }), /missing/i);
  assert.throws(() => validateRoster({ ...roster, cta: {} }), /cta/i);
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd ~/mentic.io-coding/Mentic.io-Website && node --test scripts/signatures/`
Expected: FAIL — `Cannot find module './generate.mjs'`

- [ ] **Step 4: Write generate.mjs**

```js
#!/usr/bin/env node
// Generates one paste-into-Gmail signature page per person in roster.json.
// Gmail-safe: table layout, every style inline, absolute image URLs.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

const COLORS = {
  ink: '#003c46',
  link: '#ff6b5c',
  muted: '#5f6b6d',
  dot: '#9aa5a6',
  ctaText: '#faf9f6',
};
const FONT = "'Nunito Sans',Helvetica,Arial,sans-serif";

function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function validateRoster(roster) {
  for (const key of ['baseUrl', 'logoPath', 'cta', 'people']) {
    if (!roster?.[key]) throw new Error(`roster.json: missing "${key}"`);
  }
  if (!roster.cta.text || !roster.cta.url) {
    throw new Error('roster.json: cta needs "text" and "url"');
  }
  for (const p of roster.people) {
    for (const key of ['slug', 'name', 'title', 'email', 'photo']) {
      if (!p[key]) throw new Error(`roster.json: person "${p.slug ?? p.name ?? '?'}" missing "${key}"`);
    }
  }
}

export function renderSignature(person, roster) {
  const url = (path) => roster.baseUrl + path;
  const phoneRow = person.phone
    ? `<span style="color:${COLORS.dot};">&nbsp;&middot;&nbsp;</span><a href="tel:${esc(person.phone.replaceAll(' ', ''))}" style="color:${COLORS.link};text-decoration:none;">${esc(person.phone)}</a>`
    : '';
  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family:${FONT};">
<tbody>
<tr>
<td style="padding-right:14px;vertical-align:middle;"><img src="${url(person.photo)}" width="72" height="72" alt="${esc(person.name)}" style="display:block;border-radius:50%;"></td>
<td style="vertical-align:middle;">
<div style="font-size:16px;font-weight:700;color:${COLORS.ink};line-height:1.3;">${esc(person.name)}</div>
<div style="font-size:13px;color:${COLORS.muted};line-height:1.4;">${esc(person.title)}</div>
<div style="font-size:13px;line-height:1.6;padding-top:4px;"><a href="${roster.baseUrl}" style="color:${COLORS.link};text-decoration:none;">mentic.io</a><span style="color:${COLORS.dot};">&nbsp;&middot;&nbsp;</span><a href="mailto:${esc(person.email)}" style="color:${COLORS.link};text-decoration:none;">${esc(person.email)}</a>${phoneRow}</div>
</td>
</tr>
<tr><td colspan="2" style="padding-top:14px;"><img src="${url(roster.logoPath)}" alt="Mentic" height="20" style="display:block;height:20px;width:auto;"></td></tr>
<tr><td colspan="2" style="padding-top:10px;"><a href="${esc(roster.cta.url)}" style="display:inline-block;background-color:${COLORS.ink};color:${COLORS.ctaText};font-family:${FONT};font-size:13px;font-weight:700;text-decoration:none;padding:8px 16px;border-radius:6px;">${esc(roster.cta.text)}</a></td></tr>
</tbody>
</table>`;
}

export function renderPage(person, roster) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Mentic signature — ${esc(person.name)}</title>
</head>
<body style="margin:0;padding:32px;font-family:${FONT};background:#faf9f6;color:#003c46;">
<div style="max-width:560px;margin:0 auto;">
<h1 style="font-size:18px;">Your Mentic email signature</h1>
<ol style="font-size:14px;line-height:1.7;">
<li>Select the whole signature in the box below (click just before the photo, then <b>shift-click</b> after the “Book a demo” button) and press <b>Cmd/Ctrl-C</b> to copy.</li>
<li>Open <b>Gmail → Settings (gear) → See all settings → General → Signature</b>.</li>
<li>Create a signature named “Mentic” and paste with <b>Cmd/Ctrl-V</b>.</li>
<li>Set it as default for new emails and replies, then <b>Save Changes</b> at the bottom.</li>
</ol>
<div style="border:2px dashed #ff6b5c;border-radius:8px;padding:20px;background:#ffffff;">
${renderSignature(person, roster)}
</div>
</div>
</body>
</html>`;
}

function main() {
  const roster = JSON.parse(readFileSync(join(HERE, 'roster.json'), 'utf8'));
  validateRoster(roster);
  const publicDir = join(HERE, '..', '..', 'public');
  for (const person of roster.people) {
    const photoFile = join(publicDir, person.photo);
    if (!existsSync(photoFile)) {
      throw new Error(`Missing headshot for "${person.slug}": expected ${photoFile}`);
    }
  }
  const outDir = join(HERE, 'output');
  mkdirSync(outDir, { recursive: true });
  for (const person of roster.people) {
    const file = join(outDir, `${person.slug}.html`);
    writeFileSync(file, renderPage(person, roster));
    console.log(`wrote ${file}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (err) {
    console.error(`signature generation failed: ${err.message}`);
    process.exit(1);
  }
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd ~/mentic.io-coding/Mentic.io-Website && node --test scripts/signatures/`
Expected: all 5 tests PASS.

- [ ] **Step 6: Commit**

```bash
cd ~/mentic.io-coding/Mentic.io-Website
git add scripts/signatures/roster.json scripts/signatures/generate.mjs scripts/signatures/generate.test.mjs
git commit -m "feat: add email signature generator script with roster"
```

---

### Task 3: Generate outputs, visual check, deploy, live verification

**Files:**
- Create (generated): `scripts/signatures/output/maksymilian.html`, `scripts/signatures/output/bo.html`

**Interfaces:**
- Consumes: CLI entrypoint of `generate.mjs` (Task 2), headshots (Task 1).
- Produces: committed signature pages; live image URLs on mentic.io.

- [ ] **Step 1: Run the generator**

Run: `cd ~/mentic.io-coding/Mentic.io-Website && node scripts/signatures/generate.mjs`
Expected: `wrote .../output/maksymilian.html` and `wrote .../output/bo.html`, exit 0.

- [ ] **Step 2: Visual check of both pages**

Render each output file (screenshot via browser or read in a rendering tool) and confirm: round headshot, name/title, coral links, logo row, dark-teal CTA button, instruction copy above the dashed box. Fix template and regenerate if anything is off.

- [ ] **Step 3: Commit and push (deploys the site, making headshots live)**

```bash
cd ~/mentic.io-coding/Mentic.io-Website
git add scripts/signatures/output
git commit -m "feat: generate signature files for Maks and Bo"
git push
```

- [ ] **Step 4: Verify hosted images after deploy**

Wait for the deploy to finish, then:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://mentic.io/team/maksymilian.jpg https://mentic.io/team/bo.jpg https://mentic.io/images/logo.png
```

Expected: `200` three times. If 404, the deploy hasn't finished or failed — check hosting dashboard before debugging code.

- [ ] **Step 5: Hand off to the user**

Send both `output/*.html` files to the user with the paste instructions, noting the final real-world check they must do themselves: paste into Gmail, send a test email, confirm photo/logo/links/CTA render.
