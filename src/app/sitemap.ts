import type { MetadataRoute } from "next";

import { getPublishedPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublishedPosts();

  return [
    {
      url: siteConfig.url,
      lastModified: siteConfig.lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/blog`,
      lastModified: posts[0]?.meta.publishedAt ?? siteConfig.lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${siteConfig.url}/blog/${post.slug}`,
      lastModified: post.meta.updatedAt ?? post.meta.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
