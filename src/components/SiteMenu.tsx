"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { trackInitiateCheckout, trackLead, trackSchedule } from "@/lib/pixel";

const NAV_ITEMS: Array<{ label: string; href: string; weight: number; color: string }> = [
  { label: "PRODUCT", href: "/product", weight: 800, color: "#003c46" },
  { label: "PRICING", href: "/pricing", weight: 300, color: "#ff6b5c" },
  { label: "NEWS", href: "/news", weight: 700, color: "#003c46" },
  { label: "TEAM", href: "/team", weight: 200, color: "#003c46" },
  { label: "CAREERS", href: "/careers", weight: 600, color: "#003c46" },
];

const CALENDLY = "https://calendly.com/maksymilian-mentic/mentic-alpha-access-onboarding-pilot-user";

export default function SiteMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      {/* Top-left brand icon — doubles as a home link */}
      <Link
        href="/"
        aria-label="Mentic — back to home"
        className="site-menu-icon-link fixed top-[clamp(14px,2vw,22px)] left-[clamp(16px,3vw,28px)] z-[160] inline-flex items-center no-underline"
      >
        <Image
          src="/images/mentic-icon-orange.png"
          alt="Mentic"
          width={56}
          height={56}
          priority
          className="w-[clamp(44px,4.6vw,56px)] h-auto [filter:drop-shadow(1px_1px_14.3px_rgba(0,0,0,0.18))]"
        />
      </Link>

      {/* Hamburger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="site-menu-hamburger fixed top-[clamp(14px,2vw,22px)] right-[clamp(14px,2vw,24px)] w-12 h-12 rounded-full cursor-pointer flex flex-col items-center justify-center gap-[5px] p-0 z-[180] [font-family:inherit] [transition:background_0.35s_ease,border-color_0.35s_ease,box-shadow_0.35s_ease]"
        style={{
          background: open ? "transparent" : "#003c46",
          border: `1px solid ${open ? "rgba(0,60,70,0)" : "rgba(255,255,255,0.08)"}`,
          boxShadow: open
            ? "0 0 0 rgba(0,0,0,0)"
            : "0 10px 28px rgba(0,60,70,0.28), 0 2px 6px rgba(0,60,70,0.18)",
        }}
      >
        <span
          className="block w-[18px] h-0.5 rounded-[2px] origin-center [transition:transform_0.5s_cubic-bezier(0.16,1,0.3,1),background_0.35s_ease]"
          style={{
            background: open ? "#003c46" : "#f2f2f0",
            transform: open ? "translateY(7px) rotate(45deg)" : "translateY(0) rotate(0)",
          }}
        />
        <span
          className="block w-[18px] h-0.5 rounded-[2px] [transition:opacity_0.2s_ease,transform_0.4s_cubic-bezier(0.16,1,0.3,1),background_0.35s_ease]"
          style={{
            background: open ? "#003c46" : "#f2f2f0",
            opacity: open ? 0 : 1,
            transform: open ? "scaleX(0)" : "scaleX(1)",
          }}
        />
        <span
          className="block w-[18px] h-0.5 rounded-[2px] origin-center [transition:transform_0.5s_cubic-bezier(0.16,1,0.3,1),background_0.35s_ease]"
          style={{
            background: open ? "#003c46" : "#f2f2f0",
            transform: open ? "translateY(-7px) rotate(-45deg)" : "translateY(0) rotate(0)",
          }}
        />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        className="fixed inset-0 bg-dark-teal/34 backdrop-blur-[8px] z-[170] [transition:opacity_0.55s_cubic-bezier(0.16,1,0.3,1)]"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
      />

      {/* Side panel */}
      <aside
        aria-hidden={!open}
        className="fixed top-0 right-0 w-[min(100vw,max(360px,46vw))] max-w-[620px] h-[100dvh] bg-[#f2f2f0] z-[175] flex flex-col pt-[clamp(96px,14vh,128px)] px-[clamp(28px,5vw,72px)] pb-[clamp(32px,4vh,56px)] [font-family:var(--font-nunito),'Nunito_Sans',sans-serif] overflow-hidden [transition:transform_0.72s_cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: open ? "translateX(0)" : "translateX(105%)",
          boxShadow: open ? "-30px 0 80px rgba(0,60,70,0.18)" : "none",
        }}
      >
        {/* Top-right accent line */}
        <div
          aria-hidden
          className="absolute top-0 right-0 h-[3px] [background:linear-gradient(90deg,#ff6b5c_0%,#8bf2d3_100%)] [transition:width_0.85s_cubic-bezier(0.16,1,0.3,1)_0.25s]"
          style={{ width: open ? "clamp(80px, 14vw, 140px)" : 0 }}
        />
        <div
          aria-hidden
          className="gradient-blob gradient-blob-coral absolute w-[70%] h-[70%] bottom-[-35%] left-[-25%] pointer-events-none [transition:opacity_0.9s_ease_0.2s]"
          style={{ opacity: open ? 0.55 : 0 }}
        />

        {/* Nav items */}
        <nav className="flex-1 flex flex-col gap-[clamp(14px,1.8vw,22px)] relative z-[1]">
          {NAV_ITEMS.map((item, i) => {
            const arrowColor = item.color === "#ff6b5c" ? "#003c46" : "#ff6b5c";
            return (
              <Link
                key={item.label}
                href={item.href}
                className="menu-nav-link [font-family:var(--font-nunito),'Nunito_Sans',sans-serif] text-[clamp(32px,5.6vw,60px)] leading-none tracking-[-0.01em] no-underline uppercase inline-flex items-center w-fit cursor-pointer"
                onClick={() => setOpen(false)}
                style={{
                  fontWeight: item.weight,
                  color: item.color,
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(48px)",
                  filter: open ? "blur(0px)" : "blur(8px)",
                  transitionProperty: "opacity, transform, filter, color",
                  transitionDuration: "0.7s, 0.75s, 0.6s, 0.25s",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: `${0.22 + i * 0.07}s, ${0.22 + i * 0.07}s, ${0.22 + i * 0.07}s, 0s`,
                }}
              >
                <span className="menu-nav-arrow" aria-hidden style={{ color: arrowColor }} />
                <span className="menu-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom CTAs */}
        <div
          className="flex flex-col gap-3 relative z-[1] [transition:opacity_0.7s_cubic-bezier(0.16,1,0.3,1)_0.6s,transform_0.7s_cubic-bezier(0.16,1,0.3,1)_0.6s]"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0)" : "translateY(28px)",
          }}
        >
          <a
            href="https://app.mentic.io/login"
            className="bg-transparent text-dark-teal border-[1.5px] border-solid border-dark-teal rounded-full py-[15px] px-7 text-[13px] font-bold tracking-[0.18em] uppercase no-underline text-center cursor-pointer [font-family:inherit] [transition:background_0.25s_ease,color_0.25s_ease,transform_0.25s_ease] hover:bg-dark-teal hover:text-[#f2f2f0] hover:-translate-y-px"
          >Log in</a>
          <a
            href="https://mentic.io/#signup"
            onClick={() => {
              trackInitiateCheckout({ content_name: "Sign up CTA — slide-out menu", source: "site_menu_overlay" });
              trackLead({ content_name: "Sign up CTA — slide-out menu", source: "site_menu_overlay" });
            }}
            className="bg-dark-teal text-[#f2f2f0] border-none rounded-full py-[15px] px-7 text-[13px] font-bold tracking-[0.18em] uppercase no-underline text-center cursor-pointer [font-family:inherit] [transition:background_0.25s_ease,transform_0.25s_ease] hover:bg-[#00525f] hover:-translate-y-px"
          >Sign up</a>
          <a
            href={CALENDLY}
            target="_blank" rel="noopener noreferrer"
            onClick={() => trackSchedule({ content_name: "Book a demo — slide-out menu", source: "site_menu_overlay" })}
            className="bg-mint text-dark-teal border-none rounded-full py-[15px] px-7 text-[13px] font-bold tracking-[0.18em] uppercase no-underline text-center cursor-pointer [font-family:inherit] [transition:background_0.25s_ease,transform_0.25s_ease] hover:bg-[#a8f7df] hover:-translate-y-px"
          >Book a Demo</a>
        </div>
      </aside>
    </>
  );
}
