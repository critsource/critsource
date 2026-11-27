import { expect, type Page, test } from '@playwright/test';

/** Expects the app shell: the header, the main content, and the footer, each as a landmark of the page. */
async function expectShell(page: Page) {
    const root = page.locator('dma-root');

    await expect(root.getByRole('banner')).toBeVisible();
    await expect(root.getByRole('main')).toBeVisible();
    await expect(root.getByRole('contentinfo')).toBeVisible();
    await expect(root.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main');
}

/**
 * Expects the hero of the landing page: its heading, the calls to action that link to GitHub, and the preview, on its
 * Play tab. Later sections link to the repository too, so the check stays inside the hero.
 */
async function expectHero(page: Page) {
    const hero = page.locator('dma-landing-page section.hero');

    await expect(hero.getByRole('heading', { level: 1 })).toHaveText(
        'Prepare, play, and remember your 5e campaign in one open-source app',
    );
    await expect(hero.getByRole('link', { name: 'Star Critsource on GitHub' })).toBeVisible();
    await expect(hero.getByRole('link', { name: 'Share an idea in Discussions' })).toBeVisible();
    await expect(hero.getByRole('tab')).toHaveText(['Prepare', 'Play', 'Remember']);
    await expect(hero.getByRole('tab', { name: 'Play' })).toHaveAttribute('aria-selected', 'true');
    await expect(hero.getByRole('tabpanel')).toContainText('Initiative');
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

/** Expects the get-involved section of the landing page: its heading, the headings of its cards, and their links. */
async function expectGetInvolved(page: Page) {
    const section = page.locator('dma-get-involved');

    await expect(section.getByRole('heading', { level: 2 })).toHaveText('Help shape Critsource before it launches');
    await expect(section.getByRole('heading', { level: 3 })).toHaveText([
        'Follow the project',
        'Share an idea',
        'Help build it',
    ]);
    await expect(section.getByRole('link')).toHaveText([
        'Star Critsource on GitHub',
        'Open Discussions',
        'Read the contributing guide',
        'Read the code of conduct',
    ]);
}

/** Expects the FAQ of the landing page, under the id the header links to: its heading and its questions. */
async function expectFaq(page: Page) {
    const faq = page.locator('dma-landing-page section#faq');

    await expect(faq.getByRole('heading', { level: 2 })).toHaveText('Questions people ask');
    await expect(faq.locator('summary')).toHaveText([
        'Is it free?',
        'When can I use it?',
        'Which rules does it cover?',
        'Is it official?',
        'Can I bring my homebrew?',
        'Can I run it on my own server?',
        'Who builds it?',
    ]);
}

/**
 * Expects the closing call to action of the landing page: its heading and the calls to action that link to GitHub. The
 * hero links to the same places under the same names, so the check stays inside the band.
 */
async function expectClosingCallToAction(page: Page) {
    const band = page.locator('dma-closing-call-to-action');

    await expect(band.getByRole('heading', { level: 2 })).toHaveText('Be there for the first roll');
    await expect(band.getByRole('link', { name: 'Star Critsource on GitHub' })).toBeVisible();
    await expect(band.getByRole('link', { name: 'Share an idea in Discussions' })).toBeVisible();
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
            await expectGetInvolved(page);
            await expectFaq(page);
            await expectClosingCallToAction(page);
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
        await expectGetInvolved(page);
        await expectFaq(page);
        await expectClosingCallToAction(page);
        expect(errors).toEqual([]);
    });

    test('switches the preview of the hero with a click and with the arrow keys', async ({ page }) => {
        await page.goto('/');

        const preview = page.locator('dma-tabbed-preview');
        const remember = preview.getByRole('tab', { name: 'Remember' });

        await remember.click();
        await expect(remember).toHaveAttribute('aria-selected', 'true');
        await expect(preview.getByRole('tabpanel')).toContainText('Session 12');
        await remember.press('ArrowRight');
        await expect(preview.getByRole('tab', { name: 'Prepare' })).toBeFocused();
        await expect(preview.getByRole('tabpanel')).toContainText('Encounter');
    });

    test('opens and closes a question of the FAQ', async ({ page }) => {
        await page.goto('/');

        const question = page.locator('section#faq details').filter({ hasText: 'Who builds it?' });
        const summary = question.locator('summary');

        await expect(question).not.toHaveAttribute('open');
        await summary.click();
        await expect(question).toHaveAttribute('open');
        await expect(question.getByText('One lead maintainer builds Critsource')).toBeVisible();
        await summary.click();
        await expect(question).not.toHaveAttribute('open');
    });
});
