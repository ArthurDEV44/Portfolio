export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  galleryImages?: string[]; // Nouvelles images pour la galerie
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