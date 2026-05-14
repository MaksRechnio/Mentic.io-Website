import type { Metadata } from "next";
import Image from "next/image";
import SiteMenu from "@/components/SiteMenu";

export const metadata: Metadata = {
  title: "Team",
  description: "The team behind Mentic — Maksymilian Rechnio (CEO), Bo Bredenbruecher (CTO) and Miguel Werneck Roale (Founding Engineer).",
  alternates: { canonical: "/team" },
};

type Member = {
  name: string;
  role: string;
  photo?: { src: string; alt: string };
  initials?: string;
};

const TEAM: Member[] = [
  {
    name: "Maksymilian Rechnio",
    role: "CEO",
    photo: { src: "/images/team/maks-rechnio.jpeg", alt: "Maksymilian Rechnio" },
  },
  {
    name: "Bo Bredenbruecher",
    role: "CTO",
    photo: { src: "/images/team/bo-bredenbruecher.jpg", alt: "Bo Bredenbruecher" },
  },
  {
    name: "Miguel Werneck Roale",
    role: "Founding Engineer",
    initials: "MWR",
  },
];

export default function TeamPage() {
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

      {/* Heading */}
      <section style={{
        position: "relative", zIndex: 2,
        padding: "clamp(96px, 12vh, 140px) clamp(20px, 6vw, 56px) clamp(20px, 3vw, 32px)",
        textAlign: "center",
      }}>
        <h1 className="intro-fade-up" style={{
          margin: 0,
          fontSize: "clamp(40px, 6vw, 80px)",
          lineHeight: 1.02,
          fontWeight: 200,
          letterSpacing: "-0.02em",
          color: "#003c46",
          animationDelay: "0.05s",
        }}>
          The <span style={{ fontWeight: 800, color: "#ff6b5c" }}>team</span>.
        </h1>
        <p className="intro-fade-up" style={{
          margin: "16px auto 0",
          maxWidth: 560,
          fontSize: "clamp(15px, 1.2vw, 17px)",
          fontWeight: 300,
          lineHeight: 1.55,
          color: "rgba(0,60,70,0.7)",
          animationDelay: "0.18s",
        }}>
          Founders and the founding engineer behind the autonomous agent.
        </p>
      </section>

      {/* Team grid */}
      <section style={{
        flex: 1,
        position: "relative", zIndex: 2,
        padding: "clamp(16px, 2vw, 32px) clamp(20px, 5vw, 56px) clamp(40px, 6vw, 80px)",
        display: "flex", justifyContent: "center",
      }}>
        <div className="team-grid" style={{
          width: "100%",
          maxWidth: 1320,
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "clamp(20px, 2.6vw, 36px)",
          alignItems: "start",
        }}>
          {TEAM.map((member, i) => (
            <article
              key={member.name}
              className="intro-scale-in team-card"
              style={{
                display: "flex", flexDirection: "column",
                gap: 16,
                animationDelay: `${0.3 + i * 0.12}s`,
              }}
            >
              {/* Photo / placeholder */}
              <div style={{
                position: "relative",
                width: "100%",
                aspectRatio: "3 / 4",
                borderRadius: 24,
                overflow: "hidden",
                background: "#003c46",
                boxShadow:
                  "0 1px 2px rgba(0,0,0,0.04), 0 14px 36px rgba(0,60,70,0.10), 0 40px 80px -20px rgba(0,60,70,0.22), 0 0 0 1px rgba(0,60,70,0.04)",
              }} className="team-photo">
                {member.photo ? (
                  <Image
                    src={member.photo.src}
                    alt={member.photo.alt}
                    fill
                    sizes="(max-width: 880px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                    priority={i < 2}
                  />
                ) : (
                  <div aria-hidden style={{
                    position: "absolute", inset: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background:
                      "radial-gradient(circle at 30% 20%, rgba(139,242,211,0.25), transparent 55%), radial-gradient(circle at 80% 90%, rgba(255,107,92,0.25), transparent 60%), #003c46",
                  }}>
                    <span style={{
                      fontFamily: "var(--font-nunito), 'Nunito Sans', sans-serif",
                      fontSize: "clamp(60px, 10vw, 130px)",
                      fontWeight: 800,
                      color: "rgba(242,242,240,0.95)",
                      letterSpacing: "-0.04em",
                    }}>
                      {member.initials}
                    </span>
                  </div>
                )}

                {/* Orange mentic icon — top-right */}
                <div style={{
                  position: "absolute",
                  top: "clamp(12px, 1.8vw, 20px)",
                  right: "clamp(12px, 1.8vw, 20px)",
                  width: "clamp(36px, 4.5vw, 56px)",
                  height: "clamp(36px, 4.5vw, 56px)",
                  filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.25))",
                }}>
                  <Image
                    src="/images/mentic-icon-orange.png"
                    alt=""
                    fill
                    sizes="56px"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>

              {/* Name + role */}
              <div style={{ padding: "0 4px" }}>
                <div style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.24em",
                  color: "#ff6b5c", textTransform: "uppercase",
                  marginBottom: 6,
                }}>
                  {member.role}
                </div>
                <h2 style={{
                  margin: 0,
                  fontSize: "clamp(22px, 2vw, 30px)",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: "#003c46",
                  lineHeight: 1.15,
                }}>
                  {member.name}
                </h2>
              </div>
            </article>
          ))}
        </div>
      </section>

      <style>{`
        @media (max-width: 880px) {
          .team-grid { grid-template-columns: 1fr !important; max-width: 460px; }
        }
        @media (min-width: 881px) {
          .team-photo { height: 60vh; aspect-ratio: auto !important; }
        }
      `}</style>
    </main>
  );
}
