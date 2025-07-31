import { Experience, Project, Skill } from '@/types';

export const personalInfo = {
  name: "Arthur Jean",
  title: "Développeur Full Stack",
  bio: "Passionné par le développement full stack, je me concentre sur la performance, la durabilité et l'impact environnemental de la technologie numérique. Je privilégie la qualité du code, les bonnes pratiques, les solutions modulaires et maintenables, l'innovation, l'apprentissage continu et le travail collaboratif pour une productivité à long terme et un succès collectif.",
  email: "arthur.jean@strivex.fr",
  phone: "06 51 49 45 73",
  location: "Nantes, France",
  address: "108 rue de la Gilarderie, 44200 Nantes",
  avatar: "/images/avatar.png",
  resume: "/documents/cv-arthur-jean.pdf",
  github: "https://github.com/ArthurDEV44"
};

export const skills: Skill[] = [
  // Langages & Frameworks
  { id: "javascript", name: "JavaScript", category: "languages", level: 5 },
  { id: "typescript", name: "TypeScript", category: "languages", level: 5 },
  { id: "python", name: "Python", category: "languages", level: 4 },
  { id: "php", name: "PHP", category: "languages", level: 3 },
  
  // Frontend
  { id: "nextjs", name: "Next.js", category: "frontend", level: 5 },
  { id: "angular", name: "Angular (v19/AngularJS)", category: "frontend", level: 5 },
  { id: "react", name: "React", category: "frontend", level: 4 },
  { id: "tailwind", name: "TailwindCSS v4", category: "frontend", level: 5 },
  { id: "html", name: "HTML/CSS", category: "frontend", level: 5 },
  { id: "primeng", name: "PrimeNG v19", category: "frontend", level: 5 },
  { id: "shadcn", name: "Shadcn/UI", category: "frontend", level: 4 },
  { id: "originui", name: "OriginUI", category: "frontend", level: 4 },
  { id: "threejs", name: "Three.js", category: "frontend", level: 3 },
  { id: "pwa", name: "PWA", category: "frontend", level: 4 },
  
  // Backend
  { id: "nodejs", name: "Node.js", category: "backend", level: 5 },
  { id: "fastify", name: "Fastify 5", category: "backend", level: 5 },
  { id: "express", name: "Express", category: "backend", level: 4 },
  { id: "koa", name: "Koa", category: "backend", level: 3 },
  { id: "nestjs", name: "NestJS", category: "backend", level: 4 },
  { id: "flask", name: "Flask", category: "backend", level: 3 },
  
  // Architecture & Backend
  { id: "prisma", name: "Prisma", category: "architecture", level: 5 },
  { id: "postgresql", name: "PostgreSQL", category: "architecture", level: 5 },
  { id: "neondb", name: "NeonDB", category: "architecture", level: 4 },
  { id: "supabase", name: "Supabase", category: "architecture", level: 4 },
  { id: "pgadmin", name: "pgAdmin", category: "architecture", level: 4 },
  { id: "restapi", name: "API REST", category: "architecture", level: 5 },
  { id: "websocket", name: "WebSocket", category: "architecture", level: 4 },
  { id: "jamstack", name: "Jamstack", category: "architecture", level: 4 },
  { id: "serverless", name: "Serverless", category: "architecture", level: 4 },
  { id: "redis", name: "Upstash (Redis)", category: "architecture", level: 4 },
  
  // Sécurité & Auth
  { id: "clerk", name: "Clerk", category: "security", level: 4 },
  { id: "ldap", name: "LDAP", category: "security", level: 3 },
  { id: "smtp", name: "SMTP", category: "security", level: 3 },
  { id: "cloudflare", name: "Cloudflare", category: "security", level: 4 },
  
  // DevOps
  { id: "docker", name: "Docker", category: "devops", level: 5 },
  { id: "docker-swarm", name: "Docker Swarm", category: "devops", level: 4 },
  { id: "github-actions", name: "GitHub Actions", category: "devops", level: 5 },
  { id: "vps", name: "VPS", category: "devops", level: 4 },
  { id: "azure", name: "VM Azure", category: "devops", level: 4 },
  { id: "ubuntu", name: "Ubuntu", category: "devops", level: 4 },
  { id: "vercel", name: "Vercel", category: "devops", level: 5 },
  { id: "hostinger", name: "Hostinger", category: "devops", level: 3 },
  
  // Outils & Services
  { id: "n8n", name: "n8n", category: "tools", level: 3 },
  { id: "stripe", name: "Stripe", category: "tools", level: 4 },
  { id: "github", name: "GitHub", category: "tools", level: 5 },
  { id: "openai", name: "OpenAI API", category: "tools", level: 3 }
];

export const projects: Project[] = [
  {
    id: "readflow",
    title: "Readflow",
    description: "Transformez votre workflow ! Grâce à notre IA, créez et gérez vos documentations simplement.",
    technologies: ["Next.js", "Clerk", "NeonDB", "TailwindCSS", "Shadcn/UI", "Prisma", "Vercel", "Three.js"],
    imageUrl: "/images/projects/hero-readflow.png",
    favicon: "",
    urls: [],
    version: "v1.2.3",
    developer: "Arthur Jean",
    featured: false
  },
  {
    id: "ornicron",
    title: "Ornicron",
    description: "Demandez un devis gratuitement et obtenez un workflow sur mesure.",
    technologies: ["Next.js", "TailwindCSS", "Prisma", "Clerk", "Vercel", "NeonDB"],
    imageUrl: "/images/projects/hero-ornicron.png",
    favicon: "",
    urls: [],
    version: "v2.1.0",
    developer: "Arthur Jean",
    featured: false
  },
  {
    id: "azuna",
    title: "Azuna",
    description: "La conciergerie spécialisée dans la gestion de biens immobiliers.",
    technologies: ["Next.js", "TailwindCSS", "Vercel", "Three.js"],
    imageUrl: "/images/projects/hero-azuna.png",
    favicon: "https://azuna.pro/favicon.ico",
    liveUrl: "https://azuna.pro",
    urls: ["https://azuna.pro"],
    version: "v0.0.9",
    developer: "Arthur Jean",
    featured: false
  },
  {
    id: "ausommetdechezvous",
    title: "Au Sommet de Chez Vous",
    description: "Au sommet de chez vous répond avec sérieux et qualité à tous vos besoins d'élagage et d'abattage.",
    technologies: ["Next.js", "TailwindCSS", "NeonDB", "Prisma", "Clerk", "Vercel", "Resend"],
    imageUrl: "/images/projects/hero-ausommetdechezvous.png",
    favicon: "https://ausommetdechezvous.com/favicon.ico",
    liveUrl: "https://ausommetdechezvous.com",
    urls: ["https://ausommetdechezvous.com", "https://ausommetdechezvous.fr", "https://ausommetdechezvous.bzh", "https://au-sommet-de-chez-vous.fr", "https://au-sommet-de-chez-vous.com"],
    version: "v0.0.4",
    developer: "Arthur Jean",
    featured: false
  },
  {
    id: "atreeyn",
    title: "Atreeyn",
    description: "La plateforme ultime pour les créateurs de contenu et joueurs d'esports Warzone.",
    technologies: ["Next.js", "TailwindCSS", "SWR", "NeonDB", "Prisma", "Clerk", "Vercel", "Zustand"],
    imageUrl: "/images/projects/hero-atreeyn.png",
    favicon: "https://atreeyn.com/favicon.ico",
    urls: [],
    version: "v0.0.1.2",
    developer: "Arthur Jean",
    featured: false,
    status: "development"
  }
];

export const experiences: Experience[] = [
  {
    id: "avancial-fullstack",
    company: "Avancial (CDD)",
    position: "Développeur Full Stack",
    duration: "01/07/2024 - 30/06/2025",
    description: "En tant que développeur unique, j'ai structuré et industrialisé le cycle de vie du projet web, défini une architecture technique complète (Angular 19 + Fastify 5), implémenté une Clean Architecture modulaire et scalable, conçu un template PrimeNG personnalisé pour une charte web unifiée, automatisé le déploiement VM en production, optimisé les performances serveur et géré les node_modules pour une livraison rapide et maîtrisée.",
    technologies: ["Angular 19", "Fastify 5", "Clean Architecture", "PrimeNG", "Docker Swarm", "GitHub Actions", "PostgreSQL", "Prisma"]
  },
  {
    id: "rncp-bac4",
    company: "Titre RNCP Bac+4",
    position: "Développeur/Concepteur Web",
    duration: "2023/2024",
    description: "Consolidation des compétences en développement web lors de l'alternance, gestion de projets Agile, collaboration en équipe, première expérience DevOps (Docker, Docker Swarm), mise en place de pipelines CI/CD avec GitHub Actions, tests unitaires avec Jest, analyse des performances serveur via logs.",
    technologies: ["JavaScript", "TypeScript", "Docker", "Docker Swarm", "GitHub Actions", "Jest", "Agile"]
  },
  {
    id: "rncp-bac2",
    company: "Titre RNCP Bac+2",
    position: "Développeur Full Stack (NodeJS)",
    duration: "2022/2023",
    description: "En tant qu'apprenti Développeur Full Stack (Node.js & Angular), j'ai approfondi mes compétences en JavaScript, TypeScript, PHP, Python et SQL, avec une année dédiée au renforcement de ma maîtrise technique sur l'ensemble de la stack.",
    technologies: ["Node.js", "Angular", "JavaScript", "TypeScript", "PHP", "Python", "SQL"]
  },
  {
    id: "3w-academy",
    company: "3W Academy",
    position: "Développeur/Intégrateur Web",
    duration: "2021",
    description: "Formation complète couvrant HTML, CSS, JavaScript, PHP, SQL, avec une spécialisation Full Stack axée sur React et Node.js.",
    technologies: ["HTML", "CSS", "JavaScript", "PHP", "SQL", "React", "Node.js"]
  }
];

export const socialLinks = {
  github: "https://github.com/ArthurDEV44",
  linkedin: "https://www.linkedin.com/in/arthur-jean-401b56239",
  instagram: "https://www.instagram.com/_arthurj_/"
}; 