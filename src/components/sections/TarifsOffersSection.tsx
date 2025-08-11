import { Clock, Cpu } from "lucide-react";

// Composant pour les dividers tech entre les offres
const TechDivider = () => (
  <div className="flex justify-center items-center mb-8 sm:mb-12 lg:mb-16">
    <div className="flex items-center">
      <div className="w-8 sm:w-12 lg:w-16 h-px bg-gradient-to-r from-transparent to-sky-500"></div>
      <div className="w-8 sm:w-12 lg:w-16 h-px bg-gradient-to-l from-transparent to-sky-500"></div>
    </div>
  </div>
);

// Composant pour une offre individuelle
interface OfferCardProps {
  title: string;
  colorTitle: string;
  colorDescription: string;
  description: string;
  headerGradient: string;
  iconColor: string;
  features: string[];
  deliveryTime: string;
  priceRange: string;
  priceSubtext: string;
  isPremium?: boolean;
}

const OfferCard = ({ 
  title, 
  colorTitle,
  colorDescription,
  description, 
  headerGradient, 
  iconColor, 
  features, 
  deliveryTime, 
  priceRange, 
  priceSubtext, 
  isPremium = false 
}: OfferCardProps) => {
  // Mapping des couleurs pour éviter les classes dynamiques
  const getColors = (color: string) => {
    const colorMap: Record<string, any> = {
      cyan: {
        iconText: 'text-cyan-400',
        descriptionText: 'text-cyan-200',
        cardBorder: 'border-cyan-500/20',
        dot: 'bg-cyan-400',
        dotHover: 'group-hover:bg-blue-400',
        sectionBg: 'bg-cyan-500/10',
        sectionBorder: 'border-cyan-500/20',
        sectionText: 'text-cyan-300',
        overlayFrom: 'from-cyan-500/10',
        overlayTo: 'to-blue-500/10'
      },
      purple: {
        iconText: 'text-purple-400',
        descriptionText: 'text-purple-200',
        cardBorder: 'border-purple-500/20',
        dot: 'bg-purple-400',
        dotHover: 'group-hover:bg-indigo-400',
        sectionBg: 'bg-purple-500/10',
        sectionBorder: 'border-purple-500/20',
        sectionText: 'text-purple-300',
        overlayFrom: 'from-purple-500/10',
        overlayTo: 'to-indigo-500/10'
      },
      violet: {
        iconText: 'text-violet-400',
        descriptionText: 'text-violet-200',
        cardBorder: 'border-violet-500/20',
        dot: 'bg-violet-400',
        dotHover: 'group-hover:bg-purple-400',
        sectionBg: 'bg-violet-500/10',
        sectionBorder: 'border-violet-500/20',
        sectionText: 'text-violet-300',
        overlayFrom: 'from-violet-500/10',
        overlayTo: 'to-purple-500/10'
      },
      emerald: {
        iconText: 'text-emerald-400',
        descriptionText: 'text-emerald-200',
        cardBorder: 'border-emerald-500/20',
        dot: 'bg-emerald-400',
        dotHover: 'group-hover:bg-green-400',
        sectionBg: 'bg-emerald-500/10',
        sectionBorder: 'border-emerald-500/20',
        sectionText: 'text-emerald-300',
        overlayFrom: 'from-emerald-500/10',
        overlayTo: 'to-green-500/10'
      },
      orange: {
        iconText: 'text-orange-400',
        descriptionText: 'text-orange-200',
        cardBorder: 'border-orange-500/20',
        dot: 'bg-orange-400',
        dotHover: 'group-hover:bg-red-400',
        sectionBg: 'bg-orange-500/10',
        sectionBorder: 'border-orange-500/20',
        sectionText: 'text-orange-300',
        overlayFrom: 'from-orange-500/10',
        overlayTo: 'to-red-500/10'
      },
      indigo: {
        iconText: 'text-indigo-400',
        descriptionText: 'text-indigo-200',
        cardBorder: 'border-indigo-500/20',
        dot: 'bg-indigo-400',
        dotHover: 'group-hover:bg-blue-400',
        sectionBg: 'bg-indigo-500/10',
        sectionBorder: 'border-indigo-500/20',
        sectionText: 'text-indigo-300',
        overlayFrom: 'from-indigo-500/10',
        overlayTo: 'to-blue-500/10'
      }
    };
    return colorMap[color] || colorMap.cyan;
  };

  const colors = getColors(iconColor);

  return (
    <div className="mb-8 sm:mb-12 lg:mb-16">
      <div className={`bg-zinc-900/50 backdrop-blur-md rounded-xl sm:rounded-2xl overflow-hidden border border-zinc-700/50 transition-all duration-300 relative mx-4 sm:mx-0`}>
        <div className={`${headerGradient} p-4 sm:p-6 lg:p-8 relative overflow-hidden`}>
          <div className={`absolute inset-0 bg-gradient-to-r ${colors.overlayFrom} ${colors.overlayTo} opacity-50`}></div>
          <div className="relative z-10">
            <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold ${colorTitle} mb-3 sm:mb-4`}>{title}</h2>
            <p className={`text-base sm:text-lg lg:text-xl ${colorDescription}`}>{description}</p>
          </div>
        </div>
        
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="order-2 lg:order-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4 sm:mb-6 flex items-center flex-wrap">
                <Cpu className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.iconText} mr-2 sm:mr-3 flex-shrink-0`} />
                <span className="leading-tight">
                  {title.includes('Marketplace') ? 'Écosystème multi-vendeurs' :
                   title.includes('SaaS Starter') ? 'Architecture SaaS modulaire' :
                   title.includes('SaaS Premium') ? 'Plateforme SaaS Enterprise' :
                   title.includes('Starter') ? 'Stack technique inclus' : 
                   title.includes('Premium') ? 'Architecture avancée' :
                   title.includes('Refonte') ? 'Optimisation e-commerce' : 'Solution Enterprise'}
                </span>
              </h3>
              <ul className="space-y-3 sm:space-y-4 text-gray-300">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start group">
                    <div className={`w-2 h-2 ${colors.dot} rounded-full mr-3 ${colors.dotHover} transition-colors flex-shrink-0 mt-2`}></div>
                    <span className="text-sm sm:text-base leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className={`order-1 lg:order-2 text-center bg-zinc-800/50 rounded-xl p-4 sm:p-6 border ${colors.cardBorder}`}>
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.iconText} mr-2 flex-shrink-0`} />
                  <p className="text-gray-300 font-mono text-sm sm:text-base">Délais de livraison</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white">{deliveryTime}</p>
              </div>
              <div className="border-t border-gray-700 pt-4 sm:pt-6">
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-sky-300 mb-2 leading-tight font-jetbrains">{priceRange}</p>
                <p className="text-xs sm:text-sm text-gray-400 font-jetbrains mb-3 sm:mb-4">{priceSubtext}</p>
                <div className={`p-2 sm:p-3 ${colors.sectionBg} rounded-lg border ${colors.sectionBorder}`}>
                  <p className={`text-xs ${colors.sectionText} font-mono leading-relaxed`}>Devis personnalisé selon vos besoins</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TarifsOffersSection() {
  const offers = [
    {
      title: "Vitrine Starter",
      colorTitle: "text-white",
      colorDescription: "text-zinc-400",
      description: "Solution rapide pour une présence web professionnelle",
      headerGradient: "bg-gradient-to-br from-black to-sky-600/40",
      iconColor: "cyan",
      features: [
        "Jusqu'à 5 pages responsive (React/Next.js)",
        "Design system personnalisé",
        "Mobile-first & PWA ready",
        "Formulaires avec validation",
        "SEO technique & métadonnées",
        "Intégrations sociales"
      ],
      deliveryTime: "1-2 semaines",
      priceRange: "800 € – 1 200 €",
      priceSubtext: "Hors taxes"
    },
    {
      title: "Vitrine Premium",
      colorTitle: "text-white",
      colorDescription: "text-zinc-400",
      description: "Identité digitale unique avec écosystème complet",
      headerGradient: "bg-gradient-to-br from-black to-purple-600/40",
      iconColor: "purple",
      features: [
        "Jusqu'à 15 pages avec architecture modulaire",
        "Design system & maquettes UI/UX",
        "Module de devis interactif",
        "CMS headless & blog intégré",
        "SEO technique & Core Web Vitals",
        "Analytics & tracking avancés"
      ],
      deliveryTime: "3-5 semaines",
      priceRange: "2 500 € – 4 500 €",
      priceSubtext: "Hors taxes"
    },
    {
      title: "E-commerce Refonte",
      colorTitle: "text-white",
      colorDescription: "text-zinc-400",
      description: "Transformation digitale pour maximiser les conversions",
      headerGradient: "bg-gradient-to-br from-black to-sky-600/40",
      iconColor: "cyan",
      features: [
        "Migration moderne",
        "Refonte UI/UX & design system",
        "Tunnel de vente optimisé & A/B testing",
        "Paiements sécurisés avec Stripe",
        "Gestion catalogue jusqu'à 50 produits"
      ],
      deliveryTime: "2-4 semaines",
      priceRange: "2 000 € – 4 000 €",
      priceSubtext: "Hors taxes"
    },
    {
      title: "E-commerce Premium",
      colorTitle: "text-white",
      colorDescription: "text-zinc-400",
      description: "Écosystème digital complet pour la croissance",
      headerGradient: "bg-gradient-to-br from-black to-violet-600/40",
      iconColor: "violet",
      features: [
        "Catalogue produits illimité & scalable",
        "Design system sur mesure & brand identity",
        "Intégrations CRM/ERP & API custom",
        "Multi-langues, devises & marchés",
        "Assistance IA",
        "Sécurité enterprise & RGPD"
      ],
      deliveryTime: "5-10 semaines",
      priceRange: "5 000 € – 12 000 €",
      priceSubtext: "Hors taxes",
      isPremium: true
    },
    {
      title: "SaaS Starter",
      colorTitle: "text-white",
      colorDescription: "text-zinc-400",
      description: "Application SaaS moderne avec fonctionnalités essentielles",
      headerGradient: "bg-gradient-to-br from-black to-sky-600/40",
      iconColor: "cyan",
      features: [
        "Architecture multi-tenant sécurisée",
        "Authentification & gestion des utilisateurs",
        "Dashboard administrateur intuitif",
        "API REST documentée & intégrations",
        "Système de paiements récurrents (Stripe)",
        "Analytics utilisateurs & performance"
      ],
      deliveryTime: "4-6 semaines",
      priceRange: "3 000 € – 5 500 €",
      priceSubtext: "Hors taxes"
    },
    {
      title: "SaaS Premium",
      colorTitle: "text-white",
      colorDescription: "text-zinc-400",
      description: "Plateforme SaaS enterprise avec intelligence artificielle",
      headerGradient: "bg-gradient-to-br from-black to-violet-600/40",
      iconColor: "violet",
      features: [
        "Architecture microservices scalable",
        "IA intégrée & machine learning",
        "White-label & multi-domaines",
        "Intégrations enterprise (SSO, LDAP)",
        "Analytics avancés"
      ],
      deliveryTime: "8-12 semaines",
      priceRange: "8 000 € – 18 000 €",
      priceSubtext: "Hors taxes",
      isPremium: true
    },
    {
      title: "Marketplace",
      colorTitle: "text-white",
      colorDescription: "text-zinc-400",
      description: "Plateforme multi-vendeurs avec gestion des commissions et des produits",
      headerGradient: "bg-gradient-to-br from-black to-sky-600/40",
      iconColor: "cyan",
      features: [
        "Gestion multi-vendeurs & onboarding",
        "Système de commissions automatisé",
        "Dashboard vendeur & acheteur séparés",
        "Modération produits & système d'avis",
        "Paiements escrow & dispute management",
        "Analytics marketplace & reporting financier"
      ],
      deliveryTime: "6-10 semaines",
      priceRange: "6 000 € – 14 000 €",
      priceSubtext: "Hors taxes",
      isPremium: true
    }
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 lg:pb-16 relative z-10 mt-8 sm:mt-12 lg:mt-16">
      {offers.map((offer, index) => (
        <div key={index}>
          <OfferCard {...offer} />
          {index < offers.length - 1 && <TechDivider />}
        </div>
      ))}
    </section>
  );
}
