import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "News",
  description: "Mentic news and updates — coming soon.",
  alternates: { canonical: "/news" },
};

export default function NewsPage() {
  return (
    <ComingSoon
      section="News"
      blurb="Launch notes, milestones and the occasional manifesto will live here once we're out of stealth."
    />
  );
}
