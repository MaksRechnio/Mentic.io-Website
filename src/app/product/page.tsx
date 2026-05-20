import type { Metadata } from "next";
import ProductDeepDive from "./ProductDeepDive";

const SITE_URL = "https://www.mentic.io";
const TITLE = "Product";
const DESCRIPTION =
  "Mentic is an autonomous advertising agent. Give it a URL, it builds your business profile, designs the strategy, launches Meta campaigns and keeps optimising — with humans in the loop where it counts.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/product" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/product`,
    title: `${TITLE} | Mentic`,
    description: DESCRIPTION,
  },
  twitter: {
    title: `${TITLE} | Mentic`,
    description: DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Product", item: `${SITE_URL}/product` },
      ],
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/product#webpage`,
      url: `${SITE_URL}/product`,
      name: `${TITLE} | Mentic`,
      description: DESCRIPTION,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#product` },
      primaryImageOfPage: `${SITE_URL}/opengraph-image`,
    },
  ],
};

export default function ProductPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDeepDive />
    </>
  );
}
