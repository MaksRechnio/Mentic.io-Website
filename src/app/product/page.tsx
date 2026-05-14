import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Product",
  description: "What Mentic actually does — coming soon.",
  alternates: { canonical: "/product" },
};

export default function ProductPage() {
  return (
    <ComingSoon
      section="Product"
      blurb="A deeper walk-through of the autonomous advertising agent — strategy, launches, optimisation — is on the way. Sit tight."
    />
  );
}
