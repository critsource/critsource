# Critsource web

The web client of [Critsource](https://github.com/critsource/critsource). The landing page and the Privacy and Accessibility pages are prerendered at build time and every other page renders in the browser, so the image serves static files with [nginx](https://nginx.org) and needs no other service. Each tag holds an image for `linux/amd64` and `linux/arm64`.

## Tags

| Tag               | Image                                                                                 |
|:------------------|:--------------------------------------------------------------------------------------|
| `latest`          | The newest release, or an earlier one while a broken release is rolled back.          |
| `<version>`       | A release, such as `0.1.0`.                                                           |
| `<major>.<minor>` | The newest release of a minor version, such as `0.1`.                                 |
| `<major>`         | The newest release of a major version, such as `1`. Releases add it from `1.0.0` on.  |
| `edge`            | The latest commit of `main` that changed the image. It may break at any time.         |
| `sha-<short>`     | A commit of `main` that changed the image, such as `sha-41b5eb9`.                     |
| `pr-<number>`     | A pull request, for review only. The tag is deleted once the pull request closes.     |

Run `latest` or a version tag for a release. The [GitHub Releases](https://github.com/critsource/critsource/releases) list what each version changes.

## Running

Run the newest release, and open the app at <http://localhost:4200>:

```bash
docker run --rm -p 4200:4200 critsource/web
```

The container serves the app on port 4200, under the path `/`. It answers `/` with the prerendered landing page, `index.html`, `/privacy` with the prerendered Privacy page, `privacy/index.html`, and `/accessibility` with the prerendered Accessibility page, `accessibility/index.html`. Every other path without a file extension gets the app shell, `index.csr.html`, so the router of the app handles it. A missing file with an extension, such as a bundle of an older release, gets `404`. nginx serves every HTML file with `Cache-Control: no-cache`, so browsers check for a new release on every visit.

The container runs nginx as the unprivileged `nginx` user (UID 101), needs no added capabilities, writes to `/tmp` only, and runs under any other UID too. Harden it by dropping every capability and making the root file system read-only, with a tmpfs at `/tmp`:

```bash
docker run --rm -p 4200:4200 --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges critsource/web
```

To run it with Docker Compose, hardened the same way, save this as `compose.yaml` and run `docker compose up -d`:

```yaml
services:
    web:
        image: critsource/web
        ports:
            - "4200:4200"
        read_only: true
        tmpfs:
            - /tmp
        cap_drop:
            - ALL
        security_opt:
            - no-new-privileges:true
        restart: unless-stopped
```

## Security headers

nginx sends these headers with every response, a `404` and `/healthz` included:

| Header                   | Value                                                                                                                               |
|:-------------------------|:------------------------------------------------------------------------------------------------------------------------------------|
| `X-Content-Type-Options` | `nosniff`                                                                                                                           |
| `Referrer-Policy`        | `same-origin`                                                                                                                       |
| `Permissions-Policy`     | `accelerometer=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()` |
| `X-Frame-Options`        | `DENY`                                                                                                                              |

The container serves plain HTTP, and browsers ignore `Strict-Transport-Security` over plain HTTP, so the image leaves HSTS out. Send it from the proxy that terminates TLS in front of the container, for example `Strict-Transport-Security: max-age=2592000; includeSubDomains`.

To change the headers, mount your own copy of [`security-headers.inc`](https://github.com/critsource/critsource/blob/main/.docker/web/security-headers.inc) over `/etc/nginx/security-headers.inc`. Keep `always` on each `add_header`, or error responses lose the header:

```bash
docker run --rm -p 4200:4200 -v ./security-headers.inc:/etc/nginx/security-headers.inc:ro critsource/web
```

## Content Security Policy

nginx sends a `Content-Security-Policy-Report-Only` header with each prerendered page and with `index.csr.html`. The browser reports each script or style that neither the app nor Cloudflare's bot check loads in its console, and blocks nothing:

```text
default-src 'self'; script-src 'self' 'nonce-<nonce>'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'
```

The nonce is the request ID of nginx, 32 random hex characters that are new for each response. The HTML holds `@CSP_NONCE@` where the nonce belongs, on the root element of the app and on its inline scripts and styles, and nginx writes the nonce of the header in its place. Cloudflare reads the nonce from the header to allow its bot check, which is why it cannot sit in a `<meta>` tag. The policy leaves out `'strict-dynamic'`, since the bot check loads from this origin, and allows inline styles, since Cloudflare adds a hidden link with a `style` attribute. nginx drops the `ETag` and `Last-Modified` of every HTML file, so browsers fetch them in full on each visit.

To change the policy, mount your own copy of [`csp.inc`](https://github.com/critsource/critsource/blob/main/.docker/web/csp.inc) over `/etc/nginx/csp.inc`. Keep its two `sub_filter` lines, or the inline scripts lose their nonce:

```bash
docker run --rm -p 4200:4200 -v ./csp.inc:/etc/nginx/csp.inc:ro critsource/web
```

## Health check

The container answers `/healthz` with an empty `200`, and leaves the request out of its access log. The `HEALTHCHECK` of the image probes that path, so `docker ps` shows whether the container is `healthy`. Kubernetes ignores `HEALTHCHECK`, so point the probes of a deployment at `/healthz` on port 4200.

## Build info

`/build-info.json` reports the commit and version that the image was built from, so a deploy can check which build it runs. The version is the release for a version tag, or the tag that the image was built for otherwise, such as `edge` or `pr-42`:

```json
{ "commit": "41b5eb94707ddc4503d76c190d1cc980973f7218", "version": "0.1.0" }
```

nginx serves the file with `Cache-Control: no-store`, so neither browsers nor proxies keep an outdated copy.

## Source

The image is built from [`.docker/web/Dockerfile`](https://github.com/critsource/critsource/blob/main/.docker/web/Dockerfile), and [`.docker/web/nginx.conf`](https://github.com/critsource/critsource/blob/main/.docker/web/nginx.conf) [`.docker/web/security-headers.inc`](https://github.com/critsource/critsource/blob/main/.docker/web/security-headers.inc), and [`.docker/web/csp.inc`](https://github.com/critsource/critsource/blob/main/.docker/web/csp.inc) configure nginx. The [README of the web app](https://github.com/critsource/critsource/blob/main/apps/web/README.md) explains how to build the image yourself, for example under another base path. Report problems in the [issues](https://github.com/critsource/critsource/issues) of the repository. The image is licensed under the [MIT License](https://github.com/critsource/critsource/blob/main/LICENSE).
