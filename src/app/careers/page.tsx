import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Careers",
  description: "Join Mentic — open roles coming soon.",
  alternates: { canonical: "/careers" },
};

export default function CareersPage() {
  return (
    <ComingSoon
      section="Careers"
      blurb="We hire ridiculously high-agency builders. Open roles will land here. Until then, ping support@mentic.io if you can't wait."
    />
  );
}
