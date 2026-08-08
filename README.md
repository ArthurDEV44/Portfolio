# Portfolio - Arthur Jean

Portfolio personnel d'Arthur Jean, développeur Full Stack & Architecte IA spécialisé en Next.js, Rust, Electron et systèmes d'agents IA.

## 🚀 Technologies

- **Framework**: Next.js 16 (App Router)
- **Styling**: TailwindCSS 4 avec tw-animate-css
- **UI**: Base UI Components, Lucide React (icônes)
- **Animations**: motion/react (tree-shakeable)
- **Linter**: oxlint (Oxc)
- **Formatter**: oxfmt (Oxc), tri des imports et classes Tailwind inclus
- **Tests**: Vitest
- **CI**: GitHub Actions
- **Package Manager**: bun

## 📋 Structure du projet

```
portfolio/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Layout principal avec fonts
│   │   ├── page.tsx                # Page d'accueil avec SEO et JSON-LD
│   │   └── globals.css             # Styles globaux et animations
│   ├── components/
│   │   ├── sections/
│   │   │   ├── NavbarSection.tsx    # Navigation
│   │   │   ├── HeroSection.tsx      # Hero avec description
│   │   │   ├── ProjectsSection.tsx  # Projets et réalisations
│   │   │   ├── ClientsSection.tsx   # Clients et partenaires
│   │   │   ├── ValueSection.tsx     # Proposition de valeur
│   │   │   ├── JourneySection.tsx   # Parcours professionnel
│   │   │   ├── FaqSection.tsx       # FAQ avec JSON-LD FAQPage
│   │   │   └── FooterSection.tsx    # Footer
│   │   ├── ui/
│   │   │   ├── button.tsx           # Button avec class-variance-authority
│   │   │   ├── glass-card.tsx       # Carte effet glass
│   │   │   ├── mesh-gradient.tsx    # Gradient mesh animé
│   │   │   ├── spinner.tsx          # Spinner de chargement
│   │   │   └── ThemeToggle.tsx      # Toggle dark/light mode
│   │   └── index.ts                # Export centralisé
│   ├── hooks/
│   │   ├── useReducedMotion.ts     # Détection prefers-reduced-motion
│   │   └── useTheme.tsx            # Gestion du thème dark/light
│   └── lib/
│       ├── site.config.ts          # Configuration du site (données)
│       ├── json-ld.ts              # Génération JSON-LD (Person, WebSite, ProfessionalService, FAQPage)
│       ├── animation-variants.ts   # Variantes d'animation centralisées
│       ├── gradient.ts             # Implémentation WebGL gradient
│       ├── design-tokens.ts        # Tokens de design
│       └── utils.ts                # Utilitaires (cn)
├── suppress-baseline-warning.cjs   # Supprime le warning [baseline-browser-mapping] de Next.js pendant le build
├── vitest.config.ts                # Configuration Vitest
├── .oxlintrc.json                  # Configuration oxlint
├── .oxfmtrc.json                   # Configuration oxfmt
└── .github/workflows/ci.yml       # Pipeline CI (typecheck, lint, test, build)
```

## 📦 Installation

```bash
# Installer les dépendances
bun install

# Lancer le serveur de développement
bun dev

# Build de production
bun run build

# Démarrer le serveur de production
bun start
```

## 🔧 Commandes de qualité

```bash
bun typecheck  # Vérification des types TypeScript
bun lint       # oxlint + vérification du formatage (oxfmt --check)
bun test       # Tests unitaires avec Vitest
bun format     # Formatage du code avec oxfmt
```

## 🎯 Fonctionnalités

- ✅ ISR avec revalidation toutes les 24h
- ✅ Métadonnées SEO complètes (Open Graph, Twitter)
- ✅ Données structurées JSON-LD (Person, WebSite, ProfessionalService, FAQPage)
- ✅ Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- ✅ Design responsive (mobile-first)
- ✅ Animations avec motion/react et reduced-motion support
- ✅ Dark mode avec toggle
- ✅ Accessibilité (ARIA labels, semantic HTML)
- ✅ CI pipeline (GitHub Actions : typecheck + lint + test + build)
- ✅ Route llms.txt pour les moteurs de recherche IA

## 📱 Sections

1. **Navbar**: Navigation principale avec toggle de thème
2. **Hero**: Présentation avec description professionnelle et CTA
3. **Projects**: Projets et réalisations
4. **Clients**: Clients et partenaires
5. **Value**: Proposition de valeur et approche
6. **Journey**: Parcours professionnel
7. **FAQ**: Questions fréquentes (avec schema FAQPage)
8. **Footer**: Liens et informations

## 🔧 Configuration

Personnalisez le portfolio en modifiant `src/lib/site.config.ts` :

```typescript
export const siteConfig = {
  name: "Votre Nom",
  title: "Votre Titre",
  description: "Votre Description",
  url: "https://votre-site.com",
  links: {
    email: "votre@email.com",
    linkedin: "https://linkedin.com/in/votre-profil",
    github: "https://github.com/votre-profil",
    cal: "https://cal.com/votre-profil",
  },
};
```

## 🎨 Personnalisation

### Modifier les compétences

Éditez `src/lib/site.config.ts` et modifiez les tableaux :
- `mainStack`: Stack principale
- `secondaryStack`: Stack secondaire
- `devTools`: Outils de développement
- `aiSkills`: Compétences IA
- `workflowSkills`: Compétences workflow

### Ajouter une section

1. Créer un nouveau composant dans `src/components/sections/`
2. L'exporter dans `src/components/index.ts`
3. L'importer et l'utiliser dans `src/app/page.tsx`

## 📄 Licence

Ce projet est privé et personnel.

## 👤 Auteur

**Arthur Jean**
- LinkedIn: [Arthur Jean](https://www.linkedin.com/in/arthur-jean-401b56239/)
- Email: contact@arthurjean.dev
- Cal.com: [Réserver un appel](https://cal.com/arthurjean/30min)

---

Développé avec ❤️ en Next.js et TailwindCSS
