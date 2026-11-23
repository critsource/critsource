# Web landing page

The landing page of the [web client](../../../apps/web/README.md), which the router of [`core-web`](../../core/web/README.md) loads at `/`. [`angular.json`](angular.json) configures the Angular CLI, and [`eslint.config.ts`](eslint.config.ts) applies the `angular` preset of [`@critsource/config-eslint`](../../config-eslint/README.md), which holds the rules.

## What belongs here

The page at `/` and its sections. Build each section from the components of [`ui-web`](../../ui/web/README.md), and add a component there when another page could use it too. The header and footer around the page belong to the shell in `core-web`.

The page is prerendered during `web:build`, so every component on it follows the rules for prerendered routes in [ADR 0013](../../../docs/adr/0013-prerendered-public-pages.md#decision).

- [`src/landing.routes.ts`](src/landing.routes.ts) holds `landingRoutes`, which renders `LandingPage` at the root of the routes.
- `LandingPage`, in [`src/landing.page.ts`](src/landing.page.ts), is the page. Its hero, the first section, holds the status chip, the heading, the lede, the calls to action, and the hint on how to follow releases.
- `CallsToActionComponent`, in [`src/calls-to-action.component.ts`](src/calls-to-action.component.ts), is the pair of buttons that link to the repository and to the Ideas category of Discussions. The hero places it, and so will the closing call to action, so both keep the same labels and links.
- `FeaturesComponent`, in [`src/features.component.ts`](src/features.component.ts), is the features section that follows the hero: three groups of the tools the app will offer, by when in a game you use them, and a link to every planned feature in the README. Its `id`, `features`, is the target of the Features link of the header.
- `GetInvolvedComponent`, in [`src/get-involved.component.ts`](src/get-involved.component.ts), is the section that follows the features: three cards that link to GitHub to follow the project, share an idea in Discussions, and read the contributing guide and the code of conduct. It has no form, so the page collects no personal data.
- `FaqComponent`, in [`src/faq.component.ts`](src/faq.component.ts), is the FAQ that follows the get-involved section: seven questions, each a Disclosure of `ui-web` that the browser opens and closes, the first two open. Its `id`, `faq`, is the target of the FAQ link of the header.
- `GlowComponent`, in [`src/glow.component.ts`](src/glow.component.ts), is the decorative accent glow behind a section. The section that places it sets where the glow is brightest and how far it reaches.

A component that a route renders as a page takes the `Page` suffix, in its class and its file name, as `LandingPage` does. Every other component takes the `Component` suffix.

## Using the package

Only the router of `core-web` may load the module, through `import()` in [`app.routes.ts`](../../core/web/src/config/app.routes.ts), as the [dependency rules](../../../docs/architecture.md#dependency-rules) require. The module imports nothing of `core-web`: `core-web` declares each module it loads in its `package.json`, so a dependency back on it would form a cycle, which moon refuses.

The `exports` of [`package.json`](package.json) point at the TypeScript sources, and the web client compiles them as part of its own build, as [Architecture](../../../docs/architecture.md#modules-compile-from-source) describes. Each entry point has an `ng-package.json`, which the unit-test builder reads and which an `ng build` with ng-packagr would package as is.

## Entry points

| Import                            | Source                                 | Exports                                                                                                                                                                                   |
|:----------------------------------|:---------------------------------------|:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `@critsource/landing-web`         | [`src/index.ts`](src/index.ts)         | `LandingPage`, `landingRoutes`                                                                                                                                                            |
| `@critsource/landing-web/testing` | [`testing/index.ts`](testing/index.ts) | `CallsToActionHarness`, `FaqHarness`, `FeatureGroupHarness`, `FeatureItemHarness`, `FeaturesHarness`, `GetInvolvedCardHarness`, `GetInvolvedHarness`, `GlowHarness`, `LandingPageHarness` |

The `testing` entry point holds the [component harnesses](https://angular.dev/guide/testing/component-harnesses-overview) for the tests of this package and the packages that build on it, and stays out of the production sources.

## Testing

The tests load the [pointer setup file](../../../docs/testing.md#the-pointer-setup-file) of `ui-web` through the `setupFiles` of the `test` target in [`angular.json`](angular.json), which moves the pointer away before each test, and set each test up with `setupTestEnvironment` from `@critsource/ui-web/testing`, as the tests of `ui-web` do. The page builds on the components of `ui-web`, which import the breakpoint of [`@critsource/design-tokens`](../../design-tokens/README.md), as the styles of the page do, so both packages are in the `dependencies`. The tests load `tokens.css` through the `setupFiles` in [`vitest.config.ts`](vitest.config.ts), as [Design tokens](../../../docs/testing.md#design-tokens) describes, and both test tasks list the files of `ui-web` and `design-tokens` as an input.

## Tasks

[`moon.yml`](moon.yml) defines the tasks below, and the project inherits `lint` from [`.moon/tasks/eslint.yml`](../../../.moon/tasks/eslint.yml). Run each task from the repository root.

| Task        | Command                            | Runs in CI | Cached |
|:------------|:-----------------------------------|:----------:|:------:|
| `test`      | `ng test`                          | no         | no     |
| `test-ci`   | `ng test -c ci`                    | yes        | yes    |
| `typecheck` | `tsc --project tsconfig.node.json` | yes        | yes    |
| `lint`      | `eslint . --max-warnings 0`        | yes        | yes    |

Run the unit tests with [Vitest](https://vitest.dev) in headless Chromium, rerun them when a file changes, and open the Vitest UI:

```bash
pnpm moon run landing-web:test
```

Run the unit tests once, as CI does. On GitHub Actions, the `github-actions` reporter annotates the pull request with each failing test:

```bash
pnpm moon run landing-web:test-ci
```

Both test tasks collect coverage into `coverage/landing-web/` and fail when statements, branches, functions, or lines drop below 80%. The tests run in Chromium through [Playwright](https://playwright.dev), which [Development](../../../docs/development.md#browsers) installs.

Check the types of the config files, which `ng test` leaves out and ESLint and Vitest load without checking. [`tsconfig.node.json`](tsconfig.node.json) extends the `node.json` preset of [`@critsource/config-typescript`](../../config-typescript/README.md):

```bash
pnpm moon run landing-web:typecheck
```

Lint the TypeScript and the templates with the rules of the `angular` preset. The task fails on any finding, warnings included:

```bash
pnpm moon run landing-web:lint
```
