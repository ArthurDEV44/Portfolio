import { ArrowRight, Cpu, Mail, RefreshCcw, ChartLine, Server, PenTool, Box, Rocket } from "lucide-react";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  price: string;
  description: string;
  isSpecial?: boolean;
}

const ServiceCard = ({ 
  icon, 
  title, 
  price, 
  description, 
  isSpecial = false 
}: ServiceCardProps) => (
  <div className="bg-zinc-800/30 backdrop-blur-md border border-zinc-700/50 hover:border-cyan-500/50 rounded-xl p-4 sm:p-6 text-center group transition-all duration-300 hover:bg-zinc-800/50">
    <div className="mb-3 sm:mb-4">
      {icon}
    </div>
    <h3 className="font-semibold text-white mb-2 sm:mb-3 text-sm sm:text-base">{title}</h3>
    {isSpecial ? (
      <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-sky-500/20 to-blue-500/20 rounded-full border border-sky-500/30">
        <span className="text-sky-300 font-jetbrains text-xs sm:text-sm">{price}</span>
      </div>
    ) : (
      <>
        <p className="text-sky-300 font-jetbrains font-bold text-base sm:text-lg mb-1 sm:mb-2">{price}</p>
        <p className="text-xs text-gray-400 leading-relaxed">{description}</p>
      </>
    )}
  </div>
);

export default function TarifsServicesSection() {
  const services = [
    {
      icon: (
        <RefreshCcw className="w-8 h-8 text-cyan-400 mx-auto" />
      ),
      title: "DevOps & Maintenance",
      price: "à partir de 50 €/mois",
      description: "CI/CD • Monitoring • Updates"
    },
    {
      icon: (
        <Server className="w-8 h-8 text-purple-400 mx-auto" />
      ),
      title: "Cloud & Infrastructure",
      price: "50 à 200 €/an",
      description: "AWS • Vercel • CDN • SSL"
    },
    {
      icon: (
        <PenTool className="w-8 h-8 text-teal-400 mx-auto" />
      ),
      title: "Content & Copywriting",
      price: "sur devis",
      description: "SEO • UX Writing • Stratégie"
    },
    {
      icon: (
        <Box className="w-8 h-8 text-indigo-400 mx-auto" />
      ),
      title: "Modules Custom",
      price: "tarif sur mesure",
      description: "API • Intégrations • Automations"
    },
    {
      icon: (
        <Rocket className="w-8 h-8 text-cyan-400 mx-auto" />
      ),
      title: "Consultation Technique",
      price: "Devis gratuit",
      description: "",
      isSpecial: true
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12 lg:mb-16">
      <div className="bg-gradient-to-br from-zinc-900 via-slate-900 to-black rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border border-cyan-500/20 overflow-hidden relative z-10">
        <div className="text-center mb-8 sm:mb-10 lg:mb-12 relative z-10">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Services DevOps & Tech
            </h2>
          </div>
          <p className="text-gray-300 text-sm sm:text-base lg:text-lg max-w-xl lg:max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Solutions techniques avancées pour optimiser et maintenir votre écosystème digital
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10 mb-8 sm:mb-10 lg:mb-12">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center relative z-10">
          <a href="/contact" className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all duration-300 group text-sm sm:text-base">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
            <span>Discutons de votre projet</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform flex-shrink-0" />
          </a>
        </div>
      </div>
    </section>
  );
}
