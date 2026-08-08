import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: siteConfig.lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
