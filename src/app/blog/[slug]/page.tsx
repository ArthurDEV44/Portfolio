import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  formatPostDate,
  getAllPosts,
  getPostBySlug,
  getPublishedPosts,
} from "@/lib/blog";
import { siteConfig } from "@/lib/site.config";

/* Every post URL is known at build time, so an unknown slug is a 404 rather
   than an on-demand render. */
export const dynamicParams = false;

/* Drafts are routable while writing them and nowhere else: the production build
   only ever sees the published list. */
const includeDrafts = process.env.NODE_ENV === "development";

export async function generateStaticParams() {
  const posts = includeDrafts ? await getAllPosts() : await getPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { meta } = post;
  const url = `${siteConfig.url}/blog/${slug}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.tags,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      type: "article",
      url,
      title: meta.title,
      description: meta.description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      publishedTime: meta.publishedAt,
      modifiedTime: meta.updatedAt,
      authors: [siteConfig.url],
      tags: meta.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      creator: "@arthurjdev",
    },
    ...(meta.draft && { robots: { index: false, follow: false } }),
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const { default: Content } = await import(`@/content/blog/${slug}.mdx`);
  const { meta } = post;

  return (
    <article className="p-4">
      <header className="border-grid-soft border-b border-dashed pb-6">
        {meta.draft && (
          <p className="text-foreground mb-3 inline-block border border-[color:var(--line)] px-2 py-0.5 font-mono text-xs uppercase">
            Draft
          </p>
        )}

        <h1 className="text-foreground font-serif text-3xl leading-normal">
          {meta.title}
        </h1>

        <p className="text-muted-foreground mt-3 text-sm leading-relaxed font-light">
          {meta.description}
        </p>

        <p className="text-muted-foreground mt-4 flex flex-wrap items-center gap-2 text-xs font-light">
          <time dateTime={meta.publishedAt}>
            {formatPostDate(meta.publishedAt)}
          </time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTimeMinutes} min read</span>
        </p>
      </header>

      <div className="pt-6">
        <Content />
      </div>
    </article>
  );
}
