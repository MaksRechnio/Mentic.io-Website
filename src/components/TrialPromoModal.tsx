"use client";

import { useEffect, useState } from "react";
import { trackInitiateCheckout, trackLead } from "@/lib/pixel";

/* ─────────────────────────────────────────────────────────────
   4-day-free-trial promo modal.
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
    trackLead({ content_name: "4-day free trial promo", source: "trial_promo_modal" });
    trackInitiateCheckout({ content_name: "4-day free trial promo", source: "trial_promo_modal" });
    try { window.localStorage.setItem(STORAGE_KEY, "1"); } catch { /* noop */ }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="trial-promo-title"
      onClick={dismiss}
      className="fixed inset-0 z-[9999] bg-[rgba(0,30,36,0.55)] backdrop-blur-[6px] flex items-center justify-center p-[clamp(16px,4vw,32px)] [font-family:var(--font-nunito),'Nunito_Sans',sans-serif] [animation:trialPromoFadeIn_240ms_cubic-bezier(0.165,0.84,0.44,1)_both]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[460px] bg-[#f2f2f0] text-dark-teal rounded-[28px] pt-[clamp(28px,5vw,44px)] px-[clamp(24px,4.5vw,40px)] pb-[clamp(24px,4vw,36px)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_24px_56px_rgba(0,30,36,0.22),0_60px_120px_-20px_rgba(0,30,36,0.4),0_0_0_1px_rgba(0,60,70,0.06)] overflow-hidden [animation:trialPromoPop_360ms_cubic-bezier(0.165,0.84,0.44,1)_both]"
      >
        {/* Soft brand blobs */}
        <span
          aria-hidden
          className="absolute w-80 h-80 rounded-full top-[-160px] left-[-120px] [background:radial-gradient(circle,#ff6b5c55,#ff6b5c00_70%)] pointer-events-none"
        />
        <span
          aria-hidden
          className="absolute w-[360px] h-[360px] rounded-full bottom-[-200px] right-[-140px] [background:radial-gradient(circle,#8bf2d366,#8bf2d300_70%)] pointer-events-none"
        />

        {/* Close */}
        <button
          type="button"
          aria-label="Dismiss"
          onClick={dismiss}
          className="absolute top-[14px] right-[14px] w-8 h-8 rounded-full inline-flex items-center justify-center bg-dark-teal/6 text-dark-teal border-none cursor-pointer [transition:background_180ms_ease,transform_180ms_ease] hover:bg-dark-teal/12 hover:scale-[1.06]"
        >
          <svg width={12} height={12} viewBox="0 0 12 12" fill="none" aria-hidden>
            <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        {/* Eyebrow */}
        <div className="relative z-[1] inline-flex items-center gap-2 py-[5px] px-3 rounded-full bg-coral/12 text-coral text-[11px] font-extrabold tracking-[0.22em] uppercase mb-[22px]">
          <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-coral" />
          Limited offer
        </div>

        {/* Headline */}
        <h2 id="trial-promo-title" className="relative z-[1] m-0 text-[clamp(34px,7vw,46px)] leading-[1.02] tracking-[-0.02em] font-extralight text-dark-teal">
          <span className="block font-extrabold text-coral">4 days free</span>
          <span className="block font-extralight">on the autonomous</span>
          <span className="block font-extrabold">AI Advertiser.</span>
        </h2>

        {/* Body */}
        <p className="relative z-[1] mt-[18px] mx-0 mb-0 text-[clamp(14px,1.6vw,16px)] font-normal leading-[1.55] text-dark-teal/72">
          Plug Mentic into your business and let our agents launch, manage and
          optimise your ads — on us for 4 days. No card up front.
        </p>

        {/* Deadline */}
        <div className="relative z-[1] mt-[18px] inline-flex items-center gap-2 text-xs font-bold text-dark-teal tracking-[0.12em] uppercase py-2 px-[14px] rounded-full bg-dark-teal/6">
          <svg width={12} height={12} viewBox="0 0 12 12" fill="none" aria-hidden>
            <circle cx="6" cy="6" r="5" stroke={TEAL} strokeWidth="1.4" />
            <path d="M6 3v3l2 1" stroke={TEAL} strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Ends {DEADLINE_DISPLAY}
        </div>

        {/* Actions */}
        <div className="relative z-[1] mt-[26px] flex flex-col gap-2.5">
          <a
            href={SIGNUP_URL}
            onClick={onClaim}
            className="inline-flex items-center justify-center py-4 px-[22px] rounded-[14px] bg-dark-teal text-mint text-[15px] font-extrabold tracking-[0.04em] no-underline [transition:transform_200ms_ease,box-shadow_200ms_ease,background_200ms_ease] hover:-translate-y-px hover:shadow-[0_14px_32px_rgba(0,60,70,0.25)]"
          >
            Claim your 4 days →
          </a>
          <button
            type="button"
            onClick={dismiss}
            className="bg-transparent border-none py-2 px-0 text-dark-teal/72 text-[13px] font-medium cursor-pointer [font-family:inherit] [transition:color_180ms_ease] hover:text-dark-teal"
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
