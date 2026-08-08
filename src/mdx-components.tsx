import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { slugify, type TocEntry } from "@/lib/blog";
import { extractCodeBlock, highlightCode } from "@/lib/shiki";
import { siteConfig } from "@/lib/site.config";

/* Heading text can be a plain string, an array, or an element tree once inline
   code or a link is involved; the slug has to see the same words the reader
   does. */
function nodeText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean")
    return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");

  const element = node as { props?: { children?: ReactNode } };
  if (element.props && "children" in element.props) {
    return nodeText(element.props.children);
  }

  return "";
}

function isExternalHref(href: string): boolean {
  return /^[a-z][a-z\d+.-]*:/i.test(href) && !href.startsWith(siteConfig.url);
}

async function CodeFence({ children }: ComponentPropsWithoutRef<"pre">) {
  const block = extractCodeBlock(children);

  // Unexpected child shape: render what MDX gave us rather than throwing and
  // taking the whole build down with it.
  if (!block) {
    return (
      <div className="article-code">
        <pre>{children}</pre>
      </div>
    );
  }

  const html = await highlightCode(block.code, block.lang);

  return (
    // oxlint-disable-next-line react/no-danger -- Shiki output, generated at
    // build time from repository content, never from user input.
    <div className="article-code" dangerouslySetInnerHTML={{ __html: html }} />
  );
}

/* A lowercase `table` override would never run: without remark-gfm no Markdown
   construct produces a table node, and a table authored as HTML compiles to a
   literal tag that bypasses this map entirely. A capitalized name does resolve
   through it, which is the only way to hand the author a scroll container
   instead of asking them to hand-write ARIA roles on every table forever.

   The wrapper takes the overflow, so the table keeps `display: table` and with
   it the row and cell semantics. It also takes the focus: a region that scrolls
   and cannot be reached from the keyboard is mouse-only content. */
function Table({ children, ...rest }: ComponentPropsWithoutRef<"table">) {
  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrolling region has to be focusable or its content is mouse-only
    <section className="article-table" aria-label="Table" tabIndex={0}>
      <table {...rest}>{children}</table>
    </section>
  );
}

function Anchor({
  href = "",
  children,
  ...rest
}: ComponentPropsWithoutRef<"a">) {
  if (isExternalHref(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}

/* Ids are consumed from the table of contents in document order, so the anchors
   and the rail links can never drift apart, duplicate headings included. */
function headingIdReader(toc: TocEntry[] | undefined) {
  let cursor = 0;

  return (depth: 2 | 3, text: string): string => {
    if (toc) {
      const index = toc.findIndex(
        (entry, position) =>
          position >= cursor && entry.depth === depth && entry.text === text,
      );
      if (index !== -1) {
        cursor = index + 1;
        return toc[index].id;
      }
    }
    return slugify(text);
  };
}

function buildComponents(toc?: TocEntry[]): MDXComponents {
  const headingId = headingIdReader(toc);

  return {
    h2: ({ children, ...rest }: ComponentPropsWithoutRef<"h2">) => (
      <h2 id={headingId(2, nodeText(children))} {...rest}>
        {children}
      </h2>
    ),
    h3: ({ children, ...rest }: ComponentPropsWithoutRef<"h3">) => (
      <h3 id={headingId(3, nodeText(children))} {...rest}>
        {children}
      </h3>
    ),
    p: (props: ComponentPropsWithoutRef<"p">) => <p {...props} />,
    ul: (props: ComponentPropsWithoutRef<"ul">) => <ul {...props} />,
    ol: (props: ComponentPropsWithoutRef<"ol">) => <ol {...props} />,
    li: (props: ComponentPropsWithoutRef<"li">) => <li {...props} />,
    blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
      <blockquote {...props} />
    ),
    hr: (props: ComponentPropsWithoutRef<"hr">) => <hr {...props} />,
    strong: (props: ComponentPropsWithoutRef<"strong">) => (
      <strong {...props} />
    ),
    em: (props: ComponentPropsWithoutRef<"em">) => <em {...props} />,
    code: (props: ComponentPropsWithoutRef<"code">) => <code {...props} />,
    a: Anchor,
    pre: CodeFence,
    Table,
  };
}

/* Per-post set: the page passes it through the MDX `components` prop so the
   heading cursor is scoped to one render instead of shared across the build. */
export function postMdxComponents(toc: TocEntry[]): MDXComponents {
  return buildComponents(toc);
}

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    ...buildComponents(),
  };
}
