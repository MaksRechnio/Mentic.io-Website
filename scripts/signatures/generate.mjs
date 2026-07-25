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
<li>Select the whole signature in the box below (click just before the photo, then <b>shift-click</b> after the "Book a demo" button) and press <b>Cmd/Ctrl-C</b> to copy.</li>
<li>Open <b>Gmail → Settings (gear) → See all settings → General → Signature</b>.</li>
<li>Create a signature named "Mentic" and paste with <b>Cmd/Ctrl-V</b>.</li>
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
