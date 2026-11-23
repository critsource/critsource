import { expect, type Locator, test } from '@playwright/test';

/**
 * The page margin of each Viewport theme, `space.page-inline`, at the widths around its breakpoints: Mobile below
 * 600 px, Tablet from 600 px, and Desktop from 1024 px.
 */
const margins = [
    { width: 390, margin: 20 },
    { width: 600, margin: 48 },
    { width: 768, margin: 48 },
    { width: 1023, margin: 48 },
    { width: 1024, margin: 120 },
    { width: 1440, margin: 120 },
] as const;

/**
 * Reads the left edge of an element in the viewport.
 * @param locator - The element to measure.
 * @returns The distance in px from the left of the viewport, or `undefined` when the element is not rendered.
 */
async function leftEdge(locator: Locator) {
    return (await locator.boundingBox())?.x;
}

test.describe('layout', () => {
    for (const { width, margin } of margins) {
        test(`lines the header, the hero, and the footer up on the page margin at ${String(width)} px`, async ({
            page,
        }) => {
            await page.setViewportSize({ width, height: 900 });
            await page.goto('/');

            const home = page.locator('header[dma-header] a[href="/"]');
            const hero = page.locator('dma-landing-page section.hero .text');
            const brand = page.locator('footer[dma-footer] .brand');

            await expect(home).toBeVisible();
            expect(await leftEdge(home)).toBe(margin);
            expect(await leftEdge(hero)).toBe(margin);
            expect(await leftEdge(brand)).toBe(margin);
        });
    }
});
