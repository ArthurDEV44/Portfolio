import type { TocEntry } from "@/lib/blog";

/* The minimap needs a margin the narrow regimes do not have, so below its
   threshold the same structure is served as a disclosure above the text.
   `details` carries the open and close behavior itself: no client component, no
   hydration, and it still opens with scripting off. Exactly one of the two is
   ever displayed, so there is never a second table of contents landmark. */
export function ArticleToc({ entries }: { entries: TocEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <details className="article-toc">
      <summary>Contents</summary>

      <nav aria-label="Table of contents">
        <ol>
          {entries.map((entry) => (
            <li key={entry.id} data-depth={entry.depth}>
              <a href={`#${entry.id}`}>{entry.text}</a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
