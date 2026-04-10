import { NextResponse } from "next/server";

const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbyiDLOmuxOYJhyRIlBan_Mb19UXxjB8Fos6bIbwWUJjSXq9XJJzlYVbkVy1Ld-MgGIp/exec";

export async function POST(req: Request) {
  const data = await req.json();

  // Apps Script executes doPost on this request, then returns a 302.
  // The script already runs and saves data before redirecting.
  // We don't need to follow the redirect.
  await fetch(GOOGLE_SHEET_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    redirect: "manual",
  });

  return NextResponse.json({ ok: true });
}
