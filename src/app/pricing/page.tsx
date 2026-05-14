import type { Metadata } from "next";
import SiteMenu from "@/components/SiteMenu";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Mentic alpha pricing — $997/month for the autonomous agent plus a senior team of human media buyers from EXQDigital, plus every EXQDigital agency service (including full visual materials creation, editing and generation) included free for pilot users.",
  alternates: { canonical: "/pricing" },
};

const BENEFITS = [
  {
    bold: "Full Mentic.io access",
    rest: " — autonomous strategy, launches and optimisation across your ad accounts.",
  },
  {
    bold: "Human media buyers in the loop, every day",
    rest: " — your account is supervised end-to-end by EXQDigital, the advertising agency behind Mentic. No fire-and-forget.",
  },
  {
    bold: "Every EXQDigital agency service, included free",
    rest: " — strategy, paid social, paid search, reporting and account audits. Normally $3K–$10K/month in retainers, $0 during alpha.",
  },
  {
    bold: "Full visual materials support, end-to-end",
    rest: " — creation, editing and generation of every asset your campaigns need, handled by EXQDigital's creative team.",
  },
  {
    bold: "Direct line to the team",
    rest: " — Slack and Telegram with the founders and the agency.",
  },
];

export default function PricingPage() {
  return (
    <main className="use-native-cursor" style={{
      minHeight: "100dvh",
      width: "100%",
      background: "#f2f2f0",
      color: "#003c46",
      fontFamily: "var(--font-nunito), 'Nunito Sans', sans-serif",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    }}>
      <SiteMenu />

      {/* Corner blobs */}
      <div aria-hidden className="gradient-blob gradient-blob-coral" style={{
        position: "absolute", pointerEvents: "none",
        width: "min(45vw, 720px)", height: "min(45vw, 720px)",
        top: "-22vw", left: "-22vw",
      }} />
      <div aria-hidden className="gradient-blob gradient-blob-mint" style={{
        position: "absolute", pointerEvents: "none",
        width: "min(55vw, 880px)", height: "min(55vw, 880px)",
        bottom: "-28vw", right: "-28vw",
      }} />

      {/* Pricing card */}
      <section style={{
        flex: 1,
        position: "relative", zIndex: 2,
        display: "flex", justifyContent: "center", alignItems: "center",
        padding: "clamp(76px, 9vh, 120px) clamp(16px, 4vw, 56px) clamp(28px, 4vh, 56px)",
      }}>
        <article style={{
          position: "relative",
          width: "100%", maxWidth: 1180,
          background: "#ffffff",
          borderRadius: 28,
          padding: "clamp(32px, 5vw, 72px)",
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,60,70,0.08), 0 40px 80px -20px rgba(0,60,70,0.18), 0 0 0 1px rgba(0,60,70,0.04)",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 5fr) minmax(0, 6fr)",
            gap: "clamp(40px, 6vw, 88px)",
            alignItems: "start",
          }} className="pricing-grid">
            {/* Left column — plan summary + price + CTAs */}
            <div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 14px", borderRadius: 999,
                background: "#fff3f2", color: "#ff6b5c",
                fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}>
                <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: "#ff6b5c" }} />
                Limited — pilot users only
              </div>

              <h1 style={{
                margin: "22px 0 10px",
                fontSize: "clamp(36px, 4.4vw, 60px)",
                fontWeight: 800,
                letterSpacing: "-0.015em",
                lineHeight: 1.02,
                color: "#003c46",
              }}>
                Alpha plan
              </h1>
              <p style={{
                margin: 0,
                fontSize: "clamp(14px, 1.15vw, 16px)",
                fontWeight: 300,
                color: "rgba(0,60,70,0.7)",
                lineHeight: 1.6,
                maxWidth: 440,
              }}>
                The autonomous agent, supervised end-to-end by a real ad agency. One plan, one price,
                no fine print.
              </p>

              <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "32px 0 10px", flexWrap: "wrap" }}>
                <span style={{
                  fontSize: "clamp(56px, 7vw, 96px)",
                  fontWeight: 800,
                  color: "#003c46",
                  lineHeight: 0.95,
                  letterSpacing: "-0.025em",
                }}>
                  $997
                </span>
                <span style={{
                  fontSize: 18, fontWeight: 400, color: "rgba(0,60,70,0.65)",
                  letterSpacing: "0.02em",
                }}>
                  / month
                </span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#ff6b5c", letterSpacing: "0.02em" }}>
                $0 for every agency service on top.
              </div>

              <div style={{ display: "flex", gap: 12, marginTop: 36, flexWrap: "wrap" }}>
                <a
                  href="https://calendly.com/maksymilian-mentic/mentic-alpha-access-onboarding-pilot-user"
                  target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    padding: "15px 26px", borderRadius: 999,
                    background: "#003c46", color: "#f2f2f0",
                    fontSize: 13, fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  Book a Demo
                </a>
                <a
                  href="/#signup"
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    padding: "15px 26px", borderRadius: 999,
                    background: "#8bf2d3", color: "#003c46",
                    fontSize: 13, fontWeight: 700,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    textDecoration: "none",
                  }}
                >
                  Sign up
                </a>
              </div>
            </div>

            {/* Right column — benefits list + alpha note */}
            <div>
              <div style={{
                fontSize: 11, fontWeight: 700, letterSpacing: "0.3em",
                color: "rgba(0,60,70,0.55)", textTransform: "uppercase",
                marginBottom: 18,
              }}>
                What you get
              </div>
              <ul style={{
                margin: 0, padding: 0, listStyle: "none",
                display: "flex", flexDirection: "column", gap: 18,
                fontSize: "clamp(14px, 1.05vw, 16px)",
                fontWeight: 400, lineHeight: 1.6,
                color: "#003c46",
              }}>
                {BENEFITS.map((item) => (
                  <li key={item.bold} style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                    <span aria-hidden style={{
                      flexShrink: 0,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      width: 24, height: 24, borderRadius: 999,
                      background: "#e3fbf2", color: "#003c46",
                      marginTop: 1,
                    }}>
                      <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>
                      <strong style={{ fontWeight: 700 }}>{item.bold}</strong>
                      {item.rest}
                    </span>
                  </li>
                ))}
              </ul>

              <div style={{
                marginTop: 28, padding: "18px 20px",
                borderRadius: 16,
                background: "#f2f2f0",
                fontSize: 13, fontWeight: 400, lineHeight: 1.6,
                color: "rgba(0,60,70,0.72)",
              }}>
                <strong style={{ fontWeight: 700, color: "#003c46" }}>Why so much agency support?</strong>{" "}
                We're in alpha and would rather have humans in the loop than let early users hit a rough
                edge alone. The free agency wrap-around is a thank-you for piloting with us — it ends
                when we exit alpha.
              </div>
            </div>
          </div>
        </article>
      </section>

      {/* Stack columns under 880px */}
      <style>{`
        @media (max-width: 880px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
