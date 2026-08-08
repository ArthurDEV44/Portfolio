# Blog content

One `.mdx` file per post. The file name is the slug, so `my-post.mdx` is served
at `/blog/my-post`. Nothing else has to be registered anywhere.

Every file must start with a typed metadata export:

```mdx
export const meta = {
  title: "Post title",
  description: "One sentence used by the index, the feed, and social cards.",
  publishedAt: "2026-08-08", // required, YYYY-MM-DD
  updatedAt: "2026-08-12", // optional
  tags: ["rust"], // optional
  draft: true, // optional, keeps the post out of every public surface
};
```

Missing or malformed metadata fails `bun build` and names the offending file.

Do not start the body with `#`: the `h1` comes from `meta.title`, so headings in
the body start at `##`.

Keep at least one `.mdx` file in this directory. The post route resolves content
through `await import(\`@/content/blog/${slug}.mdx\`)`, and Turbopack cannot
compile that dynamic import when the glob matches nothing. To take every post
offline, set `draft: true` rather than deleting the files.
