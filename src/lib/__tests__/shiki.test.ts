import { describe, expect, it } from "vitest";

import { extractCodeBlock, resolveLanguage } from "@/lib/shiki";

/* Mirrors what MDX hands to the `pre` override: an element whose single child
   is a `code` element carrying the fence language in its className. */
function codeElement(children: unknown, className?: string) {
  return { type: "code", props: { children, className } };
}

describe("resolveLanguage", () => {
  it("maps aliases onto the loaded grammar set", () => {
    expect(resolveLanguage("ts")).toBe("typescript");
    expect(resolveLanguage("JS")).toBe("javascript");
    expect(resolveLanguage(" rs ")).toBe("rust");
    expect(resolveLanguage("shell")).toBe("bash");
  });

  it("falls back to plain text for an absent or unloaded language", () => {
    expect(resolveLanguage(null)).toBe("text");
    expect(resolveLanguage(undefined)).toBe("text");
    expect(resolveLanguage("")).toBe("text");
    expect(resolveLanguage("brainfuck")).toBe("text");
  });
});

describe("extractCodeBlock", () => {
  it("reads the source and the language off the code child", () => {
    expect(
      extractCodeBlock(codeElement('console.log("hi")\n', "language-ts")),
    ).toEqual({ code: 'console.log("hi")', lang: "ts" });
  });

  it("keeps interior newlines and drops only the fence trailing newline", () => {
    expect(extractCodeBlock(codeElement("a\n\nb\n", "language-rust"))).toEqual({
      code: "a\n\nb",
      lang: "rust",
    });
  });

  it("reports no language when the fence declares none", () => {
    expect(extractCodeBlock(codeElement("plain\n"))).toEqual({
      code: "plain",
      lang: null,
    });
  });

  it("finds the language among other class names", () => {
    expect(
      extractCodeBlock(codeElement("x", "line-numbers language-css shiki")),
    ).toEqual({ code: "x", lang: "css" });
  });

  /* Risk 1 in the PRD: if `@next/mdx` ever changes the child shape, the block
     has to degrade to a raw render instead of taking the build down. */
  it.each([
    ["null", null],
    ["undefined", undefined],
    ["a bare string", "not an element"],
    ["an array of nodes", [codeElement("a"), codeElement("b")]],
    ["an element without props", { type: "code" }],
    ["a code element whose children are elements", codeElement([{}, {}])],
    ["a code element with no children", codeElement(undefined)],
  ])("returns null for %s", (_label, input) => {
    expect(extractCodeBlock(input)).toBeNull();
  });
});
