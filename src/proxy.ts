import { type NextRequest, NextResponse } from "next/server";

import { buildHomepageMarkdown, estimateTokens } from "@/lib/agent-markdown";

function wantsMarkdown(accept: string): boolean {
  if (!accept) return false;
  return accept
    .split(",")
    .some((part) => part.trim().toLowerCase().startsWith("text/markdown"));
}

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/") return NextResponse.next();

  const accept = request.headers.get("accept") ?? "";

  if (wantsMarkdown(accept)) {
    const body = buildHomepageMarkdown();
    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": String(estimateTokens(body)),
        Vary: "Accept",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
      },
    });
  }

  const response = NextResponse.next();
  response.headers.append("Vary", "Accept");
  return response;
}

export const config = {
  matcher: "/",
};
