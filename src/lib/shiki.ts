import { createHighlighter, type Highlighter } from "shiki";

/* Bounded on purpose: every language here is loaded into the singleton at first
   use, so the list is what keeps the build cost flat as posts accumulate. */
const LANGUAGES = [
  "typescript",
  "tsx",
  "javascript",
  "json",
  "rust",
  "bash",
  "css",
  "markdown",
] as const;

/* Chosen by measurement, not taste: of the light themes shipped with Shiki,
   only this one keeps every token it emits at or above 4.5:1 against
   `--surface`. `github-light` bottoms out at 3.20:1 on the same background. */
export const SHIKI_LIGHT_THEME = "github-light-high-contrast";
export const SHIKI_DARK_THEME = "github-dark-high-contrast";

/* Fence infostrings people actually type, mapped onto the loaded set. Anything
   outside it renders as plain text rather than failing the build. */
const ALIASES: Record<string, (typeof LANGUAGES)[number]> = {
  ts: "typescript",
  typescript: "typescript",
  tsx: "tsx",
  jsx: "tsx",
  js: "javascript",
  javascript: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  json: "json",
  jsonc: "json",
  rs: "rust",
  rust: "rust",
  sh: "bash",
  zsh: "bash",
  shell: "bash",
  bash: "bash",
  console: "bash",
  css: "css",
  md: "markdown",
  mdx: "markdown",
  markdown: "markdown",
};

const PLAIN_TEXT = "text";

export function resolveLanguage(lang: string | null | undefined): string {
  if (!lang) return PLAIN_TEXT;
  return ALIASES[lang.trim().toLowerCase()] ?? PLAIN_TEXT;
}

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  highlighterPromise ??= createHighlighter({
    themes: [SHIKI_LIGHT_THEME, SHIKI_DARK_THEME],
    langs: [...LANGUAGES],
  });
  return highlighterPromise;
}

/* `defaultColor: false` emits `--shiki-light` and `--shiki-dark` on every token
   instead of a baked color, which is what lets one build serve both themes with
   zero client JavaScript. */
export async function highlightCode(
  code: string,
  lang: string | null | undefined,
): Promise<string> {
  const highlighter = await getHighlighter();

  return highlighter.codeToHtml(code, {
    lang: resolveLanguage(lang),
    themes: { light: SHIKI_LIGHT_THEME, dark: SHIKI_DARK_THEME },
    defaultColor: false,
  });
}

export interface CodeBlock {
  code: string;
  lang: string | null;
}

interface CodeElementLike {
  props?: {
    children?: unknown;
    className?: unknown;
  };
}

function isCodeElementLike(value: unknown): value is CodeElementLike {
  return typeof value === "object" && value !== null && "props" in value;
}

/* `pre` receives a React element it does not own, so its shape is an assumption
   about `@next/mdx`, not a contract. Every unexpected shape returns null and the
   caller falls back to rendering the children as they came. */
export function extractCodeBlock(children: unknown): CodeBlock | null {
  if (!isCodeElementLike(children)) return null;

  const props = children.props;
  if (!props || typeof props !== "object") return null;

  const code = props.children;
  if (typeof code !== "string") return null;

  const className = typeof props.className === "string" ? props.className : "";
  const match = /(?:^|\s)language-([\w-]+)(?:\s|$)/.exec(className);

  return {
    // MDX keeps the trailing newline of the fence; Shiki would render it as an
    // empty last line.
    code: code.replace(/\n$/, ""),
    lang: match ? match[1] : null,
  };
}
