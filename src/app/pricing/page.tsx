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

      {/* Pricing cards */}
      <section className="pricing-section" style={{
        flex: 1,
        position: "relative", zIndex: 2,
        display: "flex", justifyContent: "center", alignItems: "center",
        padding: "clamp(96px, 12vh, 140px) clamp(16px, 4vw, 56px) clamp(40px, 6vh, 72px)",
      }}>
        <div className="pricing-cards" style={{
          width: "100%", maxWidth: 1240,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          gap: "clamp(20px, 2.4vw, 32px)",
          alignItems: "stretch",
        }}>
          {/* ── Simplicity tier ── */}
          <article className="intro-scale-in pricing-card" style={{
            position: "relative",
            background: "#ffffff",
            borderRadius: 28,
            padding: "clamp(28px, 3.6vw, 52px)",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,60,70,0.06), 0 24px 56px -16px rgba(0,60,70,0.12), 0 0 0 1px rgba(0,60,70,0.04)",
            animationDelay: "0.1s",
            display: "flex", flexDirection: "column",
          }}>
            <div className="plan-badge" style={{
              display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start",
              padding: "6px 14px", borderRadius: 999,
              background: "#e3fbf2", color: "#007a64",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
              textTransform: "uppercase",
              maxWidth: "100%",
            }}>
              <span aria-hidden style={{ flexShrink: 0, width: 6, height: 6, borderRadius: 999, background: "#007a64" }} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Self-serve</span>
            </div>

            <h2 className="plan-title" style={{
              margin: "22px 0 10px",
              fontSize: "clamp(30px, 3.4vw, 48px)",
              fontWeight: 800, letterSpacing: "-0.015em",
              lineHeight: 1.02, color: "#003c46",
            }}>
              Advertising Simplicity
            </h2>
            <p style={{
              margin: 0,
              fontSize: "clamp(14px, 1.05vw, 16px)",
              fontWeight: 300, color: "rgba(0,60,70,0.7)",
              lineHeight: 1.6, maxWidth: 440,
            }}>
              Full Mentic.io access, no human media buyers in the loop. The autonomous agent on its own —
              you drive, it executes.
            </p>

            <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "28px 0 6px", flexWrap: "wrap" }}>
              <span className="plan-price" style={{
                fontSize: "clamp(44px, 5.4vw, 72px)",
                fontWeight: 800, color: "#003c46",
                lineHeight: 0.95, letterSpacing: "-0.025em",
              }}>
                $247
              </span>
              <span style={{
                fontSize: 16, fontWeight: 400, color: "rgba(0,60,70,0.65)",
                letterSpacing: "0.02em",
              }}>
                / month
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "rgba(0,60,70,0.6)", letterSpacing: "0.02em" }}>
              No agency services. Just the agent.
            </div>

            <div className="plan-cta-row" style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
              <a
                className="plan-cta"
                href="/#signup"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "14px 24px", borderRadius: 999,
                  background: "#003c46", color: "#f2f2f0",
                  fontSize: 13, fontWeight: 700,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Sign up
              </a>
            </div>

            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.3em",
              color: "rgba(0,60,70,0.55)", textTransform: "uppercase",
              margin: "36px 0 16px",
            }}>
              What you get
            </div>
            <ul style={{
              margin: 0, padding: 0, listStyle: "none",
              display: "flex", flexDirection: "column", gap: 14,
              fontSize: "clamp(14px, 1vw, 15px)",
              fontWeight: 400, lineHeight: 1.6,
              color: "#003c46",
            }}>
              {SIMPLICITY_BENEFITS.map((item) => (
                <li key={item.bold} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span aria-hidden style={{
                    flexShrink: 0,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 22, height: 22, borderRadius: 999,
                    background: "#e3fbf2", color: "#003c46",
                    marginTop: 1,
                  }}>
                    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>
                    <strong style={{ fontWeight: 700 }}>{item.bold}</strong>
                    {item.rest}
                  </span>
                </li>
              ))}
            </ul>
          </article>

          {/* ── Alpha plan (featured) ── */}
          <article className="intro-scale-in pricing-card" style={{
            position: "relative",
            background: "#ffffff",
            borderRadius: 28,
            padding: "clamp(28px, 3.6vw, 52px)",
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 12px 32px rgba(0,60,70,0.08), 0 40px 80px -20px rgba(0,60,70,0.18), 0 0 0 2px #ff6b5c",
            animationDelay: "0.15s",
            display: "flex", flexDirection: "column",
          }}>
            <div className="plan-badge" style={{
              display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start",
              padding: "6px 14px", borderRadius: 999,
              background: "#fff3f2", color: "#ff6b5c",
              fontSize: 11, fontWeight: 700, letterSpacing: "0.16em",
              textTransform: "uppercase",
              maxWidth: "100%",
            }}>
              <span aria-hidden style={{ flexShrink: 0, width: 6, height: 6, borderRadius: 999, background: "#ff6b5c" }} />
              <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Limited — pilot users only</span>
            </div>

            <h1 className="plan-title" style={{
              margin: "22px 0 10px",
              fontSize: "clamp(30px, 3.4vw, 48px)",
              fontWeight: 800, letterSpacing: "-0.015em",
              lineHeight: 1.02, color: "#003c46",
            }}>
              Alpha plan
            </h1>
            <p style={{
              margin: 0,
              fontSize: "clamp(14px, 1.05vw, 16px)",
              fontWeight: 300, color: "rgba(0,60,70,0.7)",
              lineHeight: 1.6, maxWidth: 440,
            }}>
              The autonomous agent, supervised end-to-end by a real ad agency. One plan, one price,
              no fine print.
            </p>

            <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "28px 0 6px", flexWrap: "wrap" }}>
              <span className="plan-price" style={{
                fontSize: "clamp(44px, 5.4vw, 72px)",
                fontWeight: 800, color: "#003c46",
                lineHeight: 0.95, letterSpacing: "-0.025em",
              }}>
                $997
              </span>
              <span style={{
                fontSize: 16, fontWeight: 400, color: "rgba(0,60,70,0.65)",
                letterSpacing: "0.02em",
              }}>
                / month
              </span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#ff6b5c", letterSpacing: "0.02em" }}>
              $0 for every agency service on top.
            </div>

            <div className="plan-cta-row" style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
              <TrackedDemoLink
                source="pricing_alpha_plan"
                contentName="Book a demo — pricing alpha plan"
                className="plan-cta"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "14px 24px", borderRadius: 999,
                  background: "#003c46", color: "#f2f2f0",
                  fontSize: 13, fontWeight: 700,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Book a Demo
              </TrackedDemoLink>
              <a
                className="plan-cta"
                href="/#signup"
                style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  padding: "14px 24px", borderRadius: 999,
                  background: "#8bf2d3", color: "#003c46",
                  fontSize: 13, fontWeight: 700,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  textDecoration: "none",
                }}
              >
                Sign up
              </a>
            </div>

            <div style={{
              fontSize: 11, fontWeight: 700, letterSpacing: "0.3em",
              color: "rgba(0,60,70,0.55)", textTransform: "uppercase",
              margin: "36px 0 16px",
            }}>
              What you get
            </div>
            <ul style={{
              margin: 0, padding: 0, listStyle: "none",
              display: "flex", flexDirection: "column", gap: 14,
              fontSize: "clamp(14px, 1vw, 15px)",
              fontWeight: 400, lineHeight: 1.6,
              color: "#003c46",
            }}>
              {ALPHA_BENEFITS.map((item) => (
                <li key={item.bold} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <span aria-hidden style={{
                    flexShrink: 0,
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 22, height: 22, borderRadius: 999,
                    background: "#e3fbf2", color: "#003c46",
                    marginTop: 1,
                  }}>
                    <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span>
                    <strong style={{ fontWeight: 700 }}>{item.bold}</strong>
                    {item.rest}
                  </span>
                </li>
              ))}
            </ul>

            <div style={{
              marginTop: 24, padding: "16px 18px",
              borderRadius: 16, background: "#f2f2f0",
              fontSize: 13, fontWeight: 400, lineHeight: 1.6,
              color: "rgba(0,60,70,0.72)",
            }}>
              <strong style={{ fontWeight: 700, color: "#003c46" }}>Why so much agency support?</strong>{" "}
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
