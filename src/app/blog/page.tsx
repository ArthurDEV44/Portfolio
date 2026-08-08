import type { Metadata } from "next";
import Link from "next/link";

import { formatPostDate, getPublishedPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site.config";

const title = "Blog";
const description = `Technical notes by ${siteConfig.name} on developer tools, coding agents, and the systems behind them.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <section aria-labelledby="blog-heading" className="pt-4">
      <h1
        id="blog-heading"
        className="border-grid-soft text-foreground border-y border-dashed p-4 font-serif text-3xl leading-normal"
      >
        {title}
      </h1>

      <p className="border-grid-soft text-muted-foreground border-b border-dashed p-4 text-sm leading-relaxed font-light">
        {description}
      </p>

      {posts.length === 0 ? (
        <p className="border-grid-soft text-muted-foreground mt-6 border-y border-dashed p-4 text-sm font-light">
          No posts published yet.
        </p>
      ) : (
        <ul>
          {posts.map((post, index) => (
            <li
              key={post.slug}
              className={`border-grid-soft group relative border-y border-dashed p-4 ${
                index === 0 ? "mt-6" : "mt-1"
              }`}
            >
              {/* Only the title is the link, so its accessible name is the post
                  title alone; the overlay keeps the whole row clickable. */}
              <h2 className="text-foreground font-sans text-base font-normal tracking-tight">
                <Link
                  href={`/blog/${post.slug}`}
                  className="underline-offset-4 group-hover:underline group-hover:decoration-[color:var(--line)] after:absolute after:inset-0"
                >
                  {post.meta.title}
                </Link>
              </h2>

              <p className="text-muted-foreground mt-2 line-clamp-2 font-sans text-sm leading-relaxed font-light tracking-tight">
                {post.meta.description}
              </p>

              <p className="text-muted-foreground mt-3 flex flex-wrap items-center gap-2 text-xs font-light">
                <time dateTime={post.meta.publishedAt}>
                  {formatPostDate(post.meta.publishedAt)}
                </time>
                <span aria-hidden="true">·</span>
                <span>{post.readingTimeMinutes} min read</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
