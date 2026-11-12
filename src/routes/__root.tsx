import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { NotFound } from "@/components/not-found";
import appCss from "../styles.css?url";

const APP_NAME = "Daan Roosenbrand";

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Daan Roosenbrand — saxofonist, klarinettist, docent en dirigent uit Rotterdam. Live solo, bands, directie en lessen.",
      },
      { name: "theme-color", content: "#080706" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
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
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  ),
});
