import { readFile } from "node:fs/promises";
import path from "node:path";

import { ImageResponse } from "next/og";

import { getAllPosts, getPostBySlug, getPublishedPosts } from "@/lib/blog";
import { siteConfig } from "@/lib/site.config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/* Without this the image would be rendered on demand; with it the build
   prerenders one PNG per post, which is the whole point of a static blog.
   `dynamicParams` seals the list the same way the page does: left open, the
   route answers any slug at request time, which serves a draft's title as a
   card the page itself 404s on, and turns an unbounded set of URLs into
   Satori renders. */
export const dynamicParams = false;

export async function generateStaticParams() {
  const posts =
    process.env.NODE_ENV === "development"
      ? await getAllPosts()
      : await getPublishedPosts();

  return posts.map((post) => ({ slug: post.slug }));
}

const TITLE_MAX_LENGTH = 90;

/* Satori lays out one text box and never clips it, so an over-long title would
   push its own last line past the 630px frame. Cutting at a word boundary
   inside the budget keeps every glyph inside the card. */
function truncateTitle(title: string): string {
  if (title.length <= TITLE_MAX_LENGTH) return title;

  const clipped = title.slice(0, TITLE_MAX_LENGTH - 1);
  const lastSpace = clipped.lastIndexOf(" ");

  return `${(lastSpace > 40 ? clipped.slice(0, lastSpace) : clipped).trimEnd()}…`;
}

/* The site tokens are OKLCH and Satori parses neither those nor `color-mix`,
   so the light ramp is restated here as the sRGB values it resolves to. The
   card is a single static image: it cannot follow the reader's theme. */
const INK = "#171717";
const MUTED = "#525252";
const LINE = "#d4d4d4";
const CANVAS = "#ffffff";

/* The shell's rails, redrawn as solid rules. Satori supports neither CSS Grid
   nor the dashed grid overlay, so the frame is absolute positioning only. */
const RAIL = 64;

/* `generateImageMetadata` is the only way Next lets this export vary per post,
   and using it moves the route to `[__metadata_id__]`, which the build leaves
   dynamic instead of prerendering: verified on 16.2.9. Build-time generation
   wins, so this stays a constant and the per-article alt is declared alongside
   the image in the page's `generateMetadata`. */
export const alt = `A technical note by ${siteConfig.name}`;

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const [serif, sans] = await Promise.all([
    readFile(
      path.join(process.cwd(), "assets/fonts/InstrumentSerif-Regular.ttf"),
    ),
    readFile(path.join(process.cwd(), "assets/fonts/Geist-Regular.ttf")),
  ]);

  const title = truncateTitle(post?.meta.title ?? siteConfig.name);

  return new ImageResponse(
    <div
      style={{
        position: "relative",
        display: "flex",
        width: "100%",
        height: "100%",
        background: CANVAS,
        color: INK,
        fontFamily: "Geist",
      }}
    >
      {/* Left rail */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: RAIL,
          width: 1,
          background: LINE,
        }}
      />
      {/* Right rail */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: RAIL,
          width: 1,
          background: LINE,
        }}
      />
      {/* Header rule */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 96,
          height: 1,
          background: LINE,
        }}
      />
      {/* Footer rule */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 96,
          height: 1,
          background: LINE,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: RAIL + 48,
          top: 40,
          display: "flex",
          fontSize: 22,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: MUTED,
        }}
      >
        {siteConfig.handle}
      </div>

      <div
        style={{
          position: "absolute",
          /* The title box spans the whole space between the two rules and
             centers in it, so a one-line title and a three-line one are both
             balanced instead of one floating and the other crowding a rule. */
          left: RAIL + 48,
          right: RAIL + 48,
          top: 96,
          bottom: 96,
          display: "flex",
          alignItems: "center",
          fontFamily: "Instrument Serif",
          fontSize: 76,
          lineHeight: 1.12,
          letterSpacing: -1,
        }}
      >
        {title}
      </div>

      <div
        style={{
          position: "absolute",
          left: RAIL + 48,
          bottom: 40,
          display: "flex",
          fontSize: 24,
          color: MUTED,
        }}
      >
        {siteConfig.name}
      </div>

      {post && (
        <div
          style={{
            position: "absolute",
            right: RAIL + 48,
            bottom: 40,
            display: "flex",
            fontSize: 24,
            color: MUTED,
          }}
        >
          {post.meta.publishedAt}
        </div>
      )}
    </div>,
    {
      ...size,
      fonts: [
        {
          name: "Instrument Serif",
          data: serif,
          style: "normal",
          weight: 400,
        },
        { name: "Geist", data: sans, style: "normal", weight: 400 },
      ],
    },
  );
}
