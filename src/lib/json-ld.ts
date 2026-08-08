import type { Post } from "@/lib/blog";
import { projects, siteConfig } from "@/lib/site.config";

function absoluteUrl(path: string) {
  return new URL(path, siteConfig.url).toString();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getJsonLd() {
  const personId = `${siteConfig.url}/#person`;
  const websiteId = `${siteConfig.url}/#website`;
  const profilePageId = `${siteConfig.url}/#profile`;
  const profileImageUrl = absoluteUrl(siteConfig.profileImage);

  const projectNodes = projects.map((project) => {
    const isSourceCode = project.url?.includes("github.com") ?? false;
    const projectId = `${siteConfig.url}/#project-${slugify(project.title)}`;

    return {
      "@type": isSourceCode ? "SoftwareSourceCode" : "CreativeWork",
      "@id": projectId,
      name: project.title,
      description: project.description,
      ...(project.url ? { url: project.url } : {}),
      ...(isSourceCode && project.url ? { codeRepository: project.url } : {}),
      keywords: project.tags,
      creator: {
        "@id": personId,
      },
      dateModified: siteConfig.lastModified,
      inLanguage: siteConfig.language,
    };
  });

  const person = {
    "@type": "Person",
    "@id": personId,
    name: siteConfig.name,
    url: siteConfig.url,
    image: {
      "@type": "ImageObject",
      url: profileImageUrl,
      width: 512,
      height: 512,
      caption: siteConfig.profileImageAlt,
    },
    jobTitle: siteConfig.role,
    description: siteConfig.description,
    email: siteConfig.links.email,
    homeLocation: {
      "@type": "Place",
      name: "France",
    },
    mainEntityOfPage: {
      "@id": profilePageId,
    },
    sameAs: [
      siteConfig.links.linkedin,
      siteConfig.links.github,
      siteConfig.links.x,
      siteConfig.links.mastodon,
    ],
    knowsAbout: [
      "Next.js",
      "Rust",
      "Tauri",
      "Artificial Intelligence",
      "AI agents",
      "RAG",
      "LLM Engineering",
      "Dev tools",
      "Open source",
    ],
  };

  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    author: {
      "@id": personId,
    },
    publisher: {
      "@id": personId,
    },
    about: {
      "@id": personId,
    },
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": profilePageId,
    url: siteConfig.url,
    name: siteConfig.title,
    description: siteConfig.description,
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: profileImageUrl,
      width: 512,
      height: 512,
      caption: siteConfig.profileImageAlt,
    },
    inLanguage: siteConfig.language,
    dateModified: siteConfig.lastModified,
    isPartOf: {
      "@id": websiteId,
    },
    mainEntity: {
      "@id": personId,
    },
    mentions: projectNodes.map((project) => ({
      "@id": project["@id"],
    })),
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [person, website, profilePage, ...projectNodes],
  };

  return {
    graph,
    person,
    website,
    profilePage,
    projects: projectNodes,
  };
}

/* The article graph carries the canonical `Person` node alongside the post so
   the `@id` in `author` and `publisher` resolves on the page itself, instead of
   pointing at an entity a validator would have to fetch from the homepage. The
   node is reused verbatim, never restated with a subset of its properties. */
export function getBlogPostingJsonLd(post: Post) {
  const personId = `${siteConfig.url}/#person`;
  const url = absoluteUrl(`/blog/${post.slug}`);

  const blogPosting = {
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    headline: post.meta.title,
    description: post.meta.description,
    inLanguage: siteConfig.language,
    datePublished: post.meta.publishedAt,
    ...(post.meta.updatedAt ? { dateModified: post.meta.updatedAt } : {}),
    ...(post.meta.tags?.length ? { keywords: post.meta.tags } : {}),
    author: {
      "@id": personId,
    },
    publisher: {
      "@id": personId,
    },
  };

  const { person } = getJsonLd();

  return {
    graph: {
      "@context": "https://schema.org",
      "@graph": [blogPosting, person],
    },
    blogPosting,
  };
}
