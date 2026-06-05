import type { Metadata } from "next";
import Image from "next/image";
import SiteMenu from "@/components/SiteMenu";

const SITE_URL = "https://www.mentic.io";
const TEAM_TITLE = "Team";
const TEAM_DESCRIPTION =
  "The team behind Mentic — Maksymilian Rechnio (CEO), Bo Bredenbruecher (CTO) and Miguel Werneck Roale (Founding Engineer).";

export const metadata: Metadata = {
  title: TEAM_TITLE,
  description: TEAM_DESCRIPTION,
  alternates: { canonical: "/team" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/team`,
    title: `${TEAM_TITLE} | Mentic`,
    description: TEAM_DESCRIPTION,
  },
  twitter: {
    title: `${TEAM_TITLE} | Mentic`,
    description: TEAM_DESCRIPTION,
  },
};

type Member = {
  name: string;
  role: string;
  photo?: { src: string; alt: string };
  initials?: string;
  linkedin: string;
  instagram: string;
};

const TEAM: Member[] = [
  {
    name: "Maksymilian Rechnio",
    role: "CEO",
    photo: { src: "/images/team/maks-rechnio.jpeg", alt: "Maksymilian Rechnio" },
    linkedin: "https://www.linkedin.com/in/maksymilian-rechnio",
    instagram: "https://www.instagram.com/maksymilian_rechnio/",
  },
  {
    name: "Bo Bredenbruecher",
    role: "CTO",
    photo: { src: "/images/team/bo-bredenbruecher.jpg", alt: "Bo Bredenbruecher" },
    linkedin: "https://www.linkedin.com/in/bobredenbruecher/",
    instagram: "https://www.instagram.com/justusbo/",
  },
  {
    name: "Miguel Werneck Roale",
    role: "Founding Engineer",
    photo: { src: "/images/team/miguel-werneck-roale.jpeg", alt: "Miguel Werneck Roale" },
    linkedin: "https://www.linkedin.com/in/miguel-werneck-roale-901a6b213/",
    instagram: "https://www.instagram.com/miguelwroale/",
  },
];

const teamJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Team", item: `${SITE_URL}/team` },
      ],
    },
    ...TEAM.map((member) => ({
      "@type": "Person",
      name: member.name,
      jobTitle: member.role,
      image: member.photo ? `${SITE_URL}${member.photo.src}` : undefined,
      worksFor: { "@id": `${SITE_URL}/#organization` },
      sameAs: [member.linkedin, member.instagram],
    })),
  ],
};

export default function TeamPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(teamJsonLd) }}
      />
    <main className="use-native-cursor min-h-[100dvh] w-full bg-[#f2f2f0] text-dark-teal font-sans relative overflow-hidden flex flex-col">
      <SiteMenu />

      {/* Corner blobs */}
      <div aria-hidden className="gradient-blob gradient-blob-coral intro-fade-in absolute pointer-events-none w-[min(45vw,720px)] h-[min(45vw,720px)] top-[-22vw] left-[-22vw]" style={{
        animationDelay: "0.1s",
      }} />
      <div aria-hidden className="gradient-blob gradient-blob-mint intro-fade-in absolute pointer-events-none w-[min(55vw,880px)] h-[min(55vw,880px)] bottom-[-28vw] right-[-28vw]" style={{
        animationDelay: "0.2s",
      }} />

      {/* Heading */}
      <section className="relative z-[2] px-[clamp(20px,6vw,56px)] pt-[clamp(96px,12vh,140px)] pb-[clamp(20px,3vw,32px)] text-center">
        <h1 className="intro-fade-up m-0 text-[clamp(40px,6vw,80px)] leading-[1.02] font-extralight tracking-[-0.02em] text-dark-teal" style={{
          animationDelay: "0.05s",
        }}>
          The <span className="font-extrabold text-coral">team</span>.
        </h1>
        <p className="intro-fade-up mt-4 mx-auto max-w-[560px] text-[clamp(15px,1.2vw,17px)] font-light leading-[1.55] text-dark-teal/70" style={{
          animationDelay: "0.18s",
        }}>
          Founders and the founding engineer behind the autonomous agent.
        </p>
      </section>

      {/* Team grid */}
      <section className="flex-1 relative z-[2] px-[clamp(20px,5vw,56px)] pt-[clamp(16px,2vw,32px)] pb-[clamp(40px,6vw,80px)] flex justify-center">
        <div className="team-grid w-full max-w-[1320px] grid grid-cols-[repeat(3,minmax(0,1fr))] gap-[clamp(20px,2.6vw,36px)] items-start">
          {TEAM.map((member, i) => (
            <article
              key={member.name}
              className="intro-scale-in team-card flex flex-col gap-4"
              style={{
                animationDelay: `${0.3 + i * 0.12}s`,
              }}
            >
              {/* Photo / placeholder */}
              <div className="team-photo relative w-full aspect-[3/4] rounded-3xl overflow-hidden bg-dark-teal shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_36px_rgba(0,60,70,0.10),0_40px_80px_-20px_rgba(0,60,70,0.22),0_0_0_1px_rgba(0,60,70,0.04)]">
                {member.photo ? (
                  <Image
                    src={member.photo.src}
                    alt={member.photo.alt}
                    fill
                    sizes="(max-width: 880px) 100vw, 33vw"
                    className="object-cover"
                    priority={i < 2}
                  />
                ) : (
                  <div aria-hidden className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(139,242,211,0.25),transparent_55%),radial-gradient(circle_at_80%_90%,rgba(255,107,92,0.25),transparent_60%),#003c46]">
                    <span className="font-sans text-[clamp(60px,10vw,130px)] font-extrabold text-[rgba(242,242,240,0.95)] tracking-[-0.04em]">
                      {member.initials}
                    </span>
                  </div>
                )}

                {/* Mint mentic icon — top-right */}
                <div className="absolute top-[clamp(10px,1.4vw,16px)] right-[clamp(10px,1.4vw,16px)] w-[clamp(22px,2.6vw,34px)] h-[clamp(22px,2.6vw,34px)] [filter:drop-shadow(0_4px_12px_rgba(0,0,0,0.25))]">
                  <Image
                    src="/images/mentic-icon-mint.png"
                    alt=""
                    fill
                    sizes="34px"
                    className="object-contain"
                  />
                </div>
              </div>

              {/* Name + role + socials */}
              <div className="px-1">
                <div className="text-[11px] font-bold tracking-[0.24em] text-coral uppercase mb-1.5">
                  {member.role}
                </div>
                <h2 className="m-0 text-[clamp(22px,2vw,30px)] font-bold tracking-[-0.01em] text-dark-teal leading-[1.15]">
                  {member.name}
                </h2>
                <div className="mt-3.5 flex gap-2.5 items-center">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on LinkedIn`}
                    className="team-social inline-flex items-center justify-center w-9 h-9 rounded-[999px] bg-[rgba(0,60,70,0.06)] text-dark-teal no-underline transition-[background,color,transform] duration-[250ms] ease-[ease]"
                  >
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
                    </svg>
                  </a>
                  <a
                    href={member.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${member.name} on Instagram`}
                    className="team-social inline-flex items-center justify-center w-9 h-9 rounded-[999px] bg-[rgba(0,60,70,0.06)] text-dark-teal no-underline transition-[background,color,transform] duration-[250ms] ease-[ease]"
                  >
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <circle cx="12" cy="12" r="4.5" />
                      <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
                    </svg>
                  </a>
                </div>
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
    </>
  );
}
