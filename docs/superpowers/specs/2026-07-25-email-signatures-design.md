# Mentic Email Signature Generator — Design

**Date:** 2026-07-25
**Status:** Approved approach: pre-generated HTML files (Approach C)

## Purpose

Give every Mentic team member a consistent, branded Gmail signature without
manual HTML fiddling. Maks maintains a roster; a script generates one
ready-to-paste signature file per person.

## Scope

- Target email client: **Gmail / Google Workspace only.**
- Current team: Maksymilian Rechnio (Co-Founder & CEO), Bo Bredenbruecher
  (Co-Founder & COO). Designed so a new hire is one roster entry + one photo.
- No backend, no web generator UI, no Workspace API integration (possible
  later upgrade, out of scope).

## Architecture

Everything lives in the `Mentic.io-Website` repo (deployed at mentic.io),
because Gmail signatures require publicly hosted images and the site already
serves the mentic.io domain.

```
scripts/signatures/
  roster.json        # team data + global CTA config
  generate.mjs       # Node script, no dependencies
  output/            # generated signature files, committed
    maksymilian.html
    bo.html
public/team/
  maksymilian.jpg    # square headshot, 288x288 (72px displayed @4x)
  bo.jpg
```

### roster.json

```json
{
  "cta": {
    "text": "Book a demo →",
    "url": "https://calendly.com/maksymilian-mentic/mentic-io-demo-onboarding-meeting"
  },
  "baseUrl": "https://mentic.io",
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

Phone is intentionally omitted; adding a `"phone"` field to a person later
renders a phone row automatically.

### generate.mjs

Plain Node (no deps). Reads `roster.json`, renders the signature template per
person, writes `output/<slug>.html`. Each output file contains:

1. A plain header section (not part of the signature) with install
   instructions: *Select the signature below → Copy → Gmail Settings → General
   → Signature → paste.* A visible border marks where the signature starts.
2. The signature itself.

### Signature template (Gmail-safe rules)

- Table-based layout, all styles inline. No `<style>` blocks, no classes, no
  web fonts, no CSS Gmail strips.
- Font stack: `'Nunito Sans', Helvetica, Arial, sans-serif` — recipients see
  Helvetica/Arial (email cannot load web fonts); brand type shows only where
  Nunito Sans is installed locally.
- Layout:
  - Left cell: round headshot, 72×72 displayed (`border-radius: 50%`;
    acceptable degradation to square in old Outlook — out of scope target).
  - Right cell: **Name** (bold, ~16px, near-black), title (~13px, gray),
    links row: `mentic.io · maksymilian@mentic.io` (brand-colored links,
    `mailto:` on the email).
  - Below: Mentic horizontal logo
    (`https://mentic.io/mentic-horizontal-logo-transparent.png`, already in
    `/public`), height ~20px.
  - CTA banner strip: bordered/tinted rounded box with the CTA text linking
    to the Calendly URL. Rendered from the global `cta` config.
- All image URLs are absolute `https://mentic.io/...` URLs.

## Assets

Source photos (on Desktop, `~/Desktop/mentic.io/`):

- `maksRechnio-picture.jpeg` — needs EXIF rotation fix, then center-crop on
  face to square, resize to 288×288 → `public/team/maksymilian.jpg`
- `boBredenbruecher-picture.JPG` — center-crop on face to square, resize to
  288×288 → `public/team/bo.jpg`

Processed with macOS `sips` (crop/resize) — source files stay untouched on
Desktop.

## Workflow

**New hire / detail change:** add photo to `public/team/`, edit
`roster.json`, run `node scripts/signatures/generate.mjs`, commit + deploy
(images must be live before pasting), send the person their `output/*.html`.

**CTA campaign change:** edit the `cta` block, rerun the script, everyone
re-pastes from their regenerated file.

## Testing / verification

- Generated HTML validated by opening `output/*.html` in a browser and
  visually checking layout.
- Confirm headshot + logo URLs return 200 on mentic.io after deploy.
- Real-world check: paste into Gmail settings, send a test email to another
  account, verify photo, logo, links, and CTA render.

## Error handling

Script fails loudly (non-zero exit, clear message) on: missing roster fields,
missing photo file for a listed person, malformed JSON. No silent fallbacks.
