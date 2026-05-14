import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Mentic pricing — coming soon.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return (
    <ComingSoon
      section="Pricing"
      blurb="Transparent, founder-friendly pricing is on its way. No retainers, no media-buyer fees — pay for ads, not middle layers."
    />
  );
}
