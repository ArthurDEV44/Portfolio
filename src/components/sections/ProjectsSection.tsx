"use client";

import { projects } from '@/data/portfolio';
import { ExternalLink, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function ProjectsSection() {
  const [tooltipProject, setTooltipProject] = useState<string | null>(null);
  const [faviconErrors, setFaviconErrors] = useState<Set<string>>(new Set());
  const [expandedTech, setExpandedTech] = useState<Set<string>>(new Set());
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Fermer le tooltip en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setTooltipProject(null);
      }
    };

    if (tooltipProject) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [tooltipProject]);

  // Composant Tooltip pour les URLs
  const UrlTooltip = ({ urls, projectId }: { urls: string[], projectId: string }) => (
    <div 
      ref={tooltipRef}
      className="fixed z-50 bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl p-3 min-w-48"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <div className="space-y-2">
        {urls.map((url, index) => (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-zinc-800 transition-colors text-sm text-zinc-300 hover:text-white"
            onClick={() => setTooltipProject(null)}
          >
            <ExternalLink className="w-3 h-3" />
            <span className="truncate">{url.replace(/^https?:\/\//, '')}</span>
          </a>
        ))}
      </div>
    </div>
  );

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

        {/* Grille des projets - Style Vercel */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="bg-zinc-900/50 backdrop-blur-md rounded-xl border border-zinc-800/50 overflow-hidden hover:border-zinc-700/50 transition-all duration-300 group flex flex-col"
            >
              {/* Header avec favicon, nom et actions */}
              <div className="p-4 border-b border-zinc-800/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Favicon */}
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                      {project.favicon && !faviconErrors.has(project.id) ? (
                        <Image
                          src={project.favicon}
                          alt={`${project.title} favicon`}
                          width={20}
                          height={20}
                          className="rounded"
                          onError={() => {
                            setFaviconErrors(prev => new Set([...prev, project.id]));
                          }}
                        />
                      ) : (
                        <span className="text-lg">📦</span>
                      )}
                    </div>
                    
                    {/* Nom du projet */}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-white text-sm mb-0 leading-tight truncate">
                        {project.title}
                      </h3>
                      {project.urls && project.urls.length > 0 ? (
                        <div className="flex items-center gap-2">
                          <a 
                            href={project.urls[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors hover:underline leading-tight truncate"
                          >
                            {project.urls[0].replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </a>
                          {/* Bouton URLs multiples - déplacé ici */}
                          {project.urls.length > 1 && (
                            <div className="relative flex-shrink-0">
                              <button
                                onClick={() => setTooltipProject(tooltipProject === project.id ? null : project.id)}
                                className="w-5 h-5 rounded-md flex items-center justify-center text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800/50 transition-all duration-200 relative cursor-pointer"
                              >
                                <span className="text-xs font-medium">+{project.urls.length}</span>
                              </button>
                              {tooltipProject === project.id && (
                                <>
                                  {/* Overlay */}
                                  <div className="fixed inset-0 bg-black/20 z-40" />
                                  <UrlTooltip urls={project.urls} projectId={project.id} />
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-500 leading-tight truncate">
                          {project.developer || 'Arthur Jean'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Version et statut */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    {project.version && (
                      <span className="text-xs px-2 py-1 bg-zinc-800/50 text-zinc-400 rounded-md">
                        {project.version}
                      </span>
                    )}
                    {project.featured && (
                      <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-md border border-yellow-500/30">
                        ⭐ Phare
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {project.status === 'development' ? (
                      <>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-zinc-500">En développement</span>
                      </>
                    ) : project.urls && project.urls.length > 0 ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-zinc-500">En ligne</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-zinc-500 rounded-full"></div>
                        <span className="text-xs text-zinc-500">Hors ligne</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Image de preview */}
              <div className="relative h-48 bg-gradient-to-br from-zinc-800/20 to-zinc-900/40 overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={`Capture d'écran de ${project.title}`}
                  fill
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    // En cas d'erreur, afficher un placeholder
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                
                {/* Overlay subtle au hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
              </div>

              {/* Contenu */}
              <div className="p-4 flex-grow flex flex-col">
                <p className="text-sm text-zinc-400 leading-relaxed mb-4 flex-grow">
                  {project.description}
                </p>

                {/* Technologies - Style compact avec expansion */}
                <div className="flex flex-wrap gap-1 mt-auto">
                  {expandedTech.has(project.id) ? (
                    // Mode étendu : toutes les technologies
                    <>
                      {project.technologies.map((tech) => (
                        <span 
                          key={tech}
                          className="text-xs px-2 py-1 bg-zinc-800/30 text-zinc-400 rounded border border-zinc-700/30"
                        >
                          {tech}
                        </span>
                      ))}
                      <button
                        onClick={() => setExpandedTech(prev => {
                          const newSet = new Set(prev);
                          newSet.delete(project.id);
                          return newSet;
                        })}
                        className="text-xs px-2 py-1 bg-zinc-800/30 text-zinc-500 hover:text-zinc-300 rounded border border-zinc-700/30 transition-colors cursor-pointer"
                      >
                        − Moins
                      </button>
                    </>
                  ) : (
                    // Mode compact : 3 premières technologies + bouton
                    <>
                      {project.technologies.slice(0, 3).map((tech) => (
                        <span 
                          key={tech}
                          className="text-xs px-2 py-1 bg-zinc-800/30 text-zinc-400 rounded border border-zinc-700/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <button
                          onClick={() => setExpandedTech(prev => new Set([...prev, project.id]))}
                          className="text-xs px-2 py-1 bg-zinc-800/30 text-zinc-500 hover:text-zinc-300 rounded border border-zinc-700/30 transition-colors cursor-pointer"
                        >
                          +{project.technologies.length - 3}
                        </button>
                      )}
                    </>
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