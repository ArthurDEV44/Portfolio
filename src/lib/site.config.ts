// Portfolio configuration
export const siteConfig = {
  name: "Arthur Jean",
  company: "StriveX",
  handle: "arthurjean.com",
  role: "Indie Maker",
  pitch: "I build developer tools for the new way of coding.",
  location: "Remote · France",
  available: true,
  language: "en",
  locale: "en_US",
  title: "Arthur Jean | Developer tools for AI coding agents",
  description:
    "Indie Maker building dev tools, coding agent workflows, open-source software, and products for the new way of coding.",
  url: "https://arthurjean.com",
  ogImage: "/og-image.png",
  ogImageAlt:
    "Arthur Jean, developer tools for AI coding agents and agentic workflows",
  profileImage: "/images/avatar.png",
  profileImageAlt: "Portrait of Arthur Jean",
  lastModified: "2026-07-21",
  keywords: [
    "developer tools",
    "AI coding agents",
    "coding agent workflows",
    "Paneflow",
    "Pyxis CLI",
    "Rust developer",
    "Next.js developer",
    "Claude Code workflows",
    "MCP",
    "agentic workflows",
    "open source dev tools",
  ],
  links: {
    email: "arthur.jean@strivex.fr",
    linkedin: "https://www.linkedin.com/in/arthur-jean-401b56239/",
    github: "https://github.com/arthjean",
    x: "https://x.com/arthurjdev",
    mastodon: "https://mastodon.social/@arthurjdev",
    cal: "https://cal.com/arthurjean/30min",
  },
  navLinks: [
    { href: "#projects", label: "Projects" },
    { href: "#clients", label: "Clients" },
    { href: "#value", label: "Approach" },
    { href: "#journey", label: "Journey" },
    { href: "#faq", label: "FAQ" },
  ],
};

// Current stack (pill tags)
export const stack = [
  "Rust",
  "Next.js",
  "Python",
  "Tauri",
  "TypeScript",
  "Claude Code",
  "MCP",
  "RAG",
];

// Main stack - languages and frameworks (legacy, kept for compatibility)
export const mainStack = [
  { name: "Rust", category: "Language" },
  { name: "Next.js", category: "Framework" },
  { name: "Python", category: "Language" },
  { name: "Tauri", category: "Desktop" },
  { name: "TypeScript", category: "Language" },
  { name: "Claude Code", category: "AI Assistant" },
];

// Tools and services (legacy)
export const devTools = [
  { name: "Claude Code", category: "AI Assistant" },
  { name: "Cursor", category: "IDE" },
  { name: "Hugging Face", category: "AI Platform" },
  { name: "Ollama", category: "Local LLM" },
  { name: "vLLM", category: "Inference" },
  { name: "Vercel", category: "Hosting" },
  { name: "Drizzle", category: "ORM" },
  { name: "Stripe", category: "Payment" },
  { name: "Neon", category: "Database" },
  { name: "Clerk", category: "Auth" },
  { name: "Cloudflare", category: "CDN" },
];

// AI skills
export const aiSkills = [
  {
    name: "Multi-agent orchestration",
    description:
      "Specialized agent systems with self-reflection, dynamic planning, and parallel execution for complex tasks",
  },
  {
    name: "Advanced RAG",
    description:
      "Retrieval-Augmented Generation with contextual reranking, semantic chunking, and multi-source enrichment",
  },
  {
    name: "LLM Engineering",
    description:
      "Advanced prompt engineering, fine-tuning, model evaluation, and inference pipeline optimization",
  },
  {
    name: "MCP integration",
    description:
      "Model Context Protocol for connecting LLMs to external tools, APIs, and real-time data sources",
  },
  {
    name: "Agentic Workflows",
    description:
      "Autonomous workflows with tool use, function calling, and intelligent feedback loops",
  },
  {
    name: "Computer Use & Browser Automation",
    description:
      "Agents that can interact with GUIs, browsers, and desktop apps autonomously",
  },
];

// Solo projects
export interface Project {
  title: string;
  description: string;
  tags: string[];
  url: string | null;
  meta: string;
  rainbow?: boolean;
}

export const projects: Project[] = [
  {
    title: "Paneflow",
    description: "Cross-platform GPUI app for parallel coding agents.",
    tags: ["Dev Tool", "Rust", "GPU"],
    url: "https://paneflow.dev",
    meta: "2025, Open source",
    rainbow: true,
  },
  {
    title: "Rust Doctor",
    description: "Your agent writes bad Rust. This catches it.",
    tags: ["Dev Tool", "Rust", "MCP"],
    url: "https://rust-doctor.vercel.app",
    meta: "2025, Open source",
  },
  {
    title: "Mistral Vibe RS",
    description: "Mistral's coding agent, rebuilt from scratch in Rust.",
    tags: ["CLI", "Rust", "AI Agents"],
    url: "https://github.com/arthjean/mistral-vibe-rs",
    meta: "2026, Open source",
  },
  {
    title: "Kori",
    description:
      "Native Linux control for NZXT Kraken and RGB hardware. Rust and GPUI, local-only, no browser runtime. Unofficial.",
    tags: ["Desktop App", "Rust", "Linux"],
    url: "https://github.com/arthjean/kori",
    meta: "2026, Open source",
  },
  {
    title: "Pyxis",
    description:
      "Codex CLI is the best agent harness, but it's locked to OpenAI. Pyxis won't be.",
    tags: ["CLI", "Rust", "AI Agents"],
    url: "https://github.com/arthjean/pyxis",
    meta: "2026, Open source",
  },
  {
    title: "Distill",
    description: "Your agent wastes context. Distill fixes it.",
    tags: ["Dev Tool", "MCP", "TypeScript"],
    url: "https://distill-mcp.com",
    meta: "2025, Open source",
  },
  {
    title: "OpenbookLM",
    description:
      "OpenbookLM core: RAG and multi-LLM document chat with citations. Self-hostable, Apache-2.0.",
    tags: ["RAG", "Rust", "Next.js"],
    url: "https://github.com/arthjean/openbooklm-core",
    meta: "2026, Open core",
  },
];

// Client work
export interface Client {
  title: string;
  description: string;
  url: string | null;
  year: string;
}

export const clients: Client[] = [
  {
    title: "Open Source Contributions",
    description:
      "Active contributor to Zed and other developer infrastructure projects.",
    url: "https://github.com/arthjean",
    year: "Ongoing",
  },
  {
    title: "Azuna",
    description: "Landing page for a real estate concierge service in Nice.",
    url: "https://azuna.pro",
    year: "2024",
  },
  {
    title: "Dress Night",
    description: "Evening dress e-commerce site with an admin panel.",
    url: "https://dress-night.com/",
    year: "2024",
  },
  {
    title: "Au Sommet de Chez Vous",
    description: "Landing page for a tree-care company in Brittany.",
    url: "https://ausommetdechezvous.bzh",
    year: "2023",
  },
];

// Approach / pillars
export interface ValuePillar {
  num: string;
  title: string;
  description: string;
}

export const valuePillars: ValuePillar[] = [
  {
    num: "01",
    title: "Product vision",
    description:
      "I start with the problem, the market, and the actual usage. Code comes after the product thesis, never before.",
  },
  {
    num: "02",
    title: "Workflow AI-native",
    description:
      "Claude Code, Codex, skills, subagents, MCP, and multi-agent workflows all serve one goal: shortening the idea-to-production loop.",
  },
  {
    num: "03",
    title: "Ship solo, end to end",
    description:
      "Architecture, product, interface, backend, infrastructure, deployment. One short loop, without coordination debt.",
  },
  {
    num: "04",
    title: "Open source and community",
    description:
      "I contribute, publish, and document. The tools have to be good enough to stand on their own outside the portfolio.",
  },
];

// Journey
export interface JourneyStep {
  period: string;
  title: string;
  description: string;
  current?: boolean;
}

export const journey: JourneyStep[] = [
  {
    period: "2021 - 2023",
    title: "Learning software development",
    description:
      "Work-study training. The foundations of the craft, the first real lines of code, and the first contact with production work.",
  },
  {
    period: "2023 - 2025",
    title: "Sole developer in a company",
    description:
      "Architecture, product, deployment: everything was on me. I started using AI in late 2022 with ChatGPT and GitHub Copilot, then moved to Cursor as soon as it launched.",
  },
  {
    period: "2025",
    title: "Solopreneur",
    description:
      "I launched my own dev tools: Rust Doctor and Distill. Open-source contributor to Zed. Full shift to Cursor, then Claude Code.",
  },
  {
    period: "2026",
    title: "Expert AI Builder",
    description:
      "Deep Claude Code workflow: skills, subagents, multi-agent workflows, swarm mode, and MCP. Codex is part of the loop for PRDs and code review.",
    current: true,
  },
];

// Experience
export interface ExperienceRole {
  title: string;
  contract: string;
  period: string;
  duration: string;
  setup: string;
  highlights: string[];
}

export interface Experience {
  company: string;
  logo: "strivex" | "avancial";
  location: string;
  roles: ExperienceRole[];
}

export const experiences: Experience[] = [
  {
    company: "StriveX",
    logo: "strivex",
    location: "Nantes, France",
    roles: [
      {
        title: "Founder & Creator & Software Engineer",
        contract: "Full-time",
        period: "11.2024 – Present",
        duration: "1 yr 10 mos",
        setup: "Remote",
        highlights: [
          "Paneflow: a native Rust and GPUI workspace for coding agents, shipped on Linux, macOS, and Windows.",
          "Pyxis: a native Rust coding agent with a headless core, tooling, sessions, and a Linux sandbox.",
          "Distill: a TypeScript MCP server that shrinks LLM context and maps codebase structure.",
          "Open source: two Rust fixes merged into Zed.",
        ],
      },
    ],
  },
  {
    company: "Avancial",
    logo: "avancial",
    location: "Nantes, France",
    roles: [
      {
        title: "Full Stack Software Engineer",
        contract: "Fixed-term",
        period: "03.2023 – 06.2025",
        duration: "2 yrs 4 mos",
        setup: "On-site",
        highlights: [
          "Sole developer on the team, from architecture through production.",
          "Designed and shipped an internal Gantt tool on an Angular and Fastify stack, backed by a shared UI component set.",
          "Automated deployments to Azure virtual machines.",
        ],
      },
    ],
  },
];

// FAQ
export const faqItems = [
  {
    question: "What is your main tech stack?",
    answer:
      "I mostly work with Next.js and TypeScript for the web, Rust for CLI tools and performance-sensitive backend work, and Python for AI pipelines. On the AI side, I use Claude Code, multi-agent systems, advanced RAG, and MCP.",
  },
  {
    question: "What are you working on right now?",
    answer:
      "Paneflow is the main project: a native workspace for running multiple coding agents in parallel.",
  },
  {
    question: "How do you work?",
    answer:
      "I start from a real problem, ship a first version, and iterate from actual usage. The goal is not to make a showcase. It's to launch products that hold up.",
  },
  {
    question: "How do you use AI in your development workflow?",
    answer:
      "AI is central to my process. I use Claude Code with custom skills and subagents, multi-agent workflows for development, and Codex for code review and PRDs. I don't code line by line anymore. I orchestrate.",
  },
  {
    question: "Who do you build for?",
    answer:
      "For my own products. I'm open to serious conversations around open source, dev tools, and coding agents.",
  },
  {
    question: "What are you open to?",
    answer:
      "Mostly user feedback, conversations with other builders, open-source contributions, and product discussions that can sharpen what I am launching.",
  },
  {
    question: "Where do you work from?",
    answer:
      "I work remotely from France. It's the setup that lets me move with the least friction.",
  },
];
