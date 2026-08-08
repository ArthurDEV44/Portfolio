import { describe, expect, it } from "vitest";

import { getJsonLd } from "@/lib/json-ld";
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
