import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Mentic alpha pricing — $997/month for the autonomous agent plus a senior team of human media buyers from EXQDigital, plus every EXQDigital agency service included free for pilot users.",
  alternates: { canonical: "/pricing" },
};

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

      {/* Top bar */}
      <header style={{
        position: "relative", zIndex: 2,
        padding: "clamp(24px, 4vw, 40px) clamp(20px, 6vw, 56px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" aria-label="Back to Mentic home" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          color: "#003c46", textDecoration: "none",
          fontSize: 13, fontWeight: 700, letterSpacing: "0.18em",
          textTransform: "uppercase",
          padding: "10px 18px",
          borderRadius: 999,
          background: "rgba(0,60,70,0.05)",
        }}>
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Image src="/images/mentic-icon-orange.png" alt="" width={32} height={32} priority={false} />
          <span className="font-qurova" style={{ fontSize: 30, lineHeight: 1, color: "#003c46" }}>mentic</span>
        </div>
      </header>

      {/* Heading */}
      <section style={{
        position: "relative", zIndex: 2,
        padding: "clamp(24px, 5vw, 64px) clamp(20px, 6vw, 56px) clamp(20px, 3vw, 32px)",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 12, fontWeight: 700, letterSpacing: "0.4em",
          color: "rgba(0,60,70,0.55)", textTransform: "uppercase",
          marginBottom: 16,
        }}>
          ◆ Pricing
        </div>
        <h1 style={{
          margin: 0,
          fontSize: "clamp(40px, 6vw, 80px)",
          lineHeight: 1.02,
          fontWeight: 200,
          letterSpacing: "-0.02em",
          color: "#003c46",
        }}>
          One plan for now —
          <br />
          <span style={{ fontWeight: 800, color: "#ff6b5c" }}>the alpha</span>.
        </h1>
        <p style={{
          margin: "20px auto 0",
          maxWidth: 620,
          fontSize: "clamp(15px, 1.3vw, 18px)",
          fontWeight: 300,
          lineHeight: 1.55,
          color: "rgba(0,60,70,0.72)",
        }}>
          We're in alpha and onboarding a small group of pilot users by hand. One pricing tier,
          no fine print, and a real agency in the loop.
        </p>
      </section>

      {/* Pricing card */}
      <section style={{
        flex: 1,
        position: "relative", zIndex: 2,
        display: "flex", justifyContent: "center", alignItems: "flex-start",
        padding: "clamp(16px, 3vw, 40px) clamp(20px, 6vw, 56px) clamp(40px, 6vw, 80px)",
      }}>
        <article style={{
          position: "relative",
          width: "100%", maxWidth: 720,
          background: "#ffffff",
          borderRadius: 24,
          padding: "clamp(28px, 4vw, 48px)",
          boxShadow:
            "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,60,70,0.08), 0 40px 80px -20px rgba(0,60,70,0.18), 0 0 0 1px rgba(0,60,70,0.04)",
        }}>
          {/* Limited-time pill */}
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

          {/* Plan title + price */}
          <h2 style={{
            margin: "20px 0 6px",
            fontSize: "clamp(28px, 3.4vw, 44px)",
            fontWeight: 800,
            letterSpacing: "-0.01em",
            color: "#003c46",
          }}>
            Alpha plan
          </h2>
          <div style={{ fontSize: 15, fontWeight: 300, color: "rgba(0,60,70,0.7)", marginBottom: 24 }}>
            The autonomous agent, supervised end-to-end by a real ad agency.
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
            <span style={{
              fontSize: "clamp(48px, 6vw, 76px)",
              fontWeight: 800,
              color: "#003c46",
              lineHeight: 1,
              letterSpacing: "-0.02em",
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

          {/* Divider */}
          <div style={{ height: 1, background: "rgba(0,60,70,0.08)", marginBottom: 24 }} />

          {/* What's included */}
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.3em",
            color: "rgba(0,60,70,0.55)", textTransform: "uppercase",
            marginBottom: 14,
          }}>
            What you get
          </div>
          <ul style={{
            margin: 0, padding: 0, listStyle: "none",
            display: "flex", flexDirection: "column", gap: 14,
            fontSize: "clamp(15px, 1.15vw, 17px)",
            fontWeight: 400, lineHeight: 1.5,
            color: "#003c46",
          }}>
            {[
              {
                bold: "Full Mentic.io access",
                rest: " — autonomous strategy, launches and optimisation across your ad accounts.",
              },
              {
                bold: "Human media buyers in the loop, every day",
                rest: " — your account is fully supervised by EXQDigital, the advertising agency behind Mentic. No fire-and-forget.",
              },
              {
                bold: "Every EXQDigital service, included free",
                rest: " — creative, strategy, reporting, account audits, paid social and search. Normally $3K–$10K/month in retainers, $0 during alpha.",
              },
              {
                bold: "Direct line to the team",
                rest: " — Slack and Telegram with the founders and the agency.",
              },
            ].map((item) => (
              <li key={item.bold} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <span aria-hidden style={{
                  flexShrink: 0,
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 22, height: 22, borderRadius: 999,
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

          {/* Fine print */}
          <div style={{
            marginTop: 28, padding: "14px 16px",
            borderRadius: 14,
            background: "#f2f2f0",
            fontSize: 13, fontWeight: 400, lineHeight: 1.5,
            color: "rgba(0,60,70,0.72)",
          }}>
            <strong style={{ fontWeight: 700, color: "#003c46" }}>Why so much agency support?</strong>{" "}
            We're in alpha, and we'd rather have humans in the loop than let early users hit a rough
            edge alone. The free agency wrap-around is a thank-you for piloting with us — it ends when
            we exit alpha and pricing settles.
          </div>

          {/* CTAs */}
          <div style={{
            marginTop: 28,
            display: "flex", gap: 12, flexWrap: "wrap",
          }}>
            <a
              href="https://calendly.com/maksymilian-mentic/mentic-alpha-access-onboarding-pilot-user"
              target="_blank" rel="noopener noreferrer"
              style={{
                flex: 1, minWidth: 200,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "16px 28px", borderRadius: 999,
                background: "#003c46", color: "#f2f2f0",
                fontSize: 13, fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Book a Demo
            </a>
            <Link
              href="/"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "16px 28px", borderRadius: 999,
                background: "transparent", color: "#003c46",
                border: "1.5px solid #003c46",
                fontSize: 13, fontWeight: 700,
                letterSpacing: "0.18em", textTransform: "uppercase",
                textDecoration: "none",
              }}
            >
              Back to home
            </Link>
          </div>
        </article>
      </section>

      {/* Tiny footer */}
      <footer style={{
        position: "relative", zIndex: 2,
        padding: "clamp(20px, 3vw, 32px) clamp(20px, 6vw, 56px)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: 12, color: "rgba(0,60,70,0.5)", letterSpacing: "0.02em",
        flexWrap: "wrap", gap: 12,
      }}>
        <span>© {new Date().getFullYear()} Mentic. All rights reserved.</span>
        <span>Launching 18 May 2026.</span>
      </footer>
    </main>
  );
}
