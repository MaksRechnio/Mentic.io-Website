import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://mentic.io",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://mentic.io/privacy",
      lastModified: new Date("2026-02-24"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
