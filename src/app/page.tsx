import { 
  HeroSection, 
  AboutSection,
  ProjectsSection,
  ContactSection 
} from '@/components';

// Configuration ISR - revalidation toutes les 24h selon les préférences de l'utilisateur
export const revalidate = 86400;

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </main>
  );
}
