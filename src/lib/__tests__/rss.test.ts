import { describe, expect, it } from "vitest";

import type { Post, PostMeta } from "@/lib/blog";
import { buildRssFeed, escapeXml, toRfc822 } from "@/lib/rss";
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

describe("escapeXml", () => {
  it("escapes the five reserved characters", () => {
    expect(escapeXml(`Tabs & spaces <hr> "quoted" and 'single'`)).toBe(
      "Tabs &amp; spaces &lt;hr&gt; &quot;quoted&quot; and &apos;single&apos;",
    );
  });

  it("escapes the ampersand first, so no entity is emitted half-encoded", () => {
    expect(escapeXml("a & b")).toBe("a &amp; b");
    expect(escapeXml("a &amp; b")).toBe("a &amp;amp; b");
  });
});

describe("toRfc822", () => {
  it("renders a calendar date as an RFC 822 timestamp", () => {
    expect(toRfc822("2026-08-08")).toBe("Sat, 08 Aug 2026 00:00:00 GMT");
  });
});

describe("buildRssFeed", () => {
  it("emits a valid channel with no item when nothing is published", () => {
    const feed = buildRssFeed([]);

    expect(feed.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(
      true,
    );
    expect(feed).toContain('<rss version="2.0"');
    expect(feed).toContain("</channel>");
    expect(feed).not.toContain("<item>");
    expect(feed).toContain(toRfc822(siteConfig.lastModified));
  });

  it("gives every item a title, an absolute link, a stable guid, an RFC 822 date and a description", () => {
    const feed = buildRssFeed([
      post("first", { title: "First", description: "The first one." }),
    ]);

    expect(feed).toContain("<title>First</title>");
    expect(feed).toContain(`<link>${siteConfig.url}/blog/first</link>`);
    expect(feed).toContain(
      `<guid isPermaLink="true">${siteConfig.url}/blog/first</guid>`,
    );
    expect(feed).toContain("<pubDate>Sat, 08 Aug 2026 00:00:00 GMT</pubDate>");
    expect(feed).toContain("<description>The first one.</description>");
  });

  it("escapes reserved characters coming from post metadata", () => {
    const feed = buildRssFeed([
      post("escaping", {
        title: `Rust & C++ <interop>`,
        description: `It's "unsafe" by design.`,
      }),
    ]);

    expect(feed).toContain("<title>Rust &amp; C++ &lt;interop&gt;</title>");
    expect(feed).toContain(
      "<description>It&apos;s &quot;unsafe&quot; by design.</description>",
    );
  });

  it("dates the build from the newest post rather than the clock", () => {
    const feed = buildRssFeed([
      post("newest", { updatedAt: "2026-08-10" }),
      post("older", { publishedAt: "2026-01-01" }),
    ]);

    expect(feed).toContain(
      "<lastBuildDate>Mon, 10 Aug 2026 00:00:00 GMT</lastBuildDate>",
    );
  });

  it("keeps drafts out by construction: it renders exactly what it is given", () => {
    const feed = buildRssFeed([post("published")]);

    expect(feed.match(/<item>/g)).toHaveLength(1);
    expect(feed).toContain(`${siteConfig.url}/blog/published`);
  });
});
