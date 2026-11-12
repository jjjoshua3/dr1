import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { NotFound } from "@/components/not-found";
import { jsonLd, OG_IMAGE, PAGE_DESCRIPTION, PAGE_TITLE, SITE_URL } from "@/seo";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { name: "author", content: "Daan Roosenbrand" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#080706" },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: PAGE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "nl_NL" },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: "Daan Roosenbrand" },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:alt", content: "Daan Roosenbrand speelt Baker Street live op saxofoon" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: PAGE_DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "preconnect", href: "https://img.youtube.com" },
      { rel: "preconnect", href: "https://www.youtube-nocookie.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:ital,wght@0,400;0,500;1,400&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;1,400&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: () => (
    <html lang="nl">
      <head>
        <HeadContent />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script src="https://unpkg.com/lenis@1.1.13/dist/lenis.min.js" defer />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  ),
});