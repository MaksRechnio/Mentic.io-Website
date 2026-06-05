import type { Metadata } from "next";
import SiteMenu from "@/components/SiteMenu";
import IntegrationsDirectory from "./IntegrationsDirectory";

const SITE_URL = "https://www.mentic.io";
const PAGE_TITLE = "Integrations";
const PAGE_DESCRIPTION =
  "Mentic plugs into the tools you already use. Chat with your agent in Slack, Telegram or Microsoft Teams, pull creatives from Dropbox, OneDrive, Google Drive or Frame.io, and run campaigns on Meta, with Google Ads and LinkedIn Ads coming soon.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/integrations" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/integrations`,
    title: `${PAGE_TITLE} | Mentic`,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    title: `${PAGE_TITLE} | Mentic`,
    description: PAGE_DESCRIPTION,
  },
};

const integrationsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Integrations", item: `${SITE_URL}/integrations` },
      ],
    },
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/integrations#list`,
      name: "Mentic integrations",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Slack", url: `${SITE_URL}/integrations/slack` },
        { "@type": "ListItem", position: 2, name: "Telegram" },
        { "@type": "ListItem", position: 3, name: "Microsoft Teams" },
        { "@type": "ListItem", position: 4, name: "Google Chat" },
        { "@type": "ListItem", position: 5, name: "WhatsApp" },
        { "@type": "ListItem", position: 6, name: "Dropbox" },
        { "@type": "ListItem", position: 7, name: "OneDrive" },
        { "@type": "ListItem", position: 8, name: "Google Drive" },
        { "@type": "ListItem", position: 9, name: "Frame.io" },
        { "@type": "ListItem", position: 10, name: "Meta" },
        { "@type": "ListItem", position: 11, name: "Google Ads" },
        { "@type": "ListItem", position: 12, name: "LinkedIn Ads" },
      ],
    },
  ],
};

export default function IntegrationsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(integrationsJsonLd) }}
      />
      <main className="use-native-cursor min-h-[100dvh] w-full bg-[#f2f2f0] text-dark-teal font-sans relative overflow-hidden flex flex-col">
        <SiteMenu />

        {/* Corner blobs */}
        <div
          aria-hidden
          className="gradient-blob gradient-blob-coral intro-fade-in absolute pointer-events-none w-[min(45vw,720px)] h-[min(45vw,720px)] top-[-22vw] left-[-22vw]"
          style={{ animationDelay: "0.1s" }}
        />
        <div
          aria-hidden
          className="gradient-blob gradient-blob-mint intro-fade-in absolute pointer-events-none w-[min(55vw,880px)] h-[min(55vw,880px)] bottom-[-28vw] right-[-28vw]"
          style={{ animationDelay: "0.2s" }}
        />

        {/* Heading */}
        <section className="relative z-[2] px-[clamp(20px,6vw,56px)] pt-[clamp(96px,12vh,140px)] pb-[clamp(20px,3vw,36px)] text-center">
          <div className="intro-fade-up text-[11px] font-bold tracking-[0.24em] text-coral uppercase" style={{ animationDelay: "0.05s" }}>
            Works with your stack
          </div>
          <h1 className="intro-fade-up m-0 mt-2 text-[clamp(40px,6vw,80px)] leading-[1.02] font-extralight tracking-[-0.02em] text-dark-teal" style={{ animationDelay: "0.12s" }}>
            <span className="font-extrabold text-coral">Integrations</span>.
          </h1>
          <p className="intro-fade-up mt-4 mx-auto max-w-[600px] text-[clamp(15px,1.2vw,17px)] font-light leading-[1.55] text-dark-teal/70" style={{ animationDelay: "0.2s" }}>
            Mentic plugs into the tools you already use. Chat where you work,
            store assets where they live, and run ads where your customers are.
          </p>
        </section>

        {/* Directory */}
        <section className="flex-1 relative z-[2] px-[clamp(20px,5vw,56px)] pt-[clamp(8px,1.5vw,20px)] pb-[clamp(48px,7vw,96px)]">
          <IntegrationsDirectory />
        </section>
      </main>
    </>
  );
}
