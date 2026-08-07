import Image from "next/image";
import { siteConfig } from "@/lib/site.config";

export function HeroSection() {
  return (
    <section id="hero" aria-labelledby="hero-heading">
      <div className="flex items-start justify-start gap-4 border-y border-dashed border-grid-soft px-4 py-4">
        <div className="relative size-15 shrink-0">
          <Image
            src={siteConfig.profileImage}
            alt={siteConfig.profileImageAlt}
            fill
            sizes="60px"
            className="select-none rounded-full object-cover"
            priority
          />
        </div>

        <div className="min-w-0">
          <h1
            id="hero-heading"
            className="font-serif text-3xl leading-normal text-foreground"
          >
            {siteConfig.pitch}
          </h1>
          <div className="mt-2 text-sm text-muted-foreground">
            {siteConfig.role}
          </div>
        </div>
      </div>
    </section>
  );
}
