[PRD]
# PRD: Blog MDX du portfolio

## Changelog

| Version | Date | Author | Summary |
|---------|------|--------|---------|
| 1.0 | 2026-08-08 | Arthur Jean | Rédaction initiale, direction de mise en page B validée |
| 1.1 | 2026-08-08 | Arthur Jean | Retrait de l'epic de contenu d'amorçage : la rédaction éditoriale est hors périmètre. Vérification visuelle reportée sur un fichier de fixture en brouillon, routable en développement |
| 1.2 | 2026-08-08 | Arthur Jean | US-007 : la surcharge `table` devient un composant `Table`. Sans `remark-gfm`, que C6 et FR-13 interdisent, aucune construction Markdown ne produit de nœud `table`, et un `<table>` écrit à la main compile en balise littérale qui ne traverse pas la table des composants. Seul un nom capitalisé y est résolu, ce qui permet de fournir le conteneur de défilement au lieu d'exiger de l'auteur des rôles ARIA sur chaque tableau |

## Problem Statement

1. Le portfolio n'a aucune surface éditoriale. `src/app/page.tsx` et les trois pages légales sont les seules routes indexables, et `src/app/sitemap.ts:5` ne déclare que l'URL racine. Le site affirme une expertise (Paneflow, Pyxis, workflows d'agents) sans jamais la démontrer sur pièces.
2. Le canal de distribution habituel se ferme. Pew Research (mars 2025, 68 879 recherches réelles) mesure un taux de clic passant de 15 % à 8 % en présence d'un AI Overview ; Ahrefs (300 000 mots-clés, maj décembre 2025) mesure une baisse de 34,5 % du CTR en position 1. Une page de présentation statique ne produit ni citation par les moteurs de réponse, ni abonnement, ni matière à partager.
3. Il n'existe aucun artefact réutilisable pour prouver une compétence technique dans une conversation commerciale ou un échange public. Chaque explication doit être réécrite depuis zéro.
4. Le pipeline de contenu du repo est à moitié construit et non exploité : `@next/mdx` 16.3 est installé et configuré, `src/mdx-components.tsx` existe mais est un pass-through vide, `@tailwindcss/typography` est chargé sans être utilisé. Une capacité déjà payée en dépendances ne rend aucun service.

**Why now:** les trois briques les plus coûteuses sont déjà en place (MDX configuré, `GridShell` comme coquille de mise en page, système de tokens OKLCH avec thème clair et sombre). Le coût marginal d'une surface éditoriale est aujourd'hui à son minimum. Par ailleurs, la bascule du trafic search vers la citation par moteurs de réponse est mesurée, pas anticipée : la politique de crawl du site (`src/app/robots.txt/route.ts`) autorise déjà `Claude-User`, `Claude-SearchBot` et `OAI-SearchBot`, mais ces agents n'ont aucun contenu de fond à citer.

## Overview

Le blog est construit sans couche de contenu. `@next/mdx` compile les fichiers `.mdx`, un import dynamique dans `app/blog/[slug]/page.tsx` les résout, `generateStaticParams` les prérend et `dynamicParams = false` renvoie un 404 hors liste. Les métadonnées passent par un `export const meta` typé dans chaque fichier MDX, pas par du frontmatter YAML. Velite, Content Collections, Contentlayer, Fumadocs et les CMS externes ont été écartés : ils ajouteraient un second pipeline sur un pipeline fonctionnel, et les CMS externes détruiraient l'édition par agent et le versioning git qui font la cohérence du reste du site.

La coloration syntaxique passe par Shiki appelé directement en React Server Component depuis les surcharges `pre` et `code` de `src/mdx-components.tsx`. Ce choix contourne une contrainte dure et vérifiée : `node_modules/@next/mdx/index.js` enregistre une règle Turbopack dont les options de loader traversent la frontière JS/Rust, ce qui interdit toute option de type fonction dans un plugin rehype. En appelant Shiki depuis un composant serveur, les transformers, titres de blocs et surlignages de lignes redeviennent accessibles, `next.config.ts` reste intact, et le rendu se fait au build donc sans un octet de JavaScript client. Les thèmes double clair et sombre sortent en variables CSS `--shiki-light` et `--shiki-dark`, commutées sur le `@custom-variant dark` déjà déclaré en `src/app/globals.css:4`.

La table des matières et le temps de lecture sont dérivés du fichier MDX brut dans `src/lib/blog.ts` avec `node:fs`, sans aucun plugin remark. Une seule fonction `slugify` alimente à la fois les ancres générées par les surcharges de titres et les liens de la table des matières, ce qui rend `rehype-slug` inutile. Bilan des dépendances nouvelles : `shiki` seule.

La mise en page retenue est la direction B, "planche technique" : conteneur d'environ 1 000 px, colonne de texte à 610 px à gauche, rail persistant d'environ 220 px à droite portant les métadonnées, la table des matières avec suivi de section active et les notes latérales. La règle pointillée verticale qui sépare la colonne du rail est la signature structurelle : la trame du site y fait un travail réel au lieu de décorer. Le rail se supprime automatiquement sous un seuil de contenu, pour ne jamais devenir une décoration sans rôle.

## Goals

| Goal | Month-1 Target | Month-6 Target |
|------|---------------|----------------|
| Temps entre la création d'un fichier `.mdx` et sa mise en ligne | commit et push, aucune autre étape manuelle | idem |
| Dépendances de production ajoutées | 1 (`shiki`) | 1 |
| Score Lighthouse Accessibility sur une page d'article | 100 | 100 |
| Poids de JavaScript client ajouté par la coloration syntaxique | 0 KB | 0 KB |
| URLs d'articles présentes dans `sitemap.xml` et `/rss.xml` | 100 % des articles non brouillons | 100 % |
| Articles listés dans `/llms.txt` | 100 % des articles non brouillons | 100 % |

## Target Users

### Arthur Jean, auteur et unique mainteneur
- **Role:** solo indie maker, écrit et publie seul, sans relecteur ni chaîne de validation.
- **Behaviors:** travaille dans le repo depuis un terminal avec Claude Code, commit et push directement, déploie en continu. Écrit en anglais US, conformément à `siteConfig.language = "en"` et `siteConfig.locale = "en_US"`.
- **Pain points:** aucune surface pour publier une analyse technique. Toute plateforme externe implique un second endroit à maintenir, une authentification, et l'impossibilité de laisser un agent éditer le contenu.
- **Current workaround:** publication sur X, où le format plafonne la profondeur, où le contenu n'est pas indexable et où l'archive est illisible.
- **Success looks like:** créer un fichier `.mdx` dans `src/content/blog/`, écrire, commit. L'index, le flux, le sitemap, l'image OG et le JSON-LD se mettent à jour sans aucune autre intervention.

### Lecteur technique en évaluation
- **Role:** développeur, CTO ou client potentiel arrivé par un partage social, une citation dans une réponse d'IA, ou un lien direct.
- **Behaviors:** scanne d'abord, lit ensuite si la structure et la densité tiennent. Lit souvent en thème sombre. Copie les blocs de code.
- **Pain points:** les blogs techniques mélangent un habillage marketing et un fond faible ; les blocs de code sont mal mis en forme, non copiables, ou illisibles en thème sombre. Les articles longs n'offrent aucun moyen de se repérer.
- **Current workaround:** repart vers la documentation officielle ou un dépôt GitHub sans jamais évaluer l'auteur.
- **Success looks like:** repère la structure en moins de dix secondes via la table des matières du rail, lit un bloc de code correctement coloré dans son thème, et sait en quittant la page ce que l'auteur sait faire.

### Agent de recherche ou de citation
- **Role:** `Claude-User`, `Claude-SearchBot`, `OAI-SearchBot`, `PerplexityBot`, tous déjà autorisés par `src/app/robots.txt/route.ts`.
- **Behaviors:** récupère la page, extrait le texte principal, cherche l'auteur, la date et un titre exploitable.
- **Pain points:** balisage sémantique absent, dates uniquement présentes dans du JSON-LD sans équivalent visible, contenu principal noyé dans du décor.
- **Current workaround:** cite la documentation officielle plutôt qu'une source secondaire non identifiable.
- **Success looks like:** un `<article>` avec un ordre de titres correct, une date visible en clair, un `BlogPosting` cohérent avec l'entité `Person` existante, et un flux RSS énumérant tout.

## Research Findings

### Competitive Context
- **Velite** : maintenu et actif, mais son intégration officielle repose sur un `VeliteWebpackPlugin` incompatible Turbopack ; la documentation recommande d'appeler `velite build({ watch })` depuis `next.config` avec un garde d'exécution. Complexité non justifiée au volume visé.
- **Content Collections** : maintenu, mais exige un cast `as NextConfig` en Next 16 et sa compatibilité Turbopack n'est pas documentée de façon vérifiable.
- **Contentlayer et contentlayer2** : écartés. L'original est abandonné, le fork est en 0.5.8 avec un mainteneur unique et aucune publication depuis la sortie de Next 16.
- **next-mdx-remote** : écarté. Le dépôt `hashicorp/next-mdx-remote` est archivé depuis le 9 avril 2026. Le fork `next-mdx-remote-client` est vivant mais ne sert que pour du contenu distant, ce qui n'est pas le cas ici.
- **Fumadocs** : très actif, mais c'est un framework de documentation qui apporte sa propre couche UI et entrerait en collision avec `GridShell` et le système de tokens.
- **CMS externes** (Sanity, Payload, Contentful, Notion) : écartés. Service externe, clés API, coût récurrent, latence de build, et surtout perte de l'édition par agent et du versioning git.
- **Écart de marché visé :** un blog technique dont la mise en page est identifiable au premier écran, à l'inverse du gabarit `prose` centré que produit la quasi-totalité des blogs Next.js.

### Best Practices Applied
- Import dynamique MDX plus `generateStaticParams` : pattern documenté par la doc Next.js 16.2.9, pas un contournement.
- Shiki en React Server Component : usage documenté par Shiki pour Next.js, sans coût de bundle puisque le code n'exécute que côté serveur.
- Thèmes doubles Shiki par variables CSS avec `defaultColor: false` : permet de piloter la commutation depuis le sélecteur `.dark` existant plutôt que de dupliquer le rendu.
- `ImageResponse` de `next/og` : les exports `size`, `contentType` et `alt` plus le chargement de police par `readFile` sont le pattern documenté pour la version installée.
- Mesure de lecture entre 60 et 75 caractères : `docs/design.md` le prescrit, et `.legal-article` (`src/app/globals.css:260`) le matérialise déjà à 610 px.
- Politique de crawl asymétrique : autoriser les agents de recherche et de citation, refuser les agents d'entraînement pur. Déjà implémentée dans le repo.

### Constatations qui recadrent les attentes
- **`llms.txt` n'est consommé par personne.** John Mueller (Google), juin 2025 : "no AI system currently uses llms.txt". Mesuré : adoption multipliée par 8,8 mais 97 % des fichiers ne reçoivent aucune requête d'IA. Les articles y sont ajoutés par cohérence avec `src/lib/agent-markdown.ts`, sans attente de retour.
- **Les rich results se contractent.** Google a retiré 7 types en juin 2025 et les FAQ ont cessé de s'afficher le 7 mai 2026. `Article` et `BlogPosting` restent documentés sans avis de dépréciation, mais le `BlogPosting` est ajouté pour son coût marginal quasi nul, pas pour un gain attendu.
- **Les dates ne s'affichent pas par le seul balisage.** Google croise le JSON-LD, la date visible sur la page et ses signaux de crawl. La date doit donc apparaître en clair dans l'article.
- **Le trafic search n'est pas l'objectif.** Conséquence directe sur la priorisation : l'image OG par article et le flux RSS passent devant le JSON-LD, car le partage direct et les lecteurs de flux sont les canaux qui subsistent.

*Sources détaillées consignées dans l'historique de recherche de session : documentation Next.js 16.2.9 et Shiki via Context7, registre npm, Google Search Central, documentation crawlers Anthropic et OpenAI, Pew Research, Ahrefs, Seer Interactive.*

## Assumptions & Constraints

### Assumptions (to validate)
- **A1 (risque élevé) :** la forme des nœuds React passés à la surcharge `pre` permet d'extraire la chaîne de code brute de façon stable. Fondé sur le pattern communautaire standard, non vérifié sur `@next/mdx` 16.3 précisément. Validé par US-008.
- **A2 (risque moyen) :** Satori, moteur de `ImageResponse`, ne supporte ni CSS Grid ni Flexbox complet, ce qui interdit de transposer la trame pointillée telle quelle. Validé par US-013.
- **A3 (risque faible) :** Arthur écrira majoritairement des articles longs, au-delà de 1 500 mots, ce qui justifie le rail. Mitigé par le seuil automatique de US-010 plutôt que par une validation préalable.
- **A4 (risque faible) :** deux graisses de police suffisent pour l'image OG. Non validé jusqu'au premier rendu.

### Hard Constraints
- **C1 :** aucune modification de `next.config.ts`. La voie Shiki en composant serveur rend tout plugin rehype inutile, et la contrainte de sérialisation des options de loader Turbopack ne doit jamais être rencontrée.
- **C2 :** `--radius: 0` sur l'ensemble du système (`src/app/globals.css:43` et les quatre alias `--radius-*`). Angles droits sans exception, y compris sur les blocs de code.
- **C3 :** le mode grille est désactivable par l'utilisateur (`:root[data-grid="off"]`, `src/app/globals.css:114-116`, qui bascule `--grid-line` et `--grid-line-soft` à `transparent`). La hiérarchie de l'article doit tenir entièrement sans les règles pointillées, qui sont purement additives.
- **C4 :** pas de `prose` de `@tailwindcss/typography`. Le précédent long-form du repo est du CSS écrit à la main (`.legal-article`, `src/app/globals.css:260-312`). Deux systèmes de typographie long-form en parallèle sont interdits.
- **C5 :** WCAG 2.2 niveau AA, soit 4,5:1 minimum sur le texte courant, vérifié indépendamment en thème clair et en thème sombre. `docs/design.md` la rend normative.
- **C6 :** une seule dépendance de production ajoutée. `shiki`.
- **C7 :** blog entièrement statique. Aucun ISR, aucun rendu à la requête, aucune donnée externe au build.
- **C8 :** contenu rédigé en anglais US, conformément à `siteConfig.language` et `siteConfig.locale`.
- **C9 :** `docs/design.md` interdit la décoration sans rôle nommé. Le rail droit doit porter du contenu réel ou disparaître.

## Quality Gates

Ces commandes doivent passer pour chaque user story :
- `bun lint` - oxlint + oxfmt --check (linting, formatage, organisation des imports)
- `bun typecheck` - `tsc --noEmit`, aucune erreur de type
- `bun test` - suite vitest complète
- `bun build` - build de production, sortie sans erreur ni avertissement nouveau

Pour toute story touchant l'interface, vérification visuelle supplémentaire, conduite sur la fixture `src/content/blog/_kitchen-sink.mdx` définie en US-007 et servie par `bun dev` :
- Contrôler la page dans les deux thèmes (clair et sombre), via le `ThemeToggle` existant
- Contrôler la page avec le mode grille activé puis désactivé, via le `GridModeToggle` existant
- Contrôler la page à 1440 px, 1024 px, 768 px et 375 px de large
- Contrôler la page à 200 % de zoom navigateur sans débordement horizontal du `body`

## Epics & User Stories

### EP-001: Pipeline de contenu et registre d'articles

Poser la couche de données du blog : découverte des fichiers, métadonnées typées, métriques dérivées du fichier brut, et les deux routes statiques. À l'issue de cet epic, un article existe à une URL et apparaît dans un index, sans mise en forme travaillée.

**Definition of Done:** un fichier `.mdx` déposé dans `src/content/blog/` produit une page prérendue à `/blog/<slug>` et une entrée dans `/blog`, sans aucune inscription manuelle dans un registre. Un slug inconnu renvoie un 404.

#### US-001: Registre d'articles typé
**Description:** En tant qu'auteur, je veux que déposer un fichier `.mdx` dans `src/content/blog/` suffise à créer un article, afin de ne jamais maintenir de liste manuelle.

**Priority:** P0
**Size:** M (3 pts)
**Dependencies:** None

**Acceptance Criteria:**
- [ ] `src/lib/blog.ts` expose un type `PostMeta` avec les champs requis `title`, `description`, `publishedAt` (format ISO `YYYY-MM-DD`), et les champs optionnels `updatedAt`, `tags`, `draft`
- [ ] Étant donné plusieurs fichiers dans `src/content/blog/`, quand la liste des articles est demandée, alors elle est triée par `publishedAt` décroissant
- [ ] Le slug d'un article est dérivé du nom de fichier, sans extension, sans transformation supplémentaire
- [ ] Étant donné un article dont `meta.draft` vaut `true`, quand la liste publique est demandée, alors l'article en est exclu
- [ ] Une fonction distincte expose la liste incluant les brouillons, destinée au seul usage de développement
- [ ] Étant donné un fichier `.mdx` sans `export const meta`, quand `bun build` s'exécute, alors le build échoue avec un code de sortie non nul et un message nommant le fichier fautif
- [ ] Étant donné un `meta` dont `publishedAt` n'est pas au format `YYYY-MM-DD`, quand le registre est construit, alors une erreur explicite nomme le fichier et le champ
- [ ] Étant donné un répertoire `src/content/blog/` vide, quand le registre est construit, alors il renvoie un tableau vide sans lever d'exception
- [ ] Une fonction `slugify` exportée est l'unique source de génération d'ancres du projet, réutilisable par les surcharges de titres

#### US-002: Métriques dérivées du fichier brut
**Description:** En tant qu'auteur, je veux que le temps de lecture et la table des matières soient calculés automatiquement, afin de ne jamais les saisir à la main ni les laisser se désynchroniser du texte.

**Priority:** P0
**Size:** M (3 pts)
**Dependencies:** Blocked by US-001

**Acceptance Criteria:**
- [ ] `src/lib/blog.ts` lit le contenu brut du `.mdx` avec `node:fs` et expose `wordCount`, `readingTimeMinutes` et `toc`
- [ ] `toc` est un tableau ordonné d'entrées `{ depth: 2 | 3, text, id }`, où `id` est produit par la fonction `slugify` de US-001
- [ ] Étant donné un article sans aucun titre `##`, quand `toc` est calculé, alors il renvoie un tableau vide sans erreur
- [ ] Étant donné un `##` apparaissant à l'intérieur d'un bloc de code délimité par des triples accents graves, quand `toc` est calculé, alors cette ligne est ignorée
- [ ] Étant donné deux titres de texte identique dans un même article, quand `toc` est calculé, alors leurs `id` sont rendus uniques par suffixation numérique
- [ ] `readingTimeMinutes` est arrondi à l'entier supérieur, avec une valeur plancher de 1
- [ ] Le comptage de mots exclut le contenu des blocs de code et les lignes de frontmatter éventuelles
- [ ] Un test vitest couvre : article sans titre, titre dans un bloc de code, titres en doublon, article de moins de 200 mots

#### US-003: Route d'article statique
**Description:** En tant que lecteur, je veux qu'une URL d'article réponde une page prérendue, afin d'obtenir le contenu sans attente de rendu serveur.

**Priority:** P0
**Size:** M (3 pts)
**Dependencies:** Blocked by US-001

**Acceptance Criteria:**
- [ ] `src/app/blog/[slug]/page.tsx` résout le contenu par `await import(...)` sur le chemin dérivé du slug
- [ ] `generateStaticParams` renvoie tous les slugs non brouillons, et `export const dynamicParams = false` est déclaré
- [ ] Étant donné un slug absent du registre, quand l'URL est demandée, alors la réponse est un 404 sans erreur serveur en journal
- [ ] Étant donné un article existant, quand `bun build` s'exécute, alors la sortie de build marque la route comme statiquement prérendue et non dynamique
- [ ] `generateMetadata` produit `title`, `description`, `alternates.canonical`, `openGraph` de type `article` avec `publishedTime`, et `twitter` en `summary_large_image`
- [ ] Étant donné un article dont `meta.draft` vaut `true`, quand `bun build` s'exécute, alors aucune route n'est générée pour lui
- [ ] Étant donné `NODE_ENV` valant `development`, quand `bun dev` s'exécute, alors les brouillons sont routables et la page affiche un marqueur visible indiquant l'état de brouillon
- [ ] Étant donné un brouillon routable en développement, quand la page est rendue, alors elle porte `robots: { index: false, follow: false }`
- [ ] La page rend un élément `<article>` unique, avec un `<h1>` provenant de `meta.title` et non du corps MDX
- [ ] La date de publication est rendue en texte visible dans la page, dans un élément `<time dateTime="...">`

#### US-004: Index du blog
**Description:** En tant que lecteur, je veux une page listant les articles, afin de choisir quoi lire sans passer par un moteur de recherche.

**Priority:** P0
**Size:** S (2 pts)
**Dependencies:** Blocked by US-001, US-002

**Acceptance Criteria:**
- [ ] `src/app/blog/page.tsx` liste les articles non brouillons par date décroissante
- [ ] Chaque entrée affiche titre, description, date lisible et temps de lecture
- [ ] Étant donné aucun article publié, quand `/blog` est demandée, alors un état vide explicite est rendu, sans liste fantôme ni erreur
- [ ] La page s'inscrit dans `GridShell` et déclare son propre `metadata` avec `alternates.canonical` sur `/blog`
- [ ] La liste est un élément de liste sémantique, et chaque titre d'entrée est un lien dont le texte accessible est le titre de l'article
- [ ] Étant donné un article dont la description dépasse deux lignes, quand l'index est rendu, alors le texte est tronqué visuellement sans couper un mot au milieu et sans provoquer de débordement horizontal

#### US-005: Intégration à la navigation
**Description:** En tant que lecteur, je veux atteindre le blog depuis n'importe quelle page, afin de ne pas avoir à deviner l'URL.

**Priority:** P0
**Size:** XS (1 pt)
**Dependencies:** Blocked by US-004

**Acceptance Criteria:**
- [ ] `/blog` est ajouté à `navItems` dans `src/components/layout/GridShell.tsx:9`
- [ ] Étant donné que la page courante est une page du blog, quand la navigation est rendue, alors l'entrée correspondante porte `aria-current="page"`
- [ ] Les entrées d'ancre existantes (`/#hero`, `/#about`, `/#projects`) continuent de fonctionner depuis une page de blog, en naviguant vers la page d'accueil puis vers l'ancre
- [ ] Aucun composant nouveau n'est exporté depuis `src/components/index.ts` sans être consommé

---

### EP-002: Typographie long-form et mise en page "planche technique"

Donner à l'article sa forme définitive : mesure de lecture, rythme vertical, hiérarchie, blocs de code Shiki, et la structure à deux colonnes avec rail droit qui constitue la signature de la direction B.

**Definition of Done:** la fixture de US-007 atteint 4,5:1 de contraste sur le texte courant et le texte de code dans les deux thèmes, ne produit aucun défilement horizontal du `body` à 375 px, 768 px, 1024 px, 1440 px et à 200 % de zoom, conserve une hiérarchie de titres lisible avec le mode grille désactivé, n'ajoute aucun octet de JavaScript client pour la coloration syntaxique, et supprime le rail droit sous le seuil de contenu défini en US-010.

#### US-006: Fondation typographique de l'article
**Description:** En tant que lecteur, je veux une colonne de texte à mesure contrôlée et à rythme régulier, afin de lire 2 000 mots sans fatigue.

**Priority:** P0
**Size:** M (3 pts)
**Dependencies:** Blocked by US-003

**Acceptance Criteria:**
- [ ] Un bloc `.article` est ajouté à `src/app/globals.css`, distinct de `.legal-article`, qui reste inchangé
- [ ] La colonne de texte est bornée à 610 px, valeur reprise de `.legal-article` (`src/app/globals.css:260`)
- [ ] Le corps de texte utilise `var(--fg)` en `font-weight: 400` et `line-height: 1.625`, et non `var(--fg-muted)` en 300 comme `.legal-article`
- [ ] Tous les espacements de blocs (paragraphes, titres, listes, blocs de code) sont des multiples de 26 px
- [ ] Le titre d'article utilise `.font-serif` (Instrument Serif), et aucun autre élément de l'article n'utilise le serif
- [ ] Étant donné le thème clair puis le thème sombre, quand le contraste du texte courant sur son fond est mesuré, alors il atteint au moins 4,5:1 dans les deux cas
- [ ] Étant donné le mode grille désactivé (`data-grid="off"`), quand l'article est rendu, alors la hiérarchie des titres et la séparation des sections restent lisibles sans aucune règle pointillée
- [ ] Étant donné un zoom navigateur à 200 %, quand l'article est rendu, alors le `body` ne défile pas horizontalement

#### US-007: Surcharges de composants MDX
**Description:** En tant qu'auteur, je veux que le Markdown standard produise le rendu du design system sans balisage particulier, afin d'écrire du texte et non des composants.

**Priority:** P0
**Size:** M (3 pts)
**Dependencies:** Blocked by US-006

**Acceptance Criteria:**
- [ ] `src/mdx-components.tsx` surcharge `h2`, `h3`, `p`, `ul`, `ol`, `li`, `blockquote`, `a`, `hr`, `strong`, `em`, `code` en ligne, et expose un composant `Table` disponible sans import
- [ ] `h2` et `h3` reçoivent un `id` produit par la fonction `slugify` de US-001, identique à celui calculé pour la table des matières
- [ ] Étant donné un lien externe, quand il est rendu, alors il porte `rel="noopener noreferrer"` et un `target="_blank"`, et un lien interne n'en porte pas
- [ ] Les ancres de titres sont atteignables au clavier et respectent le style `:focus-visible` global (`src/app/globals.css`)
- [ ] Étant donné un tableau plus large que la colonne de texte, quand il est rendu, alors il défile horizontalement dans le conteneur `overflow-x: auto` fourni par `Table`, ce conteneur est atteignable au clavier, le tableau conserve ses sémantiques natives de lignes et de cellules, et le `body` ne défile pas
- [ ] Aucune classe de `@tailwindcss/typography` n'est utilisée
- [ ] L'ordre des titres reste `h1` puis `h2` puis `h3` sans saut de niveau, `h1` étant réservé au titre d'article rendu par la page
- [ ] Un fichier de fixture `src/content/blog/_kitchen-sink.mdx`, marqué `draft: true`, exerce chaque primitive surchargée : `h2`, `h3`, paragraphes, liste à puces, liste ordonnée, citation, lien interne, lien externe, tableau plus large que la colonne, code en ligne, et au moins trois blocs de code dans des langages différents dont un contenant une ligne dépassant la largeur de la colonne
- [ ] La fixture dépasse 1 500 mots et compte au moins 4 titres `##`, de façon à déclencher le régime à deux colonnes de US-009
- [ ] Étant donné un `bun build` de production, quand la sortie est inspectée, alors aucune route n'est générée pour la fixture

#### US-008: Blocs de code Shiki en composant serveur
**Description:** En tant que lecteur, je veux des blocs de code correctement colorés dans mon thème, afin de lire le code sans effort et sans télécharger de JavaScript.

**Priority:** P0
**Size:** L (5 pts)
**Dependencies:** Blocked by US-007

**Acceptance Criteria:**
- [ ] `shiki` est la seule dépendance de production ajoutée au `package.json`
- [ ] La surcharge `pre` de `src/mdx-components.tsx` est un composant serveur asynchrone appelant `codeToHtml` avec `themes: { light, dark }` et `defaultColor: false`
- [ ] Les variables CSS `--shiki-light` et `--shiki-dark` sont commutées dans `src/app/globals.css` via le sélecteur du `@custom-variant dark` déjà déclaré ligne 4
- [ ] Le fond des blocs de code provient de `var(--surface)` et non du thème Shiki, et les coins sont à angle droit conformément à `--radius: 0`
- [ ] Étant donné un bloc de code sans langage déclaré ou dans un langage non supporté, quand la page est construite, alors le bloc est rendu en texte brut et le build réussit
- [ ] Étant donné une ligne de code plus large que la colonne, quand le bloc est rendu, alors il défile horizontalement dans son propre conteneur et le `body` ne défile pas
- [ ] Étant donné une forme de noeud enfant inattendue passée à `pre`, quand le composant s'exécute, alors il retombe sur un rendu brut sans lever d'exception, et le cas est couvert par un test vitest
- [ ] Étant donné la sortie de `bun build`, quand le bundle client est inspecté, alors aucun module `shiki` n'y figure
- [ ] Un `createHighlighter` en singleton limite les langages chargés à une liste explicite, et la durée de `bun build` augmente de moins de 20 secondes pour 10 articles
- [ ] Le contraste du texte de code sur son fond atteint 4,5:1 dans les deux thèmes

#### US-009: Structure à deux colonnes avec rail droit
**Description:** En tant que lecteur d'un article long, je veux un rail persistant portant la structure et les métadonnées, afin de me situer dans le texte sans le quitter.

**Priority:** P0
**Size:** L (5 pts)
**Dependencies:** Blocked by US-002, US-006

**Acceptance Criteria:**
- [ ] Le conteneur d'article fait environ 1 000 px, réparti en une colonne de texte de 610 px et un rail d'environ 220 px
- [ ] Une règle pointillée verticale utilisant `border-grid-soft` sépare la colonne du rail
- [ ] Le rail affiche la date de publication, la date de mise à jour si présente, le temps de lecture, et la table des matières issue de `toc`
- [ ] La table des matières est un élément de navigation sémantique portant un `aria-label`, et chaque entrée est un lien d'ancre fonctionnel
- [ ] Étant donné le défilement de la page, quand une section entre dans la zone de lecture, alors son entrée dans la table des matières est marquée active et porte `aria-current="true"`
- [ ] Étant donné `prefers-reduced-motion: reduce`, quand la section active change, alors aucune animation de déplacement ne se produit, mais le marquage actif reste visible
- [ ] Étant donné JavaScript désactivé, quand l'article est rendu, alors la table des matières s'affiche en liste statique et tous ses liens fonctionnent
- [ ] Le composant client responsable du suivi de section pèse au maximum 3 KB en gzip
- [ ] Étant donné le mode grille désactivé, quand l'article est rendu, alors la séparation entre colonne et rail reste perceptible par l'espacement seul

#### US-010: Dégradation automatique vers la colonne unique
**Description:** En tant qu'auteur, je veux que le rail disparaisse quand l'article ne le justifie pas, afin de ne jamais publier un rail vide qui ne serait que décoratif.

**Priority:** P0
**Size:** M (3 pts)
**Dependencies:** Blocked by US-009

**Acceptance Criteria:**
- [ ] Étant donné un article dont `wordCount` est inférieur à 1 500 ou dont `toc` compte moins de 4 entrées de profondeur 2, quand la page est rendue, alors le rail est absent et la colonne de texte est centrée
- [ ] Étant donné une largeur de fenêtre inférieure à 1 024 px, quand l'article est rendu, alors le rail passe au-dessus du texte, table des matières incluse, sous forme repliable
- [ ] Étant donné un article court affiché sous 1 024 px, quand la page est rendue, alors aucun conteneur vide ni bordure orpheline ne subsiste
- [ ] Le seuil de bascule est défini une seule fois, dans `src/lib/blog.ts`, et exposé comme une valeur nommée plutôt qu'un nombre en dur dans le composant
- [ ] Un test vitest couvre les deux côtés du seuil sur `wordCount` et sur le nombre de titres
- [ ] Étant donné un article long puis un article court, quand les deux sont rendus, alors la mesure de la colonne de texte reste identique dans les deux cas

#### US-011: Notes latérales ancrées
**Description:** En tant qu'auteur, je veux placer une note en marge d'un paragraphe, afin d'ajouter une précision sans casser le fil du texte.

**Priority:** P2
**Size:** M (3 pts)
**Dependencies:** Blocked by US-009

**Acceptance Criteria:**
- [ ] Un composant `SideNote` est disponible dans le MDX sans import explicite, via `src/mdx-components.tsx`
- [ ] Étant donné le rail présent, quand une note est rendue, alors elle apparaît dans le rail à la hauteur de son paragraphe d'ancrage
- [ ] Étant donné le rail absent (article court ou fenêtre sous 1 024 px), quand une note est rendue, alors elle apparaît dans le flux du texte, visuellement distinguée par une règle pointillée
- [ ] Étant donné deux notes ancrées à des paragraphes trop proches pour coexister dans le rail, quand la page est rendue, alors elles s'empilent sans se chevaucher
- [ ] La note est lue par un lecteur d'écran immédiatement après son paragraphe d'ancrage, dans les deux régimes de mise en page
- [ ] Étant donné une note vide, quand la page est rendue, alors aucun conteneur ni bordure n'est émis

---

### EP-003: Diffusion et découvrabilité

Rendre les articles partageables et citables. Compte tenu de la fermeture du canal search, cet epic porte l'essentiel de la valeur de distribution.

**Definition of Done:** un article non brouillon est présent dans `sitemap.xml`, dans `/rss.xml` et dans `/llms.txt`, dispose d'une image OG de 1200 par 630 rendue sans glyphe manquant ni débordement, et d'un `BlogPosting` rattaché par `@id` à l'entité `Person` existante et validé sans erreur par le test de résultats enrichis de Google à partir du JSON-LD collé.

#### US-012: Flux RSS 2.0
**Description:** En tant que lecteur, je veux m'abonner par flux, afin de recevoir les nouveaux articles sans dépendre d'un algorithme.

**Priority:** P1
**Size:** M (3 pts)
**Dependencies:** Blocked by US-001

**Acceptance Criteria:**
- [ ] `src/app/rss.xml/route.ts` renvoie du RSS 2.0 valide avec l'en-tête `Content-Type: application/xml`
- [ ] Le `Cache-Control` reprend la convention des routes existantes (`public, max-age=86400, s-maxage=86400`, comme `src/app/robots.txt/route.ts`)
- [ ] Chaque `<item>` porte `title`, `link` en URL absolue, `guid` stable, `pubDate` au format RFC 822 et `description`
- [ ] Étant donné un titre ou une description contenant `&`, `<`, `>`, une apostrophe ou un guillemet, quand le flux est généré, alors ces caractères sont échappés et le flux reste valide selon le validateur W3C Feed
- [ ] Étant donné aucun article publié, quand `/rss.xml` est demandée, alors un flux valide sans `<item>` est renvoyé, avec un statut 200
- [ ] Les articles brouillons sont absents du flux
- [ ] La déclaration `alternates.types` de `src/app/blog/page.tsx` et de `src/app/page.tsx` expose `application/rss+xml` vers `/rss.xml`, en préservant l'entrée `text/plain` existante vers `/llms.txt`
- [ ] Aucune dépendance nouvelle n'est ajoutée pour générer le XML
- [ ] Un test vitest vérifie l'échappement sur une chaîne contenant les cinq caractères réservés

#### US-013: Image OG par article
**Description:** En tant qu'auteur, je veux une image de partage spécifique par article, afin que 100 % des articles partagés affichent leur propre titre au lieu de l'image OG générique du site.

**Priority:** P1
**Size:** L (5 pts)
**Dependencies:** Blocked by US-003

**Acceptance Criteria:**
- [ ] `src/app/blog/[slug]/opengraph-image.tsx` exporte `size` en 1200 par 630, `contentType` en `image/png` et un `alt` dérivé du titre de l'article
- [ ] La police est chargée par `readFile` depuis un fichier local dans `assets/fonts/`, en dehors de `public/`, et non depuis `next/font/google` qui n'est pas exploitable par Satori
- [ ] La composition n'utilise ni CSS Grid ni fonctionnalité Flexbox non supportée par Satori, et la signature visuelle est reconstituée avec des bordures pleines et du positionnement absolu
- [ ] Étant donné un titre d'article de plus de 90 caractères, quand l'image est générée, alors le texte est tronqué avec une ellipse et tous ses glyphes restent dans le cadre de 1200 par 630
- [ ] Étant donné un titre contenant des caractères accentués, quand l'image est générée, alors ils sont rendus correctement et non en glyphes manquants
- [ ] L'image est générée au build, pas à la requête, ce qui est vérifiable dans la sortie de `bun build`
- [ ] Étant donné `bun dev`, quand la route `opengraph-image` de la fixture est ouverte, alors un PNG de 1200 par 630 est servi, tous ses glyphes sont rendus, et aucun texte ne dépasse du cadre
- [ ] La validation par l'inspecteur de cartes de X et le post inspector de LinkedIn est différée au premier article réellement publié, la fixture n'étant pas accessible publiquement
- [ ] Le fond de l'image reste lisible indépendamment du thème du client, puisque l'image est unique et statique

#### US-014: Extension du sitemap
**Description:** En tant qu'agent de crawl, je veux trouver toutes les URLs du blog dans le sitemap, afin de les découvrir sans exploration de liens.

**Priority:** P1
**Size:** S (2 pts)
**Dependencies:** Blocked by US-001, US-004

**Acceptance Criteria:**
- [ ] `src/app/sitemap.ts` ajoute `/blog` et une entrée par article non brouillon à l'entrée racine existante
- [ ] Le `lastModified` de chaque article vaut `meta.updatedAt` s'il existe, sinon `meta.publishedAt`
- [ ] Étant donné un article brouillon, quand le sitemap est généré, alors son URL est absente
- [ ] Étant donné aucun article publié, quand le sitemap est généré, alors il ne contient que l'entrée racine et l'entrée `/blog`, et reste valide
- [ ] L'entrée racine existante conserve sa `priority` de 1 et sa `changeFrequency`

#### US-015: JSON-LD BlogPosting
**Description:** En tant qu'agent de citation, je veux un balisage identifiant l'auteur et la date d'un article, afin de le citer avec attribution correcte.

**Priority:** P1
**Size:** M (3 pts)
**Dependencies:** Blocked by US-003

**Acceptance Criteria:**
- [ ] `src/lib/json-ld.ts` expose une fonction produisant un noeud `BlogPosting` pour un article donné
- [ ] Le `BlogPosting` référence l'entité `Person` existante par `@id` (`${siteConfig.url}/#person`) en `author` et en `publisher`, sans dupliquer ses propriétés
- [ ] `datePublished` et, s'il existe, `dateModified` sont émis au format ISO, et cohérents avec la date rendue en clair dans la page
- [ ] `mainEntityOfPage`, `headline`, `description`, `inLanguage` et `url` absolu sont présents
- [ ] Étant donné un article sans `updatedAt`, quand le noeud est produit, alors `dateModified` est absent plutôt que renseigné avec `datePublished`
- [ ] Le JSON-LD existant de la page d'accueil (`getJsonLd`) est inchangé, et `src/lib/__tests__/json-ld.test.ts` continue de passer sans modification de ses assertions existantes
- [ ] De nouveaux tests vitest couvrent le `BlogPosting`, dont le cas sans `dateModified`
- [ ] Le balisage est validé sans erreur par le test de résultats enrichis de Google, en collant le JSON-LD produit dans l'outil plutôt qu'en soumettant une URL

#### US-016: Articles dans llms.txt
**Description:** En tant qu'agent lisant `/llms.txt`, je veux y trouver l'inventaire des articles, afin de disposer d'un index en texte brut cohérent avec le reste du site.

**Priority:** P2
**Size:** S (2 pts)
**Dependencies:** Blocked by US-001

**Acceptance Criteria:**
- [ ] `src/lib/agent-markdown.ts` ajoute une section listant les articles non brouillons, avec titre, URL absolue, date et description
- [ ] Les sections existantes (`Projects`, `Canonical resources`) et leur ordre sont préservés
- [ ] Étant donné aucun article publié, quand le markdown est construit, alors la section articles est omise entièrement plutôt que rendue vide
- [ ] `/rss.xml` est ajouté à la liste des ressources canoniques
- [ ] Le contenu reste du texte brut valide, sans balisage HTML

---

## Functional Requirements

- FR-01: le système doit découvrir les articles par lecture du répertoire `src/content/blog/`, sans registre maintenu à la main.
- FR-02: le système doit lire les métadonnées depuis un `export const meta` typé dans le fichier MDX, et non depuis du frontmatter YAML.
- FR-03: le système doit faire échouer `bun build` avec un code de sortie non nul lorsqu'un article a des métadonnées absentes ou invalides, plutôt que de publier une page dégradée.
- FR-04: le système doit prérendre toutes les routes d'articles au build et renvoyer un 404 pour tout slug hors liste.
- FR-05: le système doit exclure les articles dont `meta.draft` vaut `true` des routes générées en production, de l'index, du sitemap, du flux RSS et de `llms.txt`.
- FR-05b: le système doit rendre les brouillons routables et non indexables lorsque `NODE_ENV` vaut `development`, afin de permettre la prévisualisation locale avant publication.
- FR-06: le système doit calculer le temps de lecture et la table des matières depuis le fichier MDX brut, sans plugin remark.
- FR-07: le système doit générer les ancres de titres et les identifiants de la table des matières depuis une unique fonction `slugify`.
- FR-08: le système doit colorer les blocs de code au build via Shiki, sans expédier de JavaScript de coloration au client.
- FR-09: le système doit supprimer le rail droit lorsque `wordCount` est inférieur à 1 500 ou que la table des matières compte moins de 4 titres de niveau 2.
- FR-10: le système doit exposer un flux RSS 2.0 valide à `/rss.xml`, et le déclarer par `alternates.types`.
- FR-11: le système doit générer une image Open Graph par article au build.
- FR-12: le système ne doit modifier ni `next.config.ts`, ni `src/app/robots.txt/route.ts`, ni le bloc `.legal-article` de `src/app/globals.css`.
- FR-13: le système ne doit ajouter aucune dépendance de production autre que `shiki`.
- FR-14: le système doit rendre la date de publication en texte visible, dans un élément `<time>`, en plus du JSON-LD.

## Non-Functional Requirements

- **Performance:** toutes les routes du blog statiquement prérendues, zéro rendu serveur à la requête. LCP inférieur à 1,5 s sur une page d'article en connexion 4G simulée. JavaScript client ajouté par la coloration syntaxique : 0 KB. Composant client de suivi de section : 3 KB maximum en gzip. Augmentation de la durée de `bun build` inférieure à 20 secondes pour 10 articles.
- **Security:** aucune entrée utilisateur, aucune donnée externe au build, aucun secret. Les liens externes portent `rel="noopener noreferrer"`. Le XML du flux échappe les cinq caractères réservés. Les en-têtes de sécurité existants de `next.config.ts` s'appliquent sans modification.
- **Accessibility:** WCAG 2.2 niveau AA. Contraste minimum 4,5:1 sur le texte courant et le texte de code, vérifié séparément en thème clair et en thème sombre. Ordre de titres sans saut de niveau. Table des matières entièrement navigable au clavier avec `aria-current` sur la section active. Contenu et navigation fonctionnels sans JavaScript. Aucun déplacement animé sous `prefers-reduced-motion: reduce`. Score Lighthouse Accessibility de 100 sur une page d'article.
- **Compatibilité d'affichage:** aucun défilement horizontal du `body` à 375 px, 768 px, 1024 px, 1440 px, et à 200 % de zoom. Les tableaux et les blocs de code défilent dans leur propre conteneur.
- **Reliability:** un article mal formé fait échouer le build au lieu d'être publié. Un langage de code non supporté retombe sur du texte brut sans faire échouer le build. Une forme de noeud MDX inattendue retombe sur un rendu brut sans lever d'exception.
- **Maintainability:** une seule dépendance de production ajoutée. Zéro modification de `next.config.ts`. Le seuil de bascule de mise en page est défini en un seul endroit. Le blog n'introduit aucun second système de typographie long-form.

## Edge Cases & Error States

| # | Scenario | Trigger | Expected Behavior | User Message |
|---|----------|---------|-------------------|--------------|
| 1 | Index vide | Aucun fichier dans `src/content/blog/` | `/blog` rend un état vide explicite, statut 200 | "No posts published yet." |
| 2 | Slug inconnu | URL `/blog/inexistant` | 404 via `dynamicParams = false`, aucune erreur serveur en journal | Page 404 du site |
| 3 | Métadonnées manquantes | Fichier `.mdx` sans `export const meta` | `bun build` échoue, code de sortie non nul, message nommant le fichier | Erreur de build en console |
| 4 | Date invalide | `publishedAt` hors format `YYYY-MM-DD` | Le build échoue en nommant le fichier et le champ | Erreur de build en console |
| 5 | Article court | `wordCount` < 1 500 ou moins de 4 titres `##` | Rail absent, colonne de texte centrée, aucun conteneur vide | Aucun |
| 6 | Article sans titre de section | Aucun `##` dans le corps | `toc` vide, rail absent, aucune erreur | Aucun |
| 7 | Mode grille désactivé | `data-grid="off"` | Hiérarchie et séparation colonne/rail portées par l'espacement seul | Aucun |
| 8 | Thème sombre | Classe `.dark` sur `html` | Bascule des variables Shiki, contraste maintenu à 4,5:1 | Aucun |
| 9 | Langage de code non supporté | Bloc dans un langage absent de la liste chargée | Rendu en texte brut, build réussi | Aucun |
| 10 | Ligne de code très longue | Ligne dépassant 610 px | Défilement horizontal local au bloc, `body` figé | Aucun |
| 11 | Tableau large | Tableau dépassant la colonne | Défilement horizontal local, `body` figé | Aucun |
| 12 | JavaScript désactivé | Client sans JS | Table des matières en liste statique, liens d'ancre fonctionnels | Aucun |
| 13 | Mouvement réduit | `prefers-reduced-motion: reduce` | Marquage de section active sans animation de déplacement | Aucun |
| 14 | Titre d'article très long | Plus de 90 caractères | Troncature par ellipse dans l'image OG, tous les glyphes dans le cadre 1200x630 | Aucun |
| 15 | Caractères réservés XML | `&`, `<`, `>`, apostrophe, guillemet dans un titre | Échappement, flux valide au validateur W3C | Aucun |
| 16 | Titres en doublon | Deux `##` de texte identique | Ancres rendues uniques par suffixation, liens de table des matières corrects | Aucun |
| 17 | `##` dans un bloc de code | Ligne commençant par `##` entre triples accents graves | Ignorée par le calcul de la table des matières | Aucun |
| 18 | Brouillon en production | `meta.draft = true`, `bun build` | Absent des routes, de l'index, du sitemap, du flux et de `llms.txt` | Aucun |
| 18b | Brouillon en développement | `meta.draft = true`, `bun dev` | Route accessible, marqueur de brouillon visible, `robots: noindex` | "Draft" |
| 19 | Noeud MDX inattendu | Forme d'enfants non prévue passée à `pre` | Rendu brut, aucune exception, cas couvert par test | Aucun |
| 20 | Note latérale vide | `SideNote` sans contenu | Aucun conteneur ni bordure émis | Aucun |

## Risks & Mitigations

| # | Risk | Probability | Impact | Mitigation |
|---|------|------------|--------|------------|
| 1 | L'extraction du code brut depuis les noeuds enfants de `pre` casse si `@next/mdx` change leur forme, ce qui ferait échouer tout le blog au build | Low | High | Garde de repli sur un rendu brut au lieu d'une exception, test vitest sur l'extracteur avec une forme inattendue, dépendance épinglée. US-008 valide l'assomption A1 |
| 2 | La table des matières calculée par regex divergerait des ancres réellement générées, produisant des liens morts | Med | Med | Une unique fonction `slugify` partagée entre `src/lib/blog.ts` et les surcharges de titres, testée sur les doublons et les caractères spéciaux. US-001 et US-002 |
| 3 | Satori ne reproduit pas la trame pointillée, l'image OG se décorrèle visuellement du site | Med | Med | Signature reconstituée en bordures pleines et positionnement absolu, validation par les inspecteurs de X et LinkedIn. US-013 valide l'assomption A2 |
| 4 | Le rail droit devient de la décoration si les articles sont courts, ce que `docs/design.md` interdit | Med | Med | Seuil automatique sur `wordCount` et nombre de titres, défini en un seul endroit, testé des deux côtés du seuil. US-010 |
| 5 | Shiki allonge la durée de build au-delà de l'acceptable à mesure que les articles s'accumulent | Low | Low | Singleton `createHighlighter`, liste de langages explicite et bornée, seuil mesuré à 20 secondes pour 10 articles. US-008 |
| 6 | Le blog ne génère aucun trafic de recherche | High | Low | Attentes recalibrées dès le PRD : le succès est mesuré en articles publiés, en validité des surfaces de diffusion et en qualité d'accessibilité, jamais en sessions organiques. Les données Pew et Ahrefs rendent ce risque quasi certain et déjà intégré |
| 7 | Le contraste échoue dans un seul des deux thèmes, la vérification n'ayant été faite que dans l'autre | Med | Med | Critère de contraste explicitement dédoublé par thème dans US-006 et US-008, et porté dans les quality gates visuels |
| 8 | Le suivi de section active ajoute plus de JavaScript client que prévu | Low | Low | Budget de 3 KB gzip inscrit en critère d'acceptation et en NFR, rendu statique fonctionnel sans JS. US-009 |

## Non-Goals

- **Pas de rédaction d'articles.** Le PRD livre le système de publication, pas le contenu. Aucune story ne produit d'article destiné à la publication. La seule prose écrite est la fixture `_kitchen-sink.mdx`, en brouillon permanent, dont le rôle est la vérification visuelle et non la lecture. Arthur écrit et publie les articles réels après l'implémentation, à sa cadence.
- **Pas de taxonomie.** Ni pages de tags, ni catégories, ni archives par année. Le champ `tags` existe dans `PostMeta` mais n'a aucune route dédiée. À reconsidérer au-delà de 15 articles.
- **Pas de recherche.** Aucune indexation locale, aucun service externe. L'index chronologique suffit au volume visé.
- **Pas de commentaires.** Aucun système de commentaires, aucun widget de réaction, aucune intégration tierce.
- **Pas de couche de contenu.** Velite, Content Collections, Contentlayer et Fumadocs sont écartés pour cette version. Seuil de reconsidération : au-delà de 30 articles, ou dès qu'un besoin de tags typés, d'articles liés ou de recherche apparaît.
- **Pas de CMS ni d'interface d'édition.** L'édition se fait dans le repo. Keystatic et TinaCMS sont hors périmètre.
- **Pas d'ISR ni de rendu dynamique.** Le blog est intégralement statique.
- **Pas de pagination.** L'index liste tous les articles. À reconsidérer au-delà de 25 articles.
- **Pas de newsletter.** Le flux RSS est le seul mécanisme d'abonnement. Pas de collecte d'adresse, donc aucune donnée personnelle nouvelle.
- **Pas de version multilingue.** Anglais US uniquement, conformément à `siteConfig.language`.
- **Pas de modification de la politique de crawl.** `src/app/robots.txt/route.ts` a déjà tranché : agents de recherche et de citation autorisés, agents d'entraînement refusés, avec un `Content-Signal` déclarant `ai-train=no`. La politique est en `Allow: /` et couvre déjà `/blog`.
- **Pas de bouton de copie sur les blocs de code en v1.** Reporté, car il introduirait un composant client sur chaque bloc.

## Files NOT to Modify

- `next.config.ts` : `@next/mdx` y est déjà correctement configuré. Le choix de Shiki en composant serveur existe précisément pour ne jamais avoir à toucher les options de loader, où la contrainte de sérialisation Turbopack se manifesterait.
- `src/app/robots.txt/route.ts` : la politique de crawl est déjà décidée et couvre `/blog` par son `Allow: /`. Y toucher rouvrirait une décision déjà prise.
- `src/app/layout.tsx` : les polices, le `metadataBase`, le script anti-flash de thème et le lien de saut sont corrects. Le blog en hérite sans modification.
- `src/app/globals.css`, bloc `.legal-article` (lignes 260 à 312) : les pages légales en dépendent. Le blog ajoute un bloc `.article` distinct.
- `src/app/(legal)/` : hors périmètre.
- `src/lib/json-ld.ts`, fonction `getJsonLd` : le graphe de la page d'accueil est testé. Le `BlogPosting` s'ajoute par une fonction nouvelle, sans toucher l'existante.
- `src/lib/site.config.ts`, données existantes : seul un ajout de bloc dédié au blog est permis si nécessaire.
- `src/proxy.ts` : sans rapport.
- `src/components/sections/` : les sections de la page d'accueil ne sont pas concernées.
- `suppress-baseline-warning.cjs` : chargé par le script de build, hors périmètre.

## Technical Considerations

- **Extraction du code brut :** la surcharge `pre` doit récupérer la chaîne source et le langage depuis les props de son enfant `code`. Recommandation : lire `props.children.props.children` et `props.children.props.className`, avec une garde de type et un repli sur un rendu brut. Une alternative existe, `codeToHast` plus `hast-util-to-jsx-runtime`, qui donne un contrôle complet des composants rendus mais ajoute une dépendance. À confirmer au premier test réel.
- **Police de l'image OG :** le paquet `geist` déjà installé livre des `.ttf` exploitables par Satori (`node_modules/geist/dist/fonts/geist-sans/Geist-Regular.ttf`). Recommandation : copier `Geist-Regular.ttf` et `Geist-SemiBold.ttf` dans `assets/fonts/` plutôt que de lire depuis `node_modules`, dont la disposition n'est pas un contrat. Instrument Serif, utilisé pour le titre d'article, vient de Google Fonts et n'est pas disponible localement. Deux options : accepter que l'image OG utilise Geist, ou télécharger Instrument Serif (licence OFL) dans `assets/fonts/`. La seconde préserve la cohérence de marque pour environ 100 KB en repo.
- **Ancres de titres :** `rehype-slug` a été écarté puisque `src/lib/blog.ts` a de toute façon besoin d'une fonction `slugify` pour la table des matières. Mutualiser est plus sûr que d'avoir deux générateurs d'identifiants susceptibles de diverger entre eux. À confirmer : le comportement souhaité sur les titres contenant du code en ligne.
- **Suivi de section active :** `IntersectionObserver` dans un petit composant client, ou `scroll-timeline` en CSS pur. Compromis : la voie CSS supprime tout JavaScript mais son support navigateur est plus étroit. Recommandation : `IntersectionObserver` avec liste statique rendue côté serveur comme socle, dans le budget de 3 KB.
- **Langages Shiki chargés :** une liste explicite et bornée est nécessaire pour tenir le budget de build. Recommandation de départ : TypeScript, TSX, JavaScript, JSON, Rust, Bash, CSS, Markdown. À étendre au cas par cas.
- **Validation des métadonnées :** valider à la main dans `src/lib/blog.ts`, ou introduire un validateur de schéma. Recommandation : validation à la main, puisque le nombre de champs est faible et que C6 borne les dépendances. À reconsidérer si `PostMeta` dépasse une dizaine de champs.
- **Notes latérales (US-011) :** l'ancrage vertical d'une note à son paragraphe dans une colonne séparée impose soit une mesure de position au client, soit une structure en grille par section. Recommandation : traiter cette story en dernier et l'abandonner si le coût dépasse son apport, sa priorité P2 le permettant.

## Success Metrics

| Metric | Baseline (current) | Target | Timeframe | How Measured |
|--------|-------------------|--------|-----------|-------------|
| Dépendances de production ajoutées | 0 | 1 | Month-1 | Diff de `package.json` |
| Modifications de `next.config.ts` | N/A | 0 | Month-1 | `git log` sur le fichier |
| Score Lighthouse Accessibility sur une page d'article | N/A (pas d'article) | 100 | Month-1 | Lighthouse en local sur le build de production |
| JavaScript client de coloration syntaxique | N/A | 0 KB | Month-1 | Inspection du bundle client dans la sortie de `bun build` |
| Validité du flux RSS | N/A (pas de flux) | 0 erreur | Month-1 | Validateur W3C Feed |
| Validité du `BlogPosting` | N/A | 0 erreur | Month-1 | Test de résultats enrichis de Google |
| Image OG rendue correctement | N/A | 1200x630, aucun glyphe manquant, aucun débordement | Month-1 | Ouverture de la route `opengraph-image` en local |
| Couverture des surfaces de diffusion | 0 % | 100 % des articles non brouillons dans sitemap, RSS et llms.txt | Month-1 | Contrôle manuel des trois sorties après build |
| Requêtes `GET /rss.xml` | 0 (route inexistante) | mesure établie, pas de cible | Month-6 | Journaux de la plateforme d'hébergement |
| Temps entre la création du fichier et la publication en ligne | N/A | aucune étape manuelle hors commit et push | Month-1 | Observation lors de la publication du premier article réel, hors périmètre du PRD |

Hors périmètre de ce PRD, suivi par Arthur : nombre d'articles publiés (baseline 0, un article déjà rédigé et en attente), cadence de publication, et audience du flux. Ces mesures dépendent de la production éditoriale, pas de l'implémentation.

## Open Questions

- **Police du titre dans l'image OG.** Accepter Geist et une légère divergence avec le titre serif de la page, ou intégrer Instrument Serif en `.ttf` dans `assets/fonts/` sous licence OFL. À trancher par Arthur avant US-013. Impact : cohérence de marque contre environ 100 KB en repo.
- **Sort de la story US-011 (notes latérales).** À trancher par Arthur après US-009, une fois le rail réellement en place et son coût d'ancrage mesuré. Impact : le rail perd sa troisième fonction et se réduit aux métadonnées et à la table des matières, ce qui reste suffisant pour justifier son existence.
- **Emplacement de `PostMeta` et du seuil de bascule.** `src/lib/blog.ts` ou un bloc dédié dans `src/lib/site.config.ts`, qui centralise déjà toute la configuration du site. À trancher à l'implémentation de US-001. Impact : cohérence avec la convention de configuration centralisée décrite dans `CLAUDE.md`.
- **Bouton de copie sur les blocs de code.** Exclu de la v1 pour éviter un composant client par bloc. À revoir après le premier article publié, selon l'usage réel. Impact : confort de lecture contre budget JavaScript client.
[/PRD]
