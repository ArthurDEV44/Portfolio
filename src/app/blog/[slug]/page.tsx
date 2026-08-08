import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleMinimap } from "@/components/blog/ArticleMinimap";
import { ArticleToc } from "@/components/blog/ArticleToc";
import {
  formatPostDate,
  getAllPosts,
  getPostBySlug,
  getPublishedPosts,
  hasMinimap,
} from "@/lib/blog";
import { siteConfig } from "@/lib/site.config";
import { postMdxComponents } from "@/mdx-components";

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

  /* One decision, two renderings: an article long enough to need its structure
     exposed gets the minimap where there is margin for it and the disclosure
     where there is not. CSS picks between them; neither exists otherwise. */
  const withToc = hasMinimap(post);

  return (
    <article className="article p-4">
      {/* Outside the layout grid on purpose: it sticks against the article as a
          whole, and a zero-height grid row would give it nothing to travel in. */}
      {withToc && <ArticleMinimap entries={post.toc} />}

      <div className="article-layout">
        <div className="article-main">
          <header className="border-grid-soft border-b border-dashed pb-6">
            {meta.draft && (
              <p className="text-foreground mb-3 inline-block border border-[color:var(--line)] px-2 py-0.5 font-mono text-xs uppercase">
                Draft
              </p>
            )}

            <h1 className="text-foreground font-serif text-[44px] leading-[52px]">
              {meta.title}
            </h1>

            <p className="text-muted-foreground mt-3 text-sm leading-relaxed font-light">
              {meta.description}
            </p>

            {/* Visible in the page, not only in the metadata: search and citation
                agents cross-check the rendered date against the markup. */}
            <p className="text-muted-foreground mt-4 flex flex-wrap items-center gap-2 text-xs font-light">
              <time dateTime={meta.publishedAt}>
                {formatPostDate(meta.publishedAt)}
              </time>

              {meta.updatedAt && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    Updated{" "}
                    <time dateTime={meta.updatedAt}>
                      {formatPostDate(meta.updatedAt)}
                    </time>
                  </span>
                </>
              )}

              <span aria-hidden="true">·</span>
              <span>{post.readingTimeMinutes} min read</span>
            </p>
          </header>

          {withToc && <ArticleToc entries={post.toc} />}

          <div className="article-body pt-[26px]">
            <Content components={postMdxComponents(post.toc)} />
          </div>
        </div>
      </div>
    </article>
  );
}
