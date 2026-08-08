import { Mail } from "lucide-react";
import Link from "next/link";

import { NavLinks } from "@/components/layout/NavLinks";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/brand-icons";
import { GridModeToggle } from "@/components/ui/GridModeToggle";
import { LocalTime } from "@/components/ui/LocalTime";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { siteConfig } from "@/lib/site.config";

const navItems = [
  { href: "/#hero", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
];

const socialLinks = [
  { label: "X", href: siteConfig.links.x, Icon: XIcon, iconOnly: true },
  { label: "GitHub", href: siteConfig.links.github, Icon: GithubIcon },
  { label: "LinkedIn", href: siteConfig.links.linkedin, Icon: LinkedinIcon },
];

const legalLinks = [
  { href: "/mentions-legales", label: "Legal" },
  { href: "/confidentialite", label: "Privacy" },
  { href: "/cgu", label: "Terms" },
];

function BrandBlock() {
  return (
    <div className="border-grid-soft mb-10 w-full border-y border-dashed px-4">
      <Link
        href="/"
        className="border-grid-soft text-foreground inline-block border-x border-dashed px-2 py-1 font-serif text-lg leading-[22px]"
      >
        {siteConfig.name}
      </Link>
    </div>
  );
}

function NavBlock() {
  return (
    <nav aria-label="Primary navigation" className="flex flex-col gap-1 pb-20">
      <NavLinks
        items={navItems}
        className="border-grid-soft aria-[current=page]:text-foreground hover:text-foreground border-y border-dashed px-4 py-0.5 transition-colors"
      />
    </nav>
  );
}

function ContactBlock() {
  return (
    <div className="w-full">
      <p className="border-grid-soft text-foreground mb-1 border-y border-dashed px-4 py-1 font-light">
        Drop me a message anytime
      </p>

      <a
        href={`mailto:${siteConfig.links.email}`}
        className="border-grid-soft text-foreground flex w-full items-center gap-2 border-y border-dashed px-4 py-1"
      >
        <Mail aria-hidden="true" size={16} strokeWidth={1.5} />
        <span className="underline-offset-4 hover:underline hover:decoration-[color:var(--line)]">
          {siteConfig.links.email}
        </span>
      </a>

      <div className="border-grid-soft mt-6 flex w-full items-center justify-start gap-4 border-y border-dashed px-4 min-[1250px]:mt-10 min-[1250px]:justify-between">
        {socialLinks.map(({ label, href, Icon, iconOnly }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={iconOnly ? label : undefined}
            className="border-grid-soft hover:text-foreground flex items-center gap-2 border-x border-dashed py-1 underline-offset-4 transition-colors hover:underline hover:decoration-[color:var(--line)]"
          >
            <Icon size={16} />
            {!iconOnly && label}
          </a>
        ))}
      </div>
    </div>
  );
}

const statusRowBase =
  "flex w-full items-center justify-end border-y border-dashed border-grid-soft px-4";
const statusRow = `${statusRowBase} mb-1`;
const statusPill =
  "inline-flex shrink-0 items-center gap-3 border-r border-dashed border-grid-soft p-1";

/* Drawn rather than an emoji: Windows ships no flag glyphs and falls back to
   the "FR" letters, which reads as a typo next to the location. */
function FrenchFlag() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={14}
      height={10}
      viewBox="0 0 3 2"
      className="shrink-0 rounded-[1px] ring-1 ring-[color:var(--line)]/60 ring-inset"
    >
      <rect width="1" height="2" fill="#002395" />
      <rect x="1" width="1" height="2" fill="#ffffff" />
      <rect x="2" width="1" height="2" fill="#ed2939" />
    </svg>
  );
}

function StatusBlock() {
  return (
    <div className="flex w-full flex-col items-end">
      {siteConfig.available && (
        <div className={statusRow}>
          <p className={`${statusPill} text-foreground`}>
            Open to work
            <span
              aria-hidden="true"
              className="size-2 animate-pulse rounded-full bg-[color:var(--available)]"
            />
          </p>
        </div>
      )}

      <div className={statusRow}>
        <span className={`${statusPill} text-muted-foreground gap-2`}>
          <FrenchFlag />
          {siteConfig.location}
          <LocalTime />
        </span>
      </div>

      <div className={statusRow}>
        <span className={`${statusPill} text-muted-foreground`}>
          Grid Mode
          <GridModeToggle />
        </span>
      </div>

      <div className={statusRowBase}>
        <span className={`${statusPill} text-muted-foreground`}>
          Theme
          <ThemeToggle />
        </span>
      </div>
    </div>
  );
}

/* Mobile counterpart of the two rails: the brand and primary nav collapse into
   a fixed bar so the viewport is not eaten by stacked status rows. */
function MobileBar() {
  return (
    <div className="border-grid-soft fixed inset-x-0 top-0 z-50 border-b border-dashed bg-[color:var(--background)]/70 backdrop-blur-xl backdrop-saturate-150 min-[1250px]:hidden">
      <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-4 px-4 pt-[calc(0.625rem+env(safe-area-inset-top))] pb-2.5">
        <Link
          href="/"
          className="text-foreground shrink-0 font-serif text-base leading-none"
        >
          {siteConfig.name}
        </Link>

        <nav
          aria-label="Primary navigation"
          className="text-muted-foreground flex items-center gap-4 text-sm"
        >
          <NavLinks
            items={navItems}
            className="aria-[current=page]:text-foreground hover:text-foreground transition-colors"
          />
          <ThemeToggle />
        </nav>
      </div>
    </div>
  );
}

/* The rail status rows are vertical; on mobile they read better as two compact
   rows at the end of the flow, mirroring where the reference puts its meta. */
function MobileStatusBlock() {
  return (
    <div className="mt-6 w-full">
      <div className="border-grid-soft mb-1 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 border-y border-dashed px-4 py-1">
        {siteConfig.available && (
          <span className="text-foreground inline-flex items-center gap-2">
            Open to work
            <span
              aria-hidden="true"
              className="size-2 animate-pulse rounded-full bg-[color:var(--available)]"
            />
          </span>
        )}

        <span className="text-muted-foreground inline-flex items-center gap-2">
          <FrenchFlag />
          {siteConfig.location}
          <LocalTime />
        </span>
      </div>

      <div className="border-grid-soft text-muted-foreground flex w-full items-center justify-between border-y border-dashed px-4 py-1">
        Grid Mode
        <GridModeToggle />
      </div>
    </div>
  );
}

function LegalBlock() {
  return (
    <nav aria-label="Legal links" className={`${statusRowBase} gap-4`}>
      {legalLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="border-grid-soft hover:text-foreground border-r border-dashed py-1 pr-2 font-mono text-[11px] text-[color:var(--fg-faint)] transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

/* The default frame widens its outer margins as the viewport grows, which reads
   well for a page of short blocks and starves a page that needs a measure plus
   a rail. Long-form routes opt into a frame that spends the extra width on the
   content column instead. */
const frame = {
  default: {
    outer:
      "h-dvh w-full overflow-hidden px-0 min-[1250px]:px-2 min-[1400px]:px-6 min-[1590px]:px-12",
    inner:
      "border-grid h-full border-dashed px-0 min-[1250px]:border-x min-[1250px]:px-4 min-[1400px]:px-12 min-[1550px]:px-36",
    content:
      "border-grid w-full max-w-lg border-dashed pt-28 min-[1250px]:border-x min-[1250px]:pt-40",
  },
  wide: {
    outer:
      "h-dvh w-full overflow-hidden px-0 min-[1250px]:px-2 min-[1400px]:px-4",
    inner:
      "border-grid h-full border-dashed px-0 min-[1250px]:border-x min-[1250px]:px-4 min-[1400px]:px-6",
    content:
      "border-grid w-full max-w-[1000px] border-dashed pt-28 min-[1250px]:border-x min-[1250px]:pt-40",
  },
} as const;

export function GridShell({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: keyof typeof frame;
}) {
  const { outer, inner, content } = frame[variant];

  return (
    <div className={outer}>
      <MobileBar />

      {/* The vertical rules would sit flush against the screen edges once the
          rails collapse, so they only exist in the desktop regime. */}
      <div className={inner}>
        {/* One rail late: between 1250px and 1400px the frame's own padding is
            only 16px, so this rule and the one on the frame read as a single
            thick dashed line. It comes back once the padding is wide enough to
            separate them. */}
        <div className="border-grid flex h-full justify-between border-dashed min-[1400px]:border-x">
          <aside className="border-grid text-muted-foreground flex h-full w-80 flex-col border-r border-dashed pt-40 text-sm max-[1250px]:hidden">
            <BrandBlock />
            <NavBlock />
            <div className="mt-auto mb-4 w-full">
              <ContactBlock />
            </div>
          </aside>

          {/* This container is the scrollport, not the document, so in-page
              anchors land here: without `scroll-smooth` every jump to a
              heading or a section is instant. */}
          <div className="scrollbar-hide flex h-full flex-1 scroll-pt-28 flex-col items-center overflow-y-auto overscroll-contain scroll-smooth motion-reduce:scroll-auto min-[1250px]:scroll-pt-0">
            <div className={content}>
              {children}

              {/* Rails collapse below 1250px: their content moves into the flow. */}
              <div className="text-muted-foreground flex flex-col pb-[calc(2.5rem+env(safe-area-inset-bottom))] text-sm min-[1250px]:hidden">
                <MobileStatusBlock />
                <div className="mt-6">
                  <ContactBlock />
                </div>
                <LegalBlock />
              </div>
            </div>
          </div>

          <aside className="border-grid text-muted-foreground flex h-full w-80 flex-col items-end border-l border-dashed pt-40 text-sm max-[1250px]:hidden">
            <StatusBlock />
            <div className="mt-auto mb-4 w-full">
              <LegalBlock />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
