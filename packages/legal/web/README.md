# Web legal pages

The Privacy and Accessibility pages of the [web client](../../../apps/web/README.md), which the router of [`core-web`](../../core/web/README.md) loads at `/privacy` and `/accessibility`. [`angular.json`](angular.json) configures the Angular CLI, and [`eslint.config.ts`](eslint.config.ts) applies the `angular` preset of [`@critsource/config-eslint`](../../config-eslint/README.md), which holds the rules.

## What belongs here

The pages that tell visitors how the site treats them: the privacy statement and the accessibility statement. Build each page from the components of [`ui-web`](../../ui/web/README.md), and add a component there when another page could use it too. The header and footer around the pages belong to the shell in `core-web`.

The pages are prerendered during `web:build`, so every component on them follows the rules for prerendered routes in [ADR 0013](../../../docs/adr/0013-prerendered-public-pages.md#decision). [Privacy](../../../docs/privacy.md) lists where each fact on the Privacy page is enforced, so keep the two in step.

- [`src/legal.routes.ts`](src/legal.routes.ts) holds `legalRoutes`, which renders `PrivacyPage` at `privacy` and `AccessibilityPage` at `accessibility`. Each route sets the `title` of the page, which the router writes into the tab, during prerendering too.
- `PrivacyPage`, in [`src/privacy.page.ts`](src/privacy.page.ts), is the Privacy page.
- `AccessibilityPage`, in [`src/accessibility.page.ts`](src/accessibility.page.ts), is the Accessibility page. Its status, Last checked date, and Known issues hold sample values until the WCAG check ([#303](https://github.com/critsource/critsource/issues/303)) sets them.

A component that a route renders as a page takes the `Page` suffix, in its class and its file name, as `PrivacyPage` does. Every other component takes the `Component` suffix.

## Using the package

Only the router of `core-web` may load the module, through `import()` in [`app.routes.ts`](../../core/web/src/config/app.routes.ts), as the [dependency rules](../../../docs/architecture.md#dependency-rules) require. The module imports nothing of `core-web`: `core-web` declares each module it loads in its `package.json`, so a dependency back on it would form a cycle, which moon refuses.

The `exports` of [`package.json`](package.json) point at the TypeScript sources, and the web client compiles them as part of its own build, as [Architecture](../../../docs/architecture.md#modules-compile-from-source) describes. Each entry point has an `ng-package.json`, which the unit-test builder reads and which an `ng build` with ng-packagr would package as is.

## Entry points

| Import                          | Source                                 | Exports                                           |
|:--------------------------------|:---------------------------------------|:--------------------------------------------------|
| `@critsource/legal-web`         | [`src/index.ts`](src/index.ts)         | `AccessibilityPage`, `PrivacyPage`, `legalRoutes` |
| `@critsource/legal-web/testing` | [`testing/index.ts`](testing/index.ts) | `AccessibilityPageHarness`, `PrivacyPageHarness`  |

The `testing` entry point holds the [component harnesses](https://angular.dev/guide/testing/component-harnesses-overview) for the tests of this package and the packages that build on it, and stays out of the production sources.

## Testing

The tests load the [pointer setup file](../../../docs/testing.md#the-pointer-setup-file) of `ui-web` through the `setupFiles` of the `test` target in [`angular.json`](angular.json), which moves the pointer away before each test, and set each test up with `setupTestEnvironment` from `@critsource/ui-web/testing`, as the tests of `ui-web` do. That entry point loads the components of `ui-web`, which import the breakpoint of [`@critsource/design-tokens`](../../design-tokens/README.md). That is why both test tasks list the files of `ui-web` and `design-tokens` as an input. `design-tokens` sits in the `dependencies`, next to `ui-web`, since the styles of `AccessibilityPage` import the breakpoint too.

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
pnpm moon run legal-web:test
```

Run the unit tests once, as CI does. On GitHub Actions, the `github-actions` reporter annotates the pull request with each failing test:

```bash
pnpm moon run legal-web:test-ci
```

Both test tasks collect coverage into `coverage/legal-web/` and fail when statements, branches, functions, or lines drop below 80%. The tests run in Chromium through [Playwright](https://playwright.dev), which [Development](../../../docs/development.md#browsers) installs.

Check the types of the config files, which `ng test` leaves out and ESLint and Vitest load without checking. [`tsconfig.node.json`](tsconfig.node.json) extends the `node.json` preset of [`@critsource/config-typescript`](../../config-typescript/README.md):

```bash
pnpm moon run legal-web:typecheck
```

Lint the TypeScript and the templates with the rules of the `angular` preset. The task fails on any finding, warnings included:

```bash
pnpm moon run legal-web:lint
```
