# 0013. Every public route is prerendered at build time, and nginx serves it as a static file

- **Status:** Accepted
- **Date:** 2026-11-22
- **Built in:** [#202](https://github.com/critsource/critsource/issues/202), [#257](https://github.com/critsource/critsource/issues/257), and [#294](https://github.com/critsource/critsource/issues/294)

## Context

The web client renders in the browser only, so nginx sends an empty `<dma-root>` for every path until the app boots. Readers see a blank first paint, and crawlers that run no JavaScript see no content. The landing page at `/` is what visitors, search engines, and link previews see first, so its content belongs in the HTML that nginx sends.

Four facts shape the choice:

- The landing page is the same for every visitor, and so are the other public pages, such as `/privacy` and `/accessibility`.
- The image serves static files with nginx and runs no Node process, as the [image README](../../.docker/web/README.md) describes.
- The static meta tags from [#204](https://github.com/critsource/critsource/issues/204) already give `/` its link preview, without its content.
- An unknown path returns status 200 with the app shell, so crawlers index each broken link as a page of its own, as [#294](https://github.com/critsource/critsource/issues/294) reports.

The components of `ui-web` were first built without server-safe code, while the landing page was to render in the browser only. This decision reverses that choice.

## Decision

The landing page is the `landing-web` domain module, which the router of `core-web` lazy-loads at `''`. [`@angular/ssr`](https://angular.dev/guide/ssr) prerenders it during `web:build`, with `outputMode: "static"`, and nginx keeps serving static files with no Node process in production. The reasons:

- **The content is in the HTML.** A reader sees the page before the app boots, and a crawler sees it without JavaScript. The app then [hydrates](https://angular.dev/guide/hydration) the prerendered page instead of rendering it again.
- **The image stays as it is.** Prerendering writes HTML files next to the bundles, so the image needs no other process, and the deploys of [ADR 0005](0005-deploys-on-a-workflow-request.md) don't change.
- **The landing page is a feature, not the shell.** [Architecture](../architecture.md#projects) puts each feature in a domain module, so `core-web` stays the shell that the modules build on.

The routes:

- **Every public route is prerendered**, such as `/privacy` and `/accessibility`, so each has a file of its own.
- **nginx answers every other path with status 404** and the prerendered Not found page from [#294](https://github.com/critsource/critsource/issues/294). nginx serves a path only when its file exists, so it needs no list of the routes.
- **Routes that render in the browser only share one prefix**, such as signed-in worlds and maps. The first such route adds the prefix, and nginx falls back to the app shell, `index.csr.html`, for every path under it.

The rules for a component on a prerendered route, since it renders in Node during `web:build`:

- **Browser APIs run only in event handlers or `afterNextRender`**, such as `window`, `localStorage`, and `matchMedia`. Node has none of them, so a component that reads one while it renders fails the build.
- **Components inject `DOCUMENT`** rather than read the global `document`, which Node doesn't have.
- **Layout switches by viewport in CSS only.** The prerendered page is the same for every viewport, so a component that renders another template on a narrow window would mismatch the HTML it hydrates.

[ADR 0008](0008-theme-mapping.md) says the app renders in the browser only. Its decision still holds: the prerendered page is the same for every reader, so no server sees the reader's theme, and the boot script still applies the saved theme before the first paint. This ADR doesn't supersede it.

## Alternatives

- **Rendering in the browser only.** It keeps the build simplest, and the meta tags from [#204](https://github.com/critsource/critsource/issues/204) already give `/` its link preview. But it paints nothing until the app boots, and crawlers without JavaScript see an empty page.
- **Rendering on each request with a Node server**, on its own or inside the NestJS API. The landing page is the same for every visitor, so the server would repeat the same work on each request. Inside the API, rendering would also hold up API requests.
- **A separate static site.** It couldn't use the components of `ui-web`, so the landing page would repeat the design system.
- **The landing page inside `core-web`.** It would save a module, but put a feature in the shell, which [Architecture](../architecture.md#projects) keeps for what the domain modules build on. The page's sections would then grow the shell that every route loads.
- **Listing the routes of the app in `nginx.conf`** to answer unknown paths with 404. The list would have to change with every new route.

## Consequences

- Every component on a prerendered route follows the rules above, `ui-web` included. `ThemeService`, `StorageService`, Mobile menu, and Tab list already do, as the [`ui-web` README](../../packages/ui/web/README.md) describes.
- `web:build` renders every public route in Node, so it takes longer, and lists the sources of each module it prerenders among its inputs.
- A new public route is prerendered by default. A route that renders in the browser only must live under the shared prefix, or nginx answers it with 404.
- Each prerendered file names the hashed bundles of its build, so nginx serves it with `Cache-Control: no-cache`, as it does `index.html`.
- Angular inlines the critical CSS of a prerendered page and loads the full stylesheet through an `onload` handler. Once the app gets a Content Security Policy, it must allow the handler, as it must the boot script.
- No public page can change per visitor, since nginx sends each reader the same file.

## Revisit when

- Public content needs link previews of its own, such as shared worlds and maps. Prerendering covers only routes known at build time, so this calls for rendering on each request, in a server of its own apart from the API.
- The landing page changes per visitor, such as by sign-in state.
