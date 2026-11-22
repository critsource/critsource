import { expect, test } from '@playwright/test';

test.describe('app', () => {
    test.describe('without JavaScript', () => {
        test.use({ javaScriptEnabled: false });

        test('shows the prerendered landing page', async ({ page }) => {
            await page.goto('/');

            await expect(page).toHaveTitle('Critsource');
            await expect(page.locator('dma-root')).toHaveText('root works!');
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
        expect(errors).toEqual([]);
    });

    test('boots the app shell on any other path', async ({ page }) => {
        const response = await page.goto('/any/other/path');

        await expect(page).toHaveTitle('Critsource');
        // The app shell holds an empty root element, so the content comes from the app once it boots.
        expect(await response?.text()).toMatch(/<dma-root [^>]*><\/dma-root>/);
        await expect(page.locator('dma-root')).toHaveText('root works!');
    });
});
