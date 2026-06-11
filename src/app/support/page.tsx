import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with Mentic. Reach our support team at support@mentic.io for questions about your account, billing, integrations, or campaigns.",
  alternates: { canonical: "/support" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Support | Mentic",
    description:
      "Get help with Mentic. Reach our support team at support@mentic.io.",
    url: "https://www.mentic.io/support",
    type: "website",
  },
};

const CONTACT_EMAIL = "support@mentic.io";

const SITE_URL = "https://www.mentic.io";

const supportJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Support", item: `${SITE_URL}/support` },
      ],
    },
    {
      "@type": "ContactPage",
      "@id": `${SITE_URL}/support#webpage`,
      url: `${SITE_URL}/support`,
      name: "Support | Mentic",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
    },
  ],
};

export default function SupportPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(supportJsonLd) }}
      />
    <main className="use-native-cursor min-h-dvh w-full bg-off-white font-sans text-near-black px-[clamp(16px,5vw,48px)] py-[clamp(24px,6vw,64px)]">
      <div className="mx-auto max-w-[760px]">
        <header className="mb-[clamp(32px,6vw,56px)] flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Back to Mentic home"
            className="inline-flex items-center gap-2 rounded-full border border-dark-teal/15 bg-white/60 px-3 py-2 text-sm font-semibold text-dark-teal no-underline transition-[background-color,transform] duration-200 ease-premium hover:-translate-x-0.5 hover:bg-white"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Back to home</span>
          </Link>
          <div className="inline-flex items-center gap-2.5">
            <Image src="/images/mentic-icon-teal.png" alt="" width={36} height={36} priority />
            <span className="font-qurova text-[28px] leading-none text-dark-teal">mentic</span>
          </div>
        </header>

        <article className="rounded-3xl border border-dark-teal/[0.06] bg-white p-[clamp(28px,6vw,64px)] shadow-[0_1px_0_rgba(0,60,70,0.04),0_24px_60px_-32px_rgba(0,60,70,0.18)] [&_p]:mb-3 [&_p]:text-[15.5px] [&_p]:leading-[1.65] [&_p]:text-near-black [&_a]:text-dark-teal [&_a]:underline [&_a]:decoration-coral/45 [&_a]:underline-offset-[3px] [&_a]:transition-colors [&_a]:duration-200 [&_a]:ease-premium [&_a:hover]:text-coral [&_a:hover]:decoration-coral">
          <p className="font-bold uppercase tracking-[0.14em]">Help</p>
          <h1 className="mb-3 text-[clamp(36px,6vw,56px)] font-light leading-[1.05] tracking-[-0.01em] text-dark-teal">
            <span className="font-bold">Support</span>
          </h1>
          <p>
            Questions about your account, billing, integrations, or
            campaigns? Our team reads every message and gets back to you
            quickly.
          </p>

          <div className="mt-8 mb-2 rounded-[14px] border border-dark-teal/[0.08] bg-off-white px-6 py-5">
            <span className="block text-[11px] font-bold uppercase tracking-[0.1em] text-dark-teal/55">Email us</span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-1 inline-block text-[clamp(20px,3vw,28px)] font-bold text-dark-teal"
            >
              {CONTACT_EMAIL}
            </a>
          </div>

          <p className="mt-6">
            You can also reach the team directly from inside the app, or in
            your shared Slack or Telegram channel if you are on the Alpha
            plan.
          </p>

          <footer className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-dark-teal/10 pt-6 text-[13px] text-near-black/60">
            <Link href="/" className="font-semibold">
              ← Return to mentic.io
            </Link>
            <span className="flex gap-4">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
            </span>
          </footer>
        </article>
      </div>
    </main>
    </>
  );
}
