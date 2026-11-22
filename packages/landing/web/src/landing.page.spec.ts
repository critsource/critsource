import { Component } from '@angular/core';
import { LandingPage } from './landing.page';
import { LandingPageHarness } from '@critsource/landing-web/testing';
import { setupTestEnvironment } from '@critsource/ui-web/testing';

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

    it('should render the placeholder', async () => {
        const { harness } = await setupTest();

        expect(await harness.paragraphContents()).toEqual('landing works!');
    });
});
