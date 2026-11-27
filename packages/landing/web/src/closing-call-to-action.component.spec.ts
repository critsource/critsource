import { Component } from '@angular/core';
import { page } from 'vitest/browser';
import { ClosingCallToActionComponent } from './closing-call-to-action.component';
import { type CallsToActionButtonBox, ClosingCallToActionHarness } from '@critsource/landing-web/testing';
import { readColorToken, setupTestEnvironment } from '@critsource/ui-web/testing';

/** The boxes of the star and idea buttons of the calls to action, in that order. */
async function getButtonBoxes(
    harness: ClosingCallToActionHarness,
): Promise<[CallsToActionButtonBox, CallsToActionButtonBox]> {
    const boxes = await (await harness.getCallsToAction()).getButtonBoxes();

    expect(boxes).toHaveLength(2);
    return boxes as [CallsToActionButtonBox, CallsToActionButtonBox];
}

describe('ClosingCallToActionComponent', () => {
    @Component({
        template: `<dma-closing-call-to-action />`,
        imports: [ClosingCallToActionComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: ClosingCallToActionHarness });

        return { harness };
    }

    const { innerWidth, innerHeight } = window;

    afterEach(async () => {
        await page.viewport(innerWidth, innerHeight);
    });

    it('should invite the visitor with a level 2 heading', async () => {
        const { harness } = await setupTest();

        expect(await harness.getHeading()).toEqual({ text: 'Be there for the first roll', level: 2 });
    });

    it('should say how to follow along under the heading', async () => {
        const { harness } = await setupTest();

        expect(await harness.getLine()).toBe('Star the repository to follow along, or tell us what your table needs.');
    });

    it('should draw the heading in the default color and the line in the muted one', async () => {
        const { harness } = await setupTest();

        expect((await harness.getTextLook('heading')).color).toBe(readColorToken('--color-foreground-default'));
        expect((await harness.getTextLook('line')).color).toBe(readColorToken('--color-foreground-muted'));
    });

    it('should offer the calls to action of the hero', async () => {
        const { harness } = await setupTest();

        const buttons = await (await harness.getCallsToAction()).getButtons();

        expect(await Promise.all(buttons.map((button) => button.getText()))).toEqual([
            'Star Critsource on GitHub',
            'Share an idea in Discussions',
        ]);
    });

    it('should link the star button to the repository on GitHub', async () => {
        await setupTest();

        await expect
            .element(page.getByRole('link', { name: 'Star Critsource on GitHub', exact: true }))
            .toHaveAttribute('href', 'https://github.com/critsource/critsource');
    });

    it('should link the idea button to the Ideas category of Discussions', async () => {
        await setupTest();

        await expect
            .element(page.getByRole('link', { name: 'Share an idea in Discussions', exact: true }))
            .toHaveAttribute('href', 'https://github.com/critsource/critsource/discussions/categories/ideas');
    });

    it('should draw the glow over the whole band, hidden from assistive technology', async () => {
        const { harness } = await setupTest();

        const [glow, { band }] = await Promise.all([harness.getGlow(), harness.getBoxes()]);

        expect(await glow.getAriaHidden()).toBe('true');
        expect(await glow.getSize()).toEqual({ width: band.width, height: band.height });
    });

    it('should brighten the glow at the middle of the bottom edge and fade it out over the whole band', async () => {
        const { harness } = await setupTest();

        expect((await (await harness.getGlow()).getLook()).backgroundImage).toContain('100% 100% at 50% 100%');
    });

    describe.each([
        { screens: 'narrow', width: 390, height: 844, headingSize: '30px', lineSize: '17px', gap: 20 },
        { screens: 'wide', width: 1440, height: 900, headingSize: '44px', lineSize: '18px', gap: 24 },
    ])('on $screens screens', ({ width, height, headingSize, lineSize, gap }) => {
        beforeEach(async () => {
            await page.viewport(width, height);
        });

        it(`should set the heading at ${headingSize} and the line at ${lineSize}, both centered`, async () => {
            const { harness } = await setupTest();

            const [heading, line] = await Promise.all([harness.getTextLook('heading'), harness.getTextLook('line')]);

            expect(heading).toMatchObject({ fontSize: headingSize, textAlign: 'center' });
            expect(line).toMatchObject({ fontSize: lineSize, textAlign: 'center' });
        });

        it(`should center the heading, the line, and the calls to action in the band, ${String(gap)} px apart`, async () => {
            const { harness } = await setupTest();

            const { band, heading, line, callsToAction } = await harness.getBoxes();
            const center = band.left + band.width / 2;

            for (const box of [heading, line, callsToAction]) {
                expect(box.left + box.width / 2).toBeCloseTo(center, 0);
            }
            expect(line.top - (heading.top + heading.height)).toBeCloseTo(gap);
            expect(callsToAction.top - (line.top + line.height)).toBeCloseTo(gap);
        });
    });

    it('should fill the column with the heading, the line, and the calls to action on narrow screens', async () => {
        await page.viewport(390, 844);
        const { harness } = await setupTest();

        const { band, heading, line, callsToAction } = await harness.getBoxes();

        for (const box of [heading, line, callsToAction]) {
            expect(box).toMatchObject({ left: band.left + 20, width: band.width - 2 * 20 });
        }
    });

    it('should stack the calls to action at full width on narrow screens, the primary first', async () => {
        await page.viewport(390, 844);
        const { harness } = await setupTest();

        const [{ callsToAction }, [star, idea]] = await Promise.all([harness.getBoxes(), getButtonBoxes(harness)]);

        expect(star).toMatchObject({ top: 0, width: callsToAction.width });
        expect(idea.top).toBeGreaterThan(star.top);
        expect(idea.width).toBe(callsToAction.width);
    });

    it('should set the calls to action side by side on wide screens, the primary first', async () => {
        await page.viewport(1440, 900);
        const { harness } = await setupTest();

        const [{ callsToAction }, [star, idea]] = await Promise.all([harness.getBoxes(), getButtonBoxes(harness)]);

        expect(idea.top).toBe(star.top);
        expect(idea.left).toBeGreaterThan(star.left + star.width);
        expect(callsToAction.width).toBeCloseTo(idea.left + idea.width, 0);
    });
});
