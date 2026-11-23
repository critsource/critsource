import { Component } from '@angular/core';
import { page } from 'vitest/browser';
import { FeaturesComponent } from './features.component';
import { FeaturesHarness } from '@critsource/landing-web/testing';
import { setupTestEnvironment } from '@critsource/ui-web/testing';

describe('FeaturesComponent', () => {
    @Component({
        template: `<dma-features />`,
        imports: [FeaturesComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: FeaturesHarness });

        return { harness };
    }

    it('should take the features id, which the header links to', async () => {
        const { harness } = await setupTest();

        expect(await harness.getId()).toBe('features');
    });

    it('should introduce the section with a level 2 heading', async () => {
        const { harness } = await setupTest();

        const intro = await harness.getIntro();

        expect(await intro.getText('eyebrow')).toBe('Features');
        expect(await intro.getText('heading')).toBe('Everything for the game, from prep to the last session');
        await expect.element(page.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('should link to the planned features in the README', async () => {
        const { harness } = await setupTest();

        const link = await harness.getLink();

        expect(await link.getText()).toBe('See every planned feature in the README');
        expect(await link.hasArrow()).toBe(true);
        expect(await harness.getLinkHref()).toBe('https://github.com/critsource/critsource#features');
    });
});
