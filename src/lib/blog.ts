import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

export interface PostMeta {
  title: string;
  description: string;
  /** ISO calendar date, `YYYY-MM-DD`. */
  publishedAt: string;
  updatedAt?: string;
  tags?: string[];
  draft?: boolean;
}

export interface TocEntry {
  depth: 2 | 3;
  text: string;
  id: string;
}

export interface Post {
  slug: string;
  meta: PostMeta;
  wordCount: number;
  readingTimeMinutes: number;
  toc: TocEntry[];
}

const BLOG_DIR = path.join(process.cwd(), "src", "content", "blog");
const MDX_EXTENSION = ".mdx";
const WORDS_PER_MINUTE = 200;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/* Single anchor generator for the whole project: the table of contents and the
   MDX heading overrides must never derive two different ids from one heading. */
export function slugify(text: string): string {
  const slug = text
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "section";
}

/* Prose lines only: fenced code, YAML frontmatter and root-level ESM statements
   are dropped so `## ` inside a code block never becomes a heading and
   `export const meta` never inflates the word count. */
function proseLines(raw: string): string[] {
  const lines = raw.split(/\r?\n/);
  const prose: string[] = [];

  let index = 0;
  if (lines[0]?.trim() === "---") {
    index = 1;
    while (index < lines.length && lines[index].trim() !== "---") index += 1;
    index += 1;
  }

  let inFence = false;
  let esmBraceDepth = 0;
  let inEsm = false;

  for (; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (/^(`{3,}|~{3,})/.test(trimmed)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    if (!inEsm && /^(import|export)\s/.test(line)) {
      inEsm = true;
      esmBraceDepth = 0;
    }

    if (inEsm) {
      for (const char of line) {
        if (char === "{") esmBraceDepth += 1;
        else if (char === "}") esmBraceDepth -= 1;
      }
      if (esmBraceDepth <= 0) inEsm = false;
      continue;
    }

    prose.push(line);
  }

  return prose;
}

/* Markdown emphasis, inline code and link syntax would otherwise leak into both
   the visible heading text and its slug. */
function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__|\*|_)/g, "")
    .trim();
}

export function buildToc(raw: string): TocEntry[] {
  const seen = new Map<string, number>();
  const toc: TocEntry[] = [];

  for (const line of proseLines(raw)) {
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    const text = stripInlineMarkdown(match[2]);
    if (!text) continue;

    const base = slugify(text);
    const occurrences = seen.get(base) ?? 0;
    seen.set(base, occurrences + 1);

    toc.push({
      depth,
      text,
      id: occurrences ? `${base}-${occurrences}` : base,
    });
  }

  return toc;
}

export function countWords(raw: string): number {
  const text = proseLines(raw)
    .join("\n")
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "");

  return (
    stripInlineMarkdown(text).match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu)?.length ??
    0
  );
}

export function readingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE));
}

function isIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === value
  );
}

export function validatePostMeta(value: unknown, fileName: string): PostMeta {
  const fail = (reason: string): never => {
    throw new Error(`Invalid blog post metadata in ${fileName}: ${reason}`);
  };

  if (!value || typeof value !== "object") {
    return fail("missing `export const meta` object");
  }

  const meta = value as Record<string, unknown>;

  for (const field of ["title", "description", "publishedAt"] as const) {
    if (typeof meta[field] !== "string" || !(meta[field] as string).trim()) {
      fail(`field "${field}" is required and must be a non-empty string`);
    }
  }

  for (const field of ["publishedAt", "updatedAt"] as const) {
    const date = meta[field];
    if (date === undefined && field === "updatedAt") continue;
    if (typeof date !== "string" || !isIsoDate(date)) {
      fail(`field "${field}" must be an ISO calendar date (YYYY-MM-DD)`);
    }
  }

  if (meta.tags !== undefined) {
    if (
      !Array.isArray(meta.tags) ||
      meta.tags.some((tag) => typeof tag !== "string")
    ) {
      fail('field "tags" must be an array of strings');
    }
  }

  if (meta.draft !== undefined && typeof meta.draft !== "boolean") {
    fail('field "draft" must be a boolean');
  }

  return meta as unknown as PostMeta;
}

/* Newest first; the slug breaks ties so two posts sharing a date keep a stable
   order across the index, the sitemap and the feed. */
export function sortPosts(posts: Post[]): Post[] {
  return [...posts].sort((a, b) => {
    if (a.meta.publishedAt !== b.meta.publishedAt) {
      return a.meta.publishedAt < b.meta.publishedAt ? 1 : -1;
    }
    return a.slug.localeCompare(b.slug);
  });
}

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export function formatPostDate(isoDate: string): string {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}

/* The slug is the file name, nothing else: dropping a file in the directory is
   the entire publishing act. */
export function getPostSlugs(): string[] {
  let entries: string[];
  try {
    entries = readdirSync(BLOG_DIR);
  } catch {
    // No content directory yet: an empty registry, not a build failure.
    return [];
  }

  return entries
    .filter((entry) => entry.endsWith(MDX_EXTENSION))
    .map((entry) => entry.slice(0, -MDX_EXTENSION.length))
    .sort();
}

async function loadPost(slug: string): Promise<Post> {
  const fileName = `${slug}${MDX_EXTENSION}`;
  const loaded = (await import(`@/content/blog/${slug}.mdx`)) as {
    meta?: unknown;
  };
  const meta = validatePostMeta(loaded.meta, fileName);
  const raw = readFileSync(path.join(BLOG_DIR, fileName), "utf8");
  const wordCount = countWords(raw);

  return {
    slug,
    meta,
    wordCount,
    readingTimeMinutes: readingTime(wordCount),
    toc: buildToc(raw),
  };
}

export async function getAllPosts(): Promise<Post[]> {
  return sortPosts(await Promise.all(getPostSlugs().map(loadPost)));
}

export async function getPublishedPosts(): Promise<Post[]> {
  return (await getAllPosts()).filter((post) => !post.meta.draft);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (!getPostSlugs().includes(slug)) return null;
  return loadPost(slug);
}
