import { Component } from '@angular/core';
import { page } from 'vitest/browser';
import { CallsToActionComponent } from './calls-to-action.component';
import { type CallsToActionButtonBox, CallsToActionHarness } from '@critsource/landing-web/testing';
import { ButtonHarness, readColorToken, setupTestEnvironment } from '@critsource/ui-web/testing';

describe('CallsToActionComponent', () => {
    @Component({
        template: `<dma-calls-to-action />`,
        imports: [CallsToActionComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: CallsToActionHarness });

        return { harness };
    }

    /** The star and idea buttons, in that order. */
    async function getButtons(harness: CallsToActionHarness): Promise<[ButtonHarness, ButtonHarness]> {
        const buttons = await harness.getButtons();

        expect(buttons).toHaveLength(2);
        return buttons as [ButtonHarness, ButtonHarness];
    }

    /** The boxes of the star and idea buttons, in that order. */
    async function getButtonBoxes(
        harness: CallsToActionHarness,
    ): Promise<[CallsToActionButtonBox, CallsToActionButtonBox]> {
        const boxes = await harness.getButtonBoxes();

        expect(boxes).toHaveLength(2);
        return boxes as [CallsToActionButtonBox, CallsToActionButtonBox];
    }

    const { innerWidth, innerHeight } = window;

    afterEach(async () => {
        await page.viewport(innerWidth, innerHeight);
    });

    it('should offer to star the repository first, then to share an idea', async () => {
        const { harness } = await setupTest();

        const buttons = await harness.getButtons();

        expect(await Promise.all(buttons.map((button) => button.getText()))).toEqual([
            'Star D&D Mapp on GitHub',
            'Share an idea in Discussions',
        ]);
    });

    it('should draw the star button as the primary button', async () => {
        const { harness } = await setupTest();

        const [star] = await getButtons(harness);

        expect((await star.getLook()).background).toBe(readColorToken('--color-accent-default'));
    });

    it('should draw the idea button as a secondary button', async () => {
        const { harness } = await setupTest();

        const [, idea] = await getButtons(harness);

        expect(await idea.getLook()).toEqual({
            background: 'rgba(0, 0, 0, 0)',
            borderColor: readColorToken('--color-border-strong'),
            color: readColorToken('--color-foreground-default'),
        });
    });

    it('should link the star button to the repository on GitHub', async () => {
        await setupTest();

        await expect
            .element(page.getByRole('link', { name: 'Star D&D Mapp on GitHub', exact: true }))
            .toHaveAttribute('href', 'https://github.com/critsource/critsource');
    });

    it('should link the idea button to the Ideas category of Discussions', async () => {
        await setupTest();

        await expect
            .element(page.getByRole('link', { name: 'Share an idea in Discussions', exact: true }))
            .toHaveAttribute('href', 'https://github.com/critsource/critsource/discussions/categories/ideas');
    });

    it('should stack the buttons 12 px apart at full width on narrow screens, the primary first', async () => {
        await page.viewport(390, 844);
        const { harness } = await setupTest();

        const [width, [star, idea]] = await Promise.all([harness.getWidth(), getButtonBoxes(harness)]);

        expect(star).toMatchObject({ top: 0, left: 0, width });
        expect(idea).toMatchObject({ left: 0, width });
        expect(idea.top - (star.top + star.height)).toBeCloseTo(12);
    });

    it('should set the buttons side by side 12 px apart on wide screens, the primary first', async () => {
        await page.viewport(1440, 900);
        const { harness } = await setupTest();

        const [star, idea] = await getButtonBoxes(harness);

        expect(star).toMatchObject({ top: 0, left: 0 });
        expect(idea.top).toBe(0);
        expect(idea.left - (star.left + star.width)).toBeCloseTo(12);
    });
});
