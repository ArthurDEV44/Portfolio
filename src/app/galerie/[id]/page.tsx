import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { ArrowLeft, Calendar, Code, ExternalLink, Github } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { projects } from '@/data/portfolio';
import { Carousel, Badge, Button } from '@/components';

// Configuration ISR pour une revalidation toutes les 24h
export const revalidate = 86400;

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProject(id: string) {
  const project = projects.find(p => p.id === id);
  return project || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return {
      title: 'Projet non trouvé',
      description: 'Le projet demandé n\'existe pas.',
    };
  }

  const title = `Galerie ${project.title} - Arthur Jean`;
  const description = `Découvrez les captures d'écran et détails du projet ${project.title}. ${project.description}`;

  return {
    title,
    description,
    keywords: [
      'Arthur Jean',
      'Portfolio',
      'Galerie',
      project.title,
      'Développeur Full Stack',
      ...project.technologies,
      'Captures d\'écran',
      'Projet web'
    ],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://arthur-jean.dev/galerie/${project.id}`,
      images: [
        {
          url: project.imageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [project.imageUrl],
    },
  };
}

export async function generateStaticParams() {
  return projects
    .filter(project => project.galleryImages && project.galleryImages.length > 0)
    .map((project) => ({
      id: project.id,
    }));
}

export default async function GalleryPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project || !project.galleryImages || project.galleryImages.length === 0) {
    notFound();
  }

  // Données structurées JSON-LD pour le SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": `Galerie ${project.title}`,
    "description": project.description,
    "author": {
      "@type": "Person",
      "name": "Arthur Jean",
      "url": "https://arthur-jean.dev"
    },
    "url": `https://arthur-jean.dev/galerie/${project.id}`,
    "image": project.galleryImages.map(img => ({
      "@type": "ImageObject",
      "url": img,
      "name": project.title
    })),
    "associatedMedia": {
      "@type": "SoftwareApplication",
      "name": project.title,
      "description": project.description,
      "applicationCategory": "WebApplication",
      "operatingSystem": "Web",
      "url": project.liveUrl
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="min-h-screen bg-black">
        {/* Header */}
        <header className="relative bg-gradient-to-b from-zinc-900/50 to-transparent border-b border-zinc-800/50 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <Link
                href="/#projects"
                className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Retour aux projets
              </Link>
              
              <div className="flex gap-3">
                {project.liveUrl && (
                  <Button asChild variant="outline" size="sm">
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Voir le projet
                    </a>
                  </Button>
                )}
                {project.githubUrl && (
                  <Button asChild variant="outline" size="sm">
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      Code source
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="max-w-6xl mx-auto px-4 py-12">
          {/* En-tête du projet */}
          <div className="text-center mb-12">
            <div className="inline-block bg-zinc-900/50 backdrop-blur-md rounded-full border border-zinc-700/50 px-4 py-2 mb-6">
              <span className="text-zinc-400 text-sm font-medium">Galerie du projet</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {project.title}
            </h1>
            
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
              {project.description}
            </p>

            {/* Technologies utilisées */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="secondary" className="bg-zinc-800/50 text-zinc-300 border-zinc-700/50">
                  <Code className="w-3 h-3 mr-1" />
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Carrousel des images */}
          <div className="mb-12">
            <Carousel 
              images={project.galleryImages} 
              title={project.title}
              className="w-full"
            />
          </div>

          {/* Informations supplémentaires */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image hero du projet */}
            <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl border border-zinc-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Image principale</h3>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl border border-zinc-700/50 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Informations</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Nombre d'images</span>
                  <span className="text-white font-medium">{project.galleryImages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Technologies</span>
                  <span className="text-white font-medium">{project.technologies.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400">Statut</span>
                  <span className="text-green-400 font-medium">
                    {project.liveUrl ? 'En ligne' : 'En développement'}
                  </span>
                </div>
                {project.featured && (
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400">Projet phare</span>
                    <span className="text-yellow-400 font-medium">Oui</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 mt-12">
            <Button asChild>
              <Link href="/#projects">
                Voir tous les projets
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/#contact">
                Me contacter
              </Link>
            </Button>
          </div>
        </main>
      </div>
    </>
  );
} 