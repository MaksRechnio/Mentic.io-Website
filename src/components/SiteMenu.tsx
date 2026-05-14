"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
        className="site-menu-icon-link"
        style={{
          position: "fixed",
          top: "clamp(14px, 2vw, 22px)",
          left: "clamp(16px, 3vw, 28px)",
          zIndex: 160,
          display: "inline-flex", alignItems: "center",
          textDecoration: "none",
        }}
      >
        <Image
          src="/images/mentic-icon-orange.png"
          alt="Mentic"
          width={56}
          height={56}
          priority
          style={{
            width: "clamp(44px, 4.6vw, 56px)",
            height: "auto",
            filter: "drop-shadow(1px 1px 14.3px rgba(0,0,0,0.18))",
          }}
        />
      </Link>

      {/* Hamburger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="site-menu-hamburger"
        style={{
          position: "fixed",
          top: "clamp(14px, 2vw, 22px)",
          right: "clamp(14px, 2vw, 24px)",
          width: 48, height: 48,
          background: open ? "transparent" : "#003c46",
          border: `1px solid ${open ? "rgba(0,60,70,0)" : "rgba(255,255,255,0.08)"}`,
          borderRadius: 999,
          cursor: "pointer",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 5,
          padding: 0,
          zIndex: 180,
          boxShadow: open
            ? "0 0 0 rgba(0,0,0,0)"
            : "0 10px 28px rgba(0,60,70,0.28), 0 2px 6px rgba(0,60,70,0.18)",
          transition: "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
          fontFamily: "inherit",
        }}
      >
        <span style={{
          display: "block", width: 18, height: 2,
          background: open ? "#003c46" : "#f2f2f0",
          borderRadius: 2,
          transformOrigin: "center",
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.35s ease",
          transform: open ? "translateY(7px) rotate(45deg)" : "translateY(0) rotate(0)",
        }} />
        <span style={{
          display: "block", width: 18, height: 2,
          background: open ? "#003c46" : "#f2f2f0",
          borderRadius: 2,
          transition: "opacity 0.2s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.35s ease",
          opacity: open ? 0 : 1,
          transform: open ? "scaleX(0)" : "scaleX(1)",
        }} />
        <span style={{
          display: "block", width: 18, height: 2,
          background: open ? "#003c46" : "#f2f2f0",
          borderRadius: 2,
          transformOrigin: "center",
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), background 0.35s ease",
          transform: open ? "translateY(-7px) rotate(-45deg)" : "translateY(0) rotate(0)",
        }} />
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "fixed", inset: 0,
          background: "rgba(0,60,70,0.34)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.55s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 170,
        }}
      />

      {/* Side panel */}
      <aside
        aria-hidden={!open}
        style={{
          position: "fixed", top: 0, right: 0,
          width: "min(100vw, max(360px, 46vw))",
          maxWidth: 620,
          height: "100dvh",
          background: "#f2f2f0",
          transform: open ? "translateX(0)" : "translateX(105%)",
          transition: "transform 0.72s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 175,
          display: "flex", flexDirection: "column",
          padding: "clamp(96px, 14vh, 128px) clamp(28px, 5vw, 72px) clamp(32px, 4vh, 56px)",
          boxShadow: open ? "-30px 0 80px rgba(0,60,70,0.18)" : "none",
          fontFamily: "var(--font-nunito), 'Nunito Sans', sans-serif",
          overflow: "hidden",
        }}
      >
        {/* Top-right accent line */}
        <div aria-hidden style={{
          position: "absolute", top: 0, right: 0,
          width: open ? "clamp(80px, 14vw, 140px)" : 0, height: 3,
          background: "linear-gradient(90deg, #ff6b5c 0%, #8bf2d3 100%)",
          transition: "width 0.85s cubic-bezier(0.16, 1, 0.3, 1) 0.25s",
        }} />
        <div aria-hidden className="gradient-blob gradient-blob-coral" style={{
          position: "absolute", width: "70%", height: "70%",
          bottom: "-35%", left: "-25%",
          opacity: open ? 0.55 : 0,
          transition: "opacity 0.9s ease 0.2s",
          pointerEvents: "none",
        }} />

        {/* Nav items */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "clamp(14px, 1.8vw, 22px)", position: "relative", zIndex: 1 }}>
          {NAV_ITEMS.map((item, i) => {
            const arrowColor = item.color === "#ff6b5c" ? "#003c46" : "#ff6b5c";
            return (
              <Link
                key={item.label}
                href={item.href}
                className="menu-nav-link"
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: "var(--font-nunito), 'Nunito Sans', sans-serif",
                  fontSize: "clamp(32px, 5.6vw, 60px)", lineHeight: 1,
                  fontWeight: item.weight, letterSpacing: "-0.01em",
                  color: item.color,
                  textDecoration: "none", textTransform: "uppercase",
                  display: "inline-flex", alignItems: "center",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(48px)",
                  filter: open ? "blur(0px)" : "blur(8px)",
                  transitionProperty: "opacity, transform, filter, color",
                  transitionDuration: "0.7s, 0.75s, 0.6s, 0.25s",
                  transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                  transitionDelay: `${0.22 + i * 0.07}s, ${0.22 + i * 0.07}s, ${0.22 + i * 0.07}s, 0s`,
                  width: "fit-content",
                  cursor: "pointer",
                }}
              >
                <span className="menu-nav-arrow" aria-hidden style={{ color: arrowColor }}>→</span>
                <span className="menu-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom CTAs */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 12,
          position: "relative", zIndex: 1,
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(28px)",
          transition: "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.6s, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.6s",
        }}>
          <a
            href="https://app.mentic.io/login"
            onMouseEnter={(e) => { e.currentTarget.style.background = "#003c46"; e.currentTarget.style.color = "#f2f2f0"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#003c46"; e.currentTarget.style.transform = "translateY(0)"; }}
            style={{
              background: "transparent", color: "#003c46",
              border: "1.5px solid #003c46", borderRadius: 999,
              padding: "15px 28px", fontSize: 13, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              textDecoration: "none", textAlign: "center",
              cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.25s ease, color 0.25s ease, transform 0.25s ease",
            }}
          >Log in</a>
          <a
            href="https://mentic.io/#signup"
            onMouseEnter={(e) => { e.currentTarget.style.background = "#00525f"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#003c46"; e.currentTarget.style.transform = "translateY(0)"; }}
            style={{
              background: "#003c46", color: "#f2f2f0",
              border: "none", borderRadius: 999,
              padding: "15px 28px", fontSize: 13, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              textDecoration: "none", textAlign: "center",
              cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.25s ease, transform 0.25s ease",
            }}
          >Sign up</a>
          <a
            href={CALENDLY}
            target="_blank" rel="noopener noreferrer"
            onMouseEnter={(e) => { e.currentTarget.style.background = "#a8f7df"; e.currentTarget.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#8bf2d3"; e.currentTarget.style.transform = "translateY(0)"; }}
            style={{
              background: "#8bf2d3", color: "#003c46",
              border: "none", borderRadius: 999,
              padding: "15px 28px", fontSize: 13, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              textDecoration: "none", textAlign: "center",
              cursor: "pointer", fontFamily: "inherit",
              transition: "background 0.25s ease, transform 0.25s ease",
            }}
          >Book a Demo</a>
        </div>
      </aside>
    </>
  );
}
