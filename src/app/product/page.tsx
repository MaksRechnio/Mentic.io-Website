import type { Metadata } from "next";
import ProductDeepDive from "./ProductDeepDive";

export const metadata: Metadata = {
  title: "Product",
  description:
    "Mentic is an autonomous advertising agent. Give it a URL, it builds your business profile, designs the strategy, launches Meta campaigns and keeps optimising — with humans in the loop where it counts.",
  alternates: { canonical: "/product" },
};

export default function ProductPage() {
  return <ProductDeepDive />;
}
