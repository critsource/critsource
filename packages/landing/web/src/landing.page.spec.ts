import { Component } from '@angular/core';
import { page } from 'vitest/browser';
import { LandingPage } from './landing.page';
import { LandingPageHarness } from '@critsource/landing-web/testing';
import { readColorToken, setupTestEnvironment } from '@critsource/ui-web/testing';

describe('LandingPage', () => {
    @Component({
        template: `<dma-landing-page />`,
        imports: [LandingPage],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: LandingPageHarness });

        return { harness };
    }

    const { innerWidth, innerHeight } = window;

    afterEach(async () => {
        await page.viewport(innerWidth, innerHeight);
    });

    it('should say that there is nothing to try yet in a status chip', async () => {
        const { harness } = await setupTest();

        const chip = await harness.getChip();

        expect(await chip.getText()).toBe('In early development: nothing to try yet');
        expect((await chip.getLook()).borderColor).toBe(readColorToken('--color-border-control'));
    });

    it('should have one level 1 heading that says what Critsource is', async () => {
        const { harness } = await setupTest();

        expect(await harness.countHeadings()).toBe(1);
        expect(await harness.getText('heading')).toBe(
            'Prepare, play, and remember your 5e campaign in one open-source app',
        );
    });

    it('should list what the app holds in the lede', async () => {
        const { harness } = await setupTest();

        expect(await harness.getText('lede')).toBe(
            'Compendium, dice, characters, worlds, maps, session notes, and a virtual tabletop, for players and DMs.',
        );
    });

    describe('on narrow screens', () => {
        beforeEach(async () => {
            await page.viewport(390, 844);
        });

        it('should set the heading at 34 px', async () => {
            const { harness } = await setupTest();

            expect((await harness.getTextLook('heading')).fontSize).toBe('34px');
        });
    });

    describe('on wide screens', () => {
        beforeEach(async () => {
            await page.viewport(1440, 900);
        });

        it('should set the heading at 54 px', async () => {
            const { harness } = await setupTest();

            expect((await harness.getTextLook('heading')).fontSize).toBe('54px');
        });
    });
});
