import { getPublishedPosts } from "@/lib/blog";
import { buildRssFeed } from "@/lib/rss";

/* The feed reads the content directory, which only exists at build time. Next
   defaults an async route handler to on-demand rendering; the blog has no
   request-time surface, so the feed is pinned to the build. */
export const dynamic = "force-static";

export async function GET() {
  return new Response(buildRssFeed(await getPublishedPosts()), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
