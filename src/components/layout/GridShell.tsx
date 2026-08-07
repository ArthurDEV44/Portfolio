import { Mail } from "lucide-react";
import Link from "next/link";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/ui/brand-icons";
import { GridModeToggle } from "@/components/ui/GridModeToggle";
import { LocalTime } from "@/components/ui/LocalTime";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { siteConfig } from "@/lib/site.config";

const navItems = [
  { href: "/#hero", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#projects", label: "Projects" },
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
    <div className="mb-10 w-full border-y border-dashed border-grid-soft px-4">
      <Link
        href="/"
        className="inline-block border-x border-dashed border-grid-soft px-2 py-1 font-serif text-lg leading-[22px] text-foreground"
      >
        {siteConfig.name}
      </Link>
    </div>
  );
}

function NavBlock() {
  return (
    <nav aria-label="Primary navigation" className="flex flex-col gap-1 pb-20">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="border-y border-dashed border-grid-soft px-4 py-0.5 transition-colors hover:text-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function ContactBlock() {
  return (
    <div className="w-full">
      <p className="mb-1 border-y border-dashed border-grid-soft px-4 py-1 font-light text-foreground">
        Drop me a message anytime
      </p>

      <a
        href={`mailto:${siteConfig.links.email}`}
        className="flex w-full items-center gap-2 border-y border-dashed border-grid-soft px-4 py-1 text-foreground"
      >
        <Mail aria-hidden="true" size={16} strokeWidth={1.5} />
        <span className="underline-offset-4 hover:underline hover:decoration-[color:var(--line)]">
          {siteConfig.links.email}
        </span>
      </a>

      <div className="mt-6 flex w-full items-center justify-start gap-4 border-y border-dashed border-grid-soft px-4 min-[1250px]:mt-10 min-[1250px]:justify-between">
        {socialLinks.map(({ label, href, Icon, iconOnly }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={iconOnly ? label : undefined}
            className="flex items-center gap-2 border-x border-dashed border-grid-soft py-1 underline-offset-4 transition-colors hover:text-foreground hover:underline hover:decoration-[color:var(--line)]"
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
      className="shrink-0 rounded-[1px] ring-1 ring-inset ring-[color:var(--line)]/60"
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
        <span className={`${statusPill} gap-2 text-muted-foreground`}>
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
    <div className="fixed inset-x-0 top-0 z-50 border-b border-dashed border-grid-soft bg-[color:var(--background)]/70 backdrop-blur-xl backdrop-saturate-150 min-[1250px]:hidden">
      <div className="mx-auto flex w-full max-w-lg items-center justify-between gap-4 px-4 pt-[calc(0.625rem+env(safe-area-inset-top))] pb-2.5">
        <Link
          href="/"
          className="shrink-0 font-serif text-base leading-none text-foreground"
        >
          {siteConfig.name}
        </Link>

        <nav
          aria-label="Primary navigation"
          className="flex items-center gap-4 text-sm text-muted-foreground"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
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
      <div className="mb-1 flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-1 border-y border-dashed border-grid-soft px-4 py-1">
        {siteConfig.available && (
          <span className="inline-flex items-center gap-2 text-foreground">
            Open to work
            <span
              aria-hidden="true"
              className="size-2 animate-pulse rounded-full bg-[color:var(--available)]"
            />
          </span>
        )}

        <span className="inline-flex items-center gap-2 text-muted-foreground">
          <FrenchFlag />
          {siteConfig.location}
          <LocalTime />
        </span>
      </div>

      <div className="flex w-full items-center justify-between border-y border-dashed border-grid-soft px-4 py-1 text-muted-foreground">
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
          className="border-r border-dashed border-grid-soft py-1 pr-2 font-mono text-[11px] text-[color:var(--fg-faint)] transition-colors hover:text-foreground"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function GridShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh w-full overflow-hidden px-0 min-[1250px]:px-2 min-[1400px]:px-6 min-[1590px]:px-12">
      <MobileBar />

      {/* The vertical rules would sit flush against the screen edges once the
          rails collapse, so they only exist in the desktop regime. */}
      <div className="h-full border-dashed border-grid px-0 min-[1250px]:border-x min-[1250px]:px-4 min-[1400px]:px-12 min-[1550px]:px-36">
        <div className="flex h-full justify-between border-dashed border-grid min-[1250px]:border-x">
          <aside className="flex h-full w-80 flex-col border-r border-dashed border-grid pt-40 text-sm text-muted-foreground max-[1250px]:hidden">
            <BrandBlock />
            <NavBlock />
            <div className="mt-auto mb-4 w-full">
              <ContactBlock />
            </div>
          </aside>

          <div className="flex h-full flex-1 flex-col items-center overflow-y-auto overscroll-contain scroll-pt-28 scrollbar-hide min-[1250px]:scroll-pt-0">
            <div className="w-full max-w-lg border-dashed border-grid pt-28 min-[1250px]:border-x min-[1250px]:pt-40">
              {children}

              {/* Rails collapse below 1250px: their content moves into the flow. */}
              <div className="flex flex-col pb-[calc(2.5rem+env(safe-area-inset-bottom))] text-sm text-muted-foreground min-[1250px]:hidden">
                <MobileStatusBlock />
                <div className="mt-6">
                  <ContactBlock />
                </div>
                <LegalBlock />
              </div>
            </div>
          </div>

          <aside className="flex h-full w-80 flex-col items-end border-l border-dashed border-grid pt-40 text-sm text-muted-foreground max-[1250px]:hidden">
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
