import SiteMenu from "@/components/SiteMenu";

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

      <section style={{
        flex: 1,
        position: "relative", zIndex: 2,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "clamp(76px, 9vh, 120px) clamp(20px, 6vw, 56px) clamp(28px, 4vh, 56px)",
        textAlign: "center",
      }}>
        <h1 style={{
          margin: 0,
          fontFamily: "var(--font-nunito), 'Nunito Sans', sans-serif",
          fontSize: "clamp(56px, 11vw, 168px)",
          lineHeight: 0.95,
          fontWeight: 200,
          letterSpacing: "-0.02em",
          color: "#003c46",
        }}>
          <span style={{ display: "block", fontWeight: 200 }}>{section}</span>
          <span style={{ display: "block", fontWeight: 800, color: "#ff6b5c" }}>coming soon.</span>
        </h1>
        <p style={{
          marginTop: 28,
          maxWidth: 560,
          fontSize: "clamp(15px, 1.4vw, 19px)", fontWeight: 300,
          lineHeight: 1.55, color: "rgba(0,60,70,0.7)",
        }}>
          {blurb ?? `The ${section.toLowerCase()} page is in the workshop. We'll flip it on as soon as it's ready. In the meantime, open the menu — or grab a demo below.`}
        </p>

        <div style={{
          marginTop: 32,
          display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center",
        }}>
          <a
            href="https://calendly.com/maksymilian-mentic/mentic-alpha-access-onboarding-pilot-user"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center",
              padding: "14px 28px", borderRadius: 999,
              background: "#003c46", color: "#f2f2f0",
              fontSize: 13, fontWeight: 700,
              letterSpacing: "0.18em", textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            Book a Demo
          </a>
        </div>
      </section>
    </main>
  );
}
