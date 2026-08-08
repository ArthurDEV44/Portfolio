import Image from "next/image";

import { siteConfig } from "@/lib/site.config";

export function HeroSection() {
  return (
    <section id="hero" aria-labelledby="hero-heading">
      <div className="border-grid-soft flex items-start justify-start gap-4 border-y border-dashed px-4 py-4">
        <div className="relative size-15 shrink-0">
          <Image
            src={siteConfig.profileImage}
            alt={siteConfig.profileImageAlt}
            fill
            sizes="60px"
            className="rounded-full object-cover select-none"
            priority
          />
        </div>

        <div className="min-w-0">
          <h1
            id="hero-heading"
            className="text-foreground font-serif text-3xl leading-normal"
          >
            {siteConfig.pitch}
          </h1>
          <div className="text-muted-foreground mt-2 text-sm">
            {siteConfig.role}
          </div>
        </div>
      </div>
    </section>
  );
}
