import { expect, type Page, test } from '@playwright/test';

/** Expects the Privacy page: its title, its heading, the date it was last updated, and its table of data. */
async function expectPrivacyPage(page: Page) {
    const article = page.locator('dma-privacy-page article');

    await expect(page).toHaveTitle('Privacy - Critsource');
    await expect(article.getByRole('heading', { level: 1 })).toHaveText('Privacy');
    await expect(article.locator('header time')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
    await expect(article.getByRole('table', { name: 'Data we process' })).toBeVisible();
}

test.describe('privacy page', () => {
    test.describe('without JavaScript', () => {
        test.use({ javaScriptEnabled: false });

        test('shows the prerendered privacy statement', async ({ page }) => {
            await page.goto('/privacy');

            await expectPrivacyPage(page);
            // Hydration removes the ngh attribute that prerendering adds to the root element, so the app never booted.
            await expect(page.locator('dma-root')).toHaveAttribute('ngh');
        });
    });

    test('serves the privacy statement at its path, with no redirect', async ({ request }) => {
        const response = await request.get('/privacy', { maxRedirects: 0 });

        expect(response.status()).toBe(200);
        expect(await response.text()).toContain('<title>Privacy - Critsource</title>');
    });

    test('hydrates the privacy statement without errors', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', (message) => {
            if (message.type() === 'error' || message.type() === 'warning') {
                errors.push(message.text());
            }
        });
        page.on('pageerror', (error) => errors.push(error.message));

        await page.goto('/privacy');

        // Prerendering marks the root element with ng-server-context and ngh, and hydration removes ngh.
        const root = page.locator('dma-root');
        await expect(root).toHaveAttribute('ng-server-context', 'ssg');
        await expect(root).not.toHaveAttribute('ngh');
        await expectPrivacyPage(page);
        expect(errors).toEqual([]);
    });

    test('marks the Privacy link of the footer as the current page', async ({ page }) => {
        await page.goto('/');
        const link = page.getByRole('contentinfo').getByRole('link', { name: 'Privacy', exact: true });
        await expect(link).not.toHaveAttribute('aria-current');

        await link.click();

        await expect(page).toHaveURL('/privacy');
        await expectPrivacyPage(page);
        await expect(link).toHaveAttribute('aria-current', 'page');
    });

    test('restores the title of the app on the way back home', async ({ page }) => {
        await page.goto('/privacy');

        await page.getByRole('banner').getByRole('link', { name: 'Critsource', exact: true }).click();

        await expect(page).toHaveURL('/');
        await expect(page).toHaveTitle('Critsource');
    });
});
