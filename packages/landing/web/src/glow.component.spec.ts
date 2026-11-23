import { Component } from '@angular/core';
import { GlowComponent } from './glow.component';
import { GlowHarness } from '@critsource/landing-web/testing';
import { setupTestEnvironment } from '@critsource/ui-web/testing';

describe('GlowComponent', () => {
    @Component({
        template: `
            <div style="position: relative; isolation: isolate; width: 600px; height: 300px">
                <dma-glow />
                <p>The content of the section.</p>
            </div>
        `,
        imports: [GlowComponent],
    })
    class TestComponent {}

    async function setupTest() {
        const { harness } = await setupTestEnvironment({ host: TestComponent, harness: GlowHarness });

        return { harness };
    }

    it('should hide from assistive technology', async () => {
        const { harness } = await setupTest();

        expect(await harness.getAriaHidden()).toBe('true');
    });

    it('should fill its container', async () => {
        const { harness } = await setupTest();

        expect(await harness.getSize()).toEqual({ width: 600, height: 300 });
    });

    it('should sit under the content of its container', async () => {
        const { harness } = await setupTest();

        expect((await harness.getLook()).zIndex).toBe('-1');
    });

    it('should draw at the glow opacity of the theme', async () => {
        const { harness } = await setupTest();

        expect((await harness.getLook()).opacity).toBe(
            getComputedStyle(document.documentElement).getPropertyValue('--opacity-glow').trim(),
        );
    });
});
