import { expect, type Locator, type Page, test } from '@playwright/test';

/** A legal page, and a part of its content that only that page holds. */
interface LegalPage {
    name: string;
    path: string;
    host: string;
    content: (article: Locator) => Locator;
}

const legalPages: LegalPage[] = [
    {
        name: 'Privacy',
        path: '/privacy',
        host: 'dma-privacy-page',
        content: (article) => article.getByRole('table', { name: 'Data we process' }),
    },
    {
        name: 'Accessibility',
        path: '/accessibility',
        host: 'dma-accessibility-page',
        content: (article) => article.getByRole('region', { name: 'At a glance' }).getByRole('definition').first(),
    },
];

/** Expects the legal page: its title, its heading, the date it was last updated, and the content only it holds. */
async function expectLegalPage(page: Page, { name, host, content }: LegalPage) {
    const article = page.locator(`${host} article`);

    await expect(page).toHaveTitle(`${name} - Critsource`);
    await expect(article.getByRole('heading', { level: 1 })).toHaveText(name);
    await expect(article.locator('header time')).toHaveAttribute('datetime', /^\d{4}-\d{2}-\d{2}$/);
    await expect(content(article)).toBeVisible();
}

for (const legalPage of legalPages) {
    const { name, path } = legalPage;

    test.describe(`${name} page`, () => {
        test.describe('without JavaScript', () => {
            test.use({ javaScriptEnabled: false });

            test('shows the prerendered statement', async ({ page }) => {
                await page.goto(path);

                await expectLegalPage(page, legalPage);
                // Hydration removes the ngh attribute that prerendering adds to the root element, so the app never
                // booted.
                await expect(page.locator('dma-root')).toHaveAttribute('ngh');
            });
        });

        test('serves the statement at its path, with no redirect', async ({ request }) => {
            const response = await request.get(path, { maxRedirects: 0 });

            expect(response.status()).toBe(200);
            expect(await response.text()).toContain(`<title>${name} - Critsource</title>`);
        });

        test('hydrates the statement without errors', async ({ page }) => {
            const errors: string[] = [];
            page.on('console', (message) => {
                if (message.type() === 'error' || message.type() === 'warning') {
                    errors.push(message.text());
                }
            });
            page.on('pageerror', (error) => errors.push(error.message));

            await page.goto(path);

            // Prerendering marks the root element with ng-server-context and ngh, and hydration removes ngh.
            const root = page.locator('dma-root');
            await expect(root).toHaveAttribute('ng-server-context', 'ssg');
            await expect(root).not.toHaveAttribute('ngh');
            await expectLegalPage(page, legalPage);
            expect(errors).toEqual([]);
        });

        test(`marks the ${name} link of the footer as the current page`, async ({ page }) => {
            await page.goto('/');
            const link = page.getByRole('contentinfo').getByRole('link', { name, exact: true });
            await expect(link).not.toHaveAttribute('aria-current');

            await link.click();

            await expect(page).toHaveURL(path);
            await expectLegalPage(page, legalPage);
            await expect(link).toHaveAttribute('aria-current', 'page');
        });

        test('restores the title of the app on the way back home', async ({ page }) => {
            await page.goto(path);

            await page.getByRole('banner').getByRole('link', { name: 'Critsource', exact: true }).click();

            await expect(page).toHaveURL('/');
            await expect(page).toHaveTitle('Critsource');
        });
    });
}
