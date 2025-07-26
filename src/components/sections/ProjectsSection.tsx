"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components';
import { projects } from '@/data/portfolio';
import { ExternalLink, Github, Star, Filter, ArrowRight, Images, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProjectsSection() {
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  const filteredProjects = filter === 'featured' 
    ? projects.filter(project => project.featured)
    : projects;

  const getAllTechnologies = () => {
    const allTechs = projects.flatMap(project => project.technologies);
    return [...new Set(allTechs)];
  };

  const getTechColor = (tech: string) => {
    const colors = {
      'Angular 19': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Fastify 5': 'bg-green-500/20 text-green-300 border-green-500/30',
      'Next.js': 'bg-zinc-800/50 text-white border-zinc-600/50',
      'React': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'TypeScript': 'bg-blue-600/20 text-blue-300 border-blue-600/30',
      'Node.js': 'bg-green-600/20 text-green-300 border-green-600/30',
      'PostgreSQL': 'bg-blue-700/20 text-blue-300 border-blue-700/30',
      'Prisma': 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      'Stripe': 'bg-purple-600/20 text-purple-300 border-purple-600/30',
      'TailwindCSS': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'Three.js': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'PWA': 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      'PrimeNG': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Clean Architecture': 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      'Docker Swarm': 'bg-blue-400/20 text-blue-300 border-blue-400/30',
      'GitHub Actions': 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      'Vercel': 'bg-zinc-700/20 text-zinc-300 border-zinc-600/30',
      'Clerk': 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      'NeonDB': 'bg-green-500/20 text-green-300 border-green-500/30',
      'SWR': 'bg-white text-black border-white/30'
    };
    return colors[tech as keyof typeof colors] || 'bg-zinc-700/20 text-zinc-300 border-zinc-600/30';
  };

  return (
    <section id="projects" className="py-20 px-4 bg-gradient-to-b from-black via-zinc-900/20 to-black min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block bg-zinc-900/50 backdrop-blur-md rounded-full border border-zinc-700/50 px-4 py-2 mb-6">
            <span className="text-zinc-400 text-sm font-medium">Portfolio</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Projets réalisés
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Une sélection de mes projets les plus récents et les plus significatifs, 
            démontrant mes compétences en développement full stack.
          </p>
        </div>

        {/* Filtres */}
        <div className="flex justify-center gap-4 mb-12 animate-fade-in">
          <button
            onClick={() => setFilter('all')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 ${
              filter === 'all' 
                ? 'bg-sky-400 text-black border-sky-400 shadow-lg shadow-sky-400/25' 
                : 'bg-zinc-900/50 backdrop-blur-md text-zinc-300 border-zinc-700/50 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            Tous les projets ({projects.length})
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`flex items-center gap-2 px-6 py-3 rounded-full border transition-all duration-300 ${
              filter === 'featured' 
                ? 'bg-sky-400 text-black border-sky-400 shadow-lg shadow-sky-400/25' 
                : 'bg-zinc-900/50 backdrop-blur-md text-zinc-300 border-zinc-700/50 hover:bg-zinc-800/50 hover:text-white'
            }`}
          >
            <Star className="w-4 h-4" />
            Projets phares ({projects.filter(p => p.featured).length})
          </button>
        </div>

        {/* Grille des projets */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id}
              className="bg-zinc-900/30 backdrop-blur-md rounded-2xl border border-zinc-700/50 overflow-hidden hover:bg-zinc-800/30 transition-all duration-300 group flex flex-col h-full"
            >
              {/* Image du projet */}
              <div className="relative h-48 bg-gradient-to-br from-sky-400/10 to-blue-600/10 overflow-hidden flex-shrink-0">
                {project.featured && (
                  <div className="absolute top-3 left-3 z-10">
                    <div className="flex items-center gap-1 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 text-yellow-300 px-3 py-1 rounded-full text-xs font-medium">
                      <Star className="w-3 h-3" />
                      Phare
                    </div>
                  </div>
                )}
                
                {/* Image du projet */}
                <div className="w-full h-full bg-gradient-to-br from-sky-400/20 to-blue-600/20 flex items-center justify-center relative overflow-hidden">
                  {project.imageUrl ? (
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        // En cas d'erreur de chargement, afficher le fallback
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-6xl font-bold text-sky-400/30">
                      {index + 1}
                    </div>
                  )}
                  
                  {/* Overlay avec actions rapides */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-zinc-800/80 backdrop-blur-md border border-zinc-600/50 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700/80 transition-all duration-200"
                        title="Voir le code source"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-sky-300 transition-colors">
                  {project.title}
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.slice(0, 4).map((tech) => (
                    <span 
                      key={tech}
                      className={`text-xs px-2 py-1 rounded-md border ${getTechColor(tech)}`}
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-xs px-2 py-1 rounded-md border bg-zinc-700/20 text-zinc-400 border-zinc-600/30">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Actions dynamiques - toujours en bas */}
                <div className="flex gap-2 mt-auto">
                  {/* Bouton principal - Consulter ou Galerie */}
                  {project.liveUrl ? (
                    <a 
                      href={project.liveUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-white/80 text-black rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Consulter
                    </a>
                  ) : project.galleryImages && project.galleryImages.length > 0 ? (
                    <Link 
                      href={`/galerie/${project.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-transparent hover:bg-white/10 border border-white/10 text-white rounded-lg transition-all duration-200 text-sm font-medium cursor-pointer"
                    >
                      <Images className="w-4 h-4" />
                      Galerie
                    </Link>
                  ) : (
                    <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-sky-400/10 border border-sky-400/30 text-sky-400 rounded-lg transition-all duration-200 text-sm font-medium">
                      <Clock className="w-4 h-4" />
                      En développement
                    </div>
                  )}

                  {/* Bouton secondaire - GitHub si disponible */}
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 rounded-lg hover:bg-zinc-700/50 hover:text-white transition-all duration-200 text-sm"
                      title="Voir le code source"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 