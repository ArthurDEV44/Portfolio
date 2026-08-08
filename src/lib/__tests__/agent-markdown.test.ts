import { describe, expect, it } from "vitest";

import { buildHomepageMarkdown } from "@/lib/agent-markdown";
import type { Post, PostMeta } from "@/lib/blog";
import { siteConfig } from "@/lib/site.config";

function post(slug: string, meta: Partial<PostMeta> = {}): Post {
  return {
    slug,
    meta: {
      title: "A post",
      description: "A description.",
      publishedAt: "2026-08-08",
      ...meta,
    },
    wordCount: 1800,
    readingTimeMinutes: 9,
    toc: [],
  };
}

describe("buildHomepageMarkdown", () => {
  it("omits the articles section entirely when nothing is published", () => {
    const markdown = buildHomepageMarkdown([]);

    expect(markdown).not.toContain("## Articles");
    expect(markdown).toContain("## Projects");
    expect(markdown).toContain("## Canonical resources");
  });

  it("lists every published article with its title, URL, date and description", () => {
    const markdown = buildHomepageMarkdown([
      post("no-content-layer", {
        title: "Shipping a blog without a content layer",
        description: "Why the MDX pipeline already in the repo was enough.",
        publishedAt: "2026-08-08",
      }),
    ]);

    expect(markdown).toContain("## Articles");
    expect(markdown).toContain(
      `- [Shipping a blog without a content layer](${siteConfig.url}/blog/no-content-layer) — 2026-08-08 : Why the MDX pipeline already in the repo was enough.`,
    );
  });

  it("keeps the existing sections in order and adds the feed to the canonical resources", () => {
    const markdown = buildHomepageMarkdown([post("a-post")]);

    expect(markdown.indexOf("## Projects")).toBeLessThan(
      markdown.indexOf("## Articles"),
    );
    expect(markdown.indexOf("## Articles")).toBeLessThan(
      markdown.indexOf("## Canonical resources"),
    );
    expect(markdown).toContain(`[RSS feed](${siteConfig.url}/rss.xml)`);
    expect(markdown).toContain(`[Sitemap](${siteConfig.url}/sitemap.xml)`);
    expect(markdown).not.toContain("<");
  });
});
