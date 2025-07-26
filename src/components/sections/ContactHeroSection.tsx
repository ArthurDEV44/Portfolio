import { personalInfo } from '@/data/portfolio';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactHeroSection() {
  return (
    <section className="relative px-4 bg-gradient-to-b from-black via-zinc-900/20 to-black pt-40">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Main Title */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-fade-in">
          Contactez-moi
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed animate-fade-in">
          Vous avez un projet ambitieux ? Une idée innovante ? 
          Je suis là pour vous accompagner dans la réalisation de votre vision digitale. 
          Discutons ensemble de vos objectifs et trouvons la solution technique parfaite.
        </p>
      </div>
    </section>
  );
} 