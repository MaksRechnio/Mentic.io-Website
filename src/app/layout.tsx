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

const SITE_URL = "https://mentic.io";
const SITE_TITLE = "Mentic — Autonomous AI Advertising Agent";
const SITE_DESCRIPTION =
  "Mentic builds your strategy, launches your campaigns, and optimises them autonomously — powered by a vast agentic infrastructure.";

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
    "Mentic",
  ],
  authors: [{ name: "Mentic" }],
  creator: "Mentic",
  publisher: "Mentic",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Mentic",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    creator: "@Mentic_io",
    site: "@Mentic_io",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Mentic",
      url: SITE_URL,
      logo: `${SITE_URL}/images/logo.png`,
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
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      publisher: { "@id": `${SITE_URL}/#organization` },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/PreOrder",
      },
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
