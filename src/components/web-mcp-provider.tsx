"use client";

import { useEffect } from "react";

import { aiSkills, mainStack, projects, siteConfig } from "@/lib/site.config";

type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  execute: (
    input: unknown,
  ) => Promise<{ content: Array<{ type: "text"; text: string }> }>;
};

type WebMcpNavigator = Navigator & {
  modelContext?: {
    provideContext: (config: { tools: WebMcpTool[] }) => Promise<void>;
  };
};

function textResult(payload: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text:
          typeof payload === "string"
            ? payload
            : JSON.stringify(payload, null, 2),
      },
    ],
  };
}

export function WebMcpProvider() {
  useEffect(() => {
    const nav = navigator as WebMcpNavigator;
    if (!nav.modelContext?.provideContext) return;

    const tools: WebMcpTool[] = [
      {
        name: "get_profile",
        description:
          "Returns Arthur Jean's profile summary: name, title, description, and URL.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        execute: async () =>
          textResult({
            name: siteConfig.name,
            title: siteConfig.title,
            description: siteConfig.description,
            url: siteConfig.url,
            stack: mainStack.map((s) => s.name),
            ai_skills: aiSkills.map((s) => s.name),
          }),
      },
      {
        name: "list_projects",
        description:
          "Lists Arthur's public projects with their name, URL, and description.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        execute: async () =>
          textResult(
            projects.map((project) => ({
              name: project.title,
              url: project.url,
              description: project.description,
            })),
          ),
      },
      {
        name: "get_contact_links",
        description:
          "Returns Arthur's public contact channels: email, LinkedIn, GitHub, and X.",
        inputSchema: {
          type: "object",
          properties: {},
          additionalProperties: false,
        },
        execute: async () =>
          textResult({
            email: siteConfig.links.email,
            linkedin: siteConfig.links.linkedin,
            github: siteConfig.links.github,
            x: siteConfig.links.x,
          }),
      },
    ];

    nav.modelContext.provideContext({ tools }).catch(() => {
      // WebMCP is experimental, silently ignore registration failures.
    });
  }, []);

  return null;
}
