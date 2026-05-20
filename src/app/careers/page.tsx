import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

const SITE_URL = "https://www.mentic.io";
const CAREERS_TITLE = "Careers";
const CAREERS_DESCRIPTION = "Join Mentic — open roles coming soon.";

export const metadata: Metadata = {
  title: CAREERS_TITLE,
  description: CAREERS_DESCRIPTION,
  alternates: { canonical: "/careers" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/careers`,
    title: `${CAREERS_TITLE} | Mentic`,
    description: CAREERS_DESCRIPTION,
  },
  twitter: {
    title: `${CAREERS_TITLE} | Mentic`,
    description: CAREERS_DESCRIPTION,
  },
};

const careersJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
    { "@type": "ListItem", position: 2, name: "Careers", item: `${SITE_URL}/careers` },
  ],
};

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(careersJsonLd) }}
      />
      <ComingSoon
        section="Careers"
        blurb="We hire ridiculously high-agency builders. Open roles will land here. Until then, ping support@mentic.io if you can't wait."
      />
    </>
  );
}
