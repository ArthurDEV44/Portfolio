'use client';

import { personalInfo, socialLinks } from '@/data/portfolio';
import { Mail, Phone, MapPin, Github, Linkedin, ExternalLink, Instagram } from 'lucide-react';

export default function ContactSection() {
  const contactMethods = [
    {
      icon: Mail,
      label: 'Email',
      value: personalInfo.email,
      action: `mailto:${personalInfo.email}`,
      description: 'Réponse sous 24h'
    },
    {
      icon: Phone,
      label: 'Téléphone',
      value: personalInfo.phone,
      action: `tel:${personalInfo.phone}`,
      description: 'Appelez-moi directement'
    },
    {
      icon: MapPin,
      label: 'Localisation',
      value: personalInfo.location,
      action: null,
      description: 'Disponible en full remote'
    }
  ];

  const socialPlatforms = [
    {
      icon: Github,
      label: 'GitHub',
      url: socialLinks.github,
      description: 'Mes projets open source',
      username: '@ArthurDEV44'
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      url: socialLinks.linkedin,
      description: 'Réseau professionnel',
      username: 'Arthur Jean'
    },
    {
      icon: Instagram,
      label: 'Instagram',
      url: socialLinks.instagram,
      description: 'Contact direct',
      username: '@_arthurj_'
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-black via-zinc-900/20 to-black min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block bg-zinc-900/50 backdrop-blur-md rounded-full border border-zinc-700/50 px-4 py-2 mb-6">
            <span className="text-zinc-400 text-sm font-medium">Contact</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Travaillons ensemble
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Vous avez un projet en tête ? Une question technique ? 
            N&apos;hésitez pas à me contacter, je serais ravi d&apos;échanger avec vous.
          </p>
        </div>

        <div className="space-y-12 animate-fade-in">
          {/* Moyens de contact */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white text-center">Moyens de contact</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {contactMethods.map((method, index) => (
                <div 
                  key={index} 
                  className="bg-zinc-900/30 backdrop-blur-md rounded-xl border border-zinc-700/50 p-6 hover:bg-zinc-800/30 transition-all duration-300 text-center"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 bg-sky-400/10 rounded-lg flex items-center justify-center">
                      <method.icon className="w-6 h-6 text-sky-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-2">{method.label}</h4>
                      {method.action ? (
                        <a 
                          href={method.action}
                          className="text-sky-400 hover:text-sky-300 transition-colors font-mono text-sm break-all"
                        >
                          {method.value}
                        </a>
                      ) : (
                        <p className="text-zinc-300 text-sm">{method.value}</p>
                      )}
                      <p className="text-xs text-zinc-500 mt-2">
                        {method.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-xl font-semibold mb-6 text-white text-center">Suivez-moi</h3>
            <div className="grid md:grid-cols-3 gap-6">
              {socialPlatforms.map((platform, index) => (
                <div 
                  key={index} 
                  className="bg-zinc-900/30 backdrop-blur-md rounded-xl border border-zinc-700/50 hover:bg-zinc-800/30 transition-all duration-300 group overflow-hidden"
                >
                  <a 
                    href={platform.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-4 p-6 text-center"
                  >
                    <div className="w-12 h-12 bg-sky-400/10 rounded-lg flex items-center justify-center group-hover:bg-sky-400/20 transition-all duration-300">
                      <platform.icon className="w-6 h-6 text-sky-400" />
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <h4 className="font-medium text-white group-hover:text-sky-300 transition-colors">
                          {platform.label}
                        </h4>
                        <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-sky-400 transition-colors" />
                      </div>
                      <p className="text-zinc-400 text-sm font-mono">
                        {platform.username}
                      </p>
                      <p className="text-xs text-zinc-500 mt-1">
                        {platform.description}
                      </p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 