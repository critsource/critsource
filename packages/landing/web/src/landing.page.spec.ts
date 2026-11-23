import { Component } from '@angular/core';
import { page } from 'vitest/browser';
import { LandingPage } from './landing.page';
import { type CallsToActionButtonBox, LandingPageHarness } from '@critsource/landing-web/testing';
import { readColorToken, setupTestEnvironment } from '@critsource/ui-web/testing';

/** The boxes of the star and idea buttons of the calls to action, in that order. */
async function getButtonBoxes(harness: LandingPageHarness): Promise<[CallsToActionButtonBox, CallsToActionButtonBox]> {
    const boxes = await (await harness.getCallsToAction()).getButtonBoxes();

    expect(boxes).toHaveLength(2);
    return boxes as [CallsToActionButtonBox, CallsToActionButtonBox];
}

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

    it('should offer the calls to action', async () => {
        const { harness } = await setupTest();

        const buttons = await (await harness.getCallsToAction()).getButtons();

        expect(await Promise.all(buttons.map((button) => button.getText()))).toEqual([
            'Star Critsource on GitHub',
            'Share an idea in Discussions',
        ]);
    });

    it('should explain how to follow releases under the calls to action', async () => {
        const { harness } = await setupTest();

        expect(await harness.getText('hint')).toBe(
            'Want to hear when it launches? On GitHub, choose Watch, then Custom, then Releases.',
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

        it('should set the hint 20 px under the calls to action', async () => {
            const { harness } = await setupTest();

            expect(await harness.getHintOffset()).toBeCloseTo(20);
        });

        it('should stack the calls to action at full width, the primary first', async () => {
            const { harness } = await setupTest();

            const [width, [star, idea]] = await Promise.all([
                (await harness.getCallsToAction()).getWidth(),
                getButtonBoxes(harness),
            ]);

            expect(star).toMatchObject({ top: 0, width });
            expect(idea.top).toBeGreaterThan(star.top);
            expect(idea.width).toBe(width);
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

        it('should set the hint 24 px under the calls to action', async () => {
            const { harness } = await setupTest();

            expect(await harness.getHintOffset()).toBeCloseTo(24);
        });
    });
});
