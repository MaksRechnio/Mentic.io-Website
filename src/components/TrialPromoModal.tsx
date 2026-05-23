"use client";

import { useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────
   7-day-free-trial promo modal.
   - Appears 5s after mount (per session, only the first time)
   - Dismissal stored in localStorage so it doesn't re-show after close
   - Auto-disabled after the offer deadline
   - Esc / backdrop / × all close it
   - Fires fbq('track', 'Lead') on CTA click if Meta Pixel is present
   ─────────────────────────────────────────────────────────── */

const STORAGE_KEY = "mentic-trial-promo-dismissed-v1";
const DEADLINE_ISO = "2026-05-28T00:00:00";   // end of Wed 27 May (local time)
const DEADLINE_DISPLAY = "Wed 27 May";
const SHOW_AFTER_MS = 5000;
const SIGNUP_URL = "https://app.mentic.io/signup";

const TEAL = "#003c46";
const TEAL_INK = "rgba(0,60,70,0.72)";
const CORAL = "#ff6b5c";
const MINT = "#8bf2d3";
const CERAMIC = "#f2f2f0";

declare global {
  interface Window {
    fbq?: (action: string, event: string, params?: Record<string, unknown>) => void;
  }
}

export default function TrialPromoModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new Date() >= new Date(DEADLINE_ISO)) return;
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      /* localStorage unavailable (Safari private mode etc.) — still show */
    }
    const t = window.setTimeout(() => setOpen(true), SHOW_AFTER_MS);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function dismiss() {
    setOpen(false);
    try { window.localStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }
  }

  function onClaim() {
    try { window.fbq?.("track", "Lead", { content_name: "7-day free trial promo" }); } catch { /* noop */ }
    try { window.localStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="trial-promo-title"
      onClick={dismiss}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,30,36,0.55)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(16px, 4vw, 32px)",
        fontFamily: "var(--font-nunito), 'Nunito Sans', sans-serif",
        animation: "trialPromoFadeIn 240ms cubic-bezier(0.165, 0.84, 0.44, 1) both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 460,
          background: CERAMIC,
          color: TEAL,
          borderRadius: 28,
          padding: "clamp(28px, 5vw, 44px) clamp(24px, 4.5vw, 40px) clamp(24px, 4vw, 36px)",
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.04), 0 24px 56px rgba(0,30,36,0.22), 0 60px 120px -20px rgba(0,30,36,0.4), 0 0 0 1px rgba(0,60,70,0.06)",
          overflow: "hidden",
          animation: "trialPromoPop 360ms cubic-bezier(0.165, 0.84, 0.44, 1) both",
        }}
      >
        {/* Soft brand blobs */}
        <span aria-hidden style={{
          position: "absolute", width: 320, height: 320, borderRadius: 999,
          top: -160, left: -120,
          background: `radial-gradient(circle, ${CORAL}55, ${CORAL}00 70%)`,
          pointerEvents: "none",
        }} />
        <span aria-hidden style={{
          position: "absolute", width: 360, height: 360, borderRadius: 999,
          bottom: -200, right: -140,
          background: `radial-gradient(circle, ${MINT}66, ${MINT}00 70%)`,
          pointerEvents: "none",
        }} />

        {/* Close */}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={dismiss}
          style={{
            position: "absolute", top: 14, right: 14,
            width: 32, height: 32, borderRadius: 999,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,60,70,0.06)",
            color: TEAL,
            border: "none", cursor: "pointer",
            transition: "background 180ms ease, transform 180ms ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(0,60,70,0.12)"; e.currentTarget.style.transform = "scale(1.06)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(0,60,70,0.06)"; e.currentTarget.style.transform = "scale(1)"; }}
        >
          <svg width={12} height={12} viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* Eyebrow */}
        <div style={{
          position: "relative", zIndex: 1,
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "5px 12px", borderRadius: 999,
          background: "rgba(255,107,92,0.12)",
          color: CORAL,
          fontSize: 11, fontWeight: 800, letterSpacing: "0.22em",
          textTransform: "uppercase",
          marginBottom: 22,
        }}>
          <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: CORAL }} />
          Limited offer
        </div>

        {/* Headline */}
        <h2 id="trial-promo-title" style={{
          position: "relative", zIndex: 1,
          margin: 0,
          fontSize: "clamp(34px, 7vw, 46px)",
          lineHeight: 1.02,
          letterSpacing: "-0.02em",
          fontWeight: 200,
          color: TEAL,
        }}>
          <span style={{ display: "block", fontWeight: 800, color: CORAL }}>7 days free</span>
          <span style={{ display: "block", fontWeight: 200 }}>on the autonomous</span>
          <span style={{ display: "block", fontWeight: 800 }}>AI Advertiser.</span>
        </h2>

        {/* Body */}
        <p style={{
          position: "relative", zIndex: 1,
          margin: "18px 0 0",
          fontSize: "clamp(14px, 1.6vw, 16px)",
          fontWeight: 400, lineHeight: 1.55,
          color: TEAL_INK,
        }}>
          Plug Mentic into your business and let our agents launch, manage and
          optimise your ads — on us for a week. No card up front.
        </p>

        {/* Deadline */}
        <div style={{
          position: "relative", zIndex: 1,
          marginTop: 18,
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 12, fontWeight: 700, color: TEAL,
          letterSpacing: "0.12em", textTransform: "uppercase",
          padding: "8px 14px", borderRadius: 999,
          background: "rgba(0,60,70,0.06)",
        }}>
          <svg width={12} height={12} viewBox="0 0 12 12" fill="none" aria-hidden>
            <circle cx="6" cy="6" r="5" stroke={TEAL} strokeWidth="1.4" />
            <path d="M6 3v3l2 1" stroke={TEAL} strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Ends {DEADLINE_DISPLAY}
        </div>

        {/* Actions */}
        <div style={{
          position: "relative", zIndex: 1,
          marginTop: 26,
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          <a
            href={SIGNUP_URL}
            onClick={onClaim}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              padding: "16px 22px", borderRadius: 14,
              background: TEAL, color: MINT,
              fontSize: 15, fontWeight: 800, letterSpacing: "0.04em",
              textDecoration: "none",
              transition: "transform 200ms ease, box-shadow 200ms ease, background 200ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(0,60,70,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            Claim your 7 days →
          </a>
          <button
            type="button"
            onClick={dismiss}
            style={{
              background: "transparent", border: "none", padding: "8px 0",
              color: TEAL_INK,
              fontSize: 13, fontWeight: 500,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "color 180ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = TEAL; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = TEAL_INK; }}
          >
            Maybe later
          </button>
        </div>
      </div>

      <style>{`
        @keyframes trialPromoFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes trialPromoPop {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
