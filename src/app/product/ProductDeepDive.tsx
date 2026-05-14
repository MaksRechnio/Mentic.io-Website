"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteMenu from "@/components/SiteMenu";

/* ─────────────────────────────────────────────────────────────
   Palette + style helpers
   ─────────────────────────────────────────────────────────── */
const TEAL = "#003c46";
const TEAL_INK = "rgba(0,60,70,0.72)";
const TEAL_MUTED = "rgba(0,60,70,0.55)";
const CORAL = "#ff6b5c";
const MINT = "#8bf2d3";
const CERAMIC = "#f2f2f0";
const CALENDLY =
  "https://calendly.com/maksymilian-mentic/mentic-alpha-access-onboarding-pilot-user";

/* ─────────────────────────────────────────────────────────────
   Maths helpers
   ─────────────────────────────────────────────────────────── */
function clamp(n: number, lo = 0, hi = 1) {
  return Math.max(lo, Math.min(hi, n));
}
function range(p: number, from: number, to: number) {
  if (to === from) return p >= to ? 1 : 0;
  return clamp((p - from) / (to - from));
}
function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/* Convenience: returns inline style for a fade-up-from-progress reveal */
function fadeUp(p: number, from: number, to: number, lift = 36): React.CSSProperties {
  const t = easeOutExpo(range(p, from, to));
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * lift}px)`,
    willChange: "opacity, transform",
  };
}

function fadeBlur(p: number, from: number, to: number, lift = 28, blur = 12): React.CSSProperties {
  const t = easeOutCubic(range(p, from, to));
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * lift}px)`,
    filter: `blur(${(1 - t) * blur}px)`,
    willChange: "opacity, transform, filter",
  };
}

function fadeFrom(side: "left" | "right", p: number, from: number, to: number, distance = 60): React.CSSProperties {
  const t = easeOutExpo(range(p, from, to));
  const sign = side === "left" ? -1 : 1;
  return {
    opacity: t,
    transform: `translateX(${(1 - t) * distance * sign}px)`,
    willChange: "opacity, transform",
  };
}

function scaleIn(p: number, from: number, to: number, scaleFrom = 0.92, lift = 40): React.CSSProperties {
  const t = easeOutExpo(range(p, from, to));
  return {
    opacity: t,
    transform: `translateY(${(1 - t) * lift}px) scale(${scaleFrom + (1 - scaleFrom) * t})`,
    willChange: "opacity, transform",
  };
}

/* ─────────────────────────────────────────────────────────────
   Hook: scroll progress within a tall outer container
   ─────────────────────────────────────────────────────────── */
function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight;
      const total = Math.max(1, rect.height - winH);
      const scrolled = -rect.top;
      setP(clamp(scrolled / total));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);
  return p;
}

/* ─────────────────────────────────────────────────────────────
   PinnedScene — sticky canvas that stays in view while you scroll
   through the outer container; renders content based on progress.
   Includes a "keep scrolling" indicator that fades out near the end.
   ─────────────────────────────────────────────────────────── */
function PinnedScene({
  scrollHeight = "260vh",
  children,
  hideHint = false,
}: {
  scrollHeight?: string;
  children: (progress: number) => React.ReactNode;
  hideHint?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const progress = useScrollProgress(ref);
  const hintOpacity = 1 - easeOutCubic(range(progress, 0.72, 0.95));
  return (
    <div ref={ref} style={{ height: scrollHeight, position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ width: "100%", maxWidth: 1400, padding: "clamp(80px, 12vh, 140px) clamp(20px, 6vw, 96px) clamp(60px, 10vh, 100px)" }}>
          {children(progress)}
        </div>
        {!hideHint && <ScrollHint opacity={hintOpacity} />}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ScrollHint — small "keep scrolling" indicator at scene bottom
   ─────────────────────────────────────────────────────────── */
function ScrollHint({ label = "Keep scrolling", opacity = 1 }: { label?: string; opacity?: number }) {
  return (
    <div style={{
      position: "absolute",
      bottom: "clamp(20px, 4vh, 36px)",
      left: "50%",
      transform: "translateX(-50%)",
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 8,
      color: TEAL_MUTED,
      opacity: clamp(opacity, 0, 1),
      transition: "opacity 0.25s linear",
      pointerEvents: "none",
      zIndex: 2,
    }}>
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: "0.3em",
        textTransform: "uppercase", whiteSpace: "nowrap",
      }}>
        {label}
      </span>
      <svg width={16} height={24} viewBox="0 0 16 24" fill="none" aria-hidden>
        <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1.4" />
        <rect x="7" y="5" width="2" height="5" rx="1" fill="currentColor">
          <animate attributeName="y" values="5;11;5" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0;1" dur="1.6s" repeatCount="indefinite" />
        </rect>
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SectionHeader — eyebrow + numbered headline + body
   ─────────────────────────────────────────────────────────── */
function SectionHeader({
  number, eyebrow, parts, body, p,
}: {
  number: string;
  eyebrow: string;
  parts: Array<{ text: string; color: string; weight: number }>;
  body?: string;
  p: number;
}) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
      gap: "clamp(20px, 3vw, 64px)",
      alignItems: "start",
    }} className="section-head">
      <div style={fadeUp(p, 0, 0.12)}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.3em",
          color: CORAL, textTransform: "uppercase",
        }}>
          {number} ◆ {eyebrow}
        </div>
        <div style={{ height: 1, background: "rgba(0,60,70,0.12)", maxWidth: 80, marginTop: 14 }} />
      </div>
      <div>
        <h2 style={{
          margin: 0,
          fontSize: "clamp(30px, 4.6vw, 64px)",
          lineHeight: 1.04,
          letterSpacing: "-0.02em",
          color: TEAL,
          ...fadeBlur(p, 0.02, 0.18),
        }}>
          {parts.map((part, i) => (
            <span key={i} style={{ fontWeight: part.weight, color: part.color }}>{part.text}</span>
          ))}
        </h2>
        {body && (
          <p style={{
            margin: "20px 0 0",
            maxWidth: 720,
            fontSize: "clamp(14px, 1.2vw, 18px)",
            fontWeight: 300, lineHeight: 1.55,
            color: TEAL_INK,
            ...fadeUp(p, 0.06, 0.22, 24),
          }}>
            {body}
          </p>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   URL typewriter that scrubs to scroll progress
   ─────────────────────────────────────────────────────────── */
function ScrollTypewriter({
  text, from, to, p,
}: { text: string; from: number; to: number; p: number }) {
  const t = clamp(range(p, from, to));
  const shown = Math.floor(t * text.length);
  return (
    <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
      {text.slice(0, shown)}
      {shown < text.length && <span className="typewriter-caret" />}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main component
   ─────────────────────────────────────────────────────────── */
export default function ProductDeepDive() {
  return (
    <main className="use-native-cursor" style={{
      width: "100%",
      background: CERAMIC,
      color: TEAL,
      fontFamily: "var(--font-nunito), 'Nunito Sans', sans-serif",
      position: "relative",
      /* No overflow:hidden — would break position:sticky inside */
    }}>
      <SiteMenu />

      {/* Global corner blobs — fixed so they bleed continuously */}
      <div aria-hidden className="gradient-blob gradient-blob-coral" style={{
        position: "fixed", pointerEvents: "none",
        width: "min(45vw, 720px)", height: "min(45vw, 720px)",
        top: "-22vw", left: "-22vw",
        opacity: 0.65,
        zIndex: 0,
      }} />
      <div aria-hidden className="gradient-blob gradient-blob-mint" style={{
        position: "fixed", pointerEvents: "none",
        width: "min(55vw, 880px)", height: "min(55vw, 880px)",
        bottom: "-32vw", right: "-28vw",
        opacity: 0.65,
        zIndex: 0,
      }} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <HeroScene />

      {/* ── 01 — Onboarding ──────────────────────────────────── */}
      <OnboardingScene />

      {/* ── 02 — Research ────────────────────────────────────── */}
      <ResearchScene />

      {/* ── 03 — Strategy ────────────────────────────────────── */}
      <StrategyScene />

      {/* ── 04 — Launch ──────────────────────────────────────── */}
      <LaunchScene />

      {/* ── 05 — Agentic infrastructure (21 agents) ──────────── */}
      <AgentRosterScene />

      {/* ── 06 — Optimisation pipeline ───────────────────────── */}
      <OptimisationScene />

      {/* ── 07 — Dashboard ───────────────────────────────────── */}
      <DashboardScene />

      {/* ── 08 — Humans in the loop ──────────────────────────── */}
      <ApprovalScene />

      {/* ── 09 — Why Mentic ──────────────────────────────────── */}
      <WhyScene />

      {/* ── CTA ──────────────────────────────────────────────── */}
      <CtaSection />
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────
   HERO — non-pinned, regular scroll
   ─────────────────────────────────────────────────────────── */
function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(ref);
  /* Fade the hero OUT as we scroll past it instead of in from invisible —
     so it's visible at page load and only dims as the user moves on. */
  const fadeOut = 1 - easeOutCubic(range(p, 0.4, 0.9));
  return (
    <div ref={ref} style={{ height: "130vh", position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, height: "100dvh",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "clamp(120px, 18vh, 200px) clamp(20px, 6vw, 96px) 0",
        opacity: 0.2 + 0.8 * fadeOut,
        transform: `translateY(${(1 - fadeOut) * -32}px)`,
        transition: "opacity 0.2s linear",
      }}>
        <div>
          <div className="intro-blur-in" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "6px 14px", borderRadius: 999,
            background: "rgba(0,60,70,0.06)",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.28em",
            textTransform: "uppercase", color: TEAL,
            animationDelay: "0.05s",
          }}>
            ◆ The product
          </div>
          <h1 style={{
            margin: "28px 0 0",
            fontSize: "clamp(44px, 8.5vw, 132px)",
            lineHeight: 0.95,
            fontWeight: 200,
            letterSpacing: "-0.025em",
            color: TEAL,
            maxWidth: 1200,
          }}>
            <span className="intro-blur-in" style={{ display: "block", fontWeight: 200, animationDelay: "0.15s" }}>Give Mentic</span>
            <span className="intro-blur-in" style={{ display: "block", fontWeight: 800, color: CORAL, animationDelay: "0.3s" }}>your URL.</span>
            <span className="intro-blur-in" style={{ display: "block", fontWeight: 200, animationDelay: "0.45s" }}>
              Get back an
              <span style={{ fontWeight: 800, color: TEAL }}> agency</span>.
            </span>
          </h1>
          <p className="intro-fade-up" style={{
            margin: "36px auto 0",
            maxWidth: 640,
            fontSize: "clamp(15px, 1.4vw, 20px)",
            fontWeight: 300,
            lineHeight: 1.6,
            color: TEAL_INK,
            animationDelay: "0.65s",
          }}>
            21 specialised agents read your business, design the strategy, launch campaigns on Meta
            and keep optimising — humans in the loop where it counts.
          </p>
          <div className="intro-fade-up" style={{
            marginTop: 44,
            display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
            animationDelay: "0.8s",
          }}>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={ctaTeal}>Book a demo</a>
            <a href="/#signup" style={ctaMint}>Sign up</a>
          </div>
        </div>
      </div>

      {/* Persistent scroll indicator at the bottom of the hero */}
      <ScrollHint label="Scroll for the deep dive" opacity={fadeOut} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   01 — Onboarding
   ─────────────────────────────────────────────────────────── */
function OnboardingScene() {
  return (
    <PinnedScene scrollHeight="280vh">
      {(p) => (
        <>
          <SectionHeader
            number="01"
            eyebrow="Onboarding"
            parts={[
              { text: "Paste a ", color: TEAL, weight: 200 },
              { text: "URL", color: CORAL, weight: 800 },
              { text: ". Get a ", color: TEAL, weight: 200 },
              { text: "business profile", color: TEAL, weight: 800 },
              { text: ".", color: TEAL, weight: 200 },
            ]}
            body="A senior strategist's intake — in under a minute. Niche, ICP, USP, location and the competitors a buyer would actually compare you to."
            p={p}
          />

          <div style={{
            marginTop: "clamp(36px, 5vh, 64px)",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
            gap: "clamp(24px, 4vw, 64px)",
            alignItems: "center",
          }} className="onboarding-grid">
            {/* Left — browser-style URL bar */}
            <div style={{
              background: "#ffffff",
              borderRadius: 22,
              padding: "clamp(18px, 2.4vw, 32px)",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,60,70,0.08), 0 40px 80px -20px rgba(0,60,70,0.18), 0 0 0 1px rgba(0,60,70,0.04)",
              ...scaleIn(p, 0.12, 0.32),
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 18 }}>
                <span style={{ width: 11, height: 11, borderRadius: 999, background: "#ff5f57" }} />
                <span style={{ width: 11, height: 11, borderRadius: 999, background: "#febc2e" }} />
                <span style={{ width: 11, height: 11, borderRadius: 999, background: "#28c840" }} />
              </div>
              <div style={{
                padding: "14px 18px",
                borderRadius: 12,
                background: CERAMIC,
                fontSize: "clamp(16px, 1.5vw, 22px)",
                fontWeight: 500,
                color: TEAL,
                letterSpacing: "-0.01em",
                minHeight: 56,
                display: "flex", alignItems: "center",
              }}>
                <ScrollTypewriter text="https://yourbrand.com" from={0.18} to={0.45} p={p} />
              </div>
              <div style={{
                marginTop: 16,
                display: "flex", alignItems: "center", gap: 10,
                fontSize: 12, fontWeight: 500, color: TEAL_MUTED,
                letterSpacing: "0.02em",
                ...fadeUp(p, 0.42, 0.52, 12),
              }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 18, height: 18, borderRadius: 999, background: MINT, color: TEAL,
                  flexShrink: 0,
                }}>
                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                That's the entire form.
              </div>
            </div>

            {/* Right — extracted profile cards, each appears in sequence */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: "Niche", value: "Skincare for sensitive skin", from: 0.45 },
                { label: "ICP", value: "Women, 28–44, busy professionals", from: 0.52 },
                { label: "USP", value: "Dermatologist-formulated · clean ingredients · no animal testing", from: 0.6 },
                { label: "Competitors", value: "Bioderma · La Roche-Posay · Drunk Elephant · 4 more", from: 0.68 },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    background: "#ffffff",
                    borderRadius: 14,
                    padding: "14px 18px",
                    boxShadow:
                      "0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,60,70,0.06), 0 0 0 1px rgba(0,60,70,0.04)",
                    ...fadeFrom("right", p, row.from, row.from + 0.12, 60),
                  }}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", color: CORAL, textTransform: "uppercase", marginBottom: 4 }}>
                    {row.label}
                  </div>
                  <div style={{ fontSize: "clamp(13px, 1.05vw, 16px)", fontWeight: 500, color: TEAL }}>
                    {row.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <style>{`
            @media (max-width: 880px) {
              .onboarding-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </>
      )}
    </PinnedScene>
  );
}

/* ─────────────────────────────────────────────────────────────
   02 — Research
   ─────────────────────────────────────────────────────────── */
function ResearchScene() {
  const cards = [
    { tag: "Market overview", body: "Category size, buyer intents, what they search for.", from: 0.18 },
    { tag: "Competitors", body: "Direct alternatives a real buyer compares you to — validated.", from: 0.24 },
    { tag: "Psychographics", body: "What they fear, what they're chasing, the lines they respond to.", from: 0.3 },
    { tag: "Channel intel", body: "Where this niche actually converts, with synergy notes.", from: 0.36 },
    { tag: "Ad-library scan", body: "Live read on what your competitors are running right now.", from: 0.42 },
    { tag: "Contrarian takes", body: "Where the category is mispositioned — and how to win.", from: 0.48 },
  ];
  return (
    <PinnedScene scrollHeight="280vh">
      {(p) => (
        <>
          <SectionHeader
            number="02"
            eyebrow="Research"
            parts={[
              { text: "Reads your ", color: TEAL, weight: 200 },
              { text: "market", color: TEAL, weight: 800 },
              { text: " before it spends a ", color: TEAL, weight: 200 },
              { text: "cent", color: CORAL, weight: 800 },
              { text: ".", color: TEAL, weight: 200 },
            ]}
            body="Two live rounds of web search plus a Meta Ad Library scan. The agent learns what your competitors are running, who your buyer is, and which channels actually convert in your niche."
            p={p}
          />
          <div style={{
            marginTop: "clamp(36px, 5vh, 56px)",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 14,
          }} className="research-grid">
            {cards.map((c) => (
              <div
                key={c.tag}
                style={{
                  background: "#ffffff",
                  borderRadius: 18,
                  padding: "clamp(16px, 1.8vw, 24px)",
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.04), 0 10px 24px rgba(0,60,70,0.06), 0 0 0 1px rgba(0,60,70,0.04)",
                  ...scaleIn(p, c.from, c.from + 0.14, 0.9, 26),
                }}
              >
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.22em",
                  color: CORAL, textTransform: "uppercase", marginBottom: 8,
                }}>
                  {c.tag}
                </div>
                <div style={{ fontSize: "clamp(13px, 1vw, 15px)", fontWeight: 400, lineHeight: 1.5, color: TEAL }}>
                  {c.body}
                </div>
              </div>
            ))}
          </div>
          <style>{`
            @media (max-width: 880px) { .research-grid { grid-template-columns: repeat(2, 1fr) !important; } }
            @media (max-width: 540px) { .research-grid { grid-template-columns: 1fr !important; } }
          `}</style>
        </>
      )}
    </PinnedScene>
  );
}

/* ─────────────────────────────────────────────────────────────
   03 — Strategy
   ─────────────────────────────────────────────────────────── */
function StrategyScene() {
  const phases = [
    "Data assembly",
    "Live market research",
    "Creative intelligence",
    "Platform selection",
    "Platform intelligence",
    "Funnel architecture",
    "Creative briefs",
    "Launch timeline",
  ];
  return (
    <PinnedScene scrollHeight="320vh">
      {(p) => (
        <>
          <SectionHeader
            number="03"
            eyebrow="Strategy"
            parts={[
              { text: "An ", color: TEAL, weight: 200 },
              { text: "8-phase pipeline", color: CORAL, weight: 800 },
              { text: " designs the ", color: TEAL, weight: 200 },
              { text: "funnel", color: TEAL, weight: 800 },
              { text: ".", color: TEAL, weight: 200 },
            ]}
            body="Not a black box. Mentic spells out platforms, layers, creative briefs and timeline before a single ad runs. Read it, edit it, ship it."
            p={p}
          />
          <div style={{
            marginTop: "clamp(36px, 5vh, 56px)",
            display: "grid",
            gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)",
            gap: "clamp(24px, 4vw, 64px)",
            alignItems: "center",
          }} className="strategy-grid">
            <ol style={{
              listStyle: "none", margin: 0, padding: 0,
              display: "flex", flexDirection: "column", gap: 8,
            }}>
              {phases.map((phase, i) => {
                /* each phase activates between 0.18 and 0.62 of progress */
                const phaseFrom = 0.18 + i * 0.05;
                const t = range(p, phaseFrom, phaseFrom + 0.04);
                const active = t > 0.5;
                return (
                  <li
                    key={phase}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "10px 16px",
                      borderRadius: 14,
                      background: active ? "rgba(139,242,211,0.22)" : "rgba(0,60,70,0.04)",
                      border: active ? "1px solid rgba(139,242,211,0.45)" : "1px solid rgba(0,60,70,0.06)",
                      transition: "background 0.4s ease, border-color 0.4s ease",
                      ...fadeFrom("left", p, phaseFrom - 0.04, phaseFrom + 0.02, 32),
                    }}
                  >
                    <span style={{
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 22, height: 22, borderRadius: 999,
                      background: active ? MINT : "rgba(0,60,70,0.08)",
                      color: TEAL, flexShrink: 0,
                      transition: "background 0.4s ease",
                    }}>
                      {active ? (
                        <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span style={{ fontSize: 10, fontWeight: 700, color: TEAL_MUTED }}>{i + 1}</span>
                      )}
                    </span>
                    <span style={{ fontSize: "clamp(13px, 1vw, 15px)", fontWeight: active ? 700 : 500, color: TEAL }}>
                      {phase}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div style={{
              position: "relative",
              borderRadius: 22,
              overflow: "hidden",
              aspectRatio: "1366 / 768",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.04), 0 14px 36px rgba(0,60,70,0.10), 0 50px 100px -20px rgba(0,60,70,0.22), 0 0 0 1px rgba(0,60,70,0.04)",
              ...scaleIn(p, 0.35, 0.62, 0.94, 40),
            }}>
              <Image
                src="/images/product-strategy.png"
                alt="Mentic strategy generation in progress"
                fill
                sizes="(max-width: 880px) 100vw, 60vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
          <style>{`
            @media (max-width: 880px) { .strategy-grid { grid-template-columns: 1fr !important; } }
          `}</style>
        </>
      )}
    </PinnedScene>
  );
}

/* ─────────────────────────────────────────────────────────────
   04 — Launch
   ─────────────────────────────────────────────────────────── */
function LaunchScene() {
  return (
    <PinnedScene scrollHeight="280vh">
      {(p) => (
        <>
          <SectionHeader
            number="04"
            eyebrow="Launch"
            parts={[
              { text: "Live ", color: TEAL, weight: 200 },
              { text: "Meta API", color: CORAL, weight: 800 },
              { text: ". Real ", color: TEAL, weight: 200 },
              { text: "ad accounts", color: TEAL, weight: 800 },
              { text: ".", color: TEAL, weight: 200 },
            ]}
            body="Mentic doesn't just recommend — it ships. A deterministic builder turns the strategy into campaigns, ad sets, creatives and ads with every Meta field sourced from our internal spec, and a validate-only preflight before money moves."
            p={p}
          />
          <div style={{
            marginTop: "clamp(36px, 5vh, 56px)",
            position: "relative",
            borderRadius: 24,
            overflow: "hidden",
            aspectRatio: "1366 / 768",
            maxWidth: 1180,
            margin: "clamp(36px, 5vh, 56px) auto 0",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 14px 36px rgba(0,60,70,0.10), 0 50px 100px -20px rgba(0,60,70,0.24), 0 0 0 1px rgba(0,60,70,0.04)",
            ...scaleIn(p, 0.2, 0.5, 0.9, 60),
          }}>
            <Image
              src="/images/product-campaigns.png"
              alt="Live Meta campaigns inside Mentic"
              fill
              sizes="(max-width: 1180px) 100vw, 1180px"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div style={{
            marginTop: 20,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(200px, 100%), 1fr))",
            gap: 12,
            maxWidth: 1180, marginLeft: "auto", marginRight: "auto",
          }}>
            {[
              { stat: "1", unit: "click", body: "Strategy → live campaigns on your ad account.", from: 0.5 },
              { stat: "validate", suffix: "_only", body: "Preflight every change before money moves.", from: 0.58 },
              { stat: "0", unit: "guessed values", body: "Every Meta API field sourced from the internal spec.", from: 0.66 },
            ].map((s, i) => (
              <div key={i} style={{
                padding: "16px 18px",
                borderRadius: 14,
                background: "#ffffff",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 20px rgba(0,60,70,0.05), 0 0 0 1px rgba(0,60,70,0.04)",
                ...scaleIn(p, s.from, s.from + 0.14, 0.92, 28),
              }}>
                <div style={{
                  fontSize: "clamp(22px, 2.4vw, 32px)", fontWeight: 800,
                  color: TEAL, letterSpacing: "-0.02em", lineHeight: 1,
                }}>
                  {s.stat}
                  {s.unit && <span style={{ color: TEAL_MUTED, fontWeight: 500, fontSize: 12, marginLeft: 6 }}>{s.unit}</span>}
                  {s.suffix && <span style={{ color: CORAL, fontWeight: 800, fontSize: "clamp(22px, 2.4vw, 32px)" }}>{s.suffix}</span>}
                </div>
                <p style={{ margin: "8px 0 0", fontSize: 13, color: TEAL_INK, lineHeight: 1.5 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </PinnedScene>
  );
}

/* ─────────────────────────────────────────────────────────────
   05 — 21-agent roster
   ─────────────────────────────────────────────────────────── */
const ROSTER: Array<{ name: string; status: "Built" | "MVP" | "Partial" | "Planned" }> = [
  { name: "Sidebar Assistant", status: "Built" },
  { name: "Research", status: "Built" },
  { name: "Meta Reactive Optimisation", status: "Built" },
  { name: "Creative Intelligence", status: "Built" },
  { name: "Advertising Strategy", status: "Built" },
  { name: "Competitive Creative Analyst", status: "MVP" },
  { name: "Optimisation Decision-Maker", status: "Partial" },
  { name: "Budget & Payment", status: "Partial" },
  { name: "Creative Generator", status: "Planned" },
  { name: "Predictive", status: "Planned" },
  { name: "Strategy Checker", status: "Planned" },
  { name: "Interpreter", status: "Planned" },
  { name: "Strategy Scheduling", status: "Planned" },
  { name: "Platform Differentiator", status: "Planned" },
  { name: "LinkedIn Reactive", status: "Planned" },
  { name: "Google Reactive", status: "Planned" },
  { name: "TikTok Reactive", status: "Planned" },
  { name: "YouTube Reactive", status: "Planned" },
  { name: "Snapchat Reactive", status: "Planned" },
  { name: "Pinterest Reactive", status: "Planned" },
  { name: "X / Twitter Reactive", status: "Planned" },
];

function statusStyle(s: "Built" | "MVP" | "Partial" | "Planned") {
  switch (s) {
    case "Built":   return { bg: "#003c46", color: "#f2f2f0", border: "transparent" };
    case "MVP":     return { bg: "rgba(139,242,211,0.35)", color: "#003c46", border: "rgba(139,242,211,0.7)" };
    case "Partial": return { bg: "rgba(255,107,92,0.18)", color: "#003c46", border: "rgba(255,107,92,0.5)" };
    case "Planned": return { bg: "rgba(0,60,70,0.05)", color: "rgba(0,60,70,0.7)", border: "rgba(0,60,70,0.1)" };
  }
}

function AgentRosterScene() {
  return (
    <PinnedScene scrollHeight="340vh">
      {(p) => (
        <>
          <SectionHeader
            number="05"
            eyebrow="The agentic infrastructure"
            parts={[
              { text: "21 ", color: CORAL, weight: 800 },
              { text: "specialised agents. ", color: TEAL, weight: 800 },
              { text: "One ", color: TEAL, weight: 200 },
              { text: "team", color: TEAL, weight: 800 },
              { text: ".", color: TEAL, weight: 200 },
            ]}
            body="Each agent owns a slice of the work — research, strategy, creative, platform reactive loops, budget, predictive — and reports to a central decision-maker that orders fixes by impact."
            p={p}
          />
          <div style={{
            marginTop: "clamp(28px, 4vh, 44px)",
            display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center",
            alignItems: "center", flexDirection: "row",
          }}>
            {/* Status legend */}
            {[
              { label: "Built", swatch: "#003c46" },
              { label: "MVP", swatch: "#8bf2d3" },
              { label: "Partial", swatch: "#ff6b5c" },
              { label: "Planned", swatch: "rgba(0,60,70,0.18)" },
            ].map((l, i) => (
              <div key={l.label} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
                textTransform: "uppercase", color: TEAL_MUTED,
                ...fadeUp(p, 0.05 + i * 0.02, 0.18 + i * 0.02, 12),
              }}>
                <span style={{ width: 10, height: 10, borderRadius: 999, background: l.swatch }} />
                {l.label}
              </div>
            ))}
          </div>

          <div className="agent-grid" style={{
            marginTop: "clamp(24px, 3vh, 36px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "clamp(8px, 1vw, 12px)",
          }}>
            {ROSTER.map((agent, i) => {
              const s = statusStyle(agent.status);
              const from = 0.18 + (i / ROSTER.length) * 0.5;
              return (
                <div
                  key={agent.name}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 14,
                    background: s.bg,
                    color: s.color,
                    border: `1px solid ${s.border}`,
                    fontSize: 12.5,
                    fontWeight: 600,
                    letterSpacing: "-0.005em",
                    lineHeight: 1.25,
                    minHeight: 56,
                    display: "flex", alignItems: "center",
                    ...scaleIn(p, from, from + 0.1, 0.85, 16),
                  }}
                >
                  {agent.name}
                </div>
              );
            })}
          </div>

          <style>{`
            @media (max-width: 640px) {
              .agent-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
          `}</style>
        </>
      )}
    </PinnedScene>
  );
}

/* ─────────────────────────────────────────────────────────────
   06 — Optimisation loop (5 sub-agents + coordinator)
   ─────────────────────────────────────────────────────────── */
function OptimisationScene() {
  const agents = [
    { name: "Budget", role: "Spend efficiency, ROI floor, bid logic.", color: "#ff6b5c", from: 0.2 },
    { name: "Audience", role: "Drift, lookalike fatigue, segment overlap.", color: "#003c46", from: 0.26 },
    { name: "Creative", role: "Ad fatigue, hooks, competitive freshness.", color: "#8bf2d3", from: 0.32 },
    { name: "Standards", role: "Meta policy, targeting guardrails.", color: "#ff6b5c", from: 0.38 },
    { name: "Reactive", role: "Diagnose zero-impression / zero-conversion runs.", color: "#003c46", from: 0.44 },
  ];
  return (
    <PinnedScene scrollHeight="320vh">
      {(p) => (
        <>
          <SectionHeader
            number="06"
            eyebrow="Optimisation loop"
            parts={[
              { text: "Five ", color: TEAL, weight: 200 },
              { text: "specialists", color: CORAL, weight: 800 },
              { text: ". One ", color: TEAL, weight: 200 },
              { text: "coordinator", color: TEAL, weight: 800 },
              { text: ".", color: TEAL, weight: 200 },
            ]}
            body="Inside the Meta reactive loop, five sub-agents watch their own slice of the account in parallel. A coordinator resolves their conflicts and orders fixes by impact before surfacing the recommendation to you."
            p={p}
          />
          <div style={{
            marginTop: "clamp(36px, 5vh, 56px)",
            background: "#ffffff",
            borderRadius: 24,
            padding: "clamp(28px, 4vw, 56px)",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 14px 36px rgba(0,60,70,0.10), 0 50px 100px -20px rgba(0,60,70,0.20), 0 0 0 1px rgba(0,60,70,0.04)",
            ...scaleIn(p, 0.12, 0.32, 0.94),
          }}>
            <div className="pipeline-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: "clamp(12px, 2vw, 24px)",
            }}>
              {agents.map((a) => (
                <div key={a.name} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
                  textAlign: "center",
                  ...scaleIn(p, a.from, a.from + 0.12, 0.7, 24),
                }}>
                  <div style={{
                    width: "clamp(60px, 7.4vw, 96px)",
                    height: "clamp(60px, 7.4vw, 96px)",
                    borderRadius: 999,
                    background: `radial-gradient(circle at 30% 25%, ${a.color}66, ${a.color} 75%)`,
                    boxShadow: "0 12px 28px rgba(0,60,70,0.18)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: TEAL,
                    fontSize: "clamp(10px, 0.95vw, 12px)",
                    fontWeight: 800, letterSpacing: "0.12em",
                    textTransform: "uppercase",
                  }}>
                    {a.name}
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: "clamp(10px, 0.85vw, 12px)",
                    fontWeight: 400, lineHeight: 1.4, color: TEAL_INK,
                    maxWidth: 160,
                  }}>
                    {a.role}
                  </p>
                </div>
              ))}
            </div>

            {/* Coordinator */}
            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 2, height: 40, background: TEAL,
                ...scaleIn(p, 0.55, 0.62, 0.1),
                transformOrigin: "top center",
              }} />
              <div style={{
                padding: "14px 24px",
                borderRadius: 999,
                background: TEAL, color: CERAMIC,
                fontSize: "clamp(11px, 1vw, 13px)",
                fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase",
                display: "inline-flex", alignItems: "center", gap: 10,
                boxShadow: "0 12px 28px rgba(0,60,70,0.25)",
                ...scaleIn(p, 0.6, 0.72, 0.7, 24),
              }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: MINT }} />
                Coordinator
              </div>
              <p style={{
                margin: "6px auto 0", maxWidth: 480,
                fontSize: "clamp(11px, 0.95vw, 13px)", color: TEAL_INK, textAlign: "center", lineHeight: 1.5,
                ...fadeUp(p, 0.68, 0.78, 16),
              }}>
                Resolves conflicts, orders fixes by impact, asks you to approve the writes that matter.
              </p>
            </div>
          </div>
          <style>{`
            @media (max-width: 720px) { .pipeline-grid { grid-template-columns: repeat(2, 1fr) !important; } }
            @media (max-width: 420px) { .pipeline-grid { grid-template-columns: 1fr !important; } }
          `}</style>
        </>
      )}
    </PinnedScene>
  );
}

/* ─────────────────────────────────────────────────────────────
   07 — Dashboard
   ─────────────────────────────────────────────────────────── */
function DashboardScene() {
  return (
    <PinnedScene scrollHeight="240vh">
      {(p) => (
        <>
          <SectionHeader
            number="07"
            eyebrow="Dashboard"
            parts={[
              { text: "All the ", color: TEAL, weight: 200 },
              { text: "metrics", color: TEAL, weight: 800 },
              { text: " that matter. ", color: TEAL, weight: 200 },
              { text: "None ", color: CORAL, weight: 800 },
              { text: "of the noise.", color: TEAL, weight: 200 },
            ]}
            body="One page tells you whether your money is working: active spend, results, cost-per-result, CTR and the trend underneath. Health flags surface what to look at first."
            p={p}
          />
          <div style={{
            marginTop: "clamp(36px, 5vh, 56px)",
            position: "relative",
            borderRadius: 24,
            overflow: "hidden",
            aspectRatio: "1366 / 768",
            maxWidth: 1180,
            margin: "clamp(36px, 5vh, 56px) auto 0",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 14px 36px rgba(0,60,70,0.10), 0 50px 100px -20px rgba(0,60,70,0.24), 0 0 0 1px rgba(0,60,70,0.04)",
            ...scaleIn(p, 0.18, 0.5, 0.9, 60),
          }}>
            <Image
              src="/images/product-dashboard.png"
              alt="Mentic dashboard — overview of live campaigns"
              fill
              sizes="(max-width: 1180px) 100vw, 1180px"
              style={{ objectFit: "cover" }}
            />
          </div>
        </>
      )}
    </PinnedScene>
  );
}

/* ─────────────────────────────────────────────────────────────
   08 — Humans in the loop
   ─────────────────────────────────────────────────────────── */
function ApprovalScene() {
  return (
    <PinnedScene scrollHeight="280vh">
      {(p) => (
        <>
          <SectionHeader
            number="08"
            eyebrow="Humans in the loop"
            parts={[
              { text: "Approve ", color: TEAL, weight: 200 },
              { text: "from your", color: TEAL, weight: 800 },
              { text: " chat", color: CORAL, weight: 800 },
              { text: ".", color: TEAL, weight: 200 },
            ]}
            body="Nothing big ships without you. Mentic asks for approval in Slack, Telegram or its sidebar chat — with a one-line summary of what, why, and the exact changes — before scaling, pausing or creating anything new."
            p={p}
          />
          <div className="approval-grid" style={{
            marginTop: "clamp(36px, 5vh, 56px)",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
            gap: "clamp(20px, 3vw, 36px)",
            alignItems: "start",
          }}>
            <SlackApprovalCard p={p} fromTitle={0.18} fromBody={0.26} fromActions={0.35} />
            <TelegramApprovalCard p={p} fromTitle={0.42} fromBody={0.5} fromActions={0.58} />
          </div>
          <style>{`
            @media (max-width: 880px) { .approval-grid { grid-template-columns: 1fr !important; } }
          `}</style>
        </>
      )}
    </PinnedScene>
  );
}

function SlackApprovalCard({ p, fromTitle, fromBody, fromActions }: { p: number; fromTitle: number; fromBody: number; fromActions: number }) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 20,
      padding: "clamp(18px, 2vw, 26px)",
      boxShadow:
        "0 1px 2px rgba(0,0,0,0.04), 0 14px 36px rgba(0,60,70,0.10), 0 50px 100px -20px rgba(0,60,70,0.20), 0 0 0 1px rgba(0,60,70,0.04)",
      ...fadeFrom("left", p, fromTitle, fromTitle + 0.14, 60),
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <svg width={20} height={20} viewBox="0 0 24 24" fill="#003c46" aria-hidden>
          <path d="M5.042 15.165a2.528 2.528 0 1 1-2.52-2.528h2.52v2.528zm1.27 0a2.528 2.528 0 1 1 5.055 0v6.307A2.528 2.528 0 1 1 6.31 21.472v-6.307zM8.835 5.042a2.528 2.528 0 1 1 2.528-2.52v2.52H8.836zm0 1.27a2.528 2.528 0 1 1 0 5.055H2.523a2.528 2.528 0 1 1 0-5.056h6.312zm10.122 2.523a2.528 2.528 0 1 1 2.52 2.528h-2.52V8.835zm-1.27 0a2.528 2.528 0 1 1-5.055 0V2.528a2.528 2.528 0 1 1 5.055 0v6.307zm-2.527 10.122a2.528 2.528 0 1 1-2.528 2.52v-2.52h2.528zm0-1.27a2.528 2.528 0 1 1 0-5.055h6.31a2.528 2.528 0 1 1 0 5.056h-6.31z" />
        </svg>
        <span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>#mentic — Slack</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{
          flexShrink: 0,
          width: 30, height: 30, borderRadius: 8, background: CORAL,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 13, fontWeight: 800,
        }}>M</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: TEAL }}>Mentic</span>
            <span style={{ fontSize: 10, color: TEAL_MUTED }}>APP · 11:42 AM</span>
          </div>
          <p style={{
            margin: 0,
            fontSize: 13.5, fontWeight: 500, color: TEAL, lineHeight: 1.5,
            ...fadeUp(p, fromBody, fromBody + 0.1, 16),
          }}>
            About to scale <strong style={{ color: CORAL }}>PostExhibition · Leads</strong> from
            <span style={{ display: "inline-block", margin: "0 4px", padding: "2px 8px", borderRadius: 6, background: "rgba(0,60,70,0.06)", fontSize: 12, fontWeight: 600 }}>$40/day</span>
            to
            <span style={{ display: "inline-block", margin: "0 4px", padding: "2px 8px", borderRadius: 6, background: "rgba(139,242,211,0.25)", fontSize: 12, fontWeight: 700, color: TEAL }}>$80/day</span>
            after CPL dropped 38% over 3 days.
          </p>
          <div style={{
            marginTop: 12, display: "flex", gap: 8,
            ...fadeUp(p, fromActions, fromActions + 0.1, 16),
          }}>
            <span style={chipBtn(MINT, TEAL)}>Approve</span>
            <span style={chipBtn("rgba(0,60,70,0.06)", TEAL)}>Hold</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TelegramApprovalCard({ p, fromTitle, fromBody, fromActions }: { p: number; fromTitle: number; fromBody: number; fromActions: number }) {
  return (
    <div style={{
      background: "#ffffff",
      borderRadius: 20,
      padding: "clamp(18px, 2vw, 26px)",
      boxShadow:
        "0 1px 2px rgba(0,0,0,0.04), 0 14px 36px rgba(0,60,70,0.10), 0 50px 100px -20px rgba(0,60,70,0.20), 0 0 0 1px rgba(0,60,70,0.04)",
      ...fadeFrom("right", p, fromTitle, fromTitle + 0.14, 60),
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <svg width={20} height={20} viewBox="0 0 24 24" fill="#003c46" aria-hidden>
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.643.135-.953l11.566-4.458c.538-.196 1.006.128.832.94z" />
        </svg>
        <span style={{ fontSize: 12, fontWeight: 700, color: TEAL }}>Telegram — DM</span>
      </div>
      <div style={{
        background: "rgba(139,242,211,0.18)",
        borderRadius: 16,
        padding: "12px 14px",
        maxWidth: "92%",
        marginLeft: "auto",
        ...fadeUp(p, fromBody, fromBody + 0.1, 18),
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: TEAL, marginBottom: 8, letterSpacing: "0.02em" }}>
          New creative for review
        </div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 500, color: TEAL, lineHeight: 1.5 }}>
          Audience-Agent flagged hook fatigue on <strong>Variation B</strong>.
          Drafted three new openings — want me to ship the top-scoring one to a 5% test budget?
        </p>
        <div style={{
          marginTop: 10, display: "flex", gap: 8,
          ...fadeUp(p, fromActions, fromActions + 0.1, 14),
        }}>
          <span style={chipBtn(TEAL, CERAMIC)}>Ship it</span>
          <span style={chipBtn("rgba(0,60,70,0.08)", TEAL)}>Show me first</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 10, color: TEAL_MUTED, textAlign: "right" }}>11:43</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   09 — Why Mentic
   ─────────────────────────────────────────────────────────── */
function WhyScene() {
  const cards = [
    {
      title: "vs. a human media buyer",
      body: "No retainer, no hiring cycle, no vacation. Mentic runs 24/7, ships more experiments than a team can, stays cheaper than one optimisation hire.",
      accent: CORAL, from: 0.18,
    },
    {
      title: "vs. AdCreative / Pencil",
      body: "Those tools generate creatives. Mentic researches, strategises, launches, optimises and learns — creative briefs are the output, not the whole product.",
      accent: TEAL, from: 0.28,
    },
    {
      title: "vs. Smartly / Albert",
      body: "Enterprise-only pricing replaced by SMB-native. Live Meta API write-access. 8-phase strategy you can actually read. No $10K/month floor.",
      accent: MINT, from: 0.38,
    },
  ];
  return (
    <PinnedScene scrollHeight="240vh">
      {(p) => (
        <>
          <SectionHeader
            number="09"
            eyebrow="Why Mentic"
            parts={[
              { text: "Built ", color: TEAL, weight: 200 },
              { text: "different", color: CORAL, weight: 800 },
              { text: " — on purpose.", color: TEAL, weight: 200 },
            ]}
            p={p}
          />
          <div className="why-grid" style={{
            marginTop: "clamp(28px, 4vh, 48px)",
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: "clamp(14px, 2vw, 22px)",
          }}>
            {cards.map((card) => (
              <div key={card.title} style={{
                background: "#ffffff",
                borderRadius: 20,
                padding: "clamp(20px, 2.4vw, 32px)",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.04), 0 10px 28px rgba(0,60,70,0.07), 0 0 0 1px rgba(0,60,70,0.04)",
                display: "flex", flexDirection: "column", gap: 12,
                ...scaleIn(p, card.from, card.from + 0.16, 0.92, 30),
              }}>
                <div style={{ width: 36, height: 4, borderRadius: 999, background: card.accent }} />
                <h3 style={{
                  margin: 0,
                  fontSize: "clamp(16px, 1.5vw, 21px)",
                  fontWeight: 700, color: TEAL, letterSpacing: "-0.005em",
                }}>
                  {card.title}
                </h3>
                <p style={{
                  margin: 0,
                  fontSize: "clamp(13px, 1vw, 15px)",
                  fontWeight: 400, lineHeight: 1.55, color: TEAL_INK,
                }}>
                  {card.body}
                </p>
              </div>
            ))}
          </div>
          <style>{`
            @media (max-width: 880px) { .why-grid { grid-template-columns: 1fr !important; } }
          `}</style>
        </>
      )}
    </PinnedScene>
  );
}

/* ─────────────────────────────────────────────────────────────
   Closing CTA — not pinned
   ─────────────────────────────────────────────────────────── */
function CtaSection() {
  const ref = useRef<HTMLDivElement>(null);
  const p = useScrollProgress(ref);
  return (
    <div ref={ref} style={{ height: "110vh", position: "relative" }}>
      <div style={{
        position: "sticky", top: 0, height: "100dvh",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "clamp(80px, 12vh, 140px) clamp(20px, 6vw, 96px)",
      }}>
        <div>
          <h2 style={{
            margin: 0,
            fontSize: "clamp(40px, 6.4vw, 96px)",
            lineHeight: 0.98,
            fontWeight: 200,
            letterSpacing: "-0.02em",
            color: TEAL,
          }}>
            <span style={{ display: "block", fontWeight: 200, ...fadeBlur(p, 0, 0.25) }}>One URL.</span>
            <span style={{ display: "block", fontWeight: 800, color: CORAL, ...fadeBlur(p, 0.08, 0.32) }}>One team of agents.</span>
            <span style={{ display: "block", fontWeight: 200, ...fadeBlur(p, 0.18, 0.42) }}>Your whole funnel.</span>
          </h2>
          <p style={{
            margin: "28px auto 0",
            maxWidth: 540,
            fontSize: "clamp(15px, 1.3vw, 18px)",
            fontWeight: 300,
            lineHeight: 1.55,
            color: TEAL_INK,
            ...fadeBlur(p, 0.3, 0.48, 14, 8),
          }}>
            Onboarding pilot users now — $997/month including every agency service from EXQDigital free during alpha.
          </p>
          <div style={{
            marginTop: 44,
            display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
            ...fadeUp(p, 0.4, 0.6, 24),
          }}>
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={ctaTeal}>
              Book a demo
            </a>
            <Link href="/pricing" style={ctaOutlined}>See pricing</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Inline button styles
   ─────────────────────────────────────────────────────────── */
const ctaTeal: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  padding: "16px 30px", borderRadius: 999,
  background: TEAL, color: CERAMIC,
  fontSize: 13, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
  textDecoration: "none",
};
const ctaMint: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  padding: "16px 30px", borderRadius: 999,
  background: MINT, color: TEAL,
  fontSize: 13, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
  textDecoration: "none",
};
const ctaOutlined: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  padding: "16px 30px", borderRadius: 999,
  background: "transparent", color: TEAL,
  border: `1.5px solid ${TEAL}`,
  fontSize: 13, fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase",
  textDecoration: "none",
};
function chipBtn(bg: string, fg: string): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    padding: "6px 14px", borderRadius: 999,
    background: bg, color: fg,
    fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
  };
}
