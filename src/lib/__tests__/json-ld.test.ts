import { describe, expect, it } from "vitest";

import type { Post, PostMeta } from "@/lib/blog";
import { getBlogPostingJsonLd, getJsonLd } from "@/lib/json-ld";
import { projects, siteConfig } from "@/lib/site.config";

describe("getJsonLd", () => {
  const jsonLd = getJsonLd();

  it("returns public profile schemas", () => {
    expect(jsonLd).toHaveProperty("graph");
    expect(jsonLd).toHaveProperty("person");
    expect(jsonLd).toHaveProperty("website");
    expect(jsonLd).toHaveProperty("profilePage");
    expect(jsonLd).toHaveProperty("projects");
  });

  describe("Schema graph", () => {
    it("wraps all public entities in a schema.org graph", () => {
      expect(jsonLd.graph["@context"]).toBe("https://schema.org");
      expect(jsonLd.graph["@graph"]).toHaveLength(projects.length + 3);
      expect(jsonLd.graph["@graph"]).toContain(jsonLd.person);
      expect(jsonLd.graph["@graph"]).toContain(jsonLd.website);
      expect(jsonLd.graph["@graph"]).toContain(jsonLd.profilePage);
    });
  });

  describe("Person schema", () => {
    it("has correct @id and @type", () => {
      expect(jsonLd.person["@id"]).toBe(`${siteConfig.url}/#person`);
      expect(jsonLd.person["@type"]).toBe("Person");
    });

    it("uses siteConfig.url for URLs", () => {
      expect(jsonLd.person.url).toBe(siteConfig.url);
      expect(jsonLd.person.image).toMatchObject({
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.profileImage}`,
        width: 512,
        height: 512,
        caption: siteConfig.profileImageAlt,
      });
    });

    it("uses siteConfig.role as jobTitle", () => {
      expect(jsonLd.person.jobTitle).toBe(siteConfig.role);
    });

    it("includes sameAs social links", () => {
      expect(jsonLd.person.sameAs).toContain(siteConfig.links.linkedin);
      expect(jsonLd.person.sameAs).toContain(siteConfig.links.github);
    });
  });

  describe("WebSite schema", () => {
    it("has correct @id and @type", () => {
      expect(jsonLd.website["@id"]).toBe(`${siteConfig.url}/#website`);
      expect(jsonLd.website["@type"]).toBe("WebSite");
    });

    it("uses siteConfig.url", () => {
      expect(jsonLd.website.url).toBe(siteConfig.url);
    });

    it("connects the site to the person entity", () => {
      expect(jsonLd.website.author).toEqual({
        "@id": `${siteConfig.url}/#person`,
      });
      expect(jsonLd.website.about).toEqual({
        "@id": `${siteConfig.url}/#person`,
      });
    });
  });

  describe("ProfilePage schema", () => {
    it("uses the canonical homepage and main person entity", () => {
      expect(jsonLd.profilePage["@type"]).toBe("ProfilePage");
      expect(jsonLd.profilePage.url).toBe(siteConfig.url);
      expect(jsonLd.profilePage.primaryImageOfPage).toMatchObject({
        "@type": "ImageObject",
        url: `${siteConfig.url}${siteConfig.profileImage}`,
      });
      expect(jsonLd.profilePage.mainEntity).toEqual({
        "@id": `${siteConfig.url}/#person`,
      });
    });

    it("mentions every visible project", () => {
      expect(jsonLd.profilePage.mentions).toHaveLength(projects.length);
    });
  });

  describe("Project schemas", () => {
    it("creates one project node per visible project", () => {
      expect(jsonLd.projects).toHaveLength(projects.length);
    });

    it("connects projects back to Arthur", () => {
      for (const project of jsonLd.projects) {
        expect(project.creator).toEqual({
          "@id": `${siteConfig.url}/#person`,
        });
      }
    });
  });
});

describe("getBlogPostingJsonLd", () => {
  const personId = `${siteConfig.url}/#person`;

  function post(slug: string, meta: Partial<PostMeta> = {}): Post {
    return {
      slug,
      meta: {
        title: "Shipping a blog without a content layer",
        description: "Why the MDX pipeline already in the repo was enough.",
        publishedAt: "2026-08-08",
        ...meta,
      },
      wordCount: 1800,
      readingTimeMinutes: 9,
      toc: [],
    };
  }

  it("describes the article as a BlogPosting at its own absolute URL", () => {
    const { blogPosting } = getBlogPostingJsonLd(post("no-content-layer"));
    const url = `${siteConfig.url}/blog/no-content-layer`;

    expect(blogPosting["@type"]).toBe("BlogPosting");
    expect(blogPosting["@id"]).toBe(`${url}#post`);
    expect(blogPosting.url).toBe(url);
    expect(blogPosting.mainEntityOfPage).toEqual({
      "@type": "WebPage",
      "@id": url,
    });
    expect(blogPosting.headline).toBe(
      "Shipping a blog without a content layer",
    );
    expect(blogPosting.description).toBe(
      "Why the MDX pipeline already in the repo was enough.",
    );
    expect(blogPosting.inLanguage).toBe(siteConfig.language);
  });

  it("attributes the article to the existing Person by reference alone", () => {
    const { blogPosting } = getBlogPostingJsonLd(post("attribution"));

    expect(blogPosting.author).toEqual({ "@id": personId });
    expect(blogPosting.publisher).toEqual({ "@id": personId });
    expect(Object.keys(blogPosting.author)).toEqual(["@id"]);
  });

  it("ships the Person node in the graph so the reference resolves on the page", () => {
    const { graph, blogPosting } = getBlogPostingJsonLd(post("graph"));

    expect(graph["@context"]).toBe("https://schema.org");
    expect(graph["@graph"]).toHaveLength(2);
    expect(graph["@graph"][0]).toBe(blogPosting);
    expect(graph["@graph"][1]).toEqual(getJsonLd().person);
  });

  it("emits dateModified only when the post declares an update", () => {
    const updated = getBlogPostingJsonLd(
      post("updated", { updatedAt: "2026-09-01" }),
    ).blogPosting;
    expect(updated.datePublished).toBe("2026-08-08");
    expect(updated).toHaveProperty("dateModified", "2026-09-01");

    const untouched = getBlogPostingJsonLd(post("untouched")).blogPosting;
    expect(untouched.datePublished).toBe("2026-08-08");
    expect(untouched).not.toHaveProperty("dateModified");
  });

  it("carries tags as keywords, and omits the field when there are none", () => {
    expect(
      getBlogPostingJsonLd(post("tagged", { tags: ["mdx", "next"] }))
        .blogPosting,
    ).toHaveProperty("keywords", ["mdx", "next"]);

    expect(
      getBlogPostingJsonLd(post("untagged")).blogPosting,
    ).not.toHaveProperty("keywords");
    expect(
      getBlogPostingJsonLd(post("empty-tags", { tags: [] })).blogPosting,
    ).not.toHaveProperty("keywords");
  });
});
