'use client';

import { Card, CardContent, Badge } from '@/components';
import { personalInfo, experiences, skills } from '@/data/portfolio';
import { 
  Code, 
  Users, 
  Trophy, 
  MapPin, 
  Calendar,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronRight,
  Phone
} from 'lucide-react';
import Image from 'next/image';

export default function AboutSection() {
  const languages = ["Français", "English"];
  
  const skillCategories = [
    {
      title: "Langages & Frameworks",
      description: "Maîtrise des langages de programmation modernes",
      skills: skills.filter(skill => skill.category === "languages")
    },
    {
      title: "Frontend Development",
      description: "Interfaces utilisateur modernes et performantes",
      skills: skills.filter(skill => skill.category === "frontend")
    },
    {
      title: "Backend Development", 
      description: "APIs robustes et architectures scalables",
      skills: skills.filter(skill => skill.category === "backend")
    },
    {
      title: "Architecture & Base de données",
      description: "Conception d'architectures et gestion des données",
      skills: skills.filter(skill => skill.category === "architecture")
    },
    {
      title: "Sécurité & Authentification",
      description: "Sécurisation des applications et gestion des accès",
      skills: skills.filter(skill => skill.category === "security")
    },
    {
      title: "DevOps & Déploiement",
      description: "Automatisation et déploiement continu",
      skills: skills.filter(skill => skill.category === "devops")
    },
    {
      title: "Outils & Services",
      description: "Intégrations et services tiers",
      skills: skills.filter(skill => skill.category === "tools")
    }
  ];

  const tableOfContents = [
    { id: "intro", title: "Introduction", display: true },
    { id: "experience", title: "Expérience", display: true },
    { id: "technical", title: "Compétences", display: true },
    { id: "contact-cta", title: "Contact", display: true }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-b from-black via-zinc-900/20 to-black min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Sidebar Avatar - Sticky */}
          <div className="lg:sticky lg:top-24 lg:min-w-[280px] flex-shrink-0">
            <div className="bg-zinc-900/30 backdrop-blur-md rounded-3xl border border-zinc-700/50 p-8 text-center">
              
              {/* Avatar */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full border-4 border-zinc-700/50 overflow-hidden bg-zinc-800">
                  {/* Image d'avatar avec fallback aux initiales */}
                  <div className="w-full h-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center relative">
                    <Image
                      src="/images/avatar.png"
                      alt={`Avatar de ${personalInfo.name}`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // En cas d'erreur, on cache l'image et on affiche les initiales
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.classList.add('bg-gradient-to-br', 'from-sky-400', 'to-blue-600');
                        }
                      }}
                    />
                    {/* Fallback avec les initiales */}
                    <span className="text-4xl font-bold text-white absolute inset-0 flex items-center justify-center bg-gradient-to-br from-sky-400 to-blue-600" style={{ display: 'none' }}>
                      {personalInfo.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-zinc-900 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                </div>
              </div>

              {/* Infos personnelles */}
              <h3 className="text-xl font-semibold text-white mb-2">{personalInfo.name}</h3>
              <p className="text-zinc-400 mb-4">{personalInfo.title}</p>
              
              {/* Localisation */}
              <div className="flex items-center justify-center gap-2 text-zinc-400 mb-4">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{personalInfo.location}</span>
              </div>

              {/* Contact */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center gap-2 text-zinc-400">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{personalInfo.phone}</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-zinc-400">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{personalInfo.email}</span>
                </div>
              </div>

              {/* Langues */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {languages.map((language) => (
                  <span 
                    key={language}
                    className="bg-zinc-800/50 border border-zinc-700/50 rounded-full px-3 py-1 text-xs text-zinc-300"
                  >
                    {language}
                  </span>
                ))}
              </div>

              {/* Bouton calendrier */}
              <div className="bg-sky-400/10 border border-sky-400/20 rounded-full p-3 mb-6 hover:bg-sky-400/20 transition-colors cursor-pointer group">
                <div className="flex items-center gap-3 text-sky-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Programmer un appel</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Liens sociaux */}
              <div className="flex justify-center gap-3">
                <a 
                  href={personalInfo.github}
                  className="w-10 h-10 bg-zinc-800/50 border border-zinc-700/50 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-all duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href="https://linkedin.com/in/arthurjean"
                  className="w-10 h-10 bg-zinc-800/50 border border-zinc-700/50 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-all duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href={`mailto:${personalInfo.email}`}
                  className="w-10 h-10 bg-zinc-800/50 border border-zinc-700/50 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-700/50 transition-all duration-200"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="flex-1 space-y-16">
            
            {/* Section Introduction */}
            <div id="intro" className="animate-fade-in">
              <div className="bg-zinc-900/30 backdrop-blur-md rounded-2xl border border-dashed border-zinc-700/50 p-8">
                <p className="text-lg text-zinc-300 leading-relaxed">
                  {personalInfo.bio}
                </p>
                <p className="text-zinc-400 leading-relaxed mt-4">
                  Depuis plus de 3 ans, je me consacre au développement full stack en utilisant les dernières technologies. 
                  Mon expertise couvre l'ensemble du stack technique, de la conception d'architectures modulaires jusqu'au 
                  déploiement et à la maintenance d'applications performantes.
                </p>
              </div>
            </div>

            {/* Section Expérience */}
            <div id="experience" className="animate-fade-in">
              <h2 className="text-3xl font-bold text-white mb-8">Expérience Professionnelle</h2>
              
              <div className="space-y-8">
                {experiences.map((experience, index) => (
                  <div 
                    key={experience.id}
                    className="bg-zinc-900/30 backdrop-blur-md rounded-2xl border border-zinc-700/50 p-8 hover:bg-zinc-800/30 transition-all duration-300"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">
                          {experience.company}
                        </h3>
                        <p className="text-sky-400 font-medium mb-2">
                          {experience.position}
                        </p>
                      </div>
                      <span className="text-zinc-400 text-sm lg:text-right">
                        {experience.duration}
                      </span>
                    </div>
                    
                    <p className="text-zinc-300 mb-4 leading-relaxed">
                      {experience.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {experience.technologies.map((tech) => (
                        <span 
                          key={tech}
                          className="bg-zinc-800/50 border border-zinc-700/50 rounded-full px-3 py-1 text-xs text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section Compétences Techniques */}
            <div id="technical" className="animate-fade-in">
              <h2 className="text-3xl font-bold text-white mb-8">Compétences Techniques</h2>
              
              <div className="space-y-8">
                {skillCategories.map((category, index) => (
                  <div 
                    key={index}
                    className="bg-zinc-900/30 backdrop-blur-md rounded-2xl border border-zinc-700/50 p-8"
                  >
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {category.title}
                    </h3>
                    <p className="text-zinc-400 mb-6">
                      {category.description}
                    </p>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.skills.map((skill) => (
                        <div 
                          key={skill.id}
                          className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg border border-zinc-700/30 hover:bg-zinc-700/30 transition-colors"
                        >
                          <div className="w-2 h-2 bg-sky-400 rounded-full" />
                          <span className="text-zinc-300 text-sm font-medium">
                            {skill.name}
                          </span>
                          <div className="ml-auto flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className={`w-1 h-1 rounded-full ${
                                  i < skill.level ? 'bg-sky-400' : 'bg-zinc-600'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Call to Action */}
            <div id="contact-cta" className="animate-fade-in">
              <div 
                className="bg-zinc-900/40 backdrop-blur-md rounded-3xl border border-zinc-700/50 p-8 relative overflow-hidden text-center group cursor-none"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  
                  // Créer l'effet de torche
                  const spotlight = e.currentTarget.querySelector('.spotlight') as HTMLElement;
                  if (spotlight) {
                    spotlight.style.background = `radial-gradient(600px at ${x}px ${y}px, rgba(14, 165, 233, 0.15), transparent 40%)`;
                  }
                }}
                onMouseLeave={(e) => {
                  const spotlight = e.currentTarget.querySelector('.spotlight') as HTMLElement;
                  if (spotlight) {
                    spotlight.style.background = 'transparent';
                  }
                }}
              >
                {/* Gradient de base */}
                <div className="absolute inset-0 bg-gradient-to-r from-sky-400/5 to-transparent rounded-3xl" />
                
                {/* Effet spotlight/torche */}
                <div 
                  className="spotlight absolute inset-0 rounded-3xl transition-all duration-300 ease-out pointer-events-none"
                  style={{ background: 'transparent' }}
                />
                
                {/* Overlay pour l'effet d'assombrissement */}
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-900/20 via-transparent to-zinc-900/20 rounded-3xl group-hover:from-zinc-900/40 group-hover:to-zinc-900/40 transition-all duration-500" />
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-sky-100 transition-colors duration-300">
                    Collaborons ensemble
                  </h3>
                  <p className="text-zinc-400 mb-8 max-w-lg mx-auto leading-relaxed group-hover:text-zinc-300 transition-colors duration-300">
                    Prêt à transformer votre vision en réalité digitale ? 
                    Discutons de votre prochain projet full stack.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href={`mailto:${personalInfo.email}`}
                      className="inline-flex items-center gap-3 bg-sky-400 text-black font-medium px-6 py-3 rounded-full hover:bg-sky-500 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-sky-400/25 cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      Démarrer un projet
                    </a>
                    <a 
                      href={personalInfo.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-zinc-800/50 backdrop-blur-md border border-zinc-700/50 text-zinc-300 font-medium px-6 py-3 rounded-full hover:bg-zinc-700/50 hover:text-white hover:scale-105 hover:border-zinc-600/50 transition-all duration-300 cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Voir mon CV
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 