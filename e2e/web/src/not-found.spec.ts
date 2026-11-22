import { expect, test } from '@playwright/test';

const title = 'Page not found - Critsource';
const heading = 'This page isn’t on the map';

// nginx marks not-found/ as internal, so a request for the page itself gets the same answer as any unknown path.
const unknownPaths = ['/does-not-exist', '/a/deeper/path', '/not-found', '/not-found/', '/not-found/index.html'];

test.describe('not found', () => {
    for (const path of unknownPaths) {
        test(`answers ${path} with status 404 and the Not found page`, async ({ request }) => {
            const response = await request.get(path);
            const html = await response.text();

            expect(response.status()).toBe(404);
            expect(response.headers()['cache-control']).toBe('no-cache');
            expect(html).toContain(`<title>${title}</title>`);
            expect(html).toContain(heading);
        });
    }

    test('answers a missing file with a plain 404', async ({ request }) => {
        const response = await request.get('/missing.js');

        expect(response.status()).toBe(404);
        expect(await response.text()).not.toContain(heading);
    });

    test.describe('without JavaScript', () => {
        test.use({ javaScriptEnabled: false });

        test('shows the prerendered page and its title', async ({ page }) => {
            const response = await page.goto('/does-not-exist');

            expect(response?.status()).toBe(404);
            await expect(page).toHaveTitle(title);
            await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
        });
    });

    test('hydrates the page without errors, and keeps its address and title', async ({ page }) => {
        const path = '/does-not-exist';
        const errors: string[] = [];
        page.on('console', (message) => {
            // Chromium logs "Failed to load resource" for the 404 of the page itself, which the test expects.
            const isDocument = new URL(message.location().url || 'about:blank').pathname === path;
            if ((message.type() === 'error' || message.type() === 'warning') && !isDocument) {
                errors.push(message.text());
            }
        });
        page.on('pageerror', (error) => errors.push(error.message));

        await page.goto(path);

        // Prerendering marks the root element with ng-server-context and ngh, and hydration removes ngh.
        const root = page.locator('dma-root');
        await expect(root).toHaveAttribute('ng-server-context', 'ssg');
        await expect(root).not.toHaveAttribute('ngh');
        await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Go to the home page' })).toHaveAttribute('href', '/');
        await expect(page).toHaveTitle(title);
        expect(new URL(page.url()).pathname).toBe(path);
        expect(errors).toEqual([]);
    });
});
