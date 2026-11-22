import { expect, test, type Page } from '@playwright/test';

const paths = [
    { path: '/', page: 'the prerendered landing page' },
    { path: '/any/other/path', page: 'the app shell' },
];

/**
 * Loads the path, and returns every violation of the content security policy that the page reports. The policy only
 * reports, so the page still runs. The listener must sit in place before the first script of the page runs, since a
 * violation fires as soon as the browser meets the blocked resource.
 */
async function violationsOn(page: Page, path: string): Promise<string[]> {
    const violations: string[] = [];
    await page.exposeFunction('reportViolation', (violation: string) => {
        violations.push(violation);
    });
    await page.addInitScript(
        // A string, since the type-check of the tests has no DOM library for the event.
        `document.addEventListener('securitypolicyviolation', (event) => {
            reportViolation(event.effectiveDirective + ' blocked ' + (event.blockedURI || 'inline'));
        });`,
    );

    await page.goto(path);

    // The app has booted once the prerendered page hydrates, or the app shell fills its root element.
    const root = page.locator('dma-root');
    await expect(root.getByRole('banner')).toBeVisible();
    await expect(root).not.toHaveAttribute('ngh');
    return violations;
}

test.describe('content security policy', () => {
    test.describe('without a saved theme', () => {
        for (const { path, page: name } of paths) {
            test(`reports no violation on ${name}`, async ({ page }) => {
                expect(await violationsOn(page, path)).toEqual([]);
            });
        }
    });

    test.describe('with a saved theme', () => {
        test.beforeEach(async ({ page }) => {
            await page.addInitScript(() => {
                localStorage.setItem('dma-theme', 'light');
            });
        });

        for (const { path, page: name } of paths) {
            test(`reports no violation on ${name}`, async ({ page }) => {
                expect(await violationsOn(page, path)).toEqual([]);
            });
        }
    });

    for (const { path, page: name } of paths) {
        test(`writes the nonce of the header into ${name}`, async ({ request }) => {
            const response = await request.get(path);

            const policy = response.headers()['content-security-policy-report-only'] ?? '';
            const nonce = /script-src 'self' 'nonce-([0-9a-f]{32})';/.exec(policy)?.[1] ?? '';
            expect(nonce).toMatch(/^[0-9a-f]{32}$/);
            const html = await response.text();
            expect(html).toContain(`<dma-root ngcspnonce="${nonce}"`);
            expect(html).toContain(`<script nonce="${nonce}">`);
            expect(html).not.toContain('@CSP_NONCE@');
        });
    }

    test('sends a new nonce with each response', async ({ request }) => {
        const policies = new Set<string>();

        for (let attempt = 0; attempt < 3; attempt++) {
            const response = await request.get('/');
            policies.add(response.headers()['content-security-policy-report-only'] ?? '');
        }

        expect(policies.size).toBe(3);
    });
});
