import type { Metadata } from "next";
import SiteMenu from "@/components/SiteMenu";
import TrackedDemoLink from "@/components/TrackedDemoLink";

const SITE_URL = "https://www.mentic.io";
const PRICING_TITLE = "Pricing";
const PRICING_DESCRIPTION =
  "Mentic pricing — Advertising Simplicity at $247/month for full Mentic.io access (self-serve, no human media buyers), or the Alpha plan at $997/month with a senior team of human media buyers from EXQDigital and every EXQDigital agency service included free for pilot users.";

export const metadata: Metadata = {
  title: PRICING_TITLE,
  description: PRICING_DESCRIPTION,
  alternates: { canonical: "/pricing" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/pricing`,
    title: `${PRICING_TITLE} | Mentic`,
    description: PRICING_DESCRIPTION,
  },
  twitter: {
    title: `${PRICING_TITLE} | Mentic`,
    description: PRICING_DESCRIPTION,
  },
};

const pricingJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Pricing", item: `${SITE_URL}/pricing` },
      ],
    },
    {
      "@type": "Product",
      "@id": `${SITE_URL}/pricing#product`,
      name: "Mentic",
      description: PRICING_DESCRIPTION,
      brand: { "@id": `${SITE_URL}/#organization` },
      image: `${SITE_URL}/opengraph-image`,
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "USD",
        lowPrice: "247",
        highPrice: "997",
        offerCount: 2,
        offers: [
          {
            "@type": "Offer",
            name: "Advertising Simplicity",
            description:
              "Full Mentic.io access — autonomous strategy, launches and optimisation, fully self-serve, no human media buyers.",
            price: "247",
            priceCurrency: "USD",
            url: `${SITE_URL}/pricing`,
            availability: "https://schema.org/InStock",
            category: "Self-serve",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "247",
              priceCurrency: "USD",
              referenceQuantity: {
                "@type": "QuantitativeValue",
                value: 1,
                unitCode: "MON",
              },
            },
          },
          {
            "@type": "Offer",
            name: "Alpha plan",
            description:
              "Full Mentic.io access plus a senior team of human media buyers from EXQDigital and every EXQDigital agency service included free for pilot users.",
            price: "997",
            priceCurrency: "USD",
            url: `${SITE_URL}/pricing`,
            availability: "https://schema.org/LimitedAvailability",
            category: "Agency-wrapped",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "997",
              priceCurrency: "USD",
              referenceQuantity: {
                "@type": "QuantitativeValue",
                value: 1,
                unitCode: "MON",
              },
            },
          },
        ],
      },
    },
  ],
};

const ALPHA_BENEFITS = [
  {
    bold: "Full Mentic.io access",
    rest: " — autonomous strategy, launches and optimisation across your ad accounts.",
  },
  {
    bold: "Human media buyers in the loop, every day",
    rest: " — your account is supervised end-to-end by EXQDigital, the advertising agency behind Mentic. No fire-and-forget.",
  },
  {
    bold: "Every EXQDigital agency service, included free",
    rest: " — strategy, paid social, paid search, reporting and account audits. Normally $3K–$10K/month in retainers, $0 during alpha.",
  },
  {
    bold: "Full visual materials support, end-to-end",
    rest: " — creation, editing and generation of every asset your campaigns need, handled by EXQDigital's creative team.",
  },
  {
    bold: "Direct line to the team",
    rest: " — Slack and Telegram with the founders and the agency.",
  },
];

const SIMPLICITY_BENEFITS = [
  {
    bold: "Full Mentic.io access",
    rest: " — autonomous strategy, launches and optimisation across your ad accounts.",
  },
  {
    bold: "Fully self-serve",
    rest: " — you drive the agent and own the day-to-day. No human media buyers in the loop.",
  },
  {
    bold: "All core automations",
    rest: " — audience research, creative briefs, campaign builds, daily optimisation and reporting.",
  },
  {
    bold: "Same product, smaller footprint",
    rest: " — built for teams who want the autonomy of Mentic without the agency wrap-around.",
  },
];

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingJsonLd) }}
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

      {/* Pricing cards */}
      <section className="pricing-section flex-1 relative z-[2] flex justify-center items-center px-[clamp(16px,4vw,56px)] pt-[clamp(96px,12vh,140px)] pb-[clamp(40px,6vh,72px)]">
        <div className="pricing-cards w-full max-w-[1240px] grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[clamp(20px,2.4vw,32px)] items-stretch">
          {/* ── Simplicity tier ── */}
          <article className="intro-scale-in pricing-card relative bg-white rounded-[28px] p-[clamp(28px,3.6vw,52px)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,60,70,0.06),0_24px_56px_-16px_rgba(0,60,70,0.12),0_0_0_1px_rgba(0,60,70,0.04)] flex flex-col" style={{
            animationDelay: "0.1s",
          }}>
            <div className="plan-badge inline-flex items-center gap-2 self-start py-1.5 px-3.5 rounded-[999px] bg-[#e3fbf2] text-[#007a64] text-[11px] font-bold tracking-[0.16em] uppercase max-w-full">
              <span aria-hidden className="shrink-0 w-1.5 h-1.5 rounded-[999px] bg-[#007a64]" />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">Self-serve</span>
            </div>

            <h2 className="plan-title mt-[22px] mb-2.5 mx-0 text-[clamp(30px,3.4vw,48px)] font-extrabold tracking-[-0.015em] leading-[1.02] text-dark-teal">
              Advertising Simplicity
            </h2>
            <p className="m-0 text-[clamp(14px,1.05vw,16px)] font-light text-dark-teal/70 leading-[1.6] max-w-[440px]">
              Full Mentic.io access, no human media buyers in the loop. The autonomous agent on its own —
              you drive, it executes.
            </p>

            <div className="flex items-baseline gap-2.5 mt-7 mb-1.5 mx-0 flex-wrap">
              <span className="plan-price text-[clamp(44px,5.4vw,72px)] font-extrabold text-dark-teal leading-[0.95] tracking-[-0.025em]">
                $247
              </span>
              <span className="text-[16px] font-normal text-dark-teal/65 tracking-[0.02em]">
                / month
              </span>
            </div>
            <div className="text-[13px] font-medium text-dark-teal/60 tracking-[0.02em]">
              No agency services. Just the agent.
            </div>

            <div className="plan-cta-row flex gap-3 mt-7 flex-wrap">
              <a
                className="plan-cta inline-flex items-center justify-center py-3.5 px-6 rounded-[999px] bg-dark-teal text-[#f2f2f0] text-[13px] font-bold tracking-[0.18em] uppercase no-underline"
                href="https://app.mentic.io/signup"
              >
                Sign up
              </a>
            </div>

            <div className="text-[11px] font-bold tracking-[0.3em] text-dark-teal/55 uppercase mt-9 mb-4 mx-0">
              What you get
            </div>
            <ul className="m-0 p-0 list-none flex flex-col gap-3.5 text-[clamp(14px,1vw,15px)] font-normal leading-[1.6] text-dark-teal">
              {SIMPLICITY_BENEFITS.map((item) => (
                <li key={item.bold} className="flex items-start gap-3">
                  <span aria-hidden className="shrink-0 inline-flex items-center justify-center w-[22px] h-[22px] rounded-[999px] bg-[#e3fbf2] text-dark-teal mt-px">
                    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>
                    <strong className="font-bold">{item.bold}</strong>
                    {item.rest}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          {/* ── Alpha plan (featured) ── */}
          <article className="intro-scale-in pricing-card relative bg-white rounded-[28px] p-[clamp(28px,3.6vw,52px)] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_32px_rgba(0,60,70,0.08),0_40px_80px_-20px_rgba(0,60,70,0.18),0_0_0_2px_#ff6b5c] flex flex-col" style={{
            animationDelay: "0.15s",
          }}>
            <div className="plan-badge inline-flex items-center gap-2 self-start py-1.5 px-3.5 rounded-[999px] bg-[#fff3f2] text-coral text-[11px] font-bold tracking-[0.16em] uppercase max-w-full">
              <span aria-hidden className="shrink-0 w-1.5 h-1.5 rounded-[999px] bg-coral" />
              <span className="whitespace-nowrap overflow-hidden text-ellipsis">Limited — pilot users only</span>
            </div>

            <h1 className="plan-title mt-[22px] mb-2.5 mx-0 text-[clamp(30px,3.4vw,48px)] font-extrabold tracking-[-0.015em] leading-[1.02] text-dark-teal">
              Alpha plan
            </h1>
            <p className="m-0 text-[clamp(14px,1.05vw,16px)] font-light text-dark-teal/70 leading-[1.6] max-w-[440px]">
              The autonomous agent, supervised end-to-end by a real ad agency. One plan, one price,
              no fine print.
            </p>

            <div className="flex items-baseline gap-2.5 mt-7 mb-1.5 mx-0 flex-wrap">
              <span className="plan-price text-[clamp(44px,5.4vw,72px)] font-extrabold text-dark-teal leading-[0.95] tracking-[-0.025em]">
                $997
              </span>
              <span className="text-[16px] font-normal text-dark-teal/65 tracking-[0.02em]">
                / month
              </span>
            </div>
            <div className="text-[13px] font-medium text-coral tracking-[0.02em]">
              $0 for every agency service on top.
            </div>

            <div className="plan-cta-row flex gap-3 mt-7 flex-wrap">
              <TrackedDemoLink
                source="pricing_alpha_plan"
                contentName="Book a demo — pricing alpha plan"
                className="plan-cta inline-flex items-center justify-center py-3.5 px-6 rounded-[999px] bg-dark-teal text-[#f2f2f0] text-[13px] font-bold tracking-[0.18em] uppercase no-underline"
              >
                Book a Demo
              </TrackedDemoLink>
              <a
                className="plan-cta inline-flex items-center justify-center py-3.5 px-6 rounded-[999px] bg-mint text-dark-teal text-[13px] font-bold tracking-[0.18em] uppercase no-underline"
                href="https://app.mentic.io/signup"
              >
                Sign up
              </a>
            </div>

            <div className="text-[11px] font-bold tracking-[0.3em] text-dark-teal/55 uppercase mt-9 mb-4 mx-0">
              What you get
            </div>
            <ul className="m-0 p-0 list-none flex flex-col gap-3.5 text-[clamp(14px,1vw,15px)] font-normal leading-[1.6] text-dark-teal">
              {ALPHA_BENEFITS.map((item) => (
                <li key={item.bold} className="flex items-start gap-3">
                  <span aria-hidden className="shrink-0 inline-flex items-center justify-center w-[22px] h-[22px] rounded-[999px] bg-[#e3fbf2] text-dark-teal mt-px">
                    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>
                    <strong className="font-bold">{item.bold}</strong>
                    {item.rest}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 py-4 px-[18px] rounded-2xl bg-[#f2f2f0] text-[13px] font-normal leading-[1.6] text-dark-teal/72">
              <strong className="font-bold text-dark-teal">Why so much agency support?</strong>{" "}
              We're in alpha and would rather have humans in the loop than let early users hit a rough
              edge alone. The free agency wrap-around is a thank-you for piloting with us — it ends
              when we exit alpha.
            </div>
          </article>
        </div>
      </section>

      {/* Responsive: stack under 1080px, tighten on small screens */}
      <style>{`
        @media (max-width: 1080px) {
          .pricing-cards {
            grid-template-columns: 1fr !important;
            max-width: 620px !important;
          }
          .pricing-section {
            align-items: flex-start !important;
          }
        }
        @media (max-width: 640px) {
          .pricing-card {
            padding: 24px !important;
            border-radius: 22px !important;
          }
          .plan-badge {
            letter-spacing: 0.12em !important;
            font-size: 10px !important;
            padding: 5px 11px !important;
          }
          .plan-title {
            font-size: 32px !important;
          }
          .plan-price {
            font-size: 48px !important;
          }
          .plan-cta {
            padding: 13px 20px !important;
            letter-spacing: 0.14em !important;
            font-size: 12px !important;
          }
          .plan-cta-row {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .plan-cta-row > a {
            width: 100%;
          }
        }
      `}</style>
    </main>
    </>
  );
}
