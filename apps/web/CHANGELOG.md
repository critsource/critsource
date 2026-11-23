# Changelog

All notable changes to the web app are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- A Privacy page at `/privacy` says which personal data the site processes, why, and for how long, who else sees it, and how to use your rights. The footer links to it.
- An Accessibility page at `/accessibility` says which standard the site aims for, what it does to meet it, the barriers it knows of, and how to report one, by email or on GitHub. The footer links to it.
- A path that no page answers, such as a broken link, now shows a Not found page titled "Page not found - Critsource" and returns status 404 instead of 200, so search engines no longer index broken links as pages. The image answers a missing file, such as a bundle of an older build, with a plain 404, as before.
- The landing page at `/` now says what Critsource is and that there is nothing to try yet, and links to the repository on GitHub to star it and to Discussions to share an idea. It explains how to watch the repository for releases.

### Fixed

- The theme picker in the footer and the menu on narrow screens now shows only its icons when its labels no longer fit, so its options no longer run past its border.

## [0.5.0] - 2026-11-22

### Added

- Every page now has a header with a link home, a GitHub button, and a theme picker, a menu for narrow screens, a skip link to the main content, and a footer with the license and the SRD 5.1 attribution.
- The image sends a `Content-Security-Policy-Report-Only` header with the app's HTML, so browsers report in their console each script or style that neither the app nor Cloudflare's bot check loads, and block nothing. Mount your own copy of `/etc/nginx/csp.inc` to change the policy. A later release enforces it.
- The image sends `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, and `X-Frame-Options` with every response, so browsers don't guess the type of a file, send no referrer to other sites, offer no device features such as the camera to scripts, and let no other site frame the app. An app that you embed in a frame on another site no longer loads there. Mount your own copy of `/etc/nginx/security-headers.inc` to change the headers, and send `Strict-Transport-Security` from the proxy that terminates TLS, since the image serves plain HTTP.

### Changed

- The landing page at `/` now arrives with its content in the HTML, so it shows before the app loads, and search engines and link previews that run no JavaScript see it too.

## [0.4.0] - 2026-11-22

### Changed

- The app is now called Critsource instead of D&D Mapp, and a red d20 replaces the M as its logo, favicon, home screen icon, and link preview. The old addresses on `dndmapp.nl.eu.org` redirect to the same pages on `critsource.com` until February 22, 2027, so update your bookmarks and links before then.

## [0.3.0] - 2026-11-21

### Changed

- **Breaking:** The Docker image is published as `critsource/web` instead of `dndmapp/web`. Pull `critsource/web` in your deployment, since `dndmapp/web` gets no further releases and keeps the tags it has.
- The app now runs at `www.critsource.com`, and the page names that address as its canonical URL and in link previews, instead of `www.dndmapp.nl.eu.org`.

## [0.2.0] - 2026-11-15

### Added

- A description and a preview image for links to the app, and the D&D Mapp logo as its favicon and home screen icon.
- A light theme, which the page shows when the device prefers a light color scheme.
- Smaller headings and spacing on phones and other narrow windows.

### Changed

- The page uses the colors of the D&D Mapp design system: a dark blue-gray background instead of a neutral gray one, and a matching off-white text color.
- The page sets its text in Source Sans 3, the body font of the D&D Mapp design system, instead of the browser's default font. The app serves its fonts itself, so loading them contacts no third party.

## [0.1.0] - 2026-11-10

### Added

- A placeholder page titled D&D Mapp, in a dark theme.
- The `dndmapp/web` Docker image, which serves the app with nginx on port 4200.
- The `BASE_HREF` build argument of the image, which serves the app under a base path, such as `/pr-42/`.
- `build-info.json`, which reports the commit and version of the build that a deployment serves.
- A `/healthz` endpoint and a `HEALTHCHECK` in the image, which report whether the container is healthy.

[unreleased]: https://github.com/critsource/critsource/compare/web@v0.5.0...HEAD
[0.5.0]: https://github.com/critsource/critsource/compare/web@v0.4.0...web@v0.5.0
[0.4.0]: https://github.com/critsource/critsource/compare/web@v0.3.0...web@v0.4.0
[0.3.0]: https://github.com/critsource/critsource/compare/web@v0.2.0...web@v0.3.0
[0.2.0]: https://github.com/critsource/critsource/compare/web@v0.1.0...web@v0.2.0
[0.1.0]: https://github.com/critsource/critsource/releases/tag/web@v0.1.0
