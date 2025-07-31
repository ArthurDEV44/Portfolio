export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  favicon?: string;
  urls?: string[]; // Tableau des URLs (liveUrl, githubUrl, etc.)
  liveUrl?: string; // Gardé pour compatibilité
  githubUrl?: string; // Gardé pour compatibilité
  version?: string;
  developer?: string;
  featured: boolean;
  status?: 'online' | 'offline' | 'development'; // Statut du projet
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  duration: string;
  description: string;
  technologies: string[];
  logo?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'languages' | 'frontend' | 'backend' | 'architecture' | 'security' | 'devops' | 'tools' | 'design' | 'other';
  level: number; // 1-5
  icon?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SeoMetadata {
  title: string;
  description: string;
  keywords: string[];
  openGraph: {
    title: string;
    description: string;
    image: string;
    url: string;
  };
} 