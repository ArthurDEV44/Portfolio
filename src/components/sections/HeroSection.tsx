import { Button } from '@/components';
import { personalInfo, socialLinks } from '@/data/portfolio';
import { Download, Github, Instagram, Linkedin, Mail } from 'lucide-react';
import Particles from '../particles';

export default function HeroSection() {
  return (
    <section id="hero" className="flex flex-col items-center justify-center w-screen h-screen overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black relative">
      {/* Particules en arrière-plan */}
      <Particles
        className="absolute inset-0 z-0"
        quantity={100}
        staticity={50}
        ease={50}
      />

      {/* Titre principal */}
      <h1 className="py-3.5 px-0.5 z-10 text-4xl text-white duration-1000 cursor-default animate-title font-bold sm:text-6xl md:text-9xl whitespace-nowrap relative">
        {personalInfo.name}
      </h1>

      {/* Sous-titre */}
      <div className="mt-4 animate-fade-in relative z-10">
        <h2 className="text-xl md:text-2xl text-zinc-400 font-medium text-center">
          {personalInfo.title}
        </h2>
      </div>

      {/* Description et statut */}
      <div className="my-16 text-center animate-fade-in max-w-2xl px-4 relative z-10">
        <p className="text-md text-zinc-500 leading-relaxed mb-6">
          {personalInfo.bio}
        </p>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button 
            size="lg" 
            className="gap-2 min-w-[160px] bg-sky-400 text-black hover:bg-sky-500 transition-colors rounded-full shadow-lg shadow-sky-400/30"
            asChild
          >
            <a href="/contact">
              <Mail className="w-4 h-4" />
              Me contacter
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="gap-2 min-w-[160px] bg-transparent border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors rounded-full"
            asChild
          >
            <a href={personalInfo.resume} target="_blank" rel="noopener noreferrer">
              <Download className="w-4 h-4" />
              Télécharger CV
            </a>
          </Button>
        </div>

        {/* Liens sociaux */}
        <div className="flex justify-center gap-6">
          <a 
            href={socialLinks.github} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-zinc-500 hover:text-zinc-300 transition-colors duration-300"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          
          <a 
            href={socialLinks.linkedin} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-zinc-500 hover:text-zinc-300 transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          
          <a 
            href={socialLinks.instagram} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-zinc-500 hover:text-zinc-300 transition-colors duration-300"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 border-2 border-zinc-600 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-zinc-500 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
} 