import type { Metadata } from "next";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = {
  title: "Team",
  description: "The people behind Mentic — coming soon.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <ComingSoon
      section="Team"
      blurb="The humans behind the autonomous agent. Faces, bios and obsessions go here once we're ready to show off."
    />
  );
}
