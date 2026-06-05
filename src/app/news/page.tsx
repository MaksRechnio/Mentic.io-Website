import type { Metadata } from "next";
import SiteMenu from "@/components/SiteMenu";
import NewsItemCard, { type NewsItemData } from "./NewsItemCard";

const SITE_URL = "https://www.mentic.io";
const NEWS_TITLE = "News";
const NEWS_DESCRIPTION =
  "Mentic news — Mentic's AI Advertiser launches in alpha, the team wins the Grand Prize at the SF State Appathon with SnapChef, and joins Batch 001 of Teleport SF.";

export const metadata: Metadata = {
  title: NEWS_TITLE,
  description: NEWS_DESCRIPTION,
  alternates: { canonical: "/news" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/news`,
    title: `${NEWS_TITLE} | Mentic`,
    description: NEWS_DESCRIPTION,
  },
  twitter: {
    title: `${NEWS_TITLE} | Mentic`,
    description: NEWS_DESCRIPTION,
  },
};

const NEWS: NewsItemData[] = [
  {
    date: "21 May 2026",
    isoDate: "2026-05-21",
    tag: "Launch",
    titleParts: [
      { text: "Mentic is ", weight: 700, color: "#003c46" },
      { text: "live", weight: 800, color: "#ff6b5c" },
      { text: ".", weight: 700, color: "#003c46" },
    ],
    body:
      "MENTIC IS LAUNCHING!\n\nWe built an AI Advertiser that:\n\n1. Autonomously launches your ads.\n2. Manages and optimises while you sleep.\n3. Tailors a strategy and executes it.\n\nGive it your URL, your budget, and your goal.\n\nRun the whole thing from Slack or Telegram.\n\nYou own every account, every pixel, every audience.\n\nNo huge retainer, no lock-in.\n\nBuilt for small businesses that want the work done without handing over the keys.\n\nAlpha's open — link in the comments.",
  },
  {
    date: "20 May 2026",
    isoDate: "2026-05-20",
    tag: "Award",
    titleParts: [
      { text: "Mentic team wins the ", weight: 700, color: "#003c46" },
      { text: "Grand Prize", weight: 800, color: "#ff6b5c" },
      { text: " at the ", weight: 700, color: "#003c46" },
      { text: "SF State Appathon", weight: 800, color: "#003c46" },
      { text: ".", weight: 700, color: "#003c46" },
    ],
    body:
      "Yesterday at San Francisco State University's Appathon — a mobile-apps hackathon — the Mentic team (Brittany Sosa, Bo Bredenbruecher, Maksymilian Rechnio) took first place with SnapChef: a mobile app that turns a single photo of your fridge or pantry into a live food inventory. SnapChef recognises products and their expiry dates, sends notifications before food goes off, and generates recipes from exactly what you already have — with integrations planned for connected kitchen devices like Thermomix.",
    image: {
      src: "/news-snapchef-appathon.jpg",
      alt: "Mentic team receiving the Grand Prize at the SF State Appathon for SnapChef",
    },
  },
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
      "Last Thursday, Mentic.io joined the inaugural cohort of Teleport SF — an accelerator backing teams shipping autonomous AI products. Out of the 001 batch, we're the team carrying the autonomous-advertising flag. Onboarding pilot users right after launch on 21 May.",
  },
];

const newsJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "News", item: `${SITE_URL}/news` },
      ],
    },
    ...NEWS.map((item) => {
      const headline = item.titleParts.map((p) => p.text).join("").trim();
      return {
        "@type": "NewsArticle",
        headline,
        datePublished: item.isoDate,
        dateModified: item.isoDate,
        articleSection: item.tag,
        description: item.body,
        image: `${SITE_URL}/opengraph-image`,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_URL}/news`,
        },
      };
    }),
  ],
};

export default function NewsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(newsJsonLd) }}
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

      {/* News list */}
      <section className="flex-1 relative z-[2] flex justify-center items-center px-[clamp(16px,4vw,56px)] pt-[clamp(76px,9vh,120px)] pb-[clamp(28px,4vh,56px)]">
        <div className="w-full max-w-[880px] flex flex-col gap-3">
          {NEWS.map((item, i) => (
            <NewsItemCard key={item.isoDate + i} item={item} index={i} defaultOpen={i === 0} />
          ))}

          <p className="intro-fade-up mt-2 mx-auto text-[13px] font-light text-dark-teal/50 text-center" style={{
            animationDelay: `${0.25 + NEWS.length * 0.1}s`,
          }}>
            More updates as we ship. Follow{" "}
            <a
              href="https://www.linkedin.com/company/mentic-io"
              target="_blank" rel="noopener noreferrer"
              className="text-dark-teal font-semibold"
            >
              @mentic-io on LinkedIn
            </a>{" "}
            for the freshest.
          </p>
        </div>
      </section>
    </main>
    </>
  );
}
