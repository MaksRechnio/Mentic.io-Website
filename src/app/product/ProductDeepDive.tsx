"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteMenu from "@/components/SiteMenu";
import { trackSchedule, trackViewContent } from "@/lib/pixel";

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
  "https://calendly.com/maksymilian-mentic/mentic-io-demo-onboarding-meeting";

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
   Hook: viewport-based mobile detection. Returns false on the
   server / before mount so SSR matches the desktop render, then
   flips on mount if the viewport is narrower than `breakpoint`.
   ─────────────────────────────────────────────────────────── */
function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < breakpoint);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [breakpoint]);
  return isMobile;
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
  const isMobile = useIsMobile();
  const hintOpacity = 1 - easeOutCubic(range(progress, 0.72, 0.95));

  /* Mobile: render flat, stacked, no sticky. Pass p=1 so every scroll-driven
     reveal is in its fully-revealed state. The scene becomes a normal
     full-bleed section that scrolls naturally with the rest of the page. */
  if (isMobile) {
    return (
      <section className="relative w-full px-[clamp(20px,5vw,32px)] py-[clamp(64px,9vh,96px)]">
        <div className="mx-auto w-full max-w-[720px]">
          {children(1)}
        </div>
      </section>
    );
  }

  return (
    <div ref={ref} className="relative" style={{ height: scrollHeight }}>
      <div className="sticky top-0 flex h-[100dvh] w-full items-center justify-center overflow-hidden">
        <div className="w-full max-w-[1400px] px-[clamp(20px,6vw,96px)] pt-[clamp(80px,12vh,140px)] pb-[clamp(60px,10vh,100px)]">
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
    <div
      className="pointer-events-none absolute bottom-[clamp(20px,4vh,36px)] left-1/2 z-[2] inline-flex -translate-x-1/2 flex-col items-center gap-2 text-dark-teal/55 transition-opacity duration-[250ms] ease-linear"
      style={{ opacity: clamp(opacity, 0, 1) }}
    >
      <span className="whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.3em]">
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
    <div className="section-head grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] items-start gap-[clamp(20px,3vw,64px)]">
      <div style={fadeUp(p, 0, 0.12)}>
        <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-coral">
          {number} ◆ {eyebrow}
        </div>
        <div className="mt-3.5 h-px max-w-[80px] bg-dark-teal/12" />
      </div>
      <div>
        <h2
          className="m-0 text-[clamp(28px,4.6vw,64px)] leading-[1.06] tracking-[-0.02em] text-dark-teal"
          style={fadeBlur(p, 0.02, 0.18)}
        >
          {parts.map((part, i) => (
            <span key={i} style={{ fontWeight: part.weight, color: part.color }}>{part.text}</span>
          ))}
        </h2>
        {body && (
          <p
            className="mt-[18px] mb-0 max-w-[720px] text-[clamp(15px,1.2vw,18px)] font-light leading-[1.6] text-dark-teal/72"
            style={fadeUp(p, 0.06, 0.22, 24)}
          >
            {body}
          </p>
        )}
      </div>

      <style jsx>{`
        @media (max-width: 1023px) {
          .section-head {
            grid-template-columns: 1fr !important;
            gap: 18px !important;
          }
        }
      `}</style>
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
    <span className="font-[ui-monospace,SFMono-Regular,Menlo,monospace]">
      {text.slice(0, shown)}
      {shown < text.length && <span className="typewriter-caret" />}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main component
   ─────────────────────────────────────────────────────────── */
export default function ProductDeepDive() {
  useEffect(() => {
    trackViewContent({
      content_name: "Product deep dive",
      content_category: "product",
      content_type: "page",
    });
  }, []);

  return (
    <main className="use-native-cursor relative w-full bg-[#f2f2f0] font-sans text-dark-teal">
      {/* No overflow:hidden — would break position:sticky inside */}
      <SiteMenu />

      {/* Global corner blobs — fixed so they bleed continuously */}
      <div aria-hidden className="gradient-blob gradient-blob-coral pointer-events-none fixed! top-[-22vw] left-[-22vw] z-0 h-[min(45vw,720px)] w-[min(45vw,720px)] opacity-65" />
      <div aria-hidden className="gradient-blob gradient-blob-mint pointer-events-none fixed! right-[-28vw] bottom-[-32vw] z-0 h-[min(55vw,880px)] w-[min(55vw,880px)] opacity-65" />

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
  const isMobile = useIsMobile();
  /* Fade the hero OUT as we scroll past it instead of in from invisible —
     so it's visible at page load and only dims as the user moves on. */
  const fadeOut = 1 - easeOutCubic(range(p, 0.4, 0.9));
  const outerStyle: React.CSSProperties = isMobile
    ? { position: "relative", padding: "clamp(120px, 16vh, 180px) clamp(20px, 5vw, 32px) clamp(48px, 8vh, 72px)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", minHeight: "auto" }
    : {
        position: "sticky", top: 0, height: "100dvh",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "clamp(120px, 18vh, 200px) clamp(20px, 6vw, 96px) 0",
        opacity: 0.2 + 0.8 * fadeOut,
        transform: `translateY(${(1 - fadeOut) * -32}px)`,
        transition: "opacity 0.2s linear",
      };
  return (
    <div ref={ref} className="relative" style={{ height: isMobile ? "auto" : "130vh" }}>
      <div style={outerStyle}>
        <div>
          <div
            className="intro-blur-in inline-flex items-center gap-2.5 rounded-full bg-dark-teal/6 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-dark-teal"
            style={{ animationDelay: "0.05s" }}
          >
            ◆ The product
          </div>
          <h1 className="mx-0 mt-7 mb-0 max-w-[1200px] text-[clamp(44px,8.5vw,132px)] font-extralight leading-[0.95] tracking-[-0.025em] text-dark-teal">
            <span className="intro-blur-in block font-extralight" style={{ animationDelay: "0.15s" }}>Give Mentic</span>
            <span className="intro-blur-in block font-extrabold text-coral" style={{ animationDelay: "0.3s" }}>your URL.</span>
            <span className="intro-blur-in block font-extralight" style={{ animationDelay: "0.45s" }}>
              Get back an
              <span className="font-extrabold text-dark-teal"> agency</span>.
            </span>
          </h1>
          <p
            className="intro-fade-up mx-auto mt-9 mb-0 max-w-[640px] text-[clamp(15px,1.4vw,20px)] font-light leading-[1.6] text-dark-teal/72"
            style={{ animationDelay: "0.65s" }}
          >
            21 specialised agents read your business, design the strategy, launch campaigns on Meta
            and keep optimising — humans in the loop where it counts.
          </p>
          <div
            className="intro-fade-up mt-11 flex flex-wrap justify-center gap-3"
            style={{ animationDelay: "0.8s" }}
          >
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className={ctaTeal}
              onClick={() => trackSchedule({ content_name: "Book a demo — product hero", source: "product_hero" })}
            >Book a demo</a>
            <a href="/#signup" className={ctaMint}>Sign up</a>
          </div>
        </div>
      </div>

      {/* Persistent scroll indicator at the bottom of the hero — desktop only */}
      {!isMobile && <ScrollHint label="Scroll for the deep dive" opacity={fadeOut} />}
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

          <div className="onboarding-grid mt-[clamp(36px,5vh,64px)] grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-center gap-[clamp(24px,4vw,64px)]">
            {/* Left — browser-style URL bar */}
            <div
              className="rounded-[22px] bg-white p-[clamp(18px,2.4vw,32px)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,60,70,0.08),0_40px_80px_-20px_rgba(0,60,70,0.18),0_0_0_1px_rgba(0,60,70,0.04)]"
              style={scaleIn(p, 0.12, 0.32)}
            >
              <div className="mb-[18px] flex items-center gap-1.5">
                <span className="h-[11px] w-[11px] rounded-full bg-[#ff5f57]" />
                <span className="h-[11px] w-[11px] rounded-full bg-[#febc2e]" />
                <span className="h-[11px] w-[11px] rounded-full bg-[#28c840]" />
              </div>
              <div className="flex min-h-[56px] items-center rounded-xl bg-[#f2f2f0] px-[18px] py-3.5 text-[clamp(16px,1.5vw,22px)] font-medium tracking-[-0.01em] text-dark-teal">
                <ScrollTypewriter text="https://yourbrand.com" from={0.18} to={0.45} p={p} />
              </div>
              <div
                className="mt-4 flex items-center gap-2.5 text-[12px] font-medium tracking-[0.02em] text-dark-teal/55"
                style={fadeUp(p, 0.42, 0.52, 12)}
              >
                <span className="inline-flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full bg-mint text-dark-teal">
                  <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                That's the entire form.
              </div>
            </div>

            {/* Right — extracted profile cards, each appears in sequence */}
            <div className="flex flex-col gap-3">
              {[
                { label: "Niche", value: "Skincare for sensitive skin", from: 0.45 },
                { label: "ICP", value: "Women, 28–44, busy professionals", from: 0.52 },
                { label: "USP", value: "Dermatologist-formulated · clean ingredients · no animal testing", from: 0.6 },
                { label: "Competitors", value: "Bioderma · La Roche-Posay · Drunk Elephant · 4 more", from: 0.68 },
              ].map((row) => (
                <div
                  key={row.label}
                  className="rounded-[14px] bg-white px-[18px] py-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,60,70,0.06),0_0_0_1px_rgba(0,60,70,0.04)]"
                  style={fadeFrom("right", p, row.from, row.from + 0.12, 60)}
                >
                  <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.24em] text-coral">
                    {row.label}
                  </div>
                  <div className="text-[clamp(13px,1.05vw,16px)] font-medium text-dark-teal">
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
          <div className="research-grid mt-[clamp(36px,5vh,56px)] grid grid-cols-[repeat(3,minmax(0,1fr))] gap-3.5">
            {cards.map((c) => (
              <div
                key={c.tag}
                className="rounded-[18px] bg-white p-[clamp(16px,1.8vw,24px)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_24px_rgba(0,60,70,0.06),0_0_0_1px_rgba(0,60,70,0.04)]"
                style={scaleIn(p, c.from, c.from + 0.14, 0.9, 26)}
              >
                <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-coral">
                  {c.tag}
                </div>
                <div className="text-[clamp(13px,1vw,15px)] font-normal leading-[1.5] text-dark-teal">
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
          <div className="strategy-grid mt-[clamp(36px,5vh,56px)] grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-[clamp(24px,4vw,64px)]">
            <ol className="m-0 flex list-none flex-col gap-2 p-0">
              {phases.map((phase, i) => {
                /* each phase activates between 0.18 and 0.62 of progress */
                const phaseFrom = 0.18 + i * 0.05;
                const t = range(p, phaseFrom, phaseFrom + 0.04);
                const active = t > 0.5;
                return (
                  <li
                    key={phase}
                    className="flex items-center gap-3.5 rounded-[14px] px-4 py-2.5 transition-[background,border-color] duration-[400ms] ease-[ease]"
                    style={{
                      background: active ? "rgba(139,242,211,0.22)" : "rgba(0,60,70,0.04)",
                      border: active ? "1px solid rgba(139,242,211,0.45)" : "1px solid rgba(0,60,70,0.06)",
                      ...fadeFrom("left", p, phaseFrom - 0.04, phaseFrom + 0.02, 32),
                    }}
                  >
                    <span
                      className="inline-flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-full text-dark-teal transition-[background] duration-[400ms] ease-[ease]"
                      style={{ background: active ? MINT : "rgba(0,60,70,0.08)" }}
                    >
                      {active ? (
                        <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <span className="text-[10px] font-bold text-dark-teal/55">{i + 1}</span>
                      )}
                    </span>
                    <span className="text-[clamp(13px,1vw,15px)] text-dark-teal" style={{ fontWeight: active ? 700 : 500 }}>
                      {phase}
                    </span>
                  </li>
                );
              })}
            </ol>

            <div
              className="relative mx-auto aspect-[1366/768] w-full max-w-[min(100%,calc((48vh)*1366/768))] overflow-hidden rounded-[22px] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_36px_rgba(0,60,70,0.10),0_50px_100px_-20px_rgba(0,60,70,0.22),0_0_0_1px_rgba(0,60,70,0.04)]"
              style={scaleIn(p, 0.35, 0.62, 0.94, 40)}
            >
              <Image
                src="/images/product-strategy.png"
                alt="Mentic strategy generation in progress"
                fill
                sizes="(max-width: 880px) 100vw, 60vw"
                className="object-cover"
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
            body="Mentic doesn't just recommend — it ships. Your strategy becomes campaigns, ad sets, creatives and ads, launched directly on your ad account through the official Meta API."
            p={p}
          />
          <div
            className="relative mx-auto mt-[clamp(24px,4vh,40px)] aspect-[1366/768] w-full max-w-[min(1180px,calc((42vh)*1366/768))] overflow-hidden rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_36px_rgba(0,60,70,0.10),0_50px_100px_-20px_rgba(0,60,70,0.24),0_0_0_1px_rgba(0,60,70,0.04)]"
            style={scaleIn(p, 0.2, 0.5, 0.9, 60)}
          >
            <Image
              src="/images/product-campaigns.png"
              alt="Live Meta campaigns inside Mentic"
              fill
              sizes="(max-width: 1180px) 100vw, 1180px"
              className="object-cover"
            />
          </div>
          <div className="mx-auto mt-5 grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-3">
            {[
              { stat: "1", unit: "click", body: "Strategy → live campaigns on your ad account.", from: 0.5 },
            ].map((s, i) => (
              <div
                key={i}
                className="rounded-[14px] bg-white px-[18px] py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,60,70,0.05),0_0_0_1px_rgba(0,60,70,0.04)]"
                style={scaleIn(p, s.from, s.from + 0.14, 0.92, 28)}
              >
                <div className="text-[clamp(22px,2.4vw,32px)] font-extrabold leading-none tracking-[-0.02em] text-dark-teal">
                  {s.stat}
                  {s.unit && <span className="ml-1.5 text-[12px] font-medium text-dark-teal/55">{s.unit}</span>}
                </div>
                <p className="mt-2 mb-0 text-[13px] leading-[1.5] text-dark-teal/72">{s.body}</p>
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
const ROSTER: Array<{ name: string; status: "Built" | "MVP" | "Planned" }> = [
  { name: "Sidebar Assistant", status: "Built" },
  { name: "Research", status: "Built" },
  { name: "Meta Reactive Optimisation", status: "Built" },
  { name: "Creative Intelligence", status: "Built" },
  { name: "Advertising Strategy", status: "Built" },
  { name: "Competitive Creative Analyst", status: "MVP" },
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

function statusStyle(s: "Built" | "MVP" | "Planned") {
  switch (s) {
    case "Built":   return { bg: "#003c46", color: "#f2f2f0", border: "transparent" };
    case "MVP":     return { bg: "rgba(139,242,211,0.35)", color: "#003c46", border: "rgba(139,242,211,0.7)" };
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
              { text: "19 ", color: CORAL, weight: 800 },
              { text: "specialised agents. ", color: TEAL, weight: 800 },
              { text: "One ", color: TEAL, weight: 200 },
              { text: "team", color: TEAL, weight: 800 },
              { text: ".", color: TEAL, weight: 200 },
            ]}
            body="Each agent owns a slice of the work — research, strategy, creative, platform reactive loops, budget, predictive — and reports to a central decision-maker that orders fixes by impact."
            p={p}
          />
          <div className="mt-[clamp(28px,4vh,44px)] flex flex-row flex-wrap items-center justify-center gap-3.5">
            {/* Status legend */}
            {[
              { label: "Built", swatch: "#003c46" },
              { label: "MVP", swatch: "#8bf2d3" },
              { label: "Planned", swatch: "rgba(0,60,70,0.18)" },
            ].map((l, i) => (
              <div
                key={l.label}
                className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-dark-teal/55"
                style={fadeUp(p, 0.05 + i * 0.02, 0.18 + i * 0.02, 12)}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.swatch }} />
                {l.label}
              </div>
            ))}
          </div>

          <div className="agent-grid mt-[clamp(24px,3vh,36px)] grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-[clamp(8px,1vw,12px)]">
            {ROSTER.map((agent, i) => {
              const s = statusStyle(agent.status);
              const from = 0.18 + (i / ROSTER.length) * 0.5;
              return (
                <div
                  key={agent.name}
                  className="flex min-h-[56px] items-center rounded-[14px] px-3.5 py-3 text-[12.5px] font-semibold leading-[1.25] tracking-[-0.005em]"
                  style={{
                    background: s.bg,
                    color: s.color,
                    border: `1px solid ${s.border}`,
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
          <div
            className="mt-[clamp(36px,5vh,56px)] rounded-3xl bg-white p-[clamp(28px,4vw,56px)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_36px_rgba(0,60,70,0.10),0_50px_100px_-20px_rgba(0,60,70,0.20),0_0_0_1px_rgba(0,60,70,0.04)]"
            style={scaleIn(p, 0.12, 0.32, 0.94)}
          >
            <div className="pipeline-grid grid grid-cols-[repeat(5,minmax(0,1fr))] gap-[clamp(12px,2vw,24px)]">
              {agents.map((a) => (
                <div
                  key={a.name}
                  className="flex flex-col items-center gap-3 text-center"
                  style={scaleIn(p, a.from, a.from + 0.12, 0.7, 24)}
                >
                  <div
                    className="flex h-[clamp(60px,7.4vw,96px)] w-[clamp(60px,7.4vw,96px)] items-center justify-center rounded-full text-[clamp(10px,0.95vw,12px)] font-extrabold uppercase tracking-[0.12em] text-dark-teal shadow-[0_12px_28px_rgba(0,60,70,0.18)]"
                    style={{ background: `radial-gradient(circle at 30% 25%, ${a.color}66, ${a.color} 75%)` }}
                  >
                    {a.name}
                  </div>
                  <p className="m-0 max-w-[160px] text-[clamp(10px,0.85vw,12px)] font-normal leading-[1.4] text-dark-teal/72">
                    {a.role}
                  </p>
                </div>
              ))}
            </div>

            {/* Coordinator */}
            <div className="mt-8 flex flex-col items-center gap-3">
              <div
                className="h-10 w-0.5 origin-top bg-dark-teal"
                style={scaleIn(p, 0.55, 0.62, 0.1)}
              />
              <div
                className="inline-flex items-center gap-2.5 rounded-full bg-dark-teal px-6 py-3.5 text-[clamp(11px,1vw,13px)] font-extrabold uppercase tracking-[0.2em] text-[#f2f2f0] shadow-[0_12px_28px_rgba(0,60,70,0.25)]"
                style={scaleIn(p, 0.6, 0.72, 0.7, 24)}
              >
                <span className="h-2 w-2 rounded-full bg-mint" />
                Coordinator
              </div>
              <p
                className="mx-auto mt-1.5 mb-0 max-w-[480px] text-center text-[clamp(11px,0.95vw,13px)] leading-[1.5] text-dark-teal/72"
                style={fadeUp(p, 0.68, 0.78, 16)}
              >
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
          <div
            className="relative mx-auto mt-[clamp(24px,4vh,40px)] aspect-[1366/768] w-full max-w-[min(1180px,calc((48vh)*1366/768))] overflow-hidden rounded-3xl shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_36px_rgba(0,60,70,0.10),0_50px_100px_-20px_rgba(0,60,70,0.24),0_0_0_1px_rgba(0,60,70,0.04)]"
            style={scaleIn(p, 0.18, 0.5, 0.9, 60)}
          >
            <Image
              src="/images/product-dashboard.png"
              alt="Mentic dashboard — overview of live campaigns"
              fill
              sizes="(max-width: 1180px) 100vw, 1180px"
              className="object-cover"
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
          <div className="approval-grid mt-[clamp(36px,5vh,56px)] grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-[clamp(20px,3vw,36px)]">
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
    <div
      className="rounded-[20px] bg-white p-[clamp(18px,2vw,26px)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_36px_rgba(0,60,70,0.10),0_50px_100px_-20px_rgba(0,60,70,0.20),0_0_0_1px_rgba(0,60,70,0.04)]"
      style={fadeFrom("left", p, fromTitle, fromTitle + 0.14, 60)}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <svg width={20} height={20} viewBox="0 0 24 24" fill="#003c46" aria-hidden>
          <path d="M5.042 15.165a2.528 2.528 0 1 1-2.52-2.528h2.52v2.528zm1.27 0a2.528 2.528 0 1 1 5.055 0v6.307A2.528 2.528 0 1 1 6.31 21.472v-6.307zM8.835 5.042a2.528 2.528 0 1 1 2.528-2.52v2.52H8.836zm0 1.27a2.528 2.528 0 1 1 0 5.055H2.523a2.528 2.528 0 1 1 0-5.056h6.312zm10.122 2.523a2.528 2.528 0 1 1 2.52 2.528h-2.52V8.835zm-1.27 0a2.528 2.528 0 1 1-5.055 0V2.528a2.528 2.528 0 1 1 5.055 0v6.307zm-2.527 10.122a2.528 2.528 0 1 1-2.528 2.52v-2.52h2.528zm0-1.27a2.528 2.528 0 1 1 0-5.055h6.31a2.528 2.528 0 1 1 0 5.056h-6.31z" />
        </svg>
        <span className="text-[12px] font-bold text-dark-teal">#mentic — Slack</span>
      </div>
      <div className="flex items-start gap-2.5">
        <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-coral text-[13px] font-extrabold text-white">M</div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-baseline gap-2">
            <span className="text-[13px] font-bold text-dark-teal">Mentic</span>
            <span className="text-[10px] text-dark-teal/55">APP · 11:42 AM</span>
          </div>
          <p
            className="m-0 text-[13.5px] font-medium leading-[1.5] text-dark-teal"
            style={fadeUp(p, fromBody, fromBody + 0.1, 16)}
          >
            About to scale <strong className="text-coral">PostExhibition · Leads</strong> from
            <span className="mx-1 inline-block rounded-md bg-dark-teal/6 px-2 py-0.5 text-[12px] font-semibold">$40/day</span>
            to
            <span className="mx-1 inline-block rounded-md bg-mint/25 px-2 py-0.5 text-[12px] font-bold text-dark-teal">$80/day</span>
            after CPL dropped 38% over 3 days.
          </p>
          <div
            className="mt-3 flex gap-2"
            style={fadeUp(p, fromActions, fromActions + 0.1, 16)}
          >
            <span className={`${chipBase} bg-mint text-dark-teal`}>Approve</span>
            <span className={`${chipBase} bg-dark-teal/6 text-dark-teal`}>Hold</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TelegramApprovalCard({ p, fromTitle, fromBody, fromActions }: { p: number; fromTitle: number; fromBody: number; fromActions: number }) {
  return (
    <div
      className="rounded-[20px] bg-white p-[clamp(18px,2vw,26px)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_36px_rgba(0,60,70,0.10),0_50px_100px_-20px_rgba(0,60,70,0.20),0_0_0_1px_rgba(0,60,70,0.04)]"
      style={fadeFrom("right", p, fromTitle, fromTitle + 0.14, 60)}
    >
      <div className="mb-4 flex items-center gap-2.5">
        <svg width={20} height={20} viewBox="0 0 24 24" fill="#003c46" aria-hidden>
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.643.135-.953l11.566-4.458c.538-.196 1.006.128.832.94z" />
        </svg>
        <span className="text-[12px] font-bold text-dark-teal">Telegram — DM</span>
      </div>
      <div
        className="ml-auto max-w-[92%] rounded-2xl bg-mint/18 px-3.5 py-3"
        style={fadeUp(p, fromBody, fromBody + 0.1, 18)}
      >
        <div className="mb-2 text-[11px] font-bold tracking-[0.02em] text-dark-teal">
          New creative for review
        </div>
        <p className="m-0 text-[13px] font-medium leading-[1.5] text-dark-teal">
          Audience-Agent flagged hook fatigue on <strong>Variation B</strong>.
          Drafted three new openings — want me to ship the top-scoring one to a 5% test budget?
        </p>
        <div
          className="mt-2.5 flex gap-2"
          style={fadeUp(p, fromActions, fromActions + 0.1, 14)}
        >
          <span className={`${chipBase} bg-dark-teal text-[#f2f2f0]`}>Ship it</span>
          <span className={`${chipBase} bg-dark-teal/8 text-dark-teal`}>Show me first</span>
        </div>
        <div className="mt-1.5 text-right text-[10px] text-dark-teal/55">11:43</div>
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
          <div className="why-grid mt-[clamp(28px,4vh,48px)] grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[clamp(14px,2vw,22px)]">
            {cards.map((card) => (
              <div
                key={card.title}
                className="flex flex-col gap-3 rounded-[20px] bg-white p-[clamp(20px,2.4vw,32px)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_28px_rgba(0,60,70,0.07),0_0_0_1px_rgba(0,60,70,0.04)]"
                style={scaleIn(p, card.from, card.from + 0.16, 0.92, 30)}
              >
                <div className="h-1 w-9 rounded-full" style={{ background: card.accent }} />
                <h3 className="m-0 text-[clamp(16px,1.5vw,21px)] font-bold tracking-[-0.005em] text-dark-teal">
                  {card.title}
                </h3>
                <p className="m-0 text-[clamp(13px,1vw,15px)] font-normal leading-[1.55] text-dark-teal/72">
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
  const isMobile = useIsMobile();
  /* On mobile: render flat with no sticky and treat all reveals as fully
     visible. Matches the no-locking treatment in PinnedScene / HeroScene. */
  const effectiveP = isMobile ? 1 : p;
  const innerStyle: React.CSSProperties = isMobile
    ? {
        position: "relative",
        padding: "clamp(64px, 9vh, 96px) clamp(20px, 5vw, 32px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center",
      }
    : {
        position: "sticky", top: 0, height: "100dvh",
        display: "flex", alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "clamp(80px, 12vh, 140px) clamp(20px, 6vw, 96px)",
      };
  return (
    <div ref={ref} className="relative" style={{ height: isMobile ? "auto" : "110vh" }}>
      <div style={innerStyle}>
        <div>
          <h2 className="m-0 text-[clamp(40px,6.4vw,96px)] font-extralight leading-[0.98] tracking-[-0.02em] text-dark-teal">
            <span className="block font-extralight" style={fadeBlur(effectiveP, 0, 0.25)}>One URL.</span>
            <span className="block font-extrabold text-coral" style={fadeBlur(effectiveP, 0.08, 0.32)}>One team of agents.</span>
            <span className="block font-extralight" style={fadeBlur(effectiveP, 0.18, 0.42)}>Your whole funnel.</span>
          </h2>
          <p
            className="mx-auto mt-7 mb-0 max-w-[540px] text-[clamp(15px,1.3vw,18px)] font-light leading-[1.55] text-dark-teal/72"
            style={fadeBlur(effectiveP, 0.3, 0.48, 14, 8)}
          >
            Onboarding pilot users now — $997/month including every agency service from EXQDigital free during alpha.
          </p>
          <div
            className="mt-11 flex flex-wrap justify-center gap-3"
            style={fadeUp(effectiveP, 0.4, 0.6, 24)}
          >
            <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className={ctaTeal}
              onClick={() => trackSchedule({ content_name: "Book a demo — product CTA", source: "product_cta" })}
            >
              Book a demo
            </a>
            <Link href="/pricing" className={ctaOutlined}>See pricing</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Inline button styles
   ─────────────────────────────────────────────────────────── */
const ctaBase =
  "inline-flex items-center justify-center rounded-full px-[30px] py-4 text-[13px] font-bold uppercase tracking-[0.18em] no-underline";
const ctaTeal = `${ctaBase} bg-dark-teal text-[#f2f2f0]`;
const ctaMint = `${ctaBase} bg-mint text-dark-teal`;
const ctaOutlined = `${ctaBase} border-[1.5px] border-dark-teal bg-transparent text-dark-teal`;
const chipBase =
  "inline-flex items-center justify-center rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em]";
