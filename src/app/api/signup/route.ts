import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const RECAPTCHA_MIN_SCORE = 0.5;

type RecaptchaResponse = {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
};

async function verifyRecaptcha(token: string, remoteIp: string | null) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) throw new Error("RECAPTCHA_SECRET_KEY not configured");

  const params = new URLSearchParams({ secret, response: token });
  if (remoteIp) params.set("remoteip", remoteIp);

  const resp = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });
  return (await resp.json()) as RecaptchaResponse;
}

export async function POST(req: Request) {
  const data = await req.json();

  const email = (data.email || "").trim().toLowerCase();
  if (!email) {
    return NextResponse.json({ ok: false, error: "email required" }, { status: 400 });
  }

  const token = (data.recaptchaToken || "").trim();
  if (!token) {
    return NextResponse.json({ ok: false, error: "recaptcha token missing" }, { status: 400 });
  }

  const remoteIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null;

  const verdict = await verifyRecaptcha(token, remoteIp);

  if (!verdict.success || verdict.action !== "signup" || (verdict.score ?? 0) < RECAPTCHA_MIN_SCORE) {
    console.warn("[signup] recaptcha rejected", {
      success: verdict.success,
      action: verdict.action,
      score: verdict.score,
      errorCodes: verdict["error-codes"],
    });
    return NextResponse.json(
      { ok: false, error: "recaptcha verification failed" },
      { status: 400 },
    );
  }

  const firstname = (data.firstName || "").trim() || null;
  const lastname = (data.lastName || "").trim() || null;
  const company = (data.company || "").trim() || null;

  const entry = await prisma.websiteEmailList.upsert({
    where: { email },
    create: { email, firstname, lastname, company },
    update: { firstname, lastname, company },
  });

  return NextResponse.json({ ok: true, id: entry.id });
}
