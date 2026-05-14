import type { Metadata } from "next";
import SiteMenu from "@/components/SiteMenu";

export const metadata: Metadata = {
  title: "News",
  description:
    "Mentic news — Mentic.io has been accepted into Batch 001 of Teleport SF, an accelerator for builders shipping autonomous AI.",
  alternates: { canonical: "/news" },
};

const NEWS = [
  {
    date: "7 May 2026",
    isoDate: "2026-05-07",
    tag: "Milestone",
    titleParts: [
      { text: "Mentic.io got into ", weight: 700, color: "#003c46" },
      { text: "Batch 001", weight: 800, color: "#ff6b5c" },
      { text: " of ", weight: 700, color: "#003c46" },
      { text: "Teleport SF", weight: 800, color: "#003c46" },
      { text: ".", weight: 700, color: "#003c46" },
    ],
    body:
      "Last Thursday, Mentic.io joined the inaugural cohort of Teleport SF — an accelerator backing teams shipping autonomous AI products. Out of the 001 batch, we're the team carrying the autonomous-advertising flag. Onboarding pilot users right after launch on 18 May.",
  },
];

export default function NewsPage() {
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
      <div aria-hidden className="gradient-blob gradient-blob-coral intro-fade-in" style={{
        position: "absolute", pointerEvents: "none",
        width: "min(45vw, 720px)", height: "min(45vw, 720px)",
        top: "-22vw", left: "-22vw",
        animationDelay: "0.1s",
      }} />
      <div aria-hidden className="gradient-blob gradient-blob-mint intro-fade-in" style={{
        position: "absolute", pointerEvents: "none",
        width: "min(55vw, 880px)", height: "min(55vw, 880px)",
        bottom: "-28vw", right: "-28vw",
        animationDelay: "0.2s",
      }} />

      {/* News list */}
      <section style={{
        flex: 1,
        position: "relative", zIndex: 2,
        display: "flex", justifyContent: "center", alignItems: "center",
        padding: "clamp(76px, 9vh, 120px) clamp(16px, 4vw, 56px) clamp(28px, 4vh, 56px)",
      }}>
        <div style={{
          width: "100%", maxWidth: 720,
          display: "flex", flexDirection: "column", gap: 16,
        }}>
          {NEWS.map((item, i) => (
            <article key={i} className="intro-scale-in" style={{
              position: "relative",
              background: "#ffffff",
              borderRadius: 24,
              padding: "clamp(22px, 3vw, 40px)",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,60,70,0.08), 0 40px 80px -20px rgba(0,60,70,0.16), 0 0 0 1px rgba(0,60,70,0.04)",
              animationDelay: `${0.15 + i * 0.1}s`,
            }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 12, flexWrap: "wrap", marginBottom: 16,
              }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "5px 12px", borderRadius: 999,
                  background: "#e3fbf2", color: "#003c46",
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}>
                  <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: "#8bf2d3" }} />
                  {item.tag}
                </span>
                <time dateTime={item.isoDate} style={{
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "rgba(0,60,70,0.5)",
                }}>
                  {item.date}
                </time>
              </div>

              <h1 style={{
                margin: "0 0 12px",
                fontSize: "clamp(24px, 3vw, 36px)",
                lineHeight: 1.12,
                letterSpacing: "-0.01em",
              }}>
                {item.titleParts.map((p, idx) => (
                  <span key={idx} style={{ fontWeight: p.weight, color: p.color }}>{p.text}</span>
                ))}
              </h1>

              <p style={{
                margin: 0,
                fontSize: "clamp(15px, 1.1vw, 17px)",
                fontWeight: 400, lineHeight: 1.6,
                color: "rgba(0,60,70,0.78)",
              }}>
                {item.body}
              </p>
            </article>
          ))}

          <p className="intro-fade-up" style={{
            margin: "8px auto 0",
            fontSize: 13, fontWeight: 300,
            color: "rgba(0,60,70,0.5)", textAlign: "center",
            animationDelay: `${0.25 + NEWS.length * 0.1}s`,
          }}>
            More updates as we ship. Follow{" "}
            <a
              href="https://www.linkedin.com/company/mentic-io"
              target="_blank" rel="noopener noreferrer"
              style={{ color: "#003c46", fontWeight: 600 }}
            >
              @mentic-io on LinkedIn
            </a>{" "}
            for the freshest.
          </p>
        </div>
      </section>
    </main>
  );
}
