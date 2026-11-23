import { expect, type Page, test } from '@playwright/test';

/** Expects the app shell: the header, the main content, and the footer, each as a landmark of the page. */
async function expectShell(page: Page) {
    const root = page.locator('dma-root');

    await expect(root.getByRole('banner')).toBeVisible();
    await expect(root.getByRole('main')).toBeVisible();
    await expect(root.getByRole('contentinfo')).toBeVisible();
    await expect(root.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main');
}

/** Expects the hero of the landing page: its heading, and the calls to action that link to GitHub. */
async function expectHero(page: Page) {
    const landing = page.locator('dma-landing-page');

    await expect(landing.getByRole('heading', { level: 1 })).toHaveText(
        'Prepare, play, and remember your 5e campaign in one open-source app',
    );
    await expect(landing.getByRole('link', { name: 'Star Critsource on GitHub' })).toBeVisible();
    await expect(landing.getByRole('link', { name: 'Share an idea in Discussions' })).toBeVisible();
}

/** Expects the features section of the landing page, under the id the header links to: its headings and its link. */
async function expectFeatures(page: Page) {
    const features = page.locator('dma-landing-page section#features');

    await expect(features.getByRole('heading', { level: 2 })).toHaveText(
        'Everything for the game, from prep to the last session',
    );
    await expect(features.getByRole('heading', { level: 3 })).toHaveText(['Prepare', 'Play', 'Remember']);
    await expect(features.getByRole('link', { name: 'See every planned feature in the README' })).toBeVisible();
}

test.describe('app', () => {
    test.describe('without JavaScript', () => {
        test.use({ javaScriptEnabled: false });

        test('shows the prerendered landing page in the app shell', async ({ page }) => {
            await page.goto('/');

            await expect(page).toHaveTitle('Critsource');
            await expectShell(page);
            await expectHero(page);
            await expectFeatures(page);
        });
    });

    test('hydrates the landing page without errors', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', (message) => {
            if (message.type() === 'error' || message.type() === 'warning') {
                errors.push(message.text());
            }
        });
        page.on('pageerror', (error) => errors.push(error.message));

        await page.goto('/');

        // Prerendering marks the root element with ng-server-context and ngh, and hydration removes ngh.
        const root = page.locator('dma-root');
        await expect(root).toHaveAttribute('ng-server-context', 'ssg');
        await expect(root).not.toHaveAttribute('ngh');
        await expectShell(page);
        await expectHero(page);
        await expectFeatures(page);
        expect(errors).toEqual([]);
    });
});
