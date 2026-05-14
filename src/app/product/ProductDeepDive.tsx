"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteMenu from "@/components/SiteMenu";

const CALENDLY = "https://calendly.com/maksymilian-mentic/mentic-alpha-access-onboarding-pilot-user";

/* ─────────────────────────────────────────────────────────────
   Reveal-on-scroll hook
   ─────────────────────────────────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(
      ".reveal, .reveal-blur, .reveal-scale, .reveal-left, .reveal-right"
    );
    if (!items.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            obs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
    );
    items.forEach((it) => obs.observe(it));
    return () => obs.disconnect();
  }, []);
}

/* ─────────────────────────────────────────────────────────────
   Page palette helpers
   ─────────────────────────────────────────────────────────── */
const TEAL = "#003c46";
const TEAL_INK = "rgba(0,60,70,0.72)";
const TEAL_MUTED = "rgba(0,60,70,0.55)";
const CORAL = "#ff6b5c";
const MINT = "#8bf2d3";
const CERAMIC = "#f2f2f0";

const sectionBase: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  padding: "clamp(80px, 14vh, 160px) clamp(20px, 6vw, 96px)",
  maxWidth: 1400,
  margin: "0 auto",
};

const eyebrow: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 10,
  padding: "6px 14px", borderRadius: 999,
  background: "rgba(0,60,70,0.06)",
  fontSize: 11, fontWeight: 700, letterSpacing: "0.28em",
  textTransform: "uppercase", color: TEAL,
};

/* ─────────────────────────────────────────────────────────────
   Animated URL typewriter
   ─────────────────────────────────────────────────────────── */
function URLTypewriter({ url, restartKey }: { url: string; restartKey: number }) {
  const [typed, setTyped] = useState("");
  useEffect(() => {
    setTyped("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTyped(url.slice(0, i));
      if (i >= url.length) clearInterval(interval);
    }, 70);
    return () => clearInterval(interval);
  }, [url, restartKey]);
  return (
    <span style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
      {typed}
      <span className="typewriter-caret" />
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Product deep-dive component
   ─────────────────────────────────────────────────────────── */
export default function ProductDeepDive() {
  useReveal();

  // Restart key for the URL typewriter when the onboarding section enters view
  const onboardingRef = useRef<HTMLDivElement>(null);
  const [onbKey, setOnbKey] = useState(0);
  useEffect(() => {
    const node = onboardingRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setOnbKey((k) => k + 1); },
      { threshold: 0.3 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <main className="use-native-cursor" style={{
      width: "100%",
      background: CERAMIC,
      color: TEAL,
      fontFamily: "var(--font-nunito), 'Nunito Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <SiteMenu />

      {/* Global corner blobs */}
      <div aria-hidden className="gradient-blob gradient-blob-coral" style={{
        position: "fixed", pointerEvents: "none",
        width: "min(45vw, 720px)", height: "min(45vw, 720px)",
        top: "-22vw", left: "-22vw",
        opacity: 0.7,
        zIndex: 0,
      }} />
      <div aria-hidden className="gradient-blob gradient-blob-mint" style={{
        position: "fixed", pointerEvents: "none",
        width: "min(55vw, 880px)", height: "min(55vw, 880px)",
        bottom: "-32vw", right: "-28vw",
        opacity: 0.7,
        zIndex: 0,
      }} />

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        ...sectionBase,
        minHeight: "100dvh",
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        textAlign: "center",
        paddingTop: "clamp(140px, 18vh, 220px)",
      }}>
        <div className="reveal-blur" style={eyebrow}>
          ◆ The product
        </div>
        <h1 className="reveal-blur" style={{
          margin: "28px 0 0",
          fontSize: "clamp(48px, 9vw, 140px)",
          lineHeight: 0.94,
          fontWeight: 200,
          letterSpacing: "-0.025em",
          color: TEAL,
          maxWidth: 1200,
          ["--reveal-delay" as string]: "0.1s",
        }}>
          <span style={{ display: "block", fontWeight: 200 }}>Give Mentic</span>
          <span style={{ display: "block", fontWeight: 800, color: CORAL }}>your URL.</span>
          <span style={{ display: "block", fontWeight: 200 }}>
            Get back an
            <span style={{ fontWeight: 800, color: TEAL }}> agency</span>.
          </span>
        </h1>
        <p className="reveal-blur" style={{
          margin: "36px auto 0",
          maxWidth: 640,
          fontSize: "clamp(16px, 1.4vw, 20px)",
          fontWeight: 300,
          lineHeight: 1.6,
          color: TEAL_INK,
          ["--reveal-delay" as string]: "0.3s",
        }}>
          The autonomous advertising agent reads your business, designs the strategy,
          launches campaigns on Meta and keeps optimising them — humans in the loop where it counts.
        </p>
        <div className="reveal-blur" style={{
          marginTop: 44, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
          ["--reveal-delay" as string]: "0.45s",
        }}>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={ctaTeal}>
            Book a demo
          </a>
          <a href="/#signup" style={ctaMint}>Sign up</a>
        </div>
        <div className="reveal" style={{
          marginTop: 80, display: "inline-flex", flexDirection: "column",
          alignItems: "center", gap: 10, color: TEAL_MUTED,
          ["--reveal-delay" as string]: "0.6s",
        }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" }}>
            Scroll for the deep dive
          </span>
          <svg width={18} height={28} viewBox="0 0 18 28" fill="none" aria-hidden>
            <rect x="1" y="1" width="16" height="26" rx="8" stroke="currentColor" strokeWidth="1.5" />
            <rect x="8" y="6" width="2" height="6" rx="1" fill="currentColor">
              <animate attributeName="y" values="6;12;6" dur="1.6s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="1;0;1" dur="1.6s" repeatCount="indefinite" />
            </rect>
          </svg>
        </div>
      </section>

      {/* ── 01 — FROM A URL ───────────────────────────────────── */}
      <Section number="01" eyebrowText="Onboarding" headlineParts={[
        { text: "We start where ", color: TEAL, weight: 200 },
        { text: "everything else", color: CORAL, weight: 800 },
        { text: " is already on your", color: TEAL, weight: 200 },
        { text: " homepage", color: TEAL, weight: 800 },
        { text: ".", color: TEAL, weight: 200 },
      ]} body="Paste your website. In under a minute, Mentic produces a business profile a senior strategist would charge a week for — niche, ICP, USP, location, top competitors and a read on your market.">
        <div ref={onboardingRef} style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.1fr)",
          gap: "clamp(28px, 4vw, 64px)",
          alignItems: "center",
          marginTop: 56,
        }} className="onboarding-grid">
          {/* Left — browser-style URL bar */}
          <div className="reveal-left" style={{
            background: "#ffffff",
            borderRadius: 22,
            padding: "clamp(20px, 2.6vw, 32px)",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,60,70,0.08), 0 40px 80px -20px rgba(0,60,70,0.18), 0 0 0 1px rgba(0,60,70,0.04)",
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
              <URLTypewriter url="https://yourbrand.com" restartKey={onbKey} />
            </div>
            <div style={{
              marginTop: 16,
              display: "flex", alignItems: "center", gap: 10,
              fontSize: 12, fontWeight: 500, color: TEAL_MUTED,
              letterSpacing: "0.02em",
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

          {/* Right — extracted profile cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Niche", value: "Skincare for sensitive skin", delay: 0.1 },
              { label: "ICP", value: "Women, 28–44, busy professionals", delay: 0.2 },
              { label: "USP", value: "Dermatologist-formulated · clean ingredients · no animal testing", delay: 0.3 },
              { label: "Competitors", value: "Bioderma · La Roche-Posay · Drunk Elephant · 4 more", delay: 0.4 },
            ].map((row) => (
              <div
                key={row.label}
                className="reveal-right"
                style={{
                  ["--reveal-delay" as string]: `${row.delay}s`,
                  background: "#ffffff",
                  borderRadius: 14,
                  padding: "14px 18px",
                  display: "flex", flexDirection: "column", gap: 4,
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.04), 0 6px 16px rgba(0,60,70,0.06), 0 0 0 1px rgba(0,60,70,0.04)",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.24em", color: CORAL, textTransform: "uppercase" }}>
                  {row.label}
                </div>
                <div style={{ fontSize: "clamp(14px, 1.05vw, 16px)", fontWeight: 500, color: TEAL }}>
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
      </Section>

      {/* ── 02 — RESEARCH ─────────────────────────────────────── */}
      <Section number="02" eyebrowText="Research" headlineParts={[
        { text: "Reads the ", color: TEAL, weight: 200 },
        { text: "market", color: TEAL, weight: 800 },
        { text: " before it spends a ", color: TEAL, weight: 200 },
        { text: "cent", color: CORAL, weight: 800 },
        { text: ".", color: TEAL, weight: 200 },
      ]} body="The research agent runs two rounds of live web search and a Meta Ad Library scan. It learns your market overview, target audience psychographics, pricing intel, the channels that actually work in your category and 3–5 contrarian takes on how your industry is being misadvertised.">
        <div className="research-grid" style={{
          marginTop: 56,
          display: "grid",
          gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
          gap: 16,
        }}>
          {[
            { tag: "Market overview", body: "Category size, growth, who the buyers are, what they search for." },
            { tag: "Competitors", body: "Direct alternatives a real buyer would compare you to — validated, not just \"also uses AI\"." },
            { tag: "Audience psychographics", body: "What they fear, what they're chasing, the lines they respond to." },
            { tag: "Channel intel", body: "Where this niche actually converts, with synergy notes per platform." },
            { tag: "Ad-library scan", body: "Live read on what your competitors are running on Meta right now." },
            { tag: "Contrarian takes", body: "Where the category is mispositioned — and how to win by being different." },
          ].map((c, i) => (
            <div
              key={c.tag}
              className="reveal-scale"
              style={{
                ["--reveal-delay" as string]: `${i * 0.08}s`,
                background: "#ffffff",
                borderRadius: 18,
                padding: "clamp(18px, 2vw, 26px)",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.04), 0 10px 24px rgba(0,60,70,0.06), 0 0 0 1px rgba(0,60,70,0.04)",
              }}
            >
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.22em",
                color: CORAL, textTransform: "uppercase", marginBottom: 10,
              }}>
                {c.tag}
              </div>
              <div style={{ fontSize: "clamp(15px, 1.1vw, 17px)", fontWeight: 400, lineHeight: 1.5, color: TEAL }}>
                {c.body}
              </div>
            </div>
          ))}
        </div>
        <style>{`
          @media (max-width: 720px) {
            .research-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </Section>

      {/* ── 03 — STRATEGY (with screenshot) ───────────────────── */}
      <Section number="03" eyebrowText="Strategy" headlineParts={[
        { text: "An ", color: TEAL, weight: 200 },
        { text: "8-phase", color: CORAL, weight: 800 },
        { text: " pipeline ", color: TEAL, weight: 200 },
        { text: "designs the funnel", color: TEAL, weight: 800 },
        { text: " end-to-end.", color: TEAL, weight: 200 },
      ]} body="Not a black box. Mentic spells out exactly how it's going to advertise you — platforms, layers, creative briefs and the timeline — before a single ad runs. You can read it. You can edit it. Then it ships.">
        <div className="strategy-grid" style={{
          marginTop: 56,
          display: "grid",
          gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)",
          gap: "clamp(28px, 4vw, 64px)",
          alignItems: "center",
        }}>
          {/* Left — phase ladder */}
          <ol className="reveal-left" style={{
            listStyle: "none", margin: 0, padding: 0,
            display: "flex", flexDirection: "column", gap: 10,
          }}>
            {[
              "Data assembly",
              "Live market research",
              "Creative intelligence",
              "Platform selection",
              "Platform intelligence",
              "Funnel architecture",
              "Creative briefs",
              "Launch timeline",
            ].map((phase, i) => (
              <li
                key={phase}
                className="reveal"
                style={{
                  ["--reveal-delay" as string]: `${0.2 + i * 0.06}s`,
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "12px 16px",
                  borderRadius: 14,
                  background: i < 4 ? "rgba(139,242,211,0.18)" : "rgba(0,60,70,0.04)",
                  border: i < 4 ? "1px solid rgba(139,242,211,0.4)" : "1px solid rgba(0,60,70,0.06)",
                }}
              >
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 22, height: 22, borderRadius: 999,
                  background: i < 4 ? MINT : "rgba(0,60,70,0.08)",
                  color: TEAL, flexShrink: 0,
                }}>
                  {i < 4 ? (
                    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span style={{ fontSize: 10, fontWeight: 700, color: TEAL_MUTED }}>{i + 1}</span>
                  )}
                </span>
                <span style={{ fontSize: "clamp(14px, 1.1vw, 16px)", fontWeight: i < 4 ? 700 : 500, color: TEAL }}>
                  {phase}
                </span>
              </li>
            ))}
          </ol>

          {/* Right — strategy screenshot */}
          <div className="reveal-scale" style={{
            position: "relative",
            borderRadius: 22,
            overflow: "hidden",
            aspectRatio: "1366 / 768",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 14px 36px rgba(0,60,70,0.10), 0 50px 100px -20px rgba(0,60,70,0.22), 0 0 0 1px rgba(0,60,70,0.04)",
            ["--reveal-delay" as string]: "0.2s",
          }}>
            <Image
              src="/images/product-strategy.png"
              alt="Strategy view in progress — Mentic dashboard"
              fill
              sizes="(max-width: 880px) 100vw, 60vw"
              style={{ objectFit: "cover" }}
            />
            <div aria-hidden style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "linear-gradient(115deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 70%, rgba(0,0,0,0.04) 100%)",
            }} />
          </div>
        </div>
        <style>{`
          @media (max-width: 880px) {
            .strategy-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </Section>

      {/* ── 04 — LAUNCH ──────────────────────────────────────── */}
      <Section number="04" eyebrowText="Launch" headlineParts={[
        { text: "Live ", color: TEAL, weight: 200 },
        { text: "Meta API", color: CORAL, weight: 800 },
        { text: ". Real ad accounts. Real ", color: TEAL, weight: 200 },
        { text: "dollars", color: TEAL, weight: 800 },
        { text: ".", color: TEAL, weight: 200 },
      ]} body="Mentic doesn't just recommend — it ships. A deterministic builder turns the strategy into campaigns, ad sets, creatives and ads with the exact Meta field values from our internal knowledge base. Every launch passes a validate-only preflight before money moves.">
        <div className="reveal-scale" style={{
          marginTop: 56,
          position: "relative",
          borderRadius: 24,
          overflow: "hidden",
          aspectRatio: "1366 / 768",
          maxWidth: 1240,
          margin: "56px auto 0",
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.04), 0 14px 36px rgba(0,60,70,0.10), 0 50px 100px -20px rgba(0,60,70,0.24), 0 0 0 1px rgba(0,60,70,0.04)",
        }}>
          <Image
            src="/images/product-campaigns.png"
            alt="Live Meta campaigns inside Mentic"
            fill
            sizes="(max-width: 1240px) 100vw, 1240px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div style={{
          marginTop: 28,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
          gap: 16,
          maxWidth: 1240, marginLeft: "auto", marginRight: "auto",
        }}>
          {[
            { stat: "1", unit: "click", body: "Strategy → live campaigns on your ad account." },
            { stat: "validate", suffix: "_only", body: "Preflight every change before money moves." },
            { stat: "0", unit: "guessed values", body: "All Meta API fields sourced from the internal spec." },
          ].map((s, i) => (
            <div key={i} className="reveal" style={{
              ["--reveal-delay" as string]: `${0.15 + i * 0.08}s`,
              padding: "20px 22px",
              borderRadius: 16,
              background: "#ffffff",
              boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 20px rgba(0,60,70,0.05), 0 0 0 1px rgba(0,60,70,0.04)",
            }}>
              <div style={{
                fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 800,
                color: TEAL, letterSpacing: "-0.02em", lineHeight: 1,
              }}>
                {s.stat}
                {s.unit && <span style={{ color: TEAL_MUTED, fontWeight: 500, fontSize: 14, marginLeft: 6, letterSpacing: "0.02em" }}>{s.unit}</span>}
                {s.suffix && <span style={{ color: CORAL, fontWeight: 800, fontSize: "clamp(28px, 3vw, 40px)" }}>{s.suffix}</span>}
              </div>
              <p style={{ margin: "10px 0 0", fontSize: 14, color: TEAL_INK, lineHeight: 1.5 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 05 — OPTIMISATION (5 agents) ─────────────────────── */}
      <Section number="05" eyebrowText="Optimisation" headlineParts={[
        { text: "Five ", color: TEAL, weight: 200 },
        { text: "specialist agents", color: CORAL, weight: 800 },
        { text: ". One ", color: TEAL, weight: 200 },
        { text: "coordinator", color: TEAL, weight: 800 },
        { text: ".", color: TEAL, weight: 200 },
      ]} body="The optimisation loop runs five agents in parallel — Budget, Audience, Creative, Standards and Reactive — each watching its own slice of the account. A coordinator resolves their conflicts and orders fixes by impact before surfacing the recommendation to you.">
        <PipelineDiagram />
      </Section>

      {/* ── 06 — DASHBOARD ───────────────────────────────────── */}
      <Section number="06" eyebrowText="Dashboard" headlineParts={[
        { text: "All the ", color: TEAL, weight: 200 },
        { text: "metrics", color: TEAL, weight: 800 },
        { text: " that matter. ", color: TEAL, weight: 200 },
        { text: "None", color: CORAL, weight: 800 },
        { text: " of the noise.", color: TEAL, weight: 200 },
      ]} body="One page tells you whether your money is working: active spend, results, cost-per-result, CTR and the trend underneath. Per-campaign health flags surface what to look at first.">
        <div className="reveal-scale" style={{
          marginTop: 56,
          position: "relative",
          borderRadius: 24,
          overflow: "hidden",
          aspectRatio: "1366 / 768",
          maxWidth: 1240,
          margin: "56px auto 0",
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.04), 0 14px 36px rgba(0,60,70,0.10), 0 50px 100px -20px rgba(0,60,70,0.24), 0 0 0 1px rgba(0,60,70,0.04)",
        }}>
          <Image
            src="/images/product-dashboard.png"
            alt="Mentic dashboard — overview of live campaigns"
            fill
            sizes="(max-width: 1240px) 100vw, 1240px"
            style={{ objectFit: "cover" }}
          />
        </div>
      </Section>

      {/* ── 07 — HITL APPROVAL ───────────────────────────────── */}
      <Section number="07" eyebrowText="Humans in the loop" headlineParts={[
        { text: "Approve ", color: TEAL, weight: 200 },
        { text: "from your", color: TEAL, weight: 800 },
        { text: " chat", color: CORAL, weight: 800 },
        { text: ".", color: TEAL, weight: 200 },
      ]} body="Nothing big ships without you saying yes. Mentic asks for approval in Slack, Telegram or its sidebar chat — with a one-line summary of what it's about to do, why, and the exact changes — before scaling, pausing or creating anything new.">
        <div className="approval-grid" style={{
          marginTop: 56,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "clamp(20px, 3vw, 40px)",
          alignItems: "start",
        }}>
          <SlackApprovalCard />
          <TelegramApprovalCard />
        </div>
        <style>{`
          @media (max-width: 880px) {
            .approval-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </Section>

      {/* ── 08 — WHY MENTIC ──────────────────────────────────── */}
      <Section number="08" eyebrowText="Why Mentic" headlineParts={[
        { text: "Built different — ", color: TEAL, weight: 200 },
        { text: "on purpose", color: CORAL, weight: 800 },
        { text: ".", color: TEAL, weight: 200 },
      ]} body="">
        <div className="why-grid" style={{
          marginTop: 48,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "clamp(16px, 2vw, 24px)",
        }}>
          {[
            {
              title: "vs. a human media buyer",
              body: "No retainer, no hiring cycle, no vacation. Mentic runs 24/7, runs more experiments than a team can ship, and stays cheaper than one optimisation hire.",
              accent: CORAL,
            },
            {
              title: "vs. AdCreative / Pencil",
              body: "Those tools generate creatives. Mentic researches, strategises, launches, optimises and learns — creative briefs are the output of the strategy, not the whole product.",
              accent: TEAL,
            },
            {
              title: "vs. Smartly / Albert",
              body: "Enterprise-only pricing replaced by SMB-native. Live Meta API write-access. 8-phase strategy you can actually read. No $10K/month floor.",
              accent: MINT,
            },
          ].map((card, i) => (
            <div key={card.title} className="reveal" style={{
              ["--reveal-delay" as string]: `${i * 0.1}s`,
              background: "#ffffff",
              borderRadius: 20,
              padding: "clamp(22px, 2.6vw, 32px)",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.04), 0 10px 28px rgba(0,60,70,0.07), 0 0 0 1px rgba(0,60,70,0.04)",
              display: "flex", flexDirection: "column", gap: 14,
            }}>
              <div style={{
                width: 36, height: 4, borderRadius: 999,
                background: card.accent,
              }} />
              <h3 style={{
                margin: 0,
                fontSize: "clamp(18px, 1.6vw, 22px)",
                fontWeight: 700, color: TEAL,
                letterSpacing: "-0.005em",
              }}>
                {card.title}
              </h3>
              <p style={{
                margin: 0,
                fontSize: "clamp(14px, 1.05vw, 16px)",
                fontWeight: 400, lineHeight: 1.55,
                color: TEAL_INK,
              }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>
        <style>{`
          @media (max-width: 880px) {
            .why-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </Section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section style={{
        ...sectionBase,
        textAlign: "center",
        paddingBottom: "clamp(120px, 18vh, 200px)",
      }}>
        <h2 className="reveal-blur" style={{
          margin: 0,
          fontSize: "clamp(40px, 6.4vw, 96px)",
          lineHeight: 0.98,
          fontWeight: 200,
          letterSpacing: "-0.02em",
          color: TEAL,
        }}>
          <span style={{ display: "block", fontWeight: 200 }}>One URL.</span>
          <span style={{ display: "block", fontWeight: 800, color: CORAL }}>One agent.</span>
          <span style={{ display: "block", fontWeight: 200 }}>Your whole funnel.</span>
        </h2>
        <p className="reveal-blur" style={{
          margin: "28px auto 0",
          maxWidth: 540,
          fontSize: "clamp(15px, 1.3vw, 18px)",
          fontWeight: 300,
          lineHeight: 1.55,
          color: TEAL_INK,
          ["--reveal-delay" as string]: "0.15s",
        }}>
          Onboarding pilot users now — $997/month including every agency service from EXQDigital for free during alpha.
        </p>
        <div className="reveal-blur" style={{
          marginTop: 44,
          display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center",
          ["--reveal-delay" as string]: "0.3s",
        }}>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" style={ctaTeal}>
            Book a demo
          </a>
          <Link href="/pricing" style={ctaOutlined}>See pricing</Link>
        </div>
      </section>
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────
   Section component — eyebrow + numbered headline + body
   ─────────────────────────────────────────────────────────── */
function Section({
  number, eyebrowText, headlineParts, body, children,
}: {
  number: string;
  eyebrowText: string;
  headlineParts: Array<{ text: string; color: string; weight: number }>;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <section style={sectionBase}>
      <div className="section-head" style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
        gap: "clamp(28px, 4vw, 80px)",
        alignItems: "start",
      }}>
        <div className="reveal" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.3em",
            color: CORAL, textTransform: "uppercase",
          }}>
            {number} ◆ {eyebrowText}
          </div>
          <div style={{ height: 1, background: "rgba(0,60,70,0.12)", maxWidth: 80 }} />
        </div>
        <div>
          <h2 className="reveal-blur" style={{
            margin: 0,
            fontSize: "clamp(34px, 5.4vw, 76px)",
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
            color: TEAL,
          }}>
            {headlineParts.map((p, i) => (
              <span key={i} style={{ fontWeight: p.weight, color: p.color }}>{p.text}</span>
            ))}
          </h2>
          {body && (
            <p className="reveal-blur" style={{
              margin: "24px 0 0",
              maxWidth: 700,
              fontSize: "clamp(15px, 1.25vw, 18px)",
              fontWeight: 300,
              lineHeight: 1.6,
              color: TEAL_INK,
              ["--reveal-delay" as string]: "0.15s",
            }}>
              {body}
            </p>
          )}
        </div>
      </div>
      {children}
      <style>{`
        @media (max-width: 720px) {
          .section-head { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Pipeline diagram — 5 orbs feeding a coordinator
   ─────────────────────────────────────────────────────────── */
function PipelineDiagram() {
  const agents = [
    { name: "Budget", role: "Spend efficiency, ROI floor, bid logic.", color: "#ff6b5c" },
    { name: "Audience", role: "Drift, lookalike fatigue, segment overlap.", color: "#003c46" },
    { name: "Creative", role: "Ad fatigue, hooks, competitive freshness.", color: "#8bf2d3" },
    { name: "Standards", role: "Meta policy, targeting guardrails.", color: "#ff6b5c" },
    { name: "Reactive", role: "Diagnose zero-impression / zero-conversion runs.", color: "#003c46" },
  ];
  return (
    <div className="reveal-scale" style={{
      marginTop: 56,
      background: "#ffffff",
      borderRadius: 24,
      padding: "clamp(32px, 4vw, 56px)",
      boxShadow:
        "0 1px 2px rgba(0,0,0,0.04), 0 14px 36px rgba(0,60,70,0.10), 0 50px 100px -20px rgba(0,60,70,0.20), 0 0 0 1px rgba(0,60,70,0.04)",
    }}>
      <div className="pipeline-grid" style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        gap: "clamp(12px, 2vw, 24px)",
        position: "relative",
      }}>
        {agents.map((a, i) => (
          <div key={a.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
            <div className="orb-pulse" style={{
              width: "clamp(64px, 8vw, 108px)",
              height: "clamp(64px, 8vw, 108px)",
              borderRadius: 999,
              background: `radial-gradient(circle at 30% 25%, ${a.color}55, ${a.color} 75%)`,
              boxShadow: "0 8px 24px rgba(0,60,70,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: TEAL,
              fontSize: "clamp(11px, 1vw, 13px)",
              fontWeight: 800, letterSpacing: "0.12em",
              textTransform: "uppercase",
              animationDelay: `${i * 0.4}s`,
            }}>
              {a.name}
            </div>
            <p style={{
              margin: 0,
              fontSize: "clamp(11px, 0.95vw, 13px)",
              fontWeight: 400, lineHeight: 1.4, color: TEAL_INK,
              maxWidth: 160,
            }}>
              {a.role}
            </p>
          </div>
        ))}
      </div>

      {/* Coordinator */}
      <div style={{
        marginTop: 36,
        display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
      }}>
        <svg width="2" height="48" viewBox="0 0 2 48" aria-hidden style={{ display: "block" }}>
          <line className="line-draw" x1="1" y1="0" x2="1" y2="48"
            stroke="#003c46" strokeWidth="2" strokeDasharray="48" strokeDashoffset="48"
            style={{ ["--line-len" as string]: "48" }} />
        </svg>
        <div style={{
          padding: "14px 24px",
          borderRadius: 999,
          background: TEAL, color: CERAMIC,
          fontSize: "clamp(12px, 1.05vw, 14px)",
          fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase",
          display: "inline-flex", alignItems: "center", gap: 10,
          boxShadow: "0 12px 28px rgba(0,60,70,0.25)",
        }}>
          <span style={{ width: 8, height: 8, borderRadius: 999, background: MINT }} />
          Coordinator
        </div>
        <p style={{
          margin: "8px auto 0", maxWidth: 480,
          fontSize: "clamp(12px, 1vw, 14px)", color: TEAL_INK, textAlign: "center", lineHeight: 1.5,
        }}>
          Resolves agent conflicts, orders fixes by impact, asks you for approval on the writes that matter.
        </p>
      </div>

      <style>{`
        @media (max-width: 880px) {
          .pipeline-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
        @media (max-width: 480px) {
          .pipeline-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Approval mock cards (Slack + Telegram)
   ─────────────────────────────────────────────────────────── */
function SlackApprovalCard() {
  return (
    <div className="reveal-left" style={{
      background: "#ffffff",
      borderRadius: 20,
      padding: "clamp(20px, 2.4vw, 28px)",
      boxShadow:
        "0 1px 2px rgba(0,0,0,0.04), 0 14px 36px rgba(0,60,70,0.10), 0 50px 100px -20px rgba(0,60,70,0.20), 0 0 0 1px rgba(0,60,70,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <svg width={22} height={22} viewBox="0 0 24 24" fill="#003c46" aria-hidden>
          <path d="M5.042 15.165a2.528 2.528 0 1 1-2.52-2.528h2.52v2.528zm1.27 0a2.528 2.528 0 1 1 5.055 0v6.307A2.528 2.528 0 1 1 6.31 21.472v-6.307zM8.835 5.042a2.528 2.528 0 1 1 2.528-2.52v2.52H8.836zm0 1.27a2.528 2.528 0 1 1 0 5.055H2.523a2.528 2.528 0 1 1 0-5.056h6.312zm10.122 2.523a2.528 2.528 0 1 1 2.52 2.528h-2.52V8.835zm-1.27 0a2.528 2.528 0 1 1-5.055 0V2.528a2.528 2.528 0 1 1 5.055 0v6.307zm-2.527 10.122a2.528 2.528 0 1 1-2.528 2.52v-2.52h2.528zm0-1.27a2.528 2.528 0 1 1 0-5.055h6.31a2.528 2.528 0 1 1 0 5.056h-6.31z" />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700, color: TEAL, letterSpacing: "0.02em" }}>#mentic — Slack</span>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{
          flexShrink: 0,
          width: 32, height: 32, borderRadius: 8, background: CORAL,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 13, fontWeight: 800,
        }}>M</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: TEAL }}>Mentic</span>
            <span style={{ fontSize: 11, color: TEAL_MUTED }}>APP · 11:42 AM</span>
          </div>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: TEAL, lineHeight: 1.45 }}>
            About to scale <strong style={{ color: CORAL }}>PostExhibition · Leads</strong> from
            <span style={{ display: "inline-block", margin: "0 4px", padding: "2px 8px", borderRadius: 6, background: "rgba(0,60,70,0.06)", fontSize: 12, fontWeight: 600 }}>$40/day</span>
            to
            <span style={{ display: "inline-block", margin: "0 4px", padding: "2px 8px", borderRadius: 6, background: "rgba(139,242,211,0.25)", fontSize: 12, fontWeight: 700, color: TEAL }}>$80/day</span>
            after CPL dropped 38% over 3 days.
          </p>
          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <button style={chipBtn(MINT, TEAL)}>Approve</button>
            <button style={chipBtn("rgba(0,60,70,0.06)", TEAL)}>Hold</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TelegramApprovalCard() {
  return (
    <div className="reveal-right" style={{
      background: "#ffffff",
      borderRadius: 20,
      padding: "clamp(20px, 2.4vw, 28px)",
      boxShadow:
        "0 1px 2px rgba(0,0,0,0.04), 0 14px 36px rgba(0,60,70,0.10), 0 50px 100px -20px rgba(0,60,70,0.20), 0 0 0 1px rgba(0,60,70,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <svg width={22} height={22} viewBox="0 0 24 24" fill="#003c46" aria-hidden>
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.643.135-.953l11.566-4.458c.538-.196 1.006.128.832.94z" />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700, color: TEAL, letterSpacing: "0.02em" }}>Telegram — DM</span>
      </div>
      <div style={{
        background: "rgba(139,242,211,0.18)",
        borderRadius: 16,
        padding: "14px 16px",
        maxWidth: "92%",
        marginLeft: "auto",
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: TEAL, marginBottom: 8, letterSpacing: "0.02em" }}>
          New creative for review
        </div>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: TEAL, lineHeight: 1.45 }}>
          Audience-Agent flagged hook fatigue on <strong>Variation B</strong>.
          Drafted three new openings — want me to ship the top-scoring one to a 5% test budget?
        </p>
        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          <button style={chipBtn(TEAL, CERAMIC)}>Ship it</button>
          <button style={chipBtn("rgba(0,60,70,0.08)", TEAL)}>Show me first</button>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: TEAL_MUTED, textAlign: "right" }}>11:43</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Inline styles for buttons
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
    padding: "8px 16px", borderRadius: 999, border: "none",
    background: bg, color: fg,
    fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
    cursor: "pointer", fontFamily: "inherit",
  };
}
