import { describe, expect, it } from "vitest";

import {
  buildToc,
  countWords,
  formatPostDate,
  hasMinimap,
  type Post,
  MINIMAP_MIN_SECTIONS,
  MINIMAP_MIN_WORD_COUNT,
  readingTime,
  slugify,
  sortPosts,
  type TocEntry,
  validatePostMeta,
} from "@/lib/blog";

const META_BLOCK = `export const meta = {
  title: "A post",
  description: "A description that should never count as prose.",
  publishedAt: "2026-08-08",
};
`;

function post(slug: string, publishedAt: string): Post {
  return {
    slug,
    meta: { title: slug, description: slug, publishedAt },
    wordCount: 0,
    readingTimeMinutes: 1,
    toc: [],
  };
}

describe("slugify", () => {
  it("lowercases and joins words with a single hyphen", () => {
    expect(slugify("Shiki in a Server Component")).toBe(
      "shiki-in-a-server-component",
    );
  });

  it("strips diacritics and punctuation", () => {
    expect(slugify("Métriques dérivées : le fichier brut !")).toBe(
      "metriques-derivees-le-fichier-brut",
    );
  });

  it("falls back to a usable anchor when nothing is left", () => {
    expect(slugify("???")).toBe("section");
  });
});

describe("buildToc", () => {
  it("returns an empty list for a post without any section heading", () => {
    expect(buildToc(`${META_BLOCK}\nJust a paragraph.\n`)).toEqual([]);
  });

  it("keeps depth 2 and depth 3 headings in document order", () => {
    const toc = buildToc("## First\n\ntext\n\n### Nested\n\n## Second\n");

    expect(toc).toEqual([
      { depth: 2, text: "First", id: "first" },
      { depth: 3, text: "Nested", id: "nested" },
      { depth: 2, text: "Second", id: "second" },
    ]);
  });

  it("ignores headings inside a fenced code block", () => {
    const raw = "## Real\n\n```bash\n## Not a heading\n```\n\n## Also real\n";

    expect(buildToc(raw).map((entry) => entry.text)).toEqual([
      "Real",
      "Also real",
    ]);
  });

  it("suffixes duplicate headings so anchors stay unique", () => {
    const toc = buildToc("## Setup\n\n## Setup\n\n## Setup\n");

    expect(toc.map((entry) => entry.id)).toEqual([
      "setup",
      "setup-1",
      "setup-2",
    ]);
  });

  it("strips inline code and link syntax from heading text", () => {
    const toc = buildToc(
      "## Using `codeToHtml` in [Next.js](https://nextjs.org)\n",
    );

    expect(toc[0]).toEqual({
      depth: 2,
      text: "Using codeToHtml in Next.js",
      id: "using-codetohtml-in-next-js",
    });
  });
});

describe("countWords", () => {
  it("excludes fenced code blocks", () => {
    const raw = "one two three\n\n```ts\nconst a = 1;\nconst b = 2;\n```\n";

    expect(countWords(raw)).toBe(3);
  });

  it("excludes the exported metadata block", () => {
    expect(countWords(`${META_BLOCK}\none two\n`)).toBe(2);
  });

  it("excludes YAML frontmatter lines", () => {
    expect(countWords("---\ntitle: ignored entirely\n---\none two\n")).toBe(2);
  });

  it("counts list and heading text without their markers", () => {
    expect(countWords("## Title here\n\n- first item\n- second item\n")).toBe(
      6,
    );
  });
});

describe("readingTime", () => {
  it("rounds up to the next whole minute", () => {
    expect(readingTime(201)).toBe(2);
    expect(readingTime(400)).toBe(2);
    expect(readingTime(401)).toBe(3);
  });

  it("never drops below one minute for a short post", () => {
    expect(readingTime(199)).toBe(1);
    expect(readingTime(0)).toBe(1);
  });
});

describe("validatePostMeta", () => {
  const valid = {
    title: "A post",
    description: "A description.",
    publishedAt: "2026-08-08",
  };

  it("accepts a minimal valid metadata object", () => {
    expect(validatePostMeta(valid, "a-post.mdx")).toEqual(valid);
  });

  it("names the file when the metadata export is missing", () => {
    expect(() => validatePostMeta(undefined, "a-post.mdx")).toThrow(
      /a-post\.mdx[\s\S]*export const meta/,
    );
  });

  it("names the file and the field when a required field is missing", () => {
    expect(() =>
      validatePostMeta({ ...valid, description: "" }, "a-post.mdx"),
    ).toThrow(/a-post\.mdx[\s\S]*"description"/);
  });

  it("rejects a publishedAt outside the YYYY-MM-DD format", () => {
    expect(() =>
      validatePostMeta({ ...valid, publishedAt: "08/08/2026" }, "a-post.mdx"),
    ).toThrow(/a-post\.mdx[\s\S]*"publishedAt"/);
  });

  it("rejects a calendar date that does not exist", () => {
    expect(() =>
      validatePostMeta({ ...valid, publishedAt: "2026-02-31" }, "a-post.mdx"),
    ).toThrow(/"publishedAt"/);
  });

  it("rejects malformed optional fields", () => {
    expect(() =>
      validatePostMeta({ ...valid, updatedAt: "2026-13-01" }, "a-post.mdx"),
    ).toThrow(/"updatedAt"/);
    expect(() =>
      validatePostMeta({ ...valid, tags: "meta" }, "a-post.mdx"),
    ).toThrow(/"tags"/);
    expect(() =>
      validatePostMeta({ ...valid, draft: "true" }, "a-post.mdx"),
    ).toThrow(/"draft"/);
  });
});

describe("sortPosts", () => {
  it("orders posts by publication date, newest first", () => {
    const sorted = sortPosts([
      post("older", "2026-01-05"),
      post("newest", "2026-08-08"),
      post("middle", "2026-04-02"),
    ]);

    expect(sorted.map((entry) => entry.slug)).toEqual([
      "newest",
      "middle",
      "older",
    ]);
  });

  it("breaks ties on the slug so the order stays stable", () => {
    const sorted = sortPosts([
      post("b", "2026-08-08"),
      post("a", "2026-08-08"),
    ]);

    expect(sorted.map((entry) => entry.slug)).toEqual(["a", "b"]);
  });
});

describe("formatPostDate", () => {
  it("renders the calendar date without a timezone shift", () => {
    expect(formatPostDate("2026-08-08")).toBe("August 8, 2026");
    expect(formatPostDate("2026-01-01")).toBe("January 1, 2026");
  });
});

describe("hasMinimap", () => {
  const sections = (count: number, depth: 2 | 3 = 2): TocEntry[] =>
    Array.from({ length: count }, (_, index) => ({
      depth,
      text: `Section ${index}`,
      id: `section-${index}`,
    }));

  it("keeps the minimap when both thresholds are met exactly", () => {
    expect(
      hasMinimap({
        wordCount: MINIMAP_MIN_WORD_COUNT,
        toc: sections(MINIMAP_MIN_SECTIONS),
      }),
    ).toBe(true);
  });

  it("drops the minimap one word below the word threshold", () => {
    expect(
      hasMinimap({
        wordCount: MINIMAP_MIN_WORD_COUNT - 1,
        toc: sections(MINIMAP_MIN_SECTIONS),
      }),
    ).toBe(false);
  });

  it("drops the minimap one section below the heading threshold", () => {
    expect(
      hasMinimap({
        wordCount: MINIMAP_MIN_WORD_COUNT * 4,
        toc: sections(MINIMAP_MIN_SECTIONS - 1),
      }),
    ).toBe(false);
  });

  /* Subsections structure a section, they do not create one, so they must not
     be able to push a shallow article over the threshold on their own. */
  it("counts only depth 2 entries towards the heading threshold", () => {
    expect(
      hasMinimap({
        wordCount: MINIMAP_MIN_WORD_COUNT * 4,
        toc: [...sections(2), ...sections(6, 3)],
      }),
    ).toBe(false);
  });

  it("drops the minimap for an article with no headings at all", () => {
    expect(hasMinimap({ wordCount: MINIMAP_MIN_WORD_COUNT * 4, toc: [] })).toBe(
      false,
    );
  });
});
