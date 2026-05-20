import type { Metadata, Viewport } from "next";
import { Nunito_Sans } from "next/font/google";
import Script from "next/script";
import TabAttention from "@/components/TabAttention";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ff6b5c",
};

const SITE_URL = "https://www.mentic.io";
const SITE_TITLE = "Mentic — Autonomous AI Advertising Agent";
const SITE_DESCRIPTION =
  "Mentic builds your strategy, launches your campaigns, and optimises them autonomously — powered by a vast agentic infrastructure.";
const OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Mentic — Autonomous AI Advertising Agent",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | Mentic",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Mentic",
  category: "Technology",
  keywords: [
    "AI advertising",
    "autonomous marketing",
    "AI ad agent",
    "campaign optimisation",
    "agentic advertising",
    "Meta Ads automation",
    "advertising agent",
    "Mentic",
  ],
  authors: [{ name: "Mentic", url: SITE_URL }],
  creator: "Mentic",
  publisher: "Mentic",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Mentic",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@Mentic_io",
    site: "@Mentic_io",
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: "/mentic-app-icon.png",
    shortcut: "/favicon.png",
    apple: "/mentic-app-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Mentic",
      legalName: "Mentic Inc.",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo.png`,
        width: 512,
        height: 512,
      },
      image: `${SITE_URL}/opengraph-image`,
      description: SITE_DESCRIPTION,
      email: "support@mentic.io",
      address: {
        "@type": "PostalAddress",
        streetAddress: "251 Little Falls Drive",
        addressLocality: "Wilmington",
        addressRegion: "DE",
        postalCode: "19808",
        addressCountry: "US",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@mentic.io",
          availableLanguage: ["English"],
        },
      ],
      sameAs: [
        "https://www.linkedin.com/company/mentic-io",
        "https://www.instagram.com/mentic.io/",
        "https://x.com/Mentic_io",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Mentic",
      description: SITE_DESCRIPTION,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#product`,
      name: "Mentic",
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      image: `${SITE_URL}/opengraph-image`,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Advertising",
      operatingSystem: "Web",
      publisher: { "@id": `${SITE_URL}/#organization` },
      offers: [
        {
          "@type": "Offer",
          name: "Advertising Simplicity",
          price: "247",
          priceCurrency: "USD",
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
          url: `${SITE_URL}/pricing`,
          availability: "https://schema.org/InStock",
          category: "Self-serve",
        },
        {
          "@type": "Offer",
          name: "Alpha plan",
          price: "997",
          priceCurrency: "USD",
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
          url: `${SITE_URL}/pricing`,
          availability: "https://schema.org/LimitedAvailability",
          category: "Agency-wrapped",
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunitoSans.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1828929531115858&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </head>
      <body>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1828929531115858');
fbq('track', 'PageView');`}
        </Script>
        <TabAttention />
        {children}
      </body>
    </html>
  );
}
