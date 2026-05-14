import Link from "next/link";
import Image from "next/image";

export type ComingSoonProps = {
  section: string;
  blurb?: string;
};

export default function ComingSoon({ section, blurb }: ComingSoonProps) {
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
      {/* Corner blobs — match the home page palette */}
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

      {/* Top bar — back link + wordmark */}
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
          transition: "background 0.25s ease, transform 0.25s ease",
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

      {/* Main content */}
      <section style={{
        flex: 1,
        position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "clamp(40px, 8vw, 96px) clamp(20px, 6vw, 56px)",
        textAlign: "center",
      }}>
        <div style={{
          fontSize: 12, fontWeight: 700, letterSpacing: "0.4em",
          color: "rgba(0,60,70,0.55)", textTransform: "uppercase",
          marginBottom: 18,
        }}>
          ◆ {section}
        </div>
        <h1 style={{
          margin: 0,
          fontFamily: "var(--font-nunito), 'Nunito Sans', sans-serif",
          fontSize: "clamp(56px, 11vw, 168px)",
          lineHeight: 0.95,
          fontWeight: 200,
          letterSpacing: "-0.02em",
          color: "#003c46",
        }}>
          <span style={{ display: "block", fontWeight: 200 }}>Coming</span>
          <span style={{ display: "block", fontWeight: 800, color: "#ff6b5c" }}>soon.</span>
        </h1>
        <p style={{
          marginTop: 28,
          maxWidth: 560,
          fontSize: "clamp(15px, 1.4vw, 19px)", fontWeight: 300,
          lineHeight: 1.55, color: "rgba(0,60,70,0.7)",
        }}>
          {blurb ?? `The ${section.toLowerCase()} page is in the workshop. We'll flip it on as soon as it's ready. In the meantime, follow along or grab a demo below.`}
        </p>

        <div style={{
          marginTop: 36,
          display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center",
        }}>
          <Link href="/" style={{
            display: "inline-flex", alignItems: "center",
            padding: "14px 28px", borderRadius: 999,
            background: "#003c46", color: "#f2f2f0",
            fontSize: 13, fontWeight: 700,
            letterSpacing: "0.18em", textTransform: "uppercase",
            textDecoration: "none",
            transition: "background 0.25s ease, transform 0.25s ease",
          }}>
            Back to home
          </Link>
          <a
            href="https://calendly.com/maksymilian-mentic/mentic-alpha-access-onboarding-pilot-user"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center",
              padding: "14px 28px", borderRadius: 999,
              background: "#8bf2d3", color: "#003c46",
              fontSize: 13, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              textDecoration: "none",
              transition: "background 0.25s ease, transform 0.25s ease",
            }}
          >
            Book a Demo
          </a>
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
