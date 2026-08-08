import type { Post } from "./blog";
import {
  aiSkills,
  devTools,
  mainStack,
  projects,
  siteConfig,
} from "./site.config";

/* Type-only import above: the proxy runs at the edge and must never pull
   `node:fs` in through this module, so posts are handed in by the caller that
   can actually read them. Omitted, the section is not rendered at all. */
function buildArticlesSection(posts: Post[]): string {
  if (posts.length === 0) return "";

  const list = posts
    .map(
      (post) =>
        `- [${post.meta.title}](${siteConfig.url}/blog/${post.slug}) — ${post.meta.publishedAt} : ${post.meta.description}`,
    )
    .join("\n");

  return `## Articles

${list}

`;
}

export function buildHomepageMarkdown(posts: Post[] = []): string {
  const stackList = mainStack
    .map((s) => `- **${s.name}** (${s.category})`)
    .join("\n");
  const toolsList = devTools
    .map((t) => `- **${t.name}** (${t.category})`)
    .join("\n");
  const aiList = aiSkills
    .map((s) => `- **${s.name}** : ${s.description}`)
    .join("\n");
  const projectList = projects
    .map((p) => {
      const label = p.url ? `[${p.title}](${p.url})` : p.title;
      return `- ${label} : ${p.description}`;
    })
    .join("\n");

  return `# ${siteConfig.name}

> ${siteConfig.description}

Creator and software engineer based in France. I build developer tools for the new way of coding, with a focus on Paneflow, Pyxis, and agent-native workflows.

## Projects

${projectList}

${buildArticlesSection(posts)}## Canonical resources

- [Homepage](${siteConfig.url}): Main profile page for Arthur Jean.
- [Sitemap](${siteConfig.url}/sitemap.xml): Canonical URL inventory.
- [RSS feed](${siteConfig.url}/rss.xml): Full article feed, RSS 2.0.
- [Robots policy](${siteConfig.url}/robots.txt): Search and AI crawler preferences.

## Tech stack

${stackList}

## Tools and platforms

${toolsList}

## AI skills

${aiList}

## Contact

- Site : ${siteConfig.url}
- Email : ${siteConfig.links.email}
- LinkedIn : ${siteConfig.links.linkedin}
- GitHub : ${siteConfig.links.github}
- X : ${siteConfig.links.x}
`;
}

export function estimateTokens(content: string): number {
  return Math.ceil(content.length / 4);
}
