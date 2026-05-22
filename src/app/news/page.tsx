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
          width: "100%", maxWidth: 880,
          display: "flex", flexDirection: "column", gap: 12,
        }}>
          {NEWS.map((item, i) => (
            <NewsItemCard key={item.isoDate + i} item={item} index={i} defaultOpen={i === 0} />
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
    </>
  );
}
