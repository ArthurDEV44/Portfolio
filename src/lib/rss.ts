import type { Post } from "@/lib/blog";
import { siteConfig } from "@/lib/site.config";

export const FEED_PATH = "/rss.xml";

const FEED_TITLE = `${siteConfig.name} — Blog`;
const FEED_DESCRIPTION = `Technical notes by ${siteConfig.name} on developer tools, coding agents, and the systems behind them.`;

/* The five reserved characters, escaped everywhere rather than only where the
   parser strictly requires it: an author writing `&` in a title must never be
   the reason a reader's feed breaks. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* RFC 822 as RSS 2.0 requires it. `toUTCString` emits the four-digit-year form
   the spec permits, which every reader and the W3C validator accept. */
export function toRfc822(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toUTCString();
}

function absoluteUrl(pathname: string): string {
  return new URL(pathname, siteConfig.url).toString();
}

function renderItem(post: Post): string {
  const url = absoluteUrl(`/blog/${post.slug}`);

  return [
    "    <item>",
    `      <title>${escapeXml(post.meta.title)}</title>`,
    `      <link>${escapeXml(url)}</link>`,
    `      <guid isPermaLink="true">${escapeXml(url)}</guid>`,
    `      <pubDate>${toRfc822(post.meta.publishedAt)}</pubDate>`,
    `      <description>${escapeXml(post.meta.description)}</description>`,
    "    </item>",
  ].join("\n");
}

/* Posts are expected sorted newest first, as `getPublishedPosts` returns them.
   The build date follows the newest post instead of the clock: the feed is a
   build artifact, and a timestamp would make every rebuild a spurious change. */
export function buildRssFeed(posts: Post[]): string {
  const lastBuildDate = toRfc822(
    posts[0]?.meta.updatedAt ??
      posts[0]?.meta.publishedAt ??
      siteConfig.lastModified,
  );

  const items = posts.map(renderItem);

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${escapeXml(absoluteUrl("/blog"))}</link>
    <description>${escapeXml(FEED_DESCRIPTION)}</description>
    <language>${siteConfig.language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(absoluteUrl(FEED_PATH))}" rel="self" type="application/rss+xml" />
${items.length ? `${items.join("\n")}\n` : ""}  </channel>
</rss>
`;
}
