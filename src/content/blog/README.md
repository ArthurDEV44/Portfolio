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

## What Markdown gives you

Paragraphs, `##` and `###` headings, both kinds of list, quotations, rules,
links, emphasis, inline code and fenced code blocks all render through the
design system with no markup of your own. Fenced blocks are highlighted at build
time by Shiki in TypeScript, TSX, JavaScript, JSON, Rust, Bash, CSS and
Markdown; anything else renders as plain text rather than failing the build. Add
a language to `LANGUAGES` in `src/lib/shiki.ts` when you need one.

## Tables

GFM pipe tables are not available: they would need a remark plugin, a second
production dependency and a change to `next.config.ts`, all of which the PRD
rules out. Write tables as HTML instead, wrapped in `<Table>`. It needs no
import, it supplies the scroll container for a table wider than the text column,
and that container is reachable from the keyboard. Inside it you write an
ordinary table: nothing beyond `scope` is yours to add.

```html
<Table>
  <thead>
    <tr>
      <th scope="col">Header</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Row label</th>
      <td>Value</td>
    </tr>
  </tbody>
</Table>
```

The capital matters. A lowercase `<table>` written by hand compiles to a literal
element and never reaches the overrides, so it would get no scroll container and
no styling of its own.

## The minimap

An article gets the minimap, a stack of dashes in the left margin, once it
passes both thresholds in `src/lib/blog.ts`: at least 1500 words and at least
four `##` headings. Below either one it is dropped and the text column stays
centred, so a short note never ships three lonely marks.

One dash per block, at three lengths: full for a `##`, shorter for a `###`, and
short for a body block. The stack is the rhythm of the document, not a list, so
you can see how far the reading goes and where the sections fall.

The dashes expand towards the pointer and the nearest heading names itself in
the margin; clicking a heading dash jumps to it, and the current section keeps a
thicker mark while you read. Heading dashes are plain anchors carrying their
text and are rendered on the server, so the structure stays navigable by
keyboard and by screen reader with scripting off. Body dashes are decoration:
they are hidden from assistive technology and are not focusable, since a link
with no name is worse than no link. The step between dashes is derived from the
block count, so a long article still fits the window.

It is fixed to the middle of the window and needs a 714px container to appear,
which means roughly 1024px of viewport or more, with a gap between about 1250px
and 1410px where the shell's own two rails leave the article too narrow for it.
Wherever the minimap does not fit, the same headings are served above the text
as a `Contents` disclosure instead: it is a plain `details` element, so it opens
without scripting and costs nothing on the client. Exactly one of the two is
ever displayed, which is what keeps a single table of contents in the
accessibility tree. Both are dropped together below the thresholds.

## Housekeeping

Keep at least one `.mdx` file in this directory. The post route resolves content
through `await import(\`@/content/blog/${slug}.mdx\`)`, and Turbopack cannot
compile that dynamic import when the glob matches nothing. To take every post
offline, set `draft: true` rather than deleting the files.
