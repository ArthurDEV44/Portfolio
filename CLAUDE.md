# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commandes de développement

```bash
bun dev        # Serveur de développement (http://localhost:3000)
bun build      # Build de production
bun start      # Serveur de production
bun lint       # oxlint + vérification du formatage (oxfmt --check)
bun format     # Formatage du code avec oxfmt
```

## Stack technique

- **Framework**: Next.js 16 (App Router)
- **Styling**: TailwindCSS 4 avec tw-animate-css
- **UI**: Base UI Components, Lucide React (icônes)
- **Utilitaires**: clsx + tailwind-merge (fonction `cn` dans `src/lib/utils.ts`)
- **Linter**: oxlint (`.oxlintrc.json`)
- **Formatter**: oxfmt (`.oxfmtrc.json`), tri des imports et des classes Tailwind inclus
- **Package Manager**: bun

## Architecture

### Structure des imports

L'alias `@/*` pointe vers `./src/*`. Tous les composants de sections sont exportés centralement depuis `src/components/index.ts`.

### Flux de données

- **Configuration centralisée**: `src/lib/site.config.ts` contient toutes les données du site (infos personnelles, compétences, liens)
- **ISR**: Page principale avec revalidation toutes les 24h (`revalidate = 86400`)
- **SEO**: Métadonnées et JSON-LD (Person, WebSite, ProfessionalService) générés dans `src/app/page.tsx`

### Composants

- **Sections** (`src/components/sections/`): Composants de page autonomes (Hero, About, Skills, Expertise, Contact, Footer)
- **UI** (`src/components/ui/`): Composants réutilisables (Button avec class-variance-authority)
- **Hooks** (`src/hooks/`): `useIntersectionObserver` pour les animations au scroll (ajoute classe `is-visible`)

### Animations

Les animations au scroll utilisent `useIntersectionObserver` avec la classe CSS `.animate-on-scroll`. Les styles d'animation sont définis dans `src/app/globals.css`.

## Conventions Oxc

- Indentation: 2 espaces, `printWidth` 80
- Tri automatique des imports, des classes Tailwind et des champs de `package.json` (oxfmt)
- Plugins oxlint activés: `eslint`, `typescript`, `oxc`, `import`, `react`, `nextjs`, `jsx-a11y`, `vitest`
- Catégories: `correctness` et `suspicious` en erreur, `perf` en avertissement
- Suppression locale: `// oxlint-disable-next-line <rule> -- raison`
- Markdown et MDX ne sont pas formatés (exclus dans `.oxfmtrc.json`)

## Anti-Friction Rules (claude-doctor)

Règles pour éviter les patterns de friction détectés par `claude-doctor` sur ce projet : edit-thrashing, restart-cluster, repeated-instructions, negative-drift, error-loop, excessive-exploration.

### Editing discipline (anti edit-thrashing)

- Read the full file before editing. Plan all changes, then make ONE complete edit.
- If you've edited the same file 3+ times, STOP. Re-read the user's original requirements and re-plan from scratch.
- Prefer one large coherent edit over multiple small incremental ones.

### Stay aligned with the user (anti repeated-instructions, rapid-corrections)

- Re-read the user's last message before responding. Follow through on every instruction completely — don't partially address requests.
- Every few turns on a long task, re-read the original request to verify you haven't drifted from the goal.
- When the user corrects you: stop, re-read their message, quote back what they actually asked for, and confirm understanding before proceeding.

### Act, don't explore (anti excessive-exploration)

- Don't read more than 3-5 files before making a change. Get a basic understanding, make the change, then iterate.
- Prefer acting early and correcting via feedback over prolonged reading and planning.

### Break loops (anti error-loop, restart-cluster)

- After 2 consecutive tool failures or the same error twice, STOP. Change your approach entirely — don't retry the same strategy. Explain what failed and try something genuinely different.
- When truly stuck, summarize what you've tried and ask the user for guidance rather than retrying.

### Verify output (anti negative-drift)

- Before presenting your result, double-check it actually addresses what the user asked for.
- If the diff doesn't map cleanly to the user's request, don't ship it — re-plan.
