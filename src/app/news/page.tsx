import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "News",
  description:
    "Mentic news — Mentic.io has been accepted into Batch 001 of Teleport SF, an accelerator for builders shipping autonomous AI.",
  alternates: { canonical: "/news" },
};

const NEWS = [
  {
    date: "7 May 2026",
    tag: "Milestone",
    title: "Mentic.io got into Batch 001 of Teleport SF.",
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
          ◆ News
        </div>
        <h1 style={{
          margin: 0,
          fontSize: "clamp(40px, 6vw, 80px)",
          lineHeight: 1.02,
          fontWeight: 200,
          letterSpacing: "-0.02em",
          color: "#003c46",
        }}>
          What's <span style={{ fontWeight: 800, color: "#ff6b5c" }}>new</span>.
        </h1>
      </section>

      {/* News list */}
      <section style={{
        flex: 1,
        position: "relative", zIndex: 2,
        display: "flex", justifyContent: "center", alignItems: "flex-start",
        padding: "clamp(16px, 3vw, 40px) clamp(20px, 6vw, 56px) clamp(40px, 6vw, 80px)",
      }}>
        <div style={{
          width: "100%", maxWidth: 720,
          display: "flex", flexDirection: "column", gap: 20,
        }}>
          {NEWS.map((item) => (
            <article key={item.title} style={{
              position: "relative",
              background: "#ffffff",
              borderRadius: 24,
              padding: "clamp(24px, 3.4vw, 40px)",
              boxShadow:
                "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,60,70,0.08), 0 40px 80px -20px rgba(0,60,70,0.16), 0 0 0 1px rgba(0,60,70,0.04)",
            }}>
              {/* Top row — tag pill + date */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: 12, flexWrap: "wrap", marginBottom: 18,
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
                <time
                  dateTime="2026-05-07"
                  style={{
                    fontSize: 12, fontWeight: 600,
                    letterSpacing: "0.18em", textTransform: "uppercase",
                    color: "rgba(0,60,70,0.5)",
                  }}
                >
                  {item.date}
                </time>
              </div>

              {/* Title */}
              <h2 style={{
                margin: "0 0 12px",
                fontSize: "clamp(24px, 3vw, 36px)",
                lineHeight: 1.12,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "#003c46",
              }}>
                Mentic.io got into{" "}
                <span style={{ color: "#ff6b5c", fontWeight: 800 }}>Batch 001</span>{" "}
                of{" "}
                <span style={{ fontWeight: 800 }}>Teleport SF</span>.
              </h2>

              {/* Body */}
              <p style={{
                margin: 0,
                fontSize: "clamp(15px, 1.15vw, 17px)",
                fontWeight: 400, lineHeight: 1.6,
                color: "rgba(0,60,70,0.78)",
              }}>
                {item.body}
              </p>
            </article>
          ))}

          {/* Footer-ish note */}
          <p style={{
            margin: "16px auto 0",
            fontSize: 13, fontWeight: 300,
            color: "rgba(0,60,70,0.5)", textAlign: "center",
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
