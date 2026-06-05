"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Categories ── */
const CATEGORIES = [
  { key: "all", label: "All integrations" },
  { key: "communication", label: "Communication" },
  { key: "assets", label: "Creative assets" },
  { key: "ads", label: "Ad platforms" },
] as const;

type CategoryKey = (typeof CATEGORIES)[number]["key"];

type Integration = {
  name: string;
  category: Exclude<CategoryKey, "all">;
  description: string;
  href?: string;
  comingSoon?: boolean;
  logo: React.ReactNode;
};

/* ── Brand marks (simplified, inline so no external requests) ── */
const SlackLogo = (
  <svg viewBox="0 0 122.8 122.8" className="w-7 h-7" aria-hidden>
    <path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zM32.3 77.6c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a" />
    <path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zM45.2 32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0" />
    <path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zM90.5 45.2c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d" />
    <path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zM77.6 90.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e" />
  </svg>
);

const TelegramLogo = (
  <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden>
    <circle cx="12" cy="12" r="12" fill="#2aabee" />
    <path
      fill="#fff"
      d="M5.43 11.87l11.2-4.32c.52-.19.97.12.8.91l-1.91 8.98c-.14.64-.52.79-1.05.49l-2.91-2.14-1.4 1.35c-.16.16-.29.29-.59.29l.21-2.96 5.39-4.87c.23-.21-.05-.33-.36-.12l-6.66 4.19-2.87-.89c-.62-.2-.63-.62.13-.92z"
    />
  </svg>
);

const TeamsLogo = (
  <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden>
    <circle cx="17" cy="6.6" r="2.6" fill="#7b83eb" />
    <path fill="#7b83eb" d="M20.9 10.2h-5.1a.8.8 0 0 0-.8.8v5.2a3.6 3.6 0 0 0 3.6 3.6 3.7 3.7 0 0 0 3.1-3.7v-5.1a.8.8 0 0 0-.8-.8z" />
    <rect x="1" y="5" width="13" height="13" rx="1.6" fill="#5059c9" />
    <path fill="#fff" d="M10.6 8.5H8.4v6.4H6.7V8.5H4.5V7h6.1v1.5z" />
  </svg>
);

const DropboxLogo = (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#0061ff" aria-hidden>
    <path d="M6 1.8l6 3.83L6 9.45 0 5.63 6 1.8zm12 0l6 3.83-6 3.82-6-3.82 6-3.83zM0 13.27l6-3.82 6 3.82-6 3.83-6-3.83zm18-3.82l6 3.82-6 3.83-6-3.83 6-3.82zM6 18.38l6-3.83 6 3.83-6 3.82-6-3.82z" />
  </svg>
);

const OneDriveLogo = (
  <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden>
    <path
      fill="#0364b8"
      d="M19.35 10.54A7.49 7.49 0 0 0 12 4.5a7.48 7.48 0 0 0-6.64 4.04A6 6 0 0 0 6 20.5h13a5 5 0 0 0 .35-9.96z"
    />
  </svg>
);

const GoogleDriveLogo = (
  <svg viewBox="0 0 87.3 78" className="w-7 h-7" aria-hidden>
    <path fill="#0066da" d="M6.6 66.85l3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" />
    <path fill="#00ac47" d="M43.65 25L29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44A9.06 9.06 0 0 0 0 53h27.5z" />
    <path fill="#ea4335" d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75L86.1 57.5c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 11.5z" />
    <path fill="#00832d" d="M43.65 25L57.4 1.2c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" />
    <path fill="#2684fc" d="M59.8 53H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" />
    <path fill="#ffba00" d="M73.4 26.5l-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z" />
  </svg>
);

const FrameioLogo = (
  <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden>
    <rect width="24" height="24" rx="5.5" fill="#5b53ff" />
    <path fill="#fff" d="M7.5 5.5h9.4v3H10.5v2.6h5.6v3h-5.6v4.4h-3z" />
  </svg>
);

const MetaLogo = (
  <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden>
    <path
      d="M4 12.4c0-2.6 1.5-4.9 3.6-4.9 4.1 0 5 9 8.9 9 2 0 3.5-2 3.5-4.5s-1.4-4.5-3.4-4.5c-4 0-5.1 9-9 9-2.1 0-3.6-1.9-3.6-4.1z"
      fill="none"
      stroke="#0082fb"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const GoogleAdsLogo = (
  <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden>
    <rect x="9.6" y="2.4" width="4.8" height="17" rx="2.4" fill="#fbbc04" transform="rotate(-30 12 11)" />
    <rect x="9.6" y="2.4" width="4.8" height="17" rx="2.4" fill="#4285f4" transform="rotate(30 12 11)" />
    <circle cx="4.8" cy="18.4" r="3.2" fill="#34a853" />
  </svg>
);

const GoogleChatLogo = (
  <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden>
    <path
      fill="#00ac47"
      d="M5.6 2A1.6 1.6 0 0 0 4 3.6V16l3.4-3.2H18a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 18 2H5.6z"
    />
    <path
      fill="#0066da"
      d="M4 7.2H2.4A1.6 1.6 0 0 0 .8 8.8v12.4L4.6 18h10.2a1.6 1.6 0 0 0 1.6-1.6v-1.6H7.4L4 18V7.2z"
      opacity="0.92"
    />
  </svg>
);

const WhatsAppLogo = (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#25d366" aria-hidden>
    <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.47-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.66-1.6-.91-2.2-.24-.57-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.46 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.18-1.42-.08-.12-.27-.2-.57-.34zM12.04 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.39 9.39 0 0 1-1.44-5.02c0-5.2 4.23-9.43 9.43-9.43a9.37 9.37 0 0 1 6.66 2.76 9.37 9.37 0 0 1 2.76 6.68c0 5.2-4.24 9.42-9.44 9.42zm8.03-17.45A11.3 11.3 0 0 0 12.04.6C5.78.6.68 5.7.68 11.96c0 2 .52 3.96 1.52 5.69L.58 23.54l6.03-1.58a11.34 11.34 0 0 0 5.42 1.38h.01c6.26 0 11.36-5.1 11.36-11.36 0-3.04-1.18-5.89-3.33-8.03z" />
  </svg>
);

const LinkedInLogo = (
  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#0a66c2" aria-hidden>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);

/* ── Directory data ── */
const INTEGRATIONS: Integration[] = [
  {
    name: "Slack",
    category: "communication",
    description: "Launch campaigns, ask about performance and approve changes without leaving your workspace.",
    href: "/integrations/slack",
    logo: SlackLogo,
  },
  {
    name: "Telegram",
    category: "communication",
    description: "Chat with your agent, get reports and approve optimisations on the go.",
    logo: TelegramLogo,
  },
  {
    name: "Microsoft Teams",
    category: "communication",
    description: "Bring campaign updates and approvals into the channels your company already uses.",
    logo: TeamsLogo,
  },
  {
    name: "Google Chat",
    category: "communication",
    description: "Talk to your agent inside Google Workspace, right next to your inbox.",
    comingSoon: true,
    logo: GoogleChatLogo,
  },
  {
    name: "WhatsApp",
    category: "communication",
    description: "Get reports and approve campaign changes from the chat app in your pocket.",
    comingSoon: true,
    logo: WhatsAppLogo,
  },
  {
    name: "Dropbox",
    category: "assets",
    description: "Sync creatives straight from your Dropbox folders into new campaigns.",
    logo: DropboxLogo,
  },
  {
    name: "OneDrive",
    category: "assets",
    description: "Pull images and video from OneDrive whenever the agent builds your ads.",
    logo: OneDriveLogo,
  },
  {
    name: "Google Drive",
    category: "assets",
    description: "Connect shared drives so every approved creative is one mention away.",
    logo: GoogleDriveLogo,
  },
  {
    name: "Frame.io",
    category: "assets",
    description: "Hand finished video cuts to the agent right from your review workflow.",
    logo: FrameioLogo,
  },
  {
    name: "Meta",
    category: "ads",
    description: "Launch and optimise campaigns across Facebook, Instagram and Threads.",
    logo: MetaLogo,
  },
  {
    name: "Google Ads",
    category: "ads",
    description: "Search, YouTube and Performance Max, run by the same autonomous agent.",
    comingSoon: true,
    logo: GoogleAdsLogo,
  },
  {
    name: "LinkedIn Ads",
    category: "ads",
    description: "B2B campaigns with the same hands-off workflow you use everywhere else.",
    comingSoon: true,
    logo: LinkedInLogo,
  },
];

const CATEGORY_LABEL: Record<Exclude<CategoryKey, "all">, string> = {
  communication: "Communication",
  assets: "Creative assets",
  ads: "Ad platforms",
};

/* ── Card ── */
function IntegrationCard({ integration, index }: { integration: Integration; index: number }) {
  const inner = (
    <>
      <div className="flex items-start justify-between">
        <span className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_20px_rgba(0,60,70,0.08)] border border-dark-teal/[0.05]">
          {integration.logo}
        </span>
        {integration.comingSoon && (
          <span className="inline-flex items-center h-6 px-2.5 rounded-full bg-mint/40 text-dark-teal text-[10px] font-bold tracking-[0.12em] uppercase">
            Coming soon
          </span>
        )}
      </div>
      <h3 className="m-0 mt-4 text-[clamp(17px,1.5vw,20px)] font-bold tracking-[-0.01em] text-dark-teal">
        {integration.name}
      </h3>
      <div className="mt-1 text-[11px] font-bold tracking-[0.16em] uppercase text-dark-teal/45">
        {CATEGORY_LABEL[integration.category]}
      </div>
      <p className="m-0 mt-2.5 text-[14px] font-light leading-[1.6] text-dark-teal/70 flex-1">
        {integration.description}
      </p>
      {integration.href && (
        <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-bold tracking-[0.1em] uppercase text-coral">
          Learn more
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      )}
    </>
  );

  const cardClass =
    "intro-fade-up flex flex-col rounded-3xl bg-white border border-dark-teal/[0.06] p-[clamp(20px,2.2vw,28px)] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_12px_30px_rgba(0,60,70,0.06)] transition-[transform,box-shadow] duration-[250ms] ease-premium";

  if (integration.href) {
    return (
      <Link
        href={integration.href}
        className={`${cardClass} no-underline text-inherit hover:-translate-y-1 hover:shadow-[0_1px_2px_rgba(0,0,0,0.03),0_22px_48px_rgba(0,60,70,0.12)]`}
        style={{ animationDelay: `${0.05 + index * 0.05}s` }}
      >
        {inner}
      </Link>
    );
  }

  return (
    <article className={cardClass} style={{ animationDelay: `${0.05 + index * 0.05}s` }}>
      {inner}
    </article>
  );
}

/* ── Filterable directory ── */
export default function IntegrationsDirectory() {
  const [category, setCategory] = useState<CategoryKey>("all");

  const visible = INTEGRATIONS.filter(
    (i) => category === "all" || i.category === category
  );

  return (
    <div className="mx-auto max-w-[1100px]">
      {/* Filter pills */}
      <div className="intro-fade-up flex flex-wrap gap-2.5 justify-center" style={{ animationDelay: "0.3s" }} role="tablist" aria-label="Filter integrations by category">
        {CATEGORIES.map((c) => {
          const active = category === c.key;
          return (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(c.key)}
              className={`inline-flex items-center h-10 px-5 rounded-full text-[12px] font-bold tracking-[0.12em] uppercase transition-[background,color,border-color] duration-[250ms] ease-premium border-[1.5px] ${
                active
                  ? "bg-dark-teal border-dark-teal text-[#f2f2f0]"
                  : "bg-transparent border-dark-teal/20 text-dark-teal/70 hover:border-dark-teal/45 hover:text-dark-teal"
              }`}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div key={category} className="mt-[clamp(28px,3.4vw,48px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[clamp(14px,1.8vw,24px)]">
        {visible.map((integration, i) => (
          <IntegrationCard key={integration.name} integration={integration} index={i} />
        ))}
      </div>
    </div>
  );
}
