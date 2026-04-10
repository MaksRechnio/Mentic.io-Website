import { NextResponse } from "next/server";

const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbyiDLOmuxOYJhyRIlBan_Mb19UXxjB8Fos6bIbwWUJjSXq9XJJzlYVbkVy1Ld-MgGIp/exec";

export async function POST(req: Request) {
  const data = await req.json();
  const body = JSON.stringify(data);

  // First request — Apps Script returns a 302 redirect
  const resp = await fetch(GOOGLE_SHEET_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    redirect: "manual",
  });

  // Follow the redirect manually as POST (fetch default turns it into GET)
  if (resp.status >= 300 && resp.status < 400) {
    const location = resp.headers.get("location");
    if (location) {
      const resp2 = await fetch(location, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const text = await resp2.text();
      return NextResponse.json({ ok: true, upstream: text });
    }
  }

  const text = await resp.text();
  return NextResponse.json({ ok: true, upstream: text });
}
