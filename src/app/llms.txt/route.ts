import { buildHomepageMarkdown } from "@/lib/agent-markdown";
import { getPublishedPosts } from "@/lib/blog";

/* Same reason as the feed: the post list is a build artifact, and this route
   was static before it started listing articles. It stays static. */
export const dynamic = "force-static";

export async function GET() {
  return new Response(buildHomepageMarkdown(await getPublishedPosts()), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
