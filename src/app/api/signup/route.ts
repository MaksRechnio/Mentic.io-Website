import { NextResponse } from "next/server";

const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbyiDLOmuxOYJhyRIlBan_Mb19UXxjB8Fos6bIbwWUJjSXq9XJJzlYVbkVy1Ld-MgGIp/exec";

export async function POST(req: Request) {
  const data = await req.json();

  const resp = await fetch(GOOGLE_SHEET_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    redirect: "follow",
  });

  const text = await resp.text();
  return NextResponse.json({ ok: true, upstream: text });
}
