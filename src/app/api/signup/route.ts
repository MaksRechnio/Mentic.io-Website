import { NextResponse } from "next/server";

const GOOGLE_SHEET_WEBHOOK = "https://script.google.com/macros/s/AKfycbx1G7rgvigNnjA8aUv3KEFcSWqPgNPruXBtvLEuZR0C0mmT13kReZ5-b2WL6YVCJnfH/exec";

export async function POST(req: Request) {
  const data = await req.json();
  const params = new URLSearchParams({
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    company: data.company || "",
    recaptchaToken: data.recaptchaToken || "",
    timestamp: data.timestamp || new Date().toISOString(),
  });

  // GET with query params — survives Apps Script's 302 redirect
  const resp = await fetch(`${GOOGLE_SHEET_WEBHOOK}?${params.toString()}`);
  const text = await resp.text();
  return NextResponse.json({ ok: true, upstream: text });
}
